import Link from "next/link"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getExcerpt = (content: string, maxLength = 150) => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link href={`/posts/${post.id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{getExcerpt(post.content)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
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
      </CardFooter>
    </Card>
  )
}
