import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="JuriScope" className="h-8 w-8" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight" style={{color:'#001F3F'}}>JuriScope</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={({isActive})=>`text-sm font-medium ${isActive ? 'text-brand-orange' : 'text-gray-600 hover:text-gray-900'}`}>Dashboard</NavLink>
          <NavLink to="/explore" className={({isActive})=>`text-sm font-medium ${isActive ? 'text-brand-orange' : 'text-gray-600 hover:text-gray-900'}`}>Explore</NavLink>
          <NavLink to="/profile" className={({isActive})=>`text-sm font-medium ${isActive ? 'text-brand-orange' : 'text-gray-600 hover:text-gray-900'}`}>Profile</NavLink>
        </nav>
      </div>
    </header>
  )
}
