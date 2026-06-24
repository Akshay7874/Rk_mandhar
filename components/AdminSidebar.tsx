'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { HiHome, HiCube, HiMail, HiCog, HiLogout, HiMenu, HiX, HiExternalLink } from 'react-icons/hi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', label: t('admin.dashboard'), icon: HiHome },
    { href: '/admin/products', label: t('admin.products'), icon: HiCube },
    { href: '/admin/messages', label: t('admin.messages'), icon: HiMail },
    { href: '/admin/settings', label: t('admin.settings'), icon: HiCog },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out');
        router.push('/admin/login');
      }
    } catch {
      toast.error('Logout failed');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-800 to-green-900">
      {/* Logo */}
      <div className="p-5 border-b border-green-700/50">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-green-700 shadow-md">
            RK
          </div>
          <div>
            <h2 className="text-white font-bold text-sm leading-tight">Admin Panel</h2>
            <p className="text-green-300 text-xs">RK Mandhar</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-white text-green-800 shadow-md'
                  : 'text-green-100/80 hover:bg-green-700/50 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-green-700/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
            text-green-200/70 hover:bg-green-700/50 hover:text-white transition-all"
        >
          <HiExternalLink size={18} />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
            text-red-300/80 hover:bg-red-600/30 hover:text-red-200 transition-all w-full"
        >
          <HiLogout size={18} />
          {t('admin.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-all"
      >
        {isMobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      <div className="hidden lg:block lg:w-64 shrink-0 min-h-screen">
        <div className="fixed inset-y-0 left-0 w-64 z-40">
          {sidebarContent}
        </div>
      </div>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className={`fixed inset-y-0 left-0 w-64 z-40 transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
        </div>
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setIsMobileOpen(false)} />
        )}
      </div>
    </>
  );
}
