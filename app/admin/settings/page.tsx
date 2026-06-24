'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { HiCog } from 'react-icons/hi';

export default function AdminSettings() {
  const { t, locale } = useI18n();
  const [config, setConfig] = useState({ host: 'smtp.gmail.com', port: '587', user: '', pass: '', from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/email-config').then(r => r.json()).then(d => {
      setConfig({ host: d.host || 'smtp.gmail.com', port: String(d.port || '587'), user: d.user || '', pass: '', from: d.from || '', to: d.to || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/email-config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, port: Number(config.port) }),
      });
      if (res.ok) toast.success(t('admin.settingsSaved'));
      else toast.error('Failed');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <svg className="animate-spin h-6 w-6 text-green-500" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.emailSettings')}</h1>
        <p className="text-gray-500 text-sm mt-1">Configure Gmail SMTP for email notifications</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
        <p className="font-medium mb-1">How to get Gmail App Password:</p>
        <ol className="list-decimal ml-4 text-xs space-y-0.5 text-amber-600">
          <li>Go to your Google Account {'>'} Security</li>
          <li>Enable 2-Step Verification</li>
          <li>Go to App Passwords (search in Google Account)</li>
          <li>Select "Mail" and "Other" - name it "RK Mandhar"</li>
          <li>Copy the 16-character password and paste below</li>
        </ol>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 max-w-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Host</label>
              <input type="text" value={config.host} onChange={e => setConfig(p => ({ ...p, host: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Port</label>
              <input type="number" value={config.port} onChange={e => setConfig(p => ({ ...p, port: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Username (Gmail)</label>
            <input type="email" value={config.user} onChange={e => setConfig(p => ({ ...p, user: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="your-email@gmail.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Password (App Password)</label>
            <input type="password" value={config.pass} onChange={e => setConfig(p => ({ ...p, pass: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="16-character app password" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notification Email</label>
            <input type="email" value={config.to} onChange={e => setConfig(p => ({ ...p, to: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="admin@example.com" />
          </div>
        </div>
        <button type="submit" disabled={saving}
          className="mt-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
          <HiCog size={16} /> {saving ? 'Saving...' : t('admin.saveSettings')}
        </button>
      </form>
    </div>
  );
}
