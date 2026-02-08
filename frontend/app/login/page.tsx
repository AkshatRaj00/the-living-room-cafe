'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, Loader2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, login } = useAuth()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/profile')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your name (minimum 2 characters)')
      return
    }

    setLoading(true)

    try {
      await login(phone, name.trim())
      router.push('/profile')
    } catch (error: any) {
      console.error('Login failed:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
            LR
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600">Login to start ordering delicious food</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={16} className="text-green-600" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-green-500">
              <span className="text-gray-600 font-medium mr-2">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setError('')
                }}
                placeholder="Enter 10-digit number"
                maxLength={10}
                className="flex-1 bg-transparent outline-none text-gray-900 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} className="text-green-600" />
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your full name"
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium focus:border-green-500 outline-none"
              required
              minLength={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 10 || !name.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <p className="text-sm text-green-800 font-medium text-center">
            🔐 Secure login - Your data is safe with us
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
