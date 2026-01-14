import express from 'express'
import cors from 'cors'
import { config } from './config/config.js'
import { testConnection } from './config/database.js'
import indexRoutes from './routes/index.js'
import menuRoutes from './routes/menus.js'
import orderRoutes from './routes/orders.js'
import dashboardRoutes from './routes/dashboard.js'

const app = express()

// 미들웨어 설정
app.use(cors(config.cors)) // CORS 허용
app.use(express.json()) // JSON 파싱
app.use(express.urlencoded({ extended: true })) // URL 인코딩된 데이터 파싱

// 라우트 설정
app.use('/', indexRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err)
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.'
  })
})

// 서버 시작
const PORT = config.server.port
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)
  console.log(`환경: ${config.server.env}`)
  console.log(`http://localhost:3001`)
  
  // 데이터베이스 연결 테스트
  await testConnection()
})
