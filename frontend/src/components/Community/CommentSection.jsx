import React, { useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.sub || decoded.userId;
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }

    try {
      const response = await axios.post(`/community/comment/${postId}?userId=${userId}`, {
        content: comment,
      });

      setComment("");
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full mt-2 p-2 bg-gray-50 rounded-lg">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded mb-2"
        rows={2}
      />
      <button
        onClick={handleAddComment}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Post Comment
      </button>

      <div className="mt-4 space-y-2">
        {comments && comments.length > 0 ? (
          comments.map((c, index) => (
            <div key={index} className="bg-white p-2 border rounded">
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-gray-400">{c.createdAt}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
