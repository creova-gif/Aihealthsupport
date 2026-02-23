/**
 * EliteMessages - WORLD-CLASS REDESIGN
 * 
 * DESIGN PRINCIPLES:
 * - Flat chronological list (no complex grouping)
 * - 2-level urgency only (urgent/normal)
 * - Clear unread indicators
 * - Consistent card heights
 * - Bold facility names for scannability
 * - Zero decorative motion
 * - 44px touch targets
 * 
 * COMPARED TO: NHS App messages, Mayo Clinic notifications
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  ChevronRight,
  Circle,
} from 'lucide-react';
import {
  PageHeader,
  NativeDropdownFilter,
  StatusBadge,
  colors,
} from '@/app/design-system';

interface EliteMessagesProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onNavigate: (route: string) => void;
}

interface Message {
  id: string;
  from: string;
  category: 'appointment' | 'result' | 'medication' | 'general';
  subject: string;
  preview: string;
  date: string;
  time: string;
  isUrgent: boolean;
  isRead: boolean;
}

export function EliteMessages({ language, onBack, onNavigate }: EliteMessagesProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const content = {
    sw: {
      title: 'Ujumbe',
      subtitle: 'Mawasiliano kutoka kwa watoa huduma',
      filterLabel: 'Onyesha:',
      filters: {
        all: 'Zote',
        unread: 'Hazijasomwa',
        urgent: 'Za Haraka',
      },
      empty: 'Hakuna ujumbe',
      categories: {
        appointment: 'Miadi',
        result: 'Matokeo',
        medication: 'Dawa',
        general: 'Jumla',
      },
      urgent: 'Haraka',
      new: 'Mpya',
    },
    en: {
      title: 'Messages',
      subtitle: 'Communications from your care providers',
      filterLabel: 'Show:',
      filters: {
        all: 'All',
        unread: 'Unread',
        urgent: 'Urgent',
      },
      empty: 'No messages',
      categories: {
        appointment: 'Appointment',
        result: 'Results',
        medication: 'Medication',
        general: 'General',
      },
      urgent: 'Urgent',
      new: 'New',
    },
  };

  const t = content[language];

  // Mock messages - flat chronological list
  const messages: Message[] = [
    {
      id: '1',
      from: language === 'sw' ? 'Hospitali ya Mwananyamala' : 'Mwananyamala Hospital',
      category: 'appointment',
      subject: language === 'sw' ? 'Ukumbusho wa Miadi' : 'Appointment Reminder',
      preview: language === 'sw' ? 'Miadi yako ni kesho saa 10:00' : 'Your appointment is tomorrow at 10:00',
      date: 'Today',
      time: '14:30',
      isUrgent: true,
      isRead: false,
    },
    {
      id: '2',
      from: language === 'sw' ? 'Kliniki ya Kinondoni' : 'Kinondoni Clinic',
      category: 'result',
      subject: language === 'sw' ? 'Matokeo ya Vipimo' : 'Lab Results Available',
      preview: language === 'sw' ? 'Matokeo yako ya vipimo yamepatikana' : 'Your lab results are ready',
      date: 'Yesterday',
      time: '09:15',
      isUrgent: false,
      isRead: false,
    },
    {
      id: '3',
      from: language === 'sw' ? 'Hospitali ya Muhimbili' : 'Muhimbili Hospital',
      category: 'medication',
      subject: language === 'sw' ? 'Ukumbusho wa Dawa' : 'Medication Reminder',
      preview: language === 'sw' ? 'Kumbuka kuchukua dawa yako' : 'Remember to take your medication',
      date: 'Yesterday',
      time: '20:00',
      isUrgent: false,
      isRead: true,
    },
  ];

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'urgent') return msg.isUrgent;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={onBack}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-4 space-y-4">
        {/* Filter - Simple native dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#6B7280]">
            {t.filterLabel}
          </span>
          <NativeDropdownFilter
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: t.filters.all },
              { value: 'unread', label: t.filters.unread },
              { value: 'urgent', label: t.filters.urgent },
            ]}
          />
        </div>

        {/* Messages List - Flat, chronological */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => onNavigate(`message/${message.id}`)}
                className="w-full p-4 bg-white rounded-xl text-left active:scale-[0.99] transition-transform relative"
                style={{
                  border: message.isUrgent
                    ? `2px solid ${colors.danger[500]}`
                    : '2px solid #E5E7EB',
                  minHeight: '88px',
                }}
              >
                {/* Unread indicator */}
                {!message.isRead && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{ backgroundColor: colors.primary[500] }}
                  />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Facility name - BOLD for scannability */}
                    <p className="font-semibold text-[#1A1D23] mb-1 truncate">
                      {message.from}
                    </p>

                    {/* Subject */}
                    <p className="text-sm font-medium text-[#1A1D23] mb-1">
                      {message.subject}
                    </p>

                    {/* Preview - single line only */}
                    <p className="text-sm text-[#6B7280] truncate">
                      {message.preview}
                    </p>

                    {/* Metadata row */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                        <Clock className="w-3 h-3" />
                        <span>{message.date}, {message.time}</span>
                      </div>
                      <StatusBadge
                        type={message.category === 'appointment' ? 'needs-action' : 'info'}
                        label={t.categories[message.category]}
                        size="sm"
                      />
                      {message.isUrgent && (
                        <span className="text-xs font-semibold" style={{ color: colors.danger[500] }}>
                          {t.urgent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action indicator */}
                  <div className="flex flex-col items-end gap-2">
                    {!message.isRead && (
                      <Circle
                        className="w-2 h-2 fill-current"
                        style={{ color: colors.primary[500] }}
                      />
                    )}
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
