import React, { useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import CommentSection from "./CommentSection";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from "lucide-react";

const ReactionsBar = ({ postId }) => {
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.sub || decoded.userId;
  }

  const [reactions, setReactions] = useState({
    like: new Set(),
    heart: new Set(),
    downvote: new Set(),
  });

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchReactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/community/posts/${postId}`,{
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
    });
      const post = response.data;
      setReactions({
        like: new Set(post.reactions?.like || []),
        heart: new Set(post.reactions?.heart || []),
        downvote: new Set(post.reactions?.downvote || []),
      });
      setComments(post.comments || []);
    } catch (error) {
      console.error("Failed to fetch post reactions", error);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const handleReaction = async (type) => {
    if (!userId) {
      alert("Please log in to react.");
      window.location.href = "http://localhost:5173/login";
      return;
    }

    try {
      await axios.post(`http://localhost:8080/community/posts/react/${postId}?userId=${userId}&type=${type}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      fetchReactions(); // Refresh reaction state
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div className="mt-4 p-2 flex flex-col items-start">
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-1 ${reactions.like.has(userId) ? "text-blue-600" : ""}`}
        >
          <ThumbsUp size={20} />
          {reactions.like.size}
        </button>
        <button
          onClick={() => handleReaction("heart")}
          className={`flex items-center gap-1 ${reactions.heart.has(userId) ? "text-red-600" : ""}`}
        >
          <Heart size={20} />
          {reactions.heart.size}
        </button>
        <button
          onClick={() => handleReaction("downvote")}
          className={`flex items-center gap-1 ${reactions.downvote.has(userId) ? "text-gray-500" : ""}`}
        >
          <ThumbsDown size={20} />
          {reactions.downvote.size}
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1"
        >
          <MessageCircle size={20} />
          {comments.length}
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={postId}
          comments={comments}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default ReactionsBar;
