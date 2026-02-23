/**
 * SafetyDisclaimerModal - Informed Consent for Medical Tools
 * Shows BEFORE symptom checker, appointment booking, or any AI guidance
 * Ensures users understand limitations and need for professional validation
 */

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SafetyDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  tool: 'symptomChecker' | 'appointment' | 'aiGuidance';
  language: 'sw' | 'en';
}

const content = {
  sw: {
    symptomChecker: {
      title: 'Onyo Muhimu: Angalizi ya Dalili',
      warnings: [
        'Hii ni ushauri wa msingi tu, si uchunguzi wa matibabu',
        'Lazima uthibitishwe na mtaalamu wa afya',
        'Usitumie kama mbadala wa kuona daktari',
        'Kwa dharura, piga simu 114 au nenda hospitali',
        'Tunahifadhi data kwa madhumuni ya ukaguzi tu',
      ],
      understand: 'Ninaelewa na nikubali',
      decline: 'Situmii Sasa',
      acceptButton: 'Endelea kwa Angalizi',
    },
    appointment: {
      title: 'Onyo: Upangaji wa Miadi',
      warnings: [
        'Miadi haithibitishwi mpaka kituo kikiithibitisha',
        'Usifuatilie tu miadi - kwa hali mbaya, nenda kliniki SASA',
        'Utapokea ujumbe wa SMS wa kuthibitisha',
        'Kumbuka kubeba kitambulisho na kadi ya afya',
      ],
      understand: 'Ninaelewa',
      decline: 'Rudi',
      acceptButton: 'Endelea kupanga',
    },
    aiGuidance: {
      title: 'Onyo: Ushauri wa AI',
      warnings: [
        'AI ni msaidizi tu, si daktari',
        'Ushauri lazima uthibitishwe na mtaalamu',
        'Usitumie kwa maamuzi ya dharura',
        'Data inatumika kuboresha huduma tu',
      ],
      understand: 'Ninaelewa',
      decline: 'Rudi',
      acceptButton: 'Endelea',
    },
  },
  en: {
    symptomChecker: {
      title: 'Important Notice: Symptom Checker',
      warnings: [
        'This is preliminary guidance only, not a medical diagnosis',
        'Must be validated by a healthcare professional',
        'Do not use as a substitute for seeing a doctor',
        'For emergencies, call 114 or go to hospital immediately',
        'We store data for audit purposes only',
      ],
      understand: 'I understand and agree',
      decline: 'Not Now',
      acceptButton: 'Continue to Symptom Checker',
    },
    appointment: {
      title: 'Notice: Appointment Booking',
      warnings: [
        'Appointments are not confirmed until the facility confirms',
        'Do not wait for an appointment - for severe conditions, go to clinic NOW',
        'You will receive an SMS confirmation',
        'Remember to bring your ID and health card',
      ],
      understand: 'I understand',
      decline: 'Go Back',
      acceptButton: 'Continue Booking',
    },
    aiGuidance: {
      title: 'Notice: AI Guidance',
      warnings: [
        'AI is an assistant only, not a doctor',
        'Guidance must be validated by a professional',
        'Do not use for emergency decisions',
        'Data is used to improve services only',
      ],
      understand: 'I understand',
      decline: 'Go Back',
      acceptButton: 'Continue',
    },
  },
};

export function SafetyDisclaimerModal({
  isOpen,
  onAccept,
  onDecline,
  tool,
  language,
}: SafetyDisclaimerModalProps) {
  const [hasChecked, setHasChecked] = useState(false);
  const t = content[language][tool];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onDecline}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b-4 border-amber-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{t.title}</h2>
                      <p className="text-sm text-amber-800">
                        {language === 'sw'
                          ? 'Tafadhali soma kwa makini kabla ya kuendelea'
                          : 'Please read carefully before continuing'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onDecline}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <ul className="space-y-3">
                  {t.warnings.map((warning, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 font-medium">{warning}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Checkbox */}
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasChecked}
                      onChange={(e) => setHasChecked(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-blue-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-blue-900">{t.understand}</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                <button
                  onClick={onDecline}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                  style={{ minHeight: '48px' }}
                >
                  {t.decline}
                </button>
                <button
                  onClick={onAccept}
                  disabled={!hasChecked}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    hasChecked
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  <CheckCircle className="w-5 h-5" />
                  {t.acceptButton}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
