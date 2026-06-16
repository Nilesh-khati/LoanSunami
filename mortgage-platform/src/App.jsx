import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ApplyPage from './pages/ApplyPage'
import CalculatorPage from './pages/CalculatorPage'
import AdminPage from './pages/AdminPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Sidebar from './components/Sidebar'

function AppLayout() {
  const location = useLocation()
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  return (
    <div className="app-layout" style={{ background: '#ffffff' }}>
      {!isAuthPage && (
        <Sidebar expanded={sidebarExpanded} onToggle={setSidebarExpanded} />
      )}
      <main
        className={`app-main ${isAuthPage ? 'auth-page' : ''}`}
        style={
          !isAuthPage
            ? { marginLeft: sidebarExpanded ? 260 : 72, transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)' }
            : {}
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </main>
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
