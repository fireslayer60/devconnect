import React, { useState } from 'react';
import TiptapEditor from './TiptapEditor';
import 'highlight.js/styles/github.css';

export default function CreatePostModal({ onClose, onSubmit ,setLoading,token}) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  

  const handlePost = () => {
    onSubmit({ content, image, token, setLoading});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 scroll-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Create a Post</h2>

        <TiptapEditor content={content} setContent={setContent} />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4 mt-4 text-black"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 rounded">
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
