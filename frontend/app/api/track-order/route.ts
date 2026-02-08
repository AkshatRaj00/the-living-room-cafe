import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const phone = searchParams.get('phone')

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { success: false, error: 'Order number and phone required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber.toUpperCase())
      .eq('customer_phone', phone)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Order not found. Please check your details.' },
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
