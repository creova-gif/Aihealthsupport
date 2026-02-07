/**
 * ModernHome - Production-Ready Home Screen
 * 
 * DESIGN STANDARDS:
 * - Medical-grade icons only (no sparkles, no AI branding)
 * - Motion tokens (<300ms, respects reduced motion)
 * - Offline-first (works without connectivity)
 * - Emergency-first (always visible, no navigation needed)
 * - Accessibility-first (WCAG AA, voice support ready)
 * - Tanzania-specific (Kiswahili primary, low-literacy support)
 * 
 * BENCHMARKS:
 * - Apple Health (clean, scannable)
 * - NHS App (task-oriented)
 * - Zocdoc (appointment-first)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  HomeIcon,
  CareIcon,
  MessagesIcon,
  CalendarIcon,
  RecordsIcon,
  LocationIcon,
  EmergencyIcon,
  HealthIcon,
  ChevronRightIcon,
  InfoIcon,
} from './icons/MedicalIcons';
import { MedicalButton } from './ui/medical-button';
import { ConnectivityBanner } from './ui/SystemStates';
import {
  MOTION_DURATION_S,
  MOTION_EASING,
  LIST_ITEM,
  prefersReducedMotion,
} from '@/app/styles/motion-tokens';

interface ModernHomeProps {
  userName?: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
  afyaId?: string; // Federated patient ID
  nextAppointment?: {
    date: string;
    time: string;
    facility: string;
    type: string;
  };
  upcomingMedications?: number;
}

export function ModernHome({
  userName = 'User',
  language,
  onNavigate,
  afyaId,
  nextAppointment,
  upcomingMedications = 0,
}: ModernHomeProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAfyaIdInfo, setShowAfyaIdInfo] = useState(false);

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const content = {
    sw: {
      greeting: 'Habari',
      tagline: 'Unahitaji msaada gani leo?',
      emergency: 'Dharura',
      emergencySubtext: 'Hali ya haraka',
      afyaId: 'Nambari ya AfyaID',
      afyaIdInfo: 'Nambari yako ya kitaifa ya afya. Inatumika katika vituo vyote vya afya.',
      connectivity: {
        online: 'Mtandao unapatikana',
        offline: 'Huna mtandao - taarifa zako ni salama',
      },
      primaryActions: {
        symptoms: {
          title: 'Nina Dalili',
          description: 'Pata ushauri kuhusu jinsi unavyohisi',
          available: 'Inapatikana bila mtandao',
        },
        care: {
          title: 'Huduma za Afya',
          description: 'Angalia huduma zako zote',
        },
        questions: {
          title: 'Uliza Maswali',
          description: 'Pata majibu kuhusu afya yako',
        },
        messages: {
          title: 'Ujumbe',
          description: 'Wasiliana na timu yako',
          unread: 'ujumbe mapya',
        },
      },
      quickActions: {
        title: 'Vitendo vya Haraka',
        appointment: {
          title: 'Miadi Yangu',
          next: 'Miadi ijayo',
          book: 'Weka Miadi',
        },
        records: {
          title: 'Kumbukumbu za Afya',
          view: 'Angalia historia',
        },
        medications: {
          title: 'Dawa',
          upcoming: 'zinazokuja',
          view: 'Angalia dawa',
        },
        findClinic: {
          title: 'Tafuta Kituo',
          nearest: 'Kituo cha karibu',
        },
      },
      healthTips: {
        title: 'Kidokezo cha Leo',
        tips: [
          'Kunywa maji mengi kunasaidia mwili wako kufanya kazi vizuri',
          'Mazoezi ya dakika 30 kila siku yanaboresha afya yako',
          'Usingizi wa saa 7-9 ni muhimu kwa afya nzuri',
          'Kula matunda na mboga kila siku kuongeza nguvu',
        ],
      },
    },
    en: {
      greeting: 'Hello',
      tagline: 'What do you need help with today?',
      emergency: 'Emergency',
      emergencySubtext: 'Get immediate help',
      afyaId: 'AfyaID Number',
      afyaIdInfo: 'Your national health ID. Used at all healthcare facilities.',
      connectivity: {
        online: 'Online',
        offline: 'Offline - your information is safe',
      },
      primaryActions: {
        symptoms: {
          title: 'I Have Symptoms',
          description: 'Get guidance on how you feel',
          available: 'Available offline',
        },
        care: {
          title: 'My Care',
          description: 'View all your care services',
        },
        questions: {
          title: 'Ask Questions',
          description: 'Get answers about your health',
        },
        messages: {
          title: 'Messages',
          description: 'Connect with your care team',
          unread: 'new messages',
        },
      },
      quickActions: {
        title: 'Quick Actions',
        appointment: {
          title: 'Appointments',
          next: 'Next appointment',
          book: 'Book Appointment',
        },
        records: {
          title: 'Health Records',
          view: 'View history',
        },
        medications: {
          title: 'Medications',
          upcoming: 'upcoming',
          view: 'View medications',
        },
        findClinic: {
          title: 'Find Clinic',
          nearest: 'Nearest facility',
        },
      },
      healthTips: {
        title: 'Today\'s Health Tip',
        tips: [
          'Drinking plenty of water helps your body function properly',
          '30 minutes of exercise daily improves your health',
          '7-9 hours of sleep is essential for good health',
          'Eating fruits and vegetables daily boosts your immunity',
        ],
      },
    },
  };

  const t = content[language];
  const reducedMotion = prefersReducedMotion();
  
  // Get appropriate greeting based on time
  const hour = new Date().getHours();
  const greetingTime =
    hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  // Random health tip
  const [tipIndex] = useState(
    Math.floor(Math.random() * t.healthTips.tips.length)
  );

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Connectivity Banner */}
      <ConnectivityBanner isOnline={isOnline} />

      {/* Emergency Button - ALWAYS VISIBLE */}
      <div className="fixed top-4 right-4 z-50">
        <MedicalButton
          variant="danger"
          size="sm"
          onClick={() => onNavigate('emergency')}
          icon={<EmergencyIcon size={20} color="#FFFFFF" />}
          className="shadow-lg"
        >
          {t.emergency}
        </MedicalButton>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] pt-16 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            {...(reducedMotion ? {} : LIST_ITEM(0))}
            className="mb-4"
          >
            <h1 className="text-2xl font-semibold text-[#1E1E1E]">
              {t.greeting}, {userName}
            </h1>
            <p className="text-base text-[#6B7280] mt-1">{t.tagline}</p>
          </motion.div>

          {/* AfyaID - Federated Patient ID */}
          {afyaId && (
            <motion.div
              {...(reducedMotion ? {} : LIST_ITEM(1))}
              className="p-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                  <RecordsIcon size={20} color="#FFFFFF" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">{t.afyaId}</p>
                  <p className="text-base font-semibold text-[#1E1E1E]">
                    {afyaId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAfyaIdInfo(!showAfyaIdInfo)}
                className="p-2"
                aria-label="Information"
              >
                <InfoIcon size={20} color="#6B7280" />
              </button>
            </motion.div>
          )}

          {showAfyaIdInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-4 bg-white border border-[#E5E7EB] rounded-xl"
            >
              <p className="text-sm text-[#6B7280]">{t.afyaIdInfo}</p>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Next Appointment - High Priority */}
        {nextAppointment && (
          <motion.section
            {...(reducedMotion ? {} : LIST_ITEM(2))}
            className="p-4 bg-white border-2 border-[#10B981] rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarIcon size={24} color="#10B981" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#10B981] mb-1">
                  {t.quickActions.appointment.next}
                </p>
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {nextAppointment.type}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {nextAppointment.date} at {nextAppointment.time}
                </p>
                <p className="text-sm text-[#6B7280]">{nextAppointment.facility}</p>
              </div>
              <ChevronRightIcon size={20} color="#6B7280" />
            </div>
          </motion.section>
        )}

        {/* Primary Actions - Core Features */}
        <section>
          <div className="grid grid-cols-1 gap-3">
            {/* Symptom Checker */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(3))}
              onClick={() => onNavigate('symptom-checker')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                <HealthIcon size={24} color="#1E88E5" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {t.primaryActions.symptoms.title}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.primaryActions.symptoms.description}
                </p>
                {!isOnline && (
                  <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
                    {t.primaryActions.symptoms.available}
                  </p>
                )}
              </div>
              <ChevronRightIcon size={20} color="#6B7280" />
            </motion.button>

            {/* Care Journeys */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(4))}
              onClick={() => onNavigate('care')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center flex-shrink-0">
                <CareIcon size={24} color="#10B981" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {t.primaryActions.care.title}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.primaryActions.care.description}
                </p>
              </div>
              <ChevronRightIcon size={20} color="#6B7280" />
            </motion.button>

            {/* Ask Questions (formerly "AI Assistant") */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(5))}
              onClick={() => onNavigate('assistant')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#EDE9FE] rounded-xl flex items-center justify-center flex-shrink-0">
                <MessagesIcon size={24} color="#8B5CF6" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {t.primaryActions.questions.title}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.primaryActions.questions.description}
                </p>
              </div>
              <ChevronRightIcon size={20} color="#6B7280" />
            </motion.button>

            {/* Messages */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(6))}
              onClick={() => onNavigate('messages')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center flex-shrink-0">
                <MessagesIcon size={24} color="#F59E0B" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {t.primaryActions.messages.title}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {t.primaryActions.messages.description}
                </p>
              </div>
              {upcomingMedications > 0 && (
                <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {upcomingMedications}
                  </span>
                </div>
              )}
              <ChevronRightIcon size={20} color="#6B7280" />
            </motion.button>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-semibold text-[#1E1E1E] mb-3 px-1">
            {t.quickActions.title}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Book Appointment */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(7))}
              onClick={() => onNavigate('appointments')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left"
            >
              <CalendarIcon size={24} color="#1E88E5" className="mb-2" />
              <p className="text-sm font-semibold text-[#1E1E1E]">
                {t.quickActions.appointment.title}
              </p>
            </motion.button>

            {/* Health Records */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(8))}
              onClick={() => onNavigate('records')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left"
            >
              <RecordsIcon size={24} color="#10B981" className="mb-2" />
              <p className="text-sm font-semibold text-[#1E1E1E]">
                {t.quickActions.records.title}
              </p>
            </motion.button>

            {/* Medications */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(9))}
              onClick={() => onNavigate('medications')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <RecordsIcon size={24} color="#8B5CF6" />
                {upcomingMedications > 0 && (
                  <span className="text-xs font-semibold text-[#8B5CF6]">
                    {upcomingMedications}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#1E1E1E]">
                {t.quickActions.medications.title}
              </p>
            </motion.button>

            {/* Find Clinic */}
            <motion.button
              {...(reducedMotion ? {} : LIST_ITEM(10))}
              onClick={() => onNavigate('find-clinic')}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left"
            >
              <LocationIcon size={24} color="#F59E0B" className="mb-2" />
              <p className="text-sm font-semibold text-[#1E1E1E]">
                {t.quickActions.findClinic.title}
              </p>
            </motion.button>
          </div>
        </section>

        {/* Health Tip of the Day */}
        <motion.section
          {...(reducedMotion ? {} : LIST_ITEM(11))}
          className="p-4 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl text-white"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HealthIcon size={20} color="#FFFFFF" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2 opacity-90">
                {t.healthTips.title}
              </p>
              <p className="text-base leading-relaxed">
                {t.healthTips.tips[tipIndex]}
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
