/**
 * EmergencyScreen - Critical Access Screen
 * 
 * SAFETY REQUIREMENTS:
 * - Always accessible (bottom nav center button)
 * - No authentication required (anyone can use)
 * - Large touch targets (56px minimum)
 * - Clear visual hierarchy
 * - Works offline
 * - Multiple contact methods (call, SMS, location)
 * - Medical info visible without login
 * 
 * USER SCENARIOS:
 * - Patient having emergency (call 112)
 * - Bystander helping unconscious patient (view medical info)
 * - Rural user needing nearest facility
 * - Caregiver acting on behalf of dependent
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MapPin,
  AlertCircle,
  Heart,
  Info,
  Navigation,
  Clock,
  User,
} from 'lucide-react';

interface EmergencyScreenProps {
  language: 'sw' | 'en';
  userName?: string;
  userMedicalInfo?: {
    bloodType?: string;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: string[];
    emergencyContacts: Array<{
      name: string;
      phone: string;
      relationship: string;
    }>;
  };
  nearestFacilities?: Array<{
    name: string;
    distance: string;
    phone: string;
    hasER: boolean;
  }>;
}

export function EmergencyScreen({
  language,
  userName,
  userMedicalInfo,
  nearestFacilities = [],
}: EmergencyScreenProps) {
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  const content = {
    sw: {
      title: 'Msaada wa Dharura',
      subtitle: 'Chagua aina ya msaada unahitaji',
      callEmergency: 'Piga Nambari ya Dharura',
      emergencyNumber: '112',
      emergencyDesc: 'Piga simu mara moja kwa hali ya dharura',
      findHospital: 'Tafuta Hospitali ya Karibu',
      findHospitalDesc: 'Pata njia kwa hospitali iliyo karibu',
      viewMedicalInfo: 'Taarifa za Kiafya',
      viewMedicalInfoDesc: 'Onyesha taarifa muhimu kwa madaktari',
      callContact: 'Piga Mtu wa Kuwasiliana',
      callContactDesc: 'Wasiliana na familia au marafiki',
      medicalInfo: {
        title: 'Taarifa za Kiafya za',
        bloodType: 'Aina ya Damu',
        allergies: 'Mzio',
        noAllergies: 'Hakuna mzio',
        conditions: 'Magonjwa',
        noConditions: 'Hakuna',
        medications: 'Dawa za Sasa',
        noMedications: 'Hakuna',
        emergencyContacts: 'Wawasiliani wa Dharura',
        hide: 'Ficha',
      },
      nearestFacilities: {
        title: 'Vituo vya Karibu',
        distance: 'Umbali',
        hasER: 'Dharura Inapatikana',
        call: 'Piga',
        navigate: 'Elekeza',
      },
      disclaimer: 'Kwa hali ya dharura ya dhati, piga 112 mara moja',
    },
    en: {
      title: 'Emergency Help',
      subtitle: 'Choose the type of help you need',
      callEmergency: 'Call Emergency Services',
      emergencyNumber: '112',
      emergencyDesc: 'Call immediately for life-threatening emergency',
      findHospital: 'Find Nearest Hospital',
      findHospitalDesc: 'Get directions to nearby emergency facility',
      viewMedicalInfo: 'Medical Information',
      viewMedicalInfoDesc: 'Show critical info to medical staff',
      callContact: 'Call Emergency Contact',
      callContactDesc: 'Reach family or friends',
      medicalInfo: {
        title: 'Medical Information for',
        bloodType: 'Blood Type',
        allergies: 'Allergies',
        noAllergies: 'No known allergies',
        conditions: 'Conditions',
        noConditions: 'None',
        medications: 'Current Medications',
        noMedications: 'None',
        emergencyContacts: 'Emergency Contacts',
        hide: 'Hide',
      },
      nearestFacilities: {
        title: 'Nearest Facilities',
        distance: 'Distance',
        hasER: 'Emergency Available',
        call: 'Call',
        navigate: 'Navigate',
      },
      disclaimer: 'For life-threatening emergencies, call 112 immediately',
    },
  };

  const t = content[language];

  // Mock nearest facilities if none provided
  const facilities = nearestFacilities.length > 0 ? nearestFacilities : [
    {
      name: 'Mwananyamala Hospital',
      distance: '2.3 km',
      phone: '+255222150608',
      hasER: true,
    },
    {
      name: 'Temeke Health Center',
      distance: '4.7 km',
      phone: '+255222334455',
      hasER: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FEF2F2] pb-24">
      {/* Critical Emergency Header */}
      <header className="bg-[#DC2626] text-white pt-6 pb-6 px-4 border-b-4 border-[#991B1B]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <AlertCircle className="w-10 h-10" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-sm opacity-90">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Disclaimer Banner */}
        <div className="p-4 bg-white border-2 border-[#FCA5A5] rounded-xl">
          <p className="text-sm text-[#991B1B] font-medium text-center">
            ⚠️ {t.disclaimer}
          </p>
        </div>

        {/* PRIMARY ACTION: Call 112 */}
        <motion.a
          href="tel:112"
          className="block p-6 bg-[#DC2626] text-white rounded-2xl shadow-xl hover:bg-[#B91C1C] transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold mb-1">{t.callEmergency}</p>
              <p className="text-3xl font-bold mb-1">{t.emergencyNumber}</p>
              <p className="text-sm opacity-90">{t.emergencyDesc}</p>
            </div>
          </div>
        </motion.a>

        {/* SECONDARY ACTIONS */}
        <div className="grid grid-cols-1 gap-4">
          {/* Find Nearest Hospital */}
          <motion.button
            onClick={() => {
              // In production, this would use device location
              alert('Opening map to nearest emergency facility...');
            }}
            className="p-5 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#DC2626] transition-colors text-left"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FEE2E2] rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-[#DC2626]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#1A1D23] mb-1">
                  {t.findHospital}
                </p>
                <p className="text-sm text-[#6B7280]">{t.findHospitalDesc}</p>
              </div>
            </div>
          </motion.button>

          {/* View Medical Info */}
          {userMedicalInfo && (
            <motion.button
              onClick={() => setShowMedicalInfo(!showMedicalInfo)}
              className="p-5 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#DC2626] transition-colors text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#DBEAFE] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-[#1E88E5]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#1A1D23] mb-1">
                    {t.viewMedicalInfo}
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.viewMedicalInfoDesc}</p>
                </div>
                <Info className="w-5 h-5 text-[#6B7280]" />
              </div>
            </motion.button>
          )}

          {/* Emergency Contacts */}
          {userMedicalInfo && userMedicalInfo.emergencyContacts.length > 0 && (
            <div className="p-5 bg-white border-2 border-[#E5E7EB] rounded-xl">
              <p className="text-lg font-semibold text-[#1A1D23] mb-3">
                {t.callContact}
              </p>
              <div className="space-y-2">
                {userMedicalInfo.emergencyContacts.map((contact, i) => (
                  <a
                    key={i}
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-between p-3 bg-[#F7F9FB] rounded-lg hover:bg-[#EFF6FF] transition-colors"
                  >
                    <div>
                      <p className="text-base font-medium text-[#1A1D23]">
                        {contact.name}
                      </p>
                      <p className="text-sm text-[#6B7280]">{contact.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1E88E5]">
                        {contact.phone}
                      </span>
                      <Phone className="w-5 h-5 text-[#1E88E5]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Medical Information Panel */}
        {showMedicalInfo && userMedicalInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 bg-white border-2 border-[#DC2626] rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1A1D23]">
                {t.medicalInfo.title} {userName}
              </h3>
              <button
                onClick={() => setShowMedicalInfo(false)}
                className="px-4 py-2 text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
              >
                {t.medicalInfo.hide}
              </button>
            </div>

            <div className="space-y-4">
              {/* Blood Type - CRITICAL */}
              {userMedicalInfo.bloodType && (
                <div className="p-4 bg-[#FEE2E2] border-2 border-[#FCA5A5] rounded-lg">
                  <p className="text-xs font-medium text-[#991B1B] mb-1">
                    {t.medicalInfo.bloodType}
                  </p>
                  <p className="text-3xl font-bold text-[#991B1B]">
                    {userMedicalInfo.bloodType}
                  </p>
                </div>
              )}

              {/* Allergies - CRITICAL */}
              <div className="p-4 bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-lg">
                <p className="text-sm font-semibold text-[#991B1B] mb-2">
                  ⚠️ {t.medicalInfo.allergies}
                </p>
                {userMedicalInfo.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userMedicalInfo.allergies.map((allergy, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-[#DC2626] text-white text-base font-semibold rounded-lg"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6B7280]">{t.medicalInfo.noAllergies}</p>
                )}
              </div>

              {/* Current Medications */}
              <div className="p-4 bg-[#F7F9FB] rounded-lg">
                <p className="text-sm font-semibold text-[#1A1D23] mb-2">
                  {t.medicalInfo.medications}
                </p>
                {userMedicalInfo.currentMedications.length > 0 ? (
                  <ul className="space-y-1">
                    {userMedicalInfo.currentMedications.map((med, i) => (
                      <li key={i} className="text-base text-[#1A1D23]">
                        • {med}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#6B7280]">{t.medicalInfo.noMedications}</p>
                )}
              </div>

              {/* Chronic Conditions */}
              {userMedicalInfo.chronicConditions.length > 0 && (
                <div className="p-4 bg-[#F7F9FB] rounded-lg">
                  <p className="text-sm font-semibold text-[#1A1D23] mb-2">
                    {t.medicalInfo.conditions}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userMedicalInfo.chronicConditions.map((condition, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-sm font-medium rounded-lg"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Nearest Facilities */}
        <div className="p-5 bg-white border-2 border-[#E5E7EB] rounded-xl">
          <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">
            {t.nearestFacilities.title}
          </h3>
          <div className="space-y-3">
            {facilities.map((facility, i) => (
              <div
                key={i}
                className="p-4 bg-[#F7F9FB] rounded-lg border border-[#E5E7EB]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-base font-semibold text-[#1A1D23]">
                      {facility.name}
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      {t.nearestFacilities.distance}: {facility.distance}
                    </p>
                    {facility.hasER && (
                      <p className="text-xs text-[#10B981] font-medium mt-1">
                        ✓ {t.nearestFacilities.hasER}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${facility.phone}`}
                    className="flex-1 px-4 py-2 bg-[#1E88E5] text-white text-center font-medium rounded-lg hover:bg-[#1976D2] transition-colors"
                  >
                    {t.nearestFacilities.call}
                  </a>
                  <button
                    onClick={() => {
                      // In production, open maps app
                      alert(`Opening navigation to ${facility.name}...`);
                    }}
                    className="flex-1 px-4 py-2 bg-white border-2 border-[#1E88E5] text-[#1E88E5] text-center font-medium rounded-lg hover:bg-[#EFF6FF] transition-colors"
                  >
                    {t.nearestFacilities.navigate}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
