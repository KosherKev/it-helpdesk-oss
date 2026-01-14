import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ticketService from '../services/ticketService'
import toast from 'react-hot-toast'

export default function TechnicianDashboard() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    assigned: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchAssignedTickets()
  }, [])

  const fetchAssignedTickets = async () => {
    try {
      setLoading(true)
      const res = await ticketService.getAssignedTickets()
      if (res.success) {
        const ticketList = res.data?.tickets || []
        setTickets(ticketList)
        
        // Calculate stats client-side based on assigned tickets
        setStats({
          assigned: ticketList.length,
          open: ticketList.filter(t => t.status === 'open').length,
          inProgress: ticketList.filter(t => t.status === 'in-progress').length,
          resolved: ticketList.filter(t => t.status === 'resolved').length
        })
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'badge-neutral',
      medium: 'badge-info',
      high: 'badge-warning',
      urgent: 'badge-danger'
    }
    return colors[priority] || 'badge-neutral'
  }

  const getStatusColor = (status) => {
    const colors = {
      open: 'badge-info',
      'in-progress': 'badge-warning',
      resolved: 'badge-success',
      closed: 'badge-neutral'
    }
    return colors[status] || 'badge-neutral'
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-primary-500">
            <p className="text-gray-500 text-sm">Total Assigned</p>
            <p className="text-3xl font-bold text-gray-800">{stats.assigned}</p>
        </div>
        <div className="card border-l-4 border-l-info-500">
            <p className="text-gray-500 text-sm">Open</p>
            <p className="text-3xl font-bold text-gray-800">{stats.open}</p>
        </div>
        <div className="card border-l-4 border-l-warning-500">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
        </div>
        <div className="card border-l-4 border-l-success-500">
            <p className="text-gray-500 text-sm">Resolved</p>
            <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
        </div>
      </div>

      {/* Ticket List */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">My Assigned Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-500">Ticket #</th>
                <th className="p-3 text-left font-medium text-gray-500">Title</th>
                <th className="p-3 text-left font-medium text-gray-500">Priority</th>
                <th className="p-3 text-left font-medium text-gray-500">Status</th>
                <th className="p-3 text-left font-medium text-gray-500">Category</th>
                <th className="p-3 text-right font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading tickets...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No assigned tickets found</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket._id || ticket.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-600">{ticket.ticketNumber}</td>
                    <td className="p-3 font-medium text-gray-900">{ticket.title || 'No Title'}</td>
                    <td className="p-3">
                        <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority?.toUpperCase() || ''}
                        </span>
                    </td>
                    <td className="p-3">
                        <span className={`badge ${getStatusColor(ticket.status)}`}>
                            {ticket.status?.toUpperCase() || ''}
                        </span>
                    </td>
                    <td className="p-3 text-gray-600">{ticket.category || 'N/A'}</td>
                    <td className="p-3 text-right">
                        <button 
                            onClick={() => navigate(`/tickets/${ticket._id || ticket.id}`)}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                            View
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
