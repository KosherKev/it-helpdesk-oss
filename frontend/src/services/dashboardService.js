import api from './api'

const dashboardService = {
  // Get general stats
  getStats: async () => {
    return await api.get('/dashboard/stats')
  },

  // Get stats by category
  getStatsByCategory: async () => {
    return await api.get('/dashboard/stats/by-category')
  },

  // Get stats by priority
  getStatsByPriority: async () => {
    return await api.get('/dashboard/stats/by-priority')
  },

  // Get technician workload
  getWorkload: async () => {
    return await api.get('/dashboard/workload')
  },

  // Generate report
  generateReport: async (filters) => {
    return await api.post('/admin/reports/generate', filters)
  }
}

export default dashboardService
