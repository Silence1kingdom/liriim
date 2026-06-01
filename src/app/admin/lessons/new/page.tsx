'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createLesson, getCategories } from '@/lib/firestore';
import { FREE_LESSONS, PREMIUM_LESSONS } from '@/lib/constants';
import { uploadVideo } from '@/lib/upload';
import type { Category } from '@/lib/types';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiBook, FiTerminal, FiUpload, FiTrash2 } from 'react-icons/fi';

const ALL_CONSTANTS = [...FREE_LESSONS, ...PREMIUM_LESSONS];

function NewLessonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preset = searchParams.get('preset') || '';

  const getInitial = () => {
    if (preset) {
      const found = ALL_CONSTANTS.find(l => l.id === preset);
      if (found) {
        return {
          title: found.titleEn,
          titleAr: found.title,
          description: found.descriptionEn,
          descriptionAr: found.description,
          content: '',
          contentAr: '',
          type: FREE_LESSONS.find(l => l.id === preset) ? 'free' as const : 'premium' as const,
          categoryId: '',
          order: parseInt(preset.split('-')[1]) || 0,
          duration: found.duration,
          command: '',
          commandOutput: '',
          videoUrl: '',
          showDisclaimer: found.id.startsWith('prem-') || found.id === 'free-5' || found.id === 'free-6',
        };
      }
    }
    return {
      title: '', titleAr: '', description: '', descriptionAr: '',
      content: '', contentAr: '', type: 'free' as 'free' | 'premium',
      categoryId: '', order: 0, duration: '',
      command: '', commandOutput: '', videoUrl: '',
      showDisclaimer: false,
    };
  };

  const [form, setForm] = useState(getInitial);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { toast.error('يرجى رفع ملف فيديو'); return; }
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadVideo(file, `lesson_${Date.now()}`, setUploadProgress);
      setForm({ ...form, videoUrl: url });
      toast.success('تم رفع الفيديو');
    } catch {
      toast.error('فشل رفع الفيديو');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveVideo = () => setForm({ ...form, videoUrl: '' });

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
          <span className="text-text-muted text-xs font-mono mr-auto">root@bv-admin:~# nano /admin/lessons/new</span>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
            <FiBook className="text-primary" /> {preset ? 'إنشاء نسخة قابلة للتعديل' : 'إضافة درس جديد'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">النوع *</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'free' | 'premium'})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm">
              <option value="free">مجاني</option>
              <option value="premium">مدفوع</option>
            </select>
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1 font-mono">التصنيف</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
              className="w-full bg-secondary border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none font-mono text-sm">
              <option value="">— بدون تصنيف —</option>
              {categories.filter(c => c.type === form.type).map(c => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
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

        {/* Video Upload */}
        <div>
          <label className="block text-text-muted text-xs mb-1 font-mono">فيديو الدرس (اختياري)</label>
          {form.videoUrl ? (
            <div className="space-y-2">
              <video src={form.videoUrl} controls className="w-full max-h-64 rounded-lg bg-black" />
              <div className="flex items-center gap-2">
                <input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
                  className="flex-1 bg-secondary border border-border rounded-lg py-2 px-3 text-text text-xs font-mono focus:border-primary focus:outline-none" dir="ltr" />
                <button type="button" onClick={handleRemoveVideo}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 bg-secondary border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              {uploading ? (
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-primary text-xs font-mono">جاري الرفع {uploadProgress}%</span>
                </div>
              ) : (
                <div className="text-center">
                  <FiUpload className="text-text-muted mx-auto mb-2" size={24} />
                  <span className="text-text-muted text-xs font-mono">اضغط لرفع فيديو</span>
                </div>
              )}
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Disclaimer Toggle */}
        <div className="flex items-center gap-3 py-2">
          <input type="checkbox" id="showDisclaimer" checked={form.showDisclaimer}
            onChange={e => setForm({...form, showDisclaimer: e.target.checked})}
            className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary" />
          <label htmlFor="showDisclaimer" className="text-text-muted text-xs font-mono cursor-pointer select-none">
            {form.showDisclaimer ? 'التوعية الأمنية ظاهرة' : 'إخفاء التوعية الأمنية'}
          </label>
        </div>

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

export default function NewLessonPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
      <NewLessonForm />
    </Suspense>
  );
}