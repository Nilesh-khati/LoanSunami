import api from './client.js'

/**
 * Auth API helpers
 */

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async ({ fullName, email, phone, password, confirmPassword }) => {
    const data = await api.post('/auth/signup', { fullName, email, phone, password, confirmPassword })
    // Persist token
    if (data.token) localStorage.setItem('ls_token', data.token)
    return data
  },

  /**
   * Sign in an existing user
   */
  signin: async ({ email, password }) => {
    const data = await api.post('/auth/signin', { email, password })
    if (data.token) localStorage.setItem('ls_token', data.token)
    return data
  },

  /**
   * Get current user profile
   */
  getMe: () => api.get('/auth/me'),

  /**
   * Sign out
   */
  signout: async () => {
    try {
      await api.post('/auth/signout')
    } finally {
      localStorage.removeItem('ls_token')
    }
  },

  /**
   * Update profile
   */
  updateMe: (updates) => api.put('/auth/me', updates),
}

export default authApi
