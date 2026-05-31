'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangContext';
import Link from 'next/link';
import { FiUser, FiMail, FiCalendar, FiAward } from 'react-icons/fi';

export default function ProfilePage() {
  const { t, lang } = useT();
  const { firebaseUser, userProfile } = useAuth();

  if (!firebaseUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">{lang === 'ar' ? 'يرجى تسجيل الدخول' : 'Please login'}</h2>
          <Link href="/login" className="px-6 py-3 bg-primary text-secondary font-bold rounded-lg">{t('dash.loginBtn')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-surface rounded-xl border border-border p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-primary text-3xl" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-text">{userProfile.displayName}</h1>
            <p className="text-text-muted">{userProfile.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-lighter rounded-lg">
              <div className="flex items-center gap-3">
                <FiMail className="text-primary" />
                <div>
                  <div className="text-text text-sm">{t('profile.email')}</div>
                  <div className="text-text-muted text-xs" dir="ltr">{userProfile.email}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-lighter rounded-lg">
              <div className="flex items-center gap-3">
                <FiAward className={userProfile.isPremium ? 'text-accent' : 'text-text-muted'} />
                <div>
                  <div className="text-text text-sm">{t('profile.subscription')}</div>
                  <div className={`text-xs ${userProfile.isPremium ? 'text-accent' : 'text-text-muted'}`}>
                    {userProfile.isPremium ? t('profile.premium') : t('profile.free')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-lighter rounded-lg">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-primary" />
                <div>
                  <div className="text-text text-sm">{t('profile.createdAt')}</div>
                  <div className="text-text-muted text-xs">
                    {new Date(userProfile.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/dashboard" className="flex-1 text-center py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors">
              {t('profile.dashboard')}
            </Link>
            <Link href="/courses" className="flex-1 text-center py-3 border border-border text-text rounded-lg hover:bg-surface-light transition-colors">
              {t('profile.courses')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
