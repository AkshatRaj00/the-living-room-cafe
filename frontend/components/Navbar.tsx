'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Phone, User, LogOut, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../app/context/CartContext'
import { useAuth } from '../app/context/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-green-600 group-hover:ring-4 transition-all bg-green-600 flex items-center justify-center">
              <img 
                src="/images/logo.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).classList.remove('hidden')
                  }
                }}
              />
              <span className="text-2xl font-black text-white hidden">L</span>
            </div>
            <div>
              <div className="text-xl font-black text-gray-900 group-hover:text-green-600 transition">
                The Living Room Cafe
              </div>
              <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <MapPin size={12} />
                Chhindwara, MP
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`font-bold transition ${isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`font-bold transition ${isActive('/menu') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Menu
            </Link>
            <Link 
              href="/catering" 
              className={`font-bold transition ${isActive('/catering') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Catering
            </Link>
            <Link 
              href="/about" 
              className={`font-bold transition ${isActive('/about') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-bold transition ${isActive('/contact') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold hover:bg-green-200 transition shadow-md"
                >
                  <User size={18} />
                  <span className="hidden md:inline">{user.name || user.phone.slice(0, 10)}</span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
                      >
                        <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
                          <p className="font-bold text-lg">{user.name || 'User'}</p>
                          <p className="text-sm opacity-90">{user.phone}</p>
                          {user.email && (
                            <p className="text-xs opacity-75 mt-1">{user.email}</p>
                          )}
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-semibold"
                          >
                            <User size={18} className="text-green-600" />
                            My Profile
                          </Link>
                          <Link
                            href="/my-orders"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-semibold"
                          >
                            <ShoppingCart size={18} className="text-green-600" />
                            My Orders
                          </Link>
                          <Link
                            href="/track-order"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-semibold"
                          >
                            <Phone size={18} className="text-green-600" />
                            Track Order
                          </Link>
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition font-semibold w-full text-left"
                          >
                            <LogOut size={18} />
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
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg"
                >
                  <User size={18} />
                  <span className="hidden md:inline">Login</span>
                </motion.button>
              </Link>
            )}

            {/* Cart Button */}
            <Link href="/menu">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-full font-bold hover:shadow-xl transition flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                <span className="hidden md:inline">Cart</span>
                {getTotalItems() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-green-600 transition"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t-2 border-gray-100"
            >
              <div className="py-4 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold rounded-lg transition ${
                    isActive('/') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold rounded-lg transition ${
                    isActive('/menu') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Menu
                </Link>
                <Link
                  href="/catering"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold rounded-lg transition ${
                    isActive('/catering') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Catering
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold rounded-lg transition ${
                    isActive('/about') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-bold rounded-lg transition ${
                    isActive('/contact') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Contact
                </Link>
                
                {user && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <div className="px-4 py-2 bg-green-50 rounded-lg mb-2">
                      <p className="text-sm font-bold text-green-700">{user.name || 'User'}</p>
                      <p className="text-xs text-green-600">{user.phone}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-lg transition"
                    >
                      Logout
                    </button>
                  </>
                )}

                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-green-600 text-white text-center font-bold rounded-lg hover:bg-green-700 transition"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
