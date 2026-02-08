import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json()

    // Validate phone
    if (!phone || phone.length !== 10) {
      return NextResponse.json({
        success: false,
        error: 'Invalid phone number'
      }, { status: 400 })
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: 'Login successful'
      })
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        phone,
        name: name || null
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Account created successfully'
    })

  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Login failed'
    }, { status: 500 })
  }
}
