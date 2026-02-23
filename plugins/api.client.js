import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const api = axios.create({ baseURL: config.public.apiBase })

  api.interceptors.request.use((req) => {
    const auth = useAuthStore()
    if (auth.accessToken) {
      req.headers = req.headers || {}
      req.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return req
  })

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const auth = useAuthStore()
      const original = error.config
      if (error.response?.status === 401 && auth.refreshToken && !original.__retried) {
        try {
          const { data } = await axios.post(`${config.public.apiBase}/auth/refresh`, { refreshToken: auth.refreshToken })
          auth.setTokens(data.accessToken, data.refreshToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          original.__retried = true
          return api.request(original)
        } catch (_) {
          auth.logout()
        }
      }
      return Promise.reject(error)
    }
  )

  return { provide: { api } }
})
