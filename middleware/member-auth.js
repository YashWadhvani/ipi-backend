export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.hydrated) {
    await auth.hydrateFromCookies()
  }

  if (!auth.accessToken) {
    return navigateTo('/login')
  }

  // 🚨 DO NOT hard-fail if user missing — let page fetch /me
  if (auth.user && !['MEMBER','ADMIN','STAFF'].includes(auth.user.role)) {
    return navigateTo('/login')
  }
})
