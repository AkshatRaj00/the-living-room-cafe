'use client'

import React, { useState } from 'react'
import { Search, Calendar, Filter, X } from 'lucide-react'

interface OrderFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, status, dateFilter })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ search, status: value, dateFilter })
  }

  const handleDateChange = (value: string) => {
    setDateFilter(value)
    onFilterChange({ search, status, dateFilter: value })
  }

  const handleReset = () => {
    setSearch('')
    setStatus('all')
    setDateFilter('all')
    onFilterChange({ search: '', status: 'all', dateFilter: 'all' })
  }

  const hasActiveFilters = search !== '' || status !== 'all' || dateFilter !== 'all'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by order number, customer name, or phone..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 outline-none text-gray-900 font-medium"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none font-medium text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-600" />
          <select
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none font-medium text-gray-900 bg-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            <X size={18} />
            Reset
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleDateChange('today')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            dateFilter === 'today'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Today's Orders
        </button>
        <button
          onClick={() => handleStatusChange('pending')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            status === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setStatus('all')
            onFilterChange({ 
              search, 
              status: 'all', 
              dateFilter,
              activeOnly: true 
            })
          }}
          className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition"
        >
          Active Orders
        </button>
      </div>
    </div>
  )
}
