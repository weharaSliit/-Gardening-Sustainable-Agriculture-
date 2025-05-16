import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddPost from './AddPost';
import UserPosts from './UserPosts';
import VerifiedPosts from './VerifiedPosts';
import ReactionsBar from './ReactionsBar';
import { useLocation } from 'react-router-dom';
import VerifyApplication from './VerifyApplication';
import Nav from '../MainComponents/Nav';


const CommunityHome = () => {
  const [posts, setPosts] = useState([]);
  //new search query
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false); //new
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/community/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        //setPosts(data);
        const sortedPosts = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();

  }, []);
  
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 font-growFont overflow-hidden">
      {/* Include Navbar Here */}
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 text-center">
         {/* Search bar top-right */}
        <div className="absolute top-150 right-6">
          <input
            type="text"
            placeholder="Search posts..."
            className="px-4 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          Join the Green Community
        </motion.h1>
        
        <motion.p 
          className="text-xl text-green-700 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Share your experiences, learn from others, and grow together in our vibrant gardening community.
        </motion.p>

        <motion.div 
          className="flex justify-center gap-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Link 
            to="/add-post"
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl"
          >
            Add a Post
          </Link>
        </motion.div>
      </div>

      {/* Posts Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-green-800 mb-4">Recent Posts</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Display Posts */}
          <div className="flex flex-col gap-20">
          <VerifiedPosts posts={posts} />
          <UserPosts posts={posts} />
          </div>

           {/* Apply for Verification Section */}
           <div className="flex justify-center mt-16">
            <button
              onClick={() => setShowVerificationForm(!showVerificationForm)}
              className="px-6 py-3 bg-green-700 text-white rounded-full shadow-md hover:bg-green-800 transition"
            >
              {showVerificationForm ? 'Close Verification Form' : 'Apply for Verification'}
            </button>
          </div>

          {showVerificationForm && (
            <div className="mt-8">
              <VerifyApplication />
            </div>
          )}
        </div>
      </section>
    </div>

    
  );
};

export default CommunityHome;
