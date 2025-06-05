import React, { useEffect, useState } from "react";
import CreatePostModal from "./components/CreatePostModal";
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
import PostCard from "./components/PostCard";
import NavBar from "./components/NavBar";
import handleCreatePost from "./components/functions/handleCreatePost";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newC = {
      id: Date.now(),
      username: "You", 
      text: newComment,
    };
    setComments((prev) => [newC, ...prev]);
    setNewComment('');
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/posts?page=0&size=10", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.content); 
       hljs.highlightAll();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect( () => {
      
    fetchPosts();
      
    
   
  }, []);

  const toggleLike = async (postId, currentlyLiked) => {
  // Optimistically update UI first
  setPosts((prev) =>
    prev.map((post) =>
      post.id === postId
        ? {
            ...post,
            likedByCurrentUser: !currentlyLiked,
            likeCount: currentlyLiked ? post.likeCount - 1 : post.likeCount + 1,
          }
        : post
    )
  );

  // Then hit the backend
  try {
    const endpoint = `http://localhost:8080/posts/${postId}/${currentlyLiked ? "unlike" : "like"}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to ${currentlyLiked ? "unlike" : "like"} post`);
    }
  } catch (err) {
    console.error(err.message);
    // Optional: rollback optimistic update if error occurs
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByCurrentUser: currentlyLiked,
              likeCount: currentlyLiked ? post.likeCount + 1 : post.likeCount - 1,
            }
          : post
      )
    );
    alert("Failed to update like status");
  }
}
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <NavBar showmode={()=>setShowModal(true)}/>

      {/* Feed */}
      <main className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet</p>
        ) : (
          posts.map((post) => (
             <PostCard key={post.id} post={post} toggleLike={toggleLike} />
          ))
        )}
      </main>
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePost}
          setLoading = {()=>setLoading(false)}
          token = {token}
        />
      )}
    </div>
  );
}
