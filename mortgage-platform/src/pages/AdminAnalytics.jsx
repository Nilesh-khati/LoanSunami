// ── AdminAnalytics — loaded ONLY when Analytics tab is active ──
// Recharts (341KB) stays in this chunk and never loads for Dashboard/Settings
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Phone, IndianRupee,
  BarChart2, ArrowUp, ArrowDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import api from '../api/client.js'

const STATUS_COLORS  = { New: '#c8f542', Contacted: '#fbbf24', Qualified: '#a78bfa', Closed: '#34d399' }
const PURPOSE_COLORS = ['#c8f542','#60a5fa','#f472b6','#fb923c','#a78bfa','#34d399','#f87171']
const EMP_COLORS     = ['#0a0a0a','#c8f542','#60a5fa','#f472b6','#fb923c']

const tooltipStyle = {
  background: '#ffffff', border: '1px solid #eeeeee', borderRadius: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12,
}

export default function AdminAnalytics() {
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

  const volumeDiff = overview.thisMonthVolume - overview.lastMonthVolume
  const volumePct  = overview.lastMonthVolume > 0
    ? Math.round((volumeDiff / overview.lastMonthVolume) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <BarChart2 size={14} color="#c8f542" />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>Analytics</h1>
        </div>
        <p className="text-sm" style={{ color: '#888' }}>Real-time insights across all leads and loan activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads',      value: overview.totalLeads,      sub: `+${overview.todayLeads} today`,        icon: Users,       accent: '#0a0a0a', bg: '#f5f5f5' },
          { label: 'Conversion Rate',  value: `${overview.conversionRate}%`, sub: `${overview.qualifiedLeads} qualified`, icon: TrendingUp,  accent: '#7c3aed', bg: '#ede9fe' },
          { label: 'Contact Rate',     value: `${overview.contactRate}%`,    sub: `${overview.contactedLeads} contacted`, icon: Phone,       accent: '#ca8a04', bg: '#fef9c3' },
          { label: 'Avg Loan Size',    value: overview.avgLoanAmount ? `₹${(overview.avgLoanAmount/100000).toFixed(1)}L` : '—', sub: 'This month', icon: IndianRupee, accent: '#0f766e', bg: '#ccfbf1' },
        ].map(({ label, value, sub, icon: Icon, accent, bg }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={18} style={{ color: accent }} strokeWidth={1.75} />
            </div>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>{value}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: '#0a0a0a' }}>{label}</div>
            <div className="text-xs" style={{ color: '#888' }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Row 1: 7-day line + Status pie */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>Leads — Last 7 Days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7Days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" name="Leads" stroke="#0a0a0a" strokeWidth={2.5}
                dot={{ r: 4, fill: '#c8f542', stroke: '#0a0a0a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>Lead Status</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={68}
                dataKey="count" nameKey="status" paddingAngle={3}>
                {statusBreakdown.map(({ status }) => <Cell key={status} fill={STATUS_COLORS[status] || '#e5e5e5'} />)}
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

      {/* Row 2: 6-month bar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#888' }}>Monthly Lead Volume — Last 6 Months</p>
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
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `₹${v}L`} tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => name === 'Volume (₹L)' ? [`₹${v}L`, name] : [v, name]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
            <Bar yAxisId="left"  dataKey="leads"  name="Leads"       fill="#0a0a0a" radius={[6,6,0,0]} maxBarSize={40} />
            <Bar yAxisId="right" dataKey="volume" name="Volume (₹L)" fill="#c8f542" radius={[6,6,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Purpose + City */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>Leads by Loan Purpose</p>
          {purposeBreakdown.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={purposeBreakdown} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#aaa', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="purpose" width={100} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Leads" radius={[0,6,6,0]} maxBarSize={18}>
                    {purposeBreakdown.map((_, i) => <Cell key={i} fill={PURPOSE_COLORS[i % PURPOSE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>Top Cities</p>
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
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                          className="h-full rounded-full"
                          style={{ background: PURPOSE_COLORS[i % PURPOSE_COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      </div>

      {/* Row 4: Employment + Avg Loan */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#888' }}>Employment Type</p>
          {employmentBreakdown.length === 0
            ? <p className="text-sm text-center py-8" style={{ color: '#ccc' }}>No data</p>
            : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={employmentBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                      dataKey="count" nameKey="type" paddingAngle={2}>
                      {employmentBreakdown.map((_, i) => <Cell key={i} fill={EMP_COLORS[i % EMP_COLORS.length]} />)}
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
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: EMP_COLORS[i % EMP_COLORS.length] }} />
                          <span style={{ color: '#555' }}>{type}</span>
                        </div>
                        <span className="font-bold" style={{ color: '#0a0a0a' }}>{Math.round((count / total) * 100)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
        </div>

        <div className="card p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#888' }}>Avg Loan Amount by Purpose (₹L)</p>
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
                    {loanByPurpose.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#0a0a0a' : '#c8f542'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>
    </div>
  )
}
