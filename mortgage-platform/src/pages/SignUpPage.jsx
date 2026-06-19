import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, UserPlus, CheckCircle, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const perks = [
  'Track all your loan applications in one place',
  'Save and revisit calculator results anytime',
  'Get notified when rates change',
  'Priority access to loan specialists',
]

// Reusable icon input helper
function IconInput({ icon: Icon, type = 'text', placeholder, value, onChange, error, rightSlot }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#cccccc', pointerEvents:'none', flexShrink:0 }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field${error ? ' error' : ''}`}
        style={{ paddingLeft: 40, paddingRight: rightSlot ? 44 : 16 }}
      />
      {rightSlot && (
        <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center' }}>
          {rightSlot}
        </div>
      )}
    </div>
  )
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm]           = useState({ fullName:'', email:'', phone:'', password:'', confirmPassword:'' })
  const [showPass, setShowPass]   = useState(false)
  const [showCfm, setShowCfm]     = useState(false)
  const [agreed, setAgreed]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})

  const update = f => e => { setForm(p=>({...p,[f]:e.target.value})); setErrors(p=>({...p,[f]:''})) }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName = 'Full name is required'
    if (!form.email.trim())     e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim())     e.phone = 'Phone number is required'
    if (!form.password)         e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!agreed) e.agreed = 'Please accept the terms to continue'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await signup({ fullName:form.fullName, email:form.email, phone:form.phone, password:form.password, confirmPassword:form.confirmPassword })
      navigate('/signin')
    } catch (err) {
      if (err.errors?.length) {
        const apiErrs = {}; err.errors.forEach(e => { apiErrs[e.field] = e.message }); setErrors(apiErrs)
      } else { setErrors({ form: err.message || 'Registration failed.' }) }
    } finally { setLoading(false) }
  }

  const strength = (() => {
    const p = form.password; if (!p) return null
    if (p.length < 6)  return { label:'Weak',   color:'#ef4444', width:'25%' }
    if (p.length < 8)  return { label:'Fair',   color:'#f97316', width:'50%' }
    if (p.length < 12 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label:'Good', color:'#eab308', width:'75%' }
    return { label:'Strong', color:'#22c55e', width:'100%' }
  })()

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} style={{ color:'#cccccc', background:'none', border:'none', cursor:'pointer', padding:0, display:'flex' }}
      onMouseEnter={e=>e.currentTarget.style.color='#555'} onMouseLeave={e=>e.currentTarget.style.color='#ccc'}>
      {show ? <EyeOff size={14}/> : <Eye size={14}/>}
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left dark panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12" style={{ background:'#0a0a0a' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'#c8f542' }}>
            <Zap size={16} color="#0a0a0a" fill="#0a0a0a"/>
          </div>
          <span className="font-black text-white text-xl" style={{ letterSpacing:'-0.04em' }}>LoanSunami</span>
        </Link>
        <div>
          <p className="font-extrabold text-white leading-snug mb-8" style={{ fontSize:'2.5rem', letterSpacing:'-0.03em' }}>
            Start your<br/>loan journey<br/><span style={{ color:'#c8f542' }}>the right way.</span>
          </p>
          <p className="text-sm mb-8 leading-relaxed" style={{ color:'#555555' }}>
            Join thousands of customers who got their loans approved fast, transparently, and on their terms.
          </p>
          <div className="space-y-4">
            {perks.map((perk,i)=>(
              <motion.div key={perk} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2+i*0.08 }} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background:'rgba(200,245,66,0.15)', border:'1px solid rgba(200,245,66,0.3)' }}>
                  <CheckCircle size={12} style={{ color:'#c8f542' }} strokeWidth={2.5}/>
                </div>
                <span className="text-sm" style={{ color:'#888888' }}>{perk}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm italic mb-3" style={{ color:'#888888' }}>"Signed up, filled the form, and had a specialist call me the same afternoon."</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:'#c8f542', color:'#0a0a0a' }}>P</div>
              <div>
                <p className="text-xs font-semibold text-white">Priya Sharma</p>
                <p className="text-xs" style={{ color:'#555555' }}>Home Loan · ₹62L · Mumbai</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs" style={{ color:'#333333' }}>© 2026 LoanSunami · All rights reserved</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto" style={{ background:'#ffffff' }}>
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'#0a0a0a' }}>
              <Zap size={16} color="#c8f542" fill="#c8f542"/>
            </div>
            <span className="font-black text-xl" style={{ color:'#0a0a0a', letterSpacing:'-0.04em' }}>LoanSunami</span>
          </div>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color:'#0a0a0a', letterSpacing:'-0.03em' }}>Create your account</h1>
            <p className="text-sm mb-7" style={{ color:'#888888' }}>Free forever · No credit card needed</p>

            {errors.form && <div className="mb-4 text-xs rounded-xl px-4 py-3" style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>{errors.form}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#888888' }}>Full Name</label>
                <IconInput icon={User} placeholder="Rahul Mehta" value={form.fullName} onChange={update('fullName')} error={errors.fullName}/>
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#888888' }}>Email</label>
                <IconInput icon={Mail} type="email" placeholder="rahul@email.com" value={form.email} onChange={update('email')} error={errors.email}/>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#888888' }}>Phone</label>
                <IconInput icon={Phone} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} error={errors.phone}/>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#888888' }}>Password</label>
                <IconInput icon={Lock} type={showPass?'text':'password'} placeholder="Min. 8 characters"
                  value={form.password} onChange={update('password')} error={errors.password}
                  rightSlot={<EyeBtn show={showPass} toggle={()=>setShowPass(p=>!p)}/>}/>
                {strength && (
                  <div className="mt-1.5">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'#eeeeee' }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width:strength.width, background:strength.color }}/>
                    </div>
                    <p className="text-xs mt-1 font-medium" style={{ color:strength.color }}>{strength.label} password</p>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#888888' }}>Confirm Password</label>
                <IconInput icon={Lock} type={showCfm?'text':'password'} placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={update('confirmPassword')} error={errors.confirmPassword}
                  rightSlot={
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      {form.confirmPassword && form.password===form.confirmPassword && <CheckCircle size={13} style={{ color:'#22c55e' }}/>}
                      <EyeBtn show={showCfm} toggle={()=>setShowCfm(p=>!p)}/>
                    </div>
                  }/>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={()=>{ setAgreed(p=>!p); setErrors(p=>({...p,agreed:''})) }}
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all"
                    style={{ background:agreed?'#c8f542':'#fff', border:agreed?'1.5px solid #c8f542':'1.5px solid #e0e0e0' }}>
                    {agreed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color:'#888888' }}>
                    I agree to LoanSunami's <a href="#" className="font-medium underline" style={{ color:'#0a0a0a' }}>Terms of Service</a> and <a href="#" className="font-medium underline" style={{ color:'#0a0a0a' }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Creating account…</>
                  : <><UserPlus size={15}/> Create Free Account</>
                }
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 divider"/><span className="text-xs" style={{ color:'#cccccc' }}>or</span><div className="flex-1 divider"/>
              </div>

              <button type="button"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{ background:'#ffffff', border:'1.5px solid #e0e0e0', color:'#555555' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#0a0a0a'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#e0e0e0'}>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color:'#888888' }}>
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold" style={{ color:'#0a0a0a' }}
                onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                Sign in <ArrowRight size={12} className="inline"/>
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
