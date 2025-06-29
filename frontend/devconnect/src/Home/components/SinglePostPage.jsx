import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import hljs from 'highlight.js';
import PostCard from "./PostCard";
import { use } from "react";
import 'highlight.js/styles/github.css';

export default function SinglePostPage({posti}) {
  const { id } = useParams();
  
  const token = localStorage.getItem("token");

  const location = useLocation();
  
  const [post, setPosts] = useState();
  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/get/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data); 
     
      console.log("Fetched posts:", data.content);
       hljs.highlightAll();
    } catch (err) {
      console.error(err.message);
    } 
  };
  const toggleLike = async (Id, currentlyLiked) => {
  // Optimistically update UI first
  setPosts((prev) => ({
      ...prev,
      likedByCurrentUser: !currentlyLiked,
      likeCount: currentlyLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

  // Then hit the backend
  try {
    const endpoint = `http://localhost:8080/posts/${Id}/${currentlyLiked ? "unlike" : "like"}`;
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
    setPosts((prev) => ({
      ...prev,
      likedByCurrentUser: currentlyLiked,
      likeCount: currentlyLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    alert("Failed to update like status");
  }
}

 useEffect(() => {
  fetchPosts();
}, []);



  if (!post) return <div className="text-gray-400 p-6">Loading...</div>;

  return (
    <div className="bg-gray-950 text-white ">    <NavBar/>
    <div className="min-h-screen bg-gray-950 text-white py-6 px-8 max-w-3xl mx-auto">
      <PostCard key={post.id} post={post} toggleLike={toggleLike} />
    </div>
    </div>
  );

}
