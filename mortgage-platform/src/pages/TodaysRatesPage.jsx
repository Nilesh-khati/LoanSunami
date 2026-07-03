import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingDown, TrendingUp, Minus, ArrowRight,
  RefreshCw, Calculator, CheckCircle, Info
} from 'lucide-react'
import ratesApi from '../api/rates.js'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' } }),
}

const trendConfig = {
  down:   { icon: TrendingDown, bg: '#ccfbf1', text: '#0f766e', label: 'Falling',  badge: '#f0fdf4' },
  up:     { icon: TrendingUp,   bg: '#fef2f2', text: '#dc2626', label: 'Rising',   badge: '#fef2f2' },
  stable: { icon: Minus,        bg: '#fef9c3', text: '#ca8a04', label: 'Stable',   badge: '#fefce8' },
}

/* Fallback data if API is not available */
const FALLBACK = [
  { type: 'Home Loan',           rate: '8.50%', rateValue: 8.50, trend: 'down',   lender: 'SBI',       tenure: 'Up to 30 yrs', category: 'Home' },
  { type: 'Balance Transfer',    rate: '8.75%', rateValue: 8.75, trend: 'stable', lender: 'HDFC',      tenure: 'Up to 25 yrs', category: 'Home' },
  { type: 'Plot Loan',           rate: '9.20%', rateValue: 9.20, trend: 'up',     lender: 'ICICI',     tenure: 'Up to 20 yrs', category: 'Home' },
  { type: 'Construction Loan',   rate: '9.00%', rateValue: 9.00, trend: 'down',   lender: 'Axis',      tenure: 'Up to 25 yrs', category: 'Home' },
  { type: 'Business Term Loan',  rate: '10.5%', rateValue: 10.5, trend: 'stable', lender: 'HDFC',      tenure: 'Up to 5 yrs',  category: 'Business' },
  { type: 'Working Capital',     rate: '11.0%', rateValue: 11.0, trend: 'up',     lender: 'ICICI',     tenure: 'Up to 2 yrs',  category: 'Business' },
  { type: 'Personal Loan',       rate: '12.5%', rateValue: 12.5, trend: 'down',   lender: 'SBI',       tenure: 'Up to 5 yrs',  category: 'Personal' },
  { type: 'Loan Against Property',rate:'9.50%', rateValue: 9.50, trend: 'stable', lender: 'Kotak',     tenure: 'Up to 15 yrs', category: 'Home' },
]

const CATEGORIES = ['All', 'Home', 'Business', 'Personal']

function RateCard({ rate, i }) {
  const trendKey = rate.trend || 'stable'
  const { icon: TrendIcon, bg, text, label } = trendConfig[trendKey] || trendConfig.stable

  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true }} custom={i}
      className="card p-6 flex flex-col gap-4"
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
          style={{ background: '#f5f5f5', color: '#888' }}>
          {rate.lender}
        </span>
        <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: bg, color: text }}>
          <TrendIcon size={11} strokeWidth={2.5} /> {label}
        </div>
      </div>

      {/* Rate */}
      <div>
        <p className="type-number" style={{ fontSize: '2.25rem', color: '#0a0a0a' }}>
          {rate.rate}
        </p>
        <p className="type-subheading text-sm mt-1" style={{ color: '#0a0a0a' }}>{rate.type}</p>
        <p className="type-body text-xs mt-0.5" style={{ color: '#888' }}>{rate.tenure}</p>
      </div>

      {/* Apply */}
      <Link to="/apply"
        className="flex items-center gap-1.5 text-xs font-semibold mt-auto transition-colors"
        style={{ color: '#0a0a0a' }}
        onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
        onMouseLeave={e => e.currentTarget.style.color = '#0a0a0a'}>
        Apply at this rate <ArrowRight size={11} />
      </Link>
    </motion.div>
  )
}

export default function TodaysRatesPage() {
  const [rates,    setRates]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [category, setCategory] = useState('All')
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchRates = async () => {
    setLoading(true); setError('')
    try {
      const res = await ratesApi.getAll()
      if (res.data && res.data.length > 0) {
        setRates(res.data)
        setLastUpdated(new Date().toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        }))
      } else {
        setRates(FALLBACK)
        setLastUpdated('June 2026 (Indicative)')
      }
    } catch {
      setRates(FALLBACK)
      setLastUpdated('June 2026 (Indicative)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRates() }, [])

  const filtered = category === 'All'
    ? rates
    : rates.filter(r => (r.category || '').toLowerCase() === category.toLowerCase())

  /* Summary stats */
  const lowestRate = rates.length
    ? Math.min(...rates.map(r => r.rateValue || parseFloat(r.rate) || 99))
    : null
  const fallingCount = rates.filter(r => r.trend === 'down').length
  const risingCount  = rates.filter(r => r.trend === 'up').length

  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── HERO ── */}
      <section className="py-16 px-6"
        style={{ background: 'linear-gradient(135deg, #f3fde8 0%, #f5f3ff 50%, #f0fdfa 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left */}
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: 'rgba(181,242,61,0.25)', color: '#4d7c0f', border: '1px solid #b5f23d' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Rates — Updated {lastUpdated || 'Today'}
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="type-heading mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', color: '#0a0a0a' }}>
                Today's Loan<br />
                <span style={{ color: '#7c3aed' }}>Interest Rates</span>
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="type-body text-base max-w-lg mb-6" style={{ color: '#555' }}>
                Compare the latest interest rates across all loan types from India's top lenders.
                All rates are indicative and subject to eligibility.
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex items-center gap-4">
                <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
                  Apply Now <ArrowRight size={15} />
                </Link>
                <Link to="/calculator" className="btn-green-outline inline-flex items-center gap-2">
                  <Calculator size={15} /> Calculate EMI
                </Link>
              </motion.div>
            </div>

            {/* Right — summary cards */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="grid grid-cols-3 gap-3 lg:w-96">
              {[
                { label: 'Lowest Rate',    value: lowestRate ? `${lowestRate}%` : '—',     color: '#059669', bg: '#f0fdf4' },
                { label: 'Rates Falling',  value: `${fallingCount} types`,                 color: '#0f766e', bg: '#ccfbf1' },
                { label: 'Rates Rising',   value: `${risingCount} types`,                  color: '#dc2626', bg: '#fef2f2' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="rounded-2xl p-4 text-center card" style={{ background: bg }}>
                  <p className="type-number text-xl mb-1" style={{ color }}>{value}</p>
                  <p className="type-body text-xs" style={{ color: '#555' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RATES TABLE ── */}
      <section className="py-16 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">

          {/* Filter + Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: category === cat ? '#0a0a0a' : '#f5f5f5',
                    color:      category === cat ? '#ffffff' : '#555',
                    border:     `1.5px solid ${category === cat ? '#0a0a0a' : '#e5e5e5'}`,
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={fetchRates} disabled={loading}
              className="flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#888' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh rates
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-20 text-center">
              <svg className="animate-spin w-8 h-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none" style={{ color: '#b5f23d' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm" style={{ color: '#888' }}>Fetching latest rates…</p>
            </div>
          ) : (
            <>
              {/* Rate cards grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filtered.map((rate, i) => (
                  <RateCard key={rate._id || rate.type} rate={rate} i={i} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm" style={{ color: '#888' }}>No rates found for this category.</p>
                </div>
              )}
            </>
          )}

          {/* Disclaimer */}
          <div className="mt-10 flex items-start gap-3 px-5 py-4 rounded-2xl"
            style={{ background: '#fefce8', border: '1px solid #fde68a' }}>
            <Info size={16} style={{ color: '#ca8a04', flexShrink: 0, marginTop: 2 }} />
            <p className="type-body text-xs leading-relaxed" style={{ color: '#855f00' }}>
              All interest rates displayed are indicative and sourced from publicly available data.
              Actual rates offered may vary based on your credit score, income, loan amount, and
              lender's underwriting policy. LoanSunami is not responsible for rate changes post-display.
              Rates are updated periodically and may not reflect real-time lender offers.
            </p>
          </div>
        </div>
      </section>

      {/* ── RATE COMPARISON TABLE ── */}
      <section className="py-16 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-8">
            <p className="section-label mb-2">Comparison</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0a0a0a' }}>
              Rate comparison at a glance
            </h2>
          </motion.div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
                    {['Loan Type', 'Lender', 'Interest Rate', 'Tenure', 'Trend', 'Action'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: '#888' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [] : filtered).map((rate, i) => {
                    const trendKey = rate.trend || 'stable'
                    const { icon: TrendIcon, bg, text, label } = trendConfig[trendKey] || trendConfig.stable
                    return (
                      <motion.tr key={rate._id || rate.type}
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: '1px solid #fafafa' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-sm" style={{ color: '#0a0a0a' }}>{rate.type}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm" style={{ color: '#555' }}>{rate.lender}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="type-number text-base font-bold" style={{ color: '#0a0a0a' }}>{rate.rate}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm" style={{ color: '#555' }}>{rate.tenure}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: bg, color: text }}>
                            <TrendIcon size={10} strokeWidth={2.5} /> {label}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Link to="/apply"
                            className="text-xs font-semibold transition-colors"
                            style={{ color: '#0a0a0a' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
                            onMouseLeave={e => e.currentTarget.style.color = '#0a0a0a'}>
                            Apply →
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-10" style={{ background: '#0a0a0a' }}>
            <h2 className="type-heading text-white mb-3" style={{ fontSize: '2rem' }}>
              Found a rate you like?
            </h2>
            <p className="type-body text-sm mb-6" style={{ color: '#888' }}>
              Apply now and lock in today's best rate before it changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/apply" className="btn-green inline-flex items-center gap-2 px-8 py-3.5">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link to="/calculator" className="btn-green-outline inline-flex items-center gap-2 px-8 py-3.5"
                style={{ color: '#ffffff', borderColor: '#444' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#0a0a0a' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff' }}>
                <Calculator size={15} /> Calculate EMI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
