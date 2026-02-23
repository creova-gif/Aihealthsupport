/**
 * AIAssistant - Redesigned for Task Clarity & Progress Visibility
 * 
 * REFACTORED: Now uses AfyaCare Design System components
 * - PageHeader for consistent header
 * - SectionHeader for section labels
 * - StatusBadge for conversation status
 * - UrgencyCard for disclaimer
 * - Design system colors and spacing
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  HelpCircle,
  Pill,
  FileText,
  Lightbulb,
  Stethoscope,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  PageHeader,
  SectionHeader,
  StatusBadge,
  UrgencyCard,
  colors,
} from '@/app/design-system';

interface AIAssistantProps {
  language: 'sw' | 'en';
  userName?: string;
  onNavigate: (route: string) => void;
}

interface AssistantOption {
  key: string;
  icon: React.ElementType;
  title: { sw: string; en: string };
  description: { sw: string; en: string };
  route: string;
  color: string;
  bgColor: string;
  isCommon?: boolean;
}

interface RecentConversation {
  id: string;
  type: string;
  title: { sw: string; en: string };
  timestamp: string;
  status: 'completed' | 'in-progress' | 'needs-action';
}

export function AIAssistant({ language, userName, onNavigate }: AIAssistantProps) {
  const content = {
    sw: {
      title: 'Ushauri wa Afya',
      subtitle: 'Maswali na ushauri kuhusu afya yako',
      commonActions: 'Vitendo vya Kawaida',
      moreHelp: 'Msaada Zaidi',
      recentConversations: 'Mazungumzo ya Hivi Karibuni',
      emptyConversations: 'Hakuna mazungumzo bado',
      talkToDoctor: 'Zungumza na Daktari',
      emergency: 'Kwa Dharura',
      disclaimer: 'Ushauri huu ni wa kielimishi tu. Sio mbadala wa madaktari.',
      status: {
        completed: 'Imekamilika',
        'in-progress': 'Inaendelea',
        'needs-action': 'Inahitaji Hatua',
      },
    },
    en: {
      title: 'Health Guidance',
      subtitle: 'Questions and guidance about your health',
      commonActions: 'Common Actions',
      moreHelp: 'More Help',
      recentConversations: 'Recent Conversations',
      emptyConversations: 'No conversations yet',
      talkToDoctor: 'Talk to Doctor',
      emergency: 'For Emergencies',
      disclaimer: 'This guidance is informational only. Not a replacement for doctors.',
      status: {
        completed: 'Completed',
        'in-progress': 'In Progress',
        'needs-action': 'Needs Action',
      },
    },
  };

  const t = content[language];

  const commonOptions: AssistantOption[] = [
    {
      key: 'symptoms',
      icon: MessageSquare,
      title: { sw: 'Nina Dalili', en: 'I have symptoms' },
      description: {
        sw: 'Nieleze jinsi unavyohisi, nitakusaidia kuelewa',
        en: 'Tell me how you feel, I\'ll help you understand',
      },
      route: 'symptom-checker',
      color: colors.primary[500],
      bgColor: colors.primary[50],
      isCommon: true,
    },
    {
      key: 'medication',
      icon: Pill,
      title: { sw: 'Maswali kuhusu Dawa', en: 'Medication questions' },
      description: {
        sw: 'Pata taarifa kuhusu dawa zako',
        en: 'Get information about your medications',
      },
      route: 'medication-help',
      color: colors.success[500],
      bgColor: colors.success[50],
      isCommon: true,
    },
  ];

  const moreOptions: AssistantOption[] = [
    {
      key: 'results',
      icon: FileText,
      title: { sw: 'Elewa Matokeo', en: 'Understanding results' },
      description: {
        sw: 'Nitakusaidia kuelewa matokeo ya vipimo',
        en: 'I\'ll help you understand your test results',
      },
      route: 'results-help',
      color: colors.warning[500],
      bgColor: colors.warning[50],
    },
    {
      key: 'questions',
      icon: HelpCircle,
      title: { sw: 'Maswali ya Jumla', en: 'General questions' },
      description: {
        sw: 'Uliza maswali kuhusu afya yako',
        en: 'Ask questions about your health',
      },
      route: 'care-questions',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      key: 'next-steps',
      icon: Lightbulb,
      title: { sw: 'Nifanye Nini?', en: 'What should I do?' },
      description: {
        sw: 'Pata mapendekezo ya hatua zinazofuata',
        en: 'Get recommendations for next steps',
      },
      route: 'next-steps',
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
  ];

  // Mock recent conversations
  const recentConversations: RecentConversation[] = [
    {
      id: '1',
      type: 'symptom',
      title: { sw: 'Maumivu ya kichwa na homa', en: 'Headache and fever' },
      timestamp: '2h',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* PageHeader from Design System */}
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={() => window.history.back()}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Disclaimer - Using UrgencyCard */}
        <UrgencyCard
          level="warning"
          title={t.disclaimer}
          icon={AlertCircle}
        />

        {/* COMMON ACTIONS - Using SectionHeader */}
        <section>
          <SectionHeader>{t.commonActions}</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonOptions.map((option) => (
              <GuidanceCard
                key={option.key}
                option={option}
                language={language}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>

        {/* MORE HELP OPTIONS */}
        <section>
          <SectionHeader>{t.moreHelp}</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {moreOptions.map((option) => (
              <GuidanceCard
                key={option.key}
                option={option}
                language={language}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>

        {/* RECENT CONVERSATIONS */}
        {recentConversations.length > 0 && (
          <section>
            <SectionHeader>{t.recentConversations}</SectionHeader>
            <div className="space-y-3">
              {recentConversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  language={language}
                  statusLabel={t.status[conversation.status]}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        )}

        {/* Talk to Doctor - Primary CTA */}
        <section>
          <button
            onClick={() => onNavigate('talk-to-doctor')}
            className="w-full p-6 bg-white border-2 rounded-xl hover:border-[#1E88E5] transition-colors text-left group"
            style={{ borderColor: colors.neutral[300] }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Stethoscope
                  className="w-7 h-7"
                  style={{ color: colors.primary[500] }}
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-[#1A1D23] mb-1">
                  {t.talkToDoctor}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {language === 'sw'
                    ? 'Ongea na mtaalamu wa afya'
                    : 'Connect with a healthcare professional'}
                </p>
              </div>
              <ChevronRight
                className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}

// Guidance Card Component
function GuidanceCard({
  option,
  language,
  onNavigate,
}: {
  option: AssistantOption;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
}) {
  const Icon = option.icon;

  return (
    <button
      onClick={() => onNavigate(option.route)}
      className="w-full p-5 rounded-xl border-2 border-[#E5E7EB] hover:border-[#1E88E5] transition-colors text-left group"
      style={{ backgroundColor: option.bgColor }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'white' }}
        >
          <Icon className="w-6 h-6" style={{ color: option.color }} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[#1A1D23] mb-1">
            {option.title[language]}
          </p>
          <p className="text-sm text-[#6B7280]">{option.description[language]}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform flex-shrink-0 mt-3" />
      </div>
    </button>
  );
}

// Conversation Card Component - Using StatusBadge
function ConversationCard({
  conversation,
  language,
  statusLabel,
  onNavigate,
}: {
  conversation: RecentConversation;
  language: 'sw' | 'en';
  statusLabel: string;
  onNavigate: (route: string) => void;
}) {
  const getStatusType = (status: string): 'completed' | 'in-progress' | 'needs-action' => {
    return status as any;
  };

  return (
    <button
      onClick={() => onNavigate(`conversation/${conversation.id}`)}
      className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-colors text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1D23] mb-1">
            {conversation.title[language]}
          </p>
          <div className="flex items-center gap-2">
            <StatusBadge
              type={getStatusType(conversation.status)}
              label={statusLabel}
              size="sm"
            />
            <span className="text-xs text-[#6B7280]">{conversation.timestamp}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>
    </button>
  );
}