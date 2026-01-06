import { useEffect, useState } from "react";
import api from "../services/api";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [techStats, setTechStats] = useState([]);
  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateReports = async () => {
      try {
        const res = await api.get("/tickets");
        const tickets = res.data;

        // ---- Summary ----
        const summaryData = {
          total: tickets.length,
          open: tickets.filter(t => t.status === "open").length,
          inProgress: tickets.filter(t => t.status === "in-progress").length,
          resolved: tickets.filter(t => t.status === "resolved").length,
        };

        // ---- Technician Performance ----
        const techMap = {};
        tickets.forEach(ticket => {
          if (ticket.assignedTo?.fullName) {
            techMap[ticket.assignedTo.fullName] =
              (techMap[ticket.assignedTo.fullName] || 0) + 1;
          }
        });

        const techPerformance = Object.entries(techMap).map(
          ([name, count]) => ({ name, count })
        );

        // ---- Resolution Time ----
        const resolvedTickets = tickets.filter(
          t => t.status === "resolved" && t.updatedAt && t.createdAt
        );

        const avgTime =
          resolvedTickets.reduce((acc, ticket) => {
            const start = new Date(ticket.createdAt);
            const end = new Date(ticket.updatedAt);
            return acc + (end - start);
          }, 0) / (resolvedTickets.length || 1);

        setSummary(summaryData);
        setTechStats(techPerformance);
        setAvgResolutionTime(
          Math.round(avgTime / (1000 * 60 * 60)) // hours
        );
      } catch (err) {
        console.error("Failed to generate reports:", err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    generateReports();
  }, []);

  if (loading) return <p className="p-6">Generating reports...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Tickets Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Tickets Summary</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>Total Tickets: {summary.total}</li>
          <li>Open: {summary.open}</li>
          <li>In Progress: {summary.inProgress}</li>
          <li>Resolved: {summary.resolved}</li>
        </ul>
      </div>

      {/* Technician Performance */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Technician Performance</h2>
        {techStats.length === 0 ? (
          <p className="text-sm text-gray-500">
            No technician data available
          </p>
        ) : (
          <ul className="text-sm space-y-1">
            {techStats.map((tech, index) => (
              <li key={index}>
                {tech.name}: {tech.count} tickets
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resolution Time */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Average Resolution Time</h2>
        <p className="text-sm text-gray-700">
          {avgResolutionTime} hours
        </p>
      </div>
    </div>
  );
};

export default Reports;


