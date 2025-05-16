import React from "react";
import { Leaf, Sprout, Users, BookOpen, Mail, Info, Bell, User } from "lucide-react";

const Nav = ({ notifications = [], onNotificationClick }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="relative overflow-hidden bg-gradient-to-br from-green-800 via-emerald-800 to-teal-900 text-white shadow-xl rounded-b-3xl border-b border-emerald-400/20">
     
      
      <div className="max-w-7xl mx-auto px-6 py-3 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all duration-300 group-hover:rotate-12">
              <Leaf className="w-7 h-7 text-emerald-100" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100 tracking-tight">
              GrowSphere
            </span>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-2">
            <li>
              <a 
                href="/thome" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <BookOpen className="w-5 h-5 text-emerald-100 group-hover:text-white" />
                <span className="font-medium">Tutorial</span>
              </a>
            </li>
            <li>
              <a 
                href="#community" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Users className="w-5 h-5 text-emerald-100 group-hover:text-white" />
                <span className="font-medium">Community</span>
              </a>
            </li>
            <li>
              <a 
                href="/user-challenge-home" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Sprout className="w-5 h-5 text-emerald-100 group-hover:text-white" />
                <span className="font-medium">Challenges</span>
              </a>
            </li>
            <li>
              <a 
                href="/about" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Info className="w-5 h-5 text-emerald-100 group-hover:text-white" />
                <span className="font-medium">About Us</span>
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <Mail className="w-5 h-5 text-emerald-100 group-hover:text-white" />
                <span className="font-medium">Contact Us</span>
              </a>
            </li>
          </ul>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <a 
                  href="/login" 
                  className="px-5 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-5 py-2 bg-white text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <>
                {/* Notifications Section */}
                <button
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors hover:shadow-lg hover:shadow-emerald-500/10"
                  onClick={onNotificationClick}
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Profile Icon */}
            <a
              href="/profile"
              className="p-2 rounded-full hover:bg-green-700 transition-colors"
              title="View Profile"
            >
              <User className="w-6 h-6 text-white" />
            </a>  
                
                {/* Logout Button  */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;