'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Share2, Home, Package, Calendar, User, Phone, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface OrderData {
  orderNumber: string
  customerName: string
  phone: string
  address: string
  items: any[]
  subtotal: number
  gst: number
  total: number
  paymentMethod: string
  transactionId?: string | null
  orderDate: string
}

export default function OrderReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const receiptRef = useRef<HTMLDivElement>(null)
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    const orderNumber = searchParams.get('orderNumber')
    
    if (!orderNumber) {
      router.push('/menu')
      return
    }

    const savedOrder = localStorage.getItem('lastOrder')
    
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      if (order.orderNumber === orderNumber) {
        setOrderData(order)
      } else {
        router.push('/menu')
      }
    } else {
      router.push('/menu')
    }
    
    setLoading(false)
  }, [searchParams, router])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true)
    }
  }, [])

  const handleDownloadReceipt = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleShareReceipt = async () => {
    if (orderData && canShare && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Order Receipt - ${orderData.orderNumber}`,
          text: `Order #${orderData.orderNumber}\nTotal: ₹${orderData.total}\nThank you for ordering from The Living Room Cafe!`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    }
  }

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle size={48} className="text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
          >
            Order Confirmed! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-2"
          >
            Thank you for your order!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-white px-6 py-3 rounded-full shadow-lg border-2 border-green-200"
          >
            <p className="text-sm text-gray-600 font-semibold">Order Number</p>
            <p className="text-2xl font-black text-green-600">{orderData.orderNumber}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            <Download size={20} />
            Download Receipt
          </button>
          
          {canShare && (
            <button
              onClick={handleShareReceipt}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
            >
              <Share2 size={20} />
              Share Receipt
            </button>
          )}
          
          <Link href="/menu">
            <button className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700 transition shadow-lg hover:shadow-xl">
              <Home size={20} />
              Back to Menu
            </button>
          </Link>
        </motion.div>

        <motion.div
          ref={receiptRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-200"
          id="receipt-content"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-2">ORDER RECEIPT</h2>
              <p className="text-green-100 text-lg font-semibold">The Living Room Cafe</p>
              <p className="text-green-200 text-sm mt-1">Est. 2017 • Indore, MP</p>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Package className="text-green-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Order Number</p>
                    <p className="text-lg font-black text-gray-900">{orderData.orderNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Order Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(orderData.orderDate).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <User className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Customer Name</p>
                    <p className="text-sm font-bold text-gray-900">{orderData.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Phone className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">+91 {orderData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
              <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <p className="text-xs text-blue-900 font-bold uppercase mb-2">Delivery Address</p>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">{orderData.address}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="text-green-600" size={24} />
                <h3 className="text-xl font-black text-gray-900">Order Items</h3>
              </div>
              
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex justify-between items-start p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.is_veg ? '🟢' : '🔴'}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border-t-4 border-dashed border-gray-300 pt-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Bill Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">₹{orderData.subtotal}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">GST (5%)</span>
                  <span className="font-bold">₹{orderData.gst}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Delivery Charges</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                  <span className="text-2xl font-black text-gray-900">TOTAL</span>
                  <span className="text-3xl font-black text-green-600">₹{orderData.total}</span>
                </div>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-5 rounded-xl border-2 ${
              orderData.paymentMethod.includes('Online') 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            }`}>
              <CreditCard className={orderData.paymentMethod.includes('Online') ? 'text-blue-600' : 'text-green-600'} size={24} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase mb-2 text-gray-700">Payment Method</p>
                <p className="text-lg font-black text-gray-900">{orderData.paymentMethod}</p>
                {orderData.transactionId && (
                  <div className="mt-2 bg-white rounded-lg p-3 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">Transaction ID</p>
                    <p className="text-sm font-mono font-black text-blue-600">{orderData.transactionId}</p>
                  </div>
                )}
              </div>
              <div className={`px-4 py-2 rounded-full font-black text-sm ${
                orderData.paymentMethod.includes('Online')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}>
                {orderData.paymentMethod.includes('Online') ? 'PAID' : 'COD'}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-gray-900 mb-2">Order Status: Confirmed</h4>
                  <p className="text-sm text-gray-700 font-semibold mb-3">
                    Your order is being prepared and will be delivered soon!
                  </p>
                  <div className="flex items-center gap-2 text-orange-700 font-bold">
                    <span className="text-2xl">⏱️</span>
                    <span>Estimated Delivery: 30-40 minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <Link href={`/track-order?orderNumber=${orderData.orderNumber}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-3"
              >
                <Package size={24} />
                Track Your Order
                <ArrowRight size={24} />
              </motion.button>
            </Link>

            <div className="text-center pt-6 border-t-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-600 font-semibold mb-2">Thank you for choosing</p>
              <p className="text-2xl font-black text-gray-900 mb-3">The Living Room Cafe</p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  +91 9285555002
                </span>
                <span>•</span>
                <span>Indore, Madhya Pradesh</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                &quot;Where every meal feels like home&quot; ❤️
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
