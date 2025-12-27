import Ticket from '../models/Ticket.js'
import { successResponse, errorResponse } from '../utils/response.js'

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      category: category || 'other',
      createdBy: req.user._id,
      status: 'open'
    })

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'username fullName email')

    return successResponse(res, 'Ticket created successfully', { ticket: populatedTicket }, 201)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message)
      return errorResponse(res, 'Validation error', 400, messages)
    }
    return errorResponse(res, 'Error creating ticket', 500, error.message)
  }
}

// Get All Tickets (with filtering)
export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, assignedTo, createdBy, search, sortBy, page = 1, limit = 20 } = req.query
    
    const query = {}

    // Role-based filtering
    if (req.user.role === 'customer') {
      query.createdBy = req.user._id
    }

    // Apply filters
    if (status) query.status = status
    if (priority) query.priority = priority
    if (category) query.category = category
    if (assignedTo) query.assignedTo = assignedTo
    if (createdBy) query.createdBy = createdBy // Admin/Tech can filter by creator

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ]
    }

    // Pagination
    const skip = (page - 1) * limit

    // Sorting
    let sort = { createdAt: -1 } // Default
    if (sortBy) {
      const parts = sortBy.split(':')
      sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 }
    } else if (req.query.sort) {
       // Handle simple sort string like "-createdAt"
       const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
       const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
       sort = { [sortField]: sortOrder };
    }


    const tickets = await Ticket.find(query)
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Ticket.countDocuments(query)

    return successResponse(res, 'Tickets retrieved', {
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    return errorResponse(res, 'Error retrieving tickets', 500, error.message)
  }
}

// Get Single Ticket
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username fullName email department')
      .populate('assignedTo', 'username fullName')

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    // Access control
    if (req.user.role === 'customer' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to view this ticket', 403)
    }

    return successResponse(res, 'Ticket retrieved', { ticket })
  } catch (error) {
    return errorResponse(res, 'Error retrieving ticket', 500, error.message)
  }
}

// Update Ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    // Permission check
    if (req.user.role === 'customer') {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return errorResponse(res, 'Not authorized', 403)
      }
      // Customer can only update title, description, priority if status is open
      if (ticket.status !== 'open') {
        return errorResponse(res, 'Cannot edit ticket after it is processed', 403)
      }
      // Filter allowed fields for customer
      const { title, description, priority, category } = req.body
      if (title) ticket.title = title
      if (description) ticket.description = description
      if (priority) ticket.priority = priority
      if (category) ticket.category = category
    } else {
      // Tech/Admin can update more fields
      const { title, description, priority, category, status, resolution, assignedTo } = req.body
      if (title) ticket.title = title
      if (description) ticket.description = description
      if (priority) ticket.priority = priority
      if (category) ticket.category = category
      
      // Admin only: assignedTo
      if (assignedTo && req.user.role === 'admin') {
        ticket.assignedTo = assignedTo
      }

      // Tech/Admin: Status
      if (status) {
          ticket.status = status;
          if (status === 'resolved' && !resolution && !ticket.resolution) {
               return errorResponse(res, 'Resolution is required when resolving a ticket', 400);
          }
      }
      if (resolution) ticket.resolution = resolution
    }

    await ticket.save()

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName')

    return successResponse(res, 'Ticket updated successfully', { ticket: updatedTicket })

  } catch (error) {
    return errorResponse(res, 'Error updating ticket', 500, error.message)
  }
}

// Delete Ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    await ticket.deleteOne()

    return successResponse(res, 'Ticket deleted successfully')
  } catch (error) {
    return errorResponse(res, 'Error deleting ticket', 500, error.message)
  }
}

// Assign Ticket
export const assignTicket = async (req, res) => {
  try {
    const { technicianId } = req.body
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    // Tech can only assign to self
    if (req.user.role === 'technician' && technicianId !== req.user._id.toString()) {
      return errorResponse(res, 'Technicians can only assign tickets to themselves', 403)
    }

    ticket.assignedTo = technicianId
    // Optionally update status to in-progress if it was open
    if (ticket.status === 'open') {
        ticket.status = 'in-progress'
    }

    await ticket.save()

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('assignedTo', 'username fullName')

    return successResponse(res, 'Ticket assigned successfully', { ticket: updatedTicket })

  } catch (error) {
    return errorResponse(res, 'Error assigning ticket', 500, error.message)
  }
}

// Update Ticket Status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, resolution } = req.body
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    if (status === 'resolved' && !resolution) {
      return errorResponse(res, 'Resolution is required', 400)
    }

    ticket.status = status
    if (resolution) ticket.resolution = resolution

    await ticket.save()

    return successResponse(res, 'Status updated successfully', { ticket })

  } catch (error) {
    return errorResponse(res, 'Error updating status', 500, error.message)
  }
}

// Get My Tickets (Customer)
export const getMyTickets = async (req, res) => {
  try {
    // Reuse getAllTickets logic but force createdBy
    req.query.createdBy = req.user._id
    // Ensure customer role logic in getAllTickets handles this or we just call it directly
    // Since getAllTickets already checks for customer role and filters, we can just call it
    // But to be cleaner, let's just implement specific logic or modify req and call getAllTickets
    
    // Easier to just reuse the logic by ensuring the filter is set, 
    // but getAllTickets already forces createdBy if role is customer.
    return getAllTickets(req, res)
  } catch (error) {
    return errorResponse(res, 'Error retrieving tickets', 500, error.message)
  }
}

// Get Assigned Tickets (Tech)
export const getAssignedTickets = async (req, res) => {
  try {
    const { status, priority, sortBy, page = 1, limit = 20 } = req.query
    
    const query = { assignedTo: req.user._id }
    
    if (status) query.status = status
    if (priority) query.priority = priority

    const skip = (page - 1) * limit
    const sort = sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'username fullName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Ticket.countDocuments(query)

    return successResponse(res, 'Assigned tickets retrieved', {
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    return errorResponse(res, 'Error retrieving assigned tickets', 500, error.message)
  }
}

// Get Unassigned Tickets
export const getUnassignedTickets = async (req, res) => {
  try {
    const { priority, category, sortBy } = req.query
    
    const query = { assignedTo: null }
    
    if (priority) query.priority = priority
    if (category) query.category = category

    // Default sort: priority (urgent first), then createdAt
    let sort = { createdAt: 1 }
    if (sortBy) {
         // handle sort
    } else {
        // Custom sort for priority is hard in simple mongoose without aggregation or numeric priority
        // For now, just sort by createdAt
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'username fullName')
      .sort(sort)

    return successResponse(res, 'Unassigned tickets retrieved', {
      tickets,
      count: tickets.length
    })
  } catch (error) {
    return errorResponse(res, 'Error retrieving unassigned tickets', 500, error.message)
  }
}
