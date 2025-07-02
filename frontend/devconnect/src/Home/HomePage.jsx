import React, { useEffect, useState } from "react";
import CreatePostModal from "./components/CreatePostModal";
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
import PostCard from "./components/PostCard";
import NavBar from "./components/NavBar";
import handleCreatePost from "./components/functions/handleCreatePost";
import TopFollowers from "./components/TopFollowers";
import { getUserFromJWT } from "../compenents/getUserFromJWT";
import { useInView } from "react-intersection-observer";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  const { ref, inView } = useInView();
  const curUser = getUserFromJWT();

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/posts?page=${page}&size=5`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(prev => [...prev, ...data.content]);
      setHasMore(!data.last);
      hljs.highlightAll();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  const toggleLike = async (postId, currentlyLiked) => {
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

    try {
      const endpoint = `http://localhost:8080/posts/${postId}/${currentlyLiked ? "unlike" : "like"}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
    } catch (err) {
      console.error(err.message);
      // Rollback on error
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <NavBar showmode={() => setShowModal(true)} />

      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {posts.length === 0 && !loading ? (
            <p className="text-center text-gray-500">No posts yet</p>
          ) : (
            <>
              {posts.map((post, index) => (
                <PostCard key={`${post.id}-${index}`} post={post} toggleLike={toggleLike} />
              ))
              }
              {loading && <p className="text-center text-gray-500">Loading more...</p>}
              <div ref={ref}></div>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:block fixed top-20 right-8 w-[280px] py-5">
        <TopFollowers currentUserId={curUser?.id} />
      </div>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePost}
          setLoading={() => setLoading(false)}
          token={token}
        />
      )}
    </div>
  );
}
