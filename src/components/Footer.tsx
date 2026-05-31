'use client';

import Link from 'next/link';
import { FiTerminal, FiGithub, FiYoutube, FiTwitter, FiFacebook, FiHeart } from 'react-icons/fi';
import { SITE_NAME_AR } from '@/lib/constants';

export default function Footer() {
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
              <span className="text-primary">منصة تعليمية عربية متخصصة في تعليم أوامر لينكس وأدوات التيرمينال من الصفر إلى الاحتراف.</span>
            </p>
          </div>

          <div>
            <h3 className="text-primary font-mono text-sm mb-4 flex items-center gap-2">
              <FiTerminal size={12} /> $ ls courses/
            </h3>
            <ul className="space-y-2">
              <li><Link href="/courses/free" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">├──</span> free/</Link></li>
              <li><Link href="/courses/premium" className="text-text-muted hover:text-primary text-sm transition-colors font-mono flex items-center gap-2"><span className="text-primary">└──</span> premium/</Link></li>
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
            <div className="flex gap-3">
              <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiGithub size={20} /></a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiYoutube size={20} /></a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors"><FiFacebook size={20} /></a>
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
