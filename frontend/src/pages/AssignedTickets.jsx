import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AssignedTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/tickets/assigned");
        setTickets(response.data?.tickets || []);
      } catch (err) {
        console.error("Error fetching assigned tickets:", err);
        setError("Failed to load assigned tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(tickets.length / pageSize);
  const paginatedTickets = tickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return <p className="p-6">Loading assigned tickets...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Tickets</h1>

      {tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        <>
          <div className="card p-0 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-500">Ticket ID</th>
                  <th className="p-4 text-left font-medium text-gray-500">Title</th>
                  <th className="p-4 text-left font-medium text-gray-500">Priority</th>
                  <th className="p-4 text-left font-medium text-gray-500">Status</th>
                  <th className="p-4 text-left font-medium text-gray-500">Customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTickets.map(ticket => (
                  <tr 
                    key={ticket._id || ticket.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket._id || ticket.id}`)}
                  >
                    <td className="p-4 font-mono text-gray-600">{ticket._id?.slice(-6) || ticket.id?.slice(-6)}</td>
                    <td className="p-4 font-medium text-gray-900">{ticket.title || 'No Title'}</td>
                    <td className="p-4">
                        <span className="badge badge-neutral capitalize">{ticket.priority || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                        <span className="badge badge-neutral capitalize">{ticket.status || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {ticket.createdBy?.fullName || ticket.createdBy?.username || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn btn-secondary py-1 px-3 text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn btn-secondary py-1 px-3 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssignedTickets;


