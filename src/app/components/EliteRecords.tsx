/**
 * EliteRecords - WORLD-CLASS REDESIGN
 * 
 * DESIGN PRINCIPLES:
 * - Simple flat list (no timeline dots)
 * - Key info always visible (no expanding)
 * - Prominent filters
 * - Clear date grouping
 * - Download/share always visible
 * - Plain language summaries
 * - Zero decorative elements
 * 
 * COMPARED TO: Apple Health timeline, NHS App records
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  ChevronRight,
  Calendar,
  User,
  MapPin,
} from 'lucide-react';
import {
  PageHeader,
  NativeDropdownFilter,
  StatusBadge,
  colors,
} from '@/app/design-system';

interface EliteRecordsProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onNavigate: (route: string) => void;
}

interface HealthRecord {
  id: string;
  type: 'visit' | 'test' | 'medication' | 'procedure';
  date: Date;
  title: { sw: string; en: string };
  summary: { sw: string; en: string };
  provider: { sw: string; en: string };
  facility: { sw: string; en: string };
  status: 'completed' | 'pending' | 'follow-up-needed';
}

export function EliteRecords({ language, onBack, onNavigate }: EliteRecordsProps) {
  const [filter, setFilter] = useState<'all' | 'visit' | 'test' | 'medication' | 'procedure'>('all');

  const content = {
    sw: {
      title: 'Rekodi za Afya',
      subtitle: 'Historia yako ya kliniki',
      filterLabel: 'Aina:',
      filters: {
        all: 'Zote',
        visit: 'Ziara',
        test: 'Vipimo',
        medication: 'Dawa',
        procedure: 'Taratibu',
      },
      empty: 'Hakuna rekodi',
      provider: 'Daktari:',
      facility: 'Kituo:',
      download: 'Pakua',
      share: 'Shiriki',
      viewDetails: 'Angalia',
      status: {
        completed: 'Imekamilika',
        pending: 'Inasubiri',
        'follow-up-needed': 'Fuatilia',
      },
    },
    en: {
      title: 'Health Records',
      subtitle: 'Your clinical history',
      filterLabel: 'Type:',
      filters: {
        all: 'All',
        visit: 'Visits',
        test: 'Tests',
        medication: 'Medications',
        procedure: 'Procedures',
      },
      empty: 'No records',
      provider: 'Provider:',
      facility: 'Facility:',
      download: 'Download',
      share: 'Share',
      viewDetails: 'View',
      status: {
        completed: 'Completed',
        pending: 'Pending',
        'follow-up-needed': 'Follow-up',
      },
    },
  };

  const t = content[language];

  // Mock records
  const records: HealthRecord[] = [
    {
      id: '1',
      type: 'visit',
      date: new Date('2026-02-20'),
      title: {
        sw: 'Uchunguzi wa Ujauzito',
        en: 'Prenatal Checkup',
      },
      summary: {
        sw: 'Uchunguzi wa wiki 24. Kila kitu ni sawa.',
        en: 'Week 24 checkup. Everything is normal.',
      },
      provider: {
        sw: 'Dkt. Sarah Mushi',
        en: 'Dr. Sarah Mushi',
      },
      facility: {
        sw: 'Hospitali ya Mwananyamala',
        en: 'Mwananyamala Hospital',
      },
      status: 'completed',
    },
    {
      id: '2',
      type: 'test',
      date: new Date('2026-02-18'),
      title: {
        sw: 'Vipimo vya Damu',
        en: 'Blood Test',
      },
      summary: {
        sw: 'Hemoglobin: 12.5 g/dL (kawaida)',
        en: 'Hemoglobin: 12.5 g/dL (normal)',
      },
      provider: {
        sw: 'Lab Technician',
        en: 'Lab Technician',
      },
      facility: {
        sw: 'Kliniki ya Kinondoni',
        en: 'Kinondoni Clinic',
      },
      status: 'completed',
    },
    {
      id: '3',
      type: 'medication',
      date: new Date('2026-02-15'),
      title: {
        sw: 'Dawa za Vitamini',
        en: 'Prenatal Vitamins',
      },
      summary: {
        sw: 'Folic acid 400mcg, mara moja kwa siku',
        en: 'Folic acid 400mcg, once daily',
      },
      provider: {
        sw: 'Dkt. Sarah Mushi',
        en: 'Dr. Sarah Mushi',
      },
      facility: {
        sw: 'Hospitali ya Mwananyamala',
        en: 'Mwananyamala Hospital',
      },
      status: 'completed',
    },
  ];

  // Filter records
  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  // Group by date
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const dateKey = formatDateGroup(record.date, language);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(record);
    return groups;
  }, {} as Record<string, HealthRecord[]>);

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={onBack}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-4 space-y-4">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#6B7280]">
            {t.filterLabel}
          </span>
          <NativeDropdownFilter
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: t.filters.all },
              { value: 'visit', label: t.filters.visit },
              { value: 'test', label: t.filters.test },
              { value: 'medication', label: t.filters.medication },
              { value: 'procedure', label: t.filters.procedure },
            ]}
          />
        </div>

        {/* Records List - Grouped by date */}
        {Object.keys(groupedRecords).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRecords).map(([dateGroup, groupRecords]) => (
              <div key={dateGroup}>
                {/* Date Group Header */}
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                  {dateGroup}
                </h3>

                {/* Records in this date group */}
                <div className="space-y-3">
                  {groupRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl border-2 border-[#E5E7EB] p-4"
                    >
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusBadge
                              type={getStatusType(record.status)}
                              label={t.status[record.status]}
                              size="sm"
                            />
                            <span className="text-xs text-[#6B7280]">
                              {formatDate(record.date, language)}
                            </span>
                          </div>
                          <h4 className="text-base font-semibold text-[#1A1D23] mb-1">
                            {record.title[language]}
                          </h4>
                          <p className="text-sm text-[#6B7280]">
                            {record.summary[language]}
                          </p>
                        </div>
                      </div>

                      {/* Provider & Facility */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <User className="w-4 h-4" />
                          <span>{t.provider} {record.provider[language]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <MapPin className="w-4 h-4" />
                          <span>{record.facility[language]}</span>
                        </div>
                      </div>

                      {/* Actions - Always visible */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onNavigate(`record/${record.id}`)}
                          className="flex-1 px-4 py-2 border-2 border-[#E5E7EB] rounded-lg text-sm font-medium text-[#1A1D23] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          <FileText className="w-4 h-4" />
                          {t.viewDetails}
                        </button>
                        <button
                          className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg text-sm active:scale-95 transition-transform"
                        >
                          <Download className="w-4 h-4" style={{ color: colors.neutral[700] }} />
                        </button>
                        <button
                          className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg text-sm active:scale-95 transition-transform"
                        >
                          <Share2 className="w-4 h-4" style={{ color: colors.neutral[700] }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getStatusType(status: string): 'completed' | 'in-progress' | 'needs-action' {
  if (status === 'completed') return 'completed';
  if (status === 'pending') return 'in-progress';
  return 'needs-action';
}

function formatDate(date: Date, language: 'sw' | 'en'): string {
  const months = {
    sw: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  const month = months[language][date.getMonth()];
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateGroup(date: Date, language: 'sw' | 'en'): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return language === 'sw' ? 'Leo' : 'Today';
  if (diffDays === 1) return language === 'sw' ? 'Jana' : 'Yesterday';
  if (diffDays < 7) return language === 'sw' ? 'Wiki hii' : 'This week';
  if (diffDays < 30) return language === 'sw' ? 'Mwezi huu' : 'This month';

  const months = {
    sw: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  return `${months[language][date.getMonth()]} ${date.getFullYear()}`;
}
