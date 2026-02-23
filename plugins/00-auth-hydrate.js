// plugins/00-auth-hydrate.js
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    if (!auth.hydrated) auth.hydrateFromCookies()
  })
  