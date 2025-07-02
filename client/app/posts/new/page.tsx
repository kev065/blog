'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import { createPost } from '@/lib/api';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await createPost({ title, content }, token);
          router.push('/');
        } catch (error) {
          console.error('Failed to create post', error);
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Editor
            apiKey="xhfrzfawrdlxqnltp24hr7yttftmdr86ptngg4rlr6k3km0l" // TinyMCE API key
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>This is the initial content of the editor.</p>"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | '
                + 'bold italic forecolor | alignleft aligncenter '
                + 'alignright alignjustify | bullist numlist outdent indent | '
                + 'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
}
