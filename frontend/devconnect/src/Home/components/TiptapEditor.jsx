// src/components/TiptapEditor.jsx
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github.css';

import { 
  BoldIcon as Bold, 
  ItalicIcon as Italic, 
  CodeBracketIcon as Code, 
  StrikethroughIcon as Strike 
} from '@heroicons/react/24/outline';


const lowlight = createLowlight(common);
lowlight.register('js', js);
lowlight.register('bash', bash);

export default function TiptapEditor({ content, setContent }) {
  const [language, setLanguage] = useState('js');

  const languageMap = { js: 'js', bash: 'bash' };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: languageMap[language],
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    console.log(selectedLanguage);
    setLanguage(selectedLanguage);
    editor
      ?.chain()
      .focus()
      .updateAttributes('codeBlock', { language: languageMap[selectedLanguage] })
      .run();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white text-black">
      {/* Toolbar */}
      <div className="px-4 py-2 border-b bg-gray-50 flex flex-wrap items-center gap-3">
        {/* Formatting icons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="p-2 rounded hover:bg-gray-200 transition"
            title="Bold"
          >
            <Bold className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="p-2 rounded hover:bg-gray-200 transition"
            title="Italic"
          >
            <Italic className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className="p-2 rounded hover:bg-gray-200 transition"
            title="Strike"
          >
            <Strike className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className="p-2 rounded hover:bg-gray-200 transition"
            title="Code Block"
          >
            <Code className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Language Dropdown */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="ml-auto px-3 py-1.5 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          {Object.keys(languageMap).map((key) => (
            <option key={key} value={key}>
              {key.toUpperCase()}
            </option>
          ))}
        </select>
      </div>



      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 text-black focus:outline-none [&_[contenteditable]]:outline-none"
      />
    </div>
  );
}
