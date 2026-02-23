// middleware/auth-admin-client.ts
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.hydrated) {
    if (process.server) auth.hydrateFromCookies()
    else if (process.client) await auth.hydrate()
  }

  const token = auth.accessToken
  if (!token) return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)

  const parts = String(token).split('.')
  if (parts.length === 3) {
    try {
      const base64 = parts[1]
      const json = process.server
        ? JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
        : JSON.parse(atob(base64))
      if (json?.exp && Date.now() / 1000 > json.exp) {
        auth.clear()
        return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)
      }
    } catch {}
  }

  const role = String(auth.user?.role || '').toUpperCase()
  if (!['ADMIN', 'STAFF'].includes(role)) return navigateTo('/login')
})
