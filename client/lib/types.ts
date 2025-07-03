export interface User {
  id: string
  email: string
  username: string
  is_admin?: boolean
}

export interface Post {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  author_id: string
  author?: User
}

export interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  post_id: string
  author_id: string
  author?: User
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface CreatePostData {
  title: string
  content: string
}

export interface CreateCommentData {
  content: string
}
