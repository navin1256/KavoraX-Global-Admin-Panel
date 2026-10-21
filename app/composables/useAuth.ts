import { computed } from 'vue'
import { useState, useCookie, useRuntimeConfig, navigateTo } from '#imports'
import type { AdminUserDto, LoginRequest, LoginResponse } from '~/types/api'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  // Persistent cookies for SSR and hydration safety (1 day expiration)
  const tokenCookie = useCookie<string | null>('kavorax_admin_token', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24
  })

  const userCookie = useCookie<AdminUserDto | null>('kavorax_admin_user', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24
  })

  // SSR-safe state backed by cookies
  const token = useState<string | null>('auth_token', () => tokenCookie.value || null)
  const user = useState<AdminUserDto | null>('auth_user', () => userCookie.value || null)
  const authError = useState<string | null>('auth_error', () => null)

  const isAuthenticated = computed(() => {
    return Boolean(token.value && token.value.trim().length > 0)
  })

  /**
   * Authenticate against Spring Boot POST /api/v1/auth/login
   */
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    authError.value = null
    const url = `${apiBaseUrl}/v1/auth/login`

    try {
      const response = await $fetch<LoginResponse>(url, {
        method: 'POST',
        body: {
          email: credentials.email.trim(),
          password: credentials.password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response || !response.token) {
        throw new Error('Authentication response did not contain a valid session token.')
      }

      // Commit to state and persistent cookies
      token.value = response.token
      user.value = response.user
      tokenCookie.value = response.token
      userCookie.value = response.user

      return response
    } catch (err: any) {
      let errorMessage = 'Authentication failed. Please verify your credentials.'

      if (err.data) {
        if (err.data.message) {
          errorMessage = err.data.message
        } else if (err.data.error) {
          errorMessage = err.data.error
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      authError.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  /**
   * Terminate active frontend session and clean cookies
   */
  const logout = async (redirectPath: string = '/login') => {
    token.value = null
    user.value = null
    tokenCookie.value = null
    userCookie.value = null
    authError.value = null

    await navigateTo(redirectPath)
  }

  return {
    token,
    user,
    authError,
    isAuthenticated,
    login,
    logout
  }
}
