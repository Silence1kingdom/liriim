'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { getLessons, deleteLesson } from '@/lib/firestore';
import type { Lesson } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await getLessons();
      setLessons(data);
    } catch {
      toast.error('فشل تحميل الدروس');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
      toast.success('تم حذف الدرس');
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const filtered = filter === 'all' ? lessons : lessons.filter(l => l.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">إدارة الدروس</h1>
          <p className="text-text-muted">{lessons.length} درس</p>
        </div>
        <Link href="/admin/lessons/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary font-semibold rounded-lg hover:bg-primary-dark transition-colors">
          <FiPlus /> إضافة درس
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'free', 'premium'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === f ? 'bg-primary text-secondary' : 'bg-surface text-text-muted hover:text-text'
            }`}
          >
            {f === 'all' ? 'الكل' : f === 'free' ? 'مجاني' : 'مدفوع'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">لا توجد دروس</div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-lighter">
              <tr>
                <th className="text-right p-4 text-text text-sm">العنوان</th>
                <th className="text-right p-4 text-text text-sm">النوع</th>
                <th className="text-right p-4 text-text text-sm">الترتيب</th>
                <th className="text-left p-4 text-text text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson.id} className="border-t border-border hover:bg-surface-light transition-colors">
                  <td className="p-4 text-text">{lesson.titleAr || lesson.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${lesson.type === 'free' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {lesson.type === 'free' ? 'مجاني' : 'مدفوع'}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted">{lesson.order}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-start">
                      <Link href={`/lessons/${lesson.id}`} className="p-2 text-text-muted hover:text-primary transition-colors"><FiEye size={16} /></Link>
                      <Link href={`/admin/lessons/${lesson.id}`} className="p-2 text-text-muted hover:text-accent transition-colors"><FiEdit2 size={16} /></Link>
                      <button onClick={() => handleDelete(lesson.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
