const AdminAllTickets = () => {
  const tickets = [
    {
      id: "TKT-1001",
      title: "Laptop overheating",
      status: "Open",
      priority: "High",
      assignedTo: "Alex",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Tickets</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ticket #</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-t">
                <td className="p-3">{ticket.id}</td>
                <td className="p-3">{ticket.title}</td>
                <td className="p-3">{ticket.status}</td>
                <td className="p-3">{ticket.priority}</td>
                <td className="p-3">{ticket.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllTickets;
