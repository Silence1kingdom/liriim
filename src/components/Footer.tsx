'use client';

import Link from 'next/link';
import { FiTerminal, FiGithub, FiYoutube, FiTwitter, FiFacebook, FiHeart, FiInstagram, FiSend } from 'react-icons/fi';
import { SITE_NAME_AR } from '@/lib/constants';
import { useT } from '@/contexts/LangContext';

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-surface border-t border-border mt-20">
      {/* ASCII art divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <pre className="text-center text-[0.5rem] leading-tight text-border font-mono select-none">
{`╔══════════════════════════════════════════════════════════╗
║  ██████   ██████  ██████      ████████ ██    ██ ██████   ║
║  ██   ██ ██    ██ ██   ██        ██    ██    ██ ██   ██  ║
║  ██████  ██    ██ ██████         ██    ██    ██ ██████   ║
║  ██   ██ ██    ██ ██   ██        ██    ██    ██ ██   ██  ║
║  ██████   ██████  ██████         ██     ██████  ██████   ║
╚══════════════════════════════════════════════════════════╝`}
        </pre>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl mb-4 font-mono group">
              <FiTerminal className="group-hover:animate-pulse" />
              {'>'} {SITE_NAME_AR}
            </Link>
            <p className="text-text-muted text-sm leading-relaxed font-mono">
              $ cat /etc/b20/description
              <br />
              <span className="text-primary">{t('footer.brand')}</span>
            </p>
          </div>

          <div>
            <h3 className="text-primary font-mono text-sm mb-4 flex items-center gap-2">
              <FiTerminal size={12} /> $ ls courses/
            </h3>
            <ul className="space-y-2">
              <li><Link href="/courses/free" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">├──</span> free/</Link></li>
              <li><Link href="/courses/premium" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">├──</span> premium/</Link></li>
              <li><Link href="/pricing" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">└──</span> pricing/</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-mono text-sm mb-4 flex items-center gap-2">
              <FiTerminal size={12} /> $ ls support/
            </h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">├──</span> about.md</Link></li>
              <li><Link href="/contact" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">└──</span> contact.md</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-mono text-sm mb-4 flex items-center gap-2">
              <FiTerminal size={12} /> $ cat /etc/social
            </h3>
            <div className="flex gap-3 flex-wrap">
              <a href="https://youtube.com/@dark-vector-23" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="YouTube"><FiYoutube size={20} /></a>
              <a href="https://www.tiktok.com/@dark.vactor" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="TikTok"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
              <a href="https://www.facebook.com/share/1JM5SqDuBs/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Facebook"><FiFacebook size={20} /></a>
              <a href="https://x.com/darkvectord44t" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="X (Twitter)"><FiTwitter size={20} /></a>
              <a href="https://t.me/blackvector54" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Telegram"><FiSend size={20} /></a>
              <a href="https://www.instagram.com/black_61161" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Instagram"><FiInstagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-text-muted text-sm font-mono">
            <span className="text-primary">$</span> echo &quot;© {new Date().getFullYear()} {SITE_NAME_AR} - All rights reserved. Made with <FiHeart size={10} className="inline text-accent" /> for the Linux community&quot;
          </p>
          <div className="mt-2">
            <span className="text-primary text-xs font-mono">b20@terminal:~$</span>
            <span className="text-text-muted text-xs font-mono"> _ — — — — — — — — — — — — — — — _</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
