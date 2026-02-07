/**
 * Care Screen (Timeline) - Federated Health Records
 * 
 * PURPOSE: Continuity of care across multiple hospitals & clinics
 * 
 * CRITICAL REQUIREMENTS:
 * - Timeline loads <2s
 * - Plain language summaries (no medical jargon)
 * - Cross-facility records visible
 * - Consent required for sharing
 * - Works offline (cached records)
 * 
 * USER GROUPS:
 * - Rural patient (shared phone, low literacy)
 * - Urban patient (smartphone)
 * - Caregiver (managing family)
 * - CHW (field access)
 * - Clinician (intake review)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  RecordsIcon,
  CalendarIcon,
  LocationIcon,
  ChevronRightIcon,
  EmergencyIcon,
  InfoIcon,
  CheckIcon,
  ChevronLeftIcon,
} from './icons/MedicalIcons';
import { MedicalButton } from './ui/medical-button';
import { LoadingState, EmptyState } from './ui/SystemStates';
import {
  LIST_ITEM,
  prefersReducedMotion,
} from '@/app/styles/motion-tokens';

interface HealthRecord {
  id: string;
  date: string;
  type: 'visit' | 'medication' | 'diagnostic' | 'pregnancy';
  facility: string;
  facilityLocation: string;
  summary: string; // Plain language
  clinicalDetails?: string; // Hidden from patient by default
  urgent?: boolean;
  documents?: string[];
}

interface PatientSummary {
  name: string;
  age: number;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  pregnancyWeek?: number;
}

interface CareTimelineProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onNavigate: (route: string) => void;
  patientSummary: PatientSummary;
  afyaId: string;
  isCaregiver?: boolean;
}

export function CareTimeline({
  language,
  onBack,
  onNavigate,
  patientSummary,
  afyaId,
  isCaregiver = false,
}: CareTimelineProps) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showShareConsent, setShowShareConsent] = useState(false);

  const content = {
    sw: {
      title: 'Historia ya Afya Yangu',
      subtitle: 'Kumbukumbu zako kutoka vituo vyote vya afya',
      patientInfo: 'Taarifa za Mgonjwa',
      age: 'Umri',
      years: 'miaka',
      bloodType: 'Aina ya Damu',
      allergies: 'Mzio',
      noAllergies: 'Hakuna mzio',
      chronicConditions: 'Magonjwa ya Muda Mrefu',
      noConditions: 'Hakuna',
      currentMedications: 'Dawa za Sasa',
      noMedications: 'Hakuna dawa',
      pregnancyWeek: 'Wiki ya Ujauzito',
      timeline: 'Historia',
      filter: {
        all: 'Yote',
        visits: 'Ziara',
        medications: 'Dawa',
        diagnostics: 'Vipimo',
        pregnancy: 'Ujauzito',
      },
      recordTypes: {
        visit: 'Ziara',
        medication: 'Dawa',
        diagnostic: 'Kipimo',
        pregnancy: 'Ujauzito',
      },
      actions: {
        share: 'Shiriki Kumbukumbu',
        upload: 'Pakia Hati',
        emergency: 'Dharura',
      },
      shareConsent: {
        title: 'Shiriki Historia Yako',
        description: 'Ungependa kushiriki historia yako ya afya na kituo kipya?',
        whichFacility: 'Ni kituo kipi?',
        whatToShare: 'Ungependa kushiriki nini?',
        options: {
          all: 'Kumbukumbu zote',
          recent: 'Wiki 4 za hivi karibuni tu',
          specific: 'Kumbukumbu maalum',
        },
        confirm: 'Thibitisha',
        cancel: 'Ghairi',
        disclaimer: 'Utaweza kuondoa ruhusa wakati wowote',
      },
      empty: {
        title: 'Hakuna Kumbukumbu Bado',
        description: 'Historia yako ya afya itaonekana hapa baada ya kutembelea kituo cha afya',
      },
      offline: 'Kumbukumbu zilizohifadhiwa - zitasasishwa mnapotoka mtandaoni',
    },
    en: {
      title: 'My Health History',
      subtitle: 'Your records from all healthcare facilities',
      patientInfo: 'Patient Information',
      age: 'Age',
      years: 'years',
      bloodType: 'Blood Type',
      allergies: 'Allergies',
      noAllergies: 'No known allergies',
      chronicConditions: 'Chronic Conditions',
      noConditions: 'None',
      currentMedications: 'Current Medications',
      noMedications: 'No current medications',
      pregnancyWeek: 'Pregnancy Week',
      timeline: 'Timeline',
      filter: {
        all: 'All',
        visits: 'Visits',
        medications: 'Medications',
        diagnostics: 'Tests',
        pregnancy: 'Pregnancy',
      },
      recordTypes: {
        visit: 'Visit',
        medication: 'Medication',
        diagnostic: 'Test',
        pregnancy: 'Pregnancy',
      },
      actions: {
        share: 'Share Records',
        upload: 'Upload Document',
        emergency: 'Emergency',
      },
      shareConsent: {
        title: 'Share Your History',
        description: 'Would you like to share your health history with a new facility?',
        whichFacility: 'Which facility?',
        whatToShare: 'What would you like to share?',
        options: {
          all: 'All records',
          recent: 'Last 4 weeks only',
          specific: 'Specific records',
        },
        confirm: 'Confirm',
        cancel: 'Cancel',
        disclaimer: 'You can revoke access at any time',
      },
      empty: {
        title: 'No Records Yet',
        description: 'Your health history will appear here after visiting a healthcare facility',
      },
      offline: 'Cached records - will sync when online',
    },
  };

  const t = content[language];
  const reducedMotion = prefersReducedMotion();

  // Load records (would be from API/local cache)
  useEffect(() => {
    setLoading(true);
    // Mock data
    setTimeout(() => {
      const mockRecords: HealthRecord[] = [
        {
          id: '1',
          date: '2026-02-05',
          type: 'visit',
          facility: 'Mwananyamala Hospital',
          facilityLocation: 'Dar es Salaam',
          summary: 'Checkup for fever and cough. Prescribed medication. Return if symptoms worsen.',
          urgent: false,
        },
        {
          id: '2',
          date: '2026-01-28',
          type: 'diagnostic',
          facility: 'Temeke Health Center',
          facilityLocation: 'Dar es Salaam',
          summary: 'Blood test results: Normal. No action needed.',
          urgent: false,
        },
        {
          id: '3',
          date: '2026-01-20',
          type: 'medication',
          facility: 'Ilala Pharmacy',
          facilityLocation: 'Dar es Salaam',
          summary: 'Prescribed: Amoxicillin 500mg, 3 times daily for 7 days',
          urgent: false,
        },
      ];

      if (patientSummary.pregnancyWeek) {
        mockRecords.unshift({
          id: '0',
          date: '2026-02-01',
          type: 'pregnancy',
          facility: 'Muhimbili Antenatal Clinic',
          facilityLocation: 'Dar es Salaam',
          summary: `Week ${patientSummary.pregnancyWeek} checkup. Mother and baby are healthy. Next visit in 4 weeks.`,
          urgent: false,
        });
      }

      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, [patientSummary.pregnancyWeek]);

  const filteredRecords =
    filterType === 'all'
      ? records
      : records.filter((r) => r.type === filterType);

  if (loading) {
    return <LoadingState message={language === 'sw' ? 'Inapakia' : 'Loading'} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Emergency Button - Always Visible */}
      <div className="fixed top-4 right-4 z-50">
        <MedicalButton
          variant="danger"
          size="sm"
          onClick={() => onNavigate('emergency')}
          icon={<EmergencyIcon size={20} color="#FFFFFF" />}
        >
          {t.actions.emergency}
        </MedicalButton>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] pt-4 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B7280] mb-3"
          >
            <ChevronLeftIcon size={20} color="#6B7280" />
            <span className="text-sm">{language === 'sw' ? 'Rudi' : 'Back'}</span>
          </button>

          <h1 className="text-2xl font-semibold text-[#1E1E1E]">{t.title}</h1>
          <p className="text-sm text-[#6B7280] mt-1">{t.subtitle}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Patient Summary Card */}
        <motion.section
          {...(reducedMotion ? {} : LIST_ITEM(0))}
          className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
        >
          <div className="p-4 border-b border-[#E5E7EB] bg-[#F7F9FB]">
            <h2 className="font-semibold text-[#1E1E1E]">{t.patientInfo}</h2>
          </div>

          <div className="p-4 space-y-3">
            {/* Name & Age */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-[#1E1E1E]">
                  {patientSummary.name}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {patientSummary.age} {t.years} • AfyaID: {afyaId}
                </p>
              </div>
            </div>

            {/* Blood Type */}
            {patientSummary.bloodType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">{t.bloodType}:</span>
                <span className="text-sm font-medium text-[#1E1E1E]">
                  {patientSummary.bloodType}
                </span>
              </div>
            )}

            {/* Pregnancy Week */}
            {patientSummary.pregnancyWeek && (
              <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                  <InfoIcon size={16} color="#FFFFFF" />
                </div>
                <div>
                  <p className="text-xs text-[#92400E]">{t.pregnancyWeek}</p>
                  <p className="text-base font-semibold text-[#92400E]">
                    {patientSummary.pregnancyWeek}
                  </p>
                </div>
              </div>
            )}

            {/* Allergies */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">
                {t.allergies}:
              </p>
              {patientSummary.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patientSummary.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-sm rounded-lg"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">{t.noAllergies}</p>
              )}
            </div>

            {/* Chronic Conditions */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">
                {t.chronicConditions}:
              </p>
              {patientSummary.chronicConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patientSummary.chronicConditions.map((condition, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-sm rounded-lg"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">{t.noConditions}</p>
              )}
            </div>

            {/* Current Medications */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">
                {t.currentMedications}:
              </p>
              {patientSummary.currentMedications.length > 0 ? (
                <div className="space-y-2">
                  {patientSummary.currentMedications.map((med, i) => (
                    <p key={i} className="text-sm text-[#1E1E1E]">
                      • {med}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">{t.noMedications}</p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Actions */}
        <motion.section
          {...(reducedMotion ? {} : LIST_ITEM(1))}
          className="grid grid-cols-2 gap-3"
        >
          <MedicalButton
            variant="secondary"
            size="md"
            onClick={() => setShowShareConsent(true)}
            fullWidth
          >
            {t.actions.share}
          </MedicalButton>

          <MedicalButton
            variant="secondary"
            size="md"
            onClick={() => {
              /* Upload document */
            }}
            fullWidth
          >
            {t.actions.upload}
          </MedicalButton>
        </motion.section>

        {/* Timeline */}
        <section>
          <h2 className="text-lg font-semibold text-[#1E1E1E] mb-3">
            {t.timeline}
          </h2>

          {/* Filter Pills */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.entries(t.filter).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === key
                    ? 'bg-[#0F3D56] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Records List */}
          {filteredRecords.length === 0 ? (
            <EmptyState
              title={t.empty.title}
              description={t.empty.description}
            />
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record, index) => (
                <motion.button
                  key={record.id}
                  {...(reducedMotion ? {} : LIST_ITEM(index + 2))}
                  onClick={() => setSelectedRecord(record)}
                  className="w-full p-4 bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F7F9FB] transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        record.type === 'visit'
                          ? 'bg-[#DBEAFE]'
                          : record.type === 'medication'
                          ? 'bg-[#EDE9FE]'
                          : record.type === 'diagnostic'
                          ? 'bg-[#D1FAE5]'
                          : 'bg-[#FEF3C7]'
                      }`}
                    >
                      <RecordsIcon
                        size={20}
                        color={
                          record.type === 'visit'
                            ? '#1E88E5'
                            : record.type === 'medication'
                            ? '#8B5CF6'
                            : record.type === 'diagnostic'
                            ? '#10B981'
                            : '#F59E0B'
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#6B7280]">
                          {t.recordTypes[record.type]}
                        </span>
                        <span className="text-xs text-[#6B7280]">•</span>
                        <span className="text-xs text-[#6B7280]">
                          {new Date(record.date).toLocaleDateString(
                            language === 'sw' ? 'sw-TZ' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-[#1E1E1E] mb-1">
                        {record.facility}
                      </p>

                      <p className="text-sm text-[#6B7280] line-clamp-2">
                        {record.summary}
                      </p>

                      <div className="flex items-center gap-1 mt-2 text-xs text-[#6B7280]">
                        <LocationIcon size={12} color="#6B7280" />
                        <span>{record.facilityLocation}</span>
                      </div>
                    </div>

                    <ChevronRightIcon size={20} color="#6B7280" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Offline Indicator */}
        {!navigator.onLine && (
          <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
            <p className="text-xs text-[#92400E]">{t.offline}</p>
          </div>
        )}
      </main>

      {/* Share Consent Modal */}
      {showShareConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2">
              {t.shareConsent.title}
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              {t.shareConsent.description}
            </p>

            <div className="space-y-4 mb-6">
              {Object.entries(t.shareConsent.options).map(([key, label]) => (
                <button
                  key={key}
                  className="w-full p-3 border-2 border-[#E5E7EB] rounded-lg hover:border-[#0F3D56] transition-colors text-left"
                >
                  <p className="text-sm font-medium text-[#1E1E1E]">{label}</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#6B7280] mb-4">
              {t.shareConsent.disclaimer}
            </p>

            <div className="flex gap-3">
              <MedicalButton
                variant="secondary"
                size="md"
                onClick={() => setShowShareConsent(false)}
                fullWidth
              >
                {t.shareConsent.cancel}
              </MedicalButton>
              <MedicalButton
                variant="primary"
                size="md"
                onClick={() => {
                  // Handle share
                  setShowShareConsent(false);
                }}
                fullWidth
              >
                {t.shareConsent.confirm}
              </MedicalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
