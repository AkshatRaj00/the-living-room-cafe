'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail, MapPin, Clock, Package, FileText, Printer, Ban } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address?: string
  items: any[]
  subtotal: number
  tax: number
  delivery_fee: number
  discount: number
  total_amount: number
  status: string
  payment_method?: string
  customer_notes?: string
  admin_notes?: string
  created_at: string
  confirmed_at?: string
  prepared_at?: string
  delivered_at?: string
  order_type: string
  delivery_time?: string
}

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: string, status: string) => void
  onUpdateNotes: (orderId: string, notes: string) => void
  onPrintKitchen: (order: Order) => void
  onPrintBill: (order: Order) => void
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onPrintKitchen,
  onPrintBill
}: OrderDetailsModalProps) {
  const [adminNotes, setAdminNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '--'
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    await onUpdateStatus(order.id, newStatus)
    setIsUpdating(false)
  }

  const handleSaveNotes = async () => {
    if (adminNotes.trim()) {
      setIsUpdating(true)
      await onUpdateNotes(order.id, adminNotes)
      setIsUpdating(false)
      setAdminNotes('')
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black mb-1">Order Details</h2>
                <p className="text-green-100 font-bold">{order.order_number}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Information */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-600" />
                  Customer Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-bold text-gray-900">{order.customer_name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-bold text-gray-900">{order.customer_phone}</div>
                    </div>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-bold text-gray-900">{order.customer_email}</div>
                      </div>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Delivery Address</div>
                        <div className="font-bold text-gray-900">{order.delivery_address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Items Ordered */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-green-600" />
                  Items Ordered
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">
                          {item.quantity}x {item.name}
                        </div>
                        {item.customization && (
                          <div className="text-sm text-gray-600 mt-1">
                            {item.customization}
                          </div>
                        )}
                      </div>
                      <div className="font-black text-gray-900">
                        ₹{Math.round(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bill Breakdown */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-green-600" />
                  Bill Breakdown
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{Math.round(order.subtotal)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (5%):</span>
                      <span className="font-bold">₹{Math.round(order.tax)}</span>
                    </div>
                  )}
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee:</span>
                      <span className="font-bold">₹{Math.round(order.delivery_fee)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-bold">-₹{Math.round(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-gray-900 text-lg">
                      <span className="font-black">TOTAL:</span>
                      <span className="font-black text-green-600">
                        ₹{Math.round(order.total_amount)}
                      </span>
                    </div>
                  </div>
                  {order.payment_method && (
                    <div className="text-sm text-gray-600 mt-2">
                      Payment: <span className="font-bold capitalize">{order.payment_method}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Status */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-green-600" />
                  Order Status
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Change Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isUpdating}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none font-bold text-gray-900 disabled:bg-gray-100"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-gray-600">Placed:</span>
                      <span className="font-bold text-gray-900">{formatDateTime(order.created_at)}</span>
                    </div>
                    {order.confirmed_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span className="text-gray-600">Confirmed:</span>
                        <span className="font-bold text-gray-900">{formatDateTime(order.confirmed_at)}</span>
                      </div>
                    )}
                    {order.prepared_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                        <span className="text-gray-600">Prepared:</span>
                        <span className="font-bold text-gray-900">{formatDateTime(order.prepared_at)}</span>
                      </div>
                    )}
                    {order.delivered_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <span className="text-gray-600">Delivered:</span>
                        <span className="font-bold text-gray-900">{formatDateTime(order.delivered_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-green-600" />
                  Notes
                </h3>
                <div className="space-y-3">
                  {order.customer_notes && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="text-sm font-bold text-blue-900 mb-1">Customer Notes:</div>
                      <div className="text-gray-700">{order.customer_notes}</div>
                    </div>
                  )}
                  
                  {order.admin_notes && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <div className="text-sm font-bold text-yellow-900 mb-1">Admin Notes:</div>
                      <div className="text-gray-700">{order.admin_notes}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Add Internal Note:
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes for internal reference..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none text-gray-900 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={!adminNotes.trim() || isUpdating}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Actions Footer */}
            <div className="border-t-2 border-gray-200 p-6 bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={() => onPrintKitchen(order)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-bold"
              >
                <Printer size={20} />
                Print Kitchen Order
              </button>
              <button
                onClick={() => onPrintBill(order)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold"
              >
                <Printer size={20} />
                Print Bill
              </button>
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold ml-auto"
                >
                  <Ban size={20} />
                  Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
