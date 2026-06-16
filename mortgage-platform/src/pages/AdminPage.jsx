import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, CheckCircle, Search, Download, Eye, Phone, Mail, IndianRupee, Calendar, Zap } from 'lucide-react'

const mockLeads = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@email.com',  phone: '+91 98765 43210', amount: 5000000,  purpose: 'Home Purchase',     status: 'New',       income: 120000, date: '2026-06-13', city: 'Mumbai'    },
  { id: 2, name: 'Rahul Mehta',   email: 'rahul@email.com',  phone: '+91 87654 32109', amount: 8000000,  purpose: 'Home Construction', status: 'Contacted', income: 200000, date: '2026-06-12', city: 'Delhi'     },
  { id: 3, name: 'Anjali Patel',  email: 'anjali@email.com', phone: '+91 76543 21098', amount: 3500000,  purpose: 'Balance Transfer',  status: 'Qualified', income: 90000,  date: '2026-06-12', city: 'Bangalore' },
  { id: 4, name: 'Vikram Singh',  email: 'vikram@email.com', phone: '+91 65432 10987', amount: 12000000, purpose: 'Home Purchase',     status: 'New',       income: 350000, date: '2026-06-11', city: 'Pune'      },
  { id: 5, name: 'Sneha Nair',    email: 'sneha@email.com',  phone: '+91 54321 09876', amount: 6000000,  purpose: 'Plot Purchase',     status: 'Closed',    income: 150000, date: '2026-06-11', city: 'Chennai'   },
  { id: 6, name: 'Amit Kumar',    email: 'amit@email.com',   phone: '+91 43210 98765', amount: 4500000,  purpose: 'Home Renovation',   status: 'Contacted', income: 110000, date: '2026-06-10', city: 'Hyderabad' },
]

const statusConfig = {
  New:       { bg: '#f3fdc8', text: '#65a30d', border: '#c8f542' },
  Contacted: { bg: '#fef9c3', text: '#ca8a04', border: '#fde68a' },
  Qualified: { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
  Closed:    { bg: '#ccfbf1', text: '#0f766e', border: '#5eead4' },
}

const stats = [
  { label: 'Total Leads',    value: '124',  change: '+12 today',      icon: Users,       accent: '#0a0a0a', bg: '#f5f5f5' },
  { label: 'Contacted',      value: '48',   change: '38.7% rate',     icon: Phone,       accent: '#ca8a04', bg: '#fef9c3' },
  { label: 'Qualified',      value: '31',   change: '25% conversion', icon: CheckCircle, accent: '#7c3aed', bg: '#ede9fe' },
  { label: 'Avg. Loan Size', value: '₹62L', change: 'This month',     icon: TrendingUp,  accent: '#0f766e', bg: '#ccfbf1' },
]

export default function AdminPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)

  const filtered = mockLeads.filter(lead => {
    const q = search.toLowerCase()
    return (
      (lead.name.toLowerCase().includes(q) || lead.email.toLowerCase().includes(q) || lead.city.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || lead.status === statusFilter)
    )
  })

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: '#f9f9f9' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                <Zap size={14} color="#c8f542" fill="#c8f542" />
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                Lead Dashboard
              </h1>
            </div>
            <p className="text-sm" style={{ color: '#888888' }}>
              Manage and track all loan applications
            </p>
          </div>
          <button className="btn-ghost flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, change, icon: Icon, accent, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon size={18} style={{ color: accent }} strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#888888' }}>{change}</span>
              </div>
              <div
                className="text-2xl font-extrabold mb-0.5"
                style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: '#888888' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#cccccc' }} />
            <input
              type="text"
              placeholder="Search by name, email, or city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'New', 'Contacted', 'Qualified', 'Closed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: statusFilter === s ? '#c8f542' : '#ffffff',
                  color: statusFilter === s ? '#0a0a0a' : '#888888',
                  border: `1.5px solid ${statusFilter === s ? '#c8f542' : '#e0e0e0'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                  {['Applicant', 'Contact', 'Loan', 'Income', 'Date', 'Status', ''].map(h => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#888888' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm" style={{ color: '#0a0a0a' }}>{lead.name}</div>
                      <div className="text-xs" style={{ color: '#888888' }}>{lead.city}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: '#555555' }}>
                        <Mail size={11} />{lead.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555555' }}>
                        <Phone size={11} />{lead.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold" style={{ color: '#0a0a0a' }}>
                        ₹{(lead.amount / 100000).toFixed(0)}L
                      </div>
                      <div className="text-xs" style={{ color: '#888888' }}>{lead.purpose}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm" style={{ color: '#555555' }}>
                        ₹{(lead.income / 1000).toFixed(0)}K/mo
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: '#888888' }}>{lead.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: statusConfig[lead.status].bg,
                          color: statusConfig[lead.status].text,
                          border: `1px solid ${statusConfig[lead.status].border}`,
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                        style={{ color: '#aaaaaa' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaaaaa' }}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search size={28} className="mx-auto mb-3" style={{ color: '#dddddd' }} />
              <p className="text-sm" style={{ color: '#888888' }}>No leads match your search</p>
            </div>
          )}
        </div>
        <p className="text-xs mt-3 text-right" style={{ color: '#cccccc' }}>
          Showing {filtered.length} of {mockLeads.length} · Preview data
        </p>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedLead(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="card p-8 max-w-md w-full"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>{selectedLead.name}</h3>
                <p className="text-sm" style={{ color: '#888888' }}>{selectedLead.city}</p>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: statusConfig[selectedLead.status].bg,
                  color: statusConfig[selectedLead.status].text,
                  border: `1px solid ${statusConfig[selectedLead.status].border}`,
                }}
              >
                {selectedLead.status}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Email',          value: selectedLead.email,                                    icon: Mail        },
                { label: 'Phone',          value: selectedLead.phone,                                    icon: Phone       },
                { label: 'Loan Amount',    value: `₹${(selectedLead.amount / 100000).toFixed(0)} Lakhs`, icon: IndianRupee },
                { label: 'Purpose',        value: selectedLead.purpose,                                  icon: CheckCircle },
                { label: 'Monthly Income', value: `₹${selectedLead.income.toLocaleString('en-IN')}`,     icon: TrendingUp  },
                { label: 'Applied On',     value: selectedLead.date,                                     icon: Calendar    },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-2"
                  style={{ borderBottom: '1px solid #f5f5f5' }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#f5f5f5' }}
                  >
                    <Icon size={13} style={{ color: '#888888' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#888888' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 justify-center">Mark as Contacted</button>
              <button
                onClick={() => setSelectedLead(null)}
                className="btn-ghost px-5"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
