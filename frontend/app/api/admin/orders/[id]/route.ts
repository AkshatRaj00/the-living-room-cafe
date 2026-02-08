import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      order: data
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update order (status, notes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, admin_notes, cancel_reason } = body
    
    const updateData: any = {}
    
    // Update status and corresponding timestamp
    if (status) {
      updateData.status = status
      
      if (status === 'confirmed' && !updateData.confirmed_at) {
        updateData.confirmed_at = new Date().toISOString()
      } else if (status === 'preparing' && !updateData.prepared_at) {
        updateData.prepared_at = new Date().toISOString()
      } else if (status === 'delivered' && !updateData.delivered_at) {
        updateData.delivered_at = new Date().toISOString()
      } else if (status === 'cancelled' && !updateData.cancelled_at) {
        updateData.cancelled_at = new Date().toISOString()
      }
    }
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes
    }
    
    if (cancel_reason !== undefined) {
      updateData.cancel_reason = cancel_reason
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      order: data,
      message: 'Order updated successfully'
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete order (soft delete - mark as cancelled)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
