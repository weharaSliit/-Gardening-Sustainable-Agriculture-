// SharePost.js
import React from 'react';
import { Share2 } from 'lucide-react';

const SharePost = ({ postId }) => {
  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Post link copied to clipboard!');
  };

  return (
    <button onClick={handleShareClick} className="hover:text-green-900">
      <Share2 size={16} />
    </button>
  );
};

export default SharePost;
