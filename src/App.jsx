import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Info from './pages/Info'
import Diagnosis from './pages/Diagnosis'
import Result from './pages/Result'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ConsultContent from './pages/ConsultContent'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/info" element={<Info />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/c/consult" element={<ConsultContent />} />
    </Routes>
  )
}
