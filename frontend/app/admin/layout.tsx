'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  LogOut,
  Menu as MenuIcon,
  X
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch(`/api/admin/auth?token=${token}`)
        const result = await response.json()

        if (!result.success || !result.valid) {
          localStorage.removeItem('admin_token')
          router.push('/admin/login')
        } else {
          setLoading(false)
        }
      } catch (error) {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    )
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin',
      active: pathname === '/admin'
    },
    {
      icon: UtensilsCrossed,
      label: 'Menu Management',
      href: '/admin/menu',
      active: pathname === '/admin/menu'
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
      href: '/admin/orders',
      active: pathname === '/admin/orders'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl fixed h-full z-50"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-black">Admin Panel</h2>
              <p className="text-xs text-gray-400 mt-1">The Living Room</p>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon size={22} />
                  {sidebarOpen && (
                    <span className="font-bold">{item.label}</span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition-all font-bold"
          >
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {menuItems.find(item => item.active)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Manage your cafe</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
