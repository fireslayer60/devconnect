import React, { useState } from "react";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("idle");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setMode("searching");
    try {
      const token = localStorage.getItem("token");

      const [usersRes, postsRes] = await Promise.all([
        fetch(`http://localhost:8080/users/users?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8080/posts/posts?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const users = await usersRes.json();
      const posts = await postsRes.json();

      setResults([...users, ...posts]);
      setMode("done");
    } catch (err) {
      console.error(err.message);
      setMode("error");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users or posts..."
        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
      />
      <button
        onClick={handleSearch}
        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm"
      >
        Search
      </button>

      {/* Search Results */}
      {mode === "searching" && <p className="text-sm text-gray-400 mt-2">Searching...</p>}
      {mode === "done" && results.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No results found.</p>
      )}
      {mode === "done" && results.length > 0 && (
        <div className="mt-2 space-y-1">
          {results.map((result) =>
            result.username ? (
              <div key={`user-${result.id}`} className="text-gray-300">
                👤 <span className="font-medium text-indigo-400">{result.username}</span>
              </div>
            ) : (
              <div key={`post-${result.id}`} className="text-gray-300">
                📝 {result.content?.slice(0, 50)}...
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
