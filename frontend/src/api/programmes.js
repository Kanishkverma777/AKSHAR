import api from './axiosClient';

export const getAll   = (params) => api.get('/programmes', { params });
export const getById  = (id)     => api.get(`/programmes/${id}`);
export const create   = (data)   => api.post('/programmes', data);
export const update   = (id, data) => api.put(`/programmes/${id}`, data);
export const remove   = (id)     => api.delete(`/programmes/${id}`);
