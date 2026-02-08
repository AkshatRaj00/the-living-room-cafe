'use client'

import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Navbar Component (with Auth)
function NavbarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
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
          
          <div className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/" className="text-gray-700 hover:text-green-700 font-semibold transition">
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-green-700 font-semibold transition">
              Menu
            </Link>
            <Link href="/track-order" className="text-gray-700 hover:text-green-700 font-semibold transition">
              Track Order
            </Link>
            <Link href="/my-orders" className="text-gray-700 hover:text-green-700 font-semibold transition">
              My Orders
            </Link>
            <Link href="/catering" className="text-gray-700 hover:text-green-700 font-semibold transition">
              Catering
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-200 transition"
                >
                  <User size={16} />
                  {user.name || user.phone}
                </button>
                
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border z-50">
                      <div className="p-3 bg-green-600 text-white rounded-t-xl">
                        <p className="font-bold text-sm">{user.name || 'User'}</p>
                        <p className="text-xs opacity-90">{user.phone}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                          My Profile
                        </Link>
                        <Link href="/my-orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                          My Orders
                        </Link>
                        <hr className="my-1" />
                        <button onClick={() => { logout(); setProfileOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={14} className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-sm">
                  <User size={16} />
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu + Login */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button onClick={() => setProfileOpen(!profileOpen)} className="bg-green-100 text-green-700 p-2 rounded-full">
                <User size={18} />
              </button>
            ) : (
              <Link href="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Login
                </button>
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <Link href="/menu" className="hidden md:block">
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
              Order Now
            </button>
          </Link>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t space-y-2 text-sm">
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
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-xs font-bold text-green-700">{user.name || 'User'}</p>
                  <p className="text-xs text-green-600">{user.phone}</p>
                </div>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 font-semibold">
                  My Profile
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false) }} className="block w-full text-left py-2 text-red-600 font-semibold">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <NavbarContent />
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 mt-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  {/* Logo & Info */}
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5">
                        <img 
                          src="/images/logo.jpg" 
                          alt="Logo"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold">The Living Room Cafe</h3>
                        <p className="text-xs text-gray-400">Est. 2017</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Restaurant • Cafe • Caterers</p>
                    <p className="text-xs text-gray-400 mt-1">Raipur, Chhattisgarh</p>
                  </div>

                  {/* Quick Links */}
                  <div className="text-center md:text-left">
                    <h4 className="font-bold mb-2 text-sm">Quick Links</h4>
                    <div className="space-y-1 text-xs">
                      <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                      <Link href="/menu" className="block text-gray-400 hover:text-white transition">Menu</Link>
                      <Link href="/track-order" className="block text-gray-400 hover:text-white transition">Track Order</Link>
                      <Link href="/my-orders" className="block text-gray-400 hover:text-white transition">My Orders</Link>
                      <Link href="/catering" className="block text-gray-400 hover:text-white transition">Catering</Link>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="text-center md:text-left">
                    <h4 className="font-bold mb-2 text-sm">Contact</h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <p>📞 <a href="tel:+919285555002" className="hover:text-white transition">+91 9285555002</a></p>
                      <p>✉️ <a href="mailto:thelivingroomcafe30@gmail.com" className="hover:text-white transition">thelivingroomcafe30@gmail.com</a></p>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-4 pt-4 text-center">
                  <p className="text-xs text-gray-500">© 2026 The Living Room Cafe. All rights reserved.</p>
                  <div className="mt-2">
                    <Link 
                      href="/admin/login"
                      className="text-gray-600 hover:text-white transition text-xs opacity-50 hover:opacity-100"
                    >
                      🔐 Staff Login
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
