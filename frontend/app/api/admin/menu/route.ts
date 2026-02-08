import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch all menu items (for admin)
export async function GET() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .order('category_id', { ascending: true })

    return NextResponse.json({
      success: true,
      categories: categories || [],
      menuItems: menuItems || []
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new menu item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, is_veg, is_available } = body

    // Validation
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert([
        {
          name,
          description: description || '',
          price: parseFloat(price),
          category_id: parseInt(category_id),
          is_veg: is_veg !== false, // default true
          is_available: is_available !== false // default true
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Menu item created successfully',
      item: data
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update menu item
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description, price, category_id, is_veg, is_available } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (category_id !== undefined) updateData.category_id = parseInt(category_id)
    if (is_veg !== undefined) updateData.is_veg = is_veg
    if (is_available !== undefined) updateData.is_available = is_available

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully',
      item: data
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete menu item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
