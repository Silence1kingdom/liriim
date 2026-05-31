'use client';

import { useState, useEffect } from 'react';
import { saveSiteSettings, getSiteSettings } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: 'B_20',
    siteNameAr: 'B_20',
    description: 'Linux Terminal Learning Platform',
    descriptionAr: 'منصة تعليم أوامر لينكس',
    logoUrl: '',
    primaryColor: '#00ff41',
    premiumPrice: 19,
    currency: 'USD',
    contactEmail: 'support@lirne-terminal.com',
    footerText: 'جميع الحقوق محفوظة',
    footerTextAr: 'جميع الحقوق محفوظة',
    socialLinks: { facebook: '', twitter: '', github: '', youtube: '' },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings) setForm(settings as any);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await saveSiteSettings(form);
      toast.success('تم حفظ الإعدادات');
    } catch {
      toast.error('فشل الحفظ');
    }
  };

  if (loading) {
    return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text mb-6">إعدادات الموقع</h1>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">اسم الموقع (English)</label>
            <input type="text" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">اسم الموقع (عربي)</label>
            <input type="text" value={form.siteNameAr} onChange={e => setForm({...form, siteNameAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">الوصف (English)</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">الوصف (عربي)</label>
            <textarea rows={3} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">اللون الأساسي</label>
            <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})}
              className="w-full h-12 bg-secondary border border-border rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">سعر الباقة ($)</label>
            <input type="number" value={form.premiumPrice} onChange={e => setForm({...form, premiumPrice: parseInt(e.target.value) || 0})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">العملة</label>
            <input type="text" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-text text-sm mb-1">البريد الإلكتروني للدعم</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">نص التذييل (English)</label>
            <input type="text" value={form.footerText} onChange={e => setForm({...form, footerText: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">نص التذييل (عربي)</label>
            <input type="text" value={form.footerTextAr} onChange={e => setForm({...form, footerTextAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <h3 className="text-text font-bold mb-3">روابط التواصل الاجتماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['facebook', 'twitter', 'github', 'youtube'] as const).map((platform) => (
              <div key={platform}>
                <label className="block text-text text-sm mb-1">{platform}</label>
                <input type="url" value={form.socialLinks[platform] || ''} onChange={e => setForm({...form, socialLinks: {...form.socialLinks, [platform]: e.target.value}})}
                  className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors">
          <FiSave /> حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
