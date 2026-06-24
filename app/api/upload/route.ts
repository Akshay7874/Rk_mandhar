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

function useCloudinary(): boolean {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return !!(name && key && secret && name !== 'your-cloud-name');
}

async function uploadToFilesystem(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${filename.split('.').pop()}`;
  await writeFile(path.join(uploadDir, safeName), buffer);
  return `/uploads/${safeName}`;
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const { v2: cloudinary } = await import('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'rk-mandhar', resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
  return result.secure_url;
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

    const url = useCloudinary()
      ? await uploadToCloudinary(buffer)
      : await uploadToFilesystem(buffer, file.name);

    return NextResponse.json({ url, filename: url.split('/').pop() });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
