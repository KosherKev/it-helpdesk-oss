const OpenTickets = () => {
  const tickets = [
    { id: "TKT-1050", title: "Email access issue", assignedTo: "Unassigned" },
    { id: "TKT-1051", title: "Slow computer", assignedTo: "Alex" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Open Tickets</h1>

      <div className="space-y-3">
        {tickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{ticket.title}</p>
              <p className="text-sm text-gray-500">{ticket.id}</p>
            </div>

            {ticket.assignedTo === "Unassigned" && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Assign to Me
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenTickets;
