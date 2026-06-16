import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Zap, Download } from 'lucide-react'

const navLinks = ['Loan ▾', 'Compare', 'Help Center']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userType, setUserType] = useState('Individual')
  const [loanOpen, setLoanOpen] = useState(false)
  const location = useLocation()
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)
  const loanTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setMenuOpen(false); setLoanOpen(false) }, [location])

  if (isAuthPage) return null

  const loanItems = [
    { to: '/apply',      label: 'Home Loan'           },
    { to: '/apply',      label: 'Personal Loan'       },
    { to: '/apply',      label: 'Business Loan'       },
    { to: '/calculator', label: 'EMI Calculator'      },
    { to: '/#rates',     label: "Today's Rates"       },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: '#ffffff',
          borderBottom: scrolled ? '1px solid #e0e0e0' : '1px solid #f0f0f0',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#0a0a0a' }}
            >
              <Zap size={16} color="#c8f542" fill="#c8f542" />
            </div>
            <span
              className="font-black text-xl tracking-tight leading-none"
              style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}
            >
              LoanSunami
            </span>
          </Link>

          {/* Desktop center */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {/* Pill toggle */}
            <div className="pill-toggle mr-3">
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

            {/* Loan dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { clearTimeout(loanTimer.current); setLoanOpen(true) }}
              onMouseLeave={() => { loanTimer.current = setTimeout(() => setLoanOpen(false), 130) }}
            >
              <button className="btn-ghost-nav flex items-center gap-1">
                Loan
                <ChevronDown
                  size={13}
                  style={{ transition: 'transform 0.2s', transform: loanOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>
              <AnimatePresence>
                {loanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="nav-dropdown"
                  >
                    {loanItems.map(({ to, label }) => (
                      <Link key={label} to={to}>{label}</Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/calculator" className="btn-ghost-nav">Compare</Link>
            <Link to="/#faq" className="btn-ghost-nav">Help Center</Link>
            <Link to="/admin" className="btn-ghost-nav">Admin</Link>
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/signin"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: '#555555' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.color = '#555555'}
            >
              <Download size={14} />
              Download App
            </Link>
            <Link to="/apply" className="btn-primary text-sm py-2.5 px-5">
              Apply Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{ color: '#0a0a0a' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[70px] left-0 right-0 z-40 lg:hidden"
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #e0e0e0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div className="px-5 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {/* Toggle */}
              <div className="pill-toggle mb-3 w-full justify-center flex">
                <button className={userType === 'Individual' ? 'active' : ''} onClick={() => setUserType('Individual')}>Individual</button>
                <button className={userType === 'Business' ? 'active' : ''} onClick={() => setUserType('Business')}>Business</button>
              </div>
              {loanItems.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: '#555555' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555555' }}
                >
                  {label}
                </Link>
              ))}
              <Link to="/calculator" className="block px-4 py-3 rounded-xl text-sm font-medium" style={{ color: '#555555' }}>Compare</Link>
              <Link to="/#faq" className="block px-4 py-3 rounded-xl text-sm font-medium" style={{ color: '#555555' }}>Help Center</Link>
              <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium" style={{ color: '#555555' }}>Admin</Link>
              <div className="divider my-3" />
              <Link to="/signin" className="block px-4 py-3 text-sm font-medium" style={{ color: '#555555' }}>Sign In</Link>
              <Link to="/apply" className="btn-primary w-full justify-center mt-2">Apply Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
