import api from './api'

const commentService = {
  // Get comments for a ticket
  getTicketComments: async (ticketId) => {
    return await api.get(`/tickets/${ticketId}/comments`)
  },

  // Add a comment to a ticket
  addComment: async (ticketId, text) => {
    return await api.post(`/tickets/${ticketId}/comments`, { text })
  },

  // Update a comment
  updateComment: async (commentId, text) => {
    return await api.patch(`/comments/${commentId}`, { text })
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return await api.delete(`/comments/${commentId}`)
  }
}

export default commentService
