import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch all orders with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Filters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const dateFilter = searchParams.get('date')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build query - JOIN with order_items
    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('order_status', status)
    }
    
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`)
    }
    
    // Date filters
    if (dateFilter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('created_at', today.toISOString())
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('created_at', yesterday.toISOString()).lt('created_at', today.toISOString())
    } else if (dateFilter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('created_at', weekAgo.toISOString())
    }
    
    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      orders: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customer_name,
      customer_phone,
      customer_address,
      special_notes,
      items,
      subtotal,
      gst_amount,
      total_amount,
      payment_method
    } = body

    // Validate
    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Generate order number
    const { data: orderNumber, error: orderNumError } = await supabase
      .rpc('generate_order_number')
    
    if (orderNumError) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate order number' },
        { status: 500 }
      )
    }
    
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        special_notes: special_notes || null,
        subtotal: parseFloat(subtotal),
        gst_amount: parseFloat(gst_amount),
        total_amount: parseFloat(total_amount),
        payment_method: payment_method || 'cod',
        payment_status: 'pending',
        order_status: 'pending'
      })
      .select()
      .single()
    
    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      )
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      item_name: item.name || item.item_name,
      quantity: parseInt(item.quantity),
      price: parseFloat(item.price),
      is_veg: item.is_veg !== undefined ? item.is_veg : true
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      order: {
        ...order,
        order_items: orderItems
      },
      message: 'Order placed successfully'
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()
    
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or status' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updateData: any = { order_status: status }
    const now = new Date().toISOString()
    
    if (status === 'confirmed') updateData.confirmed_at = now
    if (status === 'preparing') updateData.prepared_at = now
    if (status === 'delivered') {
      updateData.delivered_at = now
      updateData.payment_status = 'paid'
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
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
      message: `Order status updated to ${status}`
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        order_status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', orderId)
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
