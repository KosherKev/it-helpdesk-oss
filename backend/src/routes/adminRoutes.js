import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  bulkAssign,
  bulkStatusUpdate,
  generateReport
} from '../controllers/adminController.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize('admin'))

router.post('/tickets/bulk-assign', bulkAssign)
router.patch('/tickets/bulk-status', bulkStatusUpdate)
router.post('/reports/generate', generateReport)

export default router
