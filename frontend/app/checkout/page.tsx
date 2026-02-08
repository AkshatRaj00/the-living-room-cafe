'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Loader2, 
  Wallet, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  AlertCircle,
  CreditCard,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// ========== CONSTANTS ==========
const CAFE_PHONE = '+919285555002'

// ========== MAIN COMPONENT ==========
export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getTotalItems, getTotalPrice, clearCart } = useCart()
 
  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  })
 
  // ===== PAYMENT STATES =====
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const UPI_ID = 'paytmqr5gdc6f@ptys'
 
  // ===== UI STATES =====
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ===== EFFECT: Check cart =====
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/menu')
    }
  }, [cart, router])

  // ===== CALCULATIONS =====
  const subtotal = getTotalPrice()
  const gst = Math.round(subtotal * 0.05)
  const deliveryFee = 0
  const total = subtotal + gst + deliveryFee

  // ===== FUNCTION: Copy UPI ID =====
  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ===== FUNCTION: Handle input change =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  // ===== FUNCTION: Submit order =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   
    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill all required fields!')
      return
    }

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number!')
      return
    }

    if (cart.length === 0) {
      setError('Your cart is empty!')
      return
    }

    if (paymentMethod === 'online' && !transactionId.trim()) {
      setError('Please enter Transaction ID after payment!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: formData,
          cartItems: cart,
          amounts: {
            subtotal,
            gst,
            deliveryFee,
            total
          },
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI)',
          transactionId: paymentMethod === 'online' ? transactionId : null
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to place order')
      }

      console.log('✅ Order placed:', result)

      // WhatsApp to owner
      window.open(result.whatsappUrl, '_blank')

      // Online payment: WhatsApp to customer
      if (paymentMethod === 'online') {
        const customerMessage = `✅ *Payment Successful!*\n\n` +
          `Thank you ${formData.name}!\n\n` +
          `Your payment of *₹${total}* has been received.\n\n` +
          `📋 Order #${result.orderNumber}\n` +
          `🆔 Transaction ID: ${transactionId}\n\n` +
          `Your order is being prepared! 🚀\n\n` +
          `_The Living Room Cafe_ ❤️`

        const customerWhatsapp = `https://wa.me/91${formData.phone}?text=${encodeURIComponent(customerMessage)}`
       
        setTimeout(() => {
          window.open(customerWhatsapp, '_blank')
        }, 1500)
      }

      // Save receipt data
      const receiptData = {
        orderNumber: result.orderNumber,
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        items: cart,
        subtotal,
        gst,
        total,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI)',
        transactionId: paymentMethod === 'online' ? transactionId : null,
        orderDate: new Date().toISOString()
      }

      localStorage.setItem('lastOrder', JSON.stringify(receiptData))

      clearCart()

      alert(`✅ Order Placed Successfully!\n\nOrder #${result.orderNumber}\n${paymentMethod === 'online' ? 'Payment confirmed!' : 'Pay on delivery'}`)

      setTimeout(() => {
        router.push(`/order-receipt?orderNumber=${result.orderNumber}`)
      }, 1000)

    } catch (error: any) {
      console.error('Error placing order:', error)
      setError(error.message || 'Something went wrong! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ===== EARLY RETURN: Empty cart =====
  if (cart.length === 0) {
    return null
  }

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link 
              href="/menu" 
              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-bold transition group"
            >
              <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-lg">Back to Menu</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <ShoppingBag size={20} className="text-green-600" />
              <span className="font-bold text-green-900">{getTotalItems()} Items</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* ===== PAGE TITLE ===== */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 flex items-center justify-center gap-4">
              <ShoppingBag className="text-green-600" size={48} />
              Checkout
            </h1>
            <p className="text-gray-600 text-lg">Complete your order & get it delivered!</p>
          </div>

          {/* ===== ERROR ALERT ===== */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="max-w-2xl mx-auto mb-6"
              >
                <div className="bg-red-50 border-4 border-red-300 text-red-800 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <AlertCircle size={28} className="flex-shrink-0" />
                  <p className="font-bold text-lg">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== TWO COLUMN LAYOUT ===== */}
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* ========== LEFT: FORM (3 columns) ========== */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-gray-200">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 border-b-4 border-green-500 pb-4">
                  <User size={32} className="text-green-600" />
                  Your Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ===== NAME INPUT ===== */}
                  <div>
                    <label className="block text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                      <User size={18} className="text-green-600" />
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 rounded-2xl border-3 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none text-gray-900 font-semibold text-lg disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* ===== PHONE INPUT ===== */}
                  <div>
                    <label className="block text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Phone size={18} className="text-green-600" />
                      Phone Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex shadow-sm">
                      <span className="inline-flex items-center px-5 py-4 rounded-l-2xl border-3 border-r-0 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-black text-lg">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        disabled={loading}
                        className="flex-1 px-5 py-4 rounded-r-2xl border-3 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none text-gray-900 font-semibold text-lg disabled:bg-gray-100 transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  {/* ===== ADDRESS INPUT ===== */}
                  <div>
                    <label className="block text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-green-600" />
                      Delivery Address <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 rounded-2xl border-3 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none text-gray-900 font-semibold text-lg disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="House no., Street, Landmark, Area"
                    />
                  </div>

                  {/* ===== NOTES TEXTAREA ===== */}
                  <div>
                    <label className="block text-base font-black text-gray-900 mb-3">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      disabled={loading}
                      className="w-full px-5 py-4 rounded-2xl border-3 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none text-gray-900 font-semibold resize-none disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="Any special requests? (e.g., extra spicy, no onions)"
                    />
                  </div>

                  {/* ========== PAYMENT METHOD ========== */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-3 border-gray-300">
                    <label className="block text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-green-600" />
                      Payment Method <span className="text-red-500 ml-1">*</span>
                    </label>
                   
                    <div className="space-y-4">
                      {/* ===== CASH ON DELIVERY ===== */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPaymentMethod('cod')
                          setShowQR(false)
                          setTransactionId('')
                        }}
                        className={`border-4 rounded-2xl p-5 cursor-pointer transition-all shadow-lg ${
                          paymentMethod === 'cod'
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 ring-4 ring-green-200'
                            : 'border-gray-300 bg-white hover:border-green-400 hover:shadow-xl'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-md">
                              <Wallet className="text-green-600" size={28} />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-lg">Cash on Delivery</h4>
                              <p className="text-sm text-gray-600 font-semibold">Pay when you receive your order</p>
                            </div>
                          </div>
                          {paymentMethod === 'cod' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-green-600 rounded-full p-1"
                            >
                              <CheckCircle className="text-white" size={28} />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>

                      {/* ===== ONLINE PAYMENT ===== */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod('online')}
                        className={`border-4 rounded-2xl p-5 cursor-pointer transition-all shadow-lg ${
                          paymentMethod === 'online'
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-200'
                            : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-xl'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-md">
                              <Smartphone className="text-blue-600" size={28} />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-lg">Online Payment (UPI)</h4>
                              <p className="text-sm text-gray-600 font-semibold">Pay via Paytm / GPay / PhonePe</p>
                            </div>
                          </div>
                          {paymentMethod === 'online' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-blue-600 rounded-full p-1"
                            >
                              <CheckCircle className="text-white" size={28} />
                            </motion.div>
                          )}
                        </div>

                        {/* ===== ONLINE PAYMENT DETAILS ===== */}
                        <AnimatePresence>
                          {paymentMethod === 'online' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-4 border-t-4 border-blue-200 space-y-4"
                            >
                              {/* UPI ID */}
                              <div>
                                <label className="text-sm font-black text-gray-900 mb-2 block">UPI ID</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={UPI_ID}
                                    readOnly
                                    className="flex-1 bg-blue-100 border-3 border-blue-300 rounded-xl px-4 py-3 font-mono text-base font-bold text-blue-900 shadow-inner"
                                  />
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={copyUPI}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                  >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                  </motion.button>
                                </div>
                                {copied && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-600 text-sm font-black mt-2 flex items-center gap-1"
                                  >
                                    <CheckCircle size={16} /> Copied to clipboard!
                                  </motion.p>
                                )}
                              </div>

                              {/* QR Code Toggle */}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setShowQR(!showQR)}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-black text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
                              >
                                <QrCode size={22} />
                                {showQR ? 'Hide QR Code' : 'Show QR Code to Scan'}
                              </motion.button>

                              {/* QR Code Display */}
                              <AnimatePresence>
                                {showQR && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white border-4 border-blue-500 rounded-2xl p-6 text-center shadow-2xl"
                                  >
                                    <p className="text-lg font-black mb-4 text-blue-900">Scan to pay ₹{total}</p>
                                    <div className="w-56 h-56 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-4 border-dashed border-blue-300 flex items-center justify-center shadow-inner">
                                      <Image
                                        src="/qr-code.png"
                                        alt="QR Code"
                                        width={220}
                                        height={220}
                                        className="rounded-xl"
                                      />
                                    </div>
                                    <p className="text-sm text-gray-600 font-semibold mt-4">Scan with any UPI app</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Transaction ID Input */}
                              <div>
                                <label className="text-sm font-black text-gray-900 mb-2 block flex items-center gap-2">
                                  Transaction ID <span className="text-red-500">*</span>
                                  <span className="text-xs font-normal text-gray-600">(12-digit)</span>
                                </label>
                                <input
                                  type="text"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  placeholder="Enter Transaction ID after payment"
                                  className="w-full border-3 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-xl px-4 py-3 font-mono text-base font-bold shadow-sm transition-all"
                                  required={paymentMethod === 'online'}
                                />
                                <p className="text-xs text-gray-600 font-semibold mt-2">⚠️ Complete payment first, then enter Transaction ID here</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>

                  {/* ===== CONFIRMATION NOTE ===== */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-4 border-orange-300 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 rounded-full p-3 shadow-md">
                        <Phone size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-black text-orange-900 mb-2 text-base">📱 WhatsApp Confirmation</p>
                        <p className="text-orange-800 font-semibold text-sm leading-relaxed">
                          {paymentMethod === 'cod'
                            ? 'WhatsApp will automatically open with your order details for quick confirmation.'
                            : 'You will receive payment confirmation and order details on WhatsApp after submitting.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ===== SUBMIT BUTTON ===== */}
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-4 border-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={28} className="animate-spin" />
                        Placing Your Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={28} />
                        Place Order Now
                        <span className="text-3xl">→</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>

            {/* ========== RIGHT: ORDER SUMMARY (2 columns) ========== */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-gray-200 sticky top-24">
                <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b-4 border-green-500 pb-4">
                  <ShoppingBag size={32} className="text-green-600" />
                  Order Summary
                </h2>

                {/* ===== CART ITEMS ===== */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-start pb-4 border-b-2 border-gray-200 last:border-0"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="font-black text-gray-900 mb-1 text-lg leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                          <span className="text-lg">{item.is_veg ? '🟢' : '🔴'}</span>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <div className="font-black text-gray-900 text-xl whitespace-nowrap">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===== PRICE BREAKDOWN ===== */}
                <div className="space-y-4 pt-6 border-t-4 border-gray-300 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold text-base">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-black text-lg">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold text-base">GST (5%)</span>
                    <span className="font-black text-lg">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold text-base">Delivery Fee</span>
                    <span className="font-black text-green-600 text-lg">FREE ✨</span>
                  </div>
                  
                  {/* ===== TOTAL ===== */}
                  <div className="flex justify-between text-3xl font-black pt-4 border-t-4 border-gray-300 bg-gradient-to-r from-green-50 to-emerald-50 -mx-4 px-4 py-4 rounded-xl">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-700">₹{total}</span>
                  </div>
                </div>

                {/* ===== DELIVERY TIME ===== */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-3 border-green-300 shadow-lg mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-3 shadow-md">
                      <Clock size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-900">Estimated Delivery</p>
                      <p className="text-base font-black text-green-700">30-40 minutes ⚡</p>
                    </div>
                  </div>
                </div>

                {/* ===== PAYMENT METHOD DISPLAY ===== */}
                <div 
                  className={`p-5 rounded-2xl border-3 shadow-lg ${
                    paymentMethod === 'cod' 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{paymentMethod === 'cod' ? '💵' : '📱'}</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900">Payment Method</p>
                      <p className="text-base font-bold text-gray-700">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI)'}
                      </p>
                      {paymentMethod === 'online' && transactionId && (
                        <p className="text-xs font-mono mt-1 bg-white px-2 py-1 rounded inline-block">
                          Txn: {transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== CUSTOM SCROLLBAR STYLES ===== */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  )
}
