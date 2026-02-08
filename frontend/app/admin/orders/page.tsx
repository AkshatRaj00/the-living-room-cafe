'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter,
  Eye,
  Phone,
  MapPin,
  Clock,
  X,
  CheckCircle,
  Loader2,
  TrendingUp,
  Package,
  Truck,
  Home as HomeIcon,
  Calendar,
  DollarSign,
  Printer,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  special_notes: string | null
  subtotal: number
  gst_amount: number
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
  confirmed_at?: string
  prepared_at?: string
  delivered_at?: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: string
  item_name: string
  quantity: number
  price: number
  is_veg: boolean
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/orders')
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.orders || [])
      } else {
        setError(result.error || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone.includes(searchQuery)
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, order_status: newStatus } : o
        ))
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: newStatus })
        }
        
        // Show success notification
        alert('Order status updated successfully!')
      } else {
        alert(result.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const printKitchenOrder = (order: Order) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kitchen Order - ${order.order_number}</title>
        <style>
          @media print {
            @page { margin: 10mm; }
          }
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
          }
          .header h2 {
            margin: 0;
            font-size: 18px;
          }
          .section {
            margin: 15px 0;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
          }
          .items {
            margin: 10px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-name {
            font-weight: bold;
          }
          .item-notes {
            font-style: italic;
            color: #666;
            font-size: 12px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>THE LIVING ROOM CAFE</h1>
          <h2>KITCHEN ORDER TICKET</h2>
        </div>

        <div class="section">
          <div class="section-title">ORDER: ${order.order_number}</div>
          <div>Time: ${new Date(order.created_at).toLocaleString('en-IN')}</div>
          <div>Type: Delivery</div>
        </div>

        <div class="section">
          <div class="section-title">CUSTOMER</div>
          <div>${order.customer_name}</div>
          <div>${order.customer_phone}</div>
        </div>

        <div class="section">
          <div class="section-title">ITEMS TO PREPARE</div>
          <div class="items">
            ${order.order_items.map(item => `
              <div class="item">
                <div>
                  <div class="item-name">${item.is_veg ? '🟢' : '🔴'} ${item.quantity}x ${item.item_name}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${order.special_notes ? `
          <div class="section">
            <div class="section-title">SPECIAL INSTRUCTIONS</div>
            <div style="font-weight: bold; color: red;">${order.special_notes}</div>
          </div>
        ` : ''}

        <div class="footer">
          <div style="margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px;">
            ⏰ Priority: NORMAL | Status: ${order.order_status.toUpperCase()}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
  }

  const printBill = (order: Order) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${order.order_number}</title>
        <style>
          @media print {
            @page { margin: 10mm; }
          }
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
          }
          .section {
            margin: 15px 0;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 5px;
            text-align: left;
            border-bottom: 1px dotted #ccc;
          }
          th {
            font-weight: bold;
          }
          .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #000;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            border-top: 2px dashed #000;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>THE LIVING ROOM CAFE</h1>
          <p>Restaurant • Cafe • Caterers</p>
          <p>Raipur, Chhattisgarh</p>
        </div>

        <div class="section">
          <div><strong>Invoice:</strong> ${order.order_number}</div>
          <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</div>
          <div style="margin-top: 10px;">
            <strong>Customer:</strong> ${order.customer_name}<br>
            <strong>Phone:</strong> ${order.customer_phone}<br>
            <strong>Address:</strong> ${order.customer_address}
          </div>
        </div>

        <div class="section">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items.map(item => `
                <tr>
                  <td>${item.item_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="3" style="text-align: right;">Subtotal:</td>
                <td>₹${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">GST (5%):</td>
                <td>₹${order.gst_amount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">TOTAL:</td>
                <td>₹${order.total_amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div><strong>Payment Method:</strong> ${order.payment_method}</div>
          <div><strong>Payment Status:</strong> ${order.payment_status}</div>
        </div>

        <div class="footer">
          <p><strong>Thank you for your order!</strong></p>
          <p>Visit us at thelivingroomcafe.in</p>
          <p style="margin-top: 10px; font-size: 12px;">GST applicable as per govt. regulations</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-orange-100 text-orange-700 border-orange-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      preparing: 'bg-purple-100 text-purple-700 border-purple-300',
      out_for_delivery: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons: any = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      out_for_delivery: Truck,
      delivered: HomeIcon
    }
    const Icon = icons[status] || Clock
    return <Icon size={16} />
  }

  const statuses = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.order_status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.order_status === 'confirmed').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.order_status === 'preparing').length },
    { value: 'out_for_delivery', label: 'Out for Delivery', count: orders.filter(o => o.order_status === 'out_for_delivery').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.order_status === 'delivered').length }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 size={50} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Package size={36} className="text-green-600" />
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <AlertCircle size={20} />
          <span className="font-bold">{error}</span>
        </motion.div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-black text-blue-700">{orders.length}</p>
            </div>
            <Package size={32} className="text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-black text-orange-700">
                {orders.filter(o => o.order_status === 'pending').length}
              </p>
            </div>
            <Clock size={32} className="text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-black text-green-700">
                {orders.filter(o => o.order_status === 'delivered').length}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-purple-700">
                ₹{orders.filter(o => o.order_status === 'delivered').reduce((sum, o) => sum + parseFloat(o.total_amount.toString()), 0).toFixed(0)}
              </p>
            </div>
            <DollarSign size={32} className="text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number, name, or phone..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none font-medium"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                statusFilter === status.value
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900">{order.order_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.order_items?.length || 0} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-green-700">₹{order.total_amount}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.payment_method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 inline-flex items-center gap-1 ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        {order.order_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-200 transition flex items-center gap-1"
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
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new order</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl my-8"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-1">Order Details</h2>
                  <p className="text-white/90">{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                  <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Phone size={20} className="text-green-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${selectedOrder.customer_phone}`} className="font-bold text-green-700 hover:underline">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-bold text-gray-900 text-right max-w-xs">{selectedOrder.customer_address}</span>
                    </div>
                    {selectedOrder.special_notes && (
                      <div className="pt-3 border-t border-gray-300">
                        <p className="text-gray-600 text-sm mb-1">Special Notes:</p>
                        <p className="font-bold text-gray-900 bg-yellow-50 p-2 rounded">{selectedOrder.special_notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                  <h3 className="font-black text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.item_name}</p>
                          <p className="text-sm text-gray-600">
                            {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'} • Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-200">
                  <h3 className="font-black text-gray-900 mb-4">Bill Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-bold">₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>GST (5%):</span>
                      <span className="font-bold">₹{selectedOrder.gst_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-3 border-t-2 border-green-300">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-700">₹{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-green-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-bold text-gray-900 capitalize">{selectedOrder.payment_method}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-bold capitalize ${selectedOrder.payment_status === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>
                          {selectedOrder.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
                  <h3 className="font-black text-gray-900 mb-4">Update Order Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={updating || selectedOrder.order_status === status}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
                          selectedOrder.order_status === status
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                        } disabled:opacity-50`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  {updating && (
                    <div className="mt-3 text-center text-sm text-gray-600">
                      <Loader2 size={16} className="animate-spin inline mr-2" />
                      Updating status...
                    </div>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                  <h3 className="font-black text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-gray-600">Placed:</span>
                      <span className="font-bold text-gray-900">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.confirmed_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span className="text-gray-600">Confirmed:</span>
                        <span className="font-bold text-gray-900">{new Date(selectedOrder.confirmed_at).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedOrder.prepared_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        <span className="text-gray-600">Prepared:</span>
                        <span className="font-bold text-gray-900">{new Date(selectedOrder.prepared_at).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedOrder.delivered_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <span className="text-gray-600">Delivered:</span>
                        <span className="font-bold text-gray-900">{new Date(selectedOrder.delivered_at).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Print Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => printKitchenOrder(selectedOrder)}
                    className="bg-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                  >
                    <Printer size={20} />
                    Print Kitchen Order
                  </button>
                  <button
                    onClick={() => printBill(selectedOrder)}
                    className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Printer size={20} />
                    Print Customer Bill
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
