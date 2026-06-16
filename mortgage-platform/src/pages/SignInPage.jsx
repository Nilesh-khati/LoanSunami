import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, Zap, CheckCircle } from 'lucide-react'

export default function SignInPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = field => e => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/') }, 1200)
  }

  const benefits = [
    'Compare 30+ banks in one place',
    'Real-time EMI & affordability calculators',
    'Dedicated mortgage specialist support',
    'Fully digital — apply from anywhere',
  ]

  return (
    <div className="min-h-screen flex">

      {/* Left — dark panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12"
        style={{ background: '#0a0a0a' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#c8f542' }}>
            <Zap size={16} color="#0a0a0a" fill="#0a0a0a" />
          </div>
          <span className="font-black text-white text-xl tracking-tight" style={{ letterSpacing: '-0.04em' }}>
            LoanSunami
          </span>
        </Link>

        {/* Headline + benefits */}
        <div>
          <p
            className="font-extrabold text-white leading-snug mb-8"
            style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}
          >
            The smartest way<br />to finance your<br />
            <span style={{ color: '#c8f542' }}>dream loan.</span>
          </p>
          <div className="space-y-4">
            {benefits.map(item => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(200,245,66,0.15)', border: '1px solid rgba(200,245,66,0.3)' }}
                >
                  <CheckCircle size={12} style={{ color: '#c8f542' }} strokeWidth={2.5} />
                </div>
                <span className="text-sm" style={{ color: '#888888' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#444444' }}>© 2026 LoanSunami · All rights reserved</p>
      </div>

      {/* Right — form */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: '#ffffff' }}
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                <Zap size={16} color="#c8f542" fill="#c8f542" />
              </div>
              <span className="font-black text-xl tracking-tight" style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}>
                LoanSunami
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1
              className="text-2xl font-extrabold mb-1"
              style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}
            >
              Welcome back
            </h1>
            <p className="text-sm mb-8" style={{ color: '#888888' }}>
              Sign in to your account to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: '#888888' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#cccccc' }} />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={update('email')}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#888888' }}
                  >
                    Password
                  </label>
                  <Link
                    to="#"
                    className="text-xs font-medium"
                    style={{ color: '#0a0a0a' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#555555'}
                    onMouseLeave={e => e.currentTarget.style.color = '#0a0a0a'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#cccccc' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    className="input-field pl-10 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#cccccc' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#555555'}
                    onMouseLeave={e => e.currentTarget.style.color = '#cccccc'}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs rounded-xl px-4 py-3"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <><LogIn size={15} /> Sign In</>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 divider" />
                <span className="text-xs" style={{ color: '#cccccc' }}>or</span>
                <div className="flex-1 divider" />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{ background: '#ffffff', border: '1.5px solid #e0e0e0', color: '#555555' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: '#888888' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold"
                style={{ color: '#0a0a0a' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                Create one free <ArrowRight size={12} className="inline" />
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
