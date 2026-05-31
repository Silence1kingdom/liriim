'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import toast from 'react-hot-toast';
import { FiShield, FiStar } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<(User & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as User & { id: string }));
        setUsers(data);
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
      setUsers(users.map(u => u.id === userId ? { ...u, role: current ? 'user' : 'admin' } : u));
      toast.success(`تم ${!current ? 'ترقية' : 'إزالة'} صلاحيات الأدمن`);
    } catch { toast.error('فشل التحديث'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">إدارة المستخدمين</h1>
        <p className="text-text-muted">{users.length} مستخدم</p>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-lighter">
              <tr>
                <th className="text-right p-4 text-text text-sm">الاسم</th>
                <th className="text-right p-4 text-text text-sm">البريد</th>
                <th className="text-right p-4 text-text text-sm">الدور</th>
                <th className="text-right p-4 text-text text-sm">الباقة</th>
                <th className="text-left p-4 text-text text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-surface-light transition-colors">
                  <td className="p-4 text-text">{user.displayName}</td>
                  <td className="p-4 text-text-muted text-sm" dir="ltr">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-surface-lighter text-text-muted'}`}>
                      {user.role === 'admin' ? 'أدمن' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isPremium ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"><FiStar size={12} /> مشترك</span>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-start">
                      <button onClick={() => togglePremium(user.id, user.isPremium)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors ${user.isPremium ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                        {user.isPremium ? 'إلغاء الباقة' : 'تفعيل الباقة'}
                      </button>
                      <button onClick={() => toggleAdmin(user.id, user.role === 'admin')}
                        className={`px-3 py-1.5 rounded text-xs transition-colors ${user.role === 'admin' ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}>
                        {user.role === 'admin' ? 'إزالة أدمن' : 'جعله أدمن'}
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
