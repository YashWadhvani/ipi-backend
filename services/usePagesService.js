// services/usePagesService.js
import { http, apiBase } from './http'

const url = (p) => `${apiBase()}${p}`
const ts = () => ({ _ts: Date.now() })

export const listPages = ({ q = '', status = '' } = {}) =>
  http.get(url('/pages'), { params: { q, status, ...ts() } }).then((r) => r.data)

export const createPage = (payload /* { title, slug, blocks, status?, summary?, seo?, css? } */) =>
  http.post(url('/pages'), payload).then((r) => r.data)

export const getPage = (id) =>
  http.get(url(`/pages/${encodeURIComponent(id)}`), { params: ts() }).then((r) => r.data)

/**
 * Fetch a published page by slug.
 * Tries /pages/slug/:slug first, falls back to /pages/by-slug/:slug for backward compatibility.
 * Optional preview support via { preview = false, token = '' } if your API accepts it.
 * Marked as public to avoid sending Authorization & avoid 401 redirect on expired tokens.
 */
// export const getPageBySlug = async (slug, { preview = false, token = '' } = {}) => {
//   const params = { ...ts() }
//   if (preview && token) params.preview = token

//   try {
//     const r = await http.get(url(`/pages/slug/${encodeURIComponent(String(slug))}`), {
//       params,
//       __public: true
//     })
//     return r.data
//   } catch (e) {
//     if (e?.response?.status === 404) {
//       const r2 = await http.get(url(`/pages/by-slug/${encodeURIComponent(String(slug))}`), {
//         params,
//         __public: true
//       })
//       return r2.data
//     }
//     throw e
//   }
// }

// services/usePagesService.js - Fix this
export const updatePage = (id, payload) => {
  console.log('🚀 Sending UPDATE request for page:', id)
  console.log('📤 Payload being sent:', JSON.stringify(payload, null, 2))
  
  // Make sure payload is not empty
  if (!payload || Object.keys(payload).length === 0) {
    console.error('❌ EMPTY PAYLOAD DETECTED!')
    throw new Error('Cannot save with empty payload')
  }
  
  return http.put(url(`/pages/${encodeURIComponent(id)}`), payload)
    .then((r) => {
      console.log('✅ UPDATE response received:', r.data)
      return r.data
    })
    .catch((error) => {
      console.error('❌ UPDATE request failed:', error)
      throw error
    })
}

export const publishPage = (id, note = '') =>
  http.post(url(`/pages/${encodeURIComponent(id)}/publish`), { note }).then((r) => r.data)

export const listVersions = (id) =>
  http.get(url(`/pages/${encodeURIComponent(id)}/versions`)).then((r) => r.data)

export const deletePage = (id) =>
  http.delete(url(`/pages/${encodeURIComponent(id)}`)).then((r) => r.data)


export const getPageBySlug = async (slug, { preview = false, token = '' } = {}) => {
    const safeSlug = String(slug || 'home')
    const params = { ...ts() }
    if (preview && token) params.preview = token
  
    try {
      const r = await http.get(
        url(`/pages/slug/${encodeURIComponent(safeSlug)}`),
        { params, __public: true }
      )
      return r.data
    } catch (e) {
      // Fallback for old API
      if (e?.response?.status === 404) {
        try {
          const r2 = await http.get(
            url(`/pages/by-slug/${encodeURIComponent(safeSlug)}`),
            { params, __public: true }
          )
          return r2.data
        } catch {
          return null // ✅ IMPORTANT
        }
      }
  
      // ✅ NEVER throw during SSR for public pages
      console.error('getPageBySlug API error:', e?.response || e)
      return null
    }
  }
  