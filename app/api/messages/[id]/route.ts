import { NextRequest, NextResponse } from 'next/server';
import { markMessageRead, deleteMessage } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('admin_token='))
    ?.split('=')[1];
  return token ? verifyToken(token) !== null : false;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = await markMessageRead(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = await deleteMessage(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
