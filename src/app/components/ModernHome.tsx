/**
 * ModernHome - The Heart of the App
 * Context-aware starting point with "What do you need right now?" prompt
 * Organized by human intent, not features
 * Inspired by: Apple Health, Notion clarity
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Heart,
  Calendar,
  MessageCircle,
  Baby,
  TrendingUp,
  Bell,
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';

interface ModernHomeProps {
  userName?: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
}

export function ModernHome({ userName = 'User', language, onNavigate }: ModernHomeProps) {
  const [todayTip, setTodayTip] = useState(0);

  const content = {
    sw: {
      greeting: 'Habari',
      tagline: 'Unahitaji nini leo?',
      primaryActions: {
        symptoms: {
          title: 'Nina Dalili',
          description: 'Pata ushauri kuhusu jinsi unavyohisi',
          color: '#1E88E5',
          icon: Activity,
          route: 'symptom-checker',
        },
        care: {
          title: 'Huduma za Afya',
          description: 'Angalia huduma zote za afya',
          color: '#43A047',
          icon: Heart,
          route: 'care',
        },
        assistant: {
          title: 'Msaidizi wa AI',
          description: 'Uliza maswali kuhusu afya yako',
          color: '#8B5CF6',
          icon: Sparkles,
          route: 'assistant',
        },
        messages: {
          title: 'Ujumbe',
          description: 'Wasiliana na timu yako ya afya',
          color: '#F59E0B',
          icon: MessageCircle,
          route: 'messages',
        },
      },
      recentActivity: {
        title: 'Shughuli za Karibuni',
        empty: 'Hakuna shughuli bado',
      },
      healthTips: [
        'Kunywa maji mengi kunasaidia mwili wako kufanya kazi vizuri',
        'Mazoezi ya dakika 30 kila siku yanaboresha afya yako',
        'Usingizi wa saa 7-9 ni muhimu kwa afya nzuri',
      ],
      continueCare: 'Endelea na Huduma',
    },
    en: {
      greeting: 'Hello',
      tagline: 'What do you need right now?',
      primaryActions: {
        symptoms: {
          title: 'I have symptoms',
          description: 'Get guidance on how you feel',
          color: '#1E88E5',
          icon: Activity,
          route: 'symptom-checker',
        },
        care: {
          title: 'Care journeys',
          description: 'View all care services',
          color: '#43A047',
          icon: Heart,
          route: 'care',
        },
        assistant: {
          title: 'AI Assistant',
          description: 'Ask questions about your health',
          color: '#8B5CF6',
          icon: Sparkles,
          route: 'assistant',
        },
        messages: {
          title: 'Messages',
          description: 'Connect with your care team',
          color: '#F59E0B',
          icon: MessageCircle,
          route: 'messages',
        },
      },
      recentActivity: {
        title: 'Recent Activity',
        empty: 'No recent activity',
      },
      healthTips: [
        'Drinking plenty of water helps your body function properly',
        '30 minutes of exercise daily improves your health',
        '7-9 hours of sleep is essential for good health',
      ],
      continueCare: 'Continue Care',
    },
  };

  const t = content[language];
  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? t.greeting : timeOfDay < 18 ? t.greeting : t.greeting;

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-white to-transparent pt-12 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#1A1D23] mb-1">
              {greeting}, {userName}
            </h1>
            <p className="text-lg text-[#6B7280]">{t.tagline}</p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 space-y-8 max-w-4xl mx-auto">
        {/* Primary care journeys */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(t.primaryActions).map(([key, action]: any, index) => (
              <CareJourneyCard
                key={key}
                title={action.title}
                description={action.description}
                icon={action.icon}
                color={action.color}
                onClick={() => onNavigate(action.route)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </section>

        {/* Health tip of the day */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-br from-[#43A047] to-[#2E7D32] rounded-2xl text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-2">
                {language === 'sw' ? 'Kidokezo cha Leo' : 'Today\'s Health Tip'}
              </p>
              <p className="text-base font-medium leading-relaxed">
                {t.healthTips[todayTip]}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Recent activity placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">
            {t.recentActivity.title}
          </h2>
          <div className="p-8 bg-white rounded-2xl border border-[#E5E7EB] text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <p className="text-[#6B7280]">{t.recentActivity.empty}</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function CareJourneyCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-sm hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm ring-1 ring-black/5"
          style={{ 
            backgroundColor: `${color}08`,
            boxShadow: `0 2px 8px ${color}15`
          }}
        >
          <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" style={{ color, strokeWidth: 2 }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1A1D23] mb-1 text-lg">{title}</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}