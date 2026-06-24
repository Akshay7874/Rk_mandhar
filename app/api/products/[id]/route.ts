import { NextRequest, NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('admin_token='))
    ?.split('=')[1];
  return token ? verifyToken(token) !== null : false;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const product = await updateProduct(params.id, {
      nameEn: body.nameEn,
      nameHi: body.nameHi,
      descEn: body.descEn,
      descHi: body.descHi,
      category: body.category,
      price: Number(body.price),
      image: body.image || '',
      featured: Boolean(body.featured),
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteProduct(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
