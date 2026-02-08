import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const CAFE_EMAIL = 'thelivingroomcafe30@gmail.com'
const CAFE_PHONE = '919285555002'

export async function POST(request: Request) {
  try {
    const { customerDetails, cartItems, amounts, paymentMethod, transactionId } = await request.json()

    // Validation
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}`
    console.log('📋 Order Number:', orderNumber)

    // Save order to database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        special_notes: customerDetails.notes || null,
        subtotal: amounts.subtotal,
        gst_amount: amounts.gst,
        total_amount: amounts.total,
        payment_method: paymentMethod || 'Cash on Delivery',
        payment_status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
        order_status: 'pending',
        transaction_id: transactionId || null
      }])
      .select()
      .single()

    if (orderError) {
      console.error('❌ Order Error:', orderError)
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      )
    }

    console.log('✅ Order saved:', orderData.id)

    // Save order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderData.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('⚠️ Items Error:', itemsError)
    } else {
      console.log('✅ Items saved')
    }

    // Send email
    let emailSent = false
    try {
      await resend.emails.send({
        from: 'The Living Room Cafe <onboarding@resend.dev>',
        to: CAFE_EMAIL,
        subject: `🍽️ New Order - ${orderNumber}`,
        html: generateEmailHTML(orderNumber, customerDetails, cartItems, amounts, paymentMethod, transactionId)
      })
      emailSent = true
      console.log('✅ Email sent')
    } catch (emailError: any) {
      console.error('⚠️ Email failed:', emailError.message)
    }

    // WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(orderNumber, customerDetails, cartItems, amounts, paymentMethod, transactionId)
    const whatsappUrl = `https://wa.me/${CAFE_PHONE}?text=${encodeURIComponent(whatsappMessage)}`

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderData.id,
      whatsappUrl,
      emailSent
    })

  } catch (error: any) {
    console.error('❌ Server Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET order
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number required' },
        { status: 400 }
      )
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items (*)')
      .eq('order_number', orderNumber)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// WhatsApp message - ULTRA PROFESSIONAL + FIXED
function generateWhatsAppMessage(
  orderNumber: string, 
  customer: any, 
  items: any[], 
  amounts: any, 
  paymentMethod: string, 
  transactionId?: string
) {
  // ✅ FIX: Check both lowercase and exact match
  const isCOD = paymentMethod?.toLowerCase() === 'cod' || paymentMethod === 'Cash on Delivery'
  const paymentIcon = isCOD ? '💵' : '💳'
  const paymentText = isCOD ? 'Cash on Delivery' : 'Online Payment'

  // Group same items
  const groupedItems = items.reduce((acc: any[], item: any) => {
    const existing = acc.find(i => i.name === item.name && i.price === item.price)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [])

  return `
╔══════════════════════════╗
║  🍽️ *THE LIVING ROOM CAFE*  ║
║     *NEW ORDER ALERT*     ║
╚══════════════════════════╝

📋 *ORDER NO:* #${orderNumber}

┌─────────────────────────┐
│  👤 *CUSTOMER INFO*
└─────────────────────────┘
  • Name: *${customer.name}*
  • Phone: ${customer.phone}
  • Address: ${customer.address}
${customer.notes ? `  • Note: _${customer.notes}_` : ''}

┌─────────────────────────┐
│  🛒 *ORDER DETAILS*
└─────────────────────────┘
${groupedItems.map((item, index) => 
  `  ${index + 1}. *${item.name}*\n     ${item.quantity} × ₹${item.price} = *₹${item.price * item.quantity}*`
).join('\n\n')}

┌─────────────────────────┐
│  💰 *PAYMENT BREAKDOWN*
└─────────────────────────┘
  Subtotal    :  ₹${amounts.subtotal}
  GST (5%)    :  ₹${amounts.gst}
  ─────────────────────────
  *TOTAL      :  ₹${amounts.total}*

┌─────────────────────────┐
│  💳 *PAYMENT INFO*
└─────────────────────────┘
  Method: ${paymentIcon} *${paymentText}*
${transactionId ? `  Txn ID: \`${transactionId}\`` : ''}

┌─────────────────────────┐
│  🕐 *ORDER TIME*
└─────────────────────────┘
  ${new Date().toLocaleString('en-IN', { 
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata' 
  })}

━━━━━━━━━━━━━━━━━━━━━━━
🔗 *Track Order:*
${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-order?orderNumber=${orderNumber}
━━━━━━━━━━━━━━━━━━━━━━━

✅ *Please confirm this order!*
`.trim()
}

// Email HTML - FIXED
function generateEmailHTML(
  orderNumber: string, 
  customer: any, 
  items: any[], 
  amounts: any, 
  paymentMethod: string,
  transactionId?: string
) {
  // ✅ FIX: Check both lowercase and exact match
  const isCOD = paymentMethod?.toLowerCase() === 'cod' || paymentMethod === 'Cash on Delivery'
  const paymentIcon = isCOD ? '💵' : '💳'
  const paymentText = isCOD ? 'Cash on Delivery' : 'Online Payment'
  
  // Group same items
  const groupedItems = items.reduce((acc: any[], item: any) => {
    const existing = acc.find(i => i.name === item.name && i.price === item.price)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [])
  
  const itemsHTML = groupedItems.map((item, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${i + 1}. ${item.name}</strong><br>
        <span style="color: #6b7280;">Qty: ${item.quantity} × ₹${item.price}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
        ₹${item.quantity * item.price}
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
    .order-number { background: #10b981; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px; border-radius: 8px; }
    .section { padding: 20px; margin: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981; }
    .section h2 { margin: 0 0 15px 0; color: #059669; }
    table { width: 100%; border-collapse: collapse; }
    .bill-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .bill-total { border-top: 2px solid #10b981; padding-top: 12px; margin-top: 12px; font-size: 20px; font-weight: bold; }
    .footer { background: #1f2937; color: white; padding: 20px; text-align: center; }
    .payment-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍽️ New Order!</h1>
    </div>
    
    <div class="order-number">Order #${orderNumber}</div>
    
    <div class="section">
      <h2>👤 Customer</h2>
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Address:</strong> ${customer.address}</p>
      ${customer.notes ? `<p><strong>Notes:</strong> ${customer.notes}</p>` : ''}
    </div>
    
    <div class="section">
      <h2>🛒 Items</h2>
      <table>${itemsHTML}</table>
    </div>
    
    <div class="section">
      <h2>💰 Bill</h2>
      <div class="bill-row"><span>Subtotal:</span><strong>₹${amounts.subtotal}</strong></div>
      <div class="bill-row"><span>GST (5%):</span><strong>₹${amounts.gst}</strong></div>
      <div class="bill-row bill-total"><span>Total:</span><span style="color: #059669;">₹${amounts.total}</span></div>
    </div>
    
    <div class="footer">
      <div class="payment-badge">${paymentIcon} ${paymentText}</div>
      ${transactionId ? `<p style="font-size: 14px; margin: 10px 0;">Transaction ID: ${transactionId}</p>` : ''}
      <p>⏰ ${new Date().toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata' 
      })}</p>
    </div>
  </div>
</body>
</html>
  `
}
