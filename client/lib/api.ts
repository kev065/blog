import type { LoginCredentials, Post, Comment, CreatePostData, CreateCommentData, User } from "./types"

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || "An error occurred")
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text() as T
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    return handleResponse(response)
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    return handleResponse(response)
  },

  // Posts
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`)
    return handleResponse(response)
  },

  async getPost(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`)
    return handleResponse(response)
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  },

  async updatePost(id: string, data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  },

  async deletePost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    })

    return handleResponse(response)
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)
    return handleResponse(response)
  },

  async createComment(postId: string, data: CreateCommentData): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  },

  async updateComment(id: string, data: CreateCommentData): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  },

  async deleteComment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    })

    return handleResponse(response)
  },
}
