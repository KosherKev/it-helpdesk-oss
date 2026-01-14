import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import api from '../services/api'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, open, resolved

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/my-tickets')
      setTickets(res.data?.tickets || [])
    } catch (error) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    if (filter === 'open') return ['open', 'in-progress'].includes(ticket.status)
    if (filter === 'resolved') return ['resolved', 'closed'].includes(ticket.status)
    return true
  })

  const getStatusColor = (status) => {
    const colors = {
      open: 'badge-info',
      'in-progress': 'badge-warning',
      resolved: 'badge-success',
      closed: 'badge-neutral'
    }
    return colors[status] || 'badge-neutral'
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
            <div className="flex gap-4">
                 <select 
                    className="input-field max-w-[150px]"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Tickets</option>
                    <option value="open">Active</option>
                    <option value="resolved">Resolved</option>
                </select>
                <Link to="/tickets/new" className="btn btn-primary whitespace-nowrap">
                    New Ticket
                </Link>
            </div>
        </div>

        <div className="card p-0 overflow-hidden">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
                <div className="p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket.</p>
                    <div className="mt-6">
                        <Link to="/tickets/new" className="btn btn-primary">
                            Create Ticket
                        </Link>
                    </div>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {filteredTickets.map(ticket => (
                        <li key={ticket._id || ticket.id}>
                            <Link to={`/tickets/${ticket._id || ticket.id}`} className="block hover:bg-gray-50 transition-colors">
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center truncate">
                                            <p className="text-sm font-medium text-primary-600 truncate">{ticket.title}</p>
                                            <span className={`ml-2 badge ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                <span className="font-mono mr-2">#{ticket.ticketNumber}</span>
                                                <span className="truncate">{ticket.category}</span>
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Created on {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  )
}
