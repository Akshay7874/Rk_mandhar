'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import I18nProvider from '@/components/I18nProvider';
import AdminSidebar from '@/components/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    fetch('/api/auth/verify')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login');
        }
        setChecking(false);
      })
      .catch(() => {
        router.push('/admin/login');
        setChecking(false);
      });
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return (
      <I18nProvider>
        <Toaster position="top-center" />
        {children}
      </I18nProvider>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nProvider>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </I18nProvider>
  );
}
