import Ticket from '../models/Ticket.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const bulkAssign = async (req, res) => {
  try {
    const { ticketIds, technicianId } = req.body

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return errorResponse(res, 'Ticket IDs must be provided as an array', 400)
    }

    if (!technicianId) {
      return errorResponse(res, 'Technician ID is required', 400)
    }

    const result = await Ticket.updateMany(
      { _id: { $in: ticketIds } },
      { $set: { assignedTo: technicianId } }
    )

    return successResponse(res, 'Tickets assigned successfully', {
      matched: result.matchedCount,
      modified: result.modifiedCount
    })
  } catch (error) {
    return errorResponse(res, 'Error performing bulk assignment', 500, error.message)
  }
}

export const bulkStatusUpdate = async (req, res) => {
  try {
    const { ticketIds, status } = req.body

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return errorResponse(res, 'Ticket IDs must be provided as an array', 400)
    }

    if (!status) {
      return errorResponse(res, 'Status is required', 400)
    }

    const updates = { status }
    if (status === 'resolved') updates.resolvedAt = new Date()
    if (status === 'closed') updates.closedAt = new Date()

    const result = await Ticket.updateMany(
      { _id: { $in: ticketIds } },
      { $set: updates }
    )

    return successResponse(res, 'Tickets status updated successfully', {
      matched: result.matchedCount,
      modified: result.modifiedCount
    })
  } catch (error) {
    return errorResponse(res, 'Error performing bulk status update', 500, error.message)
  }
}

export const generateReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.body

    // Basic implementation: filtering tickets by date range
    const query = {}
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    let reportData
    if (type === 'performance') {
        // Mock performance report logic
        reportData = await Ticket.aggregate([
            { $match: query },
            { $group: { _id: '$assignedTo', avgResolutionTime: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } } } }
        ])
    } else {
        // Default: List of tickets in range
        reportData = await Ticket.find(query).select('ticketNumber title status priority createdAt')
    }

    return successResponse(res, 'Report generated successfully', {
      filter: { startDate, endDate, type },
      data: reportData,
      generatedAt: new Date()
    })
  } catch (error) {
    return errorResponse(res, 'Error generating report', 500, error.message)
  }
}
