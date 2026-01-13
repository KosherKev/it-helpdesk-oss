import express from 'express'
import authRoutes from './authRoutes.js'
import ticketRoutes from './ticketRoutes.js'
import userRoutes from './userRoutes.js'
import commentRoutes from './commentRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import adminRoutes from './adminRoutes.js'

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
router.use('/users', userRoutes)
router.use('/comments', commentRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/admin', adminRoutes)

export default router
