import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage    from './pages/LandingPage'
import ApplyPage      from './pages/ApplyPage'
import CalculatorPage from './pages/CalculatorPage'
import AdminPage      from './pages/AdminPage'
import SignInPage     from './pages/SignInPage'
import SignUpPage     from './pages/SignUpPage'
import Navbar         from './components/Navbar'

function AppLayout() {
  const location    = useLocation()
  const isAuthPage  = ['/signin', '/signup'].includes(location.pathname)
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {!isAuthPage && !isAdminPage && <Navbar />}
      {/* pt-[68px] offsets the fixed Navbar on all non-auth pages */}
      <div style={!isAuthPage && !isAdminPage ? { paddingTop: 68 } : {}}>
        <Routes>
          <Route path="/"           element={<LandingPage />}    />
          <Route path="/apply"      element={<ApplyPage />}      />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/admin"      element={<AdminPage />}      />
          <Route path="/signin"     element={<SignInPage />}      />
          <Route path="/signup"     element={<SignUpPage />}      />
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
