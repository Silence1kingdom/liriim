'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLesson } from '@/lib/firestore';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiBook, FiTerminal } from 'react-icons/fi';

export default function NewLessonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    content: '',
    contentAr: '',
    type: 'free' as 'free' | 'premium',
    categoryId: '',
    order: 0,
    duration: '',
    command: '',
    commandOutput: '',
    videoUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.titleAr || !form.contentAr) {
      toast.error('يرجى ملء الحقول المطلوبة (العنوان عربي/إنجليزي والمحتوى عربي)');
      return;
    }
    setLoading(true);
    try {
      await createLesson(form);
      toast.success('تم إنشاء الدرس بنجاح');
      router.push('/admin/lessons');
    } catch {
      toast.error('فشل إنشاء الدرس');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="terminal-window mb-6">
        <div className="terminal-window-header">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="text-text-muted text-xs font-mono mr-auto">root@b20-admin:~# nano /admin/lessons/new</span>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
            <FiBook className="text-primary" /> إضافة درس جديد
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">العنوان (English) *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" dir="ltr" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">العنوان (عربي) *</label>
            <input type="text" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">الوصف (English)</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm" dir="ltr" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">الوصف (عربي)</label>
            <textarea rows={3} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm" />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-text-muted text-xs mb-1 font-mono">المحتوى (عربي) *</label>
          <textarea rows={10} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm leading-relaxed" />
        </div>

        <div>
          <label className="block text-text-muted text-xs mb-1 font-mono">المحتوى (English)</label>
          <textarea rows={10} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm leading-relaxed" dir="ltr" />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">النوع *</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'free' | 'premium'})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm">
              <option value="free">مجاني</option>
              <option value="premium">مدفوع</option>
            </select>
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">الترتيب</label>
            <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">المدة</label>
            <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="مثال: 30 دقيقة"
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" />
          </div>
        </div>

        {/* Command & Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">الأمر (اختياري)</label>
            <input type="text" value={form.command} onChange={e => setForm({...form, command: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">مخرج الأمر (اختياري)</label>
            <textarea rows={3} value={form.commandOutput} onChange={e => setForm({...form, commandOutput: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-text-muted text-xs mb-1 font-mono">رابط فيديو (اختياري)</label>
          <input type="url" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-mono">
            <FiSave /> {loading ? 'جاري الحفظ...' : 'حفظ الدرس'}
          </button>
          <button type="button" onClick={() => router.push('/admin/lessons')}
            className="flex items-center gap-2 px-6 py-3 border border-border text-text rounded-lg hover:bg-surface-light transition-colors font-mono">
            <FiX /> إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
