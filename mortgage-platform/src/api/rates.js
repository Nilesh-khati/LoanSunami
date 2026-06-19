import api from './client.js'

export const ratesApi = {
  /** Get active rates (public) */
  getAll: () => api.get('/rates'),

  /** Get all rates including inactive (admin) */
  getAllAdmin: () => api.get('/rates/all'),

  /** Create a new rate (admin) */
  create: (rateData) => api.post('/rates', rateData),

  /** Update a rate (admin) */
  update: (id, updates) => api.put(`/rates/${id}`, updates),

  /** Delete a rate (admin) */
  delete: (id) => api.delete(`/rates/${id}`),
}

export default ratesApi
