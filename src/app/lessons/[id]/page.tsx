'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiChevronRight, FiChevronLeft, FiCheckCircle, FiTerminal, FiAward, FiHeart } from 'react-icons/fi';
import TerminalDemo from '@/components/TerminalDemo';
import LessonTraining from '@/components/LessonTraining';
import PremiumGuard from '@/components/PremiumGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangContext';
import { updateUserProfile } from '@/lib/auth';
import { toggleFavorite } from '@/lib/firestore';
import { FREE_LESSONS, PREMIUM_LESSONS } from '@/lib/constants';
import toast from 'react-hot-toast';

const lessonData: { [key: string]: any } = {
  'free-1': {
    title: 'مقدمة عن التيرمينال',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">ما هو التيرمينال؟</h2>
      <p class="text-text-muted leading-relaxed mb-4">التيرمينال (Terminal) أو واجهة سطر الأوامر (CLI) هي واجهة نصية تسمح لك بالتفاعل مع نظام التشغيل عن طريق كتابة الأوامر النصية بدلاً من استخدام الواجهة الرسومية (GUI).</p>
      <p class="text-text-muted leading-relaxed mb-4">في لينكس، التيرمينال هو أداة قوية جداً تمنحك تحكماً كاملاً في النظام. يمكنك من خلاله إدارة الملفات، تثبيت البرامج، مراقبة النظام، وأتمتة المهام.</p>
      <h3 class="text-xl font-bold text-text mt-5 mb-3">كيف تفتح التيرمينال؟</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>اختصار لوحة المفاتيح: <code class="text-primary">Ctrl + Alt + T</code></li>
        <li>البحث عن "Terminal" في قائمة التطبيقات</li>
        <li>النقر بالزر الأيمن داخل مجلد واختيار "Open in Terminal"</li>
      </ul>
      <h3 class="text-xl font-bold text-text mt-5 mb-3">مكونات سطر الأوامر</h3>
      <p class="text-text-muted leading-relaxed mb-4">عند فتح التيرمينال، سترى sesuatu مثل: <code class="text-primary">user@host:~$</code>. هذا يسمى الـ Prompt ويعني أن النظام جاهز لاستقبال الأوامر.</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">user</code> - اسم المستخدم الحالي</li>
        <li><code class="text-primary">host</code> - اسم الجهاز</li>
        <li><code class="text-primary">~</code> - المسار الحالي (home directory)</li>
        <li><code class="text-primary">$</code> - يعني أنك مستخدم عادي (أما # فتعني root)</li>
      </ul>
    `,
    commands: [
      { cmd: 'echo "Hello, Linux!"', output: 'Hello, Linux!' },
      { cmd: 'date', output: 'Sat May 30 10:30:00 UTC 2026' },
      { cmd: 'cal', output: '      May 2026\nSu Mo Tu We Th Fr Sa\n                1  2\n 3  4  5  6  7  8  9\n10 11 12 13 14 15 16\n17 18 19 20 21 22 23\n24 25 26 27 28 29 30\n31' },
      { cmd: 'whoami', output: 'user' },
      { cmd: 'uname -a', output: 'Linux hostname 6.8.0-35-generic #36-Ubuntu SMP x86_64 GNU/Linux' },
    ],
  },
  'free-2': {
    title: 'أوامر التنقل بين المجلدات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">التنقل في نظام الملفات</h2>
      <p class="text-text-muted leading-relaxed mb-4">نظام الملفات في لينكس يبدأ من الجذر <code class="text-primary">/</code> ويتفرع إلى مجلدات متعددة. لإتقان التيرمينال، يجب أولاً إتقان أوامر التنقل.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">الأمر pwd</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض مسار المجلد الحالي (Print Working Directory). مفيد جداً عندما تريد التأكد من مكانك في النظام.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">الأمر ls</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض محتويات المجلد الحالي. من أكثر الأوامر استخداماً.</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">ls</code> - عرض الملفات والمجلدات</li>
        <li><code class="text-primary">ls -l</code> - عرض بتفاصيل (النوع، الصلاحيات، الحجم، التاريخ)</li>
        <li><code class="text-primary">ls -a</code> - عرض الملفات المخفية (التي تبدأ بنقطة)</li>
        <li><code class="text-primary">ls -la</code> - دمج الخيارين السابقين</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">الأمر cd</h3>
      <p class="text-text-muted leading-relaxed mb-4">يستخدم للتنقل بين المجلدات (Change Directory).</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">cd /</code> - الذهاب إلى المجلد الجذر</li>
        <li><code class="text-primary">cd ~</code> أو <code class="text-primary">cd</code> - الذهاب إلى المجلد الرئيسي (Home)</li>
        <li><code class="text-primary">cd ..</code> - الرجوع إلى المجلد الأب</li>
        <li><code class="text-primary">cd ../..</code> - الرجوع مجلدين للأعلى</li>
        <li><code class="text-primary">cd Documents</code> - الدخول إلى مجلد Documents</li>
      </ul>
    `,
    commands: [
      { cmd: 'pwd', output: '/home/user' },
      { cmd: 'ls -la', output: 'total 32\ndrwxr-xr-x 5 user user 4096 May 30 10:00 .\ndrwxr-xr-x 3 root root 4096 May 28 09:00 ..\ndrwxr-xr-x 2 user user 4096 May 30 09:55 Documents\ndrwxr-xr-x 2 user user 4096 May 30 09:55 Downloads\n-rw-r--r-- 1 user user 8980 May 30 09:50 .bashrc' },
      { cmd: 'cd Documents', output: '' },
      { cmd: 'pwd', output: '/home/user/Documents' },
      { cmd: 'cd ~', output: '' },
      { cmd: 'pwd', output: '/home/user' },
    ],
  },
  'free-3': {
    title: 'إنشاء و حذف الملفات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">إدارة الملفات والمجلدات</h2>
      <p class="text-text-muted leading-relaxed mb-4">في هذا الدرس ستتعلم كيفية إنشاء، نسخ، نقل، وحذف الملفات والمجلدات من خلال التيرمينال.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">mkdir - إنشاء مجلد</h3>
      <p class="text-text-muted leading-relaxed mb-4">لإنشاء مجلد جديد: <code class="text-primary">mkdir my_folder</code>. يمكنك إنشاء مجلدات متداخلة باستخدام <code class="text-primary">mkdir -p a/b/c</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">touch - إنشاء ملف</h3>
      <p class="text-text-muted leading-relaxed mb-4">ينشئ ملفاً فارغاً: <code class="text-primary">touch file.txt</code>. يمكن أيضاً إنشاء عدة ملفات مرة واحدة: <code class="text-primary">touch f1.txt f2.txt f3.txt</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">cp - نسخ</h3>
      <p class="text-text-muted leading-relaxed mb-4">لنسخ ملف: <code class="text-primary">cp source.txt destination.txt</code>. لنسخ مجلد بكامله: <code class="text-primary">cp -r folder1 folder2</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">mv - نقل أو إعادة تسمية</h3>
      <p class="text-text-muted leading-relaxed mb-4">لنقل ملف: <code class="text-primary">mv file.txt /path/to/destination/</code>. لإعادة تسمية: <code class="text-primary">mv oldname.txt newname.txt</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">rm - حذف</h3>
      <p class="text-text-muted leading-relaxed mb-4">لحذف ملف: <code class="text-primary">rm file.txt</code>. لحذف مجلد ومحتوياته: <code class="text-primary">rm -rf folder</code>.</p>
      <div class="p-4 bg-red-500/10 rounded-lg border border-red-500/20 mb-4 text-sm text-red-400">⚠️ تحذير: الأمر rm -rf خطير جداً ولا يسألك قبل الحذف. استخدمه بحذر.</div>
    `,
    commands: [
      { cmd: 'mkdir my_project', output: '' },
      { cmd: 'touch my_project/index.html my_project/style.css', output: '' },
      { cmd: 'ls -la my_project/', output: 'total 0\ndrwxr-xr-x 2 user user 60 May 30 10:05 .\ndrwxr-xr-x 3 user user 60 May 30 10:05 ..\n-rw-r--r-- 1 user user  0 May 30 10:05 index.html\n-rw-r--r-- 1 user user  0 May 30 10:05 style.css' },
      { cmd: 'cp my_project/index.html my_project/index.html.bak', output: '' },
      { cmd: 'mv my_project/index.html.bak my_project/backup.html', output: '' },
      { cmd: 'ls my_project/', output: 'backup.html  index.html  style.css' },
    ],
  },
  'free-4': {
    title: 'عرض محتوى الملفات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">عرض ومشاهدة محتوى الملفات</h2>
      <p class="text-text-muted leading-relaxed mb-4">لينكس يوفر عدة أوامر لعرض محتوى الملفات النصية، كل منها له استخدامات مختلفة حسب حجم الملف والغرض.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">cat - عرض كامل</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض محتوى الملف كاملاً: <code class="text-primary">cat file.txt</code>. مفيد للملفات الصغيرة. يمكن أيضاً دمج ملفين: <code class="text-primary">cat f1.txt f2.txt > merged.txt</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">less - عرض متقطع</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض الملف شاشة واحدة في كل مرة. استخدم المسافة للتنقل للأمام، <code class="text-primary">b</code> للخلف، <code class="text-primary">q</code> للخروج.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">head - أول سطور</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض أول 10 سطور من الملف: <code class="text-primary">head file.txt</code>. لتحديد عدد معين: <code class="text-primary">head -n 20 file.txt</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">tail - آخر سطور</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعرض آخر 10 سطور: <code class="text-primary">tail file.txt</code>. مفيد جداً لمشاهدة سجلات النظام: <code class="text-primary">tail -f /var/log/syslog</code> (متابعة مستمرة).</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">wc - عد الكلمات</h3>
      <p class="text-text-muted leading-relaxed mb-4">يعد الأسطر والكلمات والأحرف: <code class="text-primary">wc file.txt</code>.</p>
    `,
    commands: [
      { cmd: 'echo "Hello World\\nLine 2\\nLine 3" > sample.txt', output: '' },
      { cmd: 'cat sample.txt', output: 'Hello World\nLine 2\nLine 3' },
      { cmd: 'wc sample.txt', output: ' 3  5 27 sample.txt' },
      { cmd: 'head -n 2 /etc/passwd', output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin' },
    ],
  },
  'free-5': {
    title: 'الصلاحيات والمستخدمين',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">صلاحيات الملفات في لينكس</h2>
      <p class="text-text-muted leading-relaxed mb-4">كل ملف ومجلد في لينكس له ثلاث مجموعات من الصلاحيات: للمالك (owner)، للمجموعة (group)، وللآخرين (others).</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">قراءة الصلاحيات</h3>
      <p class="text-text-muted leading-relaxed mb-4">عند كتابة <code class="text-primary">ls -l</code>، ترى شيء مثل <code class="text-primary">-rwxr-xr--</code>:</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>الحرف الأول: <code class="text-primary">-</code> (ملف) أو <code class="text-primary">d</code> (مجلد)</li>
        <li>الأحرف 2-4: صلاحيات المالك (r=قراءة, w=كتابة, x=تنفيذ)</li>
        <li>الأحرف 5-7: صلاحيات المجموعة</li>
        <li>الأحرف 8-10: صلاحيات الآخرين</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">chmod - تغيير الصلاحيات</h3>
      <p class="text-text-muted leading-relaxed mb-4">يمكنك استخدام الأرقام: <code class="text-primary">chmod 755 script.sh</code> (rwxr-xr-x). أو الحروف: <code class="text-primary">chmod +x script.sh</code> (إضافة تنفيذ للجميع).</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">chown - تغيير المالك</h3>
      <p class="text-text-muted leading-relaxed mb-4">لتغيير مالك الملف: <code class="text-primary">sudo chown user:group file.txt</code>.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">إدارة المستخدمين</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">sudo useradd newuser</code> - إضافة مستخدم</li>
        <li><code class="text-primary">sudo passwd newuser</code> - تعيين كلمة مرور</li>
        <li><code class="text-primary">sudo usermod -aG sudo newuser</code> - إضافة المستخدم لمجموعة sudo</li>
        <li><code class="text-primary">sudo deluser newuser</code> - حذف مستخدم</li>
      </ul>
    `,
    commands: [
      { cmd: 'ls -l', output: 'total 4\n-rw-r--r-- 1 user user  15 May 30 10:10 file.txt\ndrwxr-xr-x 2 user user 120 May 30 10:11 scripts' },
      { cmd: 'chmod +x file.txt', output: '' },
      { cmd: 'ls -l file.txt', output: '-rwxr-xr-x 1 user user 15 May 30 10:10 file.txt' },
      { cmd: 'whoami', output: 'user' },
      { cmd: 'id', output: 'uid=1000(user) gid=1000(user) groups=1000(user),4(adm),27(sudo)' },
    ],
  },
  'free-6': {
    title: 'البحث داخل الملفات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">grep - أداة البحث القوية</h2>
      <p class="text-text-muted leading-relaxed mb-4">الأمر <code class="text-primary">grep</code> هو أداة بحث متقدمة تبحث عن أنماط نصية داخل الملفات. اسمه مشتق من "Global Regular Expression Print".</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">الاستخدامات الأساسية</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">grep "word" file.txt</code> - بحث بسيط</li>
        <li><code class="text-primary">grep -i "word" file.txt</code> - بحث مع تجاهل حالة الأحرف</li>
        <li><code class="text-primary">grep -r "word" /path/</code> - بحث في كل المجلدات الفرعية</li>
        <li><code class="text-primary">grep -n "word" file.txt</code> - عرض رقم السطر</li>
        <li><code class="text-primary">grep -c "word" file.txt</code> - عدد مرات التكرار</li>
        <li><code class="text-primary">grep -v "word" file.txt</code> - عكس البحث (كل ما لا يحتوي)</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">التعبيرات المنتظمة (Regex)</h3>
      <p class="text-text-muted leading-relaxed mb-4">grep يدعم التعبيرات المنتظمة للبحث المتقدم:</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">grep "^Start" file.txt</code> - سطور تبدأ بـ Start</li>
        <li><code class="text-primary">grep "end$" file.txt</code> - سطور تنتهي بـ end</li>
        <li><code class="text-primary">grep "[0-9]" file.txt</code> - سطور تحتوي على أرقام</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">أدوات بحث أخرى</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">find /path -name "*.txt"</code> - البحث عن ملفات باسم معين</li>
        <li><code class="text-primary">locate file.txt</code> - بحث سريع في قاعدة البيانات</li>
        <li><code class="text-primary">which command</code> - أين يوجد أمر معين</li>
      </ul>
    `,
    commands: [
      { cmd: 'echo -e "apple\\nbanana\\ncherry\\nApple\\nDate\\nApricot" > fruits.txt', output: '' },
      { cmd: 'grep "apple" fruits.txt', output: 'apple' },
      { cmd: 'grep -i "apple" fruits.txt', output: 'apple\nApple\nApricot' },
      { cmd: 'grep -c "a" fruits.txt', output: '4' },
      { cmd: 'grep "^A" fruits.txt', output: 'Apple\nApricot' },
    ],
  },
};

const premiumLessonData: { [key: string]: any } = {
  'prem-1': {
    title: 'أدوات الاستطلاع وجمع المعلومات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">جمع المعلومات (Reconnaissance)</h2>
      <p class="text-text-muted leading-relaxed mb-4">مرحلة جمع المعلومات هي أول وأهم مرحلة في اختبار الاختراق. تعتمد على جمع أكبر قدر من المعلومات عن الهدف قبل البدء بأي هجوم.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">nmap - ماسح الشبكات</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة قوية لمسح الشبكات واكتشاف الأجهزة والخدمات.</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">nmap -sP 192.168.1.0/24</code> - اكتشاف الأجهزة في الشبكة</li>
        <li><code class="text-primary">nmap -sS target.com</code> - SYN scan سريع</li>
        <li><code class="text-primary">nmap -sV target.com</code> - معرفة إصدارات الخدمات</li>
        <li><code class="text-primary">nmap -O target.com</code> - اكتشاف نظام التشغيل</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">whois - معلومات النطاق</h3>
      <p class="text-text-muted leading-relaxed mb-4">يكشف معلومات عن مالك النطاق، تاريخ التسجيل، وخوادم DNS.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">dig - استعلامات DNS</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة متقدمة للاستعلام عن سجلات DNS المختلفة: A, MX, NS, TXT وغيرها.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">netcat - سكين الجيش السويسري</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة متعددة الاستخدامات: مسح المنافذ، نقل الملفات، إنشاء خادم بسيط.</p>
    `,
    commands: [
      { cmd: 'nmap -sP 192.168.1.0/24', output: 'Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0010s latency).\nNmap scan report for 192.168.1.10\nHost is up (0.0020s latency).\nNmap done: 256 IP addresses (2 hosts up)' },
      { cmd: 'whois example.com', output: 'Domain Name: EXAMPLE.COM\nRegistry Domain ID: 2336799_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.iana.org\nCreation Date: 1995-08-14T04:00:00Z\nRegistry Expiry Date: 2026-08-13T04:00:00Z' },
      { cmd: 'dig example.com A', output: '; <<>> DiG 9.18 <<>> example.com A\n;; ANSWER SECTION:\nexample.com. 3600 IN A 93.184.216.34' },
      { cmd: 'nmap -sV 192.168.1.10', output: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1\n80/tcp open  http    Apache 2.4.57\n443/tcp open https   nginx 1.24.0' },
    ],
  },
  'prem-2': {
    title: 'اختبار الاختراق - الشبكات',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">اختبار اختراق الشبكات</h2>
      <p class="text-text-muted leading-relaxed mb-4">في هذا الدرس نتعمق في أدوات تحليل واختبار أمن الشبكات المستخدمة في الاختراق الأخلاقي.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Wireshark/tcpdump - تحليل الحزم</h3>
      <p class="text-text-muted leading-relaxed mb-4">أدوات التقاط وتحليل حزم الشبكة. <code class="text-primary">tcpdump</code> للطرفية و Wireshark للواجهة الرسومية.</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">tcpdump -i eth0</code> - التقاط كل الحزم على الواجهة eth0</li>
        <li><code class="text-primary">tcpdump port 80</code> - التقاط حزم HTTP فقط</li>
        <li><code class="text-primary">tcpdump host 192.168.1.1</code> - حزم من/إلى مضيف معين</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Metasploit</h3>
      <p class="text-text-muted leading-relaxed mb-4">إطار عمل متكامل لاختبار الاختراق. يحتوي على آلاف الـ exploits والـ payloads.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">arp-scan - اكتشاف الأجهزة</h3>
      <p class="text-text-muted leading-relaxed mb-4">يكشف جميع الأجهزة المتصلة بالشبكة المحلية عبر بروتوكول ARP.</p>
    `,
    commands: [
      { cmd: 'tcpdump -i eth0 -c 5', output: 'tcpdump: listening on eth0, link-type EN10MB\n10:30:01.123456 IP 192.168.1.10.443 > 10.0.0.1.54321: Flags [P.], seq 1:100, ack 1, win 65535\n10:30:01.123789 IP 10.0.0.1.54321 > 192.168.1.10.443: Flags [.], ack 100, win 65535' },
      { cmd: 'arp-scan --localnet', output: 'Interface: eth0, type: EN10MB, MAC: 00:11:22:33:44:55\n192.168.1.1   aa:bb:cc:dd:ee:ff  Router\n192.168.1.10  11:22:33:44:55:66  Linux-Device' },
      { cmd: 'nc -zv 192.168.1.10 22 80 443', output: 'Connection to 192.168.1.10 22 port [tcp/ssh] succeeded!\nConnection to 192.168.1.10 80 port [tcp/http] succeeded!\nConnection to 192.168.1.10 443 port [tcp/https] succeeded!' },
    ],
  },
  'prem-3': {
    title: 'تحليل الثغرات الأمنية',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">اكتشاف وتحليل الثغرات الأمنية</h2>
      <p class="text-text-muted leading-relaxed mb-4">بعد جمع المعلومات، تأتي مرحلة اكتشاف الثغرات الأمنية في الأنظمة والتطبيقات.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Nikto - ماسح خوادم الويب</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة مفتوحة المصدر لمسح خوادم الويب واكتشاف الثغرات الشائعة، الملفات الخطيرة، وإعدادات الخادم الخاطئة.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">SQLMap - حقن SQL</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة آلية لاكتشاف واستغلال ثغرات حقن SQL في قواعد البيانات.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">OpenVAS</h3>
      <p class="text-text-muted leading-relaxed mb-4">ماسح ثغرات شامل يفحص النظام بالكامل ويقدم تقارير مفصلة عن الثغرات مع درجات الخطورة.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Searchsploit</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة للبحث في قاعدة بيانات Exploit-DB عن الثغرات المعروفة والـ exploits المتاحة.</p>
    `,
    commands: [
      { cmd: 'nikto -h http://127.0.0.1', output: '- Nikto v2.5.0\n+ Target IP: 127.0.0.1\n+ Server: Apache/2.4.57\n+ /: Server leaks inodes via ETags.\n+ /: The X-XSS-Protection header is not defined.\n+ /: The X-Content-Type-Options header is not set.\n+ /config.php: Potentially dangerous backup file found.' },
      { cmd: 'sqlmap -u "http://test.com/page?id=1" --batch', output: '[INFO] testing connection to target\n[INFO] testing SQL injection on GET parameter id\n[INFO] GET parameter id is vulnerable to SQL injection\n[INFO] fetching database names\navailable databases [2]: information_schema, testdb' },
    ],
  },
  'prem-4': {
    title: 'أدوات الهندسة الاجتماعية',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">الهندسة الاجتماعية</h2>
      <p class="text-text-muted leading-relaxed mb-4">الهندسة الاجتماعية هي استغلال العامل البشري للوصول إلى المعلومات أو الأنظمة. غالباً ما تكون أسهل من اختراق الأنظمة تقنياً.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">SET - Social Engineering Toolkit</h3>
      <p class="text-text-muted leading-relaxed mb-4">إطار عمل متكامل للهندسة الاجتماعية، من تطوير TrustedSec. يحتوي على:</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>هجمات التصيد (Phishing) - صفحات تسجيل دخول مزيفة</li>
        <li>هجمات الوسائط القابلة للإزالة (USB)</li>
        <li>هجمات إنشاء الـ payloads</li>
        <li>هجمات الاستغلال الجماعية</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">BeEF - Browser Exploitation</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة تستهدف متصفح الضحية. بعد أن يزور الضحية رابطاً خبيثاً، يمكن التحكم في متصفحه لتنفيذ أوامر متعددة.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">الوقاية من الهندسة الاجتماعية</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>التدريب والتوعية المستمرة للموظفين</li>
        <li>عدم النقر على الروابط المشبوهة</li>
        <li>التحقق من هوية المرسل قبل مشاركة المعلومات</li>
        <li>استخدام المصادقة متعددة العوامل (MFA)</li>
      </ul>
    `,
    commands: [
      { cmd: 'echo "[+] Starting SET - Social Engineering Toolkit"', output: '[+] Starting SET - Social Engineering Toolkit\n[+] Select attack vector:\n1) Spear-Phishing\n2) Website Attack Vectors\n3) Infectious Media Generator\n4) Mass Mailer Attack' },
      { cmd: 'echo "[+] BeEF hook URL: http://attacker:3000/hook.js"', output: '[+] BeEF hook URL: http://attacker:3000/hook.js\n[+] Browser connected: 192.168.1.10 - Chrome 120\n[+] Modules available: 45' },
    ],
  },
  'prem-5': {
    title: 'تحليل الشبكات اللاسلكية',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">اختبار أمن الشبكات اللاسلكية</h2>
      <p class="text-text-muted leading-relaxed mb-4">الشبكات اللاسلكية (WiFi) غالباً ما تكون نقطة الضعف في أي مؤسسة. تعلم كيفية اختبارها وتأمينها.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Aircrack-ng</h3>
      <p class="text-text-muted leading-relaxed mb-4">مجموعة أدوات كاملة لاختبار أمن الشبكات اللاسلكية:</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">airmon-ng</code> - تفعيل وضع المراقبة (Monitor Mode)</li>
        <li><code class="text-primary">airodump-ng</code> - التقاط الحزم اللاسلكية</li>
        <li><code class="text-primary">aireplay-ng</code> - حقن الحزم</li>
        <li><code class="text-primary">aircrack-ng</code> - كسر تشفير WEP/WPA</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">Kismet</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة كشف شبكات لاسلكية سلبية (Passive). تكتشف الشبكات المخفية والـ SSID بكشف عناوين MAC.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">نصائح لتأمين الشبكة اللاسلكية</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>استخدام WPA3 أو على الأقل WPA2 مع كلمة مرور قوية</li>
        <li>تعطيل WPS (WiFi Protected Setup)</li>
        <li>إخفاء SSID (مع العلم أنها ليست حماية كافية)</li>
        <li>تفعيل MAC Address Filtering</li>
        <li>تحديث firmware الراوتر باستمرار</li>
      </ul>
    `,
    commands: [
      { cmd: 'iwconfig', output: 'eth0      no wireless extensions.\nwlan0     IEEE 802.11  ESSID:off/any\n          Mode:Managed  Access Point: Not-Associated' },
      { cmd: 'airodump-ng wlan0', output: 'BSSID              PWR  Beacons  Data  CH  ENC  ESSID\nAA:BB:CC:11:22:33  -45  120      32    6  WPA2  HomeWiFi\nDD:EE:FF:44:55:66  -60   85      12   11  WPA2  OfficeNet' },
      { cmd: 'echo "[+] Scanning with Kismet..."', output: '[+] Scanning with Kismet...\n[+] Found networks: 8\n[+] Encrypted: 6  Open: 2\n[+] Hidden networks detected: 1' },
    ],
  },
  'prem-6': {
    title: 'أدوات الحماية والدفاع',
    content: `
      <h2 class="text-2xl font-bold text-text mt-6 mb-3">الدفاع والحماية في لينكس</h2>
      <p class="text-text-muted leading-relaxed mb-4">الحماية لا تقل أهمية عن الاختراق. في هذا الدرس نتعلم أدوات الدفاع والحماية الأساسية.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">iptables/nftables - جدار الحماية</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة تصفية الحزم (Firewall) المدمجة في لينكس:</p>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li><code class="text-primary">iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT</code> - السماح SSH من الشبكة المحلية</li>
        <li><code class="text-primary">iptables -A INPUT -p tcp --dport 22 -j DROP</code> - منع SSH من كل المصادر الأخرى</li>
        <li><code class="text-primary">iptables -L</code> - عرض القواعد الحالية</li>
      </ul>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">fail2ban</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة تمنع الهجمات التخمينية (Brute Force). تراقب سجلات النظام وتحظر الـ IPs التي تفشل في تسجيل الدخول.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">rkhunter - كشف الجذور الخفية</h3>
      <p class="text-text-muted leading-relaxed mb-4">أداة تفحص النظام بحثاً عن Rootkits والبرامج الضارة والثغرات الأمنية.</p>

      <h3 class="text-xl font-bold text-text mt-5 mb-3">أفضل ممارسات الحماية</h3>
      <ul class="list-disc list-inside text-text-muted space-y-2 mb-4">
        <li>تحديث النظام باستمرار: <code class="text-primary">sudo apt update && sudo apt upgrade</code></li>
        <li>تعطيل خدمات SSH غير الضرورية</li>
        <li>استخدام مفاتيح SSH بدلاً من كلمات المرور</li>
        <li>تفعيل SELinux أو AppArmor</li>
        <li>مراقبة السجلات باستمرار: <code class="text-primary">journalctl -xe</code></li>
        <li>عمل نسخ احتياطية منتظمة</li>
      </ul>
    `,
    commands: [
      { cmd: 'sudo iptables -L -n', output: 'Chain INPUT (policy ACCEPT)\n target     prot opt source         destination\n ACCEPT     tcp  --  192.168.1.0/24  0.0.0.0/0   tcp dpt:22\n DROP       tcp  --  0.0.0.0/0       0.0.0.0/0   tcp dpt:22\n ACCEPT     all  --  0.0.0.0/0       0.0.0.0/0   ctstate ESTABLISHED' },
      { cmd: 'sudo fail2ban-client status sshd', output: 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 3\n|  |- Total failed: 45\n|- Actions\n   |- Currently banned: 2\n   |- Total banned: 8' },
      { cmd: 'sudo rkhunter --check', output: '[ System Checks ]\n[ Checking binaries        ] OK\n[ Checking file properties ] OK\n[ Checking rootkits        ] OK\n[ Checking network         ] OK\n[ Checking kernel modules  ] OK\nSystem checks summary: All OK' },
    ],
  },
};

const trainingSteps: { [key: string]: { instruction: string; instructionEn: string; hint: string; hintEn: string }[] } = {
  'free-1': [
    { instruction: 'اكتب الأمر whoami لمعرفة اسم المستخدم', instructionEn: 'Type whoami to see your username', hint: 'اكتب whoami ثم اضغط Enter', hintEn: 'Type whoami and press Enter' },
    { instruction: 'استخدم الأمر pwd لمعرفة مسارك الحالي', instructionEn: 'Use pwd to see your current path', hint: 'اكتب pwd ثم Enter', hintEn: 'Type pwd then Enter' },
    { instruction: 'أظهر التاريخ والوقت باستخدام date', instructionEn: 'Show date and time using date', hint: 'الأمر هو: date', hintEn: 'The command is: date' },
  ],
  'free-2': [
    { instruction: 'استخدم pwd لترى أين أنت', instructionEn: 'Use pwd to see where you are', hint: 'اكتب pwd', hintEn: 'Type pwd' },
    { instruction: 'استخدم ls -la لعرض كل الملفات', instructionEn: 'Use ls -la to list all files', hint: 'اكتب ls -la', hintEn: 'Type ls -la' },
    { instruction: 'انتقل إلى مجلد Documents باستخدام cd', instructionEn: 'Navigate to Documents using cd', hint: 'اكتب cd Documents', hintEn: 'Type cd Documents' },
  ],
  'free-3': [
    { instruction: 'أنشئ مجلد باسم test_folder', instructionEn: 'Create a folder called test_folder', hint: 'استخدم mkdir test_folder', hintEn: 'Use mkdir test_folder' },
    { instruction: 'أنشئ ملفاً باسم myfile.txt', instructionEn: 'Create a file called myfile.txt', hint: 'استخدم touch myfile.txt', hintEn: 'Use touch myfile.txt' },
    { instruction: 'انسخ الملف myfile.txt إلى myfile_copy.txt', instructionEn: 'Copy myfile.txt to myfile_copy.txt', hint: 'cp myfile.txt myfile_copy.txt', hintEn: 'Use cp' },
    { instruction: 'احذف الملف myfile_copy.txt', instructionEn: 'Delete myfile_copy.txt', hint: 'rm myfile_copy.txt', hintEn: 'Use rm' },
  ],
  'free-4': [
    { instruction: 'اعرض محتوى ملف notes.txt', instructionEn: 'Show the content of notes.txt', hint: 'cat Documents/notes.txt', hintEn: 'Use cat with the path' },
    { instruction: 'اعرض أول سطرين من ملف .bashrc', instructionEn: 'Show the first 2 lines of .bashrc', hint: 'head -n 2 ~/.bashrc', hintEn: 'Use head -n 2' },
    { instruction: 'استخدم wc لعد سطور ملف notes.txt', instructionEn: 'Use wc to count lines in notes.txt', hint: 'wc Documents/notes.txt', hintEn: 'Use wc command' },
  ],
  'free-5': [
    { instruction: 'اعرض صلاحيات الملفات في المجلد الحالي', instructionEn: 'Show file permissions in current directory', hint: 'ls -l', hintEn: 'Use ls -l' },
    { instruction: 'أضف صلاحية التنفيذ لملف practice.sh', instructionEn: 'Add execute permission to practice.sh', hint: 'chmod +x practice.sh', hintEn: 'Use chmod +x' },
    { instruction: 'تحقق من صلاحيات practice.sh بعد التعديل', instructionEn: 'Check practice.sh permissions after change', hint: 'ls -l practice.sh', hintEn: 'Use ls -l' },
  ],
  'free-6': [
    { instruction: 'ابحث عن كلمة "Linux" في ملف notes.txt', instructionEn: 'Search for "Linux" in notes.txt', hint: 'grep "Linux" Documents/notes.txt', hintEn: 'Use grep' },
    { instruction: 'ابحث عن "todo" متجاهلاً حالة الأحرف', instructionEn: 'Search for "todo" case insensitive', hint: 'grep -i "todo" Documents/todo.md', hintEn: 'Use grep -i' },
    { instruction: 'ابحث عن كلمة "echo" في كل الملفات', instructionEn: 'Search for "echo" in all files', hint: 'grep -r "echo" .', hintEn: 'Use grep -r' },
  ],
  'prem-1': [
    { instruction: 'استخدم whois لاكتشاف معلومات عن example.com', instructionEn: 'Use whois to discover info about example.com', hint: 'example.com مدرج كبيانات تجريبية', hintEn: 'Use whois example.com' },
    { instruction: 'استخدم dig لاستعلام DNS', instructionEn: 'Use dig for DNS query', hint: 'dig example.com A', hintEn: 'Run dig example.com A' },
  ],
  'prem-2': [
    { instruction: 'استخدم tcpdump لالتقاط 3 حزم', instructionEn: 'Use tcpdump to capture 3 packets', hint: 'tcpdump -c 3', hintEn: 'Use tcpdump -c 3' },
    { instruction: 'استخدم netcat لفحص المنافذ', instructionEn: 'Use netcat to scan ports', hint: 'nc -zv 127.0.0.1 22 80', hintEn: 'Use nc -zv' },
  ],
  'prem-3': [
    { instruction: 'استخدم nikto لمسح localhost', instructionEn: 'Use nikto to scan localhost', hint: 'nikto -h http://127.0.0.1', hintEn: 'Use nikto -h' },
    { instruction: 'استخدم sqlmap لاختبار حقن SQL', instructionEn: 'Use sqlmap to test SQL injection', hint: 'sqlmap -u "http://test.com/page?id=1" --batch', hintEn: 'Use sqlmap command' },
  ],
  'prem-4': [
    { instruction: 'شغّل SET وأظهر قائمة الهجمات', instructionEn: 'Run SET and show attack list', hint: 'echo "[+] Starting SET..."', hintEn: 'Use the echo command' },
    { instruction: 'اعرض رابط BeEF hook', instructionEn: 'Show BeEF hook URL', hint: 'echo "[+] BeEF hook URL: ..."', hintEn: 'Use echo' },
  ],
  'prem-5': [
    { instruction: 'استخدم iwconfig لمشاهدة الواجهات', instructionEn: 'Use iwconfig to see interfaces', hint: 'iwconfig', hintEn: 'Type iwconfig' },
    { instruction: 'استخدم airodump-ng للمسح', instructionEn: 'Use airodump-ng to scan', hint: 'airodump-ng wlan0', hintEn: 'Use airodump-ng wlan0' },
  ],
  'prem-6': [
    { instruction: 'عرض قواعد iptables الحالية', instructionEn: 'Show current iptables rules', hint: 'sudo iptables -L -n', hintEn: 'Use iptables -L -n' },
    { instruction: 'اعرض حالة fail2ban لخدمة sshd', instructionEn: 'Show fail2ban status for sshd', hint: 'sudo fail2ban-client status sshd', hintEn: 'Use fail2ban-client' },
  ],
};

const allLessons = [...FREE_LESSONS, ...PREMIUM_LESSONS];

export default function LessonPage() {
  const { t, lang } = useT();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { firebaseUser, userProfile, refreshProfile } = useAuth();

  const isPremium = id?.startsWith('prem-');
  const source = isPremium ? premiumLessonData : lessonData;
  const data = source[id];
  const lessonMeta = allLessons.find(l => l.id === id);
  const isCompleted = userProfile?.progress?.[id] === 'completed';

  const currentIndex = allLessons.findIndex(l => l.id === id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isFavorited = userProfile?.favorites?.includes(id) || false;

  const handleToggleFavorite = useCallback(async () => {
    if (!firebaseUser) return;
    const updated = await toggleFavorite(firebaseUser.uid, id, userProfile?.favorites);
    await refreshProfile();
    toast.success(updated.includes(id) ? t('fav.added') : t('fav.removed'));
  }, [firebaseUser, id, userProfile, refreshProfile, t]);

  const handleMarkComplete = useCallback(async () => {
    if (!firebaseUser || !userProfile) {
      toast.error(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first');
      return;
    }
    try {
      const newProgress = { ...userProfile.progress, [id]: 'completed' as const };
      await updateUserProfile(firebaseUser.uid, { progress: newProgress });
      await refreshProfile();
      toast.success(lang === 'ar' ? 'تم إكمال الدرس!' : 'Lesson completed!');
    } catch {
      toast.error(lang === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  }, [firebaseUser, userProfile, id, refreshProfile, lang]);

  if (!data) {
    return (
      <div className="pt-24 text-center">
        <h1 className="text-2xl text-text">{t('lesson.notFound')}</h1>
        <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">{t('lesson.backToCourses')}</Link>
      </div>
    );
  }

  const lessonContent = (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
            <FiClock />
            <span>{lessonMeta?.duration || (lang === 'ar' ? '20 دقيقة' : '20 min')}</span>
            <span className="mx-2">•</span>
            <span className={isPremium ? 'text-accent' : 'text-primary'}>
              {isPremium ? t('lesson.paid') : t('lesson.free')}
            </span>
            {isCompleted && (
              <>
                <span className="mx-2">•</span>
                <span className="text-primary flex items-center gap-1">
                  <FiCheckCircle /> {t('lesson.completed')}
                </span>
              </>
            )}
            {firebaseUser && (
              <>
                <span className="mx-2">•</span>
                <button onClick={handleToggleFavorite} className="flex items-center gap-1 hover:scale-110 transition-transform" title={isFavorited ? t('fav.remove') : t('fav.add')}>
                  <FiHeart size={14} className={isFavorited ? 'text-red-400 fill-red-400' : 'text-text-muted'} />
                </button>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text mb-6">{data.title}</h1>

          {/* Security Disclaimer */}
          {(data.showDisclaimer || id.startsWith('prem-') || id === 'free-5' || id === 'free-6') && (
            <div className="mb-8 p-4 rounded-lg border border-accent/30 bg-accent/5">
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl shrink-0 mt-0.5">⚠️</span>
                <div>
                  <h4 className="text-accent font-bold font-mono text-sm mb-1">{t('lesson.disclaimer')}</h4>
                  <p className="text-text-muted text-xs font-mono leading-relaxed">{t('lesson.disclaimerText')}</p>
                </div>
              </div>
            </div>
          )}

          <div
            className="prose prose-invert max-w-none mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          {data.videoUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text mb-4">{t('lesson.videoLesson')}</h3>
              <div className="rounded-lg overflow-hidden border border-border bg-black">
                <video src={data.videoUrl} controls className="w-full max-h-[500px]" />
              </div>
            </div>
          )}

          {data.commands && data.commands.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text mb-4">{t('lesson.tryYourself')}</h3>
              <TerminalDemo commands={data.commands} autoRun={false} />
            </div>
          )}

          {trainingSteps[id] && trainingSteps[id].length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                <FiTerminal size={20} className="text-primary" />
                {t('training.title')}
              </h3>
              <LessonTraining steps={trainingSteps[id]} lessonId={id} />
            </div>
          )}

          {/* Mark complete + Quiz + Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
            <div className="flex gap-2">
              {prevLesson && (
                <Link
                  href={`/lessons/${prevLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-text rounded-lg hover:bg-surface-light transition-colors"
                >
                  <FiChevronRight /> {prevLesson.title}
                </Link>
              )}
            </div>

            <div className="flex gap-2">
              {firebaseUser && !isCompleted && (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FiCheckCircle /> {t('lesson.markComplete')}
                </button>
              )}

              {firebaseUser && (
                <Link
                  href={`/quiz/${id}`}
                  className="flex items-center gap-2 px-6 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <FiAward /> {t('quiz.title')}
                </Link>
              )}
            </div>

            <div className="flex gap-2">
              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-text rounded-lg hover:bg-surface-light transition-colors"
                >
                  {nextLesson.title} <FiChevronLeft />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (isPremium) {
    return <PremiumGuard>{lessonContent}</PremiumGuard>;
  }

  return lessonContent;
}
