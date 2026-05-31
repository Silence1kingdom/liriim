'use client';

import { motion } from 'framer-motion';
import { useT } from '@/contexts/LangContext';
import LessonCard from '@/components/LessonCard';
import { useAuth } from '@/contexts/AuthContext';
import { FREE_LESSONS } from '@/lib/constants';

export default function FreeCoursesPage() {
  const { t } = useT();
  const { userProfile } = useAuth();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-text mb-4">
            <span className="text-primary">{t('free.title')}</span>
          </h1>
          <p className="text-text-muted max-w-xl mx-auto">
            {t('free.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FREE_LESSONS.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <LessonCard
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                icon={lesson.icon}
                duration={lesson.duration}
                type="free"
                isCompleted={userProfile?.progress?.[lesson.id] === 'completed'}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
