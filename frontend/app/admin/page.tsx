'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Loader2,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  todayOrders: number
  totalMenuItems: number
  availableItems: number
  recentOrders: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    )
  }

  const quickStats = [
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'blue',
      link: '/admin/orders'
    },
    {
      icon: Clock,
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      color: 'orange',
      link: '/admin/orders'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats?.completedOrders || 0,
      color: 'green',
      link: '/admin/orders'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      color: 'purple',
      link: '/admin/orders'
    },
    {
      icon: TrendingUp,
      label: "Today's Orders",
      value: stats?.todayOrders || 0,
      color: 'red',
      link: '/admin/orders'
    },
    {
      icon: UtensilsCrossed,
      label: 'Menu Items',
      value: stats?.totalMenuItems || 0,
      color: 'indigo',
      link: '/admin/menu'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black mb-2">Welcome to Admin Dashboard! 👋</h1>
        <p className="text-white/90">Here&apos;s what&apos;s happening with your cafe today</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${getColorClasses(stat.color)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-md">
                    <Icon size={28} />
                  </div>
                </div>
                <p className="text-sm font-bold opacity-80 mb-1">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders">
            <button className="text-green-600 hover:text-green-700 font-bold text-sm">
              View All →
            </button>
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="space-y-3">
            {stats.recentOrders.slice(0, 5).map((order: any) => (
              <Link key={order.id} href="/admin/orders">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer border border-gray-200">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-700">₹{order.total_amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.order_status === 'delivered' 
                        ? 'bg-green-100 text-green-700'
                        : order.order_status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/orders">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
          >
            <ShoppingBag size={40} className="mb-4" />
            <h3 className="text-2xl font-black mb-2">Manage Orders</h3>
            <p className="text-white/90">View and update order status</p>
          </motion.div>
        </Link>

        <Link href="/admin/menu">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
          >
            <UtensilsCrossed size={40} className="mb-4" />
            <h3 className="text-2xl font-black mb-2">Manage Menu</h3>
            <p className="text-white/90">Add, edit or remove items</p>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
