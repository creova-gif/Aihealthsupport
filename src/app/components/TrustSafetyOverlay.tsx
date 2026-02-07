import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrustSafetyOverlayProps {
  language: 'sw' | 'en';
  onDismiss: () => void;
}

const translations = {
  sw: {
    title: 'AfyaAI inasaidia wataalamu wa afya',
    subtitle: 'Haibadilishi daktari',
    trustPoints: [
      'Inatumika na Wizara ya Afya Tanzania',
      'Imeidhinishwa na TMDA',
      'Data yako inalindwa kwa PDPA Tanzania',
    ],
    dataPrivacyLink: 'Jinsi data yako inalindwa',
    understood: 'Nimeelewa',
    badges: {
      moh: 'Wizara ya Afya',
      tmda: 'TMDA Certified',
      pdpa: 'PDPA Compliant',
    },
  },
  en: {
    title: 'AfyaAI assists healthcare professionals',
    subtitle: 'It does not replace your doctor',
    trustPoints: [
      'Used by Tanzania Ministry of Health',
      'Certified by TMDA',
      'Your data is protected under Tanzania PDPA',
    ],
    dataPrivacyLink: 'How we protect your data',
    understood: 'I Understand',
    badges: {
      moh: 'Ministry of Health',
      tmda: 'TMDA Certified',
      pdpa: 'PDPA Compliant',
    },
  },
};

export function TrustSafetyOverlay({ language, onDismiss }: TrustSafetyOverlayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[language];

  // Auto-dismiss after 15 seconds if user doesn't interact
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Header with shield icon */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
              <Shield className="h-10 w-10 text-[#0F9D58]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.title}
            </h2>
            
            <p className="text-lg text-gray-700 font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Trust badges */}
          <div className="px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300">
                <Shield className="h-4 w-4 text-green-700" />
                <span className="text-sm font-semibold text-green-900">
                  {t.badges.moh}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-300">
                <CheckCircle className="h-4 w-4 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">
                  {t.badges.tmda}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-300">
                <Lock className="h-4 w-4 text-purple-700" />
                <span className="text-sm font-semibold text-purple-900">
                  {t.badges.pdpa}
                </span>
              </div>
            </div>

            {/* Trust points */}
            <div className="space-y-3 mb-6">
              {t.trustPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-[#0F9D58]" />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Data privacy link */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline mb-6"
            >
              🔒 {t.dataPrivacyLink}
            </button>

            {/* Privacy details (collapsible) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-50 rounded-xl p-4 mb-6 overflow-hidden"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {language === 'sw' ? (
                      <>
                        • Data yako imesimbwa (encrypted) kwa kiwango cha benki
                        <br />
                        • Hakuna kushiriki data bila idhini yako
                        <br />
                        • Unaweza kufuta data yako wakati wowote
                        <br />
                        • AI inasaidia wataalamu wa afya, sio badala yao
                      </>
                    ) : (
                      <>
                        • Your data is bank-level encrypted
                        <br />
                        • No data sharing without your consent
                        <br />
                        • You can delete your data anytime
                        <br />
                        • AI assists healthcare workers, not replaces them
                      </>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onDismiss}
              className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0F9D58 0%, #0D7A45 100%)',
              }}
            >
              {t.understood}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
