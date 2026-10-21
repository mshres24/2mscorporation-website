import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Careers from './pages/Careers'
import JobDetail from './pages/JobDetail'
import ScrollToHash from './components/ScrollToHash'

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:slug" element={<JobDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
