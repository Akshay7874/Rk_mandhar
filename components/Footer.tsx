'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center font-bold text-sm">RK</div>
              <h3 className="font-bold text-lg">RK Mandhar</h3>
            </div>
            <p className={`text-gray-400 text-sm leading-relaxed ${locale === 'hi' ? 'hindi-text' : ''}`}>
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/products', label: t('nav.products') },
                { href: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">{t('footer.contactInfo')}</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <HiPhone className="text-green-400 shrink-0" size={16} />
                <a href="tel:+918006575096" className="hover:text-green-400">+91 8006575096</a>
              </li>
              <li className="flex items-center gap-2">
                <HiMail className="text-green-400 shrink-0" size={16} />
                <a href="mailto:chaudharyrajat759@gmail.com" className="hover:text-green-400 break-all">chaudharyrajat759@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <HiLocationMarker className="text-green-400 shrink-0 mt-0.5" size={16} />
                <span className={locale === 'hi' ? 'hindi-text' : ''}>{t('contact.addressText')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} RK Mandhar. {t('footer.rights')}
      </div>
    </footer>
  );
}
