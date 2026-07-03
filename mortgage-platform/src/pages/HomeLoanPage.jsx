import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle, FileText,
  User, Building2, ChevronDown, BarChart2,
  Wrench, ArrowRightLeft, Home, Calculator
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
}

/* ── Loan types ── */
const loanTypes = [
  { icon: Home,           title: 'Home Purchase',     desc: 'Buy a new flat, house, or villa with up to 80% LTV financing.', rate: 'From 8.5%',  amount: 'Up to ₹5 Crore',          tenure: '30 yrs', color: '#5eead4', bg: '#f0fdfa', value: 'Home Purchase' },
  { icon: Wrench,         title: 'Home Construction', desc: 'Build on your own plot — staged disbursement as work progresses.', rate: 'From 8.75%', amount: 'Up to ₹2 Crore',          tenure: '25 yrs', color: '#c4b5fd', bg: '#f5f3ff', value: 'Home Construction' },
  { icon: Building2,      title: 'Renovation Loan',   desc: 'Upgrade or extend your existing home. Fast approval.', rate: 'From 9.0%',  amount: 'Up to ₹50 Lakhs',         tenure: '15 yrs', color: '#b5f23d', bg: '#f3fde8', value: 'Home Renovation' },
  { icon: ArrowRightLeft, title: 'Balance Transfer',  desc: 'Move to a lower rate and reduce your total interest burden.', rate: 'From 8.5%',  amount: 'Outstanding balance', tenure: 'Remaining', color: '#fca5a5', bg: '#fef2f2', value: 'Balance Transfer' },
]

const eligibility = [
  'Indian resident, age 21–65 years at loan maturity',
  'Salaried: minimum ₹25,000/month; Self-employed: 3+ years stable income',
  'CIBIL score 700+ preferred (lower scores considered case by case)',
  'Property with clear title, approved plan, and NOC',
  'LTV ratio up to 80% of registered property value',
]

const documents = [
  { icon: User,      label: 'KYC',             desc: 'PAN + Aadhaar / Passport / Voter ID of all applicants' },
  { icon: FileText,  label: 'Income Proof',    desc: '3 salary slips + 6-month bank statement + 2yr ITR' },
  { icon: Building2, label: 'Property Docs',  desc: 'Sale deed, approved plan, title documents, NOC' },
  { icon: BarChart2, label: 'Employment',      desc: 'Appointment letter, Form 16, or business registration' },
]

const faqs = [
  { q: 'What % of property value can I borrow?', a: 'Up to 80% for loans above ₹30L; up to 90% below ₹30L per RBI norms. Exact eligibility depends on your repayment capacity.' },
  { q: 'Maximum tenure?', a: 'Up to 30 years for salaried. Loan must close by age 70. Self-employed typically get up to 20 years.' },
  { q: 'Can I apply jointly?', a: 'Yes — joint home loans with spouse, parent, or sibling increase eligible amount. Both co-applicants can claim tax deductions.' },
  { q: 'Tax benefits on home loans?', a: 'Section 24(b): up to ₹2L deduction on interest. Section 80C: up to ₹1.5L on principal repayment per financial year.' },
  { q: 'How long does approval take?', a: 'In-principle approval in 48 hrs after document submission. Final sanction and disbursal within 7–10 working days.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${open ? '#0a0a0a' : '#ebebeb'}`, background: '#fff' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
        <span className="font-medium text-sm" style={{ color: '#0a0a0a' }}>{q}</span>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: open ? '#0a0a0a' : '#f5f5f5' }}>
          <ChevronDown size={14} color={open ? '#fff' : '#555'} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>
      {open && <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#555' }}>{a}</p>}
    </div>
  )
}

export default function HomeLoanPage() {
  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── HERO ── */}
      <section className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #f3fde8 50%, #f5f3ff 100%)' }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(94,234,212,0.3)', color: '#0f766e', border: '1px solid #5eead4' }}>
              <Home size={12} /> Home Loans
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="type-heading mb-5" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0a0a0a' }}>
              Own Your<br /><span style={{ color: '#0f766e' }}>Dream Home</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="type-body text-lg mb-8 max-w-md" style={{ color: '#555' }}>
              Home loans from 8.5% p.a. · Tenure up to 30 years · Compare 20+ lenders · No hidden charges.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/apply" className="btn-primary text-base py-3.5 px-8 flex items-center gap-2">
                Apply Now <ArrowRight size={16} />
              </Link>
              <Link to="/calculator" className="btn-green-outline text-base py-3.5 px-8 flex items-center gap-2">
                <Calculator size={15} /> Calculate EMI
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex flex-wrap gap-5">
              {['No hidden fees', 'Doorstep service', 'Tax benefits available'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: '#555' }}>
                  <CheckCircle size={14} style={{ color: '#b5f23d' }} strokeWidth={2.5} />{t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — stats grid */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="grid grid-cols-2 gap-4">
            {[
              { label: 'Rate from',  value: '8.5% p.a.', color: '#0f766e', bg: '#f0fdfa' },
              { label: 'Up to',      value: '₹5 Crore',  color: '#65a30d', bg: '#f3fde8' },
              { label: 'Max Tenure', value: '30 Years',  color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'LTV Ratio',  value: 'Up to 80%', color: '#ca8a04', bg: '#fef9c3' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="card p-5 text-center" style={{ background: bg }}>
                <p className="type-number text-2xl mb-1" style={{ color }}>{value}</p>
                <p className="type-body text-xs" style={{ color: '#555' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LOAN TYPES ── */}
      <section className="py-16 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="section-label mb-3">Products</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#0a0a0a' }}>Which home loan do you need?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loanTypes.map(({ icon: Icon, title, desc, rate, amount, tenure, color, bg }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: bg, border: `1px solid ${color}33` }}
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.09)' }} transition={{ duration: 0.2 }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '44' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h3 className="type-subheading text-sm mb-1" style={{ color: '#0a0a0a' }}>{title}</h3>
                  <p className="type-body text-xs" style={{ color: '#555' }}>{desc}</p>
                </div>
                <div className="space-y-1 pt-2" style={{ borderTop: `1px solid ${color}33` }}>
                  {[['Rate', rate],['Amount', amount],['Tenure', tenure]].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span style={{ color: '#888' }}>{k}</span>
                      <span className="font-semibold" style={{ color: '#0a0a0a' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY + DOCS ── */}
      <section className="py-16 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="section-label mb-3">Eligibility</p>
            <h2 className="type-heading mb-5" style={{ fontSize: '1.75rem', color: '#0a0a0a' }}>Do you qualify?</h2>
            <div className="space-y-3">
              {eligibility.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#b5f23d' }}>
                    <CheckCircle size={11} color="#0a0a0a" strokeWidth={2.5} />
                  </div>
                  <p className="type-body text-sm" style={{ color: '#555' }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="section-label mb-3">Documents Required</p>
            <div className="space-y-3">
              {documents.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3 card p-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f5f5f5' }}>
                    <Icon size={15} style={{ color: '#555' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: '#0a0a0a' }}>{label}</p>
                    <p className="type-body text-xs" style={{ color: '#888' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="section-label mb-2">FAQ</p>
            <h2 className="type-heading" style={{ fontSize: '2rem', color: '#0a0a0a' }}>Common questions</h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <FAQItem {...faq} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
