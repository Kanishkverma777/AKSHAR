import api from './axiosClient';

export const getAll   = (params) => api.get('/subjects', { params });
export const getById  = (paperId, schemeId) => api.get(`/subjects/${paperId}/${schemeId}`);
export const create   = (data)   => api.post('/subjects', data);
export const update   = (paperId, schemeId, data) => api.put(`/subjects/${paperId}/${schemeId}`, data);
export const remove   = (paperId, schemeId) => api.delete(`/subjects/${paperId}/${schemeId}`);
