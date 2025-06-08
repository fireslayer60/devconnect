import { useState, useEffect } from "react";

function FollowButton({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem("token");

  // 1. Check if current user is following the target user
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${targetUserId}/is-following`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to check follow status");

        const result = await res.json(); // true/false
        setIsFollowing(result);
      } catch (err) {
        console.error("Error checking follow status:", err.message);
      }
    };

    checkFollowStatus();
  }, [targetUserId]);

  // 2. Toggle follow/unfollow
  const handleFollowToggle = async () => {
    const endpoint = isFollowing
      ? `http://localhost:8080/users/${targetUserId}/unfollow`
      : `http://localhost:8080/users/${targetUserId}/follow`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(endpoint);

      if (!res.ok) throw new Error("Failed to follow/unfollow");

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-3 py-1 text-sm rounded-full ${
        isFollowing
          ? "bg-white text-indigo-600 border border-gray-600"
          : "bg-indigo-600 text-white hover:bg-indigo-500"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
