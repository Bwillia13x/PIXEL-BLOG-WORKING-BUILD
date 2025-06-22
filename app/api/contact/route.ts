import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  subject: z.string().optional(),
})

function getRateLimitKey(ip: string): string {
  return `contact:${ip}`
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const limit = 5 // 5 submissions per hour
  const windowMs = 60 * 60 * 1000 // 1 hour
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs }
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  current.count++
  rateLimitStore.set(key, current)
  return { allowed: true, remaining: limit - current.count, resetTime: current.resetTime }
}

async function sendEmail(data: z.infer<typeof contactSchema>) {
  // In a real implementation, you would use a service like:
  // - SendGrid
  // - Resend
  // - Nodemailer with SMTP
  // - AWS SES
  
  // For now, we'll simulate sending and log the data
  console.log('📧 Contact form submission:', {
    name: data.name,
    email: data.email,
    subject: data.subject || `Message from ${data.name}`,
    message: data.message,
    timestamp: new Date().toISOString()
  })
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true, messageId: `msg_${Date.now()}` }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               request.ip || 
               '127.0.0.1'
    
    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    // Send email
    const result = await sendEmail(validatedData)
    
    // Log successful submission for analytics
    console.log('✅ Contact form submission successful:', {
      ip,
      timestamp: new Date().toISOString(),
      messageId: result.messageId
    })
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Your message has been sent successfully!',
        messageId: result.messageId
      },
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        }
      }
    )
    
  } catch (error) {
    console.error('❌ Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
} 