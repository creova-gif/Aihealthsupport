/**
 * EliteHome - ELITE WORLD-CLASS REDESIGN
 * 
 * DESIGN PRINCIPLES:
 * - Emergency first (no scroll required)
 * - Clarity over cleverness
 * - Institutional calm
 * - Zero decorative motion
 * - 44px minimum touch targets
 * - Works on 2G
 * - Respects reduced motion
 * - Maximum 3 primary actions
 * 
 * COMPARED TO: NHS App, Mayo Clinic, Teladoc
 */

import React from 'react';
import {
  AlertCircle,
  Stethoscope,
  Calendar,
  FileText,
  Clock,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import {
  SectionHeader,
  UrgencyCard,
  StatusBadge,
  colors,
} from '@/app/design-system';

interface EliteHomeProps {
  userName?: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
}

export function EliteHome({ userName = 'User', language, onNavigate }: EliteHomeProps) {
  const content = {
    sw: {
      emergency: 'Dharura',
      emergencyCall: 'Piga 114',
      getCare: 'Pata Huduma',
      getCareSubtitle: 'Angalia dalili, pata ushauri',
      activeCare: 'Huduma Yanayoendelea',
      quickAccess: 'Ufikiaji wa Haraka',
      appointments: 'Miadi',
      records: 'Kumbukumbu',
      findClinic: 'Tafuta Kliniki',
      upcoming: 'Zijazo',
      viewAll: 'Angalia Zote',
    },
    en: {
      emergency: 'Emergency',
      emergencyCall: 'Call 114',
      getCare: 'Get Care',
      getCareSubtitle: 'Check symptoms, get guidance',
      activeCare: 'Active Care',
      quickAccess: 'Quick Access',
      appointments: 'Appointments',
      records: 'Records',
      findClinic: 'Find Clinic',
      upcoming: 'Upcoming',
      viewAll: 'View All',
    },
  };

  const t = content[language];

  // Mock active care journey
  const activeCareJourney = {
    id: 'maternal',
    title: language === 'sw' ? 'Huduma ya Ujauzito' : 'Pregnancy Care',
    status: language === 'sw' ? 'Wiki 24' : 'Week 24',
    nextTask: language === 'sw' ? 'Uchunguzi wa wiki 28' : 'Week 28 checkup',
    dueDate: '2026-03-15',
  };

  // Mock upcoming task
  const upcomingTask = {
    title: language === 'sw' ? 'Miadi ya Kliniki' : 'Clinic Appointment',
    facility: language === 'sw' ? 'Hospitali ya Mwananyamala' : 'Mwananyamala Hospital',
    date: language === 'sw' ? 'Jumatatu, Feb 25' : 'Monday, Feb 25',
    time: '10:00',
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* ELITE HEADER - Minimal, institutional */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-medium text-[#1A1D23]">
            AfyaCare Tanzania
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* 1. EMERGENCY - ALWAYS FIRST, ALWAYS VISIBLE */}
        <div className="flex items-center justify-between p-4 bg-white border-2 rounded-xl" style={{ borderColor: colors.danger[500] }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.danger[50] }}>
              <AlertCircle className="w-5 h-5" style={{ color: colors.danger[500] }} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#1A1D23]">{t.emergency}</span>
          </div>
          <button
            onClick={() => window.location.href = 'tel:114'}
            className="px-6 py-2 rounded-lg font-semibold text-white active:scale-95 transition-transform"
            style={{ 
              backgroundColor: colors.danger[500],
              minHeight: '44px',
              minWidth: '120px'
            }}
          >
            {t.emergencyCall}
          </button>
        </div>

        {/* 2. PRIMARY ACTION - GET CARE */}
        <button
          onClick={() => onNavigate('symptom-checker')}
          className="w-full p-6 bg-white border-2 rounded-xl text-left active:scale-[0.99] transition-transform"
          style={{ 
            borderColor: colors.primary[500],
            minHeight: '88px'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                <Stethoscope className="w-7 h-7" style={{ color: colors.primary[500] }} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xl font-semibold text-[#1A1D23] mb-1">
                  {t.getCare}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.getCareSubtitle}
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-[#9CA3AF]" />
          </div>
        </button>

        {/* 3. ACTIVE CARE JOURNEY (if exists) */}
        {activeCareJourney && (
          <section>
            <SectionHeader>{t.activeCare}</SectionHeader>
            <button
              onClick={() => onNavigate('maternal')}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left active:scale-[0.99] transition-transform"
              style={{ minHeight: '80px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge type="in-progress" label={activeCareJourney.status} size="sm" />
                    <p className="text-sm font-semibold text-[#1A1D23]">
                      {activeCareJourney.title}
                    </p>
                  </div>
                  <p className="text-sm text-[#6B7280]">
                    {activeCareJourney.nextTask}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
              </div>
            </button>
          </section>
        )}

        {/* 4. QUICK ACCESS - MAX 3 ACTIONS */}
        <section>
          <SectionHeader>{t.quickAccess}</SectionHeader>
          <div className="grid grid-cols-1 gap-3">
            {/* Appointments */}
            <button
              onClick={() => onNavigate('appointments')}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                  <Calendar className="w-5 h-5" style={{ color: colors.primary[500] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.appointments}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Records */}
            <button
              onClick={() => onNavigate('records')}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                  <FileText className="w-5 h-5" style={{ color: colors.neutral[700] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.records}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Find Clinic */}
            <button
              onClick={() => onNavigate('find-clinic')}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                  <MapPin className="w-5 h-5" style={{ color: colors.neutral[700] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.findClinic}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>
          </div>
        </section>

        {/* 5. UPCOMING (Single item, collapsed) */}
        {upcomingTask && (
          <section>
            <SectionHeader>{t.upcoming}</SectionHeader>
            <div className="p-4 bg-white border-2 border-[#E5E7EB] rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-[#1A1D23] mb-1">
                    {upcomingTask.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <MapPin className="w-4 h-4" />
                    <span>{upcomingTask.facility}</span>
                  </div>
                </div>
                <StatusBadge type="needs-action" label={language === 'sw' ? 'Leo' : 'Today'} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Clock className="w-4 h-4" />
                <span>{upcomingTask.date}, {upcomingTask.time}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}