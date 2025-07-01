import { useEffect, useState } from "react";
import SearchBox from "./SearchBox.jsx"; 
import { useNavigate } from 'react-router-dom';

const TopFollowers = () => {
  const [followers, setFollowers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch current user");
        const user = await res.json();
        setCurrentUserId(user.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTopFollowers = async () => {
      if (!currentUserId) return;

      try {
        const response = await fetch(
          `http://localhost:8080/users/${currentUserId}/followers?page=0&size=5`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch followers");
        const data = await response.json();
        setFollowers(data.content);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchTopFollowers();
  }, [currentUserId]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-md w-full">
      {/* Search */}
      <SearchBox />

      {/* Top Followers */}
      <h2 className="text-lg font-semibold text-white mb-4">Top Followers</h2>
      {followers.length === 0 ? (
        <p className="text-sm text-gray-500">No followers yet</p>
      ) : (
        <ul className="space-y-3">
          {followers.map((f) => (
            <li key={f.id} className="flex items-center gap-3" onClick={()=>{navigate(`/profile/${f.id}`)}}>
              <img
                src={`https://ui-avatars.com/api/?name=${f.username}&background=random&color=random`}
                alt={f.username}
                className="w-8 h-8 rounded-full border border-gray-700"
              />
              <div>
                <p className="text-sm text-white font-medium">{f.username}</p>
                <p className="text-xs text-gray-500">{f.followerCount} followers</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopFollowers;
