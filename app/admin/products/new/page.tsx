'use client';

import { useI18n } from '@/lib/i18n';
import ProductForm from '@/components/ProductForm';

export default function NewProduct() {
  const { t, locale } = useI18n();

  return (
    <div>
      <h1 className={`text-2xl font-bold text-gray-900 mb-6 ${locale === 'hi' ? 'hindi-text' : ''}`}>
        {t('admin.addProduct')}
      </h1>
      <ProductForm />
    </div>
  );
}
