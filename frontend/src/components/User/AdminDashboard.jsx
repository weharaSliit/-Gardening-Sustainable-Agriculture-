import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../MainComponents/Nav";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Cards */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Manage Users</h3>
            <p className="text-gray-600">View, edit, or delete user accounts.</p>
            <button
              onClick={() => navigate("/admin/users")}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Go to Users
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">View Reports</h3>
            <p className="text-gray-600">Analyze system performance and user activity.</p>
            <button
              onClick={() => navigate("/admin/reports")}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              View Reports
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">System Settings</h3>
            <p className="text-gray-600">Configure system preferences and settings.</p>
            <button
              onClick={() => navigate("/admin/settings")}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Settings
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 GrowSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;