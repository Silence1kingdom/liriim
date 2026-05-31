export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: number;
  lastLoginAt?: number;
  isPremium: boolean;
  premiumExpiresAt?: number;
  progress: { [lessonId: string]: 'started' | 'completed' };
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: 'free' | 'premium';
  order: number;
  icon: string;
  createdAt: number;
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  content: string;
  contentAr: string;
  categoryId: string;
  type: 'free' | 'premium';
  order: number;
  duration: string;
  command?: string;
  commandOutput?: string;
  videoUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SiteSettings {
  siteName: string;
  siteNameAr: string;
  description: string;
  descriptionAr: string;
  logoUrl: string;
  primaryColor: string;
  socialLinks: { facebook?: string; twitter?: string; github?: string; youtube?: string };
  premiumPrice: number;
  currency: string;
  contactEmail: string;
  footerText: string;
  footerTextAr: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  stripeSessionId?: string;
}
