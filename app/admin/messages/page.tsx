'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { HiTrash, HiCheck, HiMail, HiPhone, HiCalendar, HiChat } from 'react-icons/hi';

interface Message {
  id: string; name: string; email: string; phone: string; productInterest: string; message: string; createdAt: string; read: boolean;
}

export default function AdminMessages() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => {
    fetch('/api/messages')
      .then(r => r.json())
      .then((d: Message[]) => { setMessages(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'PATCH' });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: true } : null);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted'); if (selected?.id === id) setSelected(null); load(); }
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.messages')}</h1>
        <p className="text-gray-500 text-sm mt-1">{messages.filter(m => !m.read).length} unread · {messages.length} total</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <HiChat size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('admin.noMessages')}</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm
                  ${selected?.id === msg.id ? 'ring-2 ring-green-500 border-green-200' : 'border-gray-100'}
                  ${!msg.read ? 'border-l-4 border-l-green-500 bg-green-50/40' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium text-gray-900 truncate text-sm ${!msg.read ? 'font-semibold' : ''}`}>
                        {msg.name}
                      </h3>
                      {!msg.read && <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <HiCalendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{msg.productInterest}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0 ml-2">
                    <button onClick={e => { e.stopPropagation(); markRead(msg.id); }}
                      className={`p-1.5 rounded-lg transition-all ${msg.read ? 'text-gray-300' : 'text-green-500 hover:bg-green-50'}`}>
                      <HiCheck size={15} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <HiTrash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8">
            {selected ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">{selected.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    selected.read ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                  }`}>
                    {selected.read ? 'Read' : 'New'}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                    <HiMail className="text-gray-400" size={16} /> {selected.email}
                  </a>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                    <HiPhone className="text-gray-400" size={16} /> {selected.phone}
                  </a>
                  <div>
                    <span className="text-gray-400 text-xs">Product Interest:</span>
                    <p className="font-medium text-gray-800 mt-0.5">{selected.productInterest}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Message:</span>
                    <p className="text-gray-700 mt-1 bg-gray-50 rounded-lg p-3 leading-relaxed">{selected.message}</p>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.productInterest}`}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                    <HiMail size={15} /> Reply
                  </a>
                  <button onClick={() => handleDelete(selected.id)}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                    <HiTrash size={15} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <HiChat size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
