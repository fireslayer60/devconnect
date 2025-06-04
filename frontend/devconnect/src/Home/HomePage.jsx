import React, { useEffect, useState } from "react";
import CreatePostModal from "./components/CreatePostModal";
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

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
};
 const handleCreatePost = async ({content,image}) => {
    // Later: Send to backend and refresh
    console.log("Created post:", content);
   
    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({content,imageUrl:image})
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.content); 
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">DevConnect</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold px-4 py-2 rounded"
          >
            + Create Post
          </button>
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="User"
            className="w-9 h-9 rounded-full border border-gray-700"
          />
        </div>
      </nav>

      {/* Feed */}
      <main className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${post.username}&background=0D8ABC&color=fff`}
                  alt={post.username}
                  className="w-10 h-10 rounded-full border border-gray-700"
                />
                <div>
                  <p className="font-semibold text-gray-100">{post.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                  className="prose prose-invert max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="rounded-lg border border-gray-800 mb-4"
                />
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(post.id, post.likedByCurrentUser)}
                  className={`transition text-sm font-medium px-3 py-1 rounded-full ${
                    post.likedByCurrentUser
                      ? "bg-white text-indigo-400"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {post.likedByCurrentUser ? "💜 Liked" : "🤍 Like"}
                </button>
                <span className="text-sm text-gray-400">{post.likeCount} likes</span>
              </div>
            </div>
          ))
        )}
      </main>
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
