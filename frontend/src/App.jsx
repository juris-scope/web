import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<div className="py-16 text-center">Page not found. <Link className="text-brand-orange" to="/">Go home</Link></div>} />
        </Routes>
      </main>
    </div>
  )
}
