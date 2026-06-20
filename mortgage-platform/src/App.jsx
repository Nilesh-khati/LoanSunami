import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import LandingPage    from './pages/LandingPage'
import ApplyPage      from './pages/ApplyPage'
import CalculatorPage from './pages/CalculatorPage'
import AdminPage      from './pages/AdminPage'
import SignInPage     from './pages/SignInPage'
import SignUpPage     from './pages/SignUpPage'
import Navbar         from './components/Navbar'
import { useAuth }    from './context/AuthContext.jsx'

/* ─────────────────────────────────────────────────
   Admin Protected Route
   - Not logged in  → redirect to /signin?next=/admin
   - Logged in, not admin → redirect to /
   - Logged in, admin → render AdminPage
───────────────────────────────────────────────── */
function AdminRoute() {
  const { user, loading } = useAuth()

  // Wait for auth to resolve
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#0a0a0a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  // Not logged in → go to sign in, come back after
  if (!user) {
    return <Navigate to="/signin?next=/admin" replace />
  }

  // Logged in but not admin → go to home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Admin confirmed → show dashboard
  return <AdminPage />
}

function AppLayout() {
  const location   = useLocation()
  const isAuthPage  = ['/signin', '/signup'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {!isAuthPage && !isAdminPage && <Navbar />}
      <div style={!isAuthPage && !isAdminPage ? { paddingTop: 68 } : {}}>
        <Routes>
          <Route path="/"           element={<LandingPage />}    />
          <Route path="/apply"      element={<ApplyPage />}      />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/admin"      element={<AdminRoute />}     />
          <Route path="/signin"     element={<SignInPage />}     />
          <Route path="/signup"     element={<SignUpPage />}     />
        </Routes>
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
