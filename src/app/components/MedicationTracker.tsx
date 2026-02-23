/**
 * MedicationTracker - Complete medication management interface
 * Track medications, doses, refills, and adherence
 */

import React, { useState } from 'react';
import { Pill, Clock, Calendar, AlertTriangle, CheckCircle, Plus, ChevronRight, TrendingUp } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { MissedMedicationGuidance } from './MissedMedicationGuidance';
import { motion } from 'motion/react';

const translations = {
  sw: {
    title: 'Dawa Zangu',
    subtitle: 'Fuatilia dawa zako na mipango',
    today: 'Leo',
    upcoming: 'Zijazo',
    history: 'Historia',
    addMedication: 'Ongeza Dawa',
    takeMedication: 'Umya',
    taken: 'Umemwa',
    missed: 'Umekosa',
    skipped: 'Umeruka',
    adherence: 'Kufuata Mipango',
    refillIn: 'Jaza tena baada ya siku',
    dosesLeft: 'Kipimo zilizobaki',
    dailySchedule: 'Ratiba ya Kila Siku',
    morning: 'Asubuhi',
    afternoon: 'Mchana',
    evening: 'Jioni',
    night: 'Usiku',
    stats: 'Takwimu',
    thisWeek: 'Wiki Hii',
    thisMonth: 'Mwezi Huu',
    onTime: 'Kwa Wakati',
    late: 'Umechelewa',
    noMedications: 'Hakuna Dawa Zilizowekwa',
    tapToAdd: 'Gusa kuongeza dawa yako ya kwanza',
  },
  en: {
    title: 'My Medications',
    subtitle: 'Track your medications and schedules',
    today: 'Today',
    upcoming: 'Upcoming',
    history: 'History',
    addMedication: 'Add Medication',
    takeMedication: 'Take',
    taken: 'Taken',
    missed: 'Missed',
    skipped: 'Skipped',
    adherence: 'Adherence',
    refillIn: 'Refill in',
    dosesLeft: 'doses left',
    dailySchedule: 'Daily Schedule',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    stats: 'Statistics',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    onTime: 'On Time',
    late: 'Late',
    noMedications: 'No Medications Added',
    tapToAdd: 'Tap to add your first medication',
  },
};

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  refillDays: number;
  dosesLeft: number;
  totalDoses: number;
  condition: string;
  missedDoses: number;
}

export function MedicationTracker({ onBack }: { onBack: () => void }) {
  const { language } = useApp();
  const t = translations[language];
  const [view, setView] = useState<'today' | 'upcoming' | 'history'>('today');
  const [showGuidance, setShowGuidance] = useState<Medication | null>(null);

  // Mock medication data
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: language === 'sw' ? 'Mara 1 kwa siku' : 'Once daily',
      times: ['08:00'],
      refillDays: 7,
      dosesLeft: 7,
      totalDoses: 30,
      condition: language === 'sw' ? 'Shinikizo la Damu' : 'Hypertension',
      missedDoses: 2,
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: language === 'sw' ? 'Mara 2 kwa siku' : 'Twice daily',
      times: ['08:00', '20:00'],
      refillDays: 14,
      dosesLeft: 28,
      totalDoses: 60,
      condition: language === 'sw' ? 'Kisukari' : 'Diabetes',
      missedDoses: 0,
    },
    {
      id: '3',
      name: 'Aspirin',
      dosage: '75mg',
      frequency: language === 'sw' ? 'Mara 1 kwa siku' : 'Once daily',
      times: ['08:00'],
      refillDays: 2,
      dosesLeft: 2,
      totalDoses: 30,
      condition: language === 'sw' ? 'Moyo' : 'Cardiovascular',
      missedDoses: 0,
    },
  ];

  // Calculate adherence
  const adherenceRate = 85; // Mock: would be calculated from history

  // Get today's schedule
  const todaySchedule = medications.flatMap((med) =>
    med.times.map((time) => ({
      ...med,
      scheduledTime: time,
      taken: Math.random() > 0.3, // Mock status
    }))
  );

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="text-sm font-medium">{language === 'sw' ? 'Rudi' : 'Back'}</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
            <Pill className="w-8 h-8 text-blue-600" />
          </div>

          {/* Adherence Card */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.adherence}</p>
                <p className="text-3xl font-bold text-green-700">{adherenceRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{t.thisWeek}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex gap-4">
          {(['today', 'upcoming', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`py-3 px-4 border-b-2 transition-all font-semibold text-sm ${
                view === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* TODAY VIEW */}
        {view === 'today' && (
          <div className="space-y-6">
            {/* Alerts */}
            {medications.some((med) => med.refillDays <= 3 || med.missedDoses > 0) && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900">{language === 'sw' ? 'Tahadhari' : 'Alerts'}</h2>
                {medications.map((med) => {
                  if (med.missedDoses > 0 || med.refillDays <= 3) {
                    return (
                      <button
                        key={med.id}
                        onClick={() => setShowGuidance(med)}
                        className="w-full text-left"
                      >
                        <div className={`p-4 rounded-xl border-2 ${
                          med.dosesLeft === 0
                            ? 'bg-red-50 border-red-500'
                            : med.refillDays <= 3
                            ? 'bg-orange-50 border-orange-500'
                            : 'bg-amber-50 border-amber-500'
                        }`}>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-5 h-5 ${
                              med.dosesLeft === 0 ? 'text-red-600' : 'text-orange-600'
                            }`} />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{med.name}</p>
                              <p className="text-sm text-gray-700">
                                {med.missedDoses > 0 &&
                                  (language === 'sw'
                                    ? `${med.missedDoses} kipimo umekosa`
                                    : `${med.missedDoses} doses missed`)}
                                {med.refillDays <= 3 &&
                                  (language === 'sw'
                                    ? ` • Jaza tena ndani ya siku ${med.refillDays}`
                                    : ` • Refill in ${med.refillDays} days`)}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Today's Schedule */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t.dailySchedule}</h2>
              <div className="space-y-3">
                {todaySchedule.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.scheduledTime}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-xl border-2 p-4 ${
                      item.taken ? 'border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.taken ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {item.taken ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Pill className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name} {item.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Clock className="w-3.5 h-3.5 inline mr-1" />
                            {item.scheduledTime} • {item.condition}
                          </p>
                        </div>
                      </div>

                      {!item.taken && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          {t.takeMedication}
                        </button>
                      )}
                      {item.taken && (
                        <span className="text-sm font-semibold text-green-600">{t.taken}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Medications */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'sw' ? 'Dawa Zote' : 'All Medications'}
              </h2>
              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {med.name} <span className="text-gray-600">{med.dosage}</span>
                        </h3>
                        <p className="text-sm text-gray-600">{med.frequency}</p>
                        <p className="text-xs text-gray-500 mt-1">{med.condition}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">{t.dosesLeft}</p>
                        <p className="text-lg font-bold text-gray-900">
                          {med.dosesLeft}/{med.totalDoses}
                        </p>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                          <div
                            className={`h-full rounded-full ${
                              med.dosesLeft <= 3 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(med.dosesLeft / med.totalDoses) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">{t.refillIn}</p>
                        <p className={`text-lg font-bold ${
                          med.refillDays <= 3 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {med.refillDays} {language === 'sw' ? 'siku' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING VIEW */}
        {view === 'upcoming' && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>{language === 'sw' ? 'Ratiba za baadaye' : 'Upcoming schedules'}</p>
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>{language === 'sw' ? 'Historia ya dawa' : 'Medication history'}</p>
          </div>
        )}
      </div>

      {/* Missed Medication Guidance Modal */}
      {showGuidance && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <MissedMedicationGuidance
              medicationName={`${showGuidance.name} ${showGuidance.dosage}`}
              missedDoses={showGuidance.missedDoses}
              daysUntilRefill={showGuidance.refillDays}
              isOutOfStock={showGuidance.dosesLeft === 0}
              language={language}
              onContactCHW={() => {
                setShowGuidance(null);
                // Handle CHW contact
              }}
              onMarkTaken={() => {
                setShowGuidance(null);
                // Handle mark as taken
              }}
              onRequestRefill={() => {
                setShowGuidance(null);
                // Handle refill request
              }}
            />
            <button
              onClick={() => setShowGuidance(null)}
              className="mt-4 w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
