import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ServiceHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500">Open</h3>
              <p className="mt-2 text-3xl font-semibold text-green-600">0</p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="mt-2 text-3xl font-semibold text-yellow-600">0</p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
              <p className="mt-2 text-3xl font-semibold text-blue-600">0</p>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => navigate('/tickets/new')}
              className="btn btn-primary"
            >
              Create New Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
