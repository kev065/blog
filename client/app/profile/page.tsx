"use client"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>Your account details and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Role</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Administrator" : "User"}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">User ID</p>
              <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Administrator Privileges</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and edit blog posts</li>
                <li>• Delete posts and comments</li>
                <li>• Access admin dashboard</li>
                <li>• Manage user content</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
