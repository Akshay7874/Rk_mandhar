import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

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

const useCloudDB = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name');

if (useCloudDB) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
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

async function readJSONCloud<T>(key: string): Promise<T | null> {
  try {
    const resource = `rk-mandhar-data/${key}`;
    const result = await cloudinary.api.resource(resource, { resource_type: 'raw' });
    const res = await fetch(result.secure_url);
    if (!res.ok) return null;
    return JSON.parse(await res.text());
  } catch { return null; }
}

async function writeJSONCloud<T>(key: string, data: T): Promise<void> {
  const buffer = Buffer.from(JSON.stringify(data, null, 2));
  await new Promise<void>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'rk-mandhar-data', public_id: key, resource_type: 'raw', overwrite: true, invalidate: true },
      (err) => { if (err) reject(err); else resolve(); }
    );
    stream.end(buffer);
  });
}

async function readJSON<T>(key: string, defaultValue: T): Promise<T> {
  if (useCloudDB) {
    const data = await readJSONCloud<T>(key);
    if (data) return data;
    // Seed from local files on first deploy
    const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
    if (fs.existsSync(filePath)) {
      const local = readJSONLocal<T>(filePath, defaultValue);
      await writeJSONCloud(key, local);
      return local;
    }
    return defaultValue;
  }
  const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
  return readJSONLocal<T>(filePath, defaultValue);
}

async function writeJSON<T>(key: string, data: T): Promise<void> {
  if (useCloudDB) {
    await writeJSONCloud(key, data);
    return;
  }
  const filePath = key === 'products' ? PRODUCTS_FILE : MESSAGES_FILE;
  writeJSONLocal(filePath, data);
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