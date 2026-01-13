import { useEffect, useState } from "react";
import api from "../services/api";

const AssignTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsRes = await api.get("/tickets/unassigned");
        setTickets(ticketsRes.data);

        const techRes = await api.get("/users?role=technician");
        setTechnicians(techRes.data);
      } catch (err) {
        console.error("Error loading assignment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(tickets.length / pageSize);
  const paginatedTickets = tickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAssign = async () => {
    if (!selectedTicket || !selectedTech) {
      setMessage("Please select both ticket and technician");
      return;
    }

    try {
      await api.patch(`/tickets/${selectedTicket}/assign`, {
        technicianId: selectedTech,
      });

      setMessage("Ticket assigned successfully");

      // Remove assigned ticket and reset pagination if needed
      setTickets(prev =>
        prev.filter(ticket => ticket._id !== selectedTicket || ticket.id !== selectedTicket)
      );

      setSelectedTicket("");
      setSelectedTech("");

      if ((page - 1) * pageSize >= tickets.length - 1) {
        setPage(prev => Math.max(prev - 1, 1));
      }
    } catch (err) {
      console.error("Assignment failed:", err);
      setMessage("Failed to assign ticket");
    }
  };

  if (loading) {
    return <p className="p-6">Loading assignment data...</p>;
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Assign Tickets</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {message && (
          <p className="text-sm text-center text-blue-600">{message}</p>
        )}

        {/* Ticket Select */}
        <select
          className="w-full border p-2 rounded"
          value={selectedTicket}
          onChange={e => setSelectedTicket(e.target.value)}
        >
          <option value="">Select Ticket</option>
          {paginatedTickets.map(ticket => (
            <option key={ticket._id || ticket.id} value={ticket._id || ticket.id}>
              {ticket._id?.slice(-6) || ticket.id?.slice(-6)} — {ticket.title}
            </option>
          ))}
        </select>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Technician Select */}
        <select
          className="w-full border p-2 rounded"
          value={selectedTech}
          onChange={e => setSelectedTech(e.target.value)}
        >
          <option value="">Select Technician</option>
          {technicians.map(tech => (
            <option key={tech._id} value={tech._id}>
              {tech.fullName}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Assign Ticket
        </button>
      </div>
    </div>
  );
};

export default AssignTickets;

