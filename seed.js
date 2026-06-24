const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const EMAIL_CONFIG_FILE = path.join(DATA_DIR, 'email-config.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const products = [
  {
    id: '1',
    nameEn: 'Premium Vermicompost',
    nameHi: 'प्रीमियम वर्मीकम्पोस्ट',
    descEn: 'High-quality organic vermicompost made from earthworms. Enriches soil with essential nutrients and improves crop yield naturally.',
    descHi: 'केंचुओं से तैयार उच्च गुणवत्ता वाली जैविक वर्मीकम्पोस्ट। मिट्टी को आवश्यक पोषक तत्वों से समृद्ध करती है और फसल की पैदावार को प्राकृतिक रूप से बढ़ाती है।',
    category: 'vermicompost',
    price: 499,
    image: '/uploads/product-1.jpeg',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nameEn: 'Fresh Cow Milk',
    nameHi: 'ताजा गाय का दूध',
    descEn: 'Pure and fresh cow milk from healthy, well-cared cows. Rich in nutrients and completely natural. Available daily.',
    descHi: 'स्वस्थ और अच्छी तरह से देखभाल की गई गायों का शुद्ध और ताजा दूध। पोषक तत्वों से भरपूर और पूरी तरह से प्राकृतिक। प्रतिदिन उपलब्ध।',
    category: 'dairy',
    price: 60,
    image: '/uploads/product-2.jpeg',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nameEn: 'Organic Fertilizer Mix',
    nameHi: 'जैविक उर्वरक मिश्रण',
    descEn: 'Specially formulated organic fertilizer mix for all types of crops. Boosts soil fertility and ensures healthy plant growth.',
    descHi: 'सभी प्रकार की फसलों के लिए विशेष रूप से तैयार जैविक उर्वरक मिश्रण। मिट्टी की उर्वरता बढ़ाता है और पौधों की स्वस्थ वृद्धि सुनिश्चित करता है।',
    category: 'farming',
    price: 799,
    image: '/uploads/product-3.jpeg',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    nameEn: 'Pure Ghee',
    nameHi: 'शुद्ध घी',
    descEn: 'Traditional pure desi ghee made from fresh cow milk. Rich aroma and taste. Perfect for cooking and health purposes.',
    descHi: 'ताजा गाय के दूध से बना पारंपरिक शुद्ध देसी घी। समृद्ध सुगंध और स्वाद। खाना पकाने और स्वास्थ्य के लिए एकदम सही।',
    category: 'dairy',
    price: 899,
    image: '/uploads/product-4.jpeg',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    nameEn: 'Neem Cake Organic',
    nameHi: 'नीम केक ऑर्गेनिक',
    descEn: 'Natural neem cake fertilizer. Acts as a soil conditioner and natural pesticide. Essential for organic farming.',
    descHi: 'प्राकृतिक नीम केक उर्वरक। मिट्टी कंडीशनर और प्राकृतिक कीटनाशक के रूप में कार्य करता है। जैविक खेती के लिए आवश्यक।',
    category: 'farming',
    price: 349,
    image: '/uploads/product-5.jpeg',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    nameEn: 'Fresh Curd (Dahi)',
    nameHi: 'ताजा दही',
    descEn: 'Creamy and fresh curd made from pure cow milk. Rich in probiotics and perfect for daily consumption.',
    descHi: 'शुद्ध गाय के दूध से बना मलाईदार और ताजा दही। प्रोबायोटिक्स से भरपूर और दैनिक उपभोग के लिए एकदम सही।',
    category: 'dairy',
    price: 40,
    image: '/uploads/product-6.jpeg',
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'chaudharyrajat759@gmail.com',
  pass: '',
  from: 'chaudharyrajat759@gmail.com',
  to: 'chaudharyrajat759@gmail.com',
};

if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  console.log('✓ Products seeded successfully');
} else {
  console.log('• Products file already exists, skipping');
}

if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
  console.log('✓ Messages file created');
}

if (!fs.existsSync(EMAIL_CONFIG_FILE)) {
  fs.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify(emailConfig, null, 2));
  console.log('✓ Email config file created');
}

console.log('\n✓ Seed completed!');
console.log('\nAdmin Login:');
  console.log('  Email:    admin@rajat');
  console.log('  Password: rajat123');
  console.log('\nContact Details (from notes.txt):');
  console.log('  Phone:    +91 8006575096');
  console.log('  Email:    chaudharyrajat759@gmail.com');
  console.log('  Address:  Home No-195, Nandi Aht, Nandi Firozpur, Saharanpur - 247002, UP');
  console.log('\nTo set up email notifications, update .env.local with:');
  console.log('  SMTP_USER=chaudharyrajat759@gmail.com');
  console.log('  SMTP_PASS=your-gmail-app-password');
  console.log('  NOTIFICATION_EMAIL=chaudharyrajat759@gmail.com');
  console.log('  SMTP_HOST=smtp.gmail.com');
  console.log('  SMTP_PORT=587');
