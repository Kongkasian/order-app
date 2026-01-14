import express from 'express'
import { pool } from '../config/database.js'

const router = express.Router()

// GET /api/dashboard/stats - 대시보드 통계 조회
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'received') as received,
        COUNT(*) FILTER (WHERE status = 'manufacturing') as manufacturing,
        COUNT(*) FILTER (WHERE status = 'completed') as completed
      FROM orders
    `
    const result = await pool.query(query)
    
    const stats = result.rows[0]
    res.json({
      success: true,
      data: {
        total: parseInt(stats.total),
        received: parseInt(stats.received),
        manufacturing: parseInt(stats.manufacturing),
        completed: parseInt(stats.completed)
      }
    })
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '통계 정보를 불러올 수 없습니다.'
    })
  }
})

export default router
