import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, CheckCircle, Zap, Clock, Shield,
  BarChart2, FileText, Briefcase, ChevronDown
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
}

/* ── Loan types ── */
const loanTypes = [
  {
    title: 'Business Term Loan',
    desc: 'Fixed-amount loan for business expansion, equipment purchase, or working capital needs.',
    rate: 'From 10.5%',
    tenure: 'Up to 5 years',
    amount: 'Up to ₹50 Lakhs',
    color: '#c4b5fd',
    bg: '#f5f3ff',
  },
  {
    title: 'Working Capital Loan',
    desc: 'Short-term financing to cover day-to-day operational expenses and cash flow gaps.',
    rate: 'From 11.0%',
    tenure: 'Up to 2 years',
    amount: 'Up to ₹25 Lakhs',
    color: '#b5f23d',
    bg: '#f3fde8',
  },
  {
    title: 'Equipment Finance',
    desc: 'Finance machinery, equipment, or technology for your business at competitive rates.',
    rate: 'From 9.8%',
    tenure: 'Up to 7 years',
    amount: 'Up to ₹1 Crore',
    color: '#5eead4',
    bg: '#f0fdfa',
  },
  {
    title: 'Business Overdraft',
    desc: 'Flexible credit line to withdraw funds as needed, interest only on amount used.',
    rate: 'From 12.0%',
    tenure: 'Revolving',
    amount: 'Up to ₹20 Lakhs',
    color: '#fca5a5',
    bg: '#fef2f2',
  },
]

/* ── Eligibility ── */
const eligibility = [
  'Business must be operational for at least 2 years',
  'Annual turnover of ₹30 Lakhs or more',
  'No major defaults or NPAs in last 3 years',
  'Valid GST registration and ITR for last 2 years',
  'Proprietor/Partner age between 21–65 years',
]

/* ── Documents needed ── */
const documents = [
  { icon: FileText,  label: 'KYC Documents',         desc: 'PAN, Aadhaar, Passport/Voter ID of all directors/partners' },
  { icon: BarChart2, label: 'Financial Statements',   desc: 'Last 2 years audited P&L, Balance Sheet, ITR' },
  { icon: Briefcase, label: 'Business Proof',         desc: 'Registration certificate, GST certificate, MOA/AOA' },
  { icon: Clock,     label: 'Bank Statements',        desc: 'Last 12 months current account statements' },
]

/* ── FAQ ── */
const faqs = [
  { q: 'What is the minimum business vintage required?', a: 'Your business must be at least 2 years old with consistent revenue. Startups may qualify under special schemes with additional security.' },
  { q: 'Is collateral mandatory for a business loan?', a: 'Not always. Unsecured business loans up to ₹25 Lakhs are available for eligible businesses. Collateral improves your chances of getting a higher amount at lower rates.' },
  { q: 'How long does the approval take?', a: 'Once all documents are submitted, in-principle approval takes 24–48 hours. Final disbursal happens within 5–7 working days.' },
  { q: 'Can I prepay the loan?', a: 'Yes. Most lenders allow prepayment after 6 EMIs with nominal foreclosure charges of 2–4% of outstanding principal.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${open ? '#0a0a0a' : '#ebebeb'}`, background: '#fff' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
        <span className="font-medium text-sm" style={{ color: '#0a0a0a' }}>{q}</span>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: open ? '#0a0a0a' : '#f5f5f5' }}>
          <ChevronDown size={14} color={open ? '#ffffff' : '#555'}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>
      {open && (
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#555' }}>{a}</p>
      )}
    </div>
  )
}

export default function BusinessLoanPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #f3fde8 60%, #f0fdfa 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(196,181,253,0.3)', color: '#7c3aed', border: '1px solid #c4b5fd' }}>
                <Briefcase size={12} /> Business Loans
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="type-heading mb-5"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0a0a0a' }}>
                Fuel Your<br />
                <span style={{ color: '#7c3aed' }}>Business Growth</span>
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="type-body text-lg mb-8 max-w-md" style={{ color: '#555' }}>
                Flexible business loans from ₹1 Lakh to ₹1 Crore. Quick approval,
                minimal documentation, competitive rates — built for Indian businesses.
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/apply" className="btn-primary text-base py-3.5 px-8 flex items-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </Link>
                <Link to="/calculator" className="btn-green-outline text-base py-3.5 px-8">
                  Calculate EMI
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex flex-wrap gap-5">
                {[
                  { icon: Zap,    label: 'Approval in 48 hrs'    },
                  { icon: Shield, label: 'No hidden charges'      },
                  { icon: Clock,  label: 'Flexible repayment'     },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-sm" style={{ color: '#555' }}>
                    <CheckCircle size={15} style={{ color: '#b5f23d' }} strokeWidth={2.5} />
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — quick stats */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="grid grid-cols-2 gap-4">
              {[
                { label: 'Loan Amount',    value: 'Up to ₹1 Cr',  bg: '#f5f3ff', accent: '#7c3aed' },
                { label: 'Interest Rate',  value: 'From 9.8%',    bg: '#f3fde8', accent: '#65a30d' },
                { label: 'Quick Approval', value: '48 Hours',     bg: '#f0fdfa', accent: '#0f766e' },
                { label: 'Tenure',         value: 'Up to 7 Yrs',  bg: '#fef9c3', accent: '#ca8a04' },
              ].map(({ label, value, bg, accent }) => (
                <div key={label} className="card p-5 text-center" style={{ background: bg }}>
                  <p className="type-number text-2xl mb-1" style={{ color: accent }}>{value}</p>
                  <p className="type-body text-xs" style={{ color: '#555' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LOAN TYPES ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <p className="section-label mb-3">Loan Products</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a' }}>
              Choose the right loan for your business
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loanTypes.map(({ title, desc, rate, tenure, amount, color, bg }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all"
                style={{ background: bg, border: `1px solid ${color}33` }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: color + '44' }}>
                  <BarChart2 size={18} style={{ color }} />
                </div>
                <div>
                  <h3 className="type-subheading text-base mb-1" style={{ color: '#0a0a0a' }}>{title}</h3>
                  <p className="type-body text-xs leading-relaxed" style={{ color: '#555' }}>{desc}</p>
                </div>
                <div className="space-y-1 mt-auto pt-3" style={{ borderTop: `1px solid ${color}33` }}>
                  {[['Rate', rate], ['Tenure', tenure], ['Amount', amount]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span style={{ color: '#888' }}>{k}</span>
                      <span className="font-semibold" style={{ color: '#0a0a0a' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <Link to="/apply"
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color }}>
                  Apply Now <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ── */}
      <section className="py-20 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-label mb-3">Eligibility</p>
              <h2 className="type-heading mb-6" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a' }}>
                Do you qualify?
              </h2>
              <div className="space-y-3">
                {eligibility.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#b5f23d' }}>
                      <CheckCircle size={11} color="#0a0a0a" strokeWidth={2.5} />
                    </div>
                    <p className="type-body text-sm" style={{ color: '#555' }}>{item}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
                  Check My Eligibility <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-label mb-3">Documents Required</p>
              <div className="space-y-3">
                {documents.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4 card p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#f5f5f5' }}>
                      <Icon size={16} style={{ color: '#555' }} />
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
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12">
            <p className="section-label mb-3">Process</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a' }}>
              Get funded in 3 steps
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { bg: '#4ecdc4', step: '01', title: 'Fill the Application', desc: 'Complete our 5-step guided form with your business and financial details in under 10 minutes.' },
              { bg: '#c4b5fd', step: '02', title: 'Document Verification', desc: 'Submit the required documents. Our team verifies and processes your application within 24 hours.' },
              { bg: '#b5f23d', step: '03', title: 'Loan Disbursement', desc: 'On approval, funds are disbursed directly to your business bank account within 5–7 working days.' },
            ].map(({ bg, step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="rounded-2xl p-7 text-left" style={{ background: bg }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}>
                <p className="type-number text-3xl mb-3" style={{ color: 'rgba(10,10,10,0.3)' }}>{step}</p>
                <h3 className="type-subheading text-lg mb-2" style={{ color: '#0a0a0a' }}>{title}</h3>
                <p className="type-body text-sm" style={{ color: 'rgba(10,10,10,0.65)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#0a0a0a' }}>
              Common questions
            </h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <FAQItem {...faq} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-12" style={{ background: '#0a0a0a' }}>
            <p className="type-ui text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#888' }}>
              Ready to grow?
            </p>
            <h2 className="type-heading text-white mb-4"
              style={{ fontSize: '2rem' }}>
              Apply for your<br />business loan today
            </h2>
            <p className="type-body text-sm mb-8" style={{ color: '#888' }}>
              Get in-principle approval within 48 hours. No commitment required.
            </p>
            <Link to="/apply" className="btn-green inline-flex text-base px-10 py-4">
              Start Application <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
