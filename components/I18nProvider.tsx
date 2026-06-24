'use client';

import { useState, useEffect, useCallback } from 'react';
import { I18nContext, Locale, getTranslation } from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(key, locale);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
