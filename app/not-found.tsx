'use client';

import Link from 'next/link';
import I18nProvider from '@/components/I18nProvider';
import { useI18n } from '@/lib/i18n';

function NotFoundContent() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-green-50">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🌿</div>
        <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${locale === 'hi' ? 'hindi-text' : ''}`}>
          {t('404.title')}
        </h1>
        <p className={`text-gray-500 mb-8 max-w-md mx-auto ${locale === 'hi' ? 'hindi-text' : ''}`}>
          {t('404.desc')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white 
            px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
        >
          {t('404.back')}
        </Link>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <I18nProvider>
      <NotFoundContent />
    </I18nProvider>
  );
}
