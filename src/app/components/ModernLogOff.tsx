/**
 * ModernLogOff - Reassuring Session End
 * "Your information is saved securely"
 * Reminder of next step, emergency contact visible, warm tone
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, Calendar, Phone, Heart, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ModernLogOffProps {
  language: 'sw' | 'en';
  userName?: string;
  nextAppointment?: {
    date: string;
    time: string;
    type: string;
  };
  onConfirmLogout: () => void;
  onCancel: () => void;
}

export function ModernLogOff({
  language,
  userName = 'User',
  nextAppointment,
  onConfirmLogout,
  onCancel,
}: ModernLogOffProps) {
  const content = {
    sw: {
      title: 'Kwaheri, ' + userName,
      subtitle: 'Tutaonana tena hivi karibuni',
      securityMessage: 'Taarifa zako zimehifadhiwa salama',
      securityPoints: [
        'Data yako imefungwa kwa usalama',
        'Haujasahau chochote',
        'Unaweza kurudi wakati wowote',
      ],
      nextSteps: 'Hatua Zinazofuata',
      noAppointment: 'Hakuna miadi ya baadaye iliyopangwa',
      emergency: 'Kwa Dharura',
      emergencyNumber: '112',
      emergencyText: 'Piga nambari hii mara moja kwa dharura',
      logout: 'Toka',
      cancel: 'Endelea Kutumia',
      reminder: 'Kumbuka kutembelea daktari ikiwa dalili zinaendelea',
    },
    en: {
      title: 'Goodbye, ' + userName,
      subtitle: 'See you again soon',
      securityMessage: 'Your information is saved securely',
      securityPoints: [
        'Your data is encrypted and secure',
        'You haven\'t forgotten anything',
        'You can return anytime',
      ],
      nextSteps: 'Next Steps',
      noAppointment: 'No upcoming appointments scheduled',
      emergency: 'For Emergencies',
      emergencyNumber: '112',
      emergencyText: 'Call this number immediately for emergencies',
      logout: 'Log Out',
      cancel: 'Stay Signed In',
      reminder: 'Remember to see a doctor if symptoms persist',
    },
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#1E88E5] to-[#1976D2] p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
          <p className="text-white/90">{t.subtitle}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Security assurance */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-[#ECFDF5] rounded-xl">
              <div className="w-10 h-10 bg-[#43A047] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-[#065F46]">{t.securityMessage}</p>
            </div>

            <div className="space-y-2">
              {t.securityPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-[#6B7280]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#43A047] flex-shrink-0" />
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next appointment */}
          <div className="p-4 bg-[#EFF6FF] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#1E88E5]" />
              <span className="text-sm font-medium text-[#1E88E5]">{t.nextSteps}</span>
            </div>
            {nextAppointment ? (
              <div>
                <p className="text-sm text-[#1A1D23] font-medium">
                  {nextAppointment.type}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {nextAppointment.date} • {nextAppointment.time}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">{t.noAppointment}</p>
            )}
          </div>

          {/* Emergency contact */}
          <div className="p-4 bg-[#FEF2F2] rounded-xl border-2 border-[#FEE2E2]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#991B1B] mb-1">
                  {t.emergency}
                </p>
                <p className="text-2xl font-bold text-[#EF4444] mb-1">
                  {t.emergencyNumber}
                </p>
                <p className="text-xs text-[#991B1B]">{t.emergencyText}</p>
              </div>
            </div>
          </div>

          {/* Health reminder */}
          <div className="p-3 bg-[#FFF7ED] rounded-xl">
            <p className="text-xs text-center text-[#92400E]">{t.reminder}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onConfirmLogout}
              className="w-full h-12 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-xl"
            >
              {t.logout}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}