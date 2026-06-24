import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('admin_token='))
    ?.split('=')[1];
  return token ? verifyToken(token) !== null : false;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
