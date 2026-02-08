import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Get all orders
    const { data: allOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', today.toISOString())

    // Get menu items
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')

    // Calculate stats
    const totalOrders = allOrders?.length || 0
    const pendingOrders = allOrders?.filter(o => o.order_status === 'pending').length || 0
    const completedOrders = allOrders?.filter(o => o.order_status === 'delivered').length || 0
    const totalRevenue = allOrders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0
    const todayOrdersCount = todayOrders?.length || 0
    const totalMenuItems = menuItems?.length || 0
    const availableItems = menuItems?.filter(i => i.is_available).length || 0

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: Math.round(totalRevenue),
        todayOrders: todayOrdersCount,
        totalMenuItems,
        availableItems,
        recentOrders: allOrders?.slice(0, 5) || []
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
