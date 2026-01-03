const UserManagement = () => {
  const users = [
    { id: 1, name: "John Doe", role: "Customer", status: "Active" },
    { id: 2, name: "Alex Smith", role: "Technician", status: "Active" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
