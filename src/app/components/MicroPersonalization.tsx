import React, { useState } from 'react';
import { User, MapPin, Heart, Baby, Users, Activity, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PersonalizationData {
  primaryCare?: string;
  location?: string;
  healthPriority?: string;
  language?: 'sw' | 'en';
  skipped?: boolean;
}

interface MicroPersonalizationProps {
  language: 'sw' | 'en';
  onComplete: (data: PersonalizationData) => void;
}

const translations = {
  sw: {
    title: 'Tunawe karibu zaidi nawe',
    subtitle: 'Jibu maswali 3 ili tupate kukupa huduma bora',
    skip: 'Ruka Sasa',
    next: 'Endelea',
    finish: 'Maliza',
    optional: 'Hiari - Unaweza kuruka',
    questions: {
      primaryCare: {
        title: 'Nani unamhudumia zaidi?',
        options: [
          { id: 'self', label: 'Mimi mwenyewe', icon: User },
          { id: 'child', label: 'Mtoto wangu', icon: Baby },
          { id: 'pregnant', label: 'Mjamzito (mimi au familia)', icon: Heart },
          { id: 'chronic', label: 'Mgonjwa sugu (kisukari, BP)', icon: Activity },
          { id: 'family', label: 'Familia yangu', icon: Users },
        ],
      },
      location: {
        title: 'Unapatikana wapi mara nyingi?',
        options: [
          { id: 'rural', label: 'Kijijini', icon: '🏡' },
          { id: 'urban', label: 'Mjini', icon: '🏙️' },
          { id: 'both', label: 'Viwili', icon: '🔄' },
        ],
      },
      healthPriority: {
        title: 'Ni jambo gani la afya unalolitaka zaidi?',
        options: [
          { id: 'symptom-check', label: 'Angalia dalili', icon: '🔍' },
          { id: 'reminders', label: 'Ukumbusho wa dawa', icon: '⏰' },
          { id: 'appointments', label: 'Ratiba ya daktari', icon: '📅' },
          { id: 'maternal', label: 'Ufuatiliaji wa ujauzito', icon: '🤰' },
          { id: 'chronic', label: 'Usimamizi wa magonjwa sugu', icon: '💊' },
        ],
      },
    },
  },
  en: {
    title: 'Get to know you better',
    subtitle: 'Answer 3 questions to personalize your experience',
    skip: 'Skip for Now',
    next: 'Next',
    finish: 'Finish',
    optional: 'Optional - You can skip',
    questions: {
      primaryCare: {
        title: 'Who are you primarily caring for?',
        options: [
          { id: 'self', label: 'Myself', icon: User },
          { id: 'child', label: 'My child', icon: Baby },
          { id: 'pregnant', label: 'Pregnant (me or family)', icon: Heart },
          { id: 'chronic', label: 'Chronic patient (diabetes, BP)', icon: Activity },
          { id: 'family', label: 'My family', icon: Users },
        ],
      },
      location: {
        title: 'Where are you usually located?',
        options: [
          { id: 'rural', label: 'Rural area', icon: '🏡' },
          { id: 'urban', label: 'Urban area', icon: '🏙️' },
          { id: 'both', label: 'Both', icon: '🔄' },
        ],
      },
      healthPriority: {
        title: 'What health feature do you need most?',
        options: [
          { id: 'symptom-check', label: 'Symptom checker', icon: '🔍' },
          { id: 'reminders', label: 'Medication reminders', icon: '⏰' },
          { id: 'appointments', label: 'Book appointments', icon: '📅' },
          { id: 'maternal', label: 'Pregnancy tracking', icon: '🤰' },
          { id: 'chronic', label: 'Chronic disease management', icon: '💊' },
        ],
      },
    },
  },
};

export function MicroPersonalization({ language, onComplete }: MicroPersonalizationProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalizationData>({});
  const t = translations[language];

  const questions = [
    'primaryCare',
    'location',
    'healthPriority',
  ] as const;

  const currentQuestionKey = questions[currentQuestion];
  const questionData = t.questions[currentQuestionKey];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestionKey]: optionId };
    setAnswers(newAnswers);

    // Auto-advance after selection with a small delay for visual feedback
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        onComplete({ ...newAnswers, language });
      }
    }, 300);
  };

  const handleSkip = () => {
    onComplete({ ...answers, skipped: true, language });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 text-center relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Skip"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {t.subtitle}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1E88E5 0%, #0F9D58 100%)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {currentQuestion + 1} / {totalQuestions}
          </p>
        </div>

        {/* Question content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {questionData.title}
              </h3>

              <div className="space-y-3">
                {questionData.options.map((option: any) => {
                  const OptionIcon = option.icon;
                  const isSelected = answers[currentQuestionKey] === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(option.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-blue-500' : 'bg-gray-100'
                        }`}
                      >
                        {typeof option.icon === 'string' ? (
                          <span className="text-2xl">{option.icon}</span>
                        ) : (
                          <OptionIcon
                            className={`h-6 w-6 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}
                        >
                          {option.label}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <ChevronRight className="h-4 w-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Skip button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {t.skip}
            </button>
            <p className="text-xs text-gray-400 mt-1">
              {t.optional}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
