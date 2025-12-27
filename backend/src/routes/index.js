import express from 'express'
import authRoutes from './authRoutes.js'
import ticketRoutes from './ticketRoutes.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

router.use('/auth', authRoutes)
router.use('/tickets', ticketRoutes)

export default router
