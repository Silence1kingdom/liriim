'use client';

import { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiCheck, FiTerminal, FiMessageSquare } from 'react-icons/fi';
import { getContactMessages } from '@/lib/firestore';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactMessage } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setMessages(await getContactMessages()); }
    catch { toast.error('فشل تحميل الرسائل'); }
    finally { setLoading(false); }
  };

  const toggleRead = async (msg: ContactMessage) => {
    try {
      await updateDoc(doc(db, 'messages', msg.id), { read: !msg.read });
      setMessages(messages.map(m => m.id === msg.id ? { ...m, read: !m.read } : m));
      if (selected?.id === msg.id) setSelected({ ...selected, read: !selected.read });
    } catch { toast.error('فشل التحديث'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الرسالة؟')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(messages.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('تم الحذف');
    } catch { toast.error('فشل الحذف'); }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="terminal-window mb-6">
        <div className="terminal-window-header">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="text-text-muted text-xs font-mono mr-auto">root@b20-admin:~# cat /var/mail/</span>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
            <FiMessageSquare className="text-yellow-400" /> الرسائل
            {unread > 0 && <span className="text-xs px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-mono">{unread} جديد</span>}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : messages.length === 0 ? (
        <div className="terminal-window text-center py-12">
          <div className="p-8">
            <FiMail className="text-text-muted text-4xl mx-auto mb-3" />
            <p className="text-text-muted font-mono text-sm">لا توجد رسائل</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {messages.map(msg => (
              <button key={msg.id} onClick={() => setSelected(msg)}
                className={`w-full text-right p-4 rounded-xl border transition-all ${
                  selected?.id === msg.id
                    ? 'border-primary bg-primary/5'
                    : msg.read ? 'bg-surface border-border' : 'bg-surface border-primary/30'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <span className="text-text font-mono text-sm font-bold truncate">{msg.name}</span>
                    </div>
                    <p className="text-text-muted text-xs font-mono mt-0.5">{msg.subject || '—'}</p>
                  </div>
                  <span className="text-text-muted text-[10px] font-mono shrink-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-text font-bold font-mono">{selected.name}</h3>
                    <p className="text-text-muted text-sm font-mono">{selected.email}</p>
                    {selected.subject && <p className="text-primary text-sm font-mono mt-1">{selected.subject}</p>}
                  </div>
                  <span className="text-text-muted text-xs font-mono">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                <div className="bg-surface-lighter rounded-lg p-4 mb-4">
                  <p className="text-text text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRead(selected)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      selected.read ? 'bg-surface-lighter text-text-muted' : 'bg-primary/10 text-primary'
                    }`}>
                    <FiCheck size={14} /> {selected.read ? 'مقروءة' : 'تحديد كمقروءة'}
                  </button>
                  <button onClick={() => handleDelete(selected.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors">
                    <FiTrash2 size={14} /> حذف
                  </button>
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                    <FiMail size={14} /> رد
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-xl border border-border p-8 text-center">
                <FiMail className="text-text-muted text-3xl mx-auto mb-2" />
                <p className="text-text-muted font-mono text-sm">اختر رسالة لعرضها</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
