'use client';

import { useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-100 
        text-primary-700 hover:bg-primary-200 transition-all text-sm font-medium"
    >
      <span className="text-base">{locale === 'en' ? '🇮🇳' : '🇺🇸'}</span>
      <span>{locale === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}
