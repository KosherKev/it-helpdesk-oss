const AssignTickets = () => {
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Assign Tickets</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <select className="w-full border p-2 rounded">
          <option>Select Ticket</option>
          <option>TKT-1021 - WiFi outage</option>
        </select>

        <select className="w-full border p-2 rounded">
          <option>Select Technician</option>
          <option>Alex</option>
          <option>Mary</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Assign Ticket
        </button>
      </div>
    </div>
  );
};

export default AssignTickets;
