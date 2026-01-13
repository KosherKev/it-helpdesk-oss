import Comment from '../models/Comment.js'
import Ticket from '../models/Ticket.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params

    const comments = await Comment.find({ ticket: ticketId })
      .populate('user', 'fullName email role')
      .sort({ createdAt: 1 })

    return successResponse(res, 'Comments retrieved successfully', comments)
  } catch (error) {
    return errorResponse(res, 'Error retrieving comments', 500, error.message)
  }
}

export const addComment = async (req, res) => {
  try {
    const { ticketId } = req.params
    const { text } = req.body

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404)
    }

    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user._id,
      text
    })

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'fullName email role')

    return successResponse(res, 'Comment added successfully', populatedComment, 201)
  } catch (error) {
    return errorResponse(res, 'Error adding comment', 500, error.message)
  }
}

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body

    const comment = await Comment.findById(id)
    if (!comment) {
      return errorResponse(res, 'Comment not found', 404)
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this comment', 403)
    }

    comment.text = text
    await comment.save()

    return successResponse(res, 'Comment updated successfully', comment)
  } catch (error) {
    return errorResponse(res, 'Error updating comment', 500, error.message)
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findById(id)
    if (!comment) {
      return errorResponse(res, 'Comment not found', 404)
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this comment', 403)
    }

    await comment.deleteOne()

    return successResponse(res, 'Comment deleted successfully')
  } catch (error) {
    return errorResponse(res, 'Error deleting comment', 500, error.message)
  }
}
