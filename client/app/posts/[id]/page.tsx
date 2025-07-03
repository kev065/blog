"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import type { Post } from "@/lib/types"
import { CommentSection } from "@/components/comment-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, User, Edit } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export default function PostPage() {
  const params = useParams()
  const { isAdmin } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string)
    }
  }, [params.id])

  const loadPost = async (id: string) => {
    try {
      const data = await api.getPost(id)
      setPost(data)
    } catch (error: any) {
      setError("Failed to load post")
      console.error("Failed to load post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "The post you are looking for does not exist."}</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        {isAdmin && (
          <Button asChild>
            <Link href={`/admin/posts/${post.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Link>
          </Button>
        )}
      </div>

      {/* Post Header */}
      <article className="mb-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.author && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author.email}</span>
              </div>
            )}
            {post.updated_at !== post.created_at && (
              <Badge variant="secondary">Updated {formatDate(post.updated_at)}</Badge>
            )}
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <Separator className="my-12" />

      {/* Comments Section */}
      <CommentSection postId={post.id} />
    </div>
  )
}
