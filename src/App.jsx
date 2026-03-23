import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Landing from './pages/Landing'
import Info from './pages/Info'
import Diagnosis from './pages/Diagnosis'
import Result from './pages/Result'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ConsultContent from './pages/ConsultContent'
import Pricing from './pages/Pricing'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFail from './pages/PaymentFail'
import About from './pages/About'
import Contact from './pages/Contact'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: null }
  }
  static getDerivedStateFromError(err) {
    return { err }
  }
  render() {
    if (this.state.err) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#e8e8e8',
            color: '#0a0a0a',
          }}
        >
          <h1 style={{ fontSize: '1.25rem' }}>화면을 표시할 수 없습니다</h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>
            브라우저를 새로고침(F5)하거나, 시크릿 창에서 다시 열어 보세요.
          </p>
          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fff',
              border: '1px solid #ccc',
              fontSize: '12px',
              overflow: 'auto',
            }}
          >
            {String(this.state.err?.message || this.state.err)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/info" element={<Info />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/c/consult" element={<ConsultContent />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
    </Routes>
    <SpeedInsights />
    </>
    </AppErrorBoundary>
  )
}
