import api from './api'

const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData) => {
    return await api.post('/tickets', ticketData)
  },

  // Get all tickets (with optional query params)
  getAllTickets: async (params) => {
    return await api.get('/tickets', { params })
  },

  // Get tickets created by current user
  getMyTickets: async () => {
    return await api.get('/tickets/my-tickets')
  },

  // Get assigned tickets (technician)
  getAssignedTickets: async () => {
    return await api.get('/tickets/assigned')
  },

  // Get unassigned tickets
  getUnassignedTickets: async () => {
    return await api.get('/tickets/unassigned')
  },

  // Get single ticket by ID
  getTicketById: async (id) => {
    return await api.get(`/tickets/${id}`)
  },

  // Update ticket details
  updateTicket: async (id, data) => {
    return await api.patch(`/tickets/${id}`, data)
  },

  // Delete ticket (admin)
  deleteTicket: async (id) => {
    return await api.delete(`/tickets/${id}`)
  },

  // Assign ticket to technician
  assignTicket: async (id, technicianId) => {
    return await api.patch(`/tickets/${id}/assign`, { technicianId })
  },

  // Update ticket status
  updateTicketStatus: async (id, status, resolution) => {
    return await api.patch(`/tickets/${id}/status`, { status, resolution })
  }
}

export default ticketService
