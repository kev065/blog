'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, getCurrentUser } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface User {
  email: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch posts', error);
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

    fetchPosts();
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.email}</span>
              <Link href="/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded">
                New Post
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-gray-500 text-white px-4 py-2 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 border rounded">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <Link href={`/posts/${post.id}`} className="text-blue-500">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}