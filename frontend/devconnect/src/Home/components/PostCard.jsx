import { useState } from 'react';
import { getUserFromJWT } from '../../compenents/getUserFromJWT';

function PostCard({ post, toggleLike }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      username: getUserFromJWT(), // Replace with actual username if available
      text: newComment,
    };
    setComments([...comments, commentObj]);
    setNewComment('');
  };
  const getComments = (postId)=>{

  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`https://ui-avatars.com/api/?name=${post.username}&background=random&color=random`}
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

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => toggleLike(post.id, post.likedByCurrentUser)}
          className={`transition text-sm font-medium px-3 py-1 rounded-full ${
            post.likedByCurrentUser
              ? 'bg-white text-indigo-400'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          {post.likedByCurrentUser ? '💜 Liked' : '🤍 Like'}
        </button>
        <span className="text-sm text-gray-400">{post.likeCount} likes</span>
        <button
          onClick={() => setShowComments(!showComments)}
          className= {`ml-auto font-medium text-sm rounded-full px-3 py-1 ${showComments
              ? 'bg-white text-indigo-400'
              : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          {showComments ? 'Hide Comments' : 'Comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          <div className="mb-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-1 text-sm text-gray-300 mb-1 ">
                    <img src={`https://ui-avatars.com/api/?name=${comment.username}&background=random&color=random`}
                    className="w-5 h-5 rounded-full border border-gray-700"
                    />
                  <span className="font-semibold text-indigo-400">
                    {comment.username}
                  </span>
                  : {comment.text}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-600"
            />
            <button
              onClick={handleAddComment}
              className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-white"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
