// src/components/Tutorial/THome.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
              </svg>
              <span className="font-bold">GrowSphere</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm">Tutorial</Link>
            <Link to="/" className="text-sm">Community</Link>
            <Link to="/" className="text-sm">Challenges</Link>
            <Link to="/" className="text-sm">About Us</Link>
            <Link to="/" className="text-sm">Contact Us</Link>
            <div className="ml-6 flex items-center">
              <Link to="/" className="text-sm mr-4">Login</Link>
              <Link to="/" className="bg-white text-green-500 px-4 py-1 rounded-md text-sm">Signup</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-green-500 text-white py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl font-bold mb-2">Tutorial Management</h1>
          <p className="text-lg">
            Create, share, and explore sustainable gardening tutorials to grow your skills and help others thrive
          </p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Create New Tutorial */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Create New Tutorial</h2>
            <p className="text-gray-600 mb-6">
              Add a new sustainable gardening tutorial to share your knowledge with the community
            </p>
            <Link 
              to="/addtutorial" 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform transition-transform duration-200 hover:scale-105"
            >
              Add Tutorial
            </Link>
          </div>
          
          {/* Browse Tutorials */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Browse Tutorials</h2>
            <p className="text-gray-600 mb-6">
              View and manage all existing tutorials in the system with filtering options
            </p>
            <Link 
              to="/alltutorial" 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform transition-transform duration-200 hover:scale-105"
            >
              All Tutorials
            </Link>
          </div>
          
          {/* View Dashboard */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">View Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Return to the main dashboard and tutorial display to track your progress
            </p>
            <Link 
              to="/" 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform transition-transform duration-200 hover:scale-105"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Tutorial Features Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Tutorial Features & Functions</h2>
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Tutorial Categories */}
          <div className="bg-white rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Tutorial Categories</h3>
            <p className="text-sm text-gray-600">
              Explore tutorials across various gardening categories including organic farming, hydroponics, permaculture, urban gardening, and seasonal planting.
            </p>
          </div>
          
          {/* Skill Sharing Posts */}
          <div className="bg-white rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Skill Sharing Posts</h3>
            <p className="text-sm text-gray-600">
              Share your gardening expertise by uploading up to 3 photos or short videos (max: 30 sec) per post with detailed descriptions.
            </p>
          </div>
          
          {/* Learning Progress Updates */}
          <div className="bg-white rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Learning Progress Updates</h3>
            <p className="text-sm text-gray-600">
              Track and share your gardening journey with predefined templates to document completed tutorials and new skills learned.
            </p>
          </div>
          
          {/* Learning Plan Sharing */}
          <div className="bg-white rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Learning Plan Sharing</h3>
            <p className="text-sm text-gray-600">
              Create structured learning plans with topics, resources, and completion timelines that can be updated as you progress.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2023 GrowSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;