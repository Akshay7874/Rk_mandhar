'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import ProductForm from '@/components/ProductForm';

interface ProductData {
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
}

export default function EditProduct() {
  const { t, locale } = useI18n();
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then((data: ProductData) => {
        setProduct({
          ...data,
          price: String(data.price),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold text-gray-900 mb-6 ${locale === 'hi' ? 'hindi-text' : ''}`}>
        {t('admin.editProduct')}: {locale === 'hi' ? product.nameHi : product.nameEn}
      </h1>
      <ProductForm initialData={product} productId={params.id as string} isEdit />
    </div>
  );
}
