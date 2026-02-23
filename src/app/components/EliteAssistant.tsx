/**
 * EliteAssistant - WORLD-CLASS REDESIGN
 * 
 * DESIGN PRINCIPLES:
 * - NO "AI" branding (renamed "Health Guidance")
 * - Structured intake form (not chat-style)
 * - Max 3 primary options
 * - Clinical tone (not marketing)
 * - Clear exit always visible
 * - Zero decorative icons
 * - Plain language
 * 
 * COMPARED TO: NHS Symptom Checker, Mayo Clinic Symptom Assessment
 */

import React from 'react';
import {
  Stethoscope,
  Pill,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  PageHeader,
  UrgencyCard,
  colors,
} from '@/app/design-system';

interface EliteAssistantProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onNavigate: (route: string) => void;
}

interface GuidanceOption {
  id: string;
  title: { sw: string; en: string };
  description: { sw: string; en: string };
  route: string;
  icon: React.ElementType;
}

export function EliteAssistant({ language, onBack, onNavigate }: EliteAssistantProps) {
  const content = {
    sw: {
      title: 'Ushauri wa Afya',
      subtitle: 'Pata ushauri kuhusu afya yako',
      disclaimer: 'Ushauri huu ni wa kielimishi tu. Usipoona vizuri, wasiliana na daktari.',
      whatToHelp: 'Unahitaji ushauri wa aina gani?',
      talkToDoctor: 'Zungumza na Daktari',
      talkTodoctorDesc: 'Ongea moja kwa moja na mtaalamu wa afya',
    },
    en: {
      title: 'Health Guidance',
      subtitle: 'Get guidance about your health',
      disclaimer: 'This guidance is informational only. If you feel unwell, contact a doctor.',
      whatToHelp: 'What type of guidance do you need?',
      talkToDoctor: 'Talk to Doctor',
      talkToDoctoDesc: 'Speak directly with a healthcare professional',
    },
  };

  const t = content[language];

  // Only 3 primary options - simplified
  const guidanceOptions: GuidanceOption[] = [
    {
      id: 'symptoms',
      title: {
        sw: 'Angalia Dalili',
        en: 'Check Symptoms',
      },
      description: {
        sw: 'Nieleze jinsi unavyohisi, nitakusaidia',
        en: 'Tell us how you feel, we\'ll help',
      },
      route: 'symptom-checker',
      icon: Stethoscope,
    },
    {
      id: 'medication',
      title: {
        sw: 'Maswali kuhusu Dawa',
        en: 'Medication Questions',
      },
      description: {
        sw: 'Pata taarifa kuhusu dawa',
        en: 'Get information about medications',
      },
      route: 'medication-help',
      icon: Pill,
    },
    {
      id: 'results',
      title: {
        sw: 'Elewa Matokeo',
        en: 'Understand Results',
      },
      description: {
        sw: 'Msaada wa kuelewa matokeo ya vipimo',
        en: 'Help understanding test results',
      },
      route: 'results-help',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={onBack}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Medical Disclaimer - Always visible */}
        <UrgencyCard
          level="warning"
          title={t.disclaimer}
          icon={Info}
        />

        {/* Primary Question */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">
            {t.whatToHelp}
          </h2>

          {/* 3 Primary Options - Clean, structured */}
          <div className="space-y-3">
            {guidanceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => onNavigate(option.route)}
                  className="w-full p-5 bg-white border-2 border-[#E5E7EB] rounded-xl text-left active:scale-[0.99] transition-transform"
                  style={{ minHeight: '88px' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: colors.primary[500] }}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-[#1A1D23] mb-1">
                        {option.title[language]}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {option.description[language]}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Talk to Doctor - Secondary CTA */}
        <div className="pt-4">
          <button
            onClick={() => onNavigate('talk-to-doctor')}
            className="w-full p-5 bg-white border-2 rounded-xl text-left active:scale-[0.99] transition-transform"
            style={{
              borderColor: colors.primary[500],
              minHeight: '80px',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Stethoscope
                  className="w-6 h-6"
                  style={{ color: colors.primary[500] }}
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1A1D23] mb-1">
                  {t.talkToDoctor}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.talkToDoctoDesc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
