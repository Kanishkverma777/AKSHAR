import api from './axiosClient';

export const getAll   = (params) => api.get('/course-schemes', { params });
export const getById  = (id)     => api.get(`/course-schemes/${id}`);
export const create   = (data)   => api.post('/course-schemes', data);
export const update   = (id, data) => api.put(`/course-schemes/${id}`, data);
export const remove   = (id)     => api.delete(`/course-schemes/${id}`);
