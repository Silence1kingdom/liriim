'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/lib/types';

const SETTINGS_DOC_ID = 'main';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

const defaultSettings: SiteSettings = {
  siteName: 'Black Vector',
  siteNameAr: 'بلاك فيكتور',
  description: 'منصة تعليمية متكاملة لتعلم أوامر لينكس من الصفر إلى الاحتراف. An integrated platform for learning Linux commands and terminal from scratch.',
  descriptionAr: 'منصة تعليمية متكاملة لتعلم أوامر لينكس والتعامل مع التيرمينال من الصفر إلى الاحتراف',
  logoUrl: '',
  primaryColor: '#00ff41',
  premiumPrice: 19,
  currency: 'USD',
  supportEmail: '',
  footerText: 'All rights reserved. Made with ❤️ for the Linux community',
  footerTextAr: 'جميع الحقوق محفوظة. صُنع بحب لمجتمع لينكس',
  socialGithub: '',
  socialTwitter: '',
  socialYoutube: '',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  loading: true,
  error: null,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);

    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as SiteSettings;
          setSettings({ ...defaultSettings, ...data });
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        setSettings(defaultSettings);
      }
    );

    return () => unsub();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export { defaultSettings };
