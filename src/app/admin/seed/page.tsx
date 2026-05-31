'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';

export default function SeedAdminPage() {
  const { firebaseUser, userProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async () => {
    if (!firebaseUser) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    if (userProfile?.role === 'admin') {
      toast('أنت بالفعل أدمن!');
      return;
    }
    if (!confirm('سيتم ترقية حسابك إلى أدمن. هل أنت متأكد؟')) return;

    setLoading(true);
    try {
      await updateUserProfile(firebaseUser.uid, { role: 'admin' });
      await refreshProfile();
      toast.success('تم ترقيتك إلى أدمن!');
    } catch {
      toast.error('فشلت الترقية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-accent" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">إعداد الأدمن</h1>
          <p className="text-text-muted text-sm mb-6">
            استخدم هذه الصفحة لترقية حسابك إلى أدمن. هذه العملية مخصصة للمرة الأولى فقط.
          </p>

          {userProfile?.role === 'admin' ? (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-primary font-bold">✓ أنت أدمن بالفعل</p>
              <p className="text-text-muted text-sm mt-1">يمكنك الوصول إلى لوحة التحكم</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-6 text-sm text-yellow-400">
                <FiAlertTriangle />
                <span>هذه الصفحة للإعداد الأولي فقط. يُرجى حذفها بعد الاستخدام.</span>
              </div>
              <button
                onClick={handleMakeAdmin}
                disabled={loading || !firebaseUser}
                className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الترقية...' : !firebaseUser ? 'سجل الدخول أولاً' : 'ترقيتي إلى أدمن'}
              </button>
            </>
          )}

          {!firebaseUser && (
            <p className="text-text-muted text-sm mt-4">
              قم بإنشاء حساب جديد أولاً، ثم عد إلى هذه الصفحة لترقيته.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
