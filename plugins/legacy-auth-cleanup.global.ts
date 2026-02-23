// runs on both server & client
export default defineNuxtPlugin(() => {
    try {
      // remove legacy cookie 'token'
      const c = useCookie('token', { path: '/' })
      if (c?.value) c.value = null
    } catch {}
  
    if (process.client) {
      try {
        // remove legacy localStorage key
        if (localStorage.getItem('token')) localStorage.removeItem('token')
      } catch {}
    }
  })
  