import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const rates = [
  { type: 'Home Loan',        rate: '8.50%', trend: 'down',   lender: 'SBI',   tenure: 'Up to 30 yrs' },
  { type: 'Balance Transfer', rate: '8.75%', trend: 'stable', lender: 'HDFC',  tenure: 'Up to 25 yrs' },
  { type: 'Plot Loan',        rate: '9.20%', trend: 'up',     lender: 'ICICI', tenure: 'Up to 20 yrs' },
  { type: 'Construction',     rate: '9.00%', trend: 'down',   lender: 'Axis',  tenure: 'Up to 25 yrs' },
]

const trendConfig = {
  down:   { icon: TrendingDown, bg: '#ccfbf1', text: '#0f766e', label: 'Falling' },
  up:     { icon: TrendingUp,   bg: '#fef2f2', text: '#dc2626', label: 'Rising'  },
  stable: { icon: Minus,        bg: '#fef9c3', text: '#ca8a04', label: 'Stable'  },
}

export default function RatesSection() {
  return (
    <section className="py-20 px-6" id="rates" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="section-label mb-2">Today's Rates</p>
            <h2
              className="font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a', letterSpacing: '-0.03em' }}
            >
              Current Loan Rates
            </h2>
            <p className="mt-1 text-sm" style={{ color: '#888888' }}>
              Updated June 2026 · Indicative · Subject to eligibility
            </p>
          </div>
          <Link
            to="/calculator"
            className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
            style={{ color: '#0a0a0a' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Use rate calculator <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rates.map(({ type, rate, trend, lender, tenure }, i) => {
            const { icon: TrendIcon, bg, text, label } = trendConfig[trend]
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card card-hover p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ background: '#f5f5f5', color: '#888888' }}
                  >
                    {lender}
                  </span>
                  <div
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: bg, color: text }}
                  >
                    <TrendIcon size={11} strokeWidth={2.5} />{label}
                  </div>
                </div>
                <div
                  className="text-3xl font-extrabold mb-1"
                  style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}
                >
                  {rate}
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: '#0a0a0a' }}>
                  {type}
                </div>
                <div className="text-xs" style={{ color: '#888888' }}>{tenure}</div>
              </motion.div>
            )
          })}
        </div>

        <p className="text-xs mt-5" style={{ color: '#cccccc' }}>
          * Rates are indicative. Actual rates depend on your credit profile and lender underwriting policies.
        </p>
      </div>
    </section>
  )
}
