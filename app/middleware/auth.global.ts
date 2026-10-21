import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const targetPath = to.path

  // Public routes that do not require authentication
  const isLoginPage = targetPath === '/login' || targetPath === '/admin/login'

  // Protected Admin Routes: /admin and any sub-path (except /admin/login)
  const isProtectedAdminRoute = targetPath.startsWith('/admin') && targetPath !== '/admin/login'

  if (isProtectedAdminRoute && !isAuthenticated.value) {
    // Preserve the requested destination safely for post-login redirect
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // If user is already authenticated and visits login page, route to dashboard
  if (isLoginPage && isAuthenticated.value) {
    const redirectUrl = (to.query.redirect as string) || '/admin'
    return navigateTo(redirectUrl)
  }

  // Root route "/" triage
  if (targetPath === '/' || targetPath === '') {
    if (isAuthenticated.value) {
      return navigateTo('/admin')
    } else {
      return navigateTo('/login')
    }
  }
})
