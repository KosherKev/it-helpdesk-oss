import api from './api'

const userService = {
  // Get all users (admin)
  getAllUsers: async (params) => {
    return await api.get('/users', { params })
  },

  // Get user by ID
  getUserById: async (id) => {
    return await api.get(`/users/${id}`)
  },

  // Get all technicians
  getTechnicians: async () => {
    return await api.get('/users/technicians')
  },

  // Update user
  updateUser: async (id, data) => {
    return await api.patch(`/users/${id}`, data)
  },

  // Delete/Deactivate user
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`)
  }
}

export default userService
