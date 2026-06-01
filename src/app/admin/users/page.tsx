'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import toast from 'react-hot-toast';
import { FiShield, FiStar, FiSearch, FiX, FiTrash2, FiUser, FiTerminal } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<(User & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'premium' | 'free'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as User & { id: string })));
      } catch { toast.error('فشل تحميل المستخدمين'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const togglePremium = async (userId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isPremium: !current,
        premiumExpiresAt: !current ? Date.now() + 365 * 24 * 60 * 60 * 1000 : null,
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isPremium: !current } : u));
      toast.success(`تم ${!current ? 'تفعيل' : 'إلغاء'} الاشتراك المدفوع`);
    } catch { toast.error('فشل التحديث'); }
  };

  const toggleAdmin = async (userId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: current ? 'user' : 'admin' });
      setUsers(users.map(u => u.id === userId ? { ...u, role: current ? 'user' as const : 'admin' as const } : u));
      toast.success(`تم ${!current ? 'ترقية' : 'إزالة'} صلاحيات الأدمن`);
    } catch { toast.error('فشل التحديث'); }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`حذف المستخدم ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
      toast.success('تم حذف المستخدم');
    } catch { toast.error('فشل الحذف'); }
  };

  const filtered = users
    .filter(u => filter === 'all' || (filter === 'admin' && u.role === 'admin') || (filter === 'premium' && u.isPremium) || (filter === 'free' && !u.isPremium && u.role !== 'admin'))
    .filter(u => !search || (u.displayName || '').includes(search) || (u.email || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="terminal-window mb-6">
        <div className="terminal-window-header">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="text-text-muted text-xs font-mono mr-auto">root@bv-admin:~# cat /etc/passwd</span>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
            <FiUser className="text-blue-400" /> إدارة المستخدمين
          </h1>
          <p className="text-text-muted text-sm font-mono mt-1">
            <span className="text-primary">$</span> wc -l /etc/passwd
            <span className="text-text-muted"> &rarr; {users.length} {users.length === 1 ? 'مستخدم' : 'مستخدم'}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1">
            {(['all', 'admin', 'premium', 'free'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  filter === f ? (f === 'admin' ? 'bg-accent/10 text-accent' : f === 'premium' ? 'bg-primary/10 text-primary' : 'bg-surface-lighter text-text') : 'bg-surface-lighter text-text-muted hover:text-text'
                }`}>
                {f === 'all' ? 'الكل' : f === 'admin' ? 'أدمن' : f === 'premium' ? 'مشترك' : 'مجاني'}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="bg-surface-lighter border border-border rounded-lg pr-9 pl-3 py-1.5 text-text text-xs font-mono focus:border-primary focus:outline-none w-56"
            />
            {search && <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"><FiX size={14} /></button>}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="terminal-window text-center py-12">
          <div className="p-8">
            <FiUser className="text-text-muted text-4xl mx-auto mb-3" />
            <p className="text-text-muted font-mono text-sm">لا يوجد مستخدمين</p>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-lighter">
              <tr>
                <th className="text-right p-4 text-text text-sm font-mono">الاسم</th>
                <th className="text-right p-4 text-text text-sm font-mono">البريد</th>
                <th className="text-right p-4 text-text text-sm font-mono">الدور</th>
                <th className="text-right p-4 text-text text-sm font-mono">الباقة</th>
                <th className="text-right p-4 text-text text-sm font-mono">التقدم</th>
                <th className="text-left p-4 text-text text-sm font-mono">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-surface-light transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiUser className="text-primary" size={12} />
                      </div>
                      <span className="text-text font-mono text-sm">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted text-xs font-mono" dir="ltr">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                      user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-surface-lighter text-text-muted'
                    }`}>
                      {user.role === 'admin' ? 'أدمن' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isPremium ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono w-fit"><FiStar size={10} /> مشترك</span>
                    ) : (
                      <span className="text-text-muted text-xs font-mono">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-text-muted text-xs font-mono">
                      {Object.values(user.progress || {}).filter(v => v === 'completed').length} درس
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-start">
                      <button onClick={() => togglePremium(user.id, user.isPremium)}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                          user.isPremium ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20' : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}>
                        {user.isPremium ? 'إلغاء الباقة' : 'تفعيل الباقة'}
                      </button>
                      <button onClick={() => toggleAdmin(user.id, user.role === 'admin')}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                          user.role === 'admin' ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20' : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}>
                        {user.role === 'admin' ? 'إزالة أدمن' : 'جعله أدمن'}
                      </button>
                      <button onClick={() => handleDelete(user.id, user.email)}
                        className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-400/5" title="حذف">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
