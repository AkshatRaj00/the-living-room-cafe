  'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Edit2, Save, X, Loader2, ShoppingBag, Calendar, MapPin, Award, TrendingUp, Package, Crown, Star, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface OrderStats {
  totalOrders: number
  totalSpent: number
  pendingOrders: number
}

interface RecentOrder {
  id: string
  created_at: string
  total_amount: number
  order_status: string
  items: any[]
}

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState<OrderStats>({ totalOrders: 0, totalSpent: 0, pendingOrders: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
      fetchOrderStats()
      fetchRecentOrders()
    }
  }, [user, loading, router])

  const fetchOrderStats = async () => {
    if (!user?.id) {
      console.log('❌ No user ID found')
      setLoadingStats(false)
      return
    }

    try {
      console.log('🔍 Fetching orders for user:', user.id)
      console.log('📱 Phone:', user.phone)

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)

      console.log('📦 Orders response:', { orders, error })

      if (error) {
        console.error('❌ Orders fetch error:', error)
        throw error
      }

      console.log('✅ Orders found:', orders?.length || 0)

      const totalOrders = orders?.length || 0
      const totalSpent = orders?.reduce((sum, order) => 
        sum + (parseFloat(order.total_amount) || 0), 0
      ) || 0
      const pendingOrders = orders?.filter(order => 
        order.order_status === 'pending' || order.order_status === 'confirmed'
      ).length || 0

      console.log('📊 Stats:', { totalOrders, totalSpent, pendingOrders })

      setStats({ totalOrders, totalSpent, pendingOrders })
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error.message || error)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchRecentOrders = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Recent orders error:', error)
        throw error
      }
      
      setRecentOrders(data || [])
    } catch (error) {
      console.error('Error fetching recent orders:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUser(formData)
      setEditing(false)
    } catch (error) {
      console.error('Update failed:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
      case 'cancelled': return 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
      case 'preparing': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'confirmed': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
      case 'out_for_delivery': return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  const getUserLevel = () => {
    if (stats.totalOrders >= 20) return { level: 'Diamond', icon: Crown, color: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' }
    if (stats.totalOrders >= 10) return { level: 'Gold', icon: Star, color: 'from-yellow-500 to-orange-500', bg: 'from-yellow-50 to-orange-50' }
    if (stats.totalOrders >= 5) return { level: 'Silver', icon: Award, color: 'from-gray-400 to-gray-500', bg: 'from-gray-50 to-gray-100' }
    return { level: 'Bronze', icon: Award, color: 'from-amber-600 to-amber-700', bg: 'from-amber-50 to-orange-50' }
  }

  const userLevel = getUserLevel()
  const LevelIcon = userLevel.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and track your journey</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <ShoppingBag size={32} className="mb-3 relative z-10" />
                <p className="text-green-100 text-sm font-semibold mb-1">Total Orders</p>
                <p className="text-4xl font-black relative z-10">
                  {loadingStats ? '...' : stats.totalOrders}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <TrendingUp size={32} className="mb-3 relative z-10" />
                <p className="text-blue-100 text-sm font-semibold mb-1">Total Spent</p>
                <p className="text-4xl font-black relative z-10">
                  {loadingStats ? '...' : `₹${Math.round(stats.totalSpent)}`}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <Package size={32} className="mb-3 relative z-10" />
                <p className="text-orange-100 text-sm font-semibold mb-1">Active Orders</p>
                <p className="text-4xl font-black relative z-10">
                  {loadingStats ? '...' : stats.pendingOrders}
                </p>
              </motion.div>
            </div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Profile Header with Level Badge */}
              <div className={`bg-gradient-to-r ${userLevel.bg} p-8 border-b-4 border-white`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-24 h-24 bg-gradient-to-br ${userLevel.color} rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white`}
                    >
                      {user.name ? user.name[0].toUpperCase() : user.phone[0]}
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-1">
                        {user.name || 'User'}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">Member since {new Date().getFullYear()}</p>
                      <div className={`flex items-center gap-2 bg-gradient-to-r ${userLevel.color} text-white px-4 py-2 rounded-full shadow-lg`}>
                        <LevelIcon size={18} className="animate-pulse" />
                        <span className="font-black text-sm">{userLevel.level} Member</span>
                      </div>
                    </div>
                  </div>

                  {!editing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition border-2 border-green-200"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditing(false)
                          setFormData({
                            name: user.name || '',
                            email: user.email || ''
                          })
                        }}
                        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition"
                      >
                        <X size={18} />
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Fields */}
              <div className="p-8 space-y-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    Phone Number
                  </label>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-bold text-lg">
                    {user.phone}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">📱 Your phone number is verified and cannot be changed</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-white border-2 border-gray-300 rounded-2xl px-5 py-4 text-gray-900 font-semibold text-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-bold text-lg">
                      {user.name || '👤 Not set yet'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-purple-600" />
                    </div>
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full bg-white border-2 border-gray-300 rounded-2xl px-5 py-4 text-gray-900 font-semibold text-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-bold text-lg">
                      {user.email || '📧 Not set yet'}
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <div className="px-8 pb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-2xl font-black text-lg hover:from-red-600 hover:to-rose-700 transition shadow-xl"
                >
                  Logout from Account
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Package className="text-green-600" size={32} />
                    Recent Orders
                  </h3>
                  <Link href="/my-orders">
                    <motion.button 
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition"
                    >
                      View All
                      <ChevronRight size={20} />
                    </motion.button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <Link href={`/track-order?orderId=${order.id}`}>
                        <div className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-300 hover:shadow-lg transition cursor-pointer bg-gradient-to-r from-white to-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-2xl font-black text-gray-900 mb-1">
                                ₹{Math.round(order.total_amount)}
                              </p>
                              <p className="text-sm text-gray-600 font-semibold">
                                📅 {new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-xs font-black shadow-lg ${getStatusColor(order.order_status)}`}>
                              {order.order_status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 font-semibold">
                              🆔 Order #{order.id.slice(0, 8)}
                            </p>
                            <ExternalLink size={16} className="text-green-600" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Links Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-black text-gray-900 mb-4">Quick Actions</h3>

            <Link href="/my-orders">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 cursor-pointer text-white group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <ShoppingBag size={32} className="mb-3 relative z-10" />
                <h4 className="font-black text-xl mb-1 relative z-10">My Orders</h4>
                <p className="text-green-100 text-sm font-semibold relative z-10">View complete order history</p>
              </motion.div>
            </Link>

            <Link href="/my-addresses">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 cursor-pointer text-white group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <MapPin size={32} className="mb-3 relative z-10" />
                <h4 className="font-black text-xl mb-1 relative z-10">My Addresses</h4>
                <p className="text-purple-100 text-sm font-semibold relative z-10">Manage delivery addresses</p>
              </motion.div>
            </Link>

            <Link href="/track-order">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 cursor-pointer text-white group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <Package size={32} className="mb-3 relative z-10" />
                <h4 className="font-black text-xl mb-1 relative z-10">Track Order</h4>
                <p className="text-orange-100 text-sm font-semibold relative z-10">Live order tracking</p>
              </motion.div>
            </Link>

            <Link href="/catering">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 cursor-pointer text-white group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <Calendar size={32} className="mb-3 relative z-10" />
                <h4 className="font-black text-xl mb-1 relative z-10">Catering</h4>
                <p className="text-blue-100 text-sm font-semibold relative z-10">Book for special events</p>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
