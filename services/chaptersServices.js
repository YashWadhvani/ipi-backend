// services/chaptersServices.js
import { http, apiBase } from './http';

export const listChapters = (params) =>
  http.get(`${apiBase()}/chapters`, { params }).then((r) => r.data);

export const getChapter = (id) =>
  http.get(`${apiBase()}/chapters/${id}`).then((r) => r.data);

export const createChapter = (payload) =>
  // payload may include: contactName, address (object), contactEmail, contactPhone, image (object)
  http.post(`${apiBase()}/chapters`, payload).then((r) => r.data);

export const updateChapter = (id, payload) =>
  // payload may include: contactName, address (object or null), image (object or null)
  http.patch(`${apiBase()}/chapters/${id}`, payload).then((r) => r.data);

// legacy helpers (still ok to keep)
export const assignChair = (chapterId, body) =>
  http.post(`${apiBase()}/chapters/${chapterId}/assign-chair`, body);

export const addLeadership = (chapterId, body) =>
  http.post(`${apiBase()}/chapters/${chapterId}/leadership`, body);

export const removeLeadership = (chapterId, linkId) =>
  http.delete(`${apiBase()}/chapters/${chapterId}/leadership/${linkId}`).then((r) => r.data);

export const assignRole = (chapterId, body) =>
  http.post(`${apiBase()}/chapters/${chapterId}/assign-role`, body).then((r) => r.data);
