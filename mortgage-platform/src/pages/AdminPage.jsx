import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, CheckCircle, Search, Download, Eye,
  Phone, Mail, IndianRupee, Calendar, Zap, RefreshCw, X,
  BarChart2, Settings, ArrowUp, ArrowDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import leadsApi from '../api/leads.js'
import ratesApi from '../api/rates.js'
import faqsApi  from '../api/faqs.js'
import authApi  from '../api/auth.js'
import api      from '../api/client.js'
import AdminSidebar from '../components/AdminSidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const statusConfig = {
  New:       { bg: '#f3fdc8', text: '#65a30d', border: '#c8f542'  },
  Contacted: { bg: '#fef9c3', text: '#ca8a04', border: '#fde68a'  },
  Qualified: { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe'  },
  Closed:    { bg: '#ccfbf1', text: '#0f766e', border: '#5eead4'  },
}

const fmtAmount = v => v ? `₹${(v / 100000).toFixed(0)}L` : '—'
const fmtIncome = v => v ? `₹${(v / 1000).toFixed(0)}K/mo` : '—'
const fmtDate   = v => v ? new Date(v).toLocaleDateString('en-IN') : '—'

// ── Leads Dashboard ────────────────────────────────────────────
function LeadsDashboard() {
  const [leads,        setLeads]        = useState([])
  const [stats,        setStats]        = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [updatingId,   setUpdatingId]   = useState(null)
  const [exporting,    setExporting]    = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await leadsApi.getAll({ status: statusFilter, search: search.trim(), limit: 100 })
      setLeads(res.data || [])
      if (res.stats) setStats(res.stats)
    } catch (err) {
      setError(err.status === 401 || err.status === 403
        ? 'Admin access required. Please sign in with an admin account.'
        : err.message || 'Failed to load leads.')
    } finally { setLoading(false) }
  }, [statusFilter, search])

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300)
    return () => clearTimeout(t)
  }, [fetchLeads])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      const res = await leadsApi.update(id, { status: newStatus })
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status: res.data.status } : l))
      if (selectedLead?._id === id) setSelectedLead(p => ({ ...p, status: res.data.status }))
    } catch (err) { alert(err.message || 'Failed to update status.') }
    finally { setUpdatingId(null) }
  }

  const handleExport = async () => {
    setExporting(true)
    try { await leadsApi.exportCSV({ status: statusFilter, search: search.trim() }) }
    catch (err) { alert(err.message || 'Export failed.') }
    finally { setExporting(false) }
  }

  const statCards = stats ? [
    { label: 'Total Leads',    value: stats.totalLeads,    change: `+${stats.todayLeads} today`,  icon: Users,       accent: '#0a0a0a', bg: '#f5f5f5' },
    { label: 'Contacted',      value: stats.contacted,     change: `${stats.totalLeads ? Math.round(stats.contacted/stats.totalLeads*100) : 0}% rate`, icon: Phone, accent: '#ca8a04', bg: '#fef9c3' },
    { label: 'Qualified',      value: stats.qualified,     change: `${stats.totalLeads ? Math.round(stats.qualified/stats.totalLeads*100) : 0}% conv.`, icon: CheckCircle, accent: '#7c3aed', bg: '#ede9fe' },
    { label: 'Avg. Loan Size', value: stats.avgLoanAmount ? fmtAmount(stats.avgLoanAmount) : '—', change: 'This month', icon: TrendingUp, accent: '#0f766e', bg: '#ccfbf1' },
  ] : []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
              <Zap size={14} color="#c8f542" fill="#c8f542" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>Lead Dashboard</h1>
          </div>
          <p className="text-sm" style={{ color: '#888' }}>Manage and track all loan applications</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchLeads} disabled={loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
            style={{ background: '#fff', borderColor: '#e0e0e0', color: '#888' }} title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleExport} disabled={exporting} className="btn-ghost flex items-center gap-2 text-sm">
            <Download size={14} />{exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-5 py-4 rounded-2xl flex items-center justify-between text-sm"
          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, change, icon: Icon, accent, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={18} style={{ color: accent }} strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#888' }}>{change}</span>
              </div>
              <div className="text-2xl font-extrabold mb-0.5" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>{value}</div>
              <div className="text-xs" style={{ color: '#888' }}>{label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#ccc' }} />
          <input type="text" placeholder="Search by name, email, or city…"
            value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All','New','Contacted','Qualified','Closed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ background: statusFilter===s ? '#c8f542':'#fff', color: statusFilter===s ? '#0a0a0a':'#888', border: `1.5px solid ${statusFilter===s ? '#c8f542':'#e0e0e0'}` }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <svg className="animate-spin w-8 h-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none" style={{ color: '#c8f542' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm" style={{ color: '#888' }}>Loading leads…</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center">
            <Search size={28} className="mx-auto mb-3" style={{ color: '#ddd' }} />
            <p className="text-sm" style={{ color: '#888' }}>No leads match your search</p>
          </div>
        ) : (
          <>
            {/* Desktop table — hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                    {['Applicant','Contact','Loan','Income','Date','Status',''].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <motion.tr key={lead._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="transition-colors" style={{ borderBottom: '1px solid #fafafa' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm" style={{ color: '#0a0a0a' }}>{lead.firstName} {lead.lastName}</div>
                        <div className="text-xs" style={{ color: '#888' }}>{lead.city || '—'}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: '#555' }}><Mail size={11}/>{lead.email}</div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555' }}><Phone size={11}/>{lead.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold" style={{ color: '#0a0a0a' }}>{fmtAmount(lead.loanAmount)}</div>
                        <div className="text-xs" style={{ color: '#888' }}>{lead.loanPurpose || '—'}</div>
                      </td>
                      <td className="px-5 py-4"><span className="text-sm" style={{ color: '#555' }}>{fmtIncome(lead.monthlyIncome)}</span></td>
                      <td className="px-5 py-4"><span className="text-xs" style={{ color: '#888' }}>{fmtDate(lead.createdAt)}</span></td>
                      <td className="px-5 py-4">
                        {statusConfig[lead.status] && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: statusConfig[lead.status].bg, color: statusConfig[lead.status].text, border: `1px solid ${statusConfig[lead.status].border}` }}>
                            {lead.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedLead(lead)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors" style={{ color: '#aaa' }}
                          onMouseEnter={e => { e.currentTarget.style.background='#f5f5f5'; e.currentTarget.style.color='#0a0a0a' }}
                          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#aaa' }}>
                          <Eye size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — shown on small screens */}
            <div className="md:hidden divide-y" style={{ borderColor: '#f5f5f5' }}>
              {leads.map((lead, i) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0a0a0a' }}>{lead.firstName} {lead.lastName}</p>
                      <p className="text-xs" style={{ color: '#888' }}>{lead.city || '—'} · {fmtDate(lead.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusConfig[lead.status] && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: statusConfig[lead.status].bg, color: statusConfig[lead.status].text, border: `1px solid ${statusConfig[lead.status].border}` }}>
                          {lead.status}
                        </span>
                      )}
                      <button onClick={() => setSelectedLead(lead)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: '#f5f5f5', color: '#555' }}>
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555' }}>
                      <Mail size={10}/><span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555' }}>
                      <Phone size={10}/>{lead.phone}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: '#0a0a0a' }}>
                      {fmtAmount(lead.loanAmount)}
                    </div>
                    <div className="text-xs" style={{ color: '#888' }}>{lead.loanPurpose || '—'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-xs mt-3 text-right" style={{ color: '#ccc' }}>Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}</p>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedLead(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>{selectedLead.firstName} {selectedLead.lastName}</h3>
                <p className="text-sm" style={{ color: '#888' }}>{selectedLead.city || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusConfig[selectedLead.status] && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: statusConfig[selectedLead.status].bg, color: statusConfig[selectedLead.status].text, border: `1px solid ${statusConfig[selectedLead.status].border}` }}>
                    {selectedLead.status}
                  </span>
                )}
                <button onClick={() => setSelectedLead(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#f5f5f5', color: '#888' }}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Email',          value: selectedLead.email,                                                                     icon: Mail        },
                { label: 'Phone',          value: selectedLead.phone,                                                                     icon: Phone       },
                { label: 'Loan Amount',    value: selectedLead.loanAmount ? `₹${Number(selectedLead.loanAmount).toLocaleString('en-IN')}` : '—', icon: IndianRupee },
                { label: 'Purpose',        value: selectedLead.loanPurpose || '—',                                                        icon: CheckCircle },
                { label: 'Employment',     value: selectedLead.employmentType || '—',                                                     icon: Users       },
                { label: 'Monthly Income', value: selectedLead.monthlyIncome ? `₹${Number(selectedLead.monthlyIncome).toLocaleString('en-IN')}` : '—', icon: TrendingUp },
                { label: 'Credit Score',   value: selectedLead.creditScore || '—',                                                        icon: TrendingUp  },
                { label: 'Tenure',         value: selectedLead.tenure || '—',                                                             icon: Calendar    },
                { label: 'Applied On',     value: fmtDate(selectedLead.createdAt),                                                        icon: Calendar    },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f5f5f5' }}>
                    <Icon size={13} style={{ color: '#888' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#888' }}>Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['New','Contacted','Qualified','Closed'].map(s => (
                  <button key={s} disabled={selectedLead.status===s || updatingId===selectedLead._id}
                    onClick={() => handleStatusUpdate(selectedLead._id, s)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ background: selectedLead.status===s ? statusConfig[s].bg : '#f5f5f5', color: selectedLead.status===s ? statusConfig[s].text : '#555', border: `1px solid ${selectedLead.status===s ? statusConfig[s].border : '#e0e0e0'}` }}>
                    {updatingId===selectedLead._id && selectedLead.status!==s ? '…' : s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setSelectedLead(null)} className="btn-ghost w-full justify-center">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Analytics ─────────────────────────────────────────────────
function Analytics() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setData(res.data))
      .catch(err => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: '#c8f542' }}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  )

  if (error) return (
    <div className="py-20 text-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  )

  const { overview, statusBreakdown, last7Days, last6Months,
          purposeBreakdown, cityBreakdown, employmentBreakdown, loanByPurpose } = data

  // Pie chart colors
  const STATUS_COLORS  = { New: '#c8f542', Contacted: '#fbbf24', Qualified: '#a78bfa', Closed: '#34d399' }
  const PURPOSE_COLORS = ['#c8f542','#60a5fa','#f472b6','#fb923c','#a78bfa','#34d399','#f87171']
  const EMP_COLORS     = ['#0a0a0a','#c8f542','#60a5fa','#f472b6','#fb923c']

  const fmtCr = v => v >= 100 ? `₹${(v/100).toFixed(1)}Cr` : `₹${v}L`
  const fmtLakh = v => `₹${v}L`

  const volumeDiff = overview.thisMonthVolume - overview.lastMonthVolume
  const volumePct  = overview.lastMonthVolume > 0
    ? Math.round((volumeDiff / overview.lastMonthVolume) * 100) : 0

  // Custom tooltip style
  const tooltipStyle = {
    background: '#ffffff',
    border: '1px solid #eeeeee',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontSize: 12,
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <BarChart2 size={14} color="#c8f542" />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>
            Analytics
          </h1>
        </div>
        <p className="text-sm" style={{ color: '#888' }}>Real-time insights across all leads and loan activity</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Leads',
            value: overview.totalLeads,
            sub: `+${overview.todayLeads} today`,
            icon: Users, accent: '#0a0a0a', bg: '#f5f5f5',
          },
          {
            label: 'Conversion Rate',
            value: `${overview.conversionRate}%`,
            sub: `${overview.qualifiedLeads} qualified`,
            icon: TrendingUp, accent: '#7c3aed', bg: '#ede9fe',
          },
          {
            label: 'Contact Rate',
            value: `${overview.contactRate}%`,
            sub: `${overview.contactedLeads} contacted`,
            icon: Phone, accent: '#ca8a04', bg: '#fef9c3',
          },
          {
            label: 'Avg Loan Size',
            value: overview.avgLoanAmount
              ? `₹${(overview.avgLoanAmount/100000).toFixed(1)}L`
              : '—',
            sub: 'This month',
            icon: IndianRupee, accent: '#0f766e', bg: '#ccfbf1',
          },
        ].map(({ label, value, sub, icon: Icon, accent, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} style={{ color: accent }} strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>
              {value}
            </div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: '#0a0a0a' }}>{label}</div>
            <div className="text-xs" style={{ color: '#888' }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Row 1: 7-day line + Status pie ── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* 7-day leads trend */}
        <div className="card p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>
            Leads — Last 7 Days
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7Days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone" dataKey="count" name="Leads"
                stroke="#0a0a0a" strokeWidth={2.5} dot={{ r: 4, fill: '#c8f542', stroke: '#0a0a0a', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution pie */}
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>
            Lead Status
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={68}
                dataKey="count" nameKey="status" paddingAngle={3}>
                {statusBreakdown.map(({ status }) => (
                  <Cell key={status} fill={STATUS_COLORS[status] || '#e5e5e5'} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {statusBreakdown.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                  <span style={{ color: '#555' }}>{status}</span>
                </div>
                <span className="font-bold" style={{ color: '#0a0a0a' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: 6-month bar ── */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#888' }}>
            Monthly Lead Volume — Last 6 Months
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: volumeDiff >= 0 ? '#059669' : '#dc2626' }}>
            {volumeDiff >= 0 ? <ArrowUp size={13}/> : <ArrowDown size={13}/>}
            {Math.abs(volumePct)}% vs last month
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={last6Months} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `₹${v}L`}
              tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v, name) => name === 'Volume (₹L)' ? [`₹${v}L`, name] : [v, name]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
            <Bar yAxisId="left"  dataKey="leads"  name="Leads"       fill="#0a0a0a" radius={[6,6,0,0]} maxBarSize={40} />
            <Bar yAxisId="right" dataKey="volume" name="Volume (₹L)" fill="#c8f542" radius={[6,6,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 3: Purpose + City ── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Loan Purpose breakdown */}
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>
            Leads by Loan Purpose
          </p>
          {purposeBreakdown.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={purposeBreakdown} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="purpose" width={100}
                    tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Leads" radius={[0,6,6,0]} maxBarSize={18}>
                    {purposeBreakdown.map((_, i) => (
                      <Cell key={i} fill={PURPOSE_COLORS[i % PURPOSE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Top Cities */}
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>
            Top Cities
          </p>
          {cityBreakdown.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <div className="space-y-3">
                {cityBreakdown.map(({ city, count }, i) => {
                  const max = cityBreakdown[0]?.count || 1
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={city}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium" style={{ color: '#0a0a0a' }}>{city}</span>
                        <span className="text-xs font-bold" style={{ color: '#888' }}>{count} leads</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                          className="h-full rounded-full"
                          style={{ background: PURPOSE_COLORS[i % PURPOSE_COLORS.length] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      </div>

      {/* ── Row 4: Employment + Avg Loan by Purpose ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Employment Type Pie */}
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#888' }}>
            Employment Type
          </p>
          {employmentBreakdown.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={employmentBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                      dataKey="count" nameKey="type" paddingAngle={2}>
                      {employmentBreakdown.map((_, i) => (
                        <Cell key={i} fill={EMP_COLORS[i % EMP_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {employmentBreakdown.map(({ type, count }, i) => {
                    const total = employmentBreakdown.reduce((s, e) => s + e.count, 0)
                    return (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: EMP_COLORS[i % EMP_COLORS.length] }} />
                          <span style={{ color: '#555' }}>{type}</span>
                        </div>
                        <span className="font-bold" style={{ color: '#0a0a0a' }}>
                          {Math.round((count / total) * 100)}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
        </div>

        {/* Avg Loan by Purpose */}
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>
            Avg Loan Amount by Purpose (₹L)
          </p>
          {loanByPurpose.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={loanByPurpose} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="purpose" tick={{ fill: '#aaa', fontSize: 9 }} axisLine={false} tickLine={false}
                    interval={0} angle={-20} textAnchor="end" height={40} />
                  <YAxis tickFormatter={v => `₹${v}L`} tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v}L`, 'Avg Loan']} />
                  <Bar dataKey="avgLoan" name="Avg Loan" radius={[6,6,0,0]} maxBarSize={36}>
                    {loanByPurpose.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#0a0a0a' : '#c8f542'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>
    </div>
  )
}

// ── Settings ───────────────────────────────────────────────────
function AdminSettings() {
  const [activeTab, setActiveTab] = useState('rates')
  const { user } = useAuth()
  const tabs = [
    { id: 'rates',   label: '📊 Interest Rates' },
    { id: 'faqs',    label: '❓ FAQs'            },
    { id: 'profile', label: '👤 My Profile'      },
  ]
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <Settings size={14} color="#c8f542" />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>Settings</h1>
        </div>
        <p className="text-sm" style={{ color: '#888' }}>Manage rates, FAQs and your admin profile</p>
      </div>
      <div className="flex gap-2 mb-7" style={{ borderBottom: '1px solid #eeeeee' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="px-4 py-2.5 text-sm font-semibold transition-all"
            style={{ color: activeTab===t.id ? '#0a0a0a' : '#888', borderBottom: activeTab===t.id ? '2px solid #0a0a0a' : '2px solid transparent', marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === 'rates'   && <RatesSettings />}
      {activeTab === 'faqs'    && <FAQSettings   />}
      {activeTab === 'profile' && <ProfileSettings user={user} />}
    </div>
  )
}

// ── Shared helpers ─────────────────────────────────────────────
function SField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  )
}
function AlertMsg({ type, msg, className = '' }) {
  return (
    <div className={`text-xs rounded-xl px-4 py-3 ${className}`}
      style={{ background: type==='error'?'#fef2f2':'#f3fdc8', border: type==='error'?'1px solid #fecaca':'1px solid #c8f542', color: type==='error'?'#dc2626':'#65a30d' }}>
      {msg}
    </div>
  )
}
function Spinner({ sm }) {
  return (
    <svg className={`animate-spin ${sm?'w-4 h-4':'w-7 h-7'}`} viewBox="0 0 24 24" fill="none" style={{ color: sm?'currentColor':'#c8f542' }}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}

// ── Rates Settings ─────────────────────────────────────────────
function RatesSettings() {
  const [rates,   setRates]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [editId,  setEditId]  = useState(null)
  const blank = { type:'', rate:'', rateValue:'', trend:'stable', lender:'', tenure:'', isActive:true }
  const [form, setForm] = useState(blank)

  const load = async () => { setLoading(true); try { const r = await ratesApi.getAllAdmin(); setRates(r.data||[]) } catch(e){setError(e.message)} finally{setLoading(false)} }
  useEffect(()=>{load()},[])
  const upd = f => e => setForm(p=>({...p,[f]:e.target.value}))
  const updB = f => e => setForm(p=>({...p,[f]:e.target.checked}))
  const openNew  = () => { setForm(blank); setEditId('new'); setError(''); setSuccess('') }
  const openEdit = r  => { setForm({...r,rateValue:r.rateValue??''}); setEditId(r._id); setError(''); setSuccess('') }
  const cancel   = () => { setEditId(null); setError(''); setSuccess('') }
  const save = async () => {
    if(!form.type||!form.rate||!form.rateValue||!form.lender||!form.tenure){setError('All fields required.');return}
    setSaving(true);setError('');setSuccess('')
    try {
      const p = {...form,rateValue:parseFloat(form.rateValue)}
      editId==='new' ? await ratesApi.create(p) : await ratesApi.update(editId,p)
      setSuccess(editId==='new'?'Rate added!':'Rate updated!'); setEditId(null); load()
    } catch(e){setError(e.message)} finally{setSaving(false)}
  }
  const del = async id => { if(!window.confirm('Delete this rate?'))return; try{await ratesApi.delete(id);load()}catch(e){setError(e.message)} }
  const tb = t => ({up:{bg:'#fef2f2',color:'#dc2626',label:'↑ Rising'},down:{bg:'#ccfbf1',color:'#0f766e',label:'↓ Falling'},stable:{bg:'#fef9c3',color:'#ca8a04',label:'→ Stable'}}[t]||{bg:'#f5f5f5',color:'#888',label:t})

  if(loading) return <div className="py-20 flex justify-center"><Spinner/></div>
  if(editId!==null) return (
    <div className="card p-7 max-w-lg">
      <h3 className="text-base font-bold mb-5" style={{color:'#0a0a0a'}}>{editId==='new'?'Add New Rate':'Edit Rate'}</h3>
      <div className="space-y-4">
        <SField label="Loan Type"        value={form.type}      onChange={upd('type')}      placeholder="e.g. Home Loan"/>
        <SField label="Display Rate"     value={form.rate}      onChange={upd('rate')}      placeholder="e.g. 8.50%"/>
        <SField label="Rate Value (num)" value={form.rateValue} onChange={upd('rateValue')} placeholder="8.5" type="number"/>
        <SField label="Lender"           value={form.lender}    onChange={upd('lender')}    placeholder="e.g. SBI"/>
        <SField label="Tenure"           value={form.tenure}    onChange={upd('tenure')}    placeholder="e.g. Up to 30 yrs"/>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#888'}}>Trend</label>
          <select value={form.trend} onChange={upd('trend')} className="input-field appearance-none">
            <option value="up">Rising ↑</option><option value="down">Falling ↓</option><option value="stable">Stable →</option>
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={updB('isActive')} className="w-4 h-4"/>
          <span className="text-sm font-medium" style={{color:'#555'}}>Active (visible on site)</span>
        </label>
        {error&&<AlertMsg type="error" msg={error}/>}{success&&<AlertMsg type="success" msg={success}/>}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">{saving&&<Spinner sm/>}{editId==='new'?'Add Rate':'Save'}</button>
          <button onClick={cancel} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  )
  return (
    <div>
      {success&&<AlertMsg type="success" msg={success} className="mb-4"/>}
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm" style={{color:'#888'}}>{rates.length} rate{rates.length!==1?'s':''}</p>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">+ Add Rate</button>
      </div>
      <div className="space-y-3">
        {rates.map(r=>{ const t=tb(r.trend); return (
          <div key={r._id} className="card p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{color:'#0a0a0a'}}>{r.type}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:t.bg,color:t.color}}>{t.label}</span>
                {!r.isActive&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#f5f5f5',color:'#aaa'}}>Inactive</span>}
              </div>
              <div className="flex items-center gap-4 text-xs" style={{color:'#888'}}>
                <span className="font-bold text-base" style={{color:'#0a0a0a'}}>{r.rate}</span>
                <span>{r.lender}</span><span>{r.tenure}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={()=>openEdit(r)} className="btn-ghost text-xs py-1.5 px-3">Edit</button>
              <button onClick={()=>del(r._id)} className="text-xs py-1.5 px-3 rounded-full border font-medium transition-colors"
                style={{color:'#dc2626',borderColor:'#fecaca'}}
                onMouseEnter={e=>e.currentTarget.style.background='#fef2f2'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Delete</button>
            </div>
          </div>
        )})}
        {rates.length===0&&<p className="text-sm text-center py-12" style={{color:'#ccc'}}>No rates yet.</p>}
      </div>
    </div>
  )
}

// ── FAQ Settings ───────────────────────────────────────────────
function FAQSettings() {
  const [faqs,    setFaqs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [editId,  setEditId]  = useState(null)
  const blank = { question:'', answer:'', isActive:true, order:0 }
  const [form, setForm] = useState(blank)

  const load = async () => { setLoading(true); try{const r=await faqsApi.getAllAdmin();setFaqs(r.data||[])}catch(e){setError(e.message)}finally{setLoading(false)} }
  useEffect(()=>{load()},[])
  const upd  = f => e => setForm(p=>({...p,[f]:e.target.value}))
  const updB = f => e => setForm(p=>({...p,[f]:e.target.checked}))
  const openNew  = ()  => { setForm(blank); setEditId('new'); setError(''); setSuccess('') }
  const openEdit = faq => { setForm({...faq}); setEditId(faq._id); setError(''); setSuccess('') }
  const cancel   = ()  => { setEditId(null); setError(''); setSuccess('') }
  const save = async () => {
    if(!form.question.trim()||!form.answer.trim()){setError('Question and answer required.');return}
    setSaving(true);setError('');setSuccess('')
    try {
      editId==='new' ? await faqsApi.create(form) : await faqsApi.update(editId,form)
      setSuccess(editId==='new'?'FAQ added!':'FAQ updated!'); setEditId(null); load()
    } catch(e){setError(e.message)} finally{setSaving(false)}
  }
  const del = async id => { if(!window.confirm('Delete this FAQ?'))return; try{await faqsApi.delete(id);load()}catch(e){setError(e.message)} }
  const toggle = async faq => { try{await faqsApi.update(faq._id,{isActive:!faq.isActive});load()}catch(e){setError(e.message)} }

  if(loading) return <div className="py-20 flex justify-center"><Spinner/></div>
  if(editId!==null) return (
    <div className="card p-7 max-w-2xl">
      <h3 className="text-base font-bold mb-5" style={{color:'#0a0a0a'}}>{editId==='new'?'Add New FAQ':'Edit FAQ'}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#888'}}>Question</label>
          <input value={form.question} onChange={upd('question')} placeholder="Enter question…" className="input-field" maxLength={300}/>
          <p className="text-xs mt-1" style={{color:'#ccc'}}>{form.question.length}/300</p>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#888'}}>Answer</label>
          <textarea value={form.answer} onChange={upd('answer')} placeholder="Enter answer…" rows={5} className="input-field resize-none" maxLength={2000}/>
          <p className="text-xs mt-1" style={{color:'#ccc'}}>{form.answer.length}/2000</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SField label="Order" value={form.order} onChange={upd('order')} type="number" placeholder="0"/>
          <label className="flex items-center gap-3 cursor-pointer pt-6">
            <input type="checkbox" checked={form.isActive} onChange={updB('isActive')} className="w-4 h-4"/>
            <span className="text-sm font-medium" style={{color:'#555'}}>Active</span>
          </label>
        </div>
        {error&&<AlertMsg type="error" msg={error}/>}{success&&<AlertMsg type="success" msg={success}/>}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">{saving&&<Spinner sm/>}{editId==='new'?'Add FAQ':'Save'}</button>
          <button onClick={cancel} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  )
  return (
    <div>
      {success&&<AlertMsg type="success" msg={success} className="mb-4"/>}
      {error&&<AlertMsg type="error" msg={error} className="mb-4"/>}
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm" style={{color:'#888'}}>{faqs.length} FAQ{faqs.length!==1?'s':''}</p>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">+ Add FAQ</button>
      </div>
      <div className="space-y-3">
        {faqs.map((faq,i)=>(
          <div key={faq._id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'#f5f5f5',color:'#888'}}>#{faq.order??i}</span>
                  {faq.isActive
                    ?<span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:'#f3fdc8',color:'#65a30d'}}>Active</span>
                    :<span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:'#f5f5f5',color:'#aaa'}}>Inactive</span>}
                </div>
                <p className="text-sm font-semibold mb-1" style={{color:'#0a0a0a'}}>{faq.question}</p>
                <p className="text-xs leading-relaxed" style={{color:'#888',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>toggle(faq)} className="text-xs py-1.5 px-3 rounded-full border font-medium transition-all"
                  style={{color:faq.isActive?'#ca8a04':'#059669',borderColor:faq.isActive?'#fde68a':'#6ee7b7'}}>
                  {faq.isActive?'Deactivate':'Activate'}
                </button>
                <button onClick={()=>openEdit(faq)} className="btn-ghost text-xs py-1.5 px-3">Edit</button>
                <button onClick={()=>del(faq._id)} className="text-xs py-1.5 px-3 rounded-full border font-medium transition-colors"
                  style={{color:'#dc2626',borderColor:'#fecaca'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#fef2f2'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {faqs.length===0&&<p className="text-sm text-center py-12" style={{color:'#ccc'}}>No FAQs yet.</p>}
      </div>
    </div>
  )
}

// ── Profile Settings ───────────────────────────────────────────
function ProfileSettings({ user }) {
  const [form,    setForm]    = useState({ fullName: user?.fullName||'', phone: user?.phone||'' })
  const [pwForm,  setPwForm]  = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [saving,  setSaving]  = useState(false)
  const [savePw,  setSavePw]  = useState(false)
  const [err,     setErr]     = useState('')
  const [ok,      setOk]      = useState('')
  const [errPw,   setErrPw]   = useState('')
  const [okPw,    setOkPw]    = useState('')

  const upd   = f => e => setForm(p=>({...p,[f]:e.target.value}))
  const updPw = f => e => setPwForm(p=>({...p,[f]:e.target.value}))
  const initials = user?.fullName?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'A'

  const saveProfile = async () => {
    if(!form.fullName.trim()){setErr('Full name required.');return}
    setSaving(true);setErr('');setOk('')
    try{await authApi.updateMe({fullName:form.fullName.trim(),phone:form.phone.trim()});setOk('Profile updated!')}
    catch(e){setErr(e.message)}finally{setSaving(false)}
  }
  const changePw = async () => {
    if(!pwForm.currentPassword||!pwForm.newPassword){setErrPw('All fields required.');return}
    if(pwForm.newPassword.length<8){setErrPw('Min 8 characters.');return}
    if(pwForm.newPassword!==pwForm.confirmPassword){setErrPw('Passwords do not match.');return}
    setSavePw(true);setErrPw('');setOkPw('')
    try{await api.put('/auth/change-password',{currentPassword:pwForm.currentPassword,newPassword:pwForm.newPassword});setOkPw('Password changed!');setPwForm({currentPassword:'',newPassword:'',confirmPassword:''})}
    catch(e){setErrPw(e.message||'Failed to change password.')}finally{setSavePw(false)}
  }
  const strength = p => !p?null:p.length<6?{l:'Weak',c:'#ef4444',w:'25%'}:p.length<8?{l:'Fair',c:'#f97316',w:'50%'}:p.length<12?{l:'Good',c:'#eab308',w:'75%'}:{l:'Strong',c:'#22c55e',w:'100%'}
  const s = strength(pwForm.newPassword)

  return (
    <div className="max-w-xl space-y-6">
      <div className="card p-6">
        <h3 className="text-sm font-bold mb-5" style={{color:'#0a0a0a'}}>Profile Information</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl" style={{background:'#c8f542',color:'#0a0a0a'}}>{initials}</div>
          <div>
            <p className="font-semibold" style={{color:'#0a0a0a'}}>{user?.fullName}</p>
            <p className="text-xs" style={{color:'#888'}}>{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{background:'#f3fdc8',color:'#65a30d'}}>👑 Admin</span>
          </div>
        </div>
        <div className="space-y-4">
          <SField label="Full Name" value={form.fullName} onChange={upd('fullName')} placeholder="Your full name"/>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#888'}}>Email</label>
            <input value={user?.email||''} disabled className="input-field opacity-50 cursor-not-allowed"/>
            <p className="text-xs mt-1" style={{color:'#ccc'}}>Email cannot be changed</p>
          </div>
          <SField label="Phone" value={form.phone} onChange={upd('phone')} placeholder="+91 98765 00000"/>
        </div>
        {err&&<AlertMsg type="error" msg={err} className="mt-4"/>}
        {ok &&<AlertMsg type="success" msg={ok} className="mt-4"/>}
        <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2 mt-5">{saving&&<Spinner sm/>}Save Profile</button>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-bold mb-5" style={{color:'#0a0a0a'}}>Change Password</h3>
        <div className="space-y-4">
          <SField label="Current Password" value={pwForm.currentPassword} onChange={updPw('currentPassword')} type="password" placeholder="••••••••"/>
          <SField label="New Password"     value={pwForm.newPassword}     onChange={updPw('newPassword')}     type="password" placeholder="Min. 8 characters"/>
          {s&&<div><div className="h-1.5 rounded-full overflow-hidden" style={{background:'#eee'}}><div className="h-full rounded-full transition-all duration-300" style={{width:s.w,background:s.c}}/></div><p className="text-xs mt-1 font-medium" style={{color:s.c}}>{s.l}</p></div>}
          <SField label="Confirm Password" value={pwForm.confirmPassword} onChange={updPw('confirmPassword')} type="password" placeholder="Re-enter password"/>
        </div>
        {errPw&&<AlertMsg type="error"   msg={errPw} className="mt-4"/>}
        {okPw &&<AlertMsg type="success" msg={okPw}  className="mt-4"/>}
        <button onClick={changePw} disabled={savePw} className="btn-primary flex items-center gap-2 mt-5">{savePw&&<Spinner sm/>}Change Password</button>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-bold mb-4" style={{color:'#0a0a0a'}}>Account Info</h3>
        <div className="space-y-3">
          {[
            {label:'Role',        value:'Administrator'},
            {label:'Member since',value: user?.createdAt?new Date(user.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—'},
            {label:'User ID',     value: user?._id?.slice(-8)?.toUpperCase()||'—'},
          ].map(({label,value})=>(
            <div key={label} className="flex items-center justify-between py-2" style={{borderBottom:'1px solid #f5f5f5'}}>
              <span className="text-xs" style={{color:'#888'}}>{label}</span>
              <span className="text-sm font-medium" style={{color:'#0a0a0a'}}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main AdminPage ─────────────────────────────────────────────
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('leads')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Desktop sidebar width based on collapsed state
  const sidebarW = sidebarCollapsed ? 68 : 240

  return (
    <div className="min-h-screen" style={{ background: '#f9f9f9' }}>

      {/* Sidebar — passes collapsed state up so main content can offset correctly */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* ── Main content ──
          Mobile  : full width, top-pad 60px (mobile header height)
          Desktop : left-margin = sidebar width, top-pad 0
      ── */}
      <div
        className="transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          /* mobile: no left margin, pad for top bar */
          marginLeft: 0,
          paddingTop: 60,
        }}
      >
        {/* Responsive override for lg screens */}
        <style>{`
          @media (min-width: 1024px) {
            .admin-main-content {
              margin-left: ${sidebarW}px !important;
              padding-top: 0 !important;
            }
          }
        `}</style>

        <div
          className="admin-main-content transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl min-h-screen"
          style={{ background: '#f9f9f9' }}
        >
          {activeSection === 'leads'    && <LeadsDashboard />}
          {activeSection === 'stats'    && <Analytics />}
          {activeSection === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  )
}
