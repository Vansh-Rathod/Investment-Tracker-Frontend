import apiClient from "./apiClient"
import { getToken, isTokenValid } from "@/lib/auth"
import type { ApiResponse, AuthUser, LoginResponseData } from "@/types"

function normalizeUser(raw: Record<string, unknown>): AuthUser {
  return {
    id: Number(raw.id ?? raw.Id),
    name: String(raw.name ?? raw.Name ?? ""),
    email: String(raw.email ?? raw.Email ?? ""),
    phoneNumber: raw.phoneNumber != null ? String(raw.phoneNumber) : raw.PhoneNumber != null ? String(raw.PhoneNumber) : undefined,
    lastLogin: raw.lastLogin != null ? String(raw.lastLogin) : raw.LastLogin != null ? String(raw.LastLogin) : undefined,
  }
}

function normalizeLoginData(raw: Record<string, unknown>): LoginResponseData {
  const userRaw = (raw.user ?? raw.User) as Record<string, unknown>
  return {
    token: String(raw.token ?? raw.Token ?? ""),
    refreshToken: String(raw.refreshToken ?? raw.RefreshToken ?? ""),
    user: normalizeUser(userRaw),
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>("/Auth/login", {
      email,
      password,
    })
    const body = response.data
    if (body.success && body.data) {
      return {
        ...body,
        data: normalizeLoginData(body.data as Record<string, unknown>),
      }
    }
    return body as ApiResponse<LoginResponseData>
  },

  /** Confirms the token is accepted by the API (not only unexpired locally). */
  validateSession: async (): Promise<boolean> => {
    const token = getToken()
    if (!isTokenValid(token)) return false

    try {
      const response = await apiClient.get<ApiResponse<unknown>>("/Dashboard/summary")
      return response.data?.success === true
    } catch {
      return false
    }
  },
}
