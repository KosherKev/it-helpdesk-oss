const AdminDashboard = () => {
  const stats = [
    { label: "Total Tickets", value: 420 },
    { label: "Open Tickets", value: 78 },
    { label: "Resolved Today", value: 25 },
    { label: "Total Users", value: 64 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">{stat.label}</p>
            <p className="text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
