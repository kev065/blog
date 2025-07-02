'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import { getPost, updatePost } from '@/lib/api';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(params.id);
        setTitle(postData.title);
        if (editorRef.current) {
          editorRef.current.setContent(postData.content);
        }
      } catch (error) {
        console.error('Failed to fetch post', error);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await updatePost(params.id, { title, content }, token);
          router.push(`/posts/${params.id}`);
        } catch (error) {
          console.error('Failed to update post', error);
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Edit Post</h1>
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
            initialValue=""
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
          Update Post
        </button>
      </form>
    </div>
  );
}
