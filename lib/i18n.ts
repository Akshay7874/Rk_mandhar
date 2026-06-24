import { createContext, useContext } from 'react';

export type Locale = 'en' | 'hi';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.contact': 'Contact Us',
    'nav.admin': 'Admin',

    // Hero Section
    'hero.title': 'Welcome to RK Mandhar',
    'hero.subtitle': 'Your Trusted Partner for Vermicompost & Dairy Products',
    'hero.desc': 'Natural. Pure. Trusted. Serving farmers with quality vermicompost, fresh dairy products, and safe farming essentials.',
    'hero.cta': 'Explore Products',
    'hero.contact': 'Contact Us',

    // Features
    'feature.quality': '100% Natural',
    'feature.qualityDesc': 'All our products are natural and safe for farming',
    'feature.trust': 'Trusted Shop',
    'feature.trustDesc': 'Years of experience serving the farming community',
    'feature.delivery': 'Doorstep Delivery',
    'feature.deliveryDesc': 'We deliver quality products right to your doorstep',

    // Products
    'products.title': 'Our Products',
    'products.subtitle': 'Quality farming and dairy products for a better harvest',
    'products.featured': 'Featured Products',
    'products.all': 'All Products',
    'products.vermicompost': 'Vermicompost',
    'products.dairy': 'Dairy Products',
    'products.farming': 'Farming Essentials',
    'products.viewAll': 'View All Products',
    'products.noProducts': 'No products available yet.',
    'products.price': 'Price',
    'products.category': 'Category',
    'products.addToCart': 'Inquire Now',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have a question or want to place an order? Reach out to us!',
    'contact.name': 'Your Name',
    'contact.phone': 'Phone Number',
    'contact.productInterest': 'Product Interest',
    'contact.productPlaceholder': 'Select a product',
    'contact.general': 'General Inquiry',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent successfully! We will get back to you soon.',
    'contact.error': 'Failed to send message. Please try again.',
    'contact.call': 'Call Us',
    'contact.emailUs': 'Email Us',
    'contact.address': 'Visit Us',
    'contact.addressText': 'Home No-195, Nandi Aht, Nandi Firozpur, Saharanpur - 247002, UP',

    // Footer
    'footer.tagline': 'Your trusted partner in farming since generations.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactInfo': 'Contact Info',
    'footer.rights': 'All rights reserved.',

    // Admin
    'admin.login': 'Admin Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.signIn': 'Sign In',
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.messages': 'Messages',
    'admin.settings': 'Email Settings',
    'admin.logout': 'Logout',
    'admin.welcome': 'Welcome to Admin Panel',
    'admin.totalProducts': 'Total Products',
    'admin.totalMessages': 'Total Messages',
    'admin.unreadMessages': 'Unread Messages',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.deleteProduct': 'Delete',
    'admin.saveProduct': 'Save Product',
    'admin.productNameEn': 'Product Name (English)',
    'admin.productNameHi': 'Product Name (Hindi)',
    'admin.productDescEn': 'Description (English)',
    'admin.productDescHi': 'Description (Hindi)',
    'admin.productCategory': 'Category',
    'admin.productPrice': 'Price (₹)',
    'admin.productImage': 'Image URL',
    'admin.productFeatured': 'Featured Product',
    'admin.noProducts': 'No products yet',
    'admin.noMessages': 'No messages yet',
    'admin.markRead': 'Mark Read',
    'admin.messageFrom': 'From',
    'admin.messageDate': 'Date',
    'admin.messageProduct': 'Product Interest',
    'admin.emailSettings': 'Email Configuration',
    'admin.smtpHost': 'SMTP Host',
    'admin.smtpPort': 'SMTP Port',
    'admin.smtpUser': 'SMTP Username',
    'admin.smtpPass': 'SMTP Password (App Password)',
    'admin.notifyEmail': 'Notification Email',
    'admin.saveSettings': 'Save Settings',
    'admin.settingsSaved': 'Settings saved successfully',
    'admin.loginError': 'Invalid credentials',

    // 404
    '404.title': 'Page Not Found',
    '404.desc': 'The page you are looking for does not exist.',
    '404.back': 'Go Back Home',

    // Upload
    'admin.uploadImage': 'Upload Image',
    'admin.uploading': 'Uploading...',
    'admin.selectImage': 'Select Image',
  },
  hi: {
    // Navbar
    'nav.home': 'होम',
    'nav.products': 'उत्पाद',
    'nav.contact': 'संपर्क करें',
    'nav.admin': 'एडमिन',

    // Hero Section
    'hero.title': 'आरके मंधार में आपका स्वागत है',
    'hero.subtitle': 'वर्मीकम्पोस्ट और डेयरी उत्पादों के लिए आपका विश्वसनीय भागीदार',
    'hero.desc': 'प्राकृतिक। शुद्ध। विश्वसनीय। किसानों को गुणवत्तापूर्ण वर्मीकम्पोस्ट, ताजा डेयरी उत्पाद और सुरक्षित कृषि आवश्यकताएं प्रदान करना।',
    'hero.cta': 'उत्पाद देखें',
    'hero.contact': 'संपर्क करें',

    // Features
    'feature.quality': '100% प्राकृतिक',
    'feature.qualityDesc': 'हमारे सभी उत्पाद प्राकृतिक और खेती के लिए सुरक्षित हैं',
    'feature.trust': 'विश्वसनीय दुकान',
    'feature.trustDesc': 'किसान समुदाय की सेवा में वर्षों का अनुभव',
    'feature.delivery': 'डोरस्टेप डिलीवरी',
    'feature.deliveryDesc': 'हम गुणवत्ता उत्पाद सीधे आपके दरवाजे तक पहुंचाते हैं',

    // Products
    'products.title': 'हमारे उत्पाद',
    'products.subtitle': 'बेहतर फसल के लिए गुणवत्तापूर्ण कृषि और डेयरी उत्पाद',
    'products.featured': 'विशेष उत्पाद',
    'products.all': 'सभी उत्पाद',
    'products.vermicompost': 'वर्मीकम्पोस्ट',
    'products.dairy': 'डेयरी उत्पाद',
    'products.farming': 'कृषि आवश्यकताएं',
    'products.viewAll': 'सभी उत्पाद देखें',
    'products.noProducts': 'अभी तक कोई उत्पाद उपलब्ध नहीं है।',
    'products.price': 'मूल्य',
    'products.category': 'श्रेणी',
    'products.addToCart': 'अभी पूछताछ करें',

    // Contact
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'कोई प्रश्न है या ऑर्डर देना चाहते हैं? हमसे संपर्क करें!',
    'contact.name': 'आपका नाम',
    'contact.phone': 'फोन नंबर',
    'contact.productInterest': 'उत्पाद में रुचि',
    'contact.productPlaceholder': 'उत्पाद चुनें',
    'contact.general': 'सामान्य पूछताछ',
    'contact.message': 'आपका संदेश',
    'contact.send': 'संदेश भेजें',
    'contact.sending': 'भेज रहे हैं...',
    'contact.success': 'संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।',
    'contact.error': 'संदेश भेजने में विफल। कृपया पुनः प्रयास करें।',
    'contact.call': 'कॉल करें',
    'contact.emailUs': 'ईमेल करें',
    'contact.address': 'हमसे मिलें',
    'contact.addressText': 'हाउस नं-195, नंदी आहत, नंदी फिरोजपुर, सहारनपुर - 247002, यूपी',

    // Footer
    'footer.tagline': 'पीढ़ियों से खेती में आपका विश्वसनीय भागीदार।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contactInfo': 'संपर्क जानकारी',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',

    // Admin
    'admin.login': 'एडमिन लॉगिन',
    'admin.email': 'ईमेल',
    'admin.password': 'पासवर्ड',
    'admin.signIn': 'साइन इन करें',
    'admin.dashboard': 'डैशबोर्ड',
    'admin.products': 'उत्पाद',
    'admin.messages': 'संदेश',
    'admin.settings': 'ईमेल सेटिंग्स',
    'admin.logout': 'लॉगआउट',
    'admin.welcome': 'एडमिन पैनल में आपका स्वागत है',
    'admin.totalProducts': 'कुल उत्पाद',
    'admin.totalMessages': 'कुल संदेश',
    'admin.unreadMessages': 'अपठित संदेश',
    'admin.addProduct': 'उत्पाद जोड़ें',
    'admin.editProduct': 'उत्पाद संपादित करें',
    'admin.deleteProduct': 'हटाएं',
    'admin.saveProduct': 'उत्पाद सहेजें',
    'admin.productNameEn': 'उत्पाद का नाम (अंग्रेजी)',
    'admin.productNameHi': 'उत्पाद का नाम (हिंदी)',
    'admin.productDescEn': 'विवरण (अंग्रेजी)',
    'admin.productDescHi': 'विवरण (हिंदी)',
    'admin.productCategory': 'श्रेणी',
    'admin.productPrice': 'मूल्य (₹)',
    'admin.productImage': 'इमेज URL',
    'admin.productFeatured': 'विशेष उत्पाद',
    'admin.noProducts': 'अभी तक कोई उत्पाद नहीं',
    'admin.noMessages': 'अभी तक कोई संदेश नहीं',
    'admin.markRead': 'पढ़ा हुआ मार्क करें',
    'admin.messageFrom': 'से',
    'admin.messageDate': 'तारीख',
    'admin.messageProduct': 'उत्पाद रुचि',
    'admin.emailSettings': 'ईमेल कॉन्फ़िगरेशन',
    'admin.smtpHost': 'SMTP होस्ट',
    'admin.smtpPort': 'SMTP पोर्ट',
    'admin.smtpUser': 'SMTP यूज़रनेम',
    'admin.smtpPass': 'SMTP पासवर्ड (ऐप पासवर्ड)',
    'admin.notifyEmail': 'नोटिफिकेशन ईमेल',
    'admin.saveSettings': 'सेटिंग्स सेव करें',
    'admin.settingsSaved': 'सेटिंग्स सफलतापूर्वक सेव हुई',
    'admin.loginError': 'गलत क्रेडेंशियल्स',

    // 404
    '404.title': 'पेज नहीं मिला',
    '404.desc': 'आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है।',
    '404.back': 'होम पेज पर जाएं',

    // Upload
    'admin.uploadImage': 'इमेज अपलोड करें',
    'admin.uploading': 'अपलोड हो रहा है...',
    'admin.selectImage': 'इमेज चुनें',
  },
};

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'hi',
  setLocale: () => {},
  t: (key: string) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function getTranslation(key: string, locale: Locale): string {
  return translations[locale][key] || translations['en'][key] || key;
}
