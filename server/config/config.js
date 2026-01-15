import dotenv from 'dotenv'

// 환경 변수 로드
dotenv.config()

export const config = {
  // 서버 설정
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // 데이터베이스 설정
  database: {
    host: (process.env.DB_HOST || 'localhost').replace(/['"]/g, ''), // 따옴표 제거
    port: parseInt(process.env.DB_PORT || '5432'),
    name: (process.env.DB_NAME || 'order_app').replace(/['"]/g, ''), // 따옴표 제거
    user: (process.env.DB_USER || '').replace(/['"]/g, ''), // 따옴표 제거
    password: (process.env.DB_PASSWORD || '').replace(/['"]/g, '') // 따옴표 제거
  },

  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
}
