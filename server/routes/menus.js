import express from 'express'
import { pool } from '../config/database.js'

const router = express.Router()

// GET /api/menus - 메뉴 목록 조회
router.get('/', async (req, res) => {
  try {
    // 메뉴 목록과 옵션을 함께 조회
    const menuQuery = `
      SELECT id, name, description, price, image, stock
      FROM menus
      ORDER BY id
    `
    const menuResult = await pool.query(menuQuery)
    
    // 각 메뉴의 옵션 조회
    const menus = await Promise.all(
      menuResult.rows.map(async (menu) => {
        const optionQuery = `
          SELECT id, name, price
          FROM options
          WHERE menu_id = $1
          ORDER BY id
        `
        const optionResult = await pool.query(optionQuery, [menu.id])
        
        return {
          ...menu,
          options: optionResult.rows
        }
      })
    )
    
    res.json({
      success: true,
      data: menus
    })
  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '메뉴 목록을 불러올 수 없습니다.'
    })
  }
})

// GET /api/menus/:id/stock - 특정 메뉴의 재고 조회
router.get('/:id/stock', async (req, res) => {
  try {
    const menuId = parseInt(req.params.id)
    
    if (isNaN(menuId)) {
      return res.status(400).json({
        success: false,
        error: '잘못된 메뉴 ID입니다.'
      })
    }
    
    const query = 'SELECT id, stock FROM menus WHERE id = $1'
    const result = await pool.query(query, [menuId])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      })
    }
    
    res.json({
      success: true,
      data: {
        menuId: result.rows[0].id,
        stock: result.rows[0].stock
      }
    })
  } catch (error) {
    console.error('재고 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '재고 정보를 불러올 수 없습니다.'
    })
  }
})

// PUT /api/menus/:id/stock - 특정 메뉴의 재고 수정
router.put('/:id/stock', async (req, res) => {
  try {
    const menuId = parseInt(req.params.id)
    const { stock } = req.body
    
    if (isNaN(menuId)) {
      return res.status(400).json({
        success: false,
        error: '잘못된 메뉴 ID입니다.'
      })
    }
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: '재고는 0 이상의 숫자여야 합니다.'
      })
    }
    
    const query = 'UPDATE menus SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, stock'
    const result = await pool.query(query, [stock, menuId])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      })
    }
    
    res.json({
      success: true,
      data: {
        menuId: result.rows[0].id,
        stock: result.rows[0].stock
      }
    })
  } catch (error) {
    console.error('재고 수정 오류:', error)
    res.status(500).json({
      success: false,
      error: '재고 정보를 수정할 수 없습니다.'
    })
  }
})

export default router
