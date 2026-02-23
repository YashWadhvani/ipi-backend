// services/http.js
import axios from 'axios'
import { useRuntimeConfig, useCookie } from '#imports'

let _apiBase = ''
export const apiBase = () => {
  if (_apiBase) return _apiBase
  try {
    const cfg = useRuntimeConfig()
    if (cfg?.public?.apiBase) return (_apiBase = cfg.public.apiBase)
  } catch {}
  if (typeof window !== 'undefined' && window.__NUXT__?.config?.public?.apiBase) {
    return (_apiBase = window.__NUXT__.config.public.apiBase)
  }
  if (import.meta?.env?.NUXT_PUBLIC_API_BASE) return (_apiBase = import.meta.env.NUXT_PUBLIC_API_BASE)
  if (process?.env?.NUXT_PUBLIC_API_BASE)    return (_apiBase = process.env.NUXT_PUBLIC_API_BASE)
  return (_apiBase = '')
}

export const assetUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const base = apiBase()
  if (!base) return p
  try {
    const u = new URL(base, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    const origin = `${u.protocol}//${u.host}`
    return p.startsWith('/') ? origin + p : origin + '/' + p
  } catch {
    return p
  }
}

export const authHeaders = () => {
  try {
    // ⚠️ Make sure this cookie name matches your real auth cookie ('at' vs 'token')
    const t = useCookie('at').value
    return t ? { Authorization: `Bearer ${t}` } : {}
  } catch {
    return {}
  }
}

// Internal request
const coreRequest = async (method, url, { data, params, headers, ...rest } = {}) => {
  const baseURL = apiBase()
  const h = { ...(authHeaders()), ...(headers || {}) }
  return axios.request({ method, url, baseURL, data, params, headers: h, ...rest })
}

// Smart helpers: accept (url, payload) OR (url, { data, params, ... })
const withBody = (method) => (url, bodyOrOpts = {}, maybeOpts = {}) => {
  // If caller passed explicit opts object with known keys, respect it.
  const looksLikeOpts =
    bodyOrOpts &&
    typeof bodyOrOpts === 'object' &&
    (Object.prototype.hasOwnProperty.call(bodyOrOpts, 'data') ||
     Object.prototype.hasOwnProperty.call(bodyOrOpts, 'params') ||
     Object.prototype.hasOwnProperty.call(bodyOrOpts, 'headers') ||
     Object.prototype.hasOwnProperty.call(bodyOrOpts, 'timeout'))

  if (looksLikeOpts) {
    return coreRequest(method, url, bodyOrOpts) // expects .data inside
  }

  // Otherwise treat second arg as the JSON body; third arg (if any) are extra opts
  return coreRequest(method, url, { data: bodyOrOpts, ...(maybeOpts || {}) })
}

export const http = {
  get:    (url, opts)             => coreRequest('GET', url, opts),
  delete: (url, opts)             => coreRequest('DELETE', url, opts),
  post:   withBody('POST'),
  put:    withBody('PUT'),
  patch:  withBody('PATCH'),
}
