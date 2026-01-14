import pkg from 'pg'
const { Pool } = pkg
import { config } from './config.js'

// PostgreSQL 연결 풀 생성
export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err)
})

// 데이터베이스 연결 테스트 함수
export const testConnection = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ 데이터베이스 연결 테스트 성공:', result.rows[0])
    client.release()
    return true
  } catch (err) {
    console.error('❌ 데이터베이스 연결 테스트 실패:')
    console.error('에러 메시지:', err.message)
    console.error('에러 코드:', err.code)
    if (err.detail) console.error('상세:', err.detail)
    return false
  }
}

// 데이터베이스 연결 종료 함수
export const closePool = async () => {
  await pool.end()
  console.log('데이터베이스 연결 풀이 종료되었습니다.')
}
