'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, getCurrentUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface User {
  email: string;
}

// Function to create a preview from HTML content
const createPreview = (htmlContent: string, length: number = 150) => {
  const textContent = htmlContent.replace(/<[^>]+>/g, '');
  if (textContent.length <= length) {
    return textContent;
  }
  return textContent.substring(0, length) + '...';
};

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
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
                <Link href="/posts/new" passHref>
                  <Button>New Post</Button>
                </Link>
              </div>
            ) : (
              <Link href="/login" passHref>
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
        </header>

        <main>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    {createPreview(post.content)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/posts/${post.id}`} passHref>
                    <Button variant="outline" className="w-full">Read more</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
