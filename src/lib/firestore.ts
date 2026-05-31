import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category, Lesson, ContactMessage, SiteSettings } from './types';

// Categories
export const getCategories = async (type?: 'free' | 'premium'): Promise<Category[]> => {
  const constraints: any[] = [orderBy('order', 'asc')];
  if (type) constraints.unshift(where('type', '==', type));
  const q = query(collection(db, 'categories'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
};

export const getCategory = async (id: string): Promise<Category | null> => {
  const snap = await getDoc(doc(db, 'categories', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Category) : null;
};

export const createCategory = async (data: Omit<Category, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'categories'), { ...data, createdAt: Date.now() });
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  await updateDoc(doc(db, 'categories', id), data);
};

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(db, 'categories', id));
};

// Lessons
export const getLessons = async (type?: 'free' | 'premium', categoryId?: string): Promise<Lesson[]> => {
  const constraints: any[] = [orderBy('order', 'asc')];
  if (type) constraints.unshift(where('type', '==', type));
  if (categoryId) constraints.unshift(where('categoryId', '==', categoryId));
  const q = query(collection(db, 'lessons'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lesson));
};

export const getLesson = async (id: string): Promise<Lesson | null> => {
  const snap = await getDoc(doc(db, 'lessons', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lesson) : null;
};

export const createLesson = async (data: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Date.now();
  return addDoc(collection(db, 'lessons'), { ...data, createdAt: now, updatedAt: now });
};

export const updateLesson = async (id: string, data: Partial<Lesson>) => {
  await updateDoc(doc(db, 'lessons', id), { ...data, updatedAt: Date.now() });
};

export const deleteLesson = async (id: string) => {
  await deleteDoc(doc(db, 'lessons', id));
};

// Contact Messages
export const createContactMessage = async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
  return addDoc(collection(db, 'messages'), { ...data, read: false, createdAt: Date.now() });
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
};

// Site Settings
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const snap = await getDocs(collection(db, 'settings'));
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
};

export const saveSiteSettings = async (data: Partial<SiteSettings>) => {
  const snap = await getDocs(collection(db, 'settings'));
  if (snap.empty) {
    await addDoc(collection(db, 'settings'), data);
  } else {
    await updateDoc(doc(db, 'settings', snap.docs[0].id), data);
  }
};
