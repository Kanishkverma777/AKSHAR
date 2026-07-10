import api from './axiosClient';

export const getAll   = (params) => api.get('/employees', { params });
export const getById  = (id)     => api.get(`/employees/${id}`);
export const create   = (data)   => api.post('/employees', data);
export const update   = (id, data) => api.put(`/employees/${id}`, data);
export const remove   = (id)     => api.delete(`/employees/${id}`);
