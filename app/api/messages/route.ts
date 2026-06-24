import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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

  const messages = await getMessages();
  return NextResponse.json(messages);
}
