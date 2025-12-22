import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@stores/authStore'

import Login from '@pages/Login'
import Register from '@pages/Register'
import Dashboard from '@pages/Dashboard'
import Tickets from '@pages/Tickets'
import TicketDetail from '@pages/TicketDetail'
import CreateTicket from '@pages/CreateTicket'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/tickets/new" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
