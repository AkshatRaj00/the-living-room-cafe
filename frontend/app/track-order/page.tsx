'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home, 
  Phone, 
  Mail, 
  Search, 
  Loader2 
} from 'lucide-react'
import Link from 'next/link'

// ========== CONSTANTS ==========
const CAFE_PHONE = '+919285555002'
const CAFE_EMAIL = 'thelivingroomcafe30@gmail.com'

// ========== INTERFACES ==========
interface OrderData {
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  special_notes: string | null
  total_amount: number
  order_status: string
  created_at: string
  order_items: Array<{
    item_name: string
    quantity: number
    price: number
    is_veg: boolean
  }>
}

// ========== MAIN COMPONENT ==========
export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderNumberFromUrl = searchParams.get('orderNumber')
 
  // ===== STATE VARIABLES =====
  const [orderNumber, setOrderNumber] = useState(orderNumberFromUrl || '')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ===== EFFECT: Load order from URL =====
  useEffect(() => {
    if (orderNumberFromUrl) {
      fetchOrder(orderNumberFromUrl)
    }
  }, [orderNumberFromUrl])

  // ===== FETCH ORDER FUNCTION =====
  const fetchOrder = async (ordNum: string) => {
    if (!ordNum) {
      setError('Please enter order number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/orders?orderNumber=${ordNum}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Order not found')
      }

      setOrderData(result.order)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch order')
      setOrderData(null)
    } finally {
      setLoading(false)
    }
  }

  // ===== HANDLE SEARCH SUBMIT =====
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrder(orderNumber)
  }

  // ===== GET STATUS STEP INDEX =====
  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
    return steps.indexOf(status)
  }

  // ===== STATUS STEPS CONFIGURATION =====
  const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: Package },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'preparing', label: 'Preparing', icon: Clock },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home }
  ]

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/menu" 
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-bold transition"
          >
            <span className="text-xl">←</span>
            <span>Back to Menu</span>
          </Link>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* ===== TITLE ===== */}
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <Package className="text-green-600" size={36} />
            Track Your Order
          </h1>
          <p className="text-gray-600 mb-8">Enter your order number to track status</p>

          {/* ========== SEARCH BOX ========== */}
          <form 
            onSubmit={handleSearch} 
            className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-200 mb-8"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Enter Order Number (e.g., ORD1738xxx)"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none text-gray-900 font-medium"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Track
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* ========== ERROR MESSAGE ========== */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* ========== ORDER DETAILS ========== */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              
              {/* ===== STATUS TIMELINE ===== */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Order Status</h2>
               
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>
                 
                  {/* Status Steps */}
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const currentStep = getStatusStep(orderData.order_status)
                    const isCompleted = index <= currentStep
                    const isActive = index === currentStep
                   
                    return (
                      <div 
                        key={step.id} 
                        className="relative flex items-start gap-4 mb-6 last:mb-0"
                      >
                        {/* Step Icon Circle */}
                        <div 
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-green-600 shadow-lg'
                              : 'bg-gray-200'
                          } ${isActive ? 'ring-4 ring-green-200 animate-pulse' : ''}`}
                        >
                          <Icon 
                            size={24} 
                            className={isCompleted ? 'text-white' : 'text-gray-400'} 
                          />
                        </div>

                        {/* Step Info */}
                        <div className="flex-1 pt-2">
                          <h3 
                            className={`font-bold mb-1 ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h3>
                          {isActive && (
                            <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                              In Progress
                            </p>
                          )}
                          {isCompleted && !isActive && (
                            <p className="text-sm text-gray-500">✓ Completed</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ===== ORDER INFO ===== */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Order Details</h2>
               
                <div className="space-y-4">
                  {/* Order Number */}
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-black text-gray-900">{orderData.order_number}</span>
                  </div>

                  {/* Customer Name */}
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-bold text-gray-900">{orderData.customer_name}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-bold text-gray-900">{orderData.customer_phone}</span>
                  </div>

                  {/* Address */}
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-bold text-gray-900 text-right max-w-xs">
                      {orderData.customer_address}
                    </span>
                  </div>

                  {/* Order Time */}
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Order Time:</span>
                    <span className="font-bold text-gray-900">
                      {new Date(orderData.created_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 text-lg">Total Amount:</span>
                    <span className="font-black text-green-700 text-2xl">
                      ₹{orderData.total_amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== ORDER ITEMS ===== */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Items Ordered</h2>
               
                <div className="space-y-3">
                  {orderData.order_items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.item_name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.is_veg ? '🟢' : '🔴'} Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <div className="font-bold text-gray-900 text-lg">
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== CONTACT HELP ===== */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-2xl">
                <h2 className="text-2xl font-black mb-2">Need Help?</h2>
                <p className="mb-6 opacity-90">
                  Contact us if you have any questions about your order
                </p>
               
                <div className="grid grid-cols-2 gap-3">
                  {/* Call Button */}
                  <a href={`tel:${CAFE_PHONE}`}>
                    <button className="w-full bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center justify-center gap-2 shadow-lg">
                      <Phone size={18} />
                      Call
                    </button>
                  </a>

                  {/* Email Button */}
                  <a href={`mailto:${CAFE_EMAIL}`}>
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-bold hover:bg-white/30 transition flex items-center justify-center gap-2">
                      <Mail size={18} />
                      Email
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
