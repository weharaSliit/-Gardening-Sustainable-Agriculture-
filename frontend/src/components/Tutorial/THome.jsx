// src/components/Tutorial/THome.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation Bar - Updated to match image */}
      <nav className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
              </svg>
              <span className="font-bold text-xl">GrowSphere</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/explore-tutorials" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Tutorial
            </Link>
            <Link to="/challenge-home#community" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Community
            </Link>
            <Link to="/challenge-home" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Challenges
            </Link>
            <Link to="/about" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Us
            </Link>
            <Link to="/contact" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
            <Link to="/login" className="ml-2">Login</Link>
            <Link to="/register" className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Using the interactive style from document 2 */}
      <div className="pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <svg className="h-16 w-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-green-700 text-center">Grow with Tutorials,<br />Thrive with Nature</h1>
          <p className="text-xl text-center text-green-800 mb-8 max-w-2xl">
          Create,share,and explore sustainable gardening tutorials to grow your skills
          and help others thrive
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <Link 
              to="/addtutorial" 
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Join Our Garden
            </Link>
            <Link 
              to="/alltutorial" 
              className="px-6 py-3 bg-white text-green-700 border-2 border-green-600 rounded-full hover:bg-green-50 transition-colors transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Explore Knowledge
            </Link>
          </div>
        </div>
      </div>

      {/* Main Actions - Original content with improved styling */}
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



      {/* Tutorial Features & Functions - Redesigned to match image 2 */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Tutorial Features & Functions</h2>
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Tutorial Categories */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2 text-center">Tutorial Categories</h3>
            <p className="text-sm text-green-800">
              Explore tutorials across various gardening categories including organic farming, hydroponics, permaculture, urban gardening, and seasonal planting.
            </p>
          </div>
          
          {/* Skill Sharing Posts */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2 text-center">Skill Sharing Posts</h3>
            <p className="text-sm text-green-800">
              Share your gardening expertise by uploading up to 3 photos or short videos (max: 30 sec) per post with detailed descriptions.
            </p>
          </div>
          
          {/* Learning Progress Updates */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2 text-center">Learning Progress Updates</h3>
            <p className="text-sm text-green-800">
              Track and share your gardening journey with predefined templates to document completed tutorials and new skills learned.
            </p>
          </div>
          
          {/* Learning Plan Sharing */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2 text-center">Learning Plan Sharing</h3>
            <p className="text-sm text-green-800">
              Create structured learning plans with topics, resources, and completion timelines that can be updated as you progress.
            </p>
          </div>
        </div>
      </div>

      
     

      {/* Call to Action */}
      <div className="bg-green-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-800">Ready to Share Your Knowledge?</h2>
          <p className="text-xl text-green-700 mb-8">
            Join our community of gardening enthusiasts and create your first tutorial today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/addtutorial" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Create New Tutorial
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Simple green footer */}
      <footer className="bg-green-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>©  2025 GrowSphere. Cultivating knowledge, growing communities.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;