import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import ticketService from "../services/ticketService";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, unassignedRes] = await Promise.all([
        dashboardService.getStats(),
        ticketService.getUnassignedTickets()
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      
      if (unassignedRes.success) {
        setUnassignedTickets(unassignedRes.data?.tickets || []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card border-l-4 border-l-primary-500">
            <p className="text-gray-500 text-sm">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="card border-l-4 border-l-danger-500">
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
        <div className="card border-l-4 border-l-gray-400">
            <p className="text-gray-500 text-sm">Closed</p>
            <p className="text-3xl font-bold text-gray-800">{stats.closed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Tickets Alert */}
        <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b bg-danger-50 flex justify-between items-center">
                <h2 className="font-semibold text-danger-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-danger-600 rounded-full animate-pulse"></span>
                    Unassigned Tickets ({unassignedTickets.length})
                </h2>
                <Link to="/tickets" className="text-sm text-danger-600 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
                {unassignedTickets.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">All tickets are assigned!</p>
                ) : (
                    unassignedTickets.slice(0, 5).map(ticket => (
                        <div key={ticket._id || ticket.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <Link to={`/tickets/${ticket._id || ticket.id}`} className="font-medium text-gray-900 hover:text-primary-600 block">
                                    {ticket.title}
                                </Link>
                                <span className="text-xs text-gray-500">#{ticket.ticketNumber} • {format(new Date(ticket.createdAt), 'MMM d, HH:mm')}</span>
                            </div>
                            <span className={`badge 
                                ${ticket.priority === 'urgent' ? 'badge-danger' : 
                                  ticket.priority === 'high' ? 'badge-warning' : 'badge-neutral'}`}>
                                {ticket.priority?.toUpperCase() || ''}
                            </span>
                        </div>
                    ))
                )}
                {unassignedTickets.length > 5 && (
                    <div className="p-2 text-center bg-gray-50 text-xs text-gray-500">
                        + {unassignedTickets.length - 5} more unassigned
                    </div>
                )}
            </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
            <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin/users" className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition">
                        <span className="block text-primary-700 font-semibold">Manage Users</span>
                    </Link>
                    <Link to="/admin/reports" className="p-4 bg-info-50 rounded-lg text-center hover:bg-info-100 transition">
                        <span className="block text-info-700 font-semibold">View Reports</span>
                    </Link>
                </div>
            </div>
            
            <div className="card">
                <h2 className="font-semibold text-gray-800 mb-4">System Status</h2>
                <div className="flex items-center space-x-2 text-success-700 bg-success-50 p-3 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>System Operational</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
