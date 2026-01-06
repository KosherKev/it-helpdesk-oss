import { NavLink } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const menu = {
    customer: [
      { name: "Dashboard", path: "/" },
      { name: "My Tickets", path: "/tickets" },
      { name: "Create Ticket", path: "/tickets/new" },
    ],
    technician: [
      { name: "Dashboard", path: "/technician" },
      { name: "Assigned Tickets", path: "/technician/assigned" },
      { name: "Open Tickets", path: "/technician/open" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "All Tickets", path: "/admin/tickets" },
      { name: "Assign Tickets", path: "/admin/assign" },
      { name: "Reports", path: "/admin/reports" },
    ],
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        ServiceHub
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menu[user?.role]?.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-700 text-gray-300"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-sm">
        <p className="mb-2 capitalize">{user?.role}</p>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
