import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ticketService from '../services/ticketService'
import commentService from '../services/commentService'
import { useAuthStore } from '../stores/authStore'
import userService from '../services/userService'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // State for actions
  const [technicians, setTechnicians] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)

  const isTechnicianOrAdmin = ['technician', 'admin'].includes(user?.role)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchTicketData()
  }, [id])

  useEffect(() => {
    if (showAssignModal && technicians.length === 0) {
        fetchTechnicians()
    }
  }, [showAssignModal])

  const fetchTicketData = async () => {
    try {
      setLoading(true)
      const [ticketRes, commentsRes] = await Promise.all([
        ticketService.getTicketById(id),
        commentService.getTicketComments(id)
      ])
      
      if (ticketRes.success) setTicket(ticketRes.data?.ticket || ticketRes.data)
      if (commentsRes.success) setComments(commentsRes.data)
    } catch (error) {
      console.error('Error fetching ticket details:', error)
      toast.error('Failed to load ticket details')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const fetchTechnicians = async () => {
    try {
        // We'll implement this service method soon
        const res = await userService.getTechnicians() 
        if (res.success) setTechnicians(res.data)
    } catch (error) {
        console.error('Error fetching technicians', error)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      const res = await ticketService.updateTicketStatus(id, newStatus)
      if (res.success) {
        setTicket(prev => ({ ...prev, status: newStatus }))
        toast.success(`Ticket marked as ${newStatus}`)
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handlePriorityUpdate = async (newPriority) => {
     try {
      const res = await ticketService.updateTicket(id, { priority: newPriority })
      if (res.success) {
        setTicket(prev => ({ ...prev, priority: newPriority }))
        toast.success(`Priority updated to ${newPriority}`)
      }
    } catch (error) {
      toast.error('Failed to update priority')
    }
  }

  const handleAssign = async (technicianId) => {
    try {
      const res = await ticketService.assignTicket(id, technicianId)
      if (res.success) {
        toast.success('Ticket assigned successfully')
        fetchTicketData() // Refresh to show new assignee
        setShowAssignModal(false)
      }
    } catch (error) {
      toast.error('Failed to assign ticket')
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      const res = await commentService.addComment(id, newComment)
      if (res.success) {
        setComments([...comments, res.data])
        setNewComment('')
        toast.success('Comment added')
      }
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading ticket details...</div>
  if (!ticket) return <div className="p-8 text-center">Ticket not found</div>

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-gray-500 font-mono text-sm">#{ticket.ticketNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status || 'open')}`}>
                        {(ticket.status || 'open').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority || 'medium')}`}>
                        {(ticket.priority || 'medium').toUpperCase()}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            </div>
            <div className="text-right text-sm text-gray-500">
                <p>Created: {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}</p>
                {ticket.updatedAt && <p>Updated: {format(new Date(ticket.updatedAt), 'MMM d, yyyy HH:mm')}</p>}
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 border-t pt-4 mt-4">
            {isTechnicianOrAdmin && (
                <>
                    <select 
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        className="input-field max-w-xs"
                    >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                     <select 
                        value={ticket.priority}
                        onChange={(e) => handlePriorityUpdate(e.target.value)}
                        className="input-field max-w-xs"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    <button 
                        onClick={() => setShowAssignModal(!showAssignModal)}
                        className="btn btn-secondary"
                    >
                        {ticket.assignedTo ? 'Reassign' : 'Assign Ticket'}
                    </button>
                </>
            )}
             
             {/* Customer Actions */}
             {!isTechnicianOrAdmin && ticket.status !== 'closed' && (
                 <button 
                    onClick={() => handleStatusUpdate('closed')}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100"
                 >
                    Close Ticket
                 </button>
             )}
        </div>
        
        {/* Assignment Modal (Inline for simplicity) */}
        {showAssignModal && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h3 className="font-semibold mb-2">Select Technician</h3>
                <div className="flex gap-2">
                    <select 
                        className="input-field"
                        onChange={(e) => handleAssign(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Choose a technician...</option>
                        {technicians.map(tech => (
                            <option key={tech._id} value={tech._id}>
                                {tech.fullName} ({tech.department})
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={() => setShowAssignModal(false)}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {ticket.description}
                </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
                <div className="space-y-6 mb-6">
                    {comments.map(comment => (
                        <div key={comment._id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                    {comment.user?.fullName?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-900">{comment.user?.fullName}</span>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                                    </span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No comments yet.</p>
                    )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your reply here..."
                        className="input-field min-h-[100px] mb-2"
                        required
                    />
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="btn btn-primary"
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ticket Info</h3>
                <dl className="space-y-3">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{ticket.category}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {ticket.createdBy?.fullName || 'Unknown'}
                            <br/>
                            <span className="text-gray-400 text-xs">{ticket.createdBy?.email}</span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {ticket.assignedTo ? (
                                <>
                                    {ticket.assignedTo.fullName}
                                    <br/>
                                    <span className="text-gray-400 text-xs">{ticket.assignedTo.email}</span>
                                </>
                            ) : (
                                <span className="text-yellow-600 italic">Unassigned</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  )
}
