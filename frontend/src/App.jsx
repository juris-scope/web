import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Drafting from './pages/Drafting'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about-us" element={<Profile />} />
          <Route path="/drafting" element={<Drafting />} />
          <Route path="*" element={<div className="py-16 text-center">Page not found. <Link className="text-brand-orange" to="/">Go home</Link></div>} />
        </Routes>
      </main>
    </div>
  )
}
