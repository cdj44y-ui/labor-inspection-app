import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Info from './pages/Info'
import Diagnosis from './pages/Diagnosis'
import Result from './pages/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/info" element={<Info />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
