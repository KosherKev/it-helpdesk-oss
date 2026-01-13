import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTechnicians
} from '../controllers/userController.js'

const router = express.Router()

// Public routes (none for users currently)

// Protected routes
router.use(authenticate)

router.get('/', authorize('admin'), getAllUsers)
router.get('/technicians', getTechnicians)
router.get('/:id', getUserById)
router.patch('/:id', updateUser)
router.delete('/:id', authorize('admin'), deleteUser)

export default router
