'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiGrid, FiUsers, FiSettings, FiTerminal, FiArrowRight } from 'react-icons/fi';

const adminLinks = [
  { href: '/admin', label: 'لوحة التحكم', icon: FiHome },
  { href: '/admin/lessons', label: 'الدروس', icon: FiBook },
  { href: '/admin/categories', label: 'التصنيفات', icon: FiGrid },
  { href: '/admin/users', label: 'المستخدمين', icon: FiUsers },
  { href: '/admin/settings', label: 'الإعدادات', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface border-l border-border min-h-screen p-4 hidden lg:block">
      <Link href="/admin" className="flex items-center gap-2 text-primary font-bold text-lg mb-8">
        <FiTerminal />
        لوحة الإدارة
      </Link>
      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:text-text hover:bg-surface-light'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="flex items-center gap-2 mt-8 px-4 py-3 text-text-muted hover:text-primary text-sm transition-colors"
      >
        <FiArrowRight />
        العودة للموقع
      </Link>
    </aside>
  );
}
