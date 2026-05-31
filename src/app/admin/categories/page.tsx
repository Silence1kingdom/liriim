'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import type { Category } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', nameAr: '', description: '', descriptionAr: '', type: 'free' as 'free' | 'premium', order: 0, icon: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch { toast.error('فشل تحميل التصنيفات'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', nameAr: '', description: '', descriptionAr: '', type: 'free', order: 0, icon: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, nameAr: cat.nameAr, description: cat.description, descriptionAr: cat.descriptionAr, type: cat.type, order: cat.order, icon: cat.icon });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.nameAr) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success('تم تحديث التصنيف');
      } else {
        await createCategory(form);
        toast.success('تم إنشاء التصنيف');
      }
      resetForm();
      loadCategories();
    } catch { toast.error('فشل الحفظ'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      await deleteCategory(id);
      toast.success('تم الحذف');
      loadCategories();
    } catch { toast.error('فشل الحذف'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">التصنيفات</h1>
          <p className="text-text-muted">{categories.length} تصنيف</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary font-semibold rounded-lg hover:bg-primary-dark transition-colors">
          <FiPlus /> إضافة تصنيف
        </button>
      </div>

      {showForm && (
        <div className="bg-surface rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-text">{editingId ? 'تعديل تصنيف' : 'تصنيف جديد'}</h3>
            <button onClick={resetForm} className="text-text-muted hover:text-text"><FiX /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text text-sm mb-1">الاسم (English)</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-text text-sm mb-1">الاسم (عربي)</label>
              <input type="text" value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-text text-sm mb-1">الوصف (English)</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-text text-sm mb-1">الوصف (عربي)</label>
              <input type="text" value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-text text-sm mb-1">النوع</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'free' | 'premium'})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none">
                <option value="free">مجاني</option>
                <option value="premium">مدفوع</option>
              </select>
            </div>
            <div>
              <label className="block text-text text-sm mb-1">الترتيب</label>
              <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-text text-sm mb-1">الأيقونة</label>
              <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="📁"
                className="w-full bg-secondary border border-border rounded-lg py-2 px-3 text-text focus:border-primary focus:outline-none" />
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary font-semibold rounded-lg hover:bg-primary-dark">
            <FiSave /> حفظ
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-text-muted">لا توجد تصنيفات</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-2xl">{cat.icon || '📁'}</span>
                  <h3 className="font-bold text-text mt-1">{cat.nameAr}</h3>
                  <p className="text-text-muted text-xs">{cat.name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${cat.type === 'free' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                  {cat.type === 'free' ? 'مجاني' : 'مدفوع'}
                </span>
              </div>
              <p className="text-text-muted text-sm mb-3">{cat.descriptionAr}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(cat)} className="p-1.5 text-text-muted hover:text-accent transition-colors"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
