import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  action?: () => void;
}

interface HabitChecklistProps {
  language: 'sw' | 'en';
  role: 'patient' | 'chw' | 'clinician';
  onItemComplete: (itemId: string) => void;
  onDismiss: () => void;
}

const translations = {
  sw: {
    title: 'Maliza Usanidi',
    subtitle: 'Fanya hatua hizi ili kupata matumizi bora',
    dismiss: 'Funga',
    completed: 'Umekamilisha',
    remaining: 'Zimesalia',
    patient: [
      {
        id: 'symptom-check',
        title: 'Angalia dalili',
        description: 'Jaribu symptom checker',
        icon: '🔍',
      },
      {
        id: 'set-reminder',
        title: 'Weka kumbusho',
        description: 'Weka kumbusho la dawa',
        icon: '⏰',
      },
      {
        id: 'find-facility',
        title: 'Tafuta kituo',
        description: 'Ona vituo vya afya karibu',
        icon: '🏥',
      },
      {
        id: 'complete-profile',
        title: 'Kamilisha wasifu',
        description: 'Ongeza taarifa za afya',
        icon: '👤',
      },
    ],
    chw: [
      {
        id: 'register-patient',
        title: 'Sajili mgonjwa',
        description: 'Sajili mgonjwa wa kwanza',
        icon: '👥',
      },
      {
        id: 'use-ai',
        title: 'Tumia AI',
        description: 'Pata mapendekezo ya AI',
        icon: '🤖',
      },
      {
        id: 'sync-data',
        title: 'Sync data',
        description: 'Unganisha data kwa cloud',
        icon: '☁️',
      },
    ],
    clinician: [
      {
        id: 'review-ai',
        title: 'Pitia AI',
        description: 'Angalia mapendekezo ya AI',
        icon: '📊',
      },
      {
        id: 'setup-workflow',
        title: 'Weka mchakato',
        description: 'Sanidi workflow yako',
        icon: '⚙️',
      },
      {
        id: 'test-imaging',
        title: 'Jaribu imaging',
        description: 'Pakia picha ya majaribio',
        icon: '🔬',
      },
    ],
  },
  en: {
    title: 'Complete Setup',
    subtitle: 'Do these steps to get the best experience',
    dismiss: 'Dismiss',
    completed: 'Completed',
    remaining: 'Remaining',
    patient: [
      {
        id: 'symptom-check',
        title: 'Check symptoms',
        description: 'Try the symptom checker',
        icon: '🔍',
      },
      {
        id: 'set-reminder',
        title: 'Set reminder',
        description: 'Set medication reminder',
        icon: '⏰',
      },
      {
        id: 'find-facility',
        title: 'Find facility',
        description: 'View nearby health centers',
        icon: '🏥',
      },
      {
        id: 'complete-profile',
        title: 'Complete profile',
        description: 'Add health information',
        icon: '👤',
      },
    ],
    chw: [
      {
        id: 'register-patient',
        title: 'Register patient',
        description: 'Register first patient',
        icon: '👥',
      },
      {
        id: 'use-ai',
        title: 'Use AI',
        description: 'Get AI recommendations',
        icon: '🤖',
      },
      {
        id: 'sync-data',
        title: 'Sync data',
        description: 'Connect data to cloud',
        icon: '☁️',
      },
    ],
    clinician: [
      {
        id: 'review-ai',
        title: 'Review AI',
        description: 'Check AI recommendations',
        icon: '📊',
      },
      {
        id: 'setup-workflow',
        title: 'Setup workflow',
        description: 'Configure your workflow',
        icon: '⚙️',
      },
      {
        id: 'test-imaging',
        title: 'Test imaging',
        description: 'Upload test image',
        icon: '🔬',
      },
    ],
  },
};

export function HabitChecklist({ language, role, onItemComplete, onDismiss }: HabitChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const t = translations[language];
  const checklistItems = t[role] || t.patient;

  useEffect(() => {
    // Load completion state from localStorage
    const savedState = localStorage.getItem(`checklist_${role}`);
    if (savedState) {
      setItems(JSON.parse(savedState));
    } else {
      setItems(
        checklistItems.map((item: any) => ({
          ...item,
          completed: false,
        }))
      );
    }
  }, [role]);

  useEffect(() => {
    // Save state to localStorage
    if (items.length > 0) {
      localStorage.setItem(`checklist_${role}`, JSON.stringify(items));
    }
  }, [items, role]);

  const handleItemClick = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    onItemComplete(itemId);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(`checklist_dismissed_${role}`, 'true');
    setTimeout(onDismiss, 300);
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

  // Don't show if dismissed
  const wasDismissed = localStorage.getItem(`checklist_dismissed_${role}`) === 'true';
  if (wasDismissed || isDismissed) {
    return null;
  }

  // Auto-dismiss when all completed
  useEffect(() => {
    if (completedCount === totalCount && totalCount > 0) {
      setTimeout(handleDismiss, 2000);
    }
  }, [completedCount, totalCount]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <h3 className="font-bold text-white text-lg">{t.title}</h3>
                </div>
                <p className="text-blue-100 text-sm">{t.subtitle}</p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white">
                <span>
                  {completedCount} / {totalCount} {t.completed}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-300 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div className="p-4 max-h-80 overflow-y-auto space-y-2">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleItemClick(item.id)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  item.completed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">{item.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold text-sm ${
                      item.completed ? 'text-green-900 line-through' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-xs ${
                      item.completed ? 'text-green-700' : 'text-gray-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Celebration when all done */}
          {completedCount === totalCount && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-yellow-50 to-green-50 border-t-2 border-yellow-200 p-4 text-center"
            >
              <p className="text-lg font-bold text-gray-900 mb-1">
                🎉 {language === 'sw' ? 'Hongera!' : 'Congratulations!'}
              </p>
              <p className="text-sm text-gray-700">
                {language === 'sw'
                  ? 'Umekamilisha usanidi wote!'
                  : 'You completed all setup steps!'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
