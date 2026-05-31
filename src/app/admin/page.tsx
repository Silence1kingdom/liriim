'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangContext';
import Link from 'next/link';
import { FiBook, FiGrid, FiUsers, FiSettings, FiTerminal } from 'react-icons/fi';
import { getLessons, getCategories } from '@/lib/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboard() {
  const { t } = useT();
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({ lessons: 0, categories: 0, users: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [lessons, categories, usersSnap] = await Promise.all([
          getLessons(),
          getCategories(),
          getDocs(collection(db, 'users')),
        ]);
        setStats({ lessons: lessons.length, categories: categories.length, users: usersSnap.size });
      } catch {}
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{t('admin.dashboard')}</h1>
        <p className="text-text-muted">{t('admin.welcome')} {userProfile?.displayName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FiBook, label: t('admin.lessons'), count: String(stats.lessons), href: '/admin/lessons', color: 'text-primary' },
          { icon: FiGrid, label: t('admin.categories'), count: String(stats.categories), href: '/admin/categories', color: 'text-accent' },
          { icon: FiUsers, label: t('admin.users'), count: String(stats.users), href: '/admin/users', color: 'text-blue-400' },
          { icon: FiSettings, label: t('admin.settings'), count: '—', href: '/admin/settings', color: 'text-text' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="p-6 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all">
            <item.icon className={`${item.color} text-3xl mb-2`} />
            <div className="text-2xl font-bold text-text">{item.count}</div>
            <div className="text-text-muted text-sm">{item.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
          <FiTerminal className="text-primary" />
          {t('admin.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/lessons/new" className="p-4 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
            <h3 className="font-bold text-primary mb-1">{t('admin.addLesson')}</h3>
            <p className="text-text-muted text-sm">{t('admin.addLessonDesc')}</p>
          </Link>
          <Link href="/admin/categories" className="p-4 bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/20 transition-colors">
            <h3 className="font-bold text-accent mb-1">{t('admin.manageCategories')}</h3>
            <p className="text-text-muted text-sm">{t('admin.manageCategoriesDesc')}</p>
          </Link>
          <Link href="/admin/users" className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/20 hover:bg-blue-400/20 transition-colors">
            <h3 className="font-bold text-blue-400 mb-1">{t('admin.manageUsers')}</h3>
            <p className="text-text-muted text-sm">{t('admin.manageUsersDesc')}</p>
          </Link>
          <Link href="/admin/settings" className="p-4 bg-surface-lighter rounded-lg border border-border hover:bg-surface-light transition-colors">
            <h3 className="font-bold text-text mb-1">{t('admin.siteSettings')}</h3>
            <p className="text-text-muted text-sm">{t('admin.siteSettingsDesc')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
