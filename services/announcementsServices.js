import { http, apiBase } from './http'

const base = () => `${apiBase()}/announcements`
const un = p => p.then(r => r.data)

export const createAnnouncement = (payload) =>
  un(http.post(base(), payload))

export const updateAnnouncement = (id, payload) =>
  un(http.patch(`${base()}/${id}`, payload))

export const deleteAnnouncement = (id) =>
  un(http.delete(`${base()}/${id}`))

export const listAnnouncements = (params) =>
  un(http.get(base(), { params }))

export const getAnnouncement = (id) =>
  un(http.get(`${base()}/${id}`))

export const listMyAnnouncements = (params) =>
  un(http.get(`${base()}/my/feed/list`, { params }))

export const markAnnouncementRead = (id) =>
  un(http.post(`${base()}/${id}/read`))
