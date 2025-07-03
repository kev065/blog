"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./types"
import { api } from "./api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      api
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("access_token")
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const response = await api.login({ username, password })
    localStorage.setItem("access_token", response.access_token)

    const userData = await api.getCurrentUser()
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null)
  }

  const isAdmin = user?.is_admin || user?.email === "admin@example.com" || false

  return <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
