import express from 'express'
import authRoutes from './authRoutes.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

router.use('/auth', authRoutes)

export default router
