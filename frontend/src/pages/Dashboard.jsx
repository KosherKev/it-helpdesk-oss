import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get("/tickets/my-tickets");
        // FIX: Handle response structure correctly.
        // API returns { success: true, data: { tickets: [], pagination: {} } }
        const tickets = res.data?.tickets || [];

        setStats({
          total: tickets.length,
          open: tickets.filter(t => t.status === "open").length,
          inProgress: tickets.filter(t => t.status === "in-progress").length,
          resolved: tickets.filter(t => t.status === "resolved").length,
        });
        
        // Get last 5 tickets
        setRecentTickets(tickets.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ServiceHub</h1>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/dashboard" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/tickets" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">My Tickets</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <button
              onClick={() => navigate("/tickets/new")}
              className="btn btn-primary"
            >
              Create New Ticket
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading dashboard...</p>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Tickets
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500">Open</h3>
                  <p className="mt-2 text-3xl font-semibold text-green-600">
                    {stats.open}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    In Progress
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-yellow-600">
                    {stats.inProgress}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Resolved
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-blue-600">
                    {stats.resolved}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                    <Link to="/tickets" className="text-sm text-primary-600 hover:text-primary-800">View all</Link>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentTickets.length === 0 ? (
                        <p className="p-6 text-gray-500 text-center">No recent tickets found.</p>
                    ) : (
                        recentTickets.map(ticket => (
                            <div key={ticket._id || ticket.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/tickets/${ticket._id}`} className="text-lg font-medium text-primary-600 hover:underline truncate block">
                                            {ticket.title}
                                        </Link>
                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                            <span className="font-mono mr-2">#{ticket.ticketNumber}</span>
                                            <span className="mx-2">&bull;</span>
                                            <span>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 
                                              ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
