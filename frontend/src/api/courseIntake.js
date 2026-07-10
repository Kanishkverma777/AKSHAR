import api from './axiosClient';

export const getAll   = (params) => api.get('/course-intake', { params });
export const getById  = (courseId, acadYear) => api.get(`/course-intake/${courseId}/${acadYear}`);
export const create   = (data)   => api.post('/course-intake', data);
export const update   = (courseId, acadYear, data) => api.put(`/course-intake/${courseId}/${acadYear}`, data);
export const remove   = (courseId, acadYear) => api.delete(`/course-intake/${courseId}/${acadYear}`);
