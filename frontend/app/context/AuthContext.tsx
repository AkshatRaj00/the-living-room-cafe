'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

// ========== INTERFACES ==========
interface User {
  id: string
  phone: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

// ========== CREATE CONTEXT ==========
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ========== AUTH PROVIDER ==========
export function AuthProvider({ children }: { children: ReactNode }) {
  // ===== STATE =====
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ===== EFFECT: Check user on mount =====
  useEffect(() => {
    checkUser()
  }, [])

  // ===== FUNCTION: Check user session =====
  const checkUser = async () => {
    try {
      const userStr = localStorage.getItem('tempUser')
     
      if (userStr) {
        const userData = JSON.parse(userStr)
       
        // Verify user exists in database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .maybeSingle()

        if (error || !data) {
          console.log('User not found in DB, clearing localStorage')
          localStorage.removeItem('tempUser')
          setUser(null)
        } else {
          setUser({
            id: data.id,
            phone: data.phone,
            name: data.name || '',
            email: data.email || ''
          })
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
      localStorage.removeItem('tempUser')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // ===== FUNCTION: Refresh user data =====
  const refreshUser = async () => {
    if (!user?.id) return
   
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      const updatedUser = {
        id: data.id,
        phone: data.phone,
        name: data.name || '',
        email: data.email || ''
      }

      setUser(updatedUser)
      localStorage.setItem('tempUser', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  // ===== FUNCTION: Login =====
  const login = async (phone: string, name: string) => {
    try {
      console.log('🔐 Login attempt:', { phone, name })

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle()

      console.log('📊 Existing user check:', { existingUser, fetchError })

      if (existingUser) {
        // User exists - login
        const userData: User = {
          id: existingUser.id,
          phone: existingUser.phone,
          name: existingUser.name || name,
          email: existingUser.email || ''
        }

        // Update name if changed
        if (existingUser.name !== name && name.trim()) {
          await supabase
            .from('profiles')
            .update({ name: name.trim() })
            .eq('id', existingUser.id)
         
          userData.name = name.trim()
        }

        setUser(userData)
        localStorage.setItem('tempUser', JSON.stringify(userData))
        console.log('✅ Login successful (existing user)')
      } else {
        // New user - create profile
        console.log('🆕 Creating new user')

        const newUserId = self.crypto.randomUUID()
        const newProfile = {
          id: newUserId,
          phone: phone,
          name: name.trim(),
          email: ''
        }

        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        console.log('📝 Insert result:', { insertedData, insertError })

        if (insertError) throw insertError

        const userData: User = {
          id: newUserId,
          phone: phone,
          name: name.trim(),
          email: ''
        }

        setUser(userData)
        localStorage.setItem('tempUser', JSON.stringify(userData))
        console.log('✅ Login successful (new user)')
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  // ===== FUNCTION: Logout =====
  const logout = async () => {
    try {
      localStorage.removeItem('tempUser')
      setUser(null)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  // ===== FUNCTION: Update user =====
  const updateUser = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    try {
      console.log('📝 Updating user:', data)

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('tempUser', JSON.stringify(updatedUser))
     
      console.log('✅ User updated successfully')
    } catch (error) {
      console.error('❌ Update error:', error)
      throw error
    }
  }

  // ===== RETURN PROVIDER =====
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        updateUser, 
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ========== HOOK: useAuth ==========
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
