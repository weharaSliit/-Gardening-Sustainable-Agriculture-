import React from 'react';
import ReactionsBar from './ReactionsBar';
import SharePost from './SharePost';
import { Link } from 'react-router-dom';

const VerifiedPosts = ({ posts = [] }) => {
  const verifiedPosts = posts.filter(post => post.verifiedPoster && !post.isDeleted);

  if (verifiedPosts.length === 0) {
    return <p className='text-center text-green-700'>No verified posts available</p>;
  }

  return (
    <div className="mt-16">
      <h3 className="text-3xl font-bold text-emerald-700 mb-6">Top Verified Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {verifiedPosts.map(post => (
          <div key={post.id} className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-md border border-emerald-400 min-h-[350px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Link to={`/post/${post.id}`}>
                  <h3 className="text-2xl font-bold text-green-800 hover:underline">{post.title}</h3>
                </Link>
                <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">
                  Verified
                </span>
              </div>
              <p className="text-green-700 mb-2">{post.content.slice(0, 100)}...</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Verified post visual"
                  className="mt-2 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
            <ReactionsBar postId={post.id || post._id} reactions={post.reactions} />
            <SharePost postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifiedPosts;
