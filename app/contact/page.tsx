'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import I18nProvider from '@/components/I18nProvider';
import { useI18n } from '@/lib/i18n';
import { HiPhone, HiMail, HiLocationMarker, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

interface Product { id: string; nameEn: string; nameHi: string; }

function ContactContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', productInterest: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then((d: Product[]) => {
      setProducts(d);
      const pid = searchParams.get('product');
      if (pid && d.find(p => p.id === pid)) setForm(prev => ({ ...prev, productInterest: pid }));
    }).catch(() => {});
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const sel = products.find(p => p.id === form.productInterest);
      const pn = sel ? (locale === 'hi' ? sel.nameHi : sel.nameEn) : t('contact.general');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productInterest: pn }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', phone: '', productInterest: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="pt-24 pb-10 bg-gradient-to-b from-green-700 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {t('contact.title')}
          </h1>
          <p className={`text-green-100 text-sm ${locale === 'hi' ? 'hindi-text' : ''}`}>{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className={`text-lg font-bold text-gray-900 mb-5 ${locale === 'hi' ? 'hindi-text' : ''}`}>
                {locale === 'hi' ? 'संपर्क फॉर्म' : 'Contact Form'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.name')} *</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                      focus:border-transparent outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                    placeholder={locale === 'hi' ? 'अपना नाम लिखें' : 'Your name'} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.phone')} *</label>
                  <input type="tel" required value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                      focus:border-transparent outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                    placeholder="+91 8006575096" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.productInterest')}</label>
                  <select value={form.productInterest}
                    onChange={e => setForm(p => ({ ...p, productInterest: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                      focus:border-transparent outline-none text-sm bg-gray-50 focus:bg-white transition-all">
                    <option value="">{t('contact.general')}</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{locale === 'hi' ? p.nameHi : p.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.message')} *</label>
                  <textarea required rows={4} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                      focus:border-transparent outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                    placeholder={locale === 'hi' ? 'अपना संदेश लिखें...' : 'Write your message...'} />
                </div>
              </div>
              <button type="submit" disabled={status === 'sending'}
                className="mt-5 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white 
                  py-3 rounded-lg font-semibold text-sm transition-all active:scale-[0.99]">
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    {t('contact.sending')}
                  </span>
                ) : t('contact.send')}
              </button>
              {status === 'success' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                  <HiCheckCircle size={18} /> <span className={locale === 'hi' ? 'hindi-text' : ''}>{t('contact.success')}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <HiExclamationCircle size={18} /> <span className={locale === 'hi' ? 'hindi-text' : ''}>{t('contact.error')}</span>
                </div>
              )}
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            {[
              { icon: HiPhone, title: t('contact.call'), content: '+91 8006575096', href: 'tel:+918006575096', color: 'text-green-600 bg-green-100' },
              { icon: HiMail, title: t('contact.emailUs'), content: 'chaudharyrajat759@gmail.com', href: 'mailto:chaudharyrajat759@gmail.com', color: 'text-blue-600 bg-blue-100' },
              { icon: HiLocationMarker, title: t('contact.address'), content: t('contact.addressText'), color: 'text-amber-600 bg-amber-100' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-gray-600 hover:text-green-600 transition-colors">{item.content}</a>
                    ) : (
                      <p className={`text-sm text-gray-600 ${locale === 'hi' ? 'hindi-text' : ''}`}>{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-green-600 rounded-xl p-4 text-center text-white">
              <p className={`text-sm font-medium ${locale === 'hi' ? 'hindi-text' : ''}`}>
                {locale === 'hi' ? 'हम जल्द ही आपसे संपर्क करेंगे!' : 'We will contact you soon!'}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function Contact() {
  return (
    <I18nProvider>
      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <ContactContent />
      </Suspense>
    </I18nProvider>
  );
}
