'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  Eye, 
  RefreshCw, 
  Phone, 
  Calendar, 
  DollarSign, 
  MapPin, 
  X, 
  Utensils, 
  ChevronDown 
} from 'lucide-react'

// ========== INTERFACES ==========
interface OrderItem {
  id: string
  item_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  special_notes: string | null
  subtotal: number
  gst_amount: number
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
  order_items: OrderItem[]
}

// ========== MAIN COMPONENT ==========
export default function MyOrdersPage() {
  // ===== STATE VARIABLES =====
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // ===== FETCH ORDERS FUNCTION =====
  const fetchOrders = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')
   
    try {
      const response = await fetch(`/api/order-history?phone=${phone}`)
      const result = await response.json()

      if (result.success) {
        setOrders(result.orders)
        if (result.orders.length === 0) {
          setError('No orders found for this phone number')
        }
      } else {
        setError(result.error || 'Failed to fetch orders')
        setOrders([])
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // ===== REORDER FUNCTION =====
  const reorder = (order: Order) => {
    const cartItems = order.order_items.map(item => ({
      id: item.id,
      name: item.item_name,
      price: item.price,
      quantity: item.quantity
    }))
    localStorage.setItem('cart', JSON.stringify(cartItems))
    window.location.href = '/menu'
  }

  // ===== STATUS COLOR HELPER =====
  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-orange-100 text-orange-700 border-orange-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      preparing: 'bg-purple-100 text-purple-700 border-purple-300',
      out_for_delivery: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[status] || colors.pending
  }

  // ===== STATUS ICON HELPER =====
  const getStatusIcon = (status: string) => {
    const icons: any = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      out_for_delivery: Package,
      delivered: CheckCircle,
      cancelled: X
    }
    const Icon = icons[status] || Clock
    return <Icon size={16} />
  }

  // ===== FORMAT STATUS TEXT =====
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ========== LOGO HEADER ========== */}
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
                <p className="text-sm text-gray-600">My Orders</p>
              </div>
            </div>
          </Link>
        </div>

        {/* ========== SEARCH BOX ========== */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">My Orders</h2>
              <p className="text-gray-600">View all your past orders</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Phone Input */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={18} className="text-green-600" />
                Enter Your Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-bold text-lg placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={fetchOrders}
                disabled={loading || phone.length < 10}
                className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'View Orders'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl mt-4 flex items-center gap-2"
            >
              <X size={20} />
              {error}
            </motion.div>
          )}
        </div>

        {/* ========== ORDERS LIST ========== */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {/* Orders Count Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Package size={28} className="text-green-600" />
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Found
              </h2>
            </div>

            {/* Order Cards */}
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-green-400 transition"
              >
                <div className="p-6">
                  {/* ===== ORDER HEADER ===== */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">
                        {order.order_number}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <span>•</span>
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span 
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 inline-flex items-center gap-2 ${getStatusColor(order.order_status)}`}
                      >
                        {getStatusIcon(order.order_status)}
                        {formatStatus(order.order_status)}
                      </span>
                    </div>
                  </div>

                  {/* ===== ORDER STATS ===== */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {/* Items Count */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                      <Utensils size={20} className="text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="font-bold text-gray-900">
                          {order.order_items?.length || 0} items
                        </p>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                      <DollarSign size={20} className="text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Total Amount</p>
                        <p className="font-bold text-green-700">₹{order.total_amount}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                      <Phone size={20} className="text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Payment</p>
                        <p className="font-bold capitalize text-gray-900">{order.payment_method}</p>
                      </div>
                    </div>
                  </div>

                  {/* ===== ORDER ITEMS PREVIEW ===== */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4 border border-green-200">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Utensils size={16} className="text-green-600" />
                      Order Items:
                    </p>
                    <div className="space-y-2">
                      {order.order_items?.slice(0, 3).map((item: OrderItem, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center text-sm bg-white rounded-lg p-2"
                        >
                          <span className="text-gray-700 font-medium">
                            <span className="text-green-600 font-bold">{item.quantity}x</span> {item.item_name}
                          </span>
                          <span className="font-bold text-green-700">
                            ₹{(item.quantity * item.price).toFixed(0)}
                          </span>
                        </div>
                      ))}
                      {order.order_items && order.order_items.length > 3 && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <ChevronDown size={14} />
                          +{order.order_items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ===== ACTION BUTTONS ===== */}
                  <div className="flex gap-3">
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <Eye size={18} />
                      View Details
                    </button>

                    {/* Reorder Button (only for delivered orders) */}
                    {order.order_status === 'delivered' && (
                      <button
                        onClick={() => reorder(order)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 shadow-md"
                      >
                        <RefreshCw size={18} />
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ========== ORDER DETAILS MODAL ========== */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ===== MODAL HEADER ===== */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black mb-1">Order Details</h2>
                      <p className="text-green-100">{selectedOrder.order_number}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* ===== CUSTOMER INFO ===== */}
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Package size={20} className="text-green-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-bold text-gray-700">Name:</span> 
                        <span className="text-gray-900"> {selectedOrder.customer_name}</span>
                      </p>
                      <p>
                        <span className="font-bold text-gray-700">Phone:</span> 
                        <span className="text-gray-900"> {selectedOrder.customer_phone}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="text-green-600 mt-1" />
                        <span>
                          <span className="font-bold text-gray-700">Address:</span> 
                          <span className="text-gray-900"> {selectedOrder.customer_address}</span>
                        </span>
                      </p>
                      {selectedOrder.special_notes && (
                        <p>
                          <span className="font-bold text-gray-700">Notes:</span> 
                          <span className="text-gray-900"> {selectedOrder.special_notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ===== ALL ITEMS ===== */}
                  <div>
                    <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Utensils size={20} className="text-green-600" />
                      Order Items ({selectedOrder.order_items?.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.order_items?.map((item: OrderItem, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div>
                            <p className="font-bold text-gray-900">{item.item_name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <p className="font-black text-green-700 text-lg">
                            ₹{(item.quantity * item.price).toFixed(0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== PAYMENT SUMMARY ===== */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
                    <h3 className="font-black text-gray-900 mb-3">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-bold text-gray-900">₹{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">GST (5%):</span>
                        <span className="font-bold text-gray-900">₹{selectedOrder.gst_amount}</span>
                      </div>
                      <div className="border-t-2 border-green-300 pt-2 flex justify-between text-lg">
                        <span className="font-black text-gray-900">Total:</span>
                        <span className="font-black text-green-700">₹{selectedOrder.total_amount}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-700">Payment Method:</span>
                        <span className="font-bold capitalize text-gray-900">
                          {selectedOrder.payment_method}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ===== REORDER BUTTON ===== */}
                  {selectedOrder.order_status === 'delivered' && (
                    <button
                      onClick={() => reorder(selectedOrder)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 shadow-lg text-lg"
                    >
                      <RefreshCw size={22} />
                      Reorder This
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== CONTACT ========== */}
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">Need help?</p>
          <a 
            href="tel:+919285555002" 
            className="text-green-600 font-bold hover:underline"
          >
            📞 +91 9285555002
          </a>
        </div>
      </div>
    </div>
  )
}
