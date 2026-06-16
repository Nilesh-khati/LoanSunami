import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, ArrowLeft, User, Briefcase, Home, DollarSign, FileText, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { id: 1, title: 'Personal Info',  icon: User,       desc: 'Basic contact details' },
  { id: 2, title: 'Employment',     icon: Briefcase,  desc: 'Income & employment'    },
  { id: 3, title: 'Loan Details',   icon: DollarSign, desc: 'What you need'          },
  { id: 4, title: 'Property',       icon: Home,       desc: 'Property info'          },
  { id: 5, title: 'Financial',      icon: FileText,   desc: 'Snapshot summary'       },
]

const InputField = ({ label, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label
      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
      style={{ color: '#888888' }}
    >
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field"
    />
  </div>
)

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label
      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
      style={{ color: '#888888' }}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="input-field appearance-none cursor-pointer"
    >
      <option value="">Select an option</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '',
    employmentType: '', employer: '', monthlyIncome: '', workExperience: '',
    loanAmount: '', loanPurpose: '', tenure: '', downPayment: '',
    propertyType: '', propertyLocation: '', propertyValue: '',
    monthlyExpenses: '', existingLoans: '', creditScore: '', notes: '',
  })

  const update = field => e => setForm({ ...form, [field]: e.target.value })
  const next = () => step < 5 ? setStep(step + 1) : handleSubmit()
  const back = () => setStep(step - 1)
  const handleSubmit = () => setSubmitted(true)
  const progress = (step / 5) * 100

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 pt-20"
        style={{ background: '#f9f9f9' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#f3fdc8', border: '2px solid #c8f542' }}
          >
            <CheckCircle size={32} style={{ color: '#0a0a0a' }} />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}>
            Application Submitted!
          </h2>
          <p className="mb-8 leading-relaxed text-sm" style={{ color: '#555555' }}>
            Thank you, <strong style={{ color: '#0a0a0a' }}>{form.firstName}</strong>! Our loan specialist
            will review and reach out within 24 hours.
          </p>
          <div className="card p-6 text-left space-y-3 mb-8">
            {[
              ['Name', `${form.firstName} ${form.lastName}`],
              ['Email', form.email],
              ['Loan Amount', `₹${Number(form.loanAmount).toLocaleString('en-IN')}`],
              ['Purpose', form.loanPurpose],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span style={{ color: '#888888' }}>{label}</span>
                <span className="font-medium" style={{ color: '#0a0a0a' }}>{val}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: '#f9f9f9' }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#0a0a0a' }}
            >
              <Zap size={16} color="#c8f542" fill="#c8f542" />
            </div>
          </div>
          <h1
            className="text-3xl font-extrabold mb-2"
            style={{ color: '#0a0a0a', letterSpacing: '-0.03em' }}
          >
            Apply for Your Loan
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>
            Complete in under 5 minutes · No commitment required
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            {steps.map(({ id, icon: Icon }) => (
              <div key={id} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: id < step ? '#0a0a0a' : id === step ? '#c8f542' : '#f0f0f0',
                    boxShadow: id === step ? '0 4px 12px rgba(200,245,66,0.4)' : 'none',
                  }}
                >
                  {id < step
                    ? <CheckCircle size={16} color="#ffffff" />
                    : <Icon
                        size={16}
                        style={{ color: id === step ? '#0a0a0a' : '#aaaaaa' }}
                      />
                  }
                </div>
                <span
                  className="text-xs font-medium hidden sm:block"
                  style={{ color: id === step ? '#0a0a0a' : '#aaaaaa' }}
                >
                  {steps[id - 1].title}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#eeeeee' }}>
            <div
              className="h-full rounded-full progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: '#888888' }}>
            <span>Step {step} of 5</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Form card */}
        <div className="card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>Personal Information</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#888888' }}>Let's start with the basics</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="Rahul" value={form.firstName} onChange={update('firstName')} />
                    <InputField label="Last Name" placeholder="Mehta" value={form.lastName} onChange={update('lastName')} />
                  </div>
                  <InputField label="Email Address" type="email" placeholder="rahul@email.com" value={form.email} onChange={update('email')} />
                  <InputField label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} />
                  <InputField label="Date of Birth" type="date" value={form.dob} onChange={update('dob')} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>Employment & Income</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#888888' }}>Help us understand your earning capacity</p>
                  </div>
                  <SelectField label="Employment Type" value={form.employmentType} onChange={update('employmentType')}
                    options={['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired']} />
                  <InputField label="Employer / Company" placeholder="TechCorp Pvt. Ltd." value={form.employer} onChange={update('employer')} />
                  <InputField label="Monthly Income (₹)" type="number" placeholder="100000" value={form.monthlyIncome} onChange={update('monthlyIncome')} />
                  <SelectField label="Work Experience" value={form.workExperience} onChange={update('workExperience')}
                    options={['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>Loan Requirements</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#888888' }}>Tell us what you're looking for</p>
                  </div>
                  <InputField label="Loan Amount Required (₹)" type="number" placeholder="5000000" value={form.loanAmount} onChange={update('loanAmount')} />
                  <SelectField label="Loan Purpose" value={form.loanPurpose} onChange={update('loanPurpose')}
                    options={['Home Purchase', 'Home Construction', 'Home Renovation', 'Plot Purchase', 'Balance Transfer', 'Business Loan', 'Personal Loan']} />
                  <SelectField label="Preferred Tenure" value={form.tenure} onChange={update('tenure')}
                    options={['1 year', '2 years', '3 years', '5 years', '7 years', '10 years', '15 years', '20 years', '25 years', '30 years']} />
                  <InputField label="Down Payment Available (₹)" type="number" placeholder="1000000" value={form.downPayment} onChange={update('downPayment')} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>Property Information</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#888888' }}>Optional — helps us give better estimates</p>
                  </div>
                  <SelectField label="Property Type" value={form.propertyType} onChange={update('propertyType')}
                    options={['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial Property']} />
                  <InputField label="Property Location / City" placeholder="Mumbai, Maharashtra" value={form.propertyLocation} onChange={update('propertyLocation')} />
                  <InputField label="Approximate Property Value (₹)" type="number" placeholder="8000000" value={form.propertyValue} onChange={update('propertyValue')} />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>Financial Snapshot</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#888888' }}>A quick overview of your financial standing</p>
                  </div>
                  <InputField label="Monthly Expenses (₹)" type="number" placeholder="40000" value={form.monthlyExpenses} onChange={update('monthlyExpenses')} />
                  <InputField label="Existing EMIs per month (₹)" type="number" placeholder="10000" value={form.existingLoans} onChange={update('existingLoans')} />
                  <SelectField label="Approximate Credit Score" value={form.creditScore} onChange={update('creditScore')}
                    options={['Below 600', '600–650', '650–700', '700–750', '750–800', 'Above 800', "Don't Know"]} />
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: '#888888' }}
                    >
                      Additional Notes (optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={update('notes')}
                      placeholder="Any other information you'd like to share…"
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div
            className="flex items-center justify-between mt-8 pt-6"
            style={{ borderTop: '1px solid #f0f0f0' }}
          >
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-0 disabled:pointer-events-none"
              style={{ color: '#555555' }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={e => e.currentTarget.style.color = '#555555'}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={next} className="btn-primary flex items-center gap-2">
              {step === 5 ? 'Submit Application' : 'Continue'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
