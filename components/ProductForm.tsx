'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProductFormData {
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  productId?: string;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, productId, isEdit }: ProductFormProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      nameEn: '',
      nameHi: '',
      descEn: '',
      descHi: '',
      category: 'vermicompost',
      price: '',
      image: '',
      featured: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/products/${productId}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (res.ok) {
        toast.success(isEdit ? 'Product updated!' : 'Product created!');
        router.push('/admin/products');
      } else {
        toast.error('Failed to save product');
      }
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productNameEn')} *
          </label>
          <input
            type="text"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productNameHi')} *
          </label>
          <input
            type="text"
            required
            value={formData.nameHi}
            onChange={(e) => setFormData(prev => ({ ...prev, nameHi: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm hindi-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productDescEn')} *
          </label>
          <textarea
            required
            rows={3}
            value={formData.descEn}
            onChange={(e) => setFormData(prev => ({ ...prev, descEn: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productDescHi')} *
          </label>
          <textarea
            required
            rows={3}
            value={formData.descHi}
            onChange={(e) => setFormData(prev => ({ ...prev, descHi: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm resize-none hindi-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productCategory')} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white"
          >
            <option value="vermicompost">🌱 Vermicompost</option>
            <option value="dairy">🥛 Dairy Products</option>
            <option value="farming">🌾 Farming Essentials</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.productPrice')} *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('admin.productImage')}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
              focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="Paste image URL or upload"
          />
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 
            px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            {uploading ? t('admin.uploading') : t('admin.uploadImage')}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        {formData.image && (
          <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
          className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          {t('admin.productFeatured')}
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white 
            px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : t('admin.saveProduct')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
