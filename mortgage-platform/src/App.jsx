import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar      from './components/Navbar'
import { useAuth } from './context/AuthContext.jsx'

/* ── Lazy-load every page so initial bundle is tiny ── */
const LandingPage      = lazy(() => import('./pages/LandingPage'))
const ApplyPage        = lazy(() => import('./pages/ApplyPage'))
const CalculatorPage   = lazy(() => import('./pages/CalculatorPage'))
const AdminPage        = lazy(() => import('./pages/AdminPage'))
const SignInPage       = lazy(() => import('./pages/SignInPage'))
const SignUpPage       = lazy(() => import('./pages/SignUpPage'))
const BusinessLoanPage = lazy(() => import('./pages/BusinessLoanPage'))
const PersonalLoanPage = lazy(() => import('./pages/PersonalLoanPage'))
const HomeLoanPage     = lazy(() => import('./pages/HomeLoanPage'))
const TodaysRatesPage  = lazy(() => import('./pages/TodaysRatesPage'))

/* Minimal spinner shown only on the very first chunk load */
function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 32, height: 32,
          border: '3px solid #e5e5e5',
          borderTopColor: '#0a0a0a',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ── Admin route guard ── */
function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user)             return <Navigate to="/signin?next=/admin" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return <AdminPage />
}

function AppLayout() {
  const location    = useLocation()
  const isAuthPage  = ['/signin', '/signup'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {!isAuthPage && !isAdminPage && <Navbar />}
      <div style={!isAuthPage && !isAdminPage ? { paddingTop: 68 } : {}}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"              element={<LandingPage />}      />
            <Route path="/apply"         element={<ApplyPage />}        />
            <Route path="/calculator"    element={<CalculatorPage />}   />
            <Route path="/home-loan"     element={<HomeLoanPage />}     />
            <Route path="/personal-loan" element={<PersonalLoanPage />} />
            <Route path="/business-loan" element={<BusinessLoanPage />} />
            <Route path="/rates"         element={<TodaysRatesPage />}  />
            <Route path="/admin"         element={<AdminRoute />}       />
            <Route path="/signin"        element={<SignInPage />}       />
            <Route path="/signup"        element={<SignUpPage />}       />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}
