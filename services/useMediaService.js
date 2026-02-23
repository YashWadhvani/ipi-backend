// services/useMediaService.js
import { http, apiBase } from './http'

export const listMedia = ({ q = '', kind = '', page = 1, pageSize = 30, folderId = '' } = {}) =>
  http
    .get(`${apiBase()}/media`, { params: { q, kind, page, pageSize, folderId, _ts: Date.now() } })
    .then((r) => r.data)

export const getMedia = (id) =>
  http.get(`${apiBase()}/media/${id}`).then((r) => r.data)

export const uploadMedia = (file, { title, alt, caption, description, folderId } = {}) => {
  const fd = new FormData()
  fd.append('file', file)
  if (title) fd.append('title', title)
  if (alt) fd.append('alt', alt)
  if (caption) fd.append('caption', caption)
  if (description) fd.append('description', description)
  if (folderId) fd.append('folderId', folderId)
  return http.post(`${apiBase()}/media/upload`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

export const updateMedia = (id, payload) =>
  http.put(`${apiBase()}/media/${id}`, payload).then((r) => r.data)

export const deleteMedia = (id) =>
  http.delete(`${apiBase()}/media/${id}`).then((r) => r.data)
