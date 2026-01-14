import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ticketService from '../services/ticketService'

export default function CreateTicket() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'hardware',
    priority: 'medium',
    description: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const res = await ticketService.createTicket(formData)
      
      if (res.success) {
        toast.success('Ticket created successfully!')
        navigate(`/tickets/${res.data._id}`)
      }
    } catch (error) {
      console.error('Create ticket error:', error)
      toast.error('Failed to create ticket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600 mt-1">Submit a new support request and we'll get back to you.</p>
        </div>

        <div className="card p-0 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={200}
                className="input-field"
                placeholder="Brief summary of the issue"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="input-field"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="network">Network</option>
                        <option value="access">Access / Account</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        className="input-field"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low - General Question</option>
                        <option value="medium">Medium - Standard Issue</option>
                        <option value="high">High - Work Impeded</option>
                        <option value="urgent">Urgent - System Down</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                className="input-field resize-none"
                placeholder="Please provide detailed information about the issue..."
                value={formData.description}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Please include any error messages or steps to reproduce.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary min-w-[120px]"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
