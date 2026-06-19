import api from './client.js'

export const faqsApi = {
  /** Get active FAQs (public) */
  getAll: () => api.get('/faqs'),

  /** Get all FAQs including inactive (admin) */
  getAllAdmin: () => api.get('/faqs/all'),

  /** Create a FAQ (admin) */
  create: (faqData) => api.post('/faqs', faqData),

  /** Update a FAQ (admin) */
  update: (id, updates) => api.put(`/faqs/${id}`, updates),

  /** Delete a FAQ (admin) */
  delete: (id) => api.delete(`/faqs/${id}`),
}

export default faqsApi
