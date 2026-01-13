import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@stores/authStore";

// Auth pages
import Login from "@pages/Login";
import Register from "@pages/Register";
import Unauthorized from "@pages/Unauthorized";
import ProtectedRoute from "@/routes/protectedRoutes";

//Layout pages
import CustomerLayout from "@layouts/CustomerLayout";
import AdminLayout from "@layouts/AdminLayout";
import TechnicianLayout from "@layouts/TechnicianLayout";

// Shared pages
import Dashboard from "@pages/Dashboard";
import Tickets from "@pages/Tickets";
import TicketDetail from "@pages/TicketDetail";
import CreateTicket from "@pages/CreateTicket";

// Technician pages
import TechnicianDashboard from "@pages/TechnicianDashboard";
import AssignedTickets from "@pages/AssignedTickets";
import OpenTickets from "@pages/OpenTickets";

// Admin pages
import AdminDashboard from "@pages/AdminDashboard";
import AdminAllTickets from "@pages/AdminAllTickets";
import AssignTickets from "@pages/AssignTickets";
import Reports from "@pages/Reports";
import Users from "@pages/UserManagement";



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* CUSTOMER */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <Dashboard />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRoles={["customer", "technician", "admin"]}>
              <CustomerLayout>
              <Tickets />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <CreateTicket />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["customer", "technician", "admin"]}>
              <CustomerLayout>
                <TicketDetail />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianLayout>
              <TechnicianDashboard />
               </TechnicianLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/assigned"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianLayout>
                <AssignedTickets />
              </TechnicianLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/open"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianLayout>
                <OpenTickets />
              </TechnicianLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminAllTickets />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/assign"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AssignTickets />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

