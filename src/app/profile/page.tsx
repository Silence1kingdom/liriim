'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangContext';
import { updateUserProfile } from '@/lib/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiCalendar, FiAward, FiBook, FiTrendingUp,
  FiStar, FiTerminal, FiSettings, FiEdit2, FiCheck, FiX,
  FiShield, FiClock, FiLoader, FiSave,
} from 'react-icons/fi';
import { FREE_LESSONS, PREMIUM_LESSONS } from '@/lib/constants';
import toast from 'react-hot-toast';

const formatDate = (timestamp: number, lang: 'ar' | 'en'): string => {
  try {
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return '—'; }
};

const formatDateTime = (timestamp: number, lang: 'ar' | 'en'): string => {
  try {
    return new Date(timestamp).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
};

const getRelativeTime = (timestamp: number, lang: 'ar' | 'en'): string => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return lang === 'ar' ? 'اليوم' : 'Today';
  if (days === 1) return lang === 'ar' ? 'أمس' : 'Yesterday';
  if (days < 7) return lang === 'ar' ? `منذ ${days} أيام` : `${days} days ago`;
  return formatDate(timestamp, lang);
};

export default function ProfilePage() {
  const { t, lang, dir } = useT();
  const { firebaseUser, userProfile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const completedCount = Object.values(userProfile?.progress || {}).filter(v => v === 'completed').length;
  const totalLessons = FREE_LESSONS.length + PREMIUM_LESSONS.length;
  const freeCompleted = FREE_LESSONS.filter(l => userProfile?.progress?.[l.id] === 'completed').length;
  const premCompleted = PREMIUM_LESSONS.filter(l => userProfile?.progress?.[l.id] === 'completed').length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (!firebaseUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="terminal-window max-w-md w-full text-center">
          <div className="terminal-window-header justify-center">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
          </div>
          <div className="p-8">
            <FiTerminal className="text-primary text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text font-mono mb-2">{t('profile.loginRequired')}</h2>
            <Link href="/login" className="inline-block mt-4 px-6 py-3 bg-primary text-secondary font-bold rounded-lg font-mono text-sm hover:bg-primary-dark transition-colors">
              $ {t('dash.loginBtn')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditName(userProfile.displayName);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile(firebaseUser.uid, { displayName: editName.trim() });
      await refreshProfile();
      toast.success(t('profile.updated'));
      setEditing(false);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-16" dir={dir}>
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Terminal Window - Profile Header */}
          <div className="terminal-window">
            <div className="terminal-window-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="text-text-muted text-xs font-mono mr-auto">$ cat /home/{userProfile.displayName.replace(/\s+/g, '_').toLowerCase()}/profile</span>
              <FiTerminal size={12} className="text-primary" />
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                  {userProfile.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="text-primary text-3xl" />
                  )}
                </div>
                {userProfile.isPremium && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <FiStar size={14} className="text-secondary" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-secondary border border-border rounded-lg px-3 py-2 text-text font-mono text-lg focus:outline-none focus:border-primary transition-colors flex-1 max-w-xs"
                      autoFocus
                    />
                    <button onClick={handleSave} disabled={saving} className="p-2 text-primary hover:text-primary-dark transition-colors">
                      {saving ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                    </button>
                    <button onClick={() => setEditing(false)} className="p-2 text-text-muted hover:text-text transition-colors">
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-text font-mono">{userProfile.displayName}</h1>
                    <button onClick={handleEdit} className="p-1.5 text-text-muted hover:text-primary transition-colors rounded hover:bg-surface-light">
                      <FiEdit2 size={14} />
                    </button>
                  </div>
                )}
                <p className="text-text-muted font-mono text-sm mt-0.5">{userProfile.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap justify-center md:justify-start">
                  <span className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full ${
                    userProfile.isPremium ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}>
                    {userProfile.isPremium ? <FiStar size={11} /> : <FiShield size={11} />}
                    {userProfile.isPremium ? t('profile.premium') : t('profile.free')}
                  </span>
                  <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                    <FiCalendar size={11} />
                    {t('profile.memberSince')} {formatDate(userProfile.createdAt, lang)}
                  </span>
                </div>
                {userProfile.lastLoginAt && (
                  <p className="text-xs text-text-muted mt-1.5 font-mono flex items-center gap-1 justify-center md:justify-start">
                    <FiClock size={11} />
                    {t('profile.lastLogin')}: {getRelativeTime(userProfile.lastLoginAt, lang)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="terminal-window">
              <div className="p-4 text-center">
                <FiBook className="text-primary mx-auto mb-2" size={20} />
                <div className="text-2xl font-bold text-text font-mono">{completedCount}/{totalLessons}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{t('profile.completedLessons')}</div>
              </div>
            </div>
            <div className="terminal-window">
              <div className="p-4 text-center">
                <FiTrendingUp className="text-primary mx-auto mb-2" size={20} />
                <div className="text-2xl font-bold text-text font-mono">{progressPercent}%</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{t('profile.totalProgress')}</div>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden max-w-[120px] mx-auto">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
            <div className="terminal-window">
              <div className="p-4 text-center">
                <FiStar className={userProfile.isPremium ? 'text-accent mx-auto mb-2' : 'text-text-muted mx-auto mb-2'} size={20} />
                <div className="text-2xl font-bold text-text font-mono">{userProfile.isPremium ? '✓' : '—'}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{t('profile.accountType')}</div>
              </div>
            </div>
            <div className="terminal-window">
              <div className="p-4 text-center">
                <FiAward className="text-primary mx-auto mb-2" size={20} />
                <div className="text-2xl font-bold text-text font-mono">{premCompleted}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{lang === 'ar' ? 'دروس متقدمة' : 'Advanced Done'}</div>
              </div>
            </div>
          </div>

          {/* Progress Breakdown + Account Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Progress */}
            <div className="terminal-window">
              <div className="terminal-window-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="text-text-muted text-xs font-mono mr-auto">{'>'} progress --all</span>
              </div>
              <div className="p-5 space-y-4">
                <h3 className="text-sm font-bold text-text font-mono flex items-center gap-2">
                  <FiTrendingUp className="text-primary" size={14} />
                  {t('profile.stats')}
                </h3>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-text">{lang === 'ar' ? 'الدروس المجانية' : 'Free Lessons'}</span>
                    <span className="text-text-muted">{freeCompleted}/{FREE_LESSONS.length}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(freeCompleted / FREE_LESSONS.length) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-text">{lang === 'ar' ? 'الدروس المدفوعة' : 'Premium Lessons'}</span>
                    <span className="text-text-muted">{premCompleted}/{PREMIUM_LESSONS.length}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${premCompleted > 0 ? (premCompleted / PREMIUM_LESSONS.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="terminal-window">
              <div className="terminal-window-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="text-text-muted text-xs font-mono mr-auto">{'>'} cat account.conf</span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-text font-mono flex items-center gap-2">
                  <FiSettings className="text-primary" size={14} />
                  {t('profile.accountInfo')}
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-xs text-text-muted font-mono flex items-center gap-1.5">
                      <FiMail size={11} /> {t('profile.email')}
                    </span>
                    <span className="text-xs text-text font-mono" dir="ltr">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-xs text-text-muted font-mono flex items-center gap-1.5">
                      <FiAward size={11} /> {t('profile.subscription')}
                    </span>
                    <span className={`text-xs font-mono ${userProfile.isPremium ? 'text-accent' : 'text-text-muted'}`}>
                      {userProfile.isPremium ? t('profile.premium') : t('profile.free')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-xs text-text-muted font-mono flex items-center gap-1.5">
                      <FiCalendar size={11} /> {t('profile.memberSince')}
                    </span>
                    <span className="text-xs text-text font-mono">{formatDate(userProfile.createdAt, lang)}</span>
                  </div>
                  {userProfile.lastLoginAt && (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-text-muted font-mono flex items-center gap-1.5">
                        <FiClock size={11} /> {t('profile.lastLogin')}
                      </span>
                      <span className="text-xs text-text font-mono">{formatDateTime(userProfile.lastLoginAt, lang)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="terminal-window">
            <div className="terminal-window-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="text-text-muted text-xs font-mono mr-auto">{'>'} ls /quick-links/</span>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-bold text-text font-mono mb-3 flex items-center gap-2">
                <FiTerminal className="text-primary" size={14} />
                {t('profile.quickLinks')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/dashboard" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all group">
                  <FiTerminal size={20} className="text-primary group-hover:animate-pulse" />
                  <span className="text-xs font-mono text-text">{t('profile.dashboard')}</span>
                </Link>
                <Link href="/courses" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all group">
                  <FiBook size={20} className="text-primary group-hover:animate-pulse" />
                  <span className="text-xs font-mono text-text">{t('profile.courses')}</span>
                </Link>
                <Link href="/playground" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all group">
                  <FiTerminal size={20} className="text-accent group-hover:animate-pulse" />
                  <span className="text-xs font-mono text-text">{t('profile.playground')}</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all group">
                  <FiSettings size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-xs font-mono text-text">{t('profile.settings')}</span>
                </Link>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
