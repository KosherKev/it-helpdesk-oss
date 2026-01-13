import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getStats,
  getStatsByCategory,
  getStatsByPriority,
  getWorkload
} from '../controllers/dashboardController.js'

const router = express.Router()

router.use(authenticate)

router.get('/stats', getStats)
router.get('/stats/by-category', getStatsByCategory)
router.get('/stats/by-priority', getStatsByPriority)
router.get('/workload', authorize('admin', 'technician'), getWorkload)

export default router
