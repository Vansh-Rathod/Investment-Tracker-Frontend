"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clearAuth, getStoredUser, getToken, isTokenValid, setAuth } from "@/lib/auth"
import { authService } from "@/services/authService"
import type { AuthUser } from "@/types"

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setIsAuthenticated(false)
    router.replace("/login")
  }, [router])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login(email.trim(), password)
      if (!response.success || !response.data) {
        return {
          success: false,
          message: response.message || response.errors?.[0] || "Invalid email or password",
        }
      }

      const { token, refreshToken, user: loggedInUser } = response.data
      if (!token) {
        return { success: false, message: "Login response did not include a token" }
      }

      setAuth(token, refreshToken, loggedInUser)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return { success: true }
    },
    []
  )

  useEffect(() => {
    async function bootstrap() {
      const token = getToken()
      const storedUser = getStoredUser()

      if (!isTokenValid(token) || !storedUser) {
        clearAuth()
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const valid = await authService.validateSession()
      if (!valid) {
        clearAuth()
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      setUser(storedUser)
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    bootstrap()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
