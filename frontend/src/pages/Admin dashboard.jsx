import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/tickets");
        const tickets = res.data;

        const today = new Date().toISOString().split("T")[0];

        const totalTickets = tickets.length;
        const openTickets = tickets.filter(t => t.status === "open").length;
        const resolvedToday = tickets.filter(
          t =>
            t.status === "resolved" &&
            t.updatedAt?.startsWith(today)
        ).length;

        setStats([
          { label: "Total Tickets", value: totalTickets },
          { label: "Open Tickets", value: openTickets },
          { label: "Resolved Today", value: resolvedToday },
        ]);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p className="text-gray-500">{stat.label}</p>
            <p className="text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

