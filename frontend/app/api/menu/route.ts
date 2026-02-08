import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    console.log('🔍 Fetching from Supabase...')
    
    // Fetch WITHOUT is_active filter (test purpose)
    const [catsRes, itemsRes] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*').order('name')
    ])

    console.log('📋 Categories:', catsRes.data?.length, catsRes.error)
    console.log('🍽️ Items:', itemsRes.data?.length, itemsRes.error)
    
    if (catsRes.error) console.error('Categories Error:', catsRes.error)
    if (itemsRes.error) console.error('Items Error:', itemsRes.error)

    return NextResponse.json({
      categories: catsRes.data || [],
      menuItems: itemsRes.data || []
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      categories: [], 
      menuItems: [],
      error: error.message 
    })
  }
}
