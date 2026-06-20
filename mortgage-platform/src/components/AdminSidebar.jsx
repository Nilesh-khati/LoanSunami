import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, Users, BarChart2, Settings,
  LogOut, ChevronRight, ChevronLeft, Home, Menu, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'leads'    },
  { icon: Users,           label: 'All Leads', section: 'leads'    },
  { icon: BarChart2,       label: 'Analytics', section: 'stats'    },
  { icon: Settings,        label: 'Settings',  section: 'settings' },
]

const EXPANDED_W = 240
const COLLAPSED_W = 68

export default function AdminSidebar({ activeSection, onSectionChange, collapsed, onCollapsedChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signout } = useAuth()
  const navigate = useNavigate()

  // Allow internal collapse toggle
  const setCollapsed = (val) => onCollapsedChange?.(val)

  const handleSignout = async () => {
    await signout()
    navigate('/signin')
  }

  const initials = user
    ? user.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  // ── Shared nav content (used in both desktop sidebar & mobile drawer) ──
  // forceExpanded: mobile drawer always shows labels regardless of collapsed state
  const NavContent = ({ onItemClick, forceExpanded = false }) => {
    const showLabel = forceExpanded || !collapsed
    return (
    <>
      {/* Section label */}
      {showLabel && (
        <p className="px-4 pt-4 pb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#aaa' }}>
          Menu
        </p>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, section }) => {
          const active = activeSection === section
          return (
            <button
              key={label}
              onClick={() => { onSectionChange(section); onItemClick?.() }}
              title={!showLabel ? label : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: active ? '#0a0a0a' : 'transparent',
                color:      active ? '#c8f542' : '#555555',
                border:     '1px solid transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555555' } }}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className="flex-shrink-0" />
              {showLabel && (
                <span className="text-sm font-medium overflow-hidden whitespace-nowrap">{label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid #f0f0f0' }}>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#555555', textDecoration: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555555' }}
          title={!showLabel ? 'Back to Site' : undefined}
        >
          <Home size={17} strokeWidth={1.8} className="flex-shrink-0" />
          {showLabel && <span className="text-sm font-medium whitespace-nowrap">Back to Site</span>}
        </Link>

        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#dc2626' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          title={!showLabel ? 'Sign Out' : undefined}
        >
          <LogOut size={17} strokeWidth={1.8} className="flex-shrink-0" />
          {showLabel && <span className="text-sm font-medium whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </>
  )}

  return (
    <>
      {/* ════════════════════════════════════
          DESKTOP SIDEBAR (lg and above)
      ════════════════════════════════════ */}
      <motion.aside
        animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0"
        style={{
          height: '100vh',
          background: '#ffffff',
          borderRight: '1px solid #ebebeb',
          zIndex: 50,
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
          overflow: 'visible',
        }}
      >
        {/* ── Logo row — NO toggle button inside, just clean logo ── */}
        <div
          className="flex items-center px-3 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #f0f0f0', minHeight: 64 }}
        >
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#0a0a0a' }}>
              <Zap size={15} color="#c8f542" fill="#c8f542" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  key="logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-black text-base whitespace-nowrap overflow-hidden"
                  style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}
                >
                  LoanSunami
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <NavContent />
        </div>

        {/* ── Toggle button — floats on the RIGHT EDGE of sidebar, vertically centred in header ──
            Always at same Y position, half outside sidebar so it never overlaps content inside */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute flex items-center justify-center transition-all"
          style={{
            top: 20,                        /* vertically aligned with logo row */
            right: -14,                     /* half outside the sidebar right border */
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#ffffff',
            border: '1.5px solid #e0e0e0',
            color: '#555',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            zIndex: 60,
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#0a0a0a'
            e.currentTarget.style.color = '#c8f542'
            e.currentTarget.style.borderColor = '#0a0a0a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.color = '#555'
            e.currentTarget.style.borderColor = '#e0e0e0'
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={13} strokeWidth={2.5} />
            : <ChevronLeft  size={13} strokeWidth={2.5} />
          }
        </button>
      </motion.aside>

      {/* ════════════════════════════════════
          MOBILE — Top header bar + Drawer
      ════════════════════════════════════ */}

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{
          height: 60,
          background: '#ffffff',
          borderBottom: '1px solid #ebebeb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <Zap size={13} color="#c8f542" fill="#c8f542" />
          </div>
          <span className="font-black text-base" style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}>
            LoanSunami
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: '#f5f5f5', color: '#0a0a0a' }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 flex flex-col"
              style={{ width: 280, background: '#ffffff', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 flex-shrink-0"
                style={{ borderBottom: '1px solid #f0f0f0', height: 64 }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                    <Zap size={15} color="#c8f542" fill="#c8f542" />
                  </div>
                  <span className="font-black text-base" style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}>
                    LoanSunami
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: '#f5f5f5', color: '#888' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer nav — forceExpanded so labels always show */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <NavContent onItemClick={() => setMobileOpen(false)} forceExpanded={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
