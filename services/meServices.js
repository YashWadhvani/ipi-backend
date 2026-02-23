import { http, apiBase } from './http';

export const getMe = () =>
  http.get(`${apiBase()}/me`).then(r => r.data);

export const getMyRegistrations = () =>
  http.get(`${apiBase()}/me/registrations`).then(r => r.data)
 // { items, total }

export const getMyUpcomingEvents = () =>
  http.get(`${apiBase()}/me/upcoming-events`).then(r => r.data) // array


export const updateMeMember = (payload) =>
  http.patch(`${apiBase()}/me/member`, payload).then(r => r.data);

export const updateMeProfile = (payload) =>
  http.patch(`${apiBase()}/me/profile`, payload).then(r => r.data);

export const updateMeContact = (payload) =>
  http.patch(`${apiBase()}/me/contact`, payload).then(r => r.data);

export const changeMyPassword = (payload) =>
  http.patch(`${apiBase()}/me/password`, payload).then(r => r.data);

export const uploadMyPhoto = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return http.post(`${apiBase()}/me/photo`, fd).then(r => r.data);
};

export const updateMePrivacy = (payload) =>
  http.patch(`${apiBase()}/me/privacy`, payload).then(r => r.data)


// Registrations of the logged-in member
