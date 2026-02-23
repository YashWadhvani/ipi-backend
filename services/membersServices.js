import { http, apiBase } from './http';


const unwrap = (p) => p.then((r) => r.data)


// convenience helpers for your tabs
export const listMembersGlobal = ({ q = '', page = 1, pageSize = 40 } = {}) =>
  listMembers({ q, page, pageSize })

export const listMembersLocal = ({ chapterId, q = '', page = 1, pageSize = 40 } = {}) => {
  if (!chapterId) return Promise.resolve({ items: [], total: 0, page, pageSize })
  return listMembers({ q, page, pageSize, chapterId })
}

/**
 * OPTIONAL convenience: one-call search that switches by scope.
 * scope: 'global' | 'local'
 * - For 'local' you must pass chapterId
 */
export const searchMembers = ({ scope = 'global', chapterId, ...params } = {}) => {
  return scope === 'local'
    ? listMembersByChapter(chapterId, params)
    : listMembers(params)
}


export const getMemberPublic = (idOrSlug) =>
  http.get(`${apiBase()}/members/public/${encodeURIComponent(idOrSlug)}`)
      .then(r => r.data)


export const listMembers = (params) =>
  http.get(`${apiBase()}/members`, { params }).then((r) => r.data);

export const getMember = (id) =>
  http.get(`${apiBase()}/members/${id}`).then((r) => r.data);

export const createMember = (payload) =>
  http.post(`${apiBase()}/members`, payload).then((r) => r.data);

export const updateMember = (id, payload) =>
  http.patch(`${apiBase()}/members/${id}`, payload).then((r) => r.data);

export const deleteMember = (id) =>
  http.delete(`${apiBase()}/members/${id}`).then((r) => r.data);

export const addMemberToChapter = (memberId, body) =>
  http.post(`${apiBase()}/members/${memberId}/chapters`, body).then((r) => r.data);

export const updateMemberChapter = (memberId, linkId, body) =>
  http.patch(`${apiBase()}/members/${memberId}/chapters/${linkId}`, body).then((r) => r.data);

export const removeMemberFromChapter = (memberId, linkId) =>
  http.delete(`${apiBase()}/members/${memberId}/chapters/${linkId}`).then((r) => r.data);


  // If you keep regs separate:
export const listMemberRegistrations = (id, params = {}) =>
http.get(`${apiBase()}/members/${id}/registrations`, { params })
    .then(r => r.data)

export const bulkImportMembers = (file, options = {}) => {
  const form = new FormData()
  if (file) form.append('file', file)
  if (options && Object.keys(options).length) {
    // If you want to send JSON options together with file
    form.append('options', JSON.stringify(options))
  }

  return http.post(`${apiBase()}/members/bulk-import`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

export const changeMemberPassword = (id, payload) =>
  http.patch(`${apiBase()}/members/${id}/password`, payload).then(r => r.data);
