import Ticket from '../models/Ticket.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments()
    const openTickets = await Ticket.countDocuments({ status: 'open' })
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' })
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' })
    const closedTickets = await Ticket.countDocuments({ status: 'closed' })

    const stats = {
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets
    }

    return successResponse(res, 'General stats retrieved successfully', stats)
  } catch (error) {
    return errorResponse(res, 'Error retrieving stats', 500, error.message)
  }
}

export const getStatsByCategory = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])

    return successResponse(res, 'Category stats retrieved successfully', stats)
  } catch (error) {
    return errorResponse(res, 'Error retrieving category stats', 500, error.message)
  }
}

export const getStatsByPriority = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          priority: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])

    return successResponse(res, 'Priority stats retrieved successfully', stats)
  } catch (error) {
    return errorResponse(res, 'Error retrieving priority stats', 500, error.message)
  }
}

export const getWorkload = async (req, res) => {
  try {
    const workload = await Ticket.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
          status: { $in: ['open', 'in-progress'] }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          ticketCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'technician'
        }
      },
      {
        $unwind: '$technician'
      },
      {
        $project: {
          technicianId: '$_id',
          technicianName: '$technician.fullName',
          ticketCount: 1,
          _id: 0
        }
      }
    ])

    return successResponse(res, 'Workload stats retrieved successfully', workload)
  } catch (error) {
    return errorResponse(res, 'Error retrieving workload stats', 500, error.message)
  }
}
