'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { HiMenu, HiX, HiPhone } from 'react-icons/hi';

export default function Header() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const nav = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-black/20 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              scrolled ? 'bg-green-600 text-white' : 'bg-white/20 text-white'
            }`}>RK</div>
            <span className={`font-bold text-lg ${scrolled ? 'text-gray-900' : 'text-white'}`}>RK Mandhar</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}
                className={`text-sm font-medium transition-all hover:text-green-400 ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}>
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <a href="tel:+918006575096"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm 
                font-semibold px-4 py-2 rounded-lg transition-all">
              <HiPhone size={15} /> +91 8006575096
            </a>
          </nav>

          <button onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
            {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-700 font-medium text-sm">{item.label}</Link>
            ))}
            <div className="pt-2"><LanguageSwitcher /></div>
            <a href="tel:+918006575096"
              className="flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg">
              <HiPhone size={15} /> +91 8006575096
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
