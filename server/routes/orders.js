import express from 'express'
import { pool } from '../config/database.js'

const router = express.Router()

// GET /api/orders - 주문 목록 조회
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    
    let query = 'SELECT id, order_date, status, total_amount, items FROM orders'
    const params = []
    
    if (status) {
      query += ' WHERE status = $1'
      params.push(status)
    }
    
    query += ' ORDER BY order_date DESC'
    
    const result = await pool.query(query, params)
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        orderDate: row.order_date,
        status: row.status,
        totalAmount: row.total_amount,
        items: row.items
      }))
    })
  } catch (error) {
    console.error('주문 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 목록을 불러올 수 없습니다.'
    })
  }
})

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: '잘못된 주문 ID입니다.'
      })
    }
    
    const query = 'SELECT id, order_date, status, total_amount, items FROM orders WHERE id = $1'
    const result = await pool.query(query, [orderId])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      })
    }
    
    const row = result.rows[0]
    res.json({
      success: true,
      data: {
        id: row.id,
        orderDate: row.order_date,
        status: row.status,
        totalAmount: row.total_amount,
        items: row.items
      }
    })
  } catch (error) {
    console.error('주문 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 정보를 불러올 수 없습니다.'
    })
  }
})

// POST /api/orders - 주문 생성
router.post('/', async (req, res) => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { items, totalAmount } = req.body
    
    // 입력 유효성 검사
    if (!items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        success: false,
        error: '주문 항목이 필요합니다.'
      })
    }
    
    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        success: false,
        error: '총 금액이 올바르지 않습니다.'
      })
    }
    
    // 재고 확인 및 차감
    for (const item of items) {
      const stockQuery = 'SELECT stock FROM menus WHERE id = $1'
      const stockResult = await client.query(stockQuery, [item.menuId])
      
      if (stockResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return res.status(404).json({
          success: false,
          error: `메뉴 ID ${item.menuId}를 찾을 수 없습니다.`
        })
      }
      
      const currentStock = stockResult.rows[0].stock
      const requiredStock = item.quantity || 1
      
      if (currentStock < requiredStock) {
        await client.query('ROLLBACK')
        return res.status(400).json({
          success: false,
          error: `메뉴 "${item.menuName}"의 재고가 부족합니다. (현재: ${currentStock}개, 필요: ${requiredStock}개)`
        })
      }
      
      // 재고 차감
      const updateStockQuery = 'UPDATE menus SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2'
      await client.query(updateStockQuery, [requiredStock, item.menuId])
    }
    
    // 주문 저장
    const insertOrderQuery = `
      INSERT INTO orders (order_date, status, total_amount, items)
      VALUES (CURRENT_TIMESTAMP, 'received', $1, $2)
      RETURNING id, order_date, status, total_amount
    `
    const orderResult = await client.query(insertOrderQuery, [totalAmount, JSON.stringify(items)])
    
    await client.query('COMMIT')
    
    const order = orderResult.rows[0]
    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: order.total_amount
      }
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('주문 생성 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 처리 중 오류가 발생했습니다.'
    })
  } finally {
    client.release()
  }
})

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const { status } = req.body
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: '잘못된 주문 ID입니다.'
      })
    }
    
    // 상태 유효성 검사
    const validStatuses = ['received', 'manufacturing', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `유효하지 않은 상태입니다. 가능한 값: ${validStatuses.join(', ')}`
      })
    }
    
    // 현재 주문 상태 확인
    const currentOrderQuery = 'SELECT status FROM orders WHERE id = $1'
    const currentResult = await pool.query(currentOrderQuery, [orderId])
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      })
    }
    
    const currentStatus = currentResult.rows[0].status
    
    // 상태 변경 규칙 검증
    if (currentStatus === 'received' && status !== 'manufacturing') {
      return res.status(400).json({
        success: false,
        error: '주문 접수 상태에서는 "제조 중" 상태로만 변경할 수 있습니다.'
      })
    }
    
    if (currentStatus === 'manufacturing' && status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: '제조 중 상태에서는 "제조 완료" 상태로만 변경할 수 있습니다.'
      })
    }
    
    if (currentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        error: '이미 완료된 주문입니다.'
      })
    }
    
    // 상태 업데이트
    const updateQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status'
    const updateResult = await pool.query(updateQuery, [status, orderId])
    
    res.json({
      success: true,
      data: {
        id: updateResult.rows[0].id,
        status: updateResult.rows[0].status
      }
    })
  } catch (error) {
    console.error('주문 상태 변경 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 상태를 변경할 수 없습니다.'
    })
  }
})

export default router
