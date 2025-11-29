import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// In-memory rate limiting map (IP -> last request timestamp)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 30 * 1000; // 30 seconds

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIP(req: NextRequest): string {
  // Try x-forwarded-for header first (Vercel proxy)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  // Fallback to request.ip if available
  return req.ip || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);
  
  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW_MS) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(ip, now);
  // Clean up old entries periodically (simple cleanup)
  if (rateLimitMap.size > 1000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }
  return true; // Not rate limited
}

function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

function validateInput(name: unknown, email: unknown, message: unknown): boolean {
  // Name validation: string, trimmed length between 1 and 80
  if (typeof name !== 'string') return false;
  const nameTrimmed = name.trim();
  if (nameTrimmed.length < 1 || nameTrimmed.length > 80) return false;
  
  // Email validation
  if (typeof email !== 'string') return false;
  if (!validateEmail(email)) return false;
  
  // Message validation: trimmed length between 10 and 2000
  if (typeof message !== 'string') return false;
  const messageTrimmed = message.trim();
  if (messageTrimmed.length < 10 || messageTrimmed.length > 2000) return false;
  
  return true;
}

async function sendEmail(
  name: string,
  email: string,
  message: string,
  referer: string | null,
  ip: string
): Promise<void> {
  const smtpHost = process.env.SMTP_HOST ?? 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT ?? '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  // Hard-fail if credentials are missing
  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials not configured');
    throw new Error('Email service not configured');
  }
  
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  
  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    `Message:`,
    message,
    '',
    `---`,
    referer ? `Referer: ${referer}` : null,
    `IP: ${ip}`,
  ]
    .filter(Boolean)
    .join('\n');
  
  await transporter.sendMail({
    from: '"Render Vault" <studio@render-vault.com>',
    to: 'studio@render-vault.com',
    replyTo: email,
    subject: `New contact from ${name}`,
    text: emailBody,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check rate limiting
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse JSON body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const { name, email, message, website } = body;
    
    // Honeypot check: if website field is filled, silently return success
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    // Validate input (generic error message to avoid leaking field names)
    if (!validateInput(name, email, message)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    // Get referer for email
    const referer = req.headers.get('referer') || req.headers.get('referrer') || null;
    
    // Send email
    try {
      await sendEmail(
        (name as string).trim(),
        (email as string).trim(),
        (message as string).trim(),
        referer,
        clientIP
      );
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      // Log generic error (no credentials or stack traces)
      console.error('Failed to send contact email');
      
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    // Catch-all for unexpected errors
    console.error('Unexpected error in contact route');
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Handle all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
