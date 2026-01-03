const TechnicianDashboard = () => {
  const stats = [
    { label: "Assigned Tickets", value: 14 },
    { label: "Open Tickets", value: 6 },
    { label: "In Progress", value: 5 },
    { label: "Resolved Today", value: 3 },
  ];

   return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Technician Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">{stat.label}</p>
            <p className="text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-3">My Queue</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Ticket #</th>
              <th className="p-2">Title</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">TKT-1021</td>
              <td className="p-2">WiFi outage</td>
              <td className="p-2 text-red-600">Urgent</td>
              <td className="p-2">In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnicianDashboard;