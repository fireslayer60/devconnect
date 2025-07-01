import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Home/components/NavBar";

function VisitPage() {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="max-w-2xl mx-auto mt-10 px-6">
            <div className="bg-gray-900 border border-gray-800 shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
                <img
                src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                alt={user.username}
                className="w-16 h-16 rounded-full border-2 border-indigo-500"
                />
                <div>
                <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                <p className="text-sm text-gray-400">{user.bio || "No bio available"}</p>
                </div>
            </div>
            <div className="flex gap-6 mt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                <span className="text-indigo-400 font-semibold">{user.followerCount}</span>
                <span>Followers</span>
                </div>
                <div className="flex items-center gap-1">
                <span className="text-indigo-400 font-semibold">{user.followingCount}</span>
                <span>Following</span>
                </div>
            </div>
            </div>
        </div>
        </div>

  );
}

export default VisitPage;
