import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronRight, Zap, Home, Calculator,
  HelpCircle, Shield, FileText, LogIn, LogOut, BarChart2,
  User, ChevronUp,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const sidebarVariants = {
  collapsed: { width: 72 },
  expanded:  { width: 260 },
}

export default function Sidebar({ expanded, onToggle }) {
  const [userType,     setUserType]     = useState('Individual')
  const [loanOpen,     setLoanOpen]     = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, signout } = useAuth()

  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)
  useEffect(() => { setLoanOpen(false); setProfileOpen(false) }, [location])

  if (isAuthPage) return null

  const loanItems = [
    { to: '/apply',      label: 'Home Loan',      icon: Home       },
    { to: '/apply',      label: 'Personal Loan',  icon: FileText   },
    { to: '/apply',      label: 'Business Loan',  icon: BarChart2  },
    { to: '/calculator', label: 'EMI Calculator', icon: Calculator },
    { to: '/#rates',     label: "Today's Rates",  icon: BarChart2  },
  ]

  const navItems = [
    { to: '/',           label: 'Home',        icon: Home       },
    { to: '/calculator', label: 'Compare',     icon: BarChart2  },
    { to: '/#faq',       label: 'Help Center', icon: HelpCircle },
    ...(user ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleSignout = async () => {
    await signout()
    navigate('/signin')
  }

  // Avatar initials
  const initials = user
    ? user.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <motion.aside
      className="sidebar-container"
      variants={sidebarVariants}
      animate={expanded ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-inner">

        {/* ── Logo + Toggle ── */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Zap size={16} color="#c8f542" fill="#c8f542" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sidebar-logo-text"
                >
                  LoanSunami
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => onToggle(!expanded)}
            title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronRight
              size={16}
              style={{ transition: 'transform 0.25s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </button>
        </div>

        {/* ── User Type Toggle ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sidebar-toggle-section"
            >
              <div className="sidebar-pill-toggle">
                <button className={userType === 'Individual' ? 'active' : ''} onClick={() => setUserType('Individual')}>
                  Individual
                </button>
                <button className={userType === 'Business' ? 'active' : ''} onClick={() => setUserType('Business')}>
                  Business
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sidebar-divider" />

        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-section-label"
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Nav Items ── */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className={`sidebar-nav-item ${isActive(to) ? 'active' : ''}`}
              title={!expanded ? label : undefined}
            >
              <span className="sidebar-nav-icon">
                <Icon size={19} strokeWidth={isActive(to) ? 2.2 : 1.8} />
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="sidebar-nav-label"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}

          {/* ── Loan dropdown ── */}
          <div className="sidebar-dropdown-wrapper">
            <button
              className="sidebar-nav-item sidebar-dropdown-trigger"
              onClick={() => setLoanOpen(!loanOpen)}
              title={!expanded ? 'Loan Products' : undefined}
            >
              <span className="sidebar-nav-icon">
                <FileText size={19} strokeWidth={1.8} />
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="sidebar-nav-label"
                  >
                    Loan Products
                  </motion.span>
                )}
              </AnimatePresence>
              {expanded && (
                <ChevronDown
                  size={14}
                  className="sidebar-chevron"
                  style={{ transition: 'transform 0.2s', transform: loanOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              )}
            </button>
            <AnimatePresence>
              {loanOpen && expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="sidebar-dropdown-list"
                >
                  {loanItems.map(({ to, label, icon: SubIcon }) => (
                    <Link key={label} to={to} className="sidebar-dropdown-item">
                      <SubIcon size={15} strokeWidth={1.6} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Bottom — Auth Section ── */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" />

          {user ? (
            /* ── LOGGED IN: Profile Card + Sign Out ── */
            <div>
              {/* Profile row — clickable to expand */}
              <button
                className="sidebar-nav-item w-full"
                style={{ gap: 10 }}
                onClick={() => expanded && setProfileOpen(!profileOpen)}
                title={!expanded ? user.fullName : undefined}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-xs"
                  style={{
                    width: 36, height: 36, minWidth: 36,
                    background: user.role === 'admin' ? '#c8f542' : '#e0e0e0',
                    color: '#0a0a0a',
                    fontSize: '0.7rem',
                  }}
                >
                  {initials}
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex-1 min-w-0 text-left"
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: '#0a0a0a', letterSpacing: '-0.01em' }}
                      >
                        {user.fullName}
                      </p>
                      <p className="text-xs truncate" style={{ color: '#888' }}>
                        {user.role === 'admin' ? '👑 Admin' : user.email}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {expanded && (
                  <div className="flex-shrink-0 ml-auto" style={{ color: '#aaa' }}>
                    {profileOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </div>
                )}
              </button>

              {/* Expanded profile dropdown */}
              <AnimatePresence>
                {profileOpen && expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden rounded-xl mx-1 mt-1 mb-2"
                    style={{ background: '#f5f5f5', border: '1px solid #ebebeb' }}
                  >
                    <div className="px-3 py-2.5 space-y-1 text-xs" style={{ color: '#555' }}>
                      <div className="flex justify-between">
                        <span style={{ color: '#aaa' }}>Email</span>
                        <span className="font-medium truncate max-w-[120px]" style={{ color: '#0a0a0a' }}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#aaa' }}>Role</span>
                        <span
                          className="font-semibold px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: user.role === 'admin' ? '#f3fdc8' : '#ededfd',
                            color: user.role === 'admin' ? '#65a30d' : '#6d28d9',
                          }}
                        >
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>
                      {user.phone && (
                        <div className="flex justify-between">
                          <span style={{ color: '#aaa' }}>Phone</span>
                          <span className="font-medium" style={{ color: '#0a0a0a' }}>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ borderTop: '1px solid #e5e5e5' }}>
                      <button
                        onClick={handleSignout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed sign-out icon */}
              {!expanded && (
                <button
                  className="sidebar-nav-item w-full"
                  onClick={handleSignout}
                  title="Sign Out"
                  style={{ color: '#dc2626' }}
                >
                  <span className="sidebar-nav-icon">
                    <LogOut size={19} strokeWidth={1.8} />
                  </span>
                </button>
              )}
            </div>
          ) : (
            /* ── NOT LOGGED IN: Sign In button ── */
            <>
              <Link
                to="/signin"
                className="sidebar-nav-item"
                title={!expanded ? 'Sign In' : undefined}
              >
                <span className="sidebar-nav-icon">
                  <LogIn size={19} strokeWidth={1.8} />
                </span>
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="sidebar-nav-label"
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link
                to="/apply"
                className="sidebar-apply-btn"
                title={!expanded ? 'Apply Now' : undefined}
              >
                <Zap size={16} />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      Apply Now
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
