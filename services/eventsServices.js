// services/eventsServices.js
import { http, apiBase } from './http'

// List (admin/member)
export const listEvents = (params = {}) =>
  http.get(`${apiBase()}/events`, { params }).then(r => r.data)

// Detail by id or slug (admin/member)
export const getEvent = (idOrSlug) =>
  http.get(`${apiBase()}/events/${idOrSlug}`).then(r => r.data)

// Create (admin)
// payload may include: sponsors[], photos[], brochures[]
export const createEvent = (payload) =>
  http.post(`${apiBase()}/events`, payload).then(r => r.data)

// Update (admin)
// payload may include: sponsors[], photos[], brochures[]
export const updateEvent = (id, payload) =>
  http.patch(`${apiBase()}/events/${id}`, payload).then(r => r.data)

// Delete (soft) (admin)
export const deleteEvent = (id) =>
  http.delete(`${apiBase()}/events/${id}`).then(r => r.data)

// Register (member)
export const registerForEvent = (eventId, payload) =>
  http.post(`${apiBase()}/events/${eventId}/register`, payload).then(r => r.data)

// Upload sponsor logo (admin) => { url }
export const uploadSponsorLogo = async (file) => {
  const fd = new FormData()
  fd.append('sponsorLogos', file) // ✅ must match FileFieldsInterceptor field name

  const { data } = await http.post(`${apiBase()}/uploads/events-assets`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  // backend returns { sponsorLogos: [{ url: "/uploads/sponsor-logos/xxx.png" }] }
  return data?.sponsorLogos?.[0] // { url }
}


// ADMIN: list registrations for a given event
export const getEventRegistrations = (eventId) =>
  http.get(`${apiBase()}/events/${eventId}/registrations`).then(r => r.data)

/**
 * Upload event photos (admin) => { items: EventPhoto[] }
 * Backend route: POST /events/:id/photos
 * @param {string} eventId
 * @param {File[]|FileList} files
 * @param {string[]|string} [captions] optional, keep indexes aligned with files
 */
// services/uploadsServices.js (or eventsServices.js if you insist)


export const uploadEventAssets = async ({ sponsorLogos = [], photos = [] }) => {
  const fd = new FormData()
  sponsorLogos.forEach(f => fd.append('sponsorLogos', f))
  photos.forEach(f => fd.append('photos', f))

  const { data } = await http.post(
    `${apiBase()}/uploads/events-assets`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )

  return data
}


/**
 * Delete an event photo (admin)
 * Backend route: DELETE /events/:eventId/photos/:photoId
 */
export const deleteEventPhoto = (eventId, photoId) =>
  http.delete(`${apiBase()}/events/${eventId}/photos/${photoId}`).then(r => r.data)

/**
 * Upload event brochures (admin) => { items: EventBrochure[] }
 * Backend route: POST /events/:id/brochures
 * Accepts PDFs, PNG/JPG, etc.
 * @param {string} eventId
 * @param {File[]|FileList} files
 * @param {string[]|string} [titles] optional titles aligned to files
 */
export const uploadEventBrochures = async (eventId, files, titles) => {
  const fd = new FormData()
  ;[].concat(files || []).forEach(f => fd.append('files', f))
  if (Array.isArray(titles)) titles.forEach(t => fd.append('titles', t))
  else if (typeof titles === 'string') fd.append('titles', titles)

  const { data } = await http.post(`${apiBase()}/events/${eventId}/brochures`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data // { items: [...] }
}

/**
 * Delete an event brochure (admin)
 * Backend route: DELETE /events/:eventId/brochures/:brochureId
 */
export const deleteEventBrochure = (eventId, brochureId) =>
  http.delete(`${apiBase()}/events/${eventId}/brochures/${brochureId}`).then(r => r.data)
