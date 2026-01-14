import dotenv from 'dotenv'

// 환경 변수 로드
dotenv.config()

export const config = {
  // 서버 설정
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // 데이터베이스 설정 (추후 추가)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'order_app',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || ''
  },

  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
}
