import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SinglePostPage({posti}) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      
    };

    fetchPost();
  }, [id]);

  if (!post) return <div className="text-gray-400 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white py-6 px-8 max-w-3xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${post.username}&background=random&color=random`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-bold">{post.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="post"
            className="mt-4 rounded-lg border border-gray-700"
          />
        )}
      </div>
    </div>
  );
}
