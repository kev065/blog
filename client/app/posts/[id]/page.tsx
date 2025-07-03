'use client';

import { useEffect, useState } from 'react';
import { getPost, deletePost, getCurrentUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(params.id);
        setPost(postData);
      } catch (error) {
        console.error('Failed to fetch post', error);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      }
    };

    fetchPost();
    fetchUser();
  }, [params.id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await deletePost(params.id, token);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {user && user.id === post.owner_id && (
        <div className="mt-4">
          <Link href={`/posts/${post.id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
            Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
