"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { isPublicRoute } from "@/lib/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { Spinner } from "@/components/ui/spinner"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const isPublic = isPublicRoute(pathname)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !isPublic) {
      router.replace("/login")
      return
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/")
    }
  }, [isAuthenticated, isLoading, isPublic, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isAuthenticated && pathname === "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return <>{children}</>
}
