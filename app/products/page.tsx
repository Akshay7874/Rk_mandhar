'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import I18nProvider from '@/components/I18nProvider';
import { useI18n } from '@/lib/i18n';

interface Product {
  id: string; nameEn: string; nameHi: string; descEn: string; descHi: string;
  price: number; image: string; category: string; featured: boolean;
}

const filters = [
  { key: 'all', label: 'all', icon: '📋' },
  { key: 'vermicompost', label: 'vermicompost', icon: '🌱' },
  { key: 'dairy', label: 'dairy', icon: '🥛' },
  { key: 'farming', label: 'farming', icon: '🌾' },
];

const filterLabels: Record<string, Record<string, string>> = {
  en: { all: 'All Products', vermicompost: 'Vermicompost', dairy: 'Dairy Products', farming: 'Farming Essentials' },
  hi: { all: 'सभी उत्पाद', vermicompost: 'वर्मीकम्पोस्ट', dairy: 'डेयरी उत्पाद', farming: 'कृषि आवश्यकताएं' },
};

function ProductsContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((d: Product[]) => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && ['vermicompost', 'dairy', 'farming'].includes(cat)) {
      setActiveFilter(cat);
    }
  }, [searchParams]);

  const filtered = activeFilter === 'all' ? products : products.filter(p => p.category === activeFilter);
  const fl = filterLabels[locale] || filterLabels.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="pt-24 pb-10 bg-gradient-to-b from-green-700 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {t('products.title')}
          </h1>
          <p className={`text-green-100 text-sm ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeFilter === f.key
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}>
              {f.icon} {fl[f.key] || f.key}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse border border-gray-100">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <span className="text-5xl block mb-3">📦</span>
            <p className={`text-gray-500 ${locale === 'hi' ? 'hindi-text' : ''}`}>{t('products.noProducts')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default function Products() {
  return (
    <I18nProvider>
      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <ProductsContent />
      </Suspense>
    </I18nProvider>
  );
}
