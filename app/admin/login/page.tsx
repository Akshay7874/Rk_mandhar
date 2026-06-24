'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi';

export default function AdminLogin() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        toast.success('Login successful');
        router.push('/admin/dashboard');
      } else {
        toast.error(t('admin.loginError'));
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl 
            flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-green-200">
            RK
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">RK Mandhar - Manage Your Store</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.email')}</label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 
                focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="admin@rajat" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin.password')}</label>
            <input type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 
                focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Enter password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl 
              font-semibold transition-all hover:shadow-lg hover:shadow-green-200 active:scale-[0.99]
              flex items-center justify-center gap-2">
            <HiLockClosed size={18} />
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : t('admin.signIn')}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          RK Mandhar Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}
