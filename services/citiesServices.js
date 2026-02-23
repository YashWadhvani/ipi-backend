import { http, apiBase } from './http';

export const listCities = () =>
  http.get(`${apiBase()}/cities`, { params: { _ts: Date.now() } }).then((r) => r.data);

export const createCity = (payload /* { name, state?, country? } */) =>
  http.post(`${apiBase()}/cities`, payload).then((r) => r.data);

export const getCity = (id) =>
  http.get(`${apiBase()}/cities/${id}`).then((r) => r.data);

export const updateCity = (id, payload /* { name?, state?, country? } */) =>
  http.patch(`${apiBase()}/cities/${id}`, payload).then((r) => r.data);

export const deleteCity = (id, { force = false } = {}) =>
  http.delete(`${apiBase()}/cities/${id}`, { params: { force } }).then((r) => r.data);
