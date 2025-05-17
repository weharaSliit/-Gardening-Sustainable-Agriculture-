// src/components/Tutorial/THome.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../MainComponents/Nav';
import { BookOpen, Users, Sun, Award } from 'lucide-react';

export default function THome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Tutorial Categories",
      desc: "Explore tutorials across various gardening categories including organic farming, hydroponics, permaculture, urban gardening, and seasonal planting."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Skill Sharing Posts",
      desc: "Share your gardening expertise by uploading up to 3 photos or short videos (max: 30 sec) per post with detailed descriptions."
    },
    {
      icon: <Sun className="w-8 h-8 text-green-600" />,
      title: "Learning Progress Updates",
      desc: "Track and share your gardening journey with predefined templates to document completed tutorials and new skills learned."
    },
    {
      icon: <Award className="w-8 h-8 text-green-600" />,
      title: "Learning Plan Sharing",
      desc: "Create structured learning plans with topics, resources, and completion timelines that can be updated as you progress."
    }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Main navigation bar */}
      <Nav />

      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <svg
              className="h-16 w-16 text-green-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-green-700 text-center">
            Grow with Tutorials,<br />Thrive with Nature
          </h1>
          <p className="text-xl text-green-800 mb-8 max-w-2xl text-center">
            Create, share, and explore sustainable gardening tutorials to grow your
            skills and help others thrive
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <Link
              to="/addtutorial"
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Join Our Garden
            </Link>
            <Link
              to="/explore-tutorials"
              className="px-6 py-3 bg-white text-green-700 border-2 border-green-600 rounded-full hover:bg-green-50 transition-all transform hover:scale-105 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              Explore Knowledge
            </Link>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Create New Tutorial */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Create New Tutorial</h2>
            <p className="text-gray-600 mb-6">
              Add a new sustainable gardening tutorial to share your knowledge with the community
            </p>
            <Link
              to="/addtutorial"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform hover:scale-105 duration-200"
            >
              Add Tutorial
            </Link>
          </div>

          {/* Browse Tutorials */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Browse Tutorials</h2>
            <p className="text-gray-600 mb-6">
              View and manage all existing tutorials in the system with filtering options
            </p>
            <Link
              to="/alltutorial"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform hover:scale-105 duration-200"
            >
              All Tutorials
            </Link>
          </div>

          {/* View Dashboard */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">View Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Return to the main dashboard and tutorial display to track your progress
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors transform hover:scale-105 duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Tutorial Features & Functions */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Tutorial Features & Functions</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-sm">{feature.desc}</p>
            </div>
          ))}
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

      {/* Footer */}
      <footer className="bg-green-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} GrowSphere. Cultivating knowledge, growing communities.</p>
        </div>
      </footer>
    </div>
  );
}
