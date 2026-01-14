import express from 'express'
const router = express.Router()

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '커피 주문 앱 API 서버가 실행 중입니다.',
    version: '1.0.0'
  })
})

export default router
