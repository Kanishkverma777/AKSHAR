import api from './axiosClient';

export const getAll   = (params) => api.get('/lookups', { params });
export const getById  = (id)     => api.get(`/lookups/${id}`);
export const create   = (data)   => api.post('/lookups', data);
export const update   = (id, data) => api.put(`/lookups/${id}`, data);
export const remove   = (id)     => api.delete(`/lookups/${id}`);
