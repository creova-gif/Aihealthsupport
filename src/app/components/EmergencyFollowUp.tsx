/**
 * EmergencyFollowUp - Post-Emergency Guidance
 * Shown AFTER emergency triage result to guide next steps clearly
 * Reduces confusion and ensures proper escalation
 */

import React from 'react';
import { Phone, MapPin, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface EmergencyFollowUpProps {
  triageLevel: 'emergency' | 'urgent' | 'moderate' | 'mild';
  language: 'sw' | 'en';
  onCallEmergency: () => void;
  onFindFacility: () => void;
  onGoHome: () => void;
}

const content = {
  sw: {
    emergency: {
      title: 'DHARURA - Hatua Zinazofuata',
      subtitle: 'Fanya moja ya hizi SASA:',
      actions: [
        {
          icon: Phone,
          title: 'Piga Simu 114',
          description: 'Nambari ya dharura ya Tanzania',
          color: 'red',
          priority: 1,
        },
        {
          icon: MapPin,
          title: 'Nenda Hospitali ya Karibu',
          description: 'Usitumie basi - tumia taxi au gari la dharura',
          color: 'red',
          priority: 1,
        },
      ],
      warning: 'USICHELEWE - Hali yako inahitaji msaada wa haraka',
    },
    urgent: {
      title: 'Haraka - Hatua Zinazofuata',
      subtitle: 'Fanya hivi ndani ya masaa 2-4:',
      actions: [
        {
          icon: MapPin,
          title: 'Nenda Kliniki Leo',
          description: 'Usisubiri - hali yako inahitaji uchunguzi wa haraka',
          color: 'orange',
          priority: 1,
        },
        {
          icon: Phone,
          title: 'Piga Kliniki',
          description: 'Eleza dalili zako na uliza kama unapaswa kuja SASA',
          color: 'orange',
          priority: 2,
        },
      ],
      warning: 'Kama dalili zinaongezeka, piga 114 SASA',
    },
    moderate: {
      title: 'Kati - Hatua Zinazofuata',
      subtitle: 'Fanya hivi ndani ya siku 1-2:',
      actions: [
        {
          icon: MapPin,
          title: 'Panga Miadi ya Kliniki',
          description: 'Pata uchunguzi wa kitaalamu ndani ya siku mbili',
          color: 'blue',
          priority: 1,
        },
        {
          icon: Clock,
          title: 'Fuatilia Dalili',
          description: 'Kama dalili zinaongezeka, nenda kliniki SASA',
          color: 'blue',
          priority: 2,
        },
      ],
      warning: 'Angalia dalili - kama zinazidi, nenda kliniki haraka',
    },
    mild: {
      title: 'Nyepesi - Hatua Zinazofuata',
      subtitle: 'Unaweza kujitunza nyumbani:',
      actions: [
        {
          icon: CheckCircle,
          title: 'Pumzika na Kunywa Maji',
          description: 'Pumzika vizuri, nywa maji mengi',
          color: 'green',
          priority: 1,
        },
        {
          icon: Clock,
          title: 'Angalia kwa Siku 2-3',
          description: 'Kama dalili hazipungui, panga miadi',
          color: 'green',
          priority: 2,
        },
      ],
      warning: 'Kama dalili zinaongezeka au zinazidi siku 3, nenda kliniki',
    },
    buttons: {
      call114: 'Piga 114 SASA',
      findFacility: 'Tafuta Kituo cha Karibu',
      backHome: 'Rudi Nyumbani',
    },
  },
  en: {
    emergency: {
      title: 'EMERGENCY - Next Steps',
      subtitle: 'Do ONE of these NOW:',
      actions: [
        {
          icon: Phone,
          title: 'Call 114',
          description: 'Tanzania emergency number',
          color: 'red',
          priority: 1,
        },
        {
          icon: MapPin,
          title: 'Go to Nearest Hospital',
          description: 'Do not use public transport - take taxi or ambulance',
          color: 'red',
          priority: 1,
        },
      ],
      warning: 'DO NOT DELAY - Your condition needs immediate attention',
    },
    urgent: {
      title: 'Urgent - Next Steps',
      subtitle: 'Do this within 2-4 hours:',
      actions: [
        {
          icon: MapPin,
          title: 'Go to Clinic Today',
          description: 'Do not wait - your condition needs prompt assessment',
          color: 'orange',
          priority: 1,
        },
        {
          icon: Phone,
          title: 'Call Clinic',
          description: 'Explain your symptoms and ask if you should come NOW',
          color: 'orange',
          priority: 2,
        },
      ],
      warning: 'If symptoms worsen, call 114 immediately',
    },
    moderate: {
      title: 'Moderate - Next Steps',
      subtitle: 'Do this within 1-2 days:',
      actions: [
        {
          icon: MapPin,
          title: 'Book Clinic Appointment',
          description: 'Get professional assessment within two days',
          color: 'blue',
          priority: 1,
        },
        {
          icon: Clock,
          title: 'Monitor Symptoms',
          description: 'If symptoms worsen, go to clinic immediately',
          color: 'blue',
          priority: 2,
        },
      ],
      warning: 'Watch your symptoms - if they worsen, go to clinic sooner',
    },
    mild: {
      title: 'Mild - Next Steps',
      subtitle: 'You can self-care at home:',
      actions: [
        {
          icon: CheckCircle,
          title: 'Rest and Hydrate',
          description: 'Get plenty of rest, drink lots of water',
          color: 'green',
          priority: 1,
        },
        {
          icon: Clock,
          title: 'Monitor for 2-3 Days',
          description: 'If symptoms do not improve, book appointment',
          color: 'green',
          priority: 2,
        },
      ],
      warning: 'If symptoms worsen or persist beyond 3 days, go to clinic',
    },
    buttons: {
      call114: 'Call 114 NOW',
      findFacility: 'Find Nearest Facility',
      backHome: 'Back Home',
    },
  },
};

export function EmergencyFollowUp({
  triageLevel,
  language,
  onCallEmergency,
  onFindFacility,
  onGoHome,
}: EmergencyFollowUpProps) {
  const t = content[language][triageLevel];
  const buttons = content[language].buttons;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-900',
          icon: 'text-red-600',
          badge: 'bg-red-600 text-white',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-500',
          text: 'text-orange-900',
          icon: 'text-orange-600',
          badge: 'bg-orange-600 text-white',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-900',
          icon: 'text-blue-600',
          badge: 'bg-blue-600 text-white',
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-900',
          icon: 'text-green-600',
          badge: 'bg-green-600 text-white',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className={`p-6 ${triageLevel === 'emergency' ? 'bg-red-600' : 'bg-gray-100'}`}>
        <h2
          className={`text-2xl font-bold mb-2 ${
            triageLevel === 'emergency' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t.title}
        </h2>
        <p
          className={`text-base font-medium ${
            triageLevel === 'emergency' ? 'text-red-100' : 'text-gray-600'
          }`}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-4">
        {t.actions.map((action, idx) => {
          const colors = getColorClasses(action.color);
          const Icon = action.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5`}
            >
              <div className="flex items-start gap-4">
                {/* Priority Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${colors.badge} flex items-center justify-center font-bold text-lg`}>
                    {action.priority}
                  </div>
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 ${colors.icon}`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${colors.text} mb-1`}>{action.title}</h3>
                  <p className={`text-sm ${colors.text} opacity-90`}>{action.description}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className={`w-6 h-6 ${colors.icon} flex-shrink-0`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="px-6 pb-6">
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-amber-900">{t.warning}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 border-t-2 border-gray-200 space-y-3">
        {triageLevel === 'emergency' && (
          <button
            onClick={onCallEmergency}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg animate-pulse"
            style={{ minHeight: '56px' }}
          >
            <Phone className="w-6 h-6" />
            {buttons.call114}
          </button>
        )}

        <button
          onClick={onFindFacility}
          className={`w-full font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all ${
            triageLevel === 'emergency'
              ? 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          style={{ minHeight: '56px' }}
        >
          <MapPin className="w-5 h-5" />
          {buttons.findFacility}
        </button>

        {(triageLevel === 'moderate' || triageLevel === 'mild') && (
          <button
            onClick={onGoHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all"
            style={{ minHeight: '56px' }}
          >
            {buttons.backHome}
          </button>
        )}
      </div>
    </div>
  );
}
