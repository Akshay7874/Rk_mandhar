'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiCube } from 'react-icons/hi';

interface Product {
  id: string; nameEn: string; nameHi: string; category: string; price: number; image: string; featured: boolean;
}

export default function AdminProducts() {
  const { t, locale } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then((d: Product[]) => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success(`"${name}" deleted`); load(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  const catEmoji: Record<string, string> = { vermicompost: '🌱', dairy: '🥛', farming: '🌾' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.products')}</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 
            rounded-xl text-sm font-semibold transition-all hover:shadow-lg">
          <HiPlus size={18} /> {t('admin.addProduct')}
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4 border border-gray-100">
              <div className="w-14 h-14 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/2" /><div className="h-3 bg-gray-200 rounded w-1/4" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <HiCube size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{t('admin.noProducts')}</p>
          <Link href="/admin/products/new" className="text-green-600 font-semibold text-sm hover:underline">
            {t('admin.addProduct')}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-gray-100">
                {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : catEmoji[p.category] || '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{locale === 'hi' ? p.nameHi : p.nameEn}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {catEmoji[p.category] || ''} {p.category} · ₹{p.price} {p.featured && <span className="text-amber-500">· ⭐ Featured</span>}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link href={`/admin/products/${p.id}`}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                  <HiPencil size={16} />
                </Link>
                <button onClick={() => handleDelete(p.id, locale === 'hi' ? p.nameHi : p.nameEn)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <HiTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
