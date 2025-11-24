import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.svg'

// Icons
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = { name: 'Venisha kalola', email: 'john.doe@lawfirm.com', avatar: null }
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).slice(0,2).join('') : 'JS'

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={logo} 
                alt="JuriScope" 
                className="h-10 w-10 transition-transform group-hover:scale-110 group-hover:rotate-3" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-20 rounded-lg blur-xl transition-opacity"></div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#001F3F] to-[#003366] bg-clip-text text-transparent">
                JuriScope
              </span>
              <div className="text-[10px] text-gray-500 font-medium tracking-wider hidden sm:block">
                Legal Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink 
              to="/" 
              end 
              className={({isActive}) => `
                px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                }
              `}
            >
              Dashboard
            </NavLink>

            <NavLink 
              to="/explore" 
              className={({isActive}) => `
                px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                }
              `}
            >
              Explore
            </NavLink>

            <NavLink 
              to="/drafting" 
              className={({isActive}) => `
                px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                }
              `}
            >
              Drafting
            </NavLink>

            <NavLink 
              to="/about-us" 
              className={({isActive}) => `
                px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                }
              `}
            >
              About Us
            </NavLink>
          </nav>

          {/* Right-side user avatar */}
          <Link to="/profile" className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001F3F] to-[#FF851B] text-white flex items-center justify-center font-bold shadow-sm hover:shadow-md transition-all">
              {initials}
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              <NavLink 
                to="/" 
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `
                  block px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                Dashboard
              </NavLink>

              <NavLink 
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `
                  block px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                Explore
              </NavLink>

              <NavLink 
                to="/drafting"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `
                  block px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                Drafting
              </NavLink>

              <NavLink 
                to="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `
                  block px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                About Us
              </NavLink>

              <NavLink 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive}) => `
                  block px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                Profile
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}