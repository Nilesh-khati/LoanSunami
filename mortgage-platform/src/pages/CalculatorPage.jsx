import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const tabs = ['EMI Calculator', 'Affordability', 'Repayment Breakdown']

const fmtCurrency = v => `₹${Number(v).toLocaleString('en-IN')}`
const fmtPct = v => `${v}%`
const fmtYrs = v => `${v} yrs`

const SliderField = ({ label, value, onChange, min, max, step = 1, format }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
        {label}
      </label>
      <span className="text-sm font-bold" style={{ color: '#0a0a0a' }}>{format(value)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full"
      style={{
        background: `linear-gradient(to right, #c8f542 ${((value - min) / (max - min)) * 100}%, #e0e0e0 0%)`,
      }}
    />
    <div className="flex justify-between text-xs mt-1" style={{ color: '#cccccc' }}>
      <span>{format(min)}</span><span>{format(max)}</span>
    </div>
  </div>
)

const StatCard = ({ label, value, accent }) => (
  <div
    className="rounded-2xl p-4 text-center"
    style={{ background: '#f9f9f9', border: '1px solid #eeeeee' }}
  >
    <p className="text-xs mb-1" style={{ color: '#888888' }}>{label}</p>
    <p className="text-base font-bold" style={{ color: accent || '#0a0a0a' }}>{value}</p>
  </div>
)

function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const r = rate / 12 / 100, n = tenure * 12
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - principal) }
  }, [principal, rate, tenure])

  const pieData = [{ name: 'Principal', value: principal }, { name: 'Interest', value: totalInterest }]

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div className="space-y-8">
        <SliderField label="Loan Amount" value={principal} onChange={setPrincipal} min={500000} max={20000000} step={100000} format={fmtCurrency} />
        <SliderField label="Interest Rate" value={rate} onChange={setRate} min={6} max={18} step={0.1} format={fmtPct} />
        <SliderField label="Loan Tenure" value={tenure} onChange={setTenure} min={1} max={30} format={fmtYrs} />
      </div>

      <div className="space-y-4">
        {/* EMI hero */}
        <div className="rounded-2xl p-7 text-center" style={{ background: '#0a0a0a' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#555555' }}>
            Monthly EMI
          </p>
          <p className="text-5xl font-extrabold mb-1" style={{ color: '#c8f542', letterSpacing: '-0.04em' }}>
            {fmtCurrency(emi)}
          </p>
          <p className="text-sm" style={{ color: '#555555' }}>per month for {tenure} years</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Payment" value={fmtCurrency(totalPayment)} />
          <StatCard label="Total Interest" value={fmtCurrency(totalInterest)} accent="#dc2626" />
        </div>

        {/* Pie */}
        <div className="rounded-2xl p-5" style={{ background: '#f9f9f9', border: '1px solid #eeeeee' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#888888' }}>
            Payment Breakdown
          </p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                  <Cell fill="#0a0a0a" />
                  <Cell fill="#c8f542" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {[
                { label: 'Principal', color: '#0a0a0a', pct: Math.round(principal / totalPayment * 100) },
                { label: 'Interest', color: '#c8f542', pct: Math.round(totalInterest / totalPayment * 100) },
              ].map(({ label, color, pct }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs flex-1" style={{ color: '#555555' }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: '#0a0a0a' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AffordabilityCalculator() {
  const [income, setIncome] = useState(100000)
  const [expenses, setExpenses] = useState(40000)
  const [existingEmi, setExistingEmi] = useState(10000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const { maxEmi, maxLoan, disposable } = useMemo(() => {
    const disposable = income - expenses - existingEmi
    const maxEmi = Math.round(disposable * 0.4)
    const r = rate / 12 / 100, n = tenure * 12
    const maxLoan = maxEmi > 0 ? Math.round((maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))) : 0
    return { maxEmi, maxLoan, disposable }
  }, [income, expenses, existingEmi, rate, tenure])

  const bars = [
    { label: 'Expenses', val: expenses, color: '#fca5a5', pct: Math.round(expenses / income * 100) },
    { label: 'Existing EMIs', val: existingEmi, color: '#fdba74', pct: Math.round(existingEmi / income * 100) },
    { label: 'New EMI (max)', val: maxEmi, color: '#ddd6fe', pct: Math.round(maxEmi / income * 100) },
    { label: 'Savings', val: Math.max(0, income - expenses - existingEmi - maxEmi), color: '#c8f542', pct: Math.max(0, Math.round((income - expenses - existingEmi - maxEmi) / income * 100)) },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div className="space-y-8">
        <SliderField label="Monthly Income" value={income} onChange={setIncome} min={30000} max={1000000} step={5000} format={fmtCurrency} />
        <SliderField label="Monthly Expenses" value={expenses} onChange={setExpenses} min={0} max={200000} step={2000} format={fmtCurrency} />
        <SliderField label="Existing EMIs" value={existingEmi} onChange={setExistingEmi} min={0} max={100000} step={1000} format={fmtCurrency} />
        <SliderField label="Interest Rate" value={rate} onChange={setRate} min={6} max={18} step={0.1} format={fmtPct} />
        <SliderField label="Loan Tenure" value={tenure} onChange={setTenure} min={5} max={30} format={fmtYrs} />
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl p-7 text-center" style={{ background: '#0a0a0a' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#555555' }}>
            Max Loan You Can Afford
          </p>
          <p className="text-5xl font-extrabold mb-1" style={{ color: '#c8f542', letterSpacing: '-0.04em' }}>
            {fmtCurrency(maxLoan)}
          </p>
          <p className="text-sm" style={{ color: '#555555' }}>based on 40% disposable income rule</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Disposable" value={fmtCurrency(disposable)} accent="#059669" />
          <StatCard label="Max EMI" value={fmtCurrency(maxEmi)} accent="#7c3aed" />
          <StatCard label="Tenure" value={fmtYrs(tenure)} />
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#f9f9f9', border: '1px solid #eeeeee' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#888888' }}>
            Income Allocation
          </p>
          {bars.map(({ label, val, color, pct }) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: '#555555' }}>{label}</span>
                <span className="font-medium" style={{ color: '#0a0a0a' }}>
                  {fmtCurrency(val)} ({pct}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#eeeeee' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RepaymentBreakdown() {
  const [principal, setPrincipal] = useState(5000000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const yearlyData = useMemo(() => {
    const r = rate / 12 / 100, n = tenure * 12
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    let balance = principal
    return Array.from({ length: tenure }, (_, i) => {
      let yP = 0, yI = 0
      for (let m = 0; m < 12; m++) {
        const interest = balance * r
        yP += emi - interest; yI += interest; balance -= (emi - interest)
      }
      return { year: `Y${i + 1}`, Principal: Math.round(yP), Interest: Math.round(yI) }
    })
  }, [principal, rate, tenure])

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <SliderField label="Loan Amount" value={principal} onChange={setPrincipal} min={500000} max={20000000} step={100000} format={fmtCurrency} />
        <SliderField label="Interest Rate" value={rate} onChange={setRate} min={6} max={18} step={0.1} format={fmtPct} />
        <SliderField label="Loan Tenure" value={tenure} onChange={setTenure} min={5} max={30} format={fmtYrs} />
      </div>
      <div
        className="rounded-2xl p-6"
        style={{ border: '1px solid #eeeeee', background: '#ffffff' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#888888' }}>
          Principal vs Interest — Yearly
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={yearlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="year" tick={{ fill: '#aaaaaa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => `${(v / 100000).toFixed(0)}L`}
              tick={{ fill: '#aaaaaa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v, n) => [fmtCurrency(v), n]}
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #eeeeee',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                color: '#0a0a0a',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#666666' }}
            />
            <Bar dataKey="Principal" fill="#0a0a0a" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Interest" fill="#c8f542" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-6 justify-center mt-4">
          {[['Principal', '#0a0a0a'], ['Interest', '#c8f542']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-2 text-xs" style={{ color: '#888888' }}>
              <div className="w-3 h-3 rounded" style={{ background: c }} /> {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: '#f9f9f9' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="section-label mb-3">Tools</p>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}
          >
            Loan Calculators
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>
            Real-time insights to plan your loan with confidence
          </p>
        </motion.div>

        {/* Tabs */}
        <div
          className="flex p-1.5 rounded-2xl mb-8 w-full max-w-lg mx-auto"
          style={{ background: '#ffffff', border: '1px solid #eeeeee' }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === i ? '#c8f542' : 'transparent',
                color: activeTab === i ? '#0a0a0a' : '#888888',
                fontWeight: activeTab === i ? '600' : '500',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="card p-8"
        >
          {activeTab === 0 && <EMICalculator />}
          {activeTab === 1 && <AffordabilityCalculator />}
          {activeTab === 2 && <RepaymentBreakdown />}
        </motion.div>

        <div className="text-center mt-10">
          <p className="text-sm mb-4" style={{ color: '#888888' }}>
            Like what you see? Let's make it official.
          </p>
          <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
            Apply Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
