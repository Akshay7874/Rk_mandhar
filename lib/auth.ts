import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'rk-mandhar-secret-key-2024-secure';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rajat';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || 'rajat123',
  10
);

export function verifyCredentials(email: string, password: string): boolean {
  if (email !== ADMIN_EMAIL) return false;
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string };
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete('admin_token');
}

export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('admin_token')?.value;
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  return verifyToken(token) !== null;
}
