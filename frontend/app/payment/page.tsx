'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wallet, QrCode, Smartphone, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
    </div>
  )
}

// Main payment content component
function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [orderId, setOrderId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [amount, setAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | null>(null)
  const [showUPIOptions, setShowUPIOptions] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // UPI Details
  const UPI_ID = 'paytmqr5gdc6f@ptys'
  const UPI_NAME = 'The Living Room Cafe'

  useEffect(() => {
    setOrderId(searchParams.get('orderId') || '')
    setOrderNumber(searchParams.get('orderNumber') || '')
    setAmount(parseFloat(searchParams.get('amount') || '0'))
  }, [searchParams])

  const generateUPILink = () => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=Order%20${orderNumber}`
  }

  const handleCODPayment = async () => {
    setVerifying(true)
    try {
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'cod',
          paymentStatus: 'pending'
        })
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/order-success?orderNumber=${orderNumber}`)
      } else {
        alert('Payment confirmation failed')
      }
    } catch (error) {
      alert('Error confirming payment')
    } finally {
      setVerifying(false)
    }
  }

  const handleUPIPayment = () => {
    setShowUPIOptions(true)
  }

  const openUPIApp = (app: string) => {
    const upiLink = generateUPILink()
    
    // Open UPI app
    window.location.href = upiLink
    
    // Show verification after 3 seconds
    setTimeout(() => {
      setVerifying(true)
      // Auto-redirect after payment (simulate)
      setTimeout(() => {
        router.push(`/payment-verify?orderId=${orderId}&orderNumber=${orderNumber}&method=upi`)
      }, 2000)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Payment</h1>
            <p className="text-gray-600">Order: {orderNumber}</p>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
          <p className="text-4xl font-black">₹{Math.round(amount)}</p>
        </div>

        {!showUPIOptions ? (
          /* Payment Method Selection */
          <div className="space-y-4">
            {/* UPI Payment */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUPIPayment}
              className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 transition flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Smartphone size={28} className="text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-black text-gray-900 text-lg">UPI Payment</p>
                <p className="text-sm text-gray-600">PhonePe, GPay, Paytm & more</p>
              </div>
              <div className="text-green-600 text-sm font-bold">Instant</div>
            </motion.button>

            {/* Cash on Delivery */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCODPayment}
              disabled={verifying}
              className="w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 transition flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Wallet size={28} className="text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-black text-gray-900 text-lg">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when you receive</p>
              </div>
              {verifying && <Loader2 size={20} className="animate-spin text-green-600" />}
            </motion.button>
          </div>
        ) : (
          /* UPI Payment Options */
          <div className="space-y-6">
            <button
              onClick={() => setShowUPIOptions(false)}
              className="text-green-600 font-bold flex items-center gap-2 hover:underline"
            >
              <ArrowLeft size={20} />
              Back to payment methods
            </button>

            {/* QR Code Section */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <QrCode size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 mb-6">Scan with any UPI app to pay</p>
              
              {/* QR Code Image */}
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="w-64 h-64 mx-auto bg-white rounded-xl border-4 border-green-600 overflow-hidden">
                  <Image
                    src="/qr-code.jpg"
                    alt="UPI Payment QR Code"
                    width={256}
                    height={256}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 mb-2">UPI ID:</p>
                <p className="font-black text-green-700 text-lg">{UPI_ID}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 font-bold">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* UPI Apps */}
            <div>
              <h3 className="font-black text-gray-900 mb-4">Pay with UPI App</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'PhonePe', color: 'purple' },
                  { name: 'GPay', color: 'blue' },
                  { name: 'Paytm', color: 'indigo' },
                  { name: 'BHIM', color: 'orange' },
                  { name: 'Amazon', color: 'yellow' },
                  { name: 'Other', color: 'gray' }
                ].map((app) => (
                  <button
                    key={app.name}
                    onClick={() => openUPIApp(app.name)}
                    className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-4 transition"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Smartphone size={24} className="text-gray-600" />
                    </div>
                    <p className="font-bold text-sm">{app.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Verification */}
            <button
              onClick={() => router.push(`/payment-verify?orderId=${orderId}&orderNumber=${orderNumber}&method=upi`)}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition"
            >
              I have completed the payment
            </button>
          </div>
        )}

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <a href="tel:+919285555002" className="text-green-600 font-bold hover:underline">Call Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Export with Suspense wrapper
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PaymentContent />
    </Suspense>
  )
}
