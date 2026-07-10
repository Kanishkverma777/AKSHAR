import api from './axiosClient';

export const getAll   = (params) => api.get('/courses', { params });
export const getById  = (id)     => api.get(`/courses/${id}`);
export const create   = (data)   => api.post('/courses', data);
export const update   = (id, data) => api.put(`/courses/${id}`, data);
export const remove   = (id)     => api.delete(`/courses/${id}`);
