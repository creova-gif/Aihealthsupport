import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  MessageSquare,
  TrendingUp,
  Bell,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const translations = {
  sw: {
    title: 'Anza kwa Haraka',
    subtitle: 'Tutakuonyesha jinsi ya kutumia vipengele muhimu',
    skip: 'Ruka Mwongozo',
    next: 'Endelea',
    finish: 'Maliza',
    gotIt: 'Nimeelewa',
    features: {
      symptoms: {
        title: 'Angalia Dalili Zako',
        description: 'AI itakusaidia kuelewa dalili zako na kupata ushauri wa haraka',
        action: 'Gusa hapa kuanza',
      },
      appointments: {
        title: 'Agiza Miadi',
        description: 'Panga ziara zako za hospitali bila foleni. Pata ukumbusho wa kiotomatiki',
        action: 'Bonyeza kuagiza',
      },
      telemedicine: {
        title: 'Ongea na Daktari',
        description: 'Pata ushauri wa kiafya kupitia chat, simu, au video',
        action: 'Anza mazungumzo',
      },
      tracking: {
        title: 'Fuatilia Afya Yako',
        description: 'Rekodi uzito, shinikizo la damu, na virutubisho vyako kila siku',
        action: 'Weka rekodi',
      },
      notifications: {
        title: 'Arifa za Kiotomatiki',
        description: 'Pata ukumbusho wa dawa, miadi, na mipango ya afya',
        action: 'Weka arifa',
      },
    },
    completion: {
      title: 'Uko Tayari!',
      subtitle: 'Umejifunza msingi wa AfyaAI TZA',
      achievements: 'Ushindi Wako',
      badge: 'Badili ya Mwanzo',
      description: 'Umemaliza mwongozo wa awali',
      startUsing: 'Anza Kutumia AfyaAI',
    },
  },
  en: {
    title: 'Quick Start Guide',
    subtitle: "We'll show you how to use key features",
    skip: 'Skip Tutorial',
    next: 'Next',
    finish: 'Finish',
    gotIt: 'Got It',
    features: {
      symptoms: {
        title: 'Check Your Symptoms',
        description: 'AI helps you understand your symptoms and get quick advice',
        action: 'Tap here to start',
      },
      appointments: {
        title: 'Book Appointments',
        description: 'Schedule hospital visits without queues. Get automatic reminders',
        action: 'Click to book',
      },
      telemedicine: {
        title: 'Talk to a Doctor',
        description: 'Get medical advice via chat, phone, or video',
        action: 'Start conversation',
      },
      tracking: {
        title: 'Track Your Health',
        description: 'Record weight, blood pressure, and vitals daily',
        action: 'Log data',
      },
      notifications: {
        title: 'Automatic Notifications',
        description: 'Get reminders for medications, appointments, and health plans',
        action: 'Setup notifications',
      },
    },
    completion: {
      title: "You're All Set!",
      subtitle: "You've learned the basics of AfyaAI TZA",
      achievements: 'Your Achievements',
      badge: 'Starter Badge',
      description: 'Completed initial tutorial',
      startUsing: 'Start Using AfyaAI',
    },
  },
};

interface InteractiveTutorialProps {
  onComplete: () => void;
  language: 'sw' | 'en';
}

export function InteractiveTutorial({ onComplete, language }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const t = translations[language];

  const steps = [
    {
      id: 'symptoms',
      icon: Activity,
      color: 'from-red-500 to-red-600',
      position: 'top-[20%] left-[10%]',
    },
    {
      id: 'appointments',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      position: 'top-[20%] right-[10%]',
    },
    {
      id: 'telemedicine',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      position: 'top-[50%] left-[10%]',
    },
    {
      id: 'tracking',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      position: 'top-[50%] right-[10%]',
    },
    {
      id: 'notifications',
      icon: Bell,
      color: 'from-amber-500 to-amber-600',
      position: 'top-[80%] left-[50%] -translate-x-1/2',
    },
  ];

  const currentStepData = steps[currentStep];
  const currentFeature = t.features[currentStepData.id as keyof typeof t.features];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (showCompletion) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--onboarding-bg)' }}
      >
        <div className="max-w-lg w-full">
          {/* Success Animation */}
          <div className="text-center mb-8 bounce-in">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{ background: 'var(--gradient-success)' }}
            >
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.completion.title}
            </h1>
            <p className="text-lg" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {t.completion.subtitle}
            </p>
          </div>

          {/* Achievement Badge */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.completion.achievements}
            </h3>
            <div
              className="p-4 rounded-xl flex items-center gap-4"
              style={{ background: 'var(--onboarding-accent-bg)' }}
            >
              <div className="w-16 h-16 rounded-full badge-gold flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--onboarding-text-primary)' }}>
                  {t.completion.badge}
                </h4>
                <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                  {t.completion.description}
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onComplete}
            className="w-full py-5 rounded-2xl font-semibold text-white transition-all hover:shadow-xl"
            style={{ background: 'var(--gradient-action)' }}
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg">{t.completion.startUsing}</span>
              <ChevronRight className="h-6 w-6" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--onboarding-bg)' }}>
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <X className="h-5 w-5" style={{ color: 'var(--onboarding-text-secondary)' }} />
      </button>

      {/* Tutorial Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--onboarding-text-primary)' }}>
            {t.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
            {t.subtitle}
          </p>

          {/* Progress Dots */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index <= currentStep ? '' : 'opacity-30'
                }`}
                style={{
                  background: index <= currentStep ? 'var(--onboarding-primary)' : 'var(--progress-bar-bg)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mock Dashboard (Simplified) */}
      <div className="pt-32 p-6">
        <div className="max-w-3xl mx-auto relative">
          {/* Demo Cards (Blurred Background) */}
          <div className="grid grid-cols-2 gap-4 opacity-30 blur-sm pointer-events-none">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className="h-40 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${step.color})` }}
                />
              );
            })}
          </div>

          {/* Highlighted Feature Card */}
          <div
            className={`absolute ${currentStepData.position} w-72 slide-in`}
            style={{ zIndex: 30 }}
          >
            <div className="relative">
              {/* Pulsing Glow */}
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-50 pulse"
                style={{ background: `linear-gradient(135deg, ${currentStepData.color})` }}
              />

              {/* Tooltip Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${currentStepData.color})` }}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                  {currentFeature.title}
                </h3>

                <p className="text-sm mb-4" style={{ color: 'var(--onboarding-text-secondary)' }}>
                  {currentFeature.description}
                </p>

                <div
                  className="text-sm font-medium mb-6 flex items-center gap-2"
                  style={{ color: 'var(--onboarding-primary)' }}
                >
                  <Sparkles className="h-4 w-4" />
                  {currentFeature.action}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${currentStepData.color})` }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{currentStep < steps.length - 1 ? t.next : t.finish}</span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {/* Pointer Arrow */}
              <div
                className="absolute -bottom-3 left-8 w-6 h-6 bg-white transform rotate-45"
                style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Helper */}
      <div className="fixed bottom-6 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto px-6">
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--onboarding-text-primary)' }}>
                {language === 'sw' ? 'Hatua' : 'Step'} {currentStep + 1} {language === 'sw' ? 'kati ya' : 'of'} {steps.length}
              </p>
              <p className="text-xs" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {currentFeature.title}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg font-medium text-white"
              style={{ background: 'var(--onboarding-primary)' }}
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}