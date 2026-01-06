import Sidebar from "@components/Sidebar";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
