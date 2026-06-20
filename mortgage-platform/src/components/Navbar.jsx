import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronDown, Zap, LogOut, Shield,
  Home, Calculator, HelpCircle, FileText, BarChart2,
  User, PenLine,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [loanOpen,    setLoanOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [userType,    setUserType]    = useState('Individual')

  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, signout } = useAuth()

  const isAdmin = user?.role === 'admin'

  const loanTimer    = useRef(null)
  const profileTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setLoanOpen(false)
    setProfileOpen(false)
  }, [location])

  const handleSignout = async () => {
    await signout()
    navigate('/signin')
  }

  const initials = user
    ? user.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  const loanItems = [
    { to: '/apply',      label: 'Home Loan',      icon: Home      },
    { to: '/apply',      label: 'Personal Loan',  icon: FileText  },
    { to: '/apply',      label: 'Business Loan',  icon: BarChart2 },
    { to: '/calculator', label: 'EMI Calculator', icon: Calculator },
    { to: '/#rates',     label: "Today's Rates",  icon: BarChart2 },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: '#ffffff',
          borderBottom: scrolled ? '1px solid #e0e0e0' : '1px solid #f0f0f0',
          boxShadow:   scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
              <Zap size={16} color="#c8f542" fill="#c8f542" />
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}>
              LoanSunami
            </span>
          </Link>

          {/* ── Desktop center links ── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">

            {/* Home — always visible */}
            <Link to="/" className="btn-ghost-nav">Home</Link>

            {/* Loan dropdown — always visible */}
            <div
              className="relative"
              onMouseEnter={() => { clearTimeout(loanTimer.current); setLoanOpen(true) }}
              onMouseLeave={() => { loanTimer.current = setTimeout(() => setLoanOpen(false), 130) }}
            >
              <button className="btn-ghost-nav flex items-center gap-1">
                Loans
                <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: loanOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              <AnimatePresence>
                {loanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                    className="nav-dropdown"
                  >
                    {loanItems.map(({ to, label, icon: Icon }) => (
                      <Link key={label} to={to} className="flex items-center gap-2.5">
                        <Icon size={13} style={{ color: '#aaa' }} />
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Calculator — REMOVED */}

            {/* Admin — admin only */}
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-ghost-nav flex items-center gap-1.5"
                style={{
                  color: location.pathname.startsWith('/admin') ? '#0a0a0a' : '#555',
                  background: location.pathname.startsWith('/admin') ? '#f0f0f0' : 'transparent',
                  fontWeight: 600,
                }}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* ── Desktop right ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              isAdmin ? (
                /* ADMIN — kuch nahi, sirf Sign Out */
                <button
                  onClick={handleSignout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#f87171' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                /* NON-ADMIN — sirf naam dikhao, Sign Out nahi */
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                  style={{ background: '#f5f5f5', border: '1.5px solid #e5e5e5' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: '#0a0a0a', color: '#ffffff' }}>
                    {initials}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#0a0a0a' }}>
                    {user.fullName?.split(' ')[0]}
                  </span>
                </div>
              )
            ) : (
              /* NOT LOGGED IN — Apply Now button only, no Sign In */
              <Link to="/apply" className="btn-primary text-sm py-2.5 px-5">Apply Now</Link>
            )}
          </div>

          {/* ── Mobile hamburger — hidden, replaced by bottom nav ── */}
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #ebebeb',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { to: '/',      icon: Home,    label: 'Home'  },
            { to: '/apply', icon: PenLine, label: 'Apply' },
            ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
            ...(user
              ? [{ to: null, icon: User, label: user.fullName?.split(' ')[0] || 'Me', isProfile: true }]
              : []
            ),
          ].map(({ to, icon: Icon, label, isProfile }) => {
            const active = to && (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to.replace('/#','/')))
            if (isProfile) {
              return (
                <button
                  key="profile"
                  onClick={() => setMenuOpen(p => !p)}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all min-w-0"
                  style={{ color: menuOpen ? '#0a0a0a' : '#888' }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-bold"
                    style={{
                      background: user?.role === 'admin' ? '#c8f542' : '#0a0a0a',
                      color: user?.role === 'admin' ? '#0a0a0a' : '#fff',
                      fontSize: '0.55rem',
                    }}
                  >
                    {user?.fullName?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium truncate" style={{ fontSize: '0.6rem', maxWidth: 56 }}>{label}</span>
                </button>
              )
            }
            return (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
                style={{ color: active ? '#0a0a0a' : '#888888' }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                  style={{ background: active ? '#f0f0f0' : 'transparent' }}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                </div>
                <span className="font-medium" style={{ fontSize: '0.6rem' }}>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Mobile Profile Sheet ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
              style={{ background: '#fff', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="px-5 pt-4 pb-6">
                {/* Handle bar */}
                <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#e0e0e0' }} />

                {user ? (
                  <>
                    {/* Profile card — sirf non-admin ke liye */}
                    {!isAdmin && (
                      <div className="flex items-center gap-3 p-4 rounded-2xl mb-4" style={{ background: '#f5f5f5' }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: '#0a0a0a', color: '#fff' }}>
                          {user.fullName?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: '#0a0a0a' }}>{user.fullName}</p>
                          <p className="text-xs truncate" style={{ color: '#888' }}>{user.email}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-auto"
                          style={{ background: '#ededfd', color: '#6d28d9' }}>
                          User
                        </span>
                      </div>
                    )}

                    {/* Links — admin sees Home + Loans + Admin, non-admin sees everything */}
                    <div className="space-y-1 mb-4">
                      {[
                        { to:'/', label:'🏠 Home' },
                        { to:'/apply', label:'📝 Apply for Loan' },
                        ...(isAdmin ? [{ to:'/admin', label:'🛡️ Admin Dashboard' }] : []),
                      ].map(({ to, label }) => (
                        <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                          style={{ color: '#555' }}
                          onMouseEnter={e => e.currentTarget.style.background='#f5f5f5'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          {label}
                        </Link>
                      ))}
                    </div>

                    <button onClick={handleSignout}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                      <LogOut size={15}/> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 mb-4">
                      {[
                        { to:'/', label:'🏠 Home' },
                        { to:'/apply', label:'📝 Apply for Loan' },
                      ].map(({ to, label }) => (
                        <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl text-sm font-medium"
                          style={{ color: '#555' }}>
                          {label}
                        </Link>
                      ))}
                    </div>
                    <Link to="/apply" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center text-sm">Apply Now</Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
