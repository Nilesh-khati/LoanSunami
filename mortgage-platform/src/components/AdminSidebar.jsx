import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, Users, BarChart2, Settings,
  LogOut, ChevronRight, ChevronLeft, Home,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'leads'    },
  { icon: Users,           label: 'All Leads', section: 'leads'    },
  { icon: BarChart2,       label: 'Analytics', section: 'stats'    },
  { icon: Settings,        label: 'Settings',  section: 'settings' },
]

export default function AdminSidebar({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signout } = useAuth()
  const navigate = useNavigate()

  const handleSignout = async () => {
    await signout()
    navigate('/signin')
  }

  const initials = user
    ? user.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 flex flex-col overflow-hidden"
      style={{
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #ebebeb',
        zIndex: 50,
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Logo + Collapse ── */}
      <div
        className="flex items-center justify-between px-3 py-4"
        style={{ borderBottom: '1px solid #f0f0f0', minHeight: 64 }}
      >
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#0a0a0a' }}
              >
                <Zap size={15} color="#c8f542" fill="#c8f542" />
              </div>
              <span
                className="font-black text-base whitespace-nowrap"
                style={{ color: '#0a0a0a', letterSpacing: '-0.04em' }}
              >
                LoanSunami
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: '#0a0a0a' }}>
            <Zap size={15} color="#c8f542" fill="#c8f542" />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: '#f5f5f5', color: '#888' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
            title="Collapse"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#f5f5f5', color: '#888' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ebebeb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
            title="Expand"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* ── Admin Profile Card ── */}
      <div
        className="flex items-center gap-3 px-3 py-4 overflow-hidden"
        style={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
          style={{ background: '#c8f542', color: '#0a0a0a', minWidth: 36 }}
        >
          {initials}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 overflow-hidden"
            >
              <p className="text-xs font-semibold truncate" style={{ color: '#0a0a0a' }}>{user?.fullName}</p>
              <p className="text-xs truncate" style={{ color: '#888', fontSize: '0.65rem' }}>👑 Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Section Label ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-4 pt-4 pb-1 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#aaa' }}
          >
            Menu
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Nav Items ── */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, section }) => {
          const active = activeSection === section
          return (
            <button
              key={label}
              onClick={() => onSectionChange(section)}
              title={collapsed ? label : undefined}
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
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.16 }}
                    className="text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* ── Bottom: Back to Site + Sign Out ── */}
      <div className="px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid #f0f0f0' }}>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#555555', border: '1px solid transparent', textDecoration: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555555' }}
          title={collapsed ? 'Back to Site' : undefined}
        >
          <Home size={17} strokeWidth={1.8} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.16 }}
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
              >
                Back to Site
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#dc2626', border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={17} strokeWidth={1.8} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.16 }}
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
