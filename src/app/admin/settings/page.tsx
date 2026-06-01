'use client';

import { useState, useEffect } from 'react';
import { saveSiteSettings, getSiteSettings } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { FiSave, FiTerminal, FiGlobe, FiMail, FiDollarSign, FiEdit3, FiType } from 'react-icons/fi';

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
    footerText: 'All rights reserved.',
    footerTextAr: 'جميع الحقوق محفوظة',
    socialLinks: { facebook: '', twitter: '', github: '', youtube: '', tiktok: '', telegram: '', instagram: '' },
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
    } catch { toast.error('فشل الحفظ'); }
  };

  if (loading) {
    return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="terminal-window mb-6">
        <div className="terminal-window-header">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="text-text-muted text-xs font-mono mr-auto">root@b20-admin:~# nano /etc/b20/config</span>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
            <FiTerminal className="text-primary" /> إعدادات الموقع
          </h1>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
        {/* Site Name */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiType className="text-primary" /> اسم الموقع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">English</label>
              <input type="text" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" dir="ltr" />
            </div>
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">عربي</label>
              <input type="text" value={form.siteNameAr} onChange={e => setForm({...form, siteNameAr: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiTerminal className="text-primary" /> الوصف</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">English</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" />
            </div>
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">عربي</label>
              <textarea rows={3} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiEdit3 className="text-primary" /> العلامة التجارية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">اللون الأساسي</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})}
                  className="w-12 h-12 bg-secondary border border-border rounded-lg cursor-pointer" />
                <span className="text-text-muted text-xs font-mono">{form.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">سعر الباقة</label>
              <input type="number" value={form.premiumPrice} onChange={e => setForm({...form, premiumPrice: parseInt(e.target.value) || 0})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
            </div>
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">العملة</label>
              <input type="text" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiMail className="text-primary" /> التواصل</h3>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">البريد الإلكتروني للدعم</label>
            <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" dir="ltr" />
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiTerminal className="text-primary" /> التذييل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">English</label>
              <input type="text" value={form.footerText} onChange={e => setForm({...form, footerText: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" dir="ltr" />
            </div>
            <div>
              <label className="block text-text-muted text-xs mb-1 font-mono">عربي</label>
              <input type="text" value={form.footerTextAr} onChange={e => setForm({...form, footerTextAr: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-1">
          <h3 className="text-text font-bold font-mono text-sm flex items-center gap-2"><FiGlobe className="text-primary" /> روابط التواصل الاجتماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['facebook', 'twitter', 'github', 'youtube', 'tiktok', 'telegram', 'instagram'] as const).map((platform) => (
              <div key={platform}>
                <label className="block text-text-muted text-xs mb-1 font-mono">{platform}</label>
                <input type="url" value={form.socialLinks[platform] || ''} onChange={e => setForm({...form, socialLinks: {...form.socialLinks, [platform]: e.target.value}})}
                  className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="border-t border-border pt-6">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors font-mono">
            <FiSave /> حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
