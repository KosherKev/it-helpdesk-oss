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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Ticket #</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link 
                      to={`/tickets/${ticket._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {ticket.ticketNumber || ticket._id.slice(-6)}
                    </Link>
                  </td>
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                        ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {ticket.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {ticket.priority?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    {ticket.assignedTo?.fullName || ticket.assignedTo?.username || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3">{ticket.createdBy?.fullName || ticket.createdBy?.username || 'Unknown'}</td>
                  <td className="p-3">
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
