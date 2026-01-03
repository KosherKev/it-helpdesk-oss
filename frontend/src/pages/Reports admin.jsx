const Reports = () => {
  const reports = [
    { title: "Tickets Summary", description: "Overall ticket statistics" },
    { title: "Technician Performance", description: "Performance metrics" },
    { title: "Resolution Time", description: "Average resolution duration" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold">{report.title}</h2>
            <p className="text-gray-500 text-sm">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
