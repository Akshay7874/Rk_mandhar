import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, productInterest, message } = body;
    const email = body.email || 'no-email-provided@inquiry';

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    const newMessage = createMessage({
      name,
      email,
      phone,
      productInterest: productInterest || 'General Inquiry',
      message,
    });

    const emailResult = await sendNotificationEmail({
      name,
      email,
      phone,
      productInterest: productInterest || 'General Inquiry',
      message,
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
      emailSent: emailResult.success,
      emailError: emailResult.error,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
