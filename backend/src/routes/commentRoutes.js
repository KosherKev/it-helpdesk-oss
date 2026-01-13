import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  updateComment,
  deleteComment
} from '../controllers/commentController.js'

const router = express.Router()

router.use(authenticate)

// Direct comment operations
router.patch('/:id', updateComment)
router.delete('/:id', deleteComment)

export default router
