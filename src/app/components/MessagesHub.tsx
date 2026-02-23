/**
 * MessagesHub - Redesigned for Clarity & Reduced Alarm Fatigue
 * 
 * REFACTORED: Now uses AfyaCare Design System components
 * - PageHeader for consistent header
 * - NativeDropdownFilter for grouping
 * - StatusBadge for message status
 * - UrgencyCard for urgent messages
 * - Design system colors
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Stethoscope,
  Calendar,
  Bell,
  Clock,
  CheckCheck,
  Circle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  PageHeader,
  NativeDropdownFilter,
  StatusBadge,
  UrgencyCard,
  SectionHeader,
  colors,
} from '@/app/design-system';

interface MessagesHubProps {
  language: 'sw' | 'en';
  userName?: string;
}

interface Message {
  id: string;
  groupType: 'clinical' | 'appointments' | 'notifications';
  sender: { sw: string; en: string };
  preview: { sw: string; en: string };
  timestamp: string;
  unread: boolean;
  urgent: boolean;
  responseExpected?: boolean;
}

export function MessagesHub({ language, userName }: MessagesHubProps) {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'clinical' | 'appointments' | 'notifications'>('all');

  const content = {
    sw: {
      title: 'Ujumbe',
      subtitle: 'Mawasiliano na timu yako ya afya',
      groups: {
        all: 'Yote',
        clinical: 'Timu ya Afya',
        appointments: 'Miadi',
        notifications: 'Arifa',
      },
      filter: 'Onyesha:',
      urgentOnly: 'Muhimu tu',
      emptyState: 'Hakuna ujumbe',
      emptyDescription: 'Ujumbe wako utaonekana hapa',
      responseTime: 'Muda wa kujibu:',
      urgent: 'Muhimu',
      tapToOpen: 'Gusa kuangalia',
    },
    en: {
      title: 'Messages',
      subtitle: 'Communication with your care team',
      groups: {
        all: 'All',
        clinical: 'Care Team',
        appointments: 'Appointments',
        notifications: 'Notifications',
      },
      filter: 'Show:',
      urgentOnly: 'Urgent only',
      emptyState: 'No messages',
      emptyDescription: 'Your messages will appear here',
      responseTime: 'Response time:',
      urgent: 'Urgent',
      tapToOpen: 'Tap to view',
    },
  };

  const t = content[language];

  // Mock messages with auto-grouping
  const allMessages: Message[] = [
    {
      id: '1',
      groupType: 'clinical',
      sender: { sw: 'Dkt. Mwangi', en: 'Dr. Mwangi' },
      preview: {
        sw: 'Matokeo yako ya vipimo vya damu yamepatikana. Kila kitu kiko sawa. Hakuna hatua ya ziada inayohitajika kwa sasa.',
        en: 'Your blood test results are ready. Everything looks normal. No further action needed at this time.',
      },
      timestamp: '2h',
      unread: true,
      urgent: false,
      responseExpected: false,
    },
    {
      id: '2',
      groupType: 'clinical',
      sender: { sw: 'Muuguzi Patel', en: 'Nurse Patel' },
      preview: {
        sw: 'Tafadhali kuja kwa uchunguzi wa ufuatiliaji wiki ijayo. Je, Jumanne saa 10:00 inafaa?',
        en: 'Please come for a follow-up examination next week. Would Tuesday at 10:00 AM work for you?',
      },
      timestamp: '1d',
      unread: true,
      urgent: true,
      responseExpected: true,
    },
    {
      id: '3',
      groupType: 'appointments',
      sender: { sw: 'Mfumo wa Miadi', en: 'Appointment System' },
      preview: {
        sw: 'Miadi yako ya kesho saa 10:00 imekamilika. Kituo: Mwananyamala Hospital.',
        en: 'Your appointment tomorrow at 10:00 AM is confirmed. Location: Mwananyamala Hospital.',
      },
      timestamp: '1d',
      unread: false,
      urgent: false,
    },
    {
      id: '4',
      groupType: 'notifications',
      sender: { sw: 'Mfumo wa Dawa', en: 'Medication System' },
      preview: {
        sw: 'Kumbusho: Meza dawa yako ya usiku (Lisinopril 10mg) saa 8:00 jioni.',
        en: 'Reminder: Take your evening medication (Lisinopril 10mg) at 8:00 PM.',
      },
      timestamp: '2d',
      unread: false,
      urgent: false,
    },
  ];

  // Group messages by type
  const groupedMessages = {
    clinical: allMessages.filter((m) => m.groupType === 'clinical'),
    appointments: allMessages.filter((m) => m.groupType === 'appointments'),
    notifications: allMessages.filter((m) => m.groupType === 'notifications'),
  };

  const displayMessages =
    selectedGroup === 'all'
      ? allMessages
      : groupedMessages[selectedGroup as keyof typeof groupedMessages];

  // Count only URGENT unread (reduce alarm fatigue)
  const urgentUnreadCount = allMessages.filter((m) => m.unread && m.urgent).length;

  // Filter options for dropdown
  const filterOptions = [
    { value: 'all', label: t.groups.all, count: allMessages.length },
    { value: 'clinical', label: t.groups.clinical, count: groupedMessages.clinical.length },
    { value: 'appointments', label: t.groups.appointments, count: groupedMessages.appointments.length },
    { value: 'notifications', label: t.groups.notifications, count: groupedMessages.notifications.length },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* PageHeader from Design System */}
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={() => window.history.back()}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      >
        {/* NativeDropdownFilter from Design System */}
        <NativeDropdownFilter
          label={t.filter}
          value={selectedGroup}
          onChange={(value) => setSelectedGroup(value as any)}
          options={filterOptions}
        />
      </PageHeader>

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Urgent Messages Only (Reduce Alarm Fatigue) */}
        {urgentUnreadCount > 0 && (
          <UrgencyCard
            level="urgent"
            title={`${urgentUnreadCount} ${t.urgent}`}
            description={language === 'sw' ? 'Ujumbe unahitaji jibu' : 'Messages need response'}
            icon={AlertCircle}
          />
        )}

        {/* Messages List */}
        <div className="space-y-3">
          {displayMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              language={language}
            />
          ))}
        </div>

        {/* Empty State */}
        {displayMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-base font-semibold text-[#1A1D23] mb-2">
              {t.emptyState}
            </p>
            <p className="text-sm text-[#6B7280]">{t.emptyDescription}</p>
          </div>
        )}

        {/* Low Bandwidth Notice - Using Design System */}
        <UrgencyCard
          level="info"
          title={language === 'sw' ? 'Ujumbe wa Upatikanaji wa Mtandao' : 'Network Availability Notice'}
          description={
            language === 'sw'
              ? 'Ujumbe unafanya kazi hata bila mtandao. Ujumbe wako utasikilizwa'
              : 'Messages work even without network. Your messages will be heard'
          }
        />
      </div>
    </div>
  );
}

// Message Card Component
function MessageCard({
  message,
  language,
}: {
  message: Message;
  language: 'sw' | 'en';
}) {
  const getGroupIcon = () => {
    switch (message.groupType) {
      case 'clinical':
        return Stethoscope;
      case 'appointments':
        return Calendar;
      case 'notifications':
        return Bell;
    }
  };

  const getGroupColor = () => {
    switch (message.groupType) {
      case 'clinical':
        return colors.primary[500];
      case 'appointments':
        return colors.success[500];
      case 'notifications':
        return colors.neutral[500];
    }
  };

  const Icon = getGroupIcon();
  const color = getGroupColor();

  return (
    <button
      className={`w-full p-4 rounded-xl border-2 text-left group transition-colors ${
        message.urgent
          ? 'bg-[#FEF2F2] border-[#FCA5A5]'
          : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p
              className={`text-sm font-semibold ${
                message.urgent ? 'text-[#991B1B]' : 'text-[#1A1D23]'
              }`}
            >
              {message.sender[language]}
            </p>
            <span className="text-xs text-[#6B7280]">{message.timestamp}</span>
          </div>

          <p
            className={`text-sm line-clamp-2 mb-2 ${
              message.unread ? 'text-[#1A1D23]' : 'text-[#6B7280]'
            }`}
          >
            {message.preview[language]}
          </p>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {message.unread && (
              <StatusBadge type="info" label={language === 'sw' ? 'Mpya' : 'New'} size="sm" />
            )}
            {message.responseExpected && (
              <StatusBadge
                type="needs-action"
                label={language === 'sw' ? 'Jibu Linahitajika' : 'Response Needed'}
                size="sm"
              />
            )}
            {message.urgent && (
              <StatusBadge type="needs-action" label={language === 'sw' ? 'Haraka' : 'Urgent'} size="sm" />
            )}
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform flex-shrink-0 mt-2" />
      </div>
    </button>
  );
}