/**
 * ModernHome - Redesigned for Clarity & Task Completion
 * 
 * REFACTORED: Now uses AfyaCare Design System components
 * - SectionHeader for consistent labeling
 * - QuickActionButton from design system
 * - UrgencyCard for task urgency
 * - StatusBadge for journey status
 * - Design system colors and spacing
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Heart,
  Calendar,
  MessageCircle,
  Baby,
  Pill,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
} from 'lucide-react';
import {
  SectionHeader,
  QuickActionButton,
  UrgencyCard,
  StatusBadge,
  colors,
} from '@/app/design-system';

interface ModernHomeProps {
  userName?: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
}

export function ModernHome({ userName = 'User', language, onNavigate }: ModernHomeProps) {
  const content = {
    sw: {
      greeting: 'Habari',
      tagline: 'Unahitaji msaada gani leo?',
      inProgress: {
        title: 'Zinaendelea',
        empty: 'Hakuna huduma zinazoendeshwa',
      },
      primaryCTA: {
        title: 'Nina Dalili',
        subtitle: 'Pata ushauri wa haraka',
        action: 'Anza Tathmini',
      },
      quickActions: {
        title: 'Vitendo vya Haraka',
        appointments: 'Miadi',
        records: 'Kumbukumbu',
        medications: 'Dawa',
        messages: 'Ujumbe',
      },
      upcomingTasks: {
        title: 'Zijazo',
        empty: 'Hakuna kazi zijazo',
      },
    },
    en: {
      greeting: 'Hello',
      tagline: 'What do you need help with today?',
      inProgress: {
        title: 'In Progress',
        empty: 'No active care journeys',
      },
      primaryCTA: {
        title: 'I have symptoms',
        subtitle: 'Get quick guidance',
        action: 'Start Assessment',
      },
      quickActions: {
        title: 'Quick Actions',
        appointments: 'Appointments',
        records: 'Records',
        medications: 'Medications',
        messages: 'Messages',
      },
      upcomingTasks: {
        title: 'Upcoming',
        empty: 'No upcoming tasks',
      },
    },
  };

  const t = content[language];

  // Mock data - In production, fetch from API/localStorage
  const inProgressJourneys = [
    {
      id: 'maternal',
      type: 'pregnancy',
      title: language === 'sw' ? 'Huduma ya Ujauzito' : 'Pregnancy Care',
      status: language === 'sw' ? 'Wiki 24' : 'Week 24',
      nextTask: language === 'sw' ? 'Uchunguzi wa wiki 28' : 'Week 28 checkup',
      dueDate: '2026-03-15',
      urgent: false,
      icon: Baby,
      color: '#EC4899',
    },
  ];

  const upcomingTasks = [
    {
      id: '1',
      type: 'appointment',
      title: language === 'sw' ? 'Miadi ya Kliniki' : 'Clinic Appointment',
      subtitle: language === 'sw' ? 'Mwananyamala Hospital' : 'Mwananyamala Hospital',
      date: '2026-02-25',
      time: '10:00',
      urgent: true,
    },
    {
      id: '2',
      type: 'medication',
      title: language === 'sw' ? 'Kumbusho la Dawa' : 'Medication Reminder',
      subtitle: language === 'sw' ? 'Lisinopril 10mg' : 'Lisinopril 10mg',
      date: 'today',
      time: '20:00',
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Simplified Header - No gradient, institutional */}
      <div className="bg-white border-b border-[#E5E7EB] pt-8 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-semibold text-[#1A1D23] mb-1">
              {t.greeting}, {userName}
            </h1>
            <p className="text-base text-[#6B7280]">{t.tagline}</p>
          </motion.div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6 max-w-4xl mx-auto">
        {/* IN PROGRESS CARE JOURNEYS - Using Design System */}
        {inProgressJourneys.length > 0 && (
          <section>
            <SectionHeader>{t.inProgress.title}</SectionHeader>
            <div className="space-y-3">
              {inProgressJourneys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => onNavigate(journey.id)}
                  className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#1E88E5] transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${journey.color}15` }}
                    >
                      <journey.icon
                        className="w-6 h-6"
                        style={{ color: journey.color }}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[#1A1D23]">{journey.title}</p>
                        <StatusBadge
                          type="in-progress"
                          label={journey.status}
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-[#6B7280]">{journey.nextTask}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PRIMARY CTA - Most Common Action (Symptom Checker) */}
        <section>
          <button
            onClick={() => onNavigate('symptom-checker')}
            className="w-full p-6 bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl transition-colors text-left group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-white mb-1">
                  {t.primaryCTA.title}
                </p>
                <p className="text-sm text-white/90">{t.primaryCTA.subtitle}</p>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg">
                <span className="text-sm font-semibold text-[#1E88E5]">
                  {t.primaryCTA.action}
                </span>
              </div>
            </div>
          </button>
        </section>

        {/* UPCOMING TASKS - Using UrgencyCard from Design System */}
        {upcomingTasks.length > 0 && (
          <section>
            <SectionHeader>{t.upcomingTasks.title}</SectionHeader>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <UrgencyCard
                  key={task.id}
                  level={task.urgent ? 'urgent' : 'info'}
                  title={task.title}
                  description={`${task.subtitle} • ${
                    task.date === 'today'
                      ? language === 'sw'
                        ? 'Leo'
                        : 'Today'
                      : task.date
                  } ${task.time}`}
                  icon={task.urgent ? AlertCircle : Clock}
                />
              ))}
            </div>
          </section>
        )}

        {/* QUICK ACTIONS - Using Design System Component */}
        <section>
          <SectionHeader>{t.quickActions.title}</SectionHeader>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon={Calendar}
              label={t.quickActions.appointments}
              onClick={() => onNavigate('appointments')}
              color={colors.primary[500]}
            />
            <QuickActionButton
              icon={FileText}
              label={t.quickActions.records}
              onClick={() => onNavigate('records')}
              color={colors.success[500]}
            />
            <QuickActionButton
              icon={Pill}
              label={t.quickActions.medications}
              onClick={() => onNavigate('medications')}
              color="#8B5CF6"
            />
            <QuickActionButton
              icon={MessageCircle}
              label={t.quickActions.messages}
              onClick={() => onNavigate('messages')}
              color={colors.warning[500]}
              badge={3}
            />
          </div>
        </section>
      </div>
    </div>
  );
}