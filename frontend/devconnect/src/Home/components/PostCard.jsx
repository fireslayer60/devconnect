import { useState } from 'react';
import { getUserFromJWT } from '../../compenents/getUserFromJWT';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
function PostCard({ post, toggleLike }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const navigate = useNavigate();

  const handleAddComment = async ({postid}) => {
    if (!newComment.trim()) return;
      try {
      const response = await fetch(`http://localhost:8080/posts/${postid}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({content:newComment})
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
   
    } catch (err) {
      console.error(err.message);
    }
    
    
    
    
    setNewComment('');
  };
  const getComments = async ({postid})=>{
    setShowComments(!showComments)
    if(showComments===false){
      try {
      const response = await fetch(`http://localhost:8080/posts/${postid}/comments`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      console.log(data.content);
      setComments([]);
      const commentList = [];
      data.content.map((comment)=>{
        if (!comment.content.trim()) {
        }
        else{
        console.log(comment.username+" "+comment.content);
        commentList.push({
            id: comment.id,
            username: comment.username,
            text: comment.content,
          });
      
        }
      });
      setComments(commentList);
      
   
    } catch (err) {
      console.error(err.message);
    }
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm mb-6 " onClick={()=>navigate(`/posts/${post.id}`, { state: { post } })}>
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
          <FollowButton targetUserId={post.userId} />
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
          onClick={() => getComments({postid:post.id})}
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
              onClick={()=>handleAddComment({postid : post.id})}
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
