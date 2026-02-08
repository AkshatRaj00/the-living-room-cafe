import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const CAFE_EMAIL = 'thelivingroomcafe30@gmail.com'
const CAFE_PHONE = '+919285555002'

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    if (!formData.name || !formData.phone || !formData.eventDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const inquiryNumber = `CAT${timestamp}${random}`

    console.log('Generated Inquiry Number:', inquiryNumber)

    const { data: dbData, error: dbError } = await supabase
      .from('catering_inquiries')
      .insert([
        {
          inquiry_number: inquiryNumber,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          event_type: formData.eventType,
          event_date: formData.eventDate,
          guest_count: formData.guestCount ? parseInt(formData.guestCount) : null,
          venue: formData.venue || null,
          budget: formData.budget || null,
          requirements: formData.requirements || null,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database Error:', dbError)
      throw new Error('Failed to save to database')
    }

    console.log('Database saved:', dbData.id)

    let emailSent = false
    try {
      const eventDate = new Date(formData.eventDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })

      const emailResult = await resend.emails.send({
        from: 'The Living Room Cafe <onboarding@resend.dev>',
        to: CAFE_EMAIL,
        subject: `New Catering Inquiry - ${inquiryNumber}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .inquiry-number { background: #10b981; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px; border-radius: 8px; }
    .content { padding: 20px; }
    .section { background: #f9fafb; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .section h2 { margin: 0 0 15px 0; color: #059669; font-size: 18px; }
    .row { display: flex; margin-bottom: 10px; }
    .label { font-weight: bold; color: #059669; min-width: 140px; }
    .value { color: #333; }
    .buttons { text-align: center; padding: 20px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: bold; }
    .button:hover { background: #059669; }
    .footer { background: #1f2937; color: white; padding: 20px; text-align: center; }
    .footer p { margin: 5px 0; }
    .status-badge { display: inline-block; background: #fbbf24; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Catering Inquiry!</h1>
      <p>You have received a new event booking request</p>
    </div>
    
    <div class="inquiry-number">
      Inquiry #: ${inquiryNumber}
    </div>
    
    <div class="content">
      <div class="section">
        <h2>Customer Details</h2>
        <div class="row">
          <div class="label">Name:</div>
          <div class="value">${formData.name}</div>
        </div>
        <div class="row">
          <div class="label">Phone:</div>
          <div class="value">${formData.phone}</div>
        </div>
        <div class="row">
          <div class="label">Email:</div>
          <div class="value">${formData.email || 'Not provided'}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Event Details</h2>
        <div class="row">
          <div class="label">Event Type:</div>
          <div class="value">${formData.eventType.toUpperCase()}</div>
        </div>
        <div class="row">
          <div class="label">Event Date:</div>
          <div class="value">${eventDate}</div>
        </div>
        <div class="row">
          <div class="label">Expected Guests:</div>
          <div class="value">${formData.guestCount || 'Not specified'}</div>
        </div>
        <div class="row">
          <div class="label">Venue:</div>
          <div class="value">${formData.venue || 'To be decided'}</div>
        </div>
        <div class="row">
          <div class="label">Budget:</div>
          <div class="value">${formData.budget || 'Not specified'}</div>
        </div>
      </div>
      
      ${formData.requirements ? `
      <div class="section">
        <h2>Special Requirements</h2>
        <p style="margin: 0;">${formData.requirements}</p>
      </div>
      ` : ''}
      
      <div class="buttons">
        <a href="tel:${formData.phone}" class="button">Call Customer</a>
        <a href="https://wa.me/91${formData.phone}" class="button" target="_blank">WhatsApp Customer</a>
      </div>
    </div>
    
    <div class="footer">
      <p><span class="status-badge">PENDING</span></p>
      <p style="margin-top: 15px;">Received at: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p style="font-size: 12px; opacity: 0.7; margin-top: 10px;">The Living Room Cafe - Premium Catering Services</p>
    </div>
  </div>
</body>
</html>
        `
      })

      console.log('Email sent successfully! ID:', emailResult.data?.id)
      emailSent = true

    } catch (emailError: any) {
      console.error('Email Error:', emailError.message)
    }

    const whatsappMessage = `New Catering Inquiry - The Living Room Cafe

Inquiry Number: ${inquiryNumber}

Customer Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}

Event Details:
Type: ${formData.eventType.toUpperCase()}
Date: ${new Date(formData.eventDate).toLocaleDateString('en-IN')}
Guests: ${formData.guestCount || 'Not specified'}
Venue: ${formData.venue || 'To be decided'}
Budget: ${formData.budget || 'Not specified'}

Special Requirements:
${formData.requirements || 'None'}

---
This inquiry was submitted via website on ${new Date().toLocaleString('en-IN')}
Please contact the customer as soon as possible.`

    const whatsappUrl = `https://wa.me/${CAFE_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

    return NextResponse.json({
      success: true,
      inquiryNumber,
      data: dbData,
      whatsappUrl,
      emailSent
    })

  } catch (error: any) {
    console.error('Server Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('catering_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
