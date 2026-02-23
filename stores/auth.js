// stores/auth.js
import { defineStore } from 'pinia'
import { useCookie } from '#imports'

function safeParseUser(val) {
  if (!val) return null
  if (typeof val === 'object') return val
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      // some environments percent-encode cookies:
      try { return JSON.parse(decodeURIComponent(val)) } catch { /* noop */ }
    }
  }
  return null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    hydrated: false,
  }),
  getters: {
    isLoggedIn: (s) => !!s.accessToken,
  },
  actions: {
    hydrateFromCookies() {
      const at = useCookie('at').value
      const rt = useCookie('rt').value
      const rawU = useCookie('u').value

      const parsedUser = safeParseUser(rawU)

      // If the cookie is garbage like "[object Object]", nuke it
      if (rawU && !parsedUser) {
        useCookie('u', { path: '/' }).value = null
      }

      this.accessToken = at || null
      this.refreshToken = rt || null
      this.user = parsedUser
      this.hydrated = true
    },

    hydrate() {
      if (process.client) {
        this.accessToken = localStorage.getItem('accessToken')
        this.refreshToken = localStorage.getItem('refreshToken')
        const u = localStorage.getItem('user')
        this.user = u ? safeParseUser(u) : null
        this.hydrated = true
      }
    },

    setTokens(at, rt) {
      this.accessToken = at
      this.refreshToken = rt || null
      useCookie('at', { path: '/', sameSite: 'lax', secure: false, maxAge: 60*60*24*7 }).value = at
      useCookie('rt', { path: '/', sameSite: 'lax', secure: false, maxAge: 60*60*24*30 }).value = rt || ''
      if (process.client) {
        localStorage.setItem('accessToken', at)
        if (rt) localStorage.setItem('refreshToken', rt)
      }
    },

    setUser(u) {
      this.user = u || null
      // ALWAYS write JSON string to cookie
      useCookie('u', { path: '/', sameSite: 'lax', secure: false, maxAge: 60*60*24*7 }).value =
        u ? JSON.stringify(u) : ''
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(u || {}))
      }
    },

    clear() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      useCookie('at', { path: '/' }).value = null
      useCookie('rt', { path: '/' }).value = null
      useCookie('u',  { path: '/' }).value = null
      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },
  },
})