export const dynamic = 'force-dynamic'
export const dynamicParams = true

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Phone, Mail, Home, Package } from 'lucide-react'
import Link from 'next/link'

const CAFE_PHONE = '+919285555002'
const CAFE_EMAIL = 'thelivingroomcafe30@gmail.com'

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
    </div>
  )
}

// Main content component that uses useSearchParams
function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/menu')
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 border-2 border-green-200"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={50} className="text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your order has been confirmed and sent to our kitchen
        </p>

        {/* Order Number */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
          <p className="text-3xl font-black text-green-700">{orderNumber}</p>
          <p className="text-xs text-gray-500 mt-2">Save this for tracking</p>
        </div>

        {/* Info Boxes */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📧</span>
              <div>
                <p className="font-bold text-blue-900 mb-1">Email Sent</p>
                <p className="text-sm text-blue-700">Order details sent to cafe</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💬</span>
              <div>
                <p className="font-bold text-purple-900 mb-1">WhatsApp Sent</p>
                <p className="text-sm text-purple-700">Confirmation message opened</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} className="text-green-600" />
            What happens next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">1.</span>
              <span>We receive your order and confirm it</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">2.</span>
              <span>Our chefs start preparing your delicious food</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">3.</span>
              <span>Your order is delivered to your doorstep</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">4.</span>
              <span>Estimated delivery: <strong>30-40 minutes</strong></span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Link href={`/track-order?orderNumber=${orderNumber}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Package size={20} />
              Track Your Order
            </motion.button>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${CAFE_PHONE}`}>
              <button className="w-full bg-blue-100 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-200 transition flex items-center justify-center gap-2">
                <Phone size={18} />
                Call Us
              </button>
            </a>
            <a href={`mailto:${CAFE_EMAIL}`}>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <Mail size={18} />
                Email
              </button>
            </a>
          </div>
        </div>

        {/* Auto Redirect */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Redirecting to menu in <span className="font-bold text-green-600">{countdown}</span> seconds...
          </p>
          <Link href="/menu">
            <button className="text-green-600 hover:text-green-700 font-bold text-sm flex items-center gap-1 mx-auto">
              <Home size={16} />
              Go to Menu Now
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// Export with Suspense wrapper
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OrderSuccessContent />
    </Suspense>
  )
}
