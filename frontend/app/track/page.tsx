'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Clock, CheckCircle, Truck, Home, MapPin, Phone, Calendar } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackOrder = async () => {
    if (!orderNumber || !phone) {
      setError('Please enter both order number and phone')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch(`/api/track-order?orderNumber=${orderNumber}&phone=${phone}`)
      const result = await response.json()

      if (result.success) {
        setOrder(result.order)
      } else {
        setError(result.error || 'Order not found')
      }
    } catch (err) {
      setError('Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-orange-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      out_for_delivery: 'bg-indigo-500',
      delivered: 'bg-green-500'
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons: any = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      out_for_delivery: Truck,
      delivered: Home
    }
    const Icon = icons[status] || Clock
    return <Icon size={24} className="text-white" />
  }

  const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg border-2 border-green-500">
                <img 
                  src="/images/logo.jpg" 
                  alt="The Living Room Cafe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-gray-900">The Living Room Cafe</h1>
                <p className="text-sm text-gray-600">Track Your Order</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Search size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Track Your Order</h2>
              <p className="text-gray-600">Enter your details to track order status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="ORD123456789"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-bold placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-bold placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
              />
            </div>

            <button
              onClick={trackOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              <Search size={20} />
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-4">
            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{order.order_number}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(order.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-green-700">₹{order.total_amount}</p>
                  <p className="text-sm text-gray-600">{order.payment_method}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  <span className="font-bold text-gray-900">{order.customer_name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-green-600 mt-1" />
                  <span className="text-gray-700">{order.customer_address}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-black text-gray-900 mb-6">Order Status</h3>
              <div className="space-y-4">
                {statuses.map((status, index) => {
                  const isActive = statuses.indexOf(order.order_status) >= index
                  const Icon = getStatusIcon(status) as any
                  
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? getStatusColor(status) : 'bg-gray-300'}`}>
                        {Icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold capitalize ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {status.replace('_', ' ')}
                        </p>
                        {order.order_status === status && (
                          <p className="text-sm text-green-600 font-bold">● Current Status</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-black text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.order_items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-bold text-gray-900">{item.item_name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-green-700">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">Need help?</p>
          <a href="tel:+919285555002" className="text-green-600 font-bold hover:underline">
            📞 +91 9285555002
          </a>
        </div>
      </div>
    </div>
  )
}
