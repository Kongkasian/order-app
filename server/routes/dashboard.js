import express from 'express'
const router = express.Router()

// GET /api/dashboard/stats - 대시보드 통계 조회
router.get('/stats', (req, res) => {
  // TODO: 데이터베이스에서 통계 정보 조회
  res.json({
    success: true,
    data: {
      total: 0,
      received: 0,
      manufacturing: 0,
      completed: 0
    }
  })
})

export default router
