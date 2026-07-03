import api from './client.js'

export const leadsApi = {
  /**
   * Submit a general loan application
   */
  submit: (formData) => api.post('/leads', formData),

  /**
   * Submit a home loan application (dedicated endpoint)
   */
  submitHomeLoan: (formData) => api.post('/leads/home-loan', formData),

  /**
   * Submit a personal loan application (dedicated endpoint)
   */
  submitPersonalLoan: (formData) => api.post('/leads/personal-loan', formData),

  /**
   * Get all leads (admin)
   */
  getAll: ({ page = 1, limit = 20, status, search, sortBy, sortOrder } = {}) => {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('limit', limit)
    if (status && status !== 'All') params.set('status', status)
    if (search) params.set('search', search)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    return api.get(`/leads?${params}`)
  },

  /**
   * Get single lead by ID (admin)
   */
  getById: (id) => api.get(`/leads/${id}`),

  /**
   * Update lead status / notes (admin)
   */
  update: (id, updates) => api.put(`/leads/${id}`, updates),

  /**
   * Delete a lead (admin)
   */
  delete: (id) => api.delete(`/leads/${id}`),

  /**
   * Export leads as CSV (admin)
   */
  exportCSV: async ({ status, search } = {}) => {
    const params = new URLSearchParams()
    if (status && status !== 'All') params.set('status', status)
    if (search) params.set('search', search)
    const csvText = await api.get(`/leads/export/csv?${params}`, { responseType: 'text' })

    // Trigger browser download
    const blob = new Blob([csvText], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loansunami-leads-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}

export default leadsApi
