/**
 * MedicationTracker - Medication & Treatment Adherence
 * Medication reminders (SMS + in-app), visual dose tracking
 * Refill requests, side-effect check-ins
 * Habit-forming, not nagging
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Pill,
  Clock,
  Check,
  CheckCircle,
  AlertCircle,
  Plus,
  Bell,
  Calendar,
  Info,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from './ui/button';

interface MedicationTrackerProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: { sw: string; en: string };
  times: string[];
  startDate: Date;
  endDate?: Date;
  daysRemaining?: number;
  takenToday: boolean[];
  sideEffects?: string[];
  instructions: { sw: string; en: string };
  color: string;
}

interface DoseLog {
  medicationId: string;
  date: Date;
  time: string;
  taken: boolean;
  skipped?: boolean;
  notes?: string;
}

export function MedicationTracker({ language, onBack }: MedicationTrackerProps) {
  const [view, setView] = useState<'list' | 'details' | 'add'>('list');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showSideEffectCheck, setShowSideEffectCheck] = useState(false);

  const content = {
    sw: {
      title: 'Dawa Zangu',
      subtitle: 'Fuatilia matibabu yako',
      today: 'Leo',
      upcoming: 'Zinazokuja',
      completed: 'Zimekamilika',
      addMedication: 'Ongeza Dawa',
      takeDose: 'Meza Kipimo',
      markTaken: 'Weka Alama Umemeza',
      skip: 'Ruka',
      refillNeeded: 'Inahitaji Kujaza Upya',
      daysLeft: 'siku zimebaki',
      timesToday: 'mara leo',
      sideEffects: 'Athari Mbaya',
      reportSideEffect: 'Ripoti Athari Mbaya',
      instructions: 'Maelekezo',
      schedule: 'Ratiba',
      adherence: 'Ushikamano',
      thisWeek: 'Wiki hii',
      requestRefill: 'Omba Kujaza Upya',
      viewHistory: 'Angalia Historia',
      editMedication: 'Hariri Dawa',
      deleteMedication: 'Futa Dawa',
      noMedications: 'Hakuna dawa',
      noMedicationsDescription: 'Dawa zako zitaonekana hapa',
      reminderSet: 'Ukumbusho umewekwa',
      goodJob: 'Kazi Nzuri!',
      keepItUp: 'Endelea hivyo',
    },
    en: {
      title: 'My Medications',
      subtitle: 'Track your treatment',
      today: 'Today',
      upcoming: 'Upcoming',
      completed: 'Completed',
      addMedication: 'Add Medication',
      takeDose: 'Take Dose',
      markTaken: 'Mark as Taken',
      skip: 'Skip',
      refillNeeded: 'Refill Needed',
      daysLeft: 'days left',
      timesToday: 'times today',
      sideEffects: 'Side Effects',
      reportSideEffect: 'Report Side Effect',
      instructions: 'Instructions',
      schedule: 'Schedule',
      adherence: 'Adherence',
      thisWeek: 'This week',
      requestRefill: 'Request Refill',
      viewHistory: 'View History',
      editMedication: 'Edit Medication',
      deleteMedication: 'Delete Medication',
      noMedications: 'No medications',
      noMedicationsDescription: 'Your medications will appear here',
      reminderSet: 'Reminder set',
      goodJob: 'Good Job!',
      keepItUp: 'Keep it up',
    },
  };

  const t = content[language];

  // Mock medications
  const mockMedications: Medication[] = [
    {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: { sw: 'Mara 3 kwa siku', en: '3 times daily' },
      times: ['08:00', '14:00', '20:00'],
      startDate: new Date('2026-02-03'),
      endDate: new Date('2026-02-08'),
      daysRemaining: 3,
      takenToday: [true, true, false],
      instructions: {
        sw: 'Meza vidonge 2 kila baada ya saa 8. Tumia na chakula.',
        en: 'Take 2 tablets every 8 hours. Take with food.',
      },
      color: '#10B981',
    },
    {
      id: '2',
      name: 'Amoxicillin',
      dosage: '250mg',
      frequency: { sw: 'Mara 2 kwa siku', en: '2 times daily' },
      times: ['09:00', '21:00'],
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-08'),
      daysRemaining: 3,
      takenToday: [true, false],
      instructions: {
        sw: 'Meza kapsuli 1 asubuhi na jioni. Maliza dawa zote.',
        en: 'Take 1 capsule morning and evening. Complete the full course.',
      },
      color: '#1E88E5',
    },
    {
      id: '3',
      name: 'Metformin',
      dosage: '500mg',
      frequency: { sw: 'Mara 2 kwa siku', en: '2 times daily' },
      times: ['08:00', '20:00'],
      startDate: new Date('2025-01-01'),
      takenToday: [true, false],
      instructions: {
        sw: 'Dawa ya kudhibiti sukari. Meza na chakula.',
        en: 'Diabetes medication. Take with meals.',
      },
      color: '#8B5CF6',
    },
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const getNextDose = (med: Medication) => {
    const currentTime = getCurrentTime();
    const nextTime = med.times.find((t) => t > currentTime);
    return nextTime || med.times[0];
  };

  const calculateAdherence = (med: Medication) => {
    // Simple calculation: taken today / total times today
    const taken = med.takenToday.filter((t) => t).length;
    const total = med.takenToday.length;
    return Math.round((taken / total) * 100);
  };

  const handleMarkTaken = (medId: string, timeIndex: number) => {
    // In production, this would update the backend
    alert(
      language === 'sw'
        ? 'Umeweka alama umemeza dawa. Kazi nzuri!'
        : 'Marked as taken. Good job!'
    );
  };

  // List View
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Pill className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t.title}</h1>
            </div>
            <p className="text-white/90 text-base">{t.subtitle}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <p className="text-2xl font-bold text-[#1A1D23]">
                {mockMedications.length}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                {language === 'sw' ? 'Dawa' : 'Medications'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <p className="text-2xl font-bold text-[#10B981]">85%</p>
              <p className="text-sm text-[#6B7280] mt-1">{t.adherence}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <p className="text-2xl font-bold text-[#1A1D23]">
                {mockMedications.filter((m) => m.takenToday.includes(false)).length}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">{t.upcoming}</p>
            </div>
          </div>

          {/* Add Medication Button */}
          <Button
            onClick={() => setView('add')}
            variant="outline"
            className="w-full mb-6 h-12 border-dashed"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.addMedication}
          </Button>

          {/* Today's Schedule */}
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">{t.today}</h2>

          {mockMedications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
              <Pill className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A1D23] mb-2">
                {t.noMedications}
              </h3>
              <p className="text-[#6B7280]">{t.noMedicationsDescription}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockMedications.map((med, index) => {
                const adherence = calculateAdherence(med);
                const nextDose = getNextDose(med);
                const dosesLeft = med.takenToday.filter((t) => !t).length;

                return (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {/* Color Indicator */}
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${med.color}15` }}
                      >
                        <Pill className="w-6 h-6" style={{ color: med.color }} />
                      </div>

                      {/* Med Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div>
                            <h3 className="text-lg font-semibold text-[#1A1D23]">
                              {med.name} {med.dosage}
                            </h3>
                            <p className="text-sm text-[#6B7280]">
                              {med.frequency[language]}
                            </p>
                          </div>
                          {med.daysRemaining && med.daysRemaining <= 3 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEB] rounded-full">
                              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                              <span className="text-xs font-medium text-[#F59E0B]">
                                {med.daysRemaining} {t.daysLeft}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#6B7280]">{t.today}</span>
                        <span className="text-sm font-medium text-[#1A1D23]">
                          {adherence}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${adherence}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: med.color }}
                        />
                      </div>
                    </div>

                    {/* Dose Times */}
                    <div className="flex gap-2 mb-4">
                      {med.times.map((time, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!med.takenToday[idx]) {
                              handleMarkTaken(med.id, idx);
                            }
                          }}
                          className={`flex-1 p-3 rounded-lg border transition-all ${
                            med.takenToday[idx]
                              ? 'bg-[#ECFDF5] border-[#10B981]'
                              : 'bg-[#FAFBFC] border-[#E5E7EB] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-[#6B7280]" />
                            <span className="text-sm font-medium text-[#1A1D23]">
                              {time}
                            </span>
                          </div>
                          {med.takenToday[idx] && (
                            <div className="flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {dosesLeft > 0 && (
                        <Button
                          onClick={() => {
                            setSelectedMed(med);
                            setView('details');
                          }}
                          className="flex-1"
                          style={{ backgroundColor: med.color }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {t.markTaken}
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedMed(med);
                          setView('details');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        {language === 'sw' ? 'Angalia' : 'View'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Motivational Card */}
          {mockMedications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 text-white"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{t.goodJob}</h3>
                  <p className="text-white/90 text-sm">{t.keepItUp}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Details View
  if (view === 'details' && selectedMed) {
    const adherence = calculateAdherence(selectedMed);

    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-24">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 mb-4 text-[#6B7280] hover:text-[#1A1D23] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedMed.color}15` }}
              >
                <Pill className="w-8 h-8" style={{ color: selectedMed.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A1D23]">
                  {selectedMed.name}
                </h1>
                <p className="text-[#6B7280]">{selectedMed.dosage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {/* Adherence Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1A1D23]">
                {t.adherence} {t.thisWeek}
              </h2>
              <span className="text-3xl font-bold" style={{ color: selectedMed.color }}>
                {adherence}%
              </span>
            </div>
            <div className="h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${adherence}%`,
                  backgroundColor: selectedMed.color,
                }}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">{t.schedule}</h2>
            <div className="space-y-3">
              {selectedMed.times.map((time, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-[#FAFBFC] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-base font-medium text-[#1A1D23]">
                      {time}
                    </span>
                  </div>
                  {selectedMed.takenToday[idx] ? (
                    <div className="flex items-center gap-2 text-[#10B981]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{t.completed}</span>
                    </div>
                  ) : (
                    <Button size="sm" style={{ backgroundColor: selectedMed.color }}>
                      {t.markTaken}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[#1A1D23] mb-2">
                  {t.instructions}
                </h3>
                <p className="text-[#1A1D23] leading-relaxed">
                  {selectedMed.instructions[language]}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {selectedMed.daysRemaining && selectedMed.daysRemaining <= 3 && (
              <Button
                variant="outline"
                className="w-full h-12 border-[#F59E0B] text-[#F59E0B] hover:bg-[#FFFBEB]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t.requestRefill}
              </Button>
            )}
            <Button variant="outline" className="w-full h-12">
              <AlertCircle className="w-5 h-5 mr-2" />
              {t.reportSideEffect}
            </Button>
            <Button variant="outline" className="w-full h-12">
              <Calendar className="w-5 h-5 mr-2" />
              {t.viewHistory}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
