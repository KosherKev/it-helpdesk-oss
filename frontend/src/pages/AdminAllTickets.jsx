import { useState, useEffect } from "react";
import ticketService from "../services/ticketService";
import { Link } from "react-router-dom";

const AdminAllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getAllTickets();
      if (res.success) {
        setTickets(res.data?.tickets || []);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading tickets...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Tickets</h1>

      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Ticket #</th>
              <th className="p-4 text-left font-medium text-gray-500">Title</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Priority</th>
              <th className="p-4 text-left font-medium text-gray-500">Assigned To</th>
              <th className="p-4 text-left font-medium text-gray-500">Created By</th>
              <th className="p-4 text-left font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id || ticket.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link 
                      to={`/tickets/${ticket._id || ticket.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      {ticket.ticketNumber || ticket.id.slice(-6)}
                    </Link>
                  </td>
                  <td className="p-4 font-medium text-gray-900">{ticket.title || 'No Title'}</td>
                  <td className="p-4">
                    <span className={`badge 
                      ${ticket.status === 'open' ? 'badge-info' : 
                        ticket.status === 'in-progress' ? 'badge-warning' : 
                        ticket.status === 'resolved' ? 'badge-success' : 
                        'badge-neutral'}`}>
                      {ticket.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`badge
                      ${ticket.priority === 'urgent' ? 'badge-danger' :
                        ticket.priority === 'high' ? 'badge-warning' :
                        ticket.priority === 'medium' ? 'badge-info' :
                        'badge-neutral'}`}>
                      {ticket.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {ticket.assignedTo?.fullName || ticket.assignedTo?.username || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">{ticket.createdBy?.fullName || ticket.createdBy?.username || 'Unknown'}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllTickets;
