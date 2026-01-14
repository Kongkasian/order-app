import express from 'express'
const router = express.Router()

// GET /api/menus - 메뉴 목록 조회
router.get('/', (req, res) => {
  // TODO: 데이터베이스에서 메뉴 목록 조회
  res.json({
    success: true,
    data: []
  })
})

// GET /api/menus/:id/stock - 특정 메뉴의 재고 조회
router.get('/:id/stock', (req, res) => {
  // TODO: 데이터베이스에서 재고 정보 조회
  res.json({
    success: true,
    data: {
      menuId: req.params.id,
      stock: 0
    }
  })
})

// PUT /api/menus/:id/stock - 특정 메뉴의 재고 수정
router.put('/:id/stock', (req, res) => {
  // TODO: 데이터베이스에서 재고 정보 수정
  res.json({
    success: true,
    data: {
      menuId: req.params.id,
      stock: req.body.stock || 0
    }
  })
})

export default router
