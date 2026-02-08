'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Address {
  id: string
  user_id: string
  label: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  is_default: boolean
  created_at: string
}

export default function MyAddressesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    label: 'Home',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    is_default: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchAddresses()
  }, [user, router])

  const fetchAddresses = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      console.log('Fetching addresses for user:', user.id)

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch error:', error)
        throw error
      }

      console.log('Addresses fetched:', data)
      setAddresses(data || [])
    } catch (error: any) {
      console.error('Error fetching addresses:', error)
      alert('Failed to load addresses: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!user?.id) {
        alert('Please login first')
        return
      }

      console.log('Saving address for user:', user.id)

      const addressData = {
        user_id: user.id,
        label: formData.label,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || null,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark || null,
        is_default: formData.is_default
      }

      console.log('Address data:', addressData)

      let result

      if (editingId) {
        result = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingId)
          .select()
          .single()
      } else {
        result = await supabase
          .from('addresses')
          .insert(addressData)
          .select()
          .single()
      }

      if (result.error) {
        console.error('Save error:', result.error)
        throw new Error(result.error.message)
      }

      console.log('Address saved:', result.data)
      alert('Address saved successfully!')
      
      await fetchAddresses()
      resetForm()
      setShowModal(false)
    } catch (error: any) {
      console.error('Error saving address:', error)
      alert('Failed to save address: ' + (error.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Address deleted!')
      await fetchAddresses()
    } catch (error: any) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      is_default: address.is_default
    })
    setEditingId(address.id)
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      label: 'Home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      is_default: false
    })
    setEditingId(null)
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please login first</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            + Add New Address
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No saved addresses yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-lg">{address.label}</span>
                      {address.is_default && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{address.address_line1}</p>
                    {address.address_line2 && (
                      <p className="text-gray-700">{address.address_line2}</p>
                    )}
                    {address.landmark && (
                      <p className="text-gray-600 text-sm">Landmark: {address.landmark}</p>
                    )}
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <select
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    placeholder="House/Flat no, Building name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Street, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Near..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_default" className="text-sm">
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
