import { createContext, useContext, useState, useEffect } from 'react'
import authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem('ls_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.getMe()
      .then(res => setUser(res.user))
      .catch(() => localStorage.removeItem('ls_token'))
      .finally(() => setLoading(false))
  }, [])

  const signin = async (credentials) => {
    const data = await authApi.signin(credentials)
    setUser(data.user)
    return data
  }

  const signup = async (credentials) => {
    const data = await authApi.signup(credentials)
    setUser(data.user)
    return data
  }

  const signout = async () => {
    await authApi.signout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
