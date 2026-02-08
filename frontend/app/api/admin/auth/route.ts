import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password required' },
        { status: 400 }
      )
    }

    // Check password
    if (password === process.env.ADMIN_PASSWORD) {
      // Generate simple session token
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Verify token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      )
    }

    // Simple token validation (just check if it exists and is not too old)
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [user, timestamp] = decoded.split(':')
      
      if (user === 'admin') {
        // Token valid for 24 hours
        const tokenAge = Date.now() - parseInt(timestamp)
        if (tokenAge < 24 * 60 * 60 * 1000) {
          return NextResponse.json({ success: true, valid: true })
        }
      }
    } catch (e) {
      // Invalid token format
    }

    return NextResponse.json(
      { success: false, valid: false },
      { status: 401 }
    )

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
