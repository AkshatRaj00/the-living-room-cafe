'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../app/context/AuthContext'

export default function NavbarClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-black shadow-lg">
              <img 
                src="/images/logo.jpg" 
                alt="The Living Room Cafe Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">The Living Room Cafe</div>
              <div className="text-xs text-gray-600">Est. 2017</div>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-sm items-center">
            <Link 
              href="/" 
              className={`font-semibold transition ${isActive('/') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`font-semibold transition ${isActive('/menu') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
            >
              Menu
            </Link>
            <Link 
              href="/track-order" 
              className={`font-semibold transition ${isActive('/track-order') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
            >
              Track Order
            </Link>
            <Link 
              href="/my-orders" 
              className={`font-semibold transition ${isActive('/my-orders') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
            >
              My Orders
            </Link>
            <Link 
              href="/catering" 
              className={`font-semibold transition ${isActive('/catering') ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
            >
              Catering
            </Link>

            {/* User Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold hover:bg-green-200 transition text-sm"
                >
                  <User size={16} />
                  <span>{user.name || user.phone.slice(0, 10)}</span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
                      >
                        <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
                          <p className="font-bold">{user.name || 'User'}</p>
                          <p className="text-xs opacity-90">{user.phone}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition text-sm font-semibold"
                          >
                            <User size={16} />
                            My Profile
                          </Link>
                          <Link
                            href="/my-orders"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition text-sm font-semibold"
                          >
                            <ShoppingCart size={16} />
                            My Orders
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-semibold w-full"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-semibold transition text-sm">
                  <User size={16} />
                  Login
                </button>
              </Link>
            )}
          </div>
          
          {/* Mobile: User + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="bg-green-100 text-green-700 px-3 py-2 rounded-full font-bold"
              >
                <User size={18} />
              </button>
            ) : (
              <Link href="/login">
                <button className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                  Login
                </button>
              </Link>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop: Order Now */}
          <Link href="/menu" className="hidden md:block">
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
              Order Now
            </button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t mt-3 pt-3"
            >
              <div className="space-y-2 text-sm">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                  Home
                </Link>
                <Link href="/menu" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                  Menu
                </Link>
                <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                  Track Order
                </Link>
                <Link href="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                  My Orders
                </Link>
                <Link href="/catering" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                  Catering
                </Link>
                
                {user && (
                  <>
                    <hr className="my-2" />
                    <div className="py-2 bg-green-50 rounded-lg px-3 mb-2">
                      <p className="text-xs font-bold text-green-700">{user.name || 'User'}</p>
                      <p className="text-xs text-green-600">{user.phone}</p>
                    </div>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-700 font-semibold">
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="block py-2 text-red-600 hover:text-red-700 font-semibold w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
