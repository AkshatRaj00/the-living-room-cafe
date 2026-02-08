'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ShoppingCart, Star, Filter, Heart, Clock, Flame, ChefHat, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  is_veg: boolean
  image_url?: string
  rating?: number
  prep_time?: string
  is_bestseller?: boolean
  is_new?: boolean
  spice_level?: number
  calories?: number
  is_customizable?: boolean
}

interface Category {
  id: number
  name: string
  icon?: string
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default')
  const [cartOpen, setCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  const { cart, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await fetch('/api/menu')
        const data = await response.json()
        setCategories(data.categories || [])
        setMenuItems(data.menuItems || [])
      } catch (error) {
        console.error('Error fetching menu:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 2000)
  }

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const getFoodEmoji = (itemName: string) => {
    const name = itemName.toLowerCase()
    if (name.includes('fries')) return '🍟'
    if (name.includes('bread')) return '🥖'
    if (name.includes('soup')) return '🥣'
    if (name.includes('salad')) return '🥗'
    if (name.includes('momos')) return '🥟'
    if (name.includes('paneer')) return '🧀'
    if (name.includes('chicken')) return '🍗'
    if (name.includes('burger')) return '🍔'
    if (name.includes('pizza')) return '🍕'
    if (name.includes('pasta')) return '🍝'
    if (name.includes('biryani') || name.includes('rice')) return '🍚'
    if (name.includes('coffee')) return '☕'
    if (name.includes('tea')) return '🍵'
    return '🍽️'
  }

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = 
        filterType === 'all' ||
        (filterType === 'veg' && item.is_veg) ||
        (filterType === 'non-veg' && !item.is_veg)
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
      
      return matchesSearch && matchesFilter && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        default: return 0
      }
    })

  const handleAddToCart = (item: MenuItem, event: React.MouseEvent) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      is_veg: item.is_veg
    })
    showToast(`${item.name} added!`)
  }

  const maxPrice = Math.max(...menuItems.map(item => item.price), 1000)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toastMessage}
        </div>
      )}

      {/* Floating Cart */}
      <button 
        onClick={() => setCartOpen(!cartOpen)}
        className="fixed bottom-6 right-6 z-40 bg-green-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      >
        <ShoppingCart size={24} />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Mobile Sticky Cart Bar */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-green-500 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">{getTotalItems()} Items</p>
              <p className="text-lg font-bold text-gray-900">₹{Math.round(getTotalPrice() * 1.05)}</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              View Cart
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          
          <div className="fixed right-0 top-0 w-full max-w-md bg-white h-full shadow-2xl z-50 flex flex-col">
            <div className="p-4 border-b bg-green-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Your Cart
                  </h2>
                  <p className="text-sm opacity-90">{getTotalItems()} items • ₹{getTotalPrice()}</p>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-lg font-bold text-gray-900">Cart is Empty</h3>
                  <p className="text-gray-600">Add some items!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <p className="text-green-700 font-bold text-lg">₹{item.price}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          item.is_veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.is_veg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-green-600 text-white rounded text-sm font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            removeFromCart(item.id)
                            showToast('Item removed')
                          }}
                          className="text-red-600 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-bold">₹{Math.round(getTotalPrice() * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-700">₹{Math.round(getTotalPrice() * 1.05)}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Hero */}
      <section className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Explore Our Menu</h1>
          <p className="text-lg flex items-center justify-center gap-2">
            <ChefHat size={20} />
            Fresh, Delicious & Made with Love
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="bg-white shadow sticky top-0 z-30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  filterType === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('veg')}
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  filterType === 'veg' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                🟢 Veg
              </button>
              <button
                onClick={() => setFilterType('non-veg')}
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  filterType === 'non-veg' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                🔴 Non-Veg
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-lg font-bold bg-gray-200 text-gray-700 flex items-center gap-2 text-sm"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-3 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {isLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-700">
                Showing <span className="text-green-600">{filteredItems.length}</span> items
              </p>
            </div>
            
            {/* Category Sections */}
            <div className="space-y-8">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const categoryItems = filteredItems.filter(item => item.category_id === category.id)
                  
                  if (categoryItems.length === 0) return null
                  
                  return (
                    <div key={category.id}>
                      {/* Category Header */}
                      <div className="mb-4 flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                          <span className="text-3xl">{category.icon}</span>
                          {category.name}
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {categoryItems.length}
                          </span>
                        </h2>
                        <div className="flex-1 h-0.5 bg-gray-200"></div>
                      </div>

                      {/* Items Grid */}
                      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200"
                          >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="text-6xl">{getFoodEmoji(item.name)}</div>
                              )}
                              
                              {/* Badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  item.is_veg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {item.is_veg ? '🟢' : '🔴'}
                                </span>
                                {item.is_bestseller && (
                                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                    Hot
                                  </span>
                                )}
                              </div>

                              {/* Favorite */}
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
                              >
                                <Heart 
                                  size={16} 
                                  className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                {item.name}
                              </h3>
                              
                              {item.description && (
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              {/* Meta */}
                              <div className="flex items-center gap-2 mb-2 text-xs">
                                {item.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    {item.rating}
                                  </div>
                                )}
                                {item.prep_time && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Clock size={12} />
                                    {item.prep_time}
                                  </div>
                                )}
                              </div>

                              {/* Price & Add */}
                              <div className="flex justify-between items-center pt-2 border-t">
                                <div className="text-xl font-bold text-green-700">
                                  ₹{item.price}
                                </div>
                                <button
                                  onClick={(e) => handleAddToCart(item, e)}
                                  className="bg-green-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-green-700"
                                >
                                  Add +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                // Fallback
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition border"
                    >
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="text-6xl">{getFoodEmoji(item.name)}</div>
                        )}
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold ${
                          item.is_veg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {item.is_veg ? '🟢' : '🔴'}
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="text-xl font-bold text-green-700">₹{item.price}</div>
                          <button
                            onClick={(e) => handleAddToCart(item, e)}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm"
                          >
                            Add +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterType('all')
                setPriceRange([0, maxPrice])
                setSortBy('default')
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}