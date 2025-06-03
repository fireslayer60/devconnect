// src/components/TiptapEditor.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

const lowlight = createLowlight(common);
lowlight.register('js', js);

export default function TiptapEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'js',
      }),
    ],
    content: content || '<p>Write your post here...</p>',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white text-black">
      <div className="p-2 border-b bg-gray-100 flex gap-2">
        <button
          className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          Code Block
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 prose max-w-none" />
    </div>
  );
}
