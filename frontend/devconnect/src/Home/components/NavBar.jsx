import React from 'react'

function NavBar({showmode}) {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-400">DevConnect</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={showmode}
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
  )
}

export default NavBar
