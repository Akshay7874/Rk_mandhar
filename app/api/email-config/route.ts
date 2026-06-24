import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getEmailConfig, updateEmailConfig } from '@/lib/email';

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('admin_token='))
    ?.split('=')[1];
  return token ? verifyToken(token) !== null : false;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = getEmailConfig();
  return NextResponse.json({
    ...config,
    pass: config.pass ? '********' : '',
  });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    updateEmailConfig({
      host: body.host,
      port: Number(body.port),
      user: body.user,
      pass: body.pass,
      from: body.from,
      to: body.to,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
