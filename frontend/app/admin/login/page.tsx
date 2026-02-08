'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const result = await response.json()

      if (result.success) {
        // Save token to localStorage
        localStorage.setItem('admin_token', result.token)
        
        // Redirect to admin dashboard
        router.push('/admin/menu')
      } else {
        setError(result.error || 'Invalid password')
      }
    } catch (error) {
      setError('Something went wrong! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Lock size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">The Living Room Cafe</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Enter Admin Password
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none text-gray-900 font-medium disabled:bg-gray-100"
                  placeholder="Enter admin password"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Dashboard
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure admin access only
            </p>
          </div>
        </motion.div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition text-sm font-medium"
          >
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  )
}
