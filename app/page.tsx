'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import I18nProvider from '@/components/I18nProvider';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight, HiPhone, HiShieldCheck, HiTruck, HiSparkles } from 'react-icons/hi';

interface Product {
  id: string; nameEn: string; nameHi: string; descEn: string; descHi: string;
  price: number; image: string; category: string; featured: boolean;
}

const catIcons: Record<string, string> = {
  vermicompost: '🌱', dairy: '🥛', farming: '🌾',
};

const videos = ['/uploads/video-2.mp4', '/uploads/video-3.mp4', '/uploads/video-4.mp4'];

function HomeContent() {
  const { t, locale } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [vidErr, setVidErr] = useState(Array(videos.length).fill(false));
  const [currentVid, setCurrentVid] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((d: Product[]) => setProducts(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const handleEnded = () => {
      setFading(true);
      setTimeout(() => {
        setCurrentVid(prev => (prev + 1) % videos.length);
        setFading(false);
      }, 500);
    };
    vid.addEventListener('ended', handleEnded);
    return () => vid.removeEventListener('ended', handleEnded);
  }, [currentVid]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVid]);

  const featured = products.filter(p => p.featured).slice(0, 3);
  const vermi = products.find(p => p.category === 'vermicompost');

  const stats = [
    { val: '10+', label: locale === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience' },
    { val: '1000+', label: locale === 'hi' ? 'संतुष्ट ग्राहक' : 'Happy Customers' },
    { val: '50+', label: locale === 'hi' ? 'उत्पाद विविधता' : 'Product Varieties' },
    { val: '100%', label: locale === 'hi' ? 'प्राकृतिक' : 'Natural' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Video Hero Carousel */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {videos.map((src, i) => (
          !vidErr[i] && (
            <video key={src} ref={i === currentVid ? videoRef : undefined} autoPlay={i === 0} muted playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === currentVid && !fading ? 'opacity-100' : 'opacity-0'}`}
              onError={() => setVidErr(prev => { const n = [...prev]; n[i] = true; return n; })}>
              <source src={src} type="video/mp4" />
            </video>
          )
        ))}
        {vidErr.every(Boolean) && <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />}
        <div className="absolute inset-0 video-overlay" />
        <div className="relative h-full max-w-6xl mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur rounded-full 
              text-white/90 text-xs font-medium mb-4 border border-white/10">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {locale === 'hi' ? 'प्राकृतिक कृषि उत्पाद' : 'Natural Farming Products'}
            </div>
            <h1 className={`text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3 ${locale === 'hi' ? 'hindi-text' : ''}`}>
              {locale === 'hi' ? 'आरके मंधार' : 'RK Mandhar'}
            </h1>
            <p className={`text-lg md:text-xl text-green-100 font-medium mb-2 ${locale === 'hi' ? 'hindi-text' : ''}`}>
              {locale === 'hi' ? 'वर्मीकम्पोस्ट, डेयरी और कृषि उत्पाद' : 'Vermicompost, Dairy & Farming Products'}
            </p>
            <p className={`text-sm md:text-base text-white/80 max-w-lg mb-6 ${locale === 'hi' ? 'hindi-text' : ''}`}>
              {locale === 'hi'
                ? 'गुणवत्तापूर्ण वर्मीकम्पोस्ट, ताजा दूध, शुद्ध घी और कृषि आवश्यकताएं - पूरी तरह प्राकृतिक और विश्वसनीय।'
                : 'Quality vermicompost, fresh milk, pure ghee and farming essentials - completely natural and trusted.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products"
                className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white 
                  px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-green-600/30">
                {t('hero.cta')} <HiArrowRight size={16} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur hover:bg-white/25 
                  text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all border border-white/20">
                <HiPhone size={16} /> {t('hero.contact')}
              </Link>
            </div>
          </div>
        </div>
        {/* Nav dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {videos.map((_, i) => (
            <button key={i} onClick={() => { setCurrentVid(i); }} disabled={fading}
              className={`w-2 h-2 rounded-full transition-all ${i === currentVid ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-2xl md:text-3xl font-bold text-white">{s.val}</p>
                <p className={`text-xs text-green-200 mt-0.5 ${locale === 'hi' ? 'hindi-text' : ''}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${locale === 'hi' ? 'hindi-text' : ''}`}>
              {locale === 'hi' ? 'हमें क्यों चुनें' : 'Why Choose Us'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: HiSparkles, title: locale === 'hi' ? '100% प्राकृतिक' : '100% Natural', desc: locale === 'hi' ? 'सभी उत्पाद प्राकृतिक और रासायनिक मुक्त' : 'All products natural & chemical-free', color: 'bg-green-100 text-green-600' },
              { icon: HiShieldCheck, title: locale === 'hi' ? 'विश्वसनीय दुकान' : 'Trusted Shop', desc: locale === 'hi' ? 'वर्षों का अनुभव और किसानों का विश्वास' : 'Years of experience & farmers trust', color: 'bg-blue-100 text-blue-600' },
              { icon: HiTruck, title: locale === 'hi' ? 'डोरस्टेप डिलीवरी' : 'Doorstep Delivery', desc: locale === 'hi' ? 'गुणवत्ता उत्पाद सीधे आपके दरवाजे तक' : 'Quality products right to your door', color: 'bg-amber-100 text-amber-600' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-11 h-11 ${f.color} rounded-lg flex items-center justify-center mb-3`}>
                  <f.icon size={22} />
                </div>
                <h3 className={`font-bold text-gray-900 mb-1 ${locale === 'hi' ? 'hindi-text' : ''}`}>{f.title}</h3>
                <p className={`text-sm text-gray-500 ${locale === 'hi' ? 'hindi-text' : ''}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 ${locale === 'hi' ? 'hindi-text' : ''}`}>
                {t('products.title')}
              </h2>
              <p className={`text-sm text-gray-500 mt-1 ${locale === 'hi' ? 'hindi-text' : ''}`}>
                {t('products.subtitle')}
              </p>
            </div>
            <Link href="/products" className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1">
              {t('products.viewAll')} <HiArrowRight size={15} />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-5xl block mb-3">🌿</span>
              <p className="text-gray-500 text-sm">{locale === 'hi' ? 'उत्पाद लोड हो रहे हैं...' : 'Loading products...'}</p>
              <div className="flex justify-center gap-1 mt-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vermicompost Spotlight */}
      {vermi && (
        <section className="py-14 bg-gradient-to-r from-green-700 to-green-900 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                  {locale === 'hi' ? 'हमारा प्रमुख उत्पाद' : 'FLAGSHIP PRODUCT'}
                </span>
                <h2 className={`text-2xl md:text-4xl font-bold mt-2 mb-4 ${locale === 'hi' ? 'hindi-text' : ''}`}>
                  {locale === 'hi' ? vermi.nameHi : vermi.nameEn}
                </h2>
                <p className={`text-gray-300 text-sm leading-relaxed mb-5 ${locale === 'hi' ? 'hindi-text' : ''}`}>
                  {locale === 'hi' ? vermi.descHi : vermi.descEn}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['🧪 जैविक', '💪 पोषक', '🌿 प्राकृतिक'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
                <Link href={`/contact?product=${vermi.id}`}
                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white 
                    px-5 py-2.5 rounded-lg font-semibold text-sm transition-all">
                  <HiPhone size={15} /> {locale === 'hi' ? 'ऑर्डर करें' : 'Order Now'}
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {vermi.image ? (
                  <Image src={vermi.image} alt={locale === 'hi' ? vermi.nameHi : vermi.nameEn}
                    width={600} height={400} className="w-full h-72 object-cover" />
                ) : (
                  <div className="h-72 flex items-center justify-center text-7xl bg-green-900">🌱</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Quick View */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {locale === 'hi' ? 'हमारी श्रेणियां' : 'Our Categories'}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { cat: 'vermicompost', label: locale === 'hi' ? 'वर्मीकम्पोस्ट' : 'Vermicompost', count: products.filter(p => p.category === 'vermicompost').length },
              { cat: 'dairy', label: locale === 'hi' ? 'डेयरी उत्पाद' : 'Dairy Products', count: products.filter(p => p.category === 'dairy').length },
              { cat: 'farming', label: locale === 'hi' ? 'कृषि आवश्यकताएं' : 'Farming Essentials', count: products.filter(p => p.category === 'farming').length },
            ].map((c, i) => (
              <Link key={i} href={`/products?cat=${c.cat}`}
                className="bg-green-50 hover:bg-green-100 rounded-xl p-5 text-center transition-all border border-green-100 anim-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-3xl block mb-2">{catIcons[c.cat] || '🌿'}</span>
                <p className={`font-semibold text-gray-800 text-sm ${locale === 'hi' ? 'hindi-text' : ''}`}>{c.label}</p>
                <p className="text-xs text-gray-500 mt-1">{c.count} {locale === 'hi' ? 'उत्पाद' : 'products'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-green-500 to-green-700">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {locale === 'hi' ? 'आज ही संपर्क करें' : 'Contact Us Today'}
          </h2>
          <p className={`text-green-100 text-sm mb-6 ${locale === 'hi' ? 'hindi-text' : ''}`}>
            {locale === 'hi' ? 'गुणवत्तापूर्ण उत्पादों के लिए अभी कॉल करें' : 'Call now for quality products'}
          </p>
          <a href="tel:+918006575096"
            className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 
              px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-xl glow-pulse">
            <HiPhone size={20} /> +91 8006575096
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Home() {
  return <I18nProvider><HomeContent /></I18nProvider>;
}
