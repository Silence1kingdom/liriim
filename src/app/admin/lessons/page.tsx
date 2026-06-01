'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiBook, FiTerminal, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getLessons, deleteLesson, getCategories } from '@/lib/firestore';
import type { Lesson, Category } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    Promise.all([loadLessons(), loadCategories()]);
  }, []);

  const loadLessons = async () => {
    try {
      const data = await getLessons();
      setLessons(data);
    } catch { toast.error('فشل تحميل الدروس'); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try { setCategories(await getCategories()); } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
      toast.success('تم حذف الدرس');
    } catch { toast.error('فشل الحذف'); }
  };

  const filtered = lessons
    .filter(l => filter === 'all' || l.type === filter)
    .filter(l => categoryFilter === 'all' || l.categoryId === categoryFilter)
    .filter(l => !search || (l.titleAr || '').includes(search) || (l.title || '').toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.nameAr || '—';

  return (
    <div>
      {/* Header */}
      <div className="terminal-window mb-6">
        <div className="terminal-window-header">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="text-text-muted text-xs font-mono mr-auto">root@b20-admin:~# ls -la /admin/lessons/</span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text font-mono flex items-center gap-2">
                <FiBook className="text-primary" /> إدارة الدروس
              </h1>
              <p className="text-text-muted text-sm font-mono mt-1">
                <span className="text-primary">$</span> ls lessons/ | wc -l
                <span className="text-text-muted"> &rarr; {lessons.length} {lessons.length === 1 ? 'درس' : 'دروس'}</span>
              </p>
            </div>
            <Link href="/admin/lessons/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors font-mono text-sm">
              <FiPlus /> إضافة درس
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <FiFilter className="text-text-muted" size={16} />
          <div className="flex gap-1">
            {(['all', 'free', 'premium'] as const).map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  filter === f ? 'bg-primary text-secondary' : 'bg-surface-lighter text-text-muted hover:text-text'
                }`}
              >
                {f === 'all' ? 'الكل' : f === 'free' ? 'مجاني' : 'مدفوع'}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-border" />
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="bg-surface-lighter border border-border rounded-lg px-3 py-1.5 text-text text-xs font-mono focus:border-primary focus:outline-none">
            <option value="all">جميع التصنيفات</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>
          <div className="flex-1" />
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث..."
              className="bg-surface-lighter border border-border rounded-lg pr-9 pl-3 py-1.5 text-text text-xs font-mono focus:border-primary focus:outline-none w-48"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : paged.length === 0 ? (
        <div className="terminal-window text-center py-12">
          <div className="p-8">
            <FiBook className="text-text-muted text-4xl mx-auto mb-3" />
            <p className="text-text-muted font-mono text-sm">لا توجد دروس تطابق البحث</p>
            {search && <button onClick={() => setSearch('')} className="mt-2 text-primary text-xs font-mono hover:underline">مسح البحث</button>}
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-lighter">
              <tr>
                <th className="text-right p-4 text-text text-sm font-mono">#</th>
                <th className="text-right p-4 text-text text-sm font-mono">العنوان</th>
                <th className="text-right p-4 text-text text-sm font-mono">التصنيف</th>
                <th className="text-right p-4 text-text text-sm font-mono">النوع</th>
                <th className="text-right p-4 text-text text-sm font-mono">الترتيب</th>
                <th className="text-left p-4 text-text text-sm font-mono">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((lesson, idx) => (
                <tr key={lesson.id} className="border-t border-border hover:bg-surface-light transition-colors">
                  <td className="p-4 text-text-muted text-sm font-mono">{(page - 1) * perPage + idx + 1}</td>
                  <td className="p-4">
                    <div className="text-text font-mono text-sm">{lesson.titleAr || lesson.title}</div>
                    {lesson.command && <div className="text-text-muted text-[10px] font-mono mt-0.5">$ {lesson.command}</div>}
                  </td>
                  <td className="p-4 text-text-muted text-xs font-mono">{getCategoryName(lesson.categoryId)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                      lesson.type === 'free' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}>
                      {lesson.type === 'free' ? 'مجاني' : 'مدفوع'}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted text-sm font-mono">{lesson.order}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-start">
                      <Link href={`/lessons/${lesson.id}`} className="p-2 text-text-muted hover:text-primary transition-colors rounded hover:bg-primary/5" title="عرض">
                        <FiEye size={15} />
                      </Link>
                      <Link href={`/admin/lessons/${lesson.id}`} className="p-2 text-text-muted hover:text-accent transition-colors rounded hover:bg-accent/5" title="تعديل">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(lesson.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-400/5" title="حذف">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text hover:border-primary/30 disabled:opacity-30 transition-colors">
            <FiChevronRight size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-mono transition-colors ${
                page === p ? 'bg-primary text-secondary' : 'bg-surface border border-border text-text-muted hover:text-text'
              }`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text hover:border-primary/30 disabled:opacity-30 transition-colors">
            <FiChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
