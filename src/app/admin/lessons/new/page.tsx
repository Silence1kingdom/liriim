'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLesson } from '@/lib/firestore';
import toast from 'react-hot-toast';

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
      toast.error('يرجى ملء الحقول المطلوبة');
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
      <h1 className="text-3xl font-bold text-text mb-6">إضافة درس جديد</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">العنوان (English) *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">العنوان (عربي) *</label>
            <input type="text" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">الوصف (English)</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">الوصف (عربي)</label>
            <textarea rows={3} value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-text text-sm mb-1">المحتوى (عربي) *</label>
          <textarea rows={10} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">النوع *</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'free' | 'premium'})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none">
              <option value="free">مجاني</option>
              <option value="premium">مدفوع</option>
            </select>
          </div>
          <div>
            <label className="block text-text text-sm mb-1">الترتيب</label>
            <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">المدة</label>
            <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="مثال: 30 دقيقة"
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">الأمر (اختياري)</label>
            <input type="text" value={form.command} onChange={e => setForm({...form, command: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">مخرج الأمر (اختياري)</label>
            <textarea rows={3} value={form.commandOutput} onChange={e => setForm({...form, commandOutput: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-text text-sm mb-1">رابط فيديو (اختياري)</label>
          <input type="url" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
        </div>

        <button type="submit" disabled={loading}
          className="px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? 'جاري الحفظ...' : 'حفظ الدرس'}
        </button>
      </form>
    </div>
  );
}
