'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Phone, Clock } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  items: any[]
  total_amount: number
  status: string
  created_at: string
}

interface OrdersTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
  loading?: boolean
}

// Inline Status Badge Component
const OrderStatusBadge = ({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'out_for_delivery': return 'bg-cyan-100 text-cyan-800 border-cyan-300'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span className={`${sizeClass} rounded-full font-bold border-2 ${getStatusColor(status)}`}>
      {status?.toUpperCase().replace('_', ' ') || 'PENDING'}
    </span>
  )
}

export default function OrdersTable({ orders, onViewOrder, loading }: OrdersTableProps) {
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getItemCount = (items: any[]) => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-gray-200 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Found</h3>
        <p className="text-gray-600">No orders match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onViewOrder(order)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-black text-gray-900">{order.order_number}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock size={14} />
                      {formatTime(order.created_at)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-gray-900">{order.customer_name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone size={14} />
                      {order.customer_phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {getItemCount(order.items)} items
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-green-600 text-lg">
                    ₹{Math.round(order.total_amount)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewOrder(order)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-sm"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onViewOrder(order)}
            className="p-4 hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-black text-gray-900">{order.order_number}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Clock size={14} />
                  {formatTime(order.created_at)}
                </div>
              </div>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="font-bold text-gray-900">{order.customer_name}</div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Phone size={14} />
                {order.customer_phone}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {getItemCount(order.items)} items
              </div>
              <div className="font-black text-green-600 text-lg">
                ₹{Math.round(order.total_amount)}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewOrder(order)
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-sm"
            >
              <Eye size={16} />
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
