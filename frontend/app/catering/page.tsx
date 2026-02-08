'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle, Star, Award, Sparkles, Send, ChevronLeft, Loader2, Users, DollarSign, AlertCircle } from 'lucide-react'

const CAFE_PHONE = '+919285555002'
const CAFE_EMAIL = 'thelivingroomcafe30@gmail.com'
const CAFE_ADDRESS = 'The Living Room Cafe & Lounge, VIP Road (Airport Road) Towards Phunder Chowk, Chhattisgarh 492001'

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'wedding',
    eventDate: '',
    guestCount: '',
    venue: '',
    budget: '',
    requirements: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inquiryNumber, setInquiryNumber] = useState('')
  const [error, setError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.phone || !formData.eventDate) {
      setError('Please fill all required fields!')
      return
    }

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/catering-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit inquiry')
      }

      setInquiryNumber(result.inquiryNumber)
      setWhatsappUrl(result.whatsappUrl)
      setEmailSent(result.emailSent)
      
      window.open(result.whatsappUrl, '_blank')
      
      setSubmitted(true)

      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: 'wedding',
        eventDate: '',
        guestCount: '',
        venue: '',
        budget: '',
        requirements: ''
      })

    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'Something went wrong! Please try calling us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl bg-white rounded-3xl shadow-2xl p-10 text-center border-2 border-orange-200"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle size={50} className="text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4">Almost Done!</h1>
          
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Inquiry Number</p>
            <p className="text-3xl font-black text-orange-700">{inquiryNumber}</p>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6">
            <h3 className="font-black text-red-800 mb-3 flex items-center gap-2 justify-center text-lg">
              <AlertCircle size={24} className="animate-pulse" />
              IMPORTANT: Complete This Step!
            </h3>
            <p className="text-red-700 font-bold mb-4">
              Your inquiry is saved, but you MUST send WhatsApp message to confirm your booking!
            </p>
            <div className="space-y-2 text-sm text-left text-red-700">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xl">✓</span>
                <span>Database saved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xl">✓</span>
                <span>Email sent to cafe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-600 text-xl">⚠</span>
                <span className="font-black">WhatsApp message REQUIRED (mandatory)</span>
              </div>
            </div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-5 rounded-2xl font-black text-xl mb-4 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <Phone size={24} />
              Send WhatsApp Message Now
            </motion.button>
          </a>

          <p className="text-xs text-gray-500 mb-6">
            Click above to open WhatsApp and send the pre-filled message
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles size={20} className="text-blue-600" />
              What happens after you send WhatsApp?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span>Our team receives your WhatsApp message instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span>We call you within 2-4 hours to discuss details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <span>You receive customized quotation via email</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 mb-8">
            <p className="text-sm font-bold text-gray-700 mb-3">Need urgent assistance?</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${CAFE_PHONE}`}>
                <button className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Phone size={18} />
                  Call: {CAFE_PHONE}
                </button>
              </a>
              <a href={`mailto:${CAFE_EMAIL}`}>
                <button className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2">
                  <Mail size={18} />
                  {CAFE_EMAIL}
                </button>
              </a>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <button className="w-full bg-gray-900 text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                <ChevronLeft size={20} />
                Back to Home
              </button>
            </Link>
            <button 
              onClick={() => setSubmitted(false)}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-full font-bold hover:shadow-xl transition"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* NAVBAR REMOVED - LAYOUT.TSX WALA USE HOGA */}

      <section className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/catering/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/60 to-green-800/60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full mb-6 shadow-lg"
          >
            <Sparkles size={22} className="animate-pulse" />
            <span className="font-bold text-lg">Premium Catering Services in Raipur</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg"
          >
            Make Your Events Memorable
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-md"
          >
            Professional catering for weddings, corporate events & celebrations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-3 text-base bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl inline-flex shadow-lg"
          >
            <MapPin size={20} />
            <span className="font-medium">{CAFE_ADDRESS}</span>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-3 text-gray-900">Our Catering Gallery</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Moments from our successful events</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-72 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            >
              <img 
                src={`/images/catering/photo-${i}.jpg`}
                alt={`Event ${i}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #10b981, #059669)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg">Event Photo {i}</p>
              </div>
            </motion.div>
          ))}

          {[1, 2, 3].map((i) => (
            <motion.div
              key={`video-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 3) * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-72 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border-4 border-orange-500"
            >
              <video 
                src={`/videos/catering/event-${i}.mp4`}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-2xl">▶</span> Event Video {i}
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                LIVE
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-2">Request a Quote</h2>
            <p className="text-gray-600 mb-6">Fill the form and send WhatsApp message to confirm</p>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com (optional)"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                  required
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="engagement">Engagement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  placeholder="Approximate guest count"
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Event location/address"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. Rs. 50,000 - Rs. 100,000"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Dietary restrictions, food preferences, special arrangements..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-green-500 outline-none text-gray-900 font-medium resize-none"
                />
              </div>

              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={24} className="text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-orange-800 mb-1">Important:</p>
                    <p className="text-orange-700">After clicking submit, WhatsApp will open with a pre-filled message. You must send that message to confirm your inquiry.</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit & Send WhatsApp
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to send WhatsApp confirmation message
              </p>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <h2 className="text-3xl font-black mb-6 text-gray-900">Why Choose Us?</h2>
              <div className="space-y-5">
                {[
                  { icon: <Award />, title: '9+ Years Experience', desc: 'Serving Raipur since 2017' },
                  { icon: <Users />, title: 'Expert Team', desc: 'Professional chefs & staff' },
                  { icon: <Star />, title: '500+ Events', desc: 'Successfully catered' },
                  { icon: <DollarSign />, title: 'Flexible Packages', desc: 'Custom menus for every budget' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-black mb-6">Contact Us</h3>
              <div className="space-y-4">
                <a href={`tel:${CAFE_PHONE}`}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-green-700 px-6 py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                  >
                    <Phone size={20} />
                    {CAFE_PHONE}
                  </motion.button>
                </a>
                <a href={`mailto:${CAFE_EMAIL}`}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white/20 backdrop-blur-md text-white px-6 py-4 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-3"
                  >
                    <Mail size={20} />
                    Email Us
                  </motion.button>
                </a>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="opacity-90">{CAFE_ADDRESS}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER REMOVED - LAYOUT.TSX WALA USE HOGA */}
    </div>
  )
}
