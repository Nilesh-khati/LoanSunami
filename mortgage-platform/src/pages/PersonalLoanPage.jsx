import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle, Zap, Clock, Shield,
  CreditCard, FileText, User, ChevronDown,
  Wallet, HeartPulse, GraduationCap, Plane
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
}

const loanTypes = [
  {
    icon: HeartPulse,
    title: 'Medical Emergency Loan',
    desc: 'Instant funds for medical expenses, hospital bills, or surgeries with same-day disbursal.',
    rate: 'From 10.5%',
    amount: 'Up to ₹20 Lakhs',
    time: '24 hours',
    color: '#fca5a5',
    bg: '#fef2f2',
  },
  {
    icon: GraduationCap,
    title: 'Education Loan',
    desc: 'Fund your higher education, certification courses, or skill development programs.',
    rate: 'From 9.5%',
    amount: 'Up to ₹15 Lakhs',
    time: '48 hours',
    color: '#c4b5fd',
    bg: '#f5f3ff',
  },
  {
    icon: Plane,
    title: 'Travel Loan',
    desc: 'Plan your dream vacation or international trip without worrying about upfront costs.',
    rate: 'From 11.0%',
    amount: 'Up to ₹10 Lakhs',
    time: '24 hours',
    color: '#5eead4',
    bg: '#f0fdfa',
  },
  {
    icon: Wallet,
    title: 'Debt Consolidation',
    desc: 'Combine multiple high-interest debts into one affordable monthly payment.',
    rate: 'From 10.0%',
    amount: 'Up to ₹25 Lakhs',
    time: '48 hours',
    color: '#b5f23d',
    bg: '#f3fde8',
  },
]

const eligibility = [
  'Age between 21 and 60 years',
  'Minimum monthly income of ₹20,000',
  'Salaried employee or self-employed with regular income',
  'Credit score of 650 or above preferred',
  'Valid KYC documents (PAN + Aadhaar)',
]

const documents = [
  { icon: User,      label: 'Identity Proof',   desc: 'PAN card + Aadhaar / Passport / Voter ID' },
  { icon: FileText,  label: 'Income Proof',     desc: 'Last 3 salary slips or 2 years ITR for self-employed' },
  { icon: CreditCard,label: 'Bank Statements',  desc: 'Last 6 months bank statements showing regular credits' },
  { icon: Clock,     label: 'Address Proof',    desc: 'Utility bill, rental agreement, or Aadhaar with address' },
]

const faqs = [
  { q: 'Can I get a personal loan without collateral?', a: 'Yes — personal loans are fully unsecured. No property, gold, or guarantor required. Approval is based purely on your income and credit profile.' },
  { q: 'What is the minimum credit score required?', a: 'A CIBIL score of 650+ is generally preferred. Scores of 750+ get the best rates. If your score is below 650, some lenders still offer loans at higher interest rates.' },
  { q: 'How soon will I receive the funds?', a: 'Once documents are verified and loan is approved, disbursement happens within 24–48 hours directly to your bank account.' },
  { q: 'Can I prepay the personal loan?', a: 'Yes. Most lenders allow prepayment after the first 3–6 EMIs. Foreclosure charges range from 2–5% of outstanding principal. Some lenders offer zero prepayment penalty.' },
  { q: 'Does applying affect my credit score?', a: 'Checking eligibility on our platform is a soft inquiry and does not affect your credit score. A hard inquiry only happens when a lender formally processes your application.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${open ? '#0a0a0a' : '#ebebeb'}`, background: '#fff' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
        <span className="font-medium text-sm" style={{ color: '#0a0a0a' }}>{q}</span>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: open ? '#0a0a0a' : '#f5f5f5' }}>
          <ChevronDown size={14} color={open ? '#fff' : '#555'}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>
      {open && (
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#555' }}>{a}</p>
      )}
    </div>
  )
}

export default function PersonalLoanPage() {
  return (
    <div style={{ background: '#ffffff' }}>

      {/* ── HERO ── */}
      <section className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #f5f3ff 50%, #f3fde8 100%)' }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(252,165,165,0.3)', color: '#b91c1c', border: '1px solid #fca5a5' }}>
              <CreditCard size={12} /> Personal Loans
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="type-heading mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0a0a0a' }}>
              Money When You<br />
              <span style={{ color: '#b91c1c' }}>Need It Most</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="type-body text-lg mb-8 max-w-md" style={{ color: '#555' }}>
              Instant personal loans from ₹50,000 to ₹25 Lakhs. No collateral,
              minimal documentation, and funds in your account within 24 hours.
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
              {['No collateral required', 'Funds in 24 hours', 'Flexible repayment'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: '#555' }}>
                  <CheckCircle size={15} style={{ color: '#b5f23d' }} strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="grid grid-cols-2 gap-4">
            {[
              { label: 'Loan Amount',   value: 'Up to ₹25L', bg: '#fef2f2', accent: '#b91c1c' },
              { label: 'Interest Rate', value: 'From 9.5%',  bg: '#f5f3ff', accent: '#7c3aed' },
              { label: 'Disbursement',  value: '24 Hours',   bg: '#f0fdfa', accent: '#0f766e' },
              { label: 'Tenure',        value: 'Up to 5 Yrs',bg: '#fef9c3', accent: '#ca8a04' },
            ].map(({ label, value, bg, accent }) => (
              <div key={label} className="card p-5 text-center" style={{ background: bg }}>
                <p className="type-number text-2xl mb-1" style={{ color: accent }}>{value}</p>
                <p className="type-body text-xs" style={{ color: '#555' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <p className="section-label mb-3">Loan Types</p>
            <h2 className="type-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a' }}>
              What can you use it for?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loanTypes.map(({ icon: Icon, title, desc, rate, amount, time, color, bg }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: bg, border: `1px solid ${color}33` }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                transition={{ duration: 0.2 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: color + '44' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <h3 className="type-subheading text-base mb-1" style={{ color: '#0a0a0a' }}>{title}</h3>
                  <p className="type-body text-xs" style={{ color: '#555' }}>{desc}</p>
                </div>
                <div className="space-y-1 mt-auto pt-3" style={{ borderTop: `1px solid ${color}33` }}>
                  {[['Rate', rate], ['Amount', amount], ['Disbursement', time]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span style={{ color: '#888' }}>{k}</span>
                      <span className="font-semibold" style={{ color: '#0a0a0a' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <Link to="/apply"
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color }}>
                  Apply Now <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY + DOCUMENTS ── */}
      <section className="py-20 px-6" style={{ background: '#f9f9f9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-label mb-3">Eligibility</p>
              <h2 className="type-heading mb-6" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#0a0a0a' }}>
                Who can apply?
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

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-label mb-3">Documents</p>
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
              Get funds in 3 easy steps
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { bg: '#4ecdc4', step: '01', title: 'Apply Online',          desc: 'Fill the simple form in under 5 minutes. No branch visit required.' },
              { bg: '#c4b5fd', step: '02', title: 'Instant Verification',  desc: 'Our system verifies your details and credit profile within hours.' },
              { bg: '#b5f23d', step: '03', title: 'Funds Disbursed',       desc: 'Approved amount transferred directly to your bank account within 24 hrs.' },
            ].map(({ bg, step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="rounded-2xl p-7 text-left" style={{ background: bg }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}>
                <p className="type-number text-3xl mb-3" style={{ color: 'rgba(10,10,10,0.25)' }}>{step}</p>
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
            <h2 className="type-heading text-white mb-4" style={{ fontSize: '2rem' }}>
              Apply for your<br />personal loan today
            </h2>
            <p className="type-body text-sm mb-8" style={{ color: '#888' }}>
              No branch visit. No collateral. Funds in 24 hours.
            </p>
            <Link to="/apply" className="btn-green inline-flex text-base px-10 py-4">
              Get Started <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
