import { useEffect, useState } from "react";
import api from "../services/api";

const AssignedTickets = () => {
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
        setTickets(response.data);
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
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Customer</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map(ticket => (
                  <tr key={ticket._id || ticket.id} className="border-t">
                    <td className="p-3">{ticket._id?.slice(-6) || ticket.id?.slice(-6)}</td>
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3 capitalize">{ticket.priority}</td>
                    <td className="p-3 capitalize">{ticket.status}</td>
                    <td className="p-3">
                      {ticket.createdBy?.fullName || "N/A"}
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
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
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


