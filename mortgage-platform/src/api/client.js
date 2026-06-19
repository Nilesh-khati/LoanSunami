/**
 * Base API client — handles auth token and error normalization
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Get stored auth token
 */
const getToken = () => localStorage.getItem('ls_token')

/**
 * Core fetch wrapper
 */
const request = async (method, path, body = null, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    method,
    headers,
    credentials: 'include',
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, config)

  // Handle CSV downloads — return raw text
  if (options.responseType === 'blob' || options.responseType === 'text') {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return options.responseType === 'blob' ? response.blob() : response.text()
  }

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong')
    error.status = response.status
    error.errors = data.errors || []
    throw error
  }

  return data
}

export const api = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  delete: (path, options) => request('DELETE', path, null, options),
}

export default api
