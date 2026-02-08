import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email } = await request.json()

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 })
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      user: data
    })

  } catch (error: any) {
    console.error('Update API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Update failed'
    }, { status: 500 })
  }
}
