'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2
} from 'lucide-react'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  is_veg: boolean
  is_available: boolean
}

interface Category {
  id: number
  name: string
  icon?: string
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_veg: true,
    is_available: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  // Filter items
  useEffect(() => {
    let filtered = menuItems

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category_id === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [menuItems, selectedCategory, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/menu')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.categories || [])
        setMenuItems(result.menuItems || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category_id: item.category_id.toString(),
        is_veg: item.is_veg,
        is_available: item.is_available
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories[0]?.id.toString() || '',
        is_veg: true,
        is_available: true
      })
    }
    setShowModal(true)
    setError('')
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const url = '/api/admin/menu'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem
        ? { ...formData, id: editingItem.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        closeModal()
        fetchData()
      } else {
        setError(result.error || 'Failed to save item')
      }
    } catch (error) {
      setError('Something went wrong!')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/menu?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        fetchData()
      } else {
        alert(result.error || 'Failed to delete item')
      }
    } catch (error) {
      alert('Something went wrong!')
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          is_available: !item.is_available
        })
      })

      const result = await response.json()

      if (result.success) {
        fetchData()
      }
    } catch (error) {
      alert('Failed to update availability')
    }
  }

  const getFoodEmoji = (itemName: string) => {
    const name = itemName.toLowerCase()
    if (name.includes('coffee')) return '☕'
    if (name.includes('tea')) return '🍵'
    if (name.includes('pizza')) return '🍕'
    if (name.includes('burger')) return '🍔'
    if (name.includes('sandwich')) return '🥪'
    if (name.includes('pasta')) return '🍝'
    if (name.includes('noodles') || name.includes('maggi')) return '🍜'
    if (name.includes('rice') || name.includes('biryani')) return '🍚'
    if (name.includes('chicken')) return '🍗'
    if (name.includes('paneer')) return '🧀'
    if (name.includes('cake')) return '🍰'
    if (name.includes('ice cream')) return '🍨'
    return '🍽️'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 flex gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none font-medium"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Item
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Items</p>
          <p className="text-3xl font-black text-gray-900">{menuItems.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Available</p>
          <p className="text-3xl font-black text-green-600">
            {menuItems.filter(i => i.is_available).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-red-200">
          <p className="text-sm text-gray-600 mb-1">Unavailable</p>
          <p className="text-3xl font-black text-red-600">
            {menuItems.filter(i => !i.is_available).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Categories</p>
          <p className="text-3xl font-black text-blue-600">{categories.length}</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-300 transition-all overflow-hidden"
            >
              {/* Item Header */}
              <div className={`p-6 ${item.is_veg ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{getFoodEmoji(item.name)}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.is_veg
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {item.is_veg ? '🟢 VEG' : '🔴 NON-VEG'}
                    </span>
                  </div>
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-1">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                )}
              </div>

              {/* Item Footer */}
              <div className="p-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-black text-green-700">
                    ₹{item.price}
                  </div>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      item.is_available
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.is_available ? (
                      <span className="flex items-center gap-1">
                        <Eye size={16} /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <EyeOff size={16} /> Hidden
                      </span>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-bold hover:bg-blue-200 transition flex items-center justify-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold hover:bg-red-200 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new item</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-black">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none"
                    placeholder="e.g., Paneer Tikka"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none resize-none"
                    placeholder="Delicious description..."
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_veg}
                      onChange={(e) => setFormData({ ...formData, is_veg: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-bold text-gray-700">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-bold text-gray-700">Available</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
