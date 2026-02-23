/**
 * MissedMedicationGuidance - Contextual help when medications are missed
 * Shown when user hasn't taken medication or is running out
 * Reduces confusion about what to do next
 */

import React from 'react';
import { AlertTriangle, Clock, Pill, Phone, CheckCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MissedMedicationGuidanceProps {
  medicationName: string;
  missedDoses: number;
  daysUntilRefill: number;
  isOutOfStock: boolean;
  language: 'sw' | 'en';
  onContactCHW: () => void;
  onMarkTaken: () => void;
  onRequestRefill: () => void;
}

const content = {
  sw: {
    titles: {
      missed: 'Dawa Uliyokosa',
      runningOut: 'Dawa Zinaisha',
      outOfStock: 'Dawa Zimeisha',
    },
    missedDose: {
      title: 'Umekosa kipimo {{count}}',
      whatToDo: 'Nini cha kufanya?',
      actions: [
        {
          title: 'Umya Sasa',
          description: 'Kama umesahau tu, umya dawa SASA',
          icon: Pill,
          priority: 1,
        },
        {
          title: 'Usiongeze Kipimo',
          description: 'USIUMYE kipimo cha mara mbili ili kufidia',
          icon: AlertTriangle,
          priority: 2,
        },
        {
          title: 'Wasiliana na CHW',
          description: 'Kama umekosa zaidi ya siku 2, piga CHW',
          icon: Phone,
          priority: 3,
        },
      ],
      warning: 'Dawa za shinikizo/kisukari: Usikose zaidi ya siku 1',
    },
    runningOut: {
      title: 'Dawa zinaisha ndani ya siku {{days}}',
      whatToDo: 'Fanya hivi SASA:',
      actions: [
        {
          title: 'Omba Kujazwa',
          description: 'CHW ataleta dawa kabla hazijaisha',
          icon: Pill,
          priority: 1,
        },
        {
          title: 'Angalia Tarehe',
          description: 'Thibitisha umya mpaka tarehe ya kujazwa',
          icon: Clock,
          priority: 2,
        },
      ],
      warning: 'Usiache dawa ziishe - omba kujazwa kabla',
    },
    outOfStock: {
      title: 'Dawa zimeisha',
      whatToDo: 'DHARURA - Fanya moja ya hizi LEO:',
      actions: [
        {
          title: 'Piga CHW SASA',
          description: 'CHW ataleta dawa kutoka kliniki',
          icon: Phone,
          priority: 1,
        },
        {
          title: 'Nenda Kliniki',
          description: 'Kama CHW hapatikani, nenda kliniki LEO',
          icon: AlertTriangle,
          priority: 1,
        },
      ],
      warning: 'HATARI: Kukosa dawa kwa magonjwa sugu kunaweza kusababisha matatizo makubwa',
    },
    buttons: {
      contactCHW: 'Wasiliana na CHW',
      markTaken: 'Weka Nimeumwa',
      requestRefill: 'Omba Kujazwa',
      learnMore: 'Jifunze Zaidi',
    },
  },
  en: {
    titles: {
      missed: 'Missed Medication',
      runningOut: 'Running Out of Medication',
      outOfStock: 'Out of Medication',
    },
    missedDose: {
      title: 'You missed {{count}} dose(s)',
      whatToDo: 'What to do?',
      actions: [
        {
          title: 'Take Now',
          description: 'If you just forgot, take your medication NOW',
          icon: Pill,
          priority: 1,
        },
        {
          title: 'Do Not Double Dose',
          description: 'DO NOT take double dose to compensate',
          icon: AlertTriangle,
          priority: 2,
        },
        {
          title: 'Contact CHW',
          description: 'If you missed more than 2 days, call CHW',
          icon: Phone,
          priority: 3,
        },
      ],
      warning: 'For BP/diabetes medications: Do not miss more than 1 day',
    },
    runningOut: {
      title: 'Running out in {{days}} days',
      whatToDo: 'Do this NOW:',
      actions: [
        {
          title: 'Request Refill',
          description: 'CHW will deliver before you run out',
          icon: Pill,
          priority: 1,
        },
        {
          title: 'Check Dates',
          description: 'Confirm you have enough until refill date',
          icon: Clock,
          priority: 2,
        },
      ],
      warning: 'Do not let medication run out - request refill early',
    },
    outOfStock: {
      title: 'Out of medication',
      whatToDo: 'URGENT - Do ONE of these TODAY:',
      actions: [
        {
          title: 'Call CHW NOW',
          description: 'CHW will deliver from clinic',
          icon: Phone,
          priority: 1,
        },
        {
          title: 'Go to Clinic',
          description: 'If CHW unavailable, go to clinic TODAY',
          icon: AlertTriangle,
          priority: 1,
        },
      ],
      warning: 'DANGER: Missing chronic disease medications can cause serious complications',
    },
    buttons: {
      contactCHW: 'Contact CHW',
      markTaken: 'Mark as Taken',
      requestRefill: 'Request Refill',
      learnMore: 'Learn More',
    },
  },
};

export function MissedMedicationGuidance({
  medicationName,
  missedDoses,
  daysUntilRefill,
  isOutOfStock,
  language,
  onContactCHW,
  onMarkTaken,
  onRequestRefill,
}: MissedMedicationGuidanceProps) {
  // Determine scenario
  let scenario: 'missed' | 'runningOut' | 'outOfStock';
  if (isOutOfStock) {
    scenario = 'outOfStock';
  } else if (daysUntilRefill <= 3) {
    scenario = 'runningOut';
  } else {
    scenario = 'missed';
  }

  const t = content[language];
  const scenarioContent = t[scenario === 'missed' ? 'missedDose' : scenario];
  const buttons = t.buttons;

  const getHeaderColor = () => {
    switch (scenario) {
      case 'outOfStock':
        return 'bg-red-600';
      case 'runningOut':
        return 'bg-orange-600';
      default:
        return 'bg-amber-600';
    }
  };

  const title =
    scenario === 'missed'
      ? scenarioContent.title.replace('{{count}}', missedDoses.toString())
      : scenarioContent.title.replace('{{days}}', daysUntilRefill.toString());

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className={`${getHeaderColor()} p-6 text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{t.titles[scenario]}</h2>
        </div>
        <p className="text-lg font-semibold opacity-90">{title}</p>
        <p className="text-sm opacity-75 mt-1">
          {language === 'sw' ? 'Dawa:' : 'Medication:'} {medicationName}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{scenarioContent.whatToDo}</h3>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          {scenarioContent.actions.map((action, idx) => {
            const Icon = action.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {action.priority}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 text-blue-600">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 mb-1">{action.title}</h4>
                    <p className="text-sm text-blue-800">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-amber-900">{scenarioContent.warning}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {scenario === 'missed' && (
            <button
              onClick={onMarkTaken}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              style={{ minHeight: '56px' }}
            >
              <CheckCircle className="w-5 h-5" />
              {buttons.markTaken}
            </button>
          )}

          {scenario === 'runningOut' && (
            <button
              onClick={onRequestRefill}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              style={{ minHeight: '56px' }}
            >
              <Pill className="w-5 h-5" />
              {buttons.requestRefill}
            </button>
          )}

          <button
            onClick={onContactCHW}
            className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all ${
              scenario === 'outOfStock'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse'
                : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            style={{ minHeight: '56px' }}
          >
            <Phone className="w-5 h-5" />
            {buttons.contactCHW}
          </button>
        </div>
      </div>
    </div>
  );
}
