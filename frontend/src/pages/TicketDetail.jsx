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
  const [showResolutionModal, setShowResolutionModal] = useState(false)
  const [resolutionText, setResolutionText] = useState('')

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
    if (newStatus === 'resolved') {
        setShowResolutionModal(true)
        return
    }
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

  const handleResolutionSubmit = async () => {
    if (!resolutionText.trim()) {
        toast.error('Resolution text is required')
        return
    }
    try {
        const res = await ticketService.updateTicketStatus(id, 'resolved', resolutionText)
        if (res.success) {
            setTicket(prev => ({ 
                ...prev, 
                status: 'resolved', 
                resolution: resolutionText,
                resolvedAt: new Date() 
            }))
            toast.success('Ticket resolved successfully')
            setShowResolutionModal(false)
        }
    } catch (error) {
        toast.error('Failed to resolve ticket')
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-gray-500 font-mono text-sm">#{ticket.ticketNumber}</span>
                    <span className={`badge ${getStatusColor(ticket.status || 'open')}`}>
                        {(ticket.status || 'open').toUpperCase()}
                    </span>
                    <span className={`badge ${getPriorityColor(ticket.priority || 'medium')}`}>
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
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 mt-4">
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
                    className="btn bg-danger-50 text-danger-700 hover:bg-danger-100 border border-danger-200"
                 >
                    Close Ticket
                 </button>
             )}
        </div>
        
        {/* Assignment Modal (Inline for simplicity) */}
        {showAssignModal && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                                {tech.fullName || tech.username || tech.email} {tech.department ? `(${tech.department})` : ''}
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

        {/* Resolution Modal */}
        {showResolutionModal && (
            <div className="mt-4 p-4 bg-success-50 rounded-lg border border-success-200">
                <h3 className="font-semibold mb-2 text-success-800">Resolution Details</h3>
                <div className="space-y-3">
                    <textarea
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        placeholder="Describe how the issue was resolved..."
                        className="input-field min-h-[100px]"
                    />
                    <div className="flex gap-2 justify-end">
                        <button 
                            onClick={() => setShowResolutionModal(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleResolutionSubmit}
                            className="btn btn-success"
                        >
                            Resolve Ticket
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {ticket.description}
                </div>
            </div>

            {/* Resolution */}
            {ticket.resolution && (
                <div className="card border-l-4 border-l-success-500 bg-success-50/10">
                    <h3 className="text-lg font-semibold mb-4 text-success-700">Resolution</h3>
                    <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                        {ticket.resolution}
                    </div>
                    {ticket.resolvedAt && (
                         <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-success-100">
                            Resolved on {format(new Date(ticket.resolvedAt), 'MMM d, yyyy HH:mm')}
                         </p>
                    )}
                </div>
            )}

            {/* Comments */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
                <div className="space-y-6 mb-6">
                    {comments.map(comment => (
                        <div key={comment._id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                    {comment.user?.fullName?.charAt(0) || comment.user?.username?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-900">{comment.user?.fullName || comment.user?.username}</span>
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
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Ticket Info</h3>
                <dl className="space-y-3">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.category}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {ticket.createdBy?.fullName || ticket.createdBy?.username || 'Unknown'}
                            <br/>
                            <span className="text-gray-400 text-xs">{ticket.createdBy?.email}</span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {ticket.assignedTo ? (
                                <>
                                    {ticket.assignedTo.fullName || ticket.assignedTo.username}
                                    <br/>
                                    <span className="text-gray-400 text-xs">{ticket.assignedTo.email}</span>
                                </>
                            ) : (
                                <span className="text-warning-600 italic">Unassigned</span>
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
