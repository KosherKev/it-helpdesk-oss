import express from 'express'
import * as ticketController from '../controllers/ticketController.js'
import * as commentController from '../controllers/commentController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// Public routes (none for tickets)

// Protected routes (all require authentication)
router.use(authenticate)

// General Ticket Routes
router.post('/', ticketController.createTicket)
router.get('/', ticketController.getAllTickets)
router.get('/my-tickets', ticketController.getMyTickets) // Specific route before :id
router.get('/assigned', authorize('technician', 'admin'), ticketController.getAssignedTickets)
router.get('/unassigned', authorize('technician', 'admin'), ticketController.getUnassignedTickets)

// Specific Ticket Operations
router.get('/:id', ticketController.getTicketById)
router.patch('/:id', ticketController.updateTicket)
router.delete('/:id', authorize('admin'), ticketController.deleteTicket)

// Special Actions
router.patch('/:id/assign', authorize('technician', 'admin'), ticketController.assignTicket)
router.patch('/:id/status', authorize('technician', 'admin'), ticketController.updateTicketStatus)

// Comment Routes (Nested)
router.get('/:ticketId/comments', commentController.getTicketComments)
router.post('/:ticketId/comments', commentController.addComment)

export default router
