import { useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/useAuth'
import type { PaginatedResult, PaginationMeta } from '~/types/api'

export const useApiClient = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = (config.public.apiBaseUrl as string) || 'http://localhost:8080/api'
  const { token, logout } = useAuth()

  const getHeaders = (customHeaders?: HeadersInit): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    if (token.value && token.value.trim().length > 0) {
      headers.Authorization = `Bearer ${token.value.trim()}`
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }

    return headers
  }

  const handleHttpError = async (err: any) => {
    const status = err.response?.status || err.status

    if (status === 401) {
      // Session expired or unauthorized
      if (import.meta.client) {
        await logout('/login?sessionExpired=true')
      }
    }

    let message = 'An unexpected server error occurred.'
    if (err.data?.message) {
      message = err.data.message
    } else if (err.data?.error) {
      message = err.data.error
    } else if (err.message) {
      message = err.message
    }

    const enhancedError: any = new Error(message)
    enhancedError.status = status
    enhancedError.data = err.data
    throw enhancedError
  }

  /**
   * Standard GET request
   */
  const get = async <T>(path: string, query?: Record<string, any>): Promise<T> => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = `${apiBaseUrl}${cleanPath}`

    try {
      return await $fetch<T>(url, {
        method: 'GET',
        headers: getHeaders(),
        query
      })
    } catch (err: any) {
      return await handleHttpError(err)
    }
  }

  /**
   * Paginated GET request reading X-Total-* headers
   */
  const getPaginated = async <T>(path: string, query?: Record<string, any>): Promise<PaginatedResult<T>> => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = `${apiBaseUrl}${cleanPath}`

    try {
      const response = await $fetch.raw<T[]>(url, {
        method: 'GET',
        headers: getHeaders(),
        query
      })

      const headers = response.headers
      const totalCount = parseInt(headers.get('x-total-count') || '0', 10)
      const totalPages = parseInt(headers.get('x-total-pages') || '1', 10)
      const currentPage = parseInt(headers.get('x-current-page') || '0', 10)
      const pageSize = parseInt(headers.get('x-page-size') || '50', 10)

      const meta: PaginationMeta = {
        totalCount: totalCount > 0 ? totalCount : (response._data?.length || 0),
        totalPages: totalPages > 0 ? totalPages : 1,
        currentPage,
        pageSize
      }

      return {
        data: response._data || [],
        meta
      }
    } catch (err: any) {
      return await handleHttpError(err)
    }
  }

  /**
   * Standard POST request
   */
  const post = async <T>(path: string, body?: any): Promise<T> => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = `${apiBaseUrl}${cleanPath}`

    try {
      return await $fetch<T>(url, {
        method: 'POST',
        headers: getHeaders(),
        body
      })
    } catch (err: any) {
      return await handleHttpError(err)
    }
  }

  return {
    apiBaseUrl,
    get,
    getPaginated,
    post
  }
}
