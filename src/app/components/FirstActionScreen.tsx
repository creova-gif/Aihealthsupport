import React, { useState } from 'react';
import {
  TrendingUp,
  Utensils,
  Activity,
  Droplets,
  Heart,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import confetti from 'canvas-confetti';

const translations = {
  sw: {
    title: 'Anza Safari Yako!',
    subtitle: 'Chagua hatua yako ya kwanza',
    actions: {
      weight: {
        title: 'Rekodi Uzito',
        description: 'Fuatilia uzito wako',
        emoji: '⚖️',
        inputLabel: 'Uzito (kg)',
        placeholder: '65',
      },
      meal: {
        title: 'Andika Chakula',
        description: 'Jifunze jinsi unavyokula',
        emoji: '🍽️',
        inputLabel: 'Chakula ulichokula',
        placeholder: 'Ugali na dagaa',
      },
      exercise: {
        title: 'Rekodi Mazoezi',
        description: 'Endelea kuwa na afya',
        emoji: '🏃',
        inputLabel: 'Aina ya zoezi',
        placeholder: 'Kutembea dakika 30',
      },
      water: {
        title: 'Ongeza Maji',
        description: 'Nywa maji ya kutosha',
        emoji: '💧',
        inputLabel: 'Mita (kundi)',
        placeholder: '8',
      },
      bloodPressure: {
        title: 'Shinikizo la Damu',
        description: 'Fuatilia shinikizo',
        emoji: '🩺',
        inputLabel: 'Shinikizo (e.g., 120/80)',
        placeholder: '120/80',
      },
    },
    logData: 'Weka Rekodi',
    success: {
      title: 'Hongera! 🎉',
      message: 'Umekamilisha hatua yako ya kwanza',
      badge: 'Umepata Badili',
      firstStep: 'Hatua ya Kwanza',
      description: 'Umeanza safari yako ya afya',
      streak: 'Streak yako',
      day: 'Siku',
      points: 'Pointi',
      continueToApp: 'Endelea kwa App',
    },
    skip: 'Ruka kwa sasa',
  },
  en: {
    title: 'Start Your Journey!',
    subtitle: 'Choose your first action',
    actions: {
      weight: {
        title: 'Log Weight',
        description: 'Track your weight',
        emoji: '⚖️',
        inputLabel: 'Weight (kg)',
        placeholder: '65',
      },
      meal: {
        title: 'Log Meal',
        description: 'Learn how you eat',
        emoji: '🍽️',
        inputLabel: 'What did you eat?',
        placeholder: 'Rice and beans',
      },
      exercise: {
        title: 'Log Exercise',
        description: 'Stay active',
        emoji: '🏃',
        inputLabel: 'Type of exercise',
        placeholder: 'Walking 30 minutes',
      },
      water: {
        title: 'Add Water',
        description: 'Stay hydrated',
        emoji: '💧',
        inputLabel: 'Glasses',
        placeholder: '8',
      },
      bloodPressure: {
        title: 'Blood Pressure',
        description: 'Track your BP',
        emoji: '🩺',
        inputLabel: 'Reading (e.g., 120/80)',
        placeholder: '120/80',
      },
    },
    logData: 'Log Data',
    success: {
      title: 'Congratulations! 🎉',
      message: 'You completed your first action',
      badge: 'Badge Earned',
      firstStep: 'First Step',
      description: 'Started your health journey',
      streak: 'Your Streak',
      day: 'Day',
      points: 'Points',
      continueToApp: 'Continue to App',
    },
    skip: 'Skip for now',
  },
};

interface FirstActionScreenProps {
  onComplete: (data: { actionType: string; value: string }) => void;
  language: 'sw' | 'en';
}

export function FirstActionScreen({ onComplete, language }: FirstActionScreenProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const t = translations[language];

  const actions = [
    { id: 'weight', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { id: 'meal', icon: Utensils, color: 'from-green-500 to-green-600' },
    { id: 'exercise', icon: Activity, color: 'from-purple-500 to-purple-600' },
    { id: 'water', icon: Droplets, color: 'from-cyan-500 to-cyan-600' },
    { id: 'bloodPressure', icon: Heart, color: 'from-red-500 to-red-600' },
  ];

  const handleSubmit = () => {
    if (selectedAction && inputValue) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setShowSuccess(true);

      // Auto-complete after 3 seconds
      setTimeout(() => {
        onComplete({
          actionType: selectedAction,
          value: inputValue,
        });
      }, 3000);
    }
  };

  if (showSuccess) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--onboarding-bg)' }}
      >
        <div className="max-w-lg w-full text-center">
          {/* Success Animation */}
          <div className="bounce-in mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 relative"
              style={{ background: 'var(--gradient-success)' }}
            >
              <CheckCircle className="h-16 w-16 text-white" />
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: 'var(--gradient-success)' }}
              />
            </div>

            <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.success.title}
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {t.success.message}
            </p>
          </div>

          {/* Badge Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.success.badge}
              </h3>
              <Award className="h-6 w-6" style={{ color: 'var(--onboarding-accent)' }} />
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--onboarding-accent-bg)' }}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">🏆</div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-lg mb-1" style={{ color: 'var(--onboarding-text-primary)' }}>
                    {t.success.firstStep}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                    {t.success.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl streak-fire">🔥</div>
                <div className="text-left">
                  <p className="text-xs" style={{ color: 'var(--onboarding-text-secondary)' }}>
                    {t.success.streak}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                    1 {t.success.day}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl">⭐</div>
                <div className="text-left">
                  <p className="text-xs" style={{ color: 'var(--onboarding-text-secondary)' }}>
                    {t.success.points}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                    +50
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => onComplete({ actionType: selectedAction!, value: inputValue })}
            className="w-full py-5 rounded-2xl font-semibold text-white transition-all hover:shadow-xl"
            style={{ background: 'var(--gradient-action)' }}
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg">{t.success.continueToApp}</span>
              <ChevronRight className="h-6 w-6" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  const selectedActionData = selectedAction
    ? t.actions[selectedAction as keyof typeof t.actions]
    : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--onboarding-bg)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7" style={{ color: 'var(--onboarding-accent)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.title}
            </h1>
          </div>
          <p className="text-lg" style={{ color: 'var(--onboarding-text-secondary)' }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Action Selection */}
          {!selectedAction && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 slide-in">
              {actions.map((action) => {
                const Icon = action.icon;
                const actionData = t.actions[action.id as keyof typeof t.actions];
                return (
                  <button
                    key={action.id}
                    onClick={() => setSelectedAction(action.id)}
                    className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all text-left"
                    style={{
                      background: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${action.color})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-4 rounded-2xl group-hover:bg-white/20 transition-colors"
                        style={{ background: 'var(--onboarding-bg)' }}
                      >
                        <div className="text-4xl">{actionData.emoji}</div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold mb-2 group-hover:text-white transition-colors"
                          style={{ color: 'var(--onboarding-text-primary)' }}
                        >
                          {actionData.title}
                        </h3>
                        <p
                          className="text-sm group-hover:text-white/80 transition-colors"
                          style={{ color: 'var(--onboarding-text-secondary)' }}
                        >
                          {actionData.description}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'white' }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Form */}
          {selectedAction && selectedActionData && (
            <div className="max-w-lg mx-auto slide-in">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">{selectedActionData.emoji}</div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                    {selectedActionData.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                    {selectedActionData.description}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <label className="block font-medium" style={{ color: 'var(--onboarding-text-primary)' }}>
                    {selectedActionData.inputLabel}
                  </label>
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={selectedActionData.placeholder}
                    className="py-6 text-lg text-center"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedAction(null)}
                    className="flex-1 py-4 rounded-xl font-medium border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--onboarding-text-secondary)' }}
                  >
                    {language === 'sw' ? 'Rudi' : 'Back'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue}
                    className="flex-1 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--gradient-trust)' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{t.logData}</span>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => onComplete({ actionType: 'skipped', value: '' })}
                className="w-full mt-6 py-3 text-center font-medium hover:bg-white/50 rounded-xl transition-colors"
                style={{ color: 'var(--onboarding-text-secondary)' }}
              >
                {t.skip}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
