import api from './axiosClient';

export const getAll   = (params) => api.get('/academic-sessions', { params });
export const getById  = (year)   => api.get(`/academic-sessions/${year}`);
export const create   = (data)   => api.post('/academic-sessions', data);
export const update   = (year, data) => api.put(`/academic-sessions/${year}`, data);
export const remove   = (year)   => api.delete(`/academic-sessions/${year}`);
