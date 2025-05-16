import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../MainComponents/Nav";
import { motion } from "framer-motion";
import { FaChartLine, FaSeedling, FaBook, FaSignOutAlt, FaLeaf, FaBug } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const hoverEffect = {
    scale: 1.03,
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-green-800 flex items-center">
            <FaLeaf className="mr-3" /> Welcome to Your Garden, Admin!
          </h2>
          <p className="text-green-600 mt-2">Nurture and grow your platform ecosystem</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Reports Card */}
          <motion.div 
            variants={item}
            whileHover={hoverEffect}
            className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-green-100 text-6xl">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-700">View Reports</h3>
            <p className="text-gray-600 mb-4">Analyze system performance and user activity trends.</p>
            <button
              onClick={() => navigate("/admin/reports")}
              className="mt-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              View Reports
            </button>
          </motion.div>

          {/* Challenges Card */}
          <motion.div 
            variants={item}
            whileHover={hoverEffect}
            className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-yellow-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-yellow-100 text-6xl">
              <FaSeedling />
            </div>
            <h3 className="text-xl font-bold mb-3 text-yellow-700">Manage Challenges</h3>
            <p className="text-gray-600 mb-4">Cultivate engaging quizzes and learning activities.</p>
            <button
              onClick={() => navigate("/challenge-home")}
              className="mt-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              Go to Challenges
            </button>
          </motion.div>

          {/* Tutorials Card */}
          <motion.div 
            variants={item}
            whileHover={hoverEffect}
            className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-blue-100 text-6xl">
              <FaBook />
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-700">Tutorials</h3>
            <p className="text-gray-600 mb-4">Plant seeds of knowledge with educational content.</p>
            <button
              onClick={() => navigate("/tutorial")}
              className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              Manage Tutorials
            </button>
          </motion.div>

          {/* Users Card */}
          <motion.div 
            variants={item}
            whileHover={hoverEffect}
            className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-purple-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-purple-100 text-6xl">
              <FaBug />
            </div>
            <h3 className="text-xl font-bold mb-3 text-purple-700">User Management</h3>
            <p className="text-gray-600 mb-4">Tend to your community of learners and contributors.</p>
            <button
              onClick={() => navigate("/admin/users")}
              className="mt-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              Manage Users
            </button>
          </motion.div>

          

          {/* Logout Card */}
          <motion.div 
            variants={item}
            whileHover={hoverEffect}
            className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-gray-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-gray-200 text-6xl">
              <FaSignOutAlt />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-700">Session</h3>
            <p className="text-gray-600 mb-4">Leave the garden and return another time.</p>
            <button
              onClick={handleLogout}
              className="mt-3 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              Logout
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="fixed bottom-0 left-0 w-full h-16 bg-green-800 opacity-10 -z-10"></div>
        <div className="fixed top-1/4 right-0 w-32 h-32 rounded-full bg-teal-200 opacity-20 -z-10"></div>
        <div className="fixed bottom-1/3 left-10 w-24 h-24 rounded-full bg-yellow-200 opacity-20 -z-10"></div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-4 text-center">
        <p className="flex items-center justify-center">
          <FaLeaf className="mr-2" /> &copy; 2025 GrowSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;