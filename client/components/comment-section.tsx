"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import type { Comment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Edit, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const data = await api.getComments(postId)
      setComments(data)
    } catch (error) {
      console.error("Failed to load comments:", error)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    setIsLoading(true)
    try {
      await api.createComment(postId, { content: newComment })
      setNewComment("")
      await loadComments()
      toast({
        title: "Success",
        description: "Comment posted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      await api.updateComment(commentId, { content: editContent })
      setEditingComment(null)
      setEditContent("")
      await loadComments()
      toast({
        title: "Success",
        description: "Comment updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.deleteComment(commentId)
      await loadComments()
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {user && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isLoading}>
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.author?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{comment.author?.email || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {user && user.id === comment.author_id && (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditing(comment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingComment === comment.id ? (
                <div className="space-y-3">
                  <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
