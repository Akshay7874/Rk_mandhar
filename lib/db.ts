import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

interface Product {
  id: string;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
}

function writeJSON<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getProducts(): Product[] {
  return readJSON<Product[]>(PRODUCTS_FILE, []);
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  writeJSON(PRODUCTS_FILE, products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  writeJSON(PRODUCTS_FILE, filtered);
  return true;
}

export function getMessages(): Message[] {
  return readJSON<Message[]>(MESSAGES_FILE, []);
}

export function createMessage(msg: Omit<Message, 'id' | 'createdAt' | 'read'>): Message {
  const messages = getMessages();
  const newMessage: Message = {
    ...msg,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMessage);
  writeJSON(MESSAGES_FILE, messages);
  return newMessage;
}

export function markMessageRead(id: string): boolean {
  const messages = getMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return false;
  msg.read = true;
  writeJSON(MESSAGES_FILE, messages);
  return true;
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages();
  const filtered = messages.filter(m => m.id !== id);
  if (filtered.length === messages.length) return false;
  writeJSON(MESSAGES_FILE, filtered);
  return true;
}
