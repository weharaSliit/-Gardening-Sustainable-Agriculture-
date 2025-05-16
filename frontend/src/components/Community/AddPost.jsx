import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  //new - 07/05
  const [imageUrl, setImageUrl] = useState('');;
  const navigate = useNavigate();

  const handlePostSubmit = async () => {
   // console.log("Button clicked!"); //debug line

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/community/posts', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content, 
          imageUrl,
          verifiedPoster: false,
       }), // Include imageUrl in the request body
      });

      if (!response.ok) {
        navigate('/community', { replace : true}); // Redirect to Community Home on success
        window.location.reload();
    } else {
        const error = await response.text();
        console.error('Post creation failed:', error);
        alert('Failed to create post. Please try again.'); // Redirect to Community Home on error
    }

  } catch(err){
    console.error('Error:', err);
    alert('An error occurred. Please try again later.');
  }

    // Handle post submission logic (API call)
    // Example: savePost(title, content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      {/* Include Navbar here */}

      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.h1 
          className="text-5xl font-bold mb-6 text-green-800"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          Add Your Gardening Post
        </motion.h1>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </motion.div>

        <motion.button
          onClick={handlePostSubmit}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Post
        </motion.button>
      </div>
    </div>
  );
};

export default AddPost;
