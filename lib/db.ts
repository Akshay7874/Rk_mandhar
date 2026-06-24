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

const useRedis = !!process.env.KV_URL;

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({ url: process.env.KV_URL!, token: process.env.KV_TOKEN! });
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSONLocal<T>(filePath: string, defaultValue: T): T {
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

function writeJSONLocal<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function readJSON<T>(key: string, defaultValue: T): Promise<T> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(key);
      if (data) return data as T;
    } catch {}
    // Seed from local files if Redis is empty (first deploy)
    const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
    if (fs.existsSync(filePath)) {
      const local = readJSONLocal<T>(filePath, defaultValue);
      const redis = getRedis();
      await redis.set(key, JSON.parse(JSON.stringify(local)));
      return local;
    }
    return defaultValue;
  }
  const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
  return readJSONLocal<T>(filePath, defaultValue);
}

async function writeJSON<T>(key: string, data: T): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.set(key, JSON.parse(JSON.stringify(data)));
      return;
    } catch (e) {
      console.error('Redis write failed:', e);
    }
  }
  const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
  try {
    writeJSONLocal(filePath, data);
  } catch (e: any) {
    if (process.env.VERCEL && !useRedis) {
      throw new Error('Cannot save on Vercel without a database. Go to Vercel Dashboard → Storage → Create KV Database, then add KV_URL and KV_TOKEN to Environment Variables and redeploy.');
    }
    throw e;
  }
}

export async function getProducts(): Promise<Product[]> {
  return readJSON<Product[]>('products', []);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  await writeJSON('products', products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  await writeJSON('products', products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeJSON('products', filtered);
  return true;
}

export async function getMessages(): Promise<Message[]> {
  return readJSON<Message[]>('messages', []);
}

export async function createMessage(msg: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
  const messages = await getMessages();
  const newMessage: Message = {
    ...msg,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMessage);
  await writeJSON('messages', messages);
  return newMessage;
}

export async function markMessageRead(id: string): Promise<boolean> {
  const messages = await getMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return false;
  msg.read = true;
  await writeJSON('messages', messages);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = await getMessages();
  const filtered = messages.filter(m => m.id !== id);
  if (filtered.length === messages.length) return false;
  await writeJSON('messages', filtered);
  return true;
}