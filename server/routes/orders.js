import express from 'express'
const router = express.Router()

// GET /api/orders - 주문 목록 조회
router.get('/', (req, res) => {
  // TODO: 데이터베이스에서 주문 목록 조회
  res.json({
    success: true,
    data: []
  })
})

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', (req, res) => {
  // TODO: 데이터베이스에서 주문 정보 조회
  res.json({
    success: true,
    data: {
      id: req.params.id
    }
  })
})

// POST /api/orders - 주문 생성
router.post('/', (req, res) => {
  // TODO: 데이터베이스에 주문 저장
  const { items, totalAmount } = req.body
  
  res.json({
    success: true,
    data: {
      orderId: Date.now(),
      orderDate: new Date(),
      status: 'received',
      totalAmount: totalAmount
    }
  })
})

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', (req, res) => {
  // TODO: 데이터베이스에서 주문 상태 업데이트
  res.json({
    success: true,
    data: {
      id: req.params.id,
      status: req.body.status
    }
  })
})

export default router
