import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Zap, Home, Calculator, HelpCircle, Shield, FileText, LogIn, BarChart2 } from 'lucide-react'

const sidebarVariants = {
  collapsed: { width: 72 },
  expanded: { width: 260 },
}

export default function Sidebar({ expanded, onToggle }) {
  const [userType, setUserType] = useState('Individual')
  const [loanOpen, setLoanOpen] = useState(false)
  const location = useLocation()
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)

  useEffect(() => { setLoanOpen(false) }, [location])

  if (isAuthPage) return null

  const loanItems = [
    { to: '/apply',      label: 'Home Loan',       icon: Home },
    { to: '/apply',      label: 'Personal Loan',   icon: FileText },
    { to: '/apply',      label: 'Business Loan',   icon: BarChart2 },
    { to: '/calculator', label: 'EMI Calculator',   icon: Calculator },
    { to: '/#rates',     label: "Today's Rates",    icon: BarChart2 },
  ]

  const navItems = [
    { to: '/',           label: 'Home',            icon: Home },
    { to: '/calculator', label: 'Compare',         icon: BarChart2 },
    { to: '/#faq',       label: 'Help Center',     icon: HelpCircle },
    { to: '/admin',      label: 'Admin',           icon: Shield },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

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
              style={{
                transition: 'transform 0.25s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </button>
        </div>

        {/* ── User Type Toggle (only when expanded) ── */}
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
                <button
                  className={userType === 'Individual' ? 'active' : ''}
                  onClick={() => setUserType('Individual')}
                >
                  Individual
                </button>
                <button
                  className={userType === 'Business' ? 'active' : ''}
                  onClick={() => setUserType('Business')}
                >
                  Business
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ── */}
        <div className="sidebar-divider" />

        {/* ── Section Label ── */}
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

        {/* ── Nav items ── */}
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
              className={`sidebar-nav-item sidebar-dropdown-trigger ${loanOpen ? 'open' : ''}`}
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
                  style={{
                    transition: 'transform 0.2s',
                    transform: loanOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}
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

        {/* ── Bottom Actions ── */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" />

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
        </div>
      </div>
    </motion.aside>
  )
}
