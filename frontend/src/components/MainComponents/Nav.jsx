import React from "react";
import { Leaf, Sprout, Users, BookOpen, Mail, Info, Bell } from "lucide-react";

const Nav = ({ notifications = [], onNotificationClick }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-lime-500 text-white py-4 px-6 shadow-lg rounded-b-3xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-lime-100" />
          <span className="text-2xl font-extrabold tracking-wider text-white">
            GrowSphere
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8 font-medium text-white text-sm">
          <li className="flex items-center space-x-1 hover:text-lime-200 transition">
            <BookOpen className="w-4 h-4" />
            <a href="/thome">Tutorial</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-lime-200 transition">
            <Users className="w-4 h-4" />
            <a href="#community">Community</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-lime-200 transition">
            <Sprout className="w-4 h-4" />
            <a href="/challenge-home">Challenges</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-lime-200 transition">
            <Info className="w-4 h-4" />
            <a href="#about">About Us</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-lime-200 transition">
            <Mail className="w-4 h-4" />
            <a href="#contact">Contact Us</a>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                <a href="/login">Login</a>
              </li>
              <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                <a href="/register">Signup</a>
              </li>
            </>
          ) : (
            <>
              {/* Notifications Section */}
              <li className="relative">
                <button
                  className="relative"
                  onClick={onNotificationClick} // Trigger notification section toggle
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </li>
              <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-lime-200"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;