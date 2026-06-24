'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { HiPhone } from 'react-icons/hi';

interface Props {
  id: string;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  price: number;
  image: string;
  category: string;
}

const catStyle: Record<string, { badge: string; border: string }> = {
  vermicompost: { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
  dairy: { badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  farming: { badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
};

const catLabels: Record<string, string> = {
  vermicompost: '🌱 Vermicompost',
  dairy: '🥛 Dairy',
  farming: '🌾 Farming',
};

export default function ProductCard({ id, nameEn, nameHi, descEn, descHi, price, image, category }: Props) {
  const { locale } = useI18n();
  const s = catStyle[category] || catStyle.farming;

  return (
    <div className={`bg-white rounded-xl border ${s.border} overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className="relative h-44 bg-gray-100">
        {image ? (
          <Image src={image} alt={locale === 'hi' ? nameHi : nameEn} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-gray-300">📦</div>
        )}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
          {catLabels[category] || category}
        </span>
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          ₹{price}
        </span>
      </div>
      <div className="p-4">
        <h3 className={`font-bold text-gray-900 text-base mb-1 ${locale === 'hi' ? 'hindi-text' : ''}`}>
          {locale === 'hi' ? nameHi : nameEn}
        </h3>
        <p className={`text-xs text-gray-500 line-clamp-2 mb-3 ${locale === 'hi' ? 'hindi-text' : ''}`}>
          {locale === 'hi' ? descHi : descEn}
        </p>
        <Link
          href={`/contact?product=${id}`}
          className="flex items-center justify-center gap-1.5 w-full bg-green-600 hover:bg-green-700 
            text-white text-sm font-semibold py-2.5 px-3 rounded-lg transition-all active:scale-95"
        >
          <HiPhone size={15} />
          <span>{locale === 'hi' ? 'खरीदने के लिए संपर्क करें' : 'Contact to Buy'}</span>
        </Link>
      </div>
    </div>
  );
}
