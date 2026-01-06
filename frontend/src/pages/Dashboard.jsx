import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "@stores/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get("/tickets/my-tickets");
        const tickets = res.data;

        setStats({
          total: tickets.length,
          open: tickets.filter(t => t.status === "open").length,
          inProgress: tickets.filter(t => t.status === "in-progress").length,
          resolved: tickets.filter(t => t.status === "resolved").length,
        });
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
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.username}
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
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Tickets
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">Open</h3>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {stats.open}
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">
                  In Progress
                </h3>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">
                  {stats.inProgress}
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">
                  Resolved
                </h3>
                <p className="mt-2 text-3xl font-semibold text-blue-600">
                  {stats.resolved}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => navigate("/tickets/new")}
              className="btn btn-primary"
            >
              Create New Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

