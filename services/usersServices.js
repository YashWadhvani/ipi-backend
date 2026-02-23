// services/usersServices.js
import { http, apiBase } from './http'

/**
 * List users with filters, sorting and pagination.
 * params: { q, role, status, sortBy, sortDir, page, pageSize }
 */
export const listUsers = (params = {}) =>
  http.get(`${apiBase()}/users`, { params }).then(r => r.data)

/** Get a single user by id */
export const getUser = (id) =>
  http.get(`${apiBase()}/users/${id}`).then(r => r.data)

/** Create a new user */
export const createUser = (body) =>
  http.post(`${apiBase()}/users`, body).then(r => r.data)

/** Update a user's basic details */
export const updateUser = (id, body) =>
  http.patch(`${apiBase()}/users/${id}`, body).then(r => r.data)

/** Change role — canonical API helper */
export const setRole = (id, body /* { role: 'ADMIN'|'STAFF'|'MEMBER' } */) =>
  http.patch(`${apiBase()}/users/${id}/role`, body).then(r => r.data)

/** Alias used by some pages */
export const setUserRole = (id, body) => setRole(id, body)

/** Thin wrapper so pages can call updateUserRole(id, 'ADMIN') */
export const updateUserRole = (id, role) => setRole(id, { role })

/** Change status — canonical API helper */
export const setStatus = (id, body /* { status: 'active'|'inactive'|'suspended'|'pending'|'deleted' } */) =>
  http.patch(`${apiBase()}/users/${id}/status`, body).then(r => r.data)

/** Alias used by some pages; accepts string or object */
export const setUserStatus = (id, bodyOrStatus) =>
  typeof bodyOrStatus === 'string'
    ? setStatus(id, { status: bodyOrStatus })
    : setStatus(id, bodyOrStatus)

/** Admin password reset / set. */
export const resetPassword = (id, body /* { password: string } */) =>
  http.post(`${apiBase()}/users/${id}/reset-password`, body).then(r => r.data)

/** Delete a user */
export const deleteUser = (id) =>
  http.delete(`${apiBase()}/users/${id}`).then(r => r.data)
