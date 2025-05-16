import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ 
    title: '', 
    content: '',
    imageUrl: '',
    verifiedPoster: false,
    isDeleted: false,
  });

  useEffect(() => {
    // Fetch post data from API using postId
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/community/posts/${postId}`);
        if (!response.ok) throw new Error('Failed to fetch post data');
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/community/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      alert('Post updated successfully!');
      if (post.verifiedPoster) {
        navigate('/verified');
      }
      else {
        navigate('/community');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      {/* Include Navbar here */}

      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-bold text-green-800 mb-6">Edit Your Post</h1>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <textarea
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        ></textarea>

        <input
          type="text"
          placeholder="Image URL"
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          value={post.imageUrl}
          onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
        />

        <div className="mb-4">
          <label className="mr-2 font-semibold text-green-800">Verified:</label>
          <input
            type="checkbox"
            checked={post.verifiedPoster}
            onChange={(e) => setPost({ ...post, verifiedPoster: e.target.checked })}
          />
        </div>

        <button 
          onClick={handleEditSubmit} 
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditPost;
