import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactionsBar from './ReactionsBar';
import CommentSection from './CommentSection';
import SharePost from './SharePost';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  //new
  const [reactionCounts, setReactionCounts] = useState({});
  const [commentCount, setCommentCount] = useState(0);

  // Moved fetchPost outside useEffect so it can be reused
  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/community/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/community/posts/${id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  //new
  const fetchCounts = async () => {
    try{
      const [reactionRes, commentRes] = await Promise.all([
        axios.get(`http://localhost:8080/community/posts/reactions/${id}/count`),
        axios.get(`http://localhost:8080/community/posts/comments/${id}/count`)
      ]);
      setReactionCounts(reactionRes.data);;
      setCommentCount(commentRes.data);
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(parsedToken.userId);
      } catch (e) {
        console.error("Invalid token:", e);
      }
    }

    fetchPost();
    fetchComments();
    fetchCounts();
  }, [id]);

  const scrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  const handleDownload = async () => {
    const postElement = document.getElementById("post-content");
    if (!postElement) {
      console.error("Post content element not found");
      return;
    }

    try {
      const canvas = await html2canvas(postElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`post-${id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 bg-white min-h-screen font-growFont">
      {/* Buttons Section */}
      <div className="flex flex-wrap gap-3 items-center justify-end mb-4">
        <button onClick={scrollToComments} className="bg-gray-100 hover:bg-green-100 px-3 py-1 rounded-md text-sm">💬 Comments</button>
        <button onClick={handleShare} className="bg-gray-100 hover:bg-green-100 px-3 py-1 rounded-md text-sm">🔗 Share</button>
        <button onClick={handleDownload} className="bg-gray-100 hover:bg-green-100 px-3 py-1 rounded-md text-sm">⬇️ Download</button>
      </div>

      {/* Post Content */}
      <div id="post-content">
        <h1 className="text-3xl font-bold text-green-800 mb-4">{post.title}</h1>
        <p className="text-green-700 mb-4 whitespace-pre-line">{post.content}</p>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post visual"
            className="mb-6 w-full max-h-[500px] object-cover rounded-lg"
          />
        )}
      </div>

      {/* Reactions */}
      <ReactionsBar
        postId={post.id}
        userId={userId}
        reactions={post.reactions}
        onCommentAdded={() => {
          fetchPost();
          fetchComments();
          fetchCounts();
        }}
      />

      {/* Comments */}
      <div id="comments-section" className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded shadow-sm">
                <div className="flex items-center space-x-3">
                  {comment.imageUrl ? (
                    <img
                      src={comment.imageUrl}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                  )}
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Share Footer */}
      <SharePost postId={post.id} />
    </div>
  );
};

export default PostDetails;
