'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLesson, updateLesson } from '@/lib/firestore';
import toast from 'react-hot-toast';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      try {
        const lesson = await getLesson(id);
        if (lesson) {
          setForm({
            title: lesson.title || '',
            titleAr: lesson.titleAr || '',
            description: lesson.description || '',
            descriptionAr: lesson.descriptionAr || '',
            content: lesson.content || '',
            contentAr: lesson.contentAr || '',
            type: lesson.type || 'free',
            categoryId: lesson.categoryId || '',
            order: lesson.order || 0,
            duration: lesson.duration || '',
            command: lesson.command || '',
            commandOutput: lesson.commandOutput || '',
            videoUrl: lesson.videoUrl || '',
          });
        }
      } catch {
        toast.error('فشل تحميل الدرس');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateLesson(id, form);
      toast.success('تم تحديث الدرس');
      router.push('/admin/lessons');
    } catch {
      toast.error('فشل التحديث');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text mb-6">تعديل الدرس</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">العنوان (English)</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-text text-sm mb-1">العنوان (عربي)</label>
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
          <label className="block text-text text-sm mb-1">المحتوى (عربي)</label>
          <textarea rows={10} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})}
            className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none resize-none font-mono text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-text text-sm mb-1">النوع</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
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
            <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          <button type="button" onClick={() => router.push('/admin/lessons')}
            className="px-6 py-3 border border-border text-text rounded-lg hover:bg-surface-light transition-colors">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
