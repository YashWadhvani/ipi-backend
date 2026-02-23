// middleware/event-leadership.js
import { useAuthStore } from '@/stores/auth'
import { http } from '@/services/http'

export default defineNuxtRouteMiddleware(async (to) => {
  // Nuxt 4: client-only guard
  if (import.meta.server) return

  const auth = useAuthStore()

  // hydrate token from storage/cookies
  if (!auth.accessToken && typeof auth.loadFromStorage === 'function') {
    auth.loadFromStorage()
  }

  if (!auth.accessToken) {
    return navigateTo('/login')
  }

  // Always try to ensure we have a full /me payload (member + chapters)
  // Because auth.user in your app is often a "minimal" object.
  const hasChapters =
    Array.isArray(auth.user?.member?.chapters) && auth.user.member.chapters.length >= 0

  if (!auth.user || !hasChapters) {
    try {
      const meRes = await http.get('/me')
      const me = meRes.data

      // If your store has setUser, use it.
      // Otherwise, just set auth.user directly.
      if (typeof auth.setUser === 'function') auth.setUser(me)
      else auth.user = me
    } catch (e) {
      return navigateTo('/login')
    }
  }

  // Global role override
  const globalRole = auth.user?.role
  if (['ADMIN', 'STAFF'].includes(globalRole)) return

  const eventId = to.params.id
  if (!eventId) return navigateTo('/events')

  // Fetch event (CHAPTER/GLOBAL + chapterId)
  let event
  try {
    const res = await http.get(`/events/${eventId}`)
    event = res.data
  } catch (e) {
    return navigateTo('/events')
  }

  // GLOBAL events: allow
  if (event.scope === 'GLOBAL') return

  // CHAPTER events: only leadership for that chapter
  const chapters = auth.user?.member?.chapters || []

  const allowed = chapters.some((mc) => {
    // MemberChapter shape from Prisma:
    // mc.chapterId, mc.role, mc.status
    return (
      mc.status === 'active' &&
      mc.chapterId === event.chapterId &&
      mc.role !== 'MEMBER'
    )
  })

  if (!allowed) {
    return navigateTo('/events')
  }
})
