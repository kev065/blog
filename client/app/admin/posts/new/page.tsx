"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewPostPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const post = await api.createPost({ title, content })
      toast({
        title: "Success",
        description: "Post created successfully",
      })
      router.push(`/posts/${post.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">Write and publish a new blog post</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor value={content} onChange={setContent} height={500} />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Publishing..." : "Publish Post"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
