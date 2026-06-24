'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { HiCube, HiMail, HiEye, HiArrowRight, HiPlus, HiChat } from 'react-icons/hi';
import Link from 'next/link';

export default function AdminDashboard() {
  const { t, locale } = useI18n();
  const [stats, setStats] = useState({ products: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
    ])
    .then(([products, messages]) => {
      setStats({
        products: products.length,
        messages: messages.length,
        unread: messages.filter((m: any) => !m.read).length,
      });
    })
    .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { title: t('admin.totalProducts'), value: stats.products, icon: HiCube, color: 'from-green-500 to-green-600', link: '/admin/products' },
          { title: t('admin.totalMessages'), value: stats.messages, icon: HiMail, color: 'from-blue-500 to-blue-600', link: '/admin/messages' },
          { title: t('admin.unreadMessages'), value: stats.unread, icon: HiEye, color: stats.unread > 0 ? 'from-red-500 to-red-600' : 'from-gray-400 to-gray-500', link: '/admin/messages' },
        ].map((card) => (
          <Link key={card.title} href={card.link}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                <card.icon size={22} />
              </div>
              <HiArrowRight className="text-gray-300 group-hover:text-green-500 transition-colors" size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{card.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{card.title}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/products/new"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 
              hover:bg-green-100 transition-all group">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <HiPlus size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t('admin.addProduct')}</p>
              <p className="text-xs text-gray-500">Add a new product</p>
            </div>
          </Link>
          <Link href="/admin/messages"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 
              hover:bg-blue-100 transition-all group">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <HiChat size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t('admin.messages')}</p>
              <p className="text-xs text-gray-500">
                {stats.unread > 0 ? `${stats.unread} unread` : 'View all messages'}
              </p>
            </div>
          </Link>
          <Link href="/"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 
              hover:bg-gray-100 transition-all group">
            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white">
              <HiEye size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">View Website</p>
              <p className="text-xs text-gray-500">See live site</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
