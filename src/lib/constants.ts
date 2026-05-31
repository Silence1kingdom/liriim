export const SITE_NAME = 'B_20';
export const SITE_NAME_AR = 'B_20';

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية', labelEn: 'Home' },
  { href: '/courses', label: 'الكورسات', labelEn: 'Courses' },
  { href: '/courses/free', label: 'المجاني', labelEn: 'Free' },
  { href: '/courses/premium', label: 'المدفوع', labelEn: 'Premium' },
  { href: '/about', label: 'عن المنصة', labelEn: 'About' },
  { href: '/contact', label: 'اتصل بنا', labelEn: 'Contact' },
];

export const FOOTER_LINKS = {
  courses: {
    title: 'الكورسات',
    titleEn: 'Courses',
    links: [
      { href: '/courses/free', label: 'دورات مجانية', labelEn: 'Free Courses' },
      { href: '/courses/premium', label: 'دورات مدفوعة', labelEn: 'Premium Courses' },
    ],
  },
  support: {
    title: 'الدعم',
    titleEn: 'Support',
    links: [
      { href: '/about', label: 'عن المنصة', labelEn: 'About Us' },
      { href: '/contact', label: 'اتصل بنا', labelEn: 'Contact Us' },
    ],
  },
  legal: {
    title: 'قانوني',
    titleEn: 'Legal',
    links: [
      { href: '/privacy', label: 'سياسة الخصوصية', labelEn: 'Privacy Policy' },
      { href: '/terms', label: 'الشروط والأحكام', labelEn: 'Terms of Service' },
    ],
  },
};

export const FREE_LESSONS = [
  {
    id: 'free-1',
    title: 'مقدمة عن التيرمينال',
    titleEn: 'Introduction to Terminal',
    description: 'تعرف على واجهة سطر الأوامر وكيفية فتح التيرمينال',
    descriptionEn: 'Learn about the command line interface and how to open the terminal',
    icon: '🚀',
    duration: '15 دقيقة',
  },
  {
    id: 'free-2',
    title: 'أوامر التنقل بين المجلدات',
    titleEn: 'Navigation Commands',
    description: 'تعلم أوامر cd, ls, pwd للتنقل بين الملفات',
    descriptionEn: 'Learn cd, ls, pwd commands for file navigation',
    icon: '📂',
    duration: '20 دقيقة',
  },
  {
    id: 'free-3',
    title: 'إنشاء و حذف الملفات',
    titleEn: 'Create & Delete Files',
    description: 'أوامر mkdir, touch, rm, cp, mv لإدارة الملفات',
    descriptionEn: 'mkdir, touch, rm, cp, mv commands for file management',
    icon: '📝',
    duration: '25 دقيقة',
  },
  {
    id: 'free-4',
    title: 'عرض محتوى الملفات',
    titleEn: 'View File Contents',
    description: 'تعلم أوامر cat, less, more, head, tail',
    descriptionEn: 'Learn cat, less, more, head, tail commands',
    icon: '📖',
    duration: '20 دقيقة',
  },
  {
    id: 'free-5',
    title: 'الصلاحيات والمستخدمين',
    titleEn: 'Permissions & Users',
    description: 'أوامر chmod, chown, useradd, passwd',
    descriptionEn: 'chmod, chown, useradd, passwd commands',
    icon: '🔐',
    duration: '30 دقيقة',
  },
  {
    id: 'free-6',
    title: 'البحث داخل الملفات',
    titleEn: 'Search Inside Files',
    description: 'أمر grep وكيفية استخدامه للبحث',
    descriptionEn: 'grep command and how to use it for searching',
    icon: '🔍',
    duration: '25 دقيقة',
  },
];

export const PREMIUM_LESSONS = [
  {
    id: 'prem-1',
    title: 'أدوات الاستطلاع وجمع المعلومات',
    titleEn: 'Reconnaissance & Information Gathering',
    description: 'nmap, netcat, whois, dig - أدوات متقدمة لجمع المعلومات',
    descriptionEn: 'Advanced tools for information gathering',
    icon: '🕵️',
    duration: '45 دقيقة',
  },
  {
    id: 'prem-2',
    title: 'اختبار الاختراق - الشبكات',
    titleEn: 'Network Penetration Testing',
    description: 'Wireshark, tcpdump, Metasploit - أدوات اختبار الشبكات',
    descriptionEn: 'Network security testing tools',
    icon: '🌐',
    duration: '60 دقيقة',
  },
  {
    id: 'prem-3',
    title: 'تحليل الثغرات الأمنية',
    titleEn: 'Vulnerability Analysis',
    description: 'OpenVAS, Nikto, SQLMap - اكتشاف الثغرات',
    descriptionEn: 'Vulnerability discovery and analysis',
    icon: '🔓',
    duration: '50 دقيقة',
  },
  {
    id: 'prem-4',
    title: 'أدوات الهندسة الاجتماعية',
    titleEn: 'Social Engineering Tools',
    description: 'SET, BeEF - أدوات متقدمة',
    descriptionEn: 'Advanced social engineering frameworks',
    icon: '🎭',
    duration: '40 دقيقة',
  },
  {
    id: 'prem-5',
    title: 'تحليل الشبكات اللاسلكية',
    titleEn: 'Wireless Network Analysis',
    description: 'Aircrack-ng, Kismet, Reaver - اختبار الشبكات WiFi',
    descriptionEn: 'WiFi network security testing',
    icon: '📡',
    duration: '55 دقيقة',
  },
  {
    id: 'prem-6',
    title: 'أدوات الحماية والدفاع',
    titleEn: 'Defense & Protection Tools',
    description: 'iptables, fail2ban, rkhunter - حماية النظام',
    descriptionEn: 'System protection and hardening',
    icon: '🛡️',
    duration: '45 دقيقة',
  },
];
