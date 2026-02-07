import React, { useState } from 'react';
import { Heart, Activity, Moon, Brain, Baby, Utensils, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

const translations = {
  sw: {
    title: 'Tuongee Kuhusu Wewe',
    subtitle: 'Tutaeleza afya yako vizuri zaidi',
    question1: 'Lengo lako kuu la afya ni nini?',
    question2: 'Una matatizo yoyote ya afya sasa hivi?',
    question3: 'Je, unaishi na hali yoyote ya kudumu?',
    question4: 'Ni nini unachotaka kufuatilia?',
    skipQuestion: 'Ruka Swali Hili',
    continue: 'Endelea',
    finish: 'Maliza',
    progressLabel: 'Swali',
    of: 'kati ya',
    goals: {
      fitness: 'Afya ya Mwili',
      fitnessDesc: 'Zoezi na nguvu',
      chronic: 'Kudhibiti Magonjwa',
      chronicDesc: 'Shinikizo, Sukari, nk',
      sleep: 'Kulala Vizuri',
      sleepDesc: 'Usingizi bora',
      mental: 'Afya ya Akili',
      mentalDesc: 'Kupunguza msongo',
      maternal: 'Ujauzito/Mama & Mtoto',
      maternalDesc: 'Huduma ya uzazi',
      nutrition: 'Lishe Bora',
      nutritionDesc: 'Kula vyema',
    },
    conditions: {
      hypertension: 'Shinikizo la Damu',
      diabetes: 'Kisukari',
      asthma: 'Pumu',
      heartDisease: 'Magonjwa ya Moyo',
      none: 'Hakuna',
    },
    tracking: {
      weight: 'Uzito',
      bloodPressure: 'Shinikizo la Damu',
      glucose: 'Sukari ya Damu',
      sleep: 'Usingizi',
      exercise: 'Mazoezi',
      nutrition: 'Chakula',
    },
  },
  en: {
    title: "Let's Talk About You",
    subtitle: "We'll personalize your health experience",
    question1: 'What is your primary health goal?',
    question2: 'Do you have any current health concerns?',
    question3: 'Do you live with any chronic conditions?',
    question4: 'What would you like to track?',
    skipQuestion: 'Skip This Question',
    continue: 'Continue',
    finish: 'Finish',
    progressLabel: 'Question',
    of: 'of',
    goals: {
      fitness: 'Physical Fitness',
      fitnessDesc: 'Exercise and strength',
      chronic: 'Manage Conditions',
      chronicDesc: 'Blood pressure, diabetes, etc',
      sleep: 'Better Sleep',
      sleepDesc: 'Improve sleep quality',
      mental: 'Mental Health',
      mentalDesc: 'Reduce stress',
      maternal: 'Pregnancy/Maternal Care',
      maternalDesc: 'Reproductive health',
      nutrition: 'Better Nutrition',
      nutritionDesc: 'Eat healthier',
    },
    conditions: {
      hypertension: 'Hypertension',
      diabetes: 'Diabetes',
      asthma: 'Asthma',
      heartDisease: 'Heart Disease',
      none: 'None',
    },
    tracking: {
      weight: 'Weight',
      bloodPressure: 'Blood Pressure',
      glucose: 'Blood Glucose',
      sleep: 'Sleep',
      exercise: 'Exercise',
      nutrition: 'Nutrition',
    },
  },
};

interface PersonalizationScreenProps {
  onComplete: (data: {
    goals: string[];
    concerns: string[];
    conditions: string[];
    tracking: string[];
  }) => void;
  language: 'sw' | 'en';
}

export function PersonalizationScreen({ onComplete, language }: PersonalizationScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<string[]>([]);

  const t = translations[language];
  const totalQuestions = 4;

  const goalOptions = [
    {
      id: 'fitness',
      icon: Activity,
      label: t.goals.fitness,
      description: t.goals.fitnessDesc,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'chronic',
      icon: Heart,
      label: t.goals.chronic,
      description: t.goals.chronicDesc,
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'sleep',
      icon: Moon,
      label: t.goals.sleep,
      description: t.goals.sleepDesc,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'mental',
      icon: Brain,
      label: t.goals.mental,
      description: t.goals.mentalDesc,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'maternal',
      icon: Baby,
      label: t.goals.maternal,
      description: t.goals.maternalDesc,
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'nutrition',
      icon: Utensils,
      label: t.goals.nutrition,
      description: t.goals.nutritionDesc,
      color: 'from-green-500 to-green-600',
    },
  ];

  const conditionOptions = [
    { id: 'hypertension', label: t.conditions.hypertension },
    { id: 'diabetes', label: t.conditions.diabetes },
    { id: 'asthma', label: t.conditions.asthma },
    { id: 'heartDisease', label: t.conditions.heartDisease },
    { id: 'none', label: t.conditions.none },
  ];

  const trackingOptions = [
    { id: 'weight', label: t.tracking.weight, icon: '⚖️' },
    { id: 'bloodPressure', label: t.tracking.bloodPressure, icon: '🩺' },
    { id: 'glucose', label: t.tracking.glucose, icon: '💉' },
    { id: 'sleep', label: t.tracking.sleep, icon: '😴' },
    { id: 'exercise', label: t.tracking.exercise, icon: '🏃' },
    { id: 'nutrition', label: t.tracking.nutrition, icon: '🥗' },
  ];

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleToggleCondition = (conditionId: string) => {
    if (conditionId === 'none') {
      setSelectedConditions(['none']);
    } else {
      setSelectedConditions((prev) => {
        const filtered = prev.filter((id) => id !== 'none');
        return filtered.includes(conditionId)
          ? filtered.filter((id) => id !== conditionId)
          : [...filtered, conditionId];
      });
    }
  };

  const handleToggleTracking = (trackingId: string) => {
    setSelectedTracking((prev) =>
      prev.includes(trackingId) ? prev.filter((id) => id !== trackingId) : [...prev, trackingId]
    );
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete({
        goals: selectedGoals,
        concerns: selectedConcerns,
        conditions: selectedConditions,
        tracking: selectedTracking,
      });
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.question1}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalOptions.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                      isSelected ? 'border-transparent' : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${goal.color})` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          isSelected ? 'bg-white/20' : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className="h-6 w-6"
                          style={{ color: isSelected ? 'white' : 'var(--onboarding-primary)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: isSelected ? 'white' : 'var(--onboarding-text-primary)' }}
                        >
                          {goal.label}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: isSelected ? 'white' : 'var(--onboarding-text-secondary)' }}
                        >
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.question3}
            </h2>
            <div className="space-y-3">
              {conditionOptions.map((condition) => {
                const isSelected = selectedConditions.includes(condition.id);
                return (
                  <button
                    key={condition.id}
                    onClick={() => handleToggleCondition(condition.id)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-transparent'
                        : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      background: isSelected ? 'var(--gradient-trust)' : undefined,
                      color: isSelected ? 'white' : 'var(--onboarding-text-primary)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{condition.label}</span>
                      {isSelected && <ChevronRight className="h-5 w-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.question2}
            </h2>
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              rows={6}
              placeholder={language === 'sw' ? 'Eleza hapa...' : 'Describe here...'}
              style={{ color: 'var(--onboarding-text-primary)' }}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.question4}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trackingOptions.map((tracking) => {
                const isSelected = selectedTracking.includes(tracking.id);
                return (
                  <button
                    key={tracking.id}
                    onClick={() => handleToggleTracking(tracking.id)}
                    className={`p-5 rounded-2xl border-2 text-center transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-transparent'
                        : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      background: isSelected ? 'var(--gradient-wellness)' : undefined,
                    }}
                  >
                    <div className="text-4xl mb-2">{tracking.icon}</div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isSelected ? 'white' : 'var(--onboarding-text-primary)' }}
                    >
                      {tracking.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--onboarding-bg)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-7 w-7" style={{ color: 'var(--onboarding-accent)' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.title}
              </h1>
              <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--onboarding-text-secondary)' }}>
                {t.progressLabel} {currentQuestion + 1} {t.of} {totalQuestions}
              </span>
              <span style={{ color: 'var(--onboarding-primary)' }} className="font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 slide-in" key={currentQuestion}>
          {renderQuestion()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--onboarding-text-secondary)' }}
          >
            {t.skipQuestion}
          </button>

          <button
            onClick={handleNext}
            className="flex-1 max-w-xs py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
            style={{
              background: isLastQuestion ? 'var(--gradient-action)' : 'var(--gradient-trust)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{isLastQuestion ? t.finish : t.continue}</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
