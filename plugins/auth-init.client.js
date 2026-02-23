import { useCookie } from '#imports'

export default defineNuxtPlugin(() => {
  const at = useCookie('at')
  if (!at?.value) {
    try {
      const t = localStorage.getItem('accessToken')
      if (t) {
        const re = useCookie('at', {
          sameSite: 'lax',
          secure: false,
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
        re.value = t
      }
    } catch {}
  }
})
