import React from 'react';
import { Link } from 'react-router-dom';
import ReactionsBar from './ReactionsBar';
import SharePost from './SharePost';

const UserPosts = ({ posts }) => {
  const userPosts = posts.filter(post => !post.verifiedPoster && !post.isDeleted);

  if (userPosts.length === 0) {
    return <p className='text-center text-green-700'>No posts available by this user yet</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {userPosts.map((post) => (
        <div key={post.id} className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-md min-h-[350px]">
          <div>
            <Link to={`/post/${post.id}`}>
              <h3 className="text-2xl font-bold text-green-800 mb-2 hover:underline">{post.title}</h3>
            </Link>
            <p className="text-green-700 mb-2">{post.content.slice(0, 100)}...</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-2 mb-4 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
          <ReactionsBar postId={post.id || post._id} reactions={post.reactions} />
          <SharePost postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
