import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "@stores/authStore";

const OpenTickets = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpenTickets = async () => {
      try {
        const res = await api.get("/tickets/unassigned");
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching open tickets:", err);
        setError("Failed to load open tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchOpenTickets();
  }, []);

  const assignToMe = async ticketId => {
    try {
      await api.patch(`/tickets/${ticketId}/assign`, {
        technicianId: user._id,
      });

      // Remove ticket from list
      setTickets(prev =>
        prev.filter(ticket => ticket._id !== ticketId)
      );
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Failed to assign ticket");
    }
  };

  if (loading) return <p className="p-6">Loading open tickets...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Open Tickets</h1>

      {tickets.length === 0 ? (
        <p>No open tickets available.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{ticket.title}</p>
                <p className="text-sm text-gray-500">
                  #{ticket._id.slice(-6)} • Priority: {ticket.priority}
                </p>
              </div>

              <button
                onClick={() => assignToMe(ticket._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Assign to Me
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenTickets;

