'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'

export default function PaymentVerifyPage() {
  const router = useRouter()
  
  const [orderId, setOrderId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Get params from URL using window.location
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId') || '')
    setOrderNumber(params.get('orderNumber') || '')
  }, [mounted])

  const verifyPayment = async () => {
    if (!transactionId) {
      alert('Please enter transaction ID')
      return
    }

    setVerifying(true)

    try {
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'upi',
          paymentStatus: 'paid',
          transactionId
        })
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/order-success?orderNumber=${orderNumber}`)
      } else {
        alert('Verification failed. Please contact support.')
      }
    } catch (error) {
      alert('Error verifying payment')
    } finally {
      setVerifying(false)
    }
  }

  // Show loading on server-side
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Verify Payment</h1>
          <p className="text-gray-600">Order: {orderNumber}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              UPI Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter 12-digit transaction ID"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Check your UPI app for transaction ID
            </p>
          </div>

          <button
            onClick={verifyPayment}
            disabled={verifying || !transactionId}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Confirm Order'
            )}
          </button>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-700">
              <p className="font-bold mb-1">Note:</p>
              <p>Your order will be confirmed after payment verification. This may take 2-5 minutes.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
