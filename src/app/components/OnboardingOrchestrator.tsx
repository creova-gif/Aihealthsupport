import React, { useState } from 'react';
import { WelcomeCarousel } from '@/app/components/WelcomeCarousel';
import { AccountCreationScreen } from '@/app/components/AccountCreationScreen';
import { PersonalizationScreen } from '@/app/components/PersonalizationScreen';
import { InteractiveTutorial } from '@/app/components/InteractiveTutorial';
import { FirstActionScreen } from '@/app/components/FirstActionScreen';
import { EmployeeOnboarding } from '@/app/components/EmployeeOnboarding';
import { WearableSync } from '@/app/components/WearableSync';
import { AIAssistantChat } from '@/app/components/AIAssistantChat';

export type UserType = 'patient' | 'employee' | null;
export type OnboardingStep =
  | 'language'
  | 'userType'
  | 'welcome'
  | 'account'
  | 'personalization'
  | 'tutorial'
  | 'wearable'
  | 'firstAction'
  | 'employeeOnboarding'
  | 'complete';

export interface OnboardingData {
  userType: UserType;
  language: 'sw' | 'en';
  accountData?: {
    phone: string;
    email?: string;
    biometricEnabled: boolean;
    consented: boolean;
  };
  personalizationData?: {
    goals: string[];
    concerns: string[];
    conditions: string[];
    tracking: string[];
  };
  wearableData?: {
    device?: string;
    synced: boolean;
  };
  firstActionData?: {
    actionType: string;
    value: string;
  };
  employeeData?: {
    role: string;
    completedModules: string[];
    quizScore?: number;
  };
}

interface OnboardingOrchestratorProps {
  onComplete: (data: OnboardingData) => void;
  initialLanguage?: 'sw' | 'en';
  defaultUserType?: UserType;
}

export function OnboardingOrchestrator({
  onComplete,
  initialLanguage = 'sw',
  defaultUserType = null,
}: OnboardingOrchestratorProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('userType');
  const [language, setLanguage] = useState<'sw' | 'en'>(initialLanguage);
  const [userType, setUserType] = useState<UserType>(defaultUserType);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: defaultUserType,
    language: initialLanguage,
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);

  // Language & User Type Selection
  if (currentStep === 'userType') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--onboarding-bg)' }}>
        <div className="max-w-3xl w-full">
          {/* Language Selection */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              AfyaAI TZA
            </h1>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setLanguage('sw')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  language === 'sw'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                🇹🇿 Kiswahili
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
              {language === 'sw' ? 'Wewe ni nani?' : 'Who are you?'}
            </h2>
            <p className="text-lg" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {language === 'sw'
                ? 'Chagua aina yako ili tuanze safari yako'
                : 'Select your type to begin your journey'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Card */}
            <button
              onClick={() => {
                setUserType('patient');
                setOnboardingData({ ...onboardingData, userType: 'patient', language });
                setCurrentStep('welcome');
              }}
              className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all text-left"
            >
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--onboarding-text-primary)' }}>
                {language === 'sw' ? 'Mgonjwa / Mwananchi' : 'Patient / Citizen'}
              </h3>
              <p className="text-lg mb-4" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {language === 'sw'
                  ? 'Natafuta huduma za afya kwa mimi na familia yangu'
                  : 'I\'m seeking healthcare services for myself and my family'}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Angalia dalili' : 'Symptom checking'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Panga miadi' : 'Book appointments'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Fuatilia afya' : 'Track health'}</span>
                </li>
              </ul>
            </button>

            {/* Employee Card */}
            <button
              onClick={() => {
                setUserType('employee');
                setOnboardingData({ ...onboardingData, userType: 'employee', language });
                setCurrentStep('employeeOnboarding');
              }}
              className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-2xl transition-all text-left"
            >
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--onboarding-text-primary)' }}>
                {language === 'sw' ? 'Mfanyakazi wa Afya' : 'Healthcare Employee'}
              </h3>
              <p className="text-lg mb-4" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {language === 'sw'
                  ? 'Nina kazi hospitali au kituo cha afya'
                  : 'I work at a hospital or health facility'}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Mafunzo ya mfumo' : 'System training'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Ufuatiliaji wa sheria' : 'Compliance training'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{language === 'sw' ? 'Jifunze timu' : 'Meet your team'}</span>
                </li>
              </ul>
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {language === 'sw'
                ? 'Unaweza kubadilisha lugha wakati wowote kwenye mipangilio'
                : 'You can change language anytime in settings'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Patient Onboarding Flow
  if (userType === 'patient') {
    switch (currentStep) {
      case 'welcome':
        return (
          <>
            <WelcomeCarousel
              language={language}
              onComplete={() => setCurrentStep('account')}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      case 'account':
        return (
          <>
            <AccountCreationScreen
              language={language}
              onComplete={(accountData) => {
                setOnboardingData({ ...onboardingData, accountData });
                setCurrentStep('personalization');
                setShowAIAssistant(true);
              }}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      case 'personalization':
        return (
          <>
            <PersonalizationScreen
              language={language}
              onComplete={(personalizationData) => {
                setOnboardingData({ ...onboardingData, personalizationData });
                setCurrentStep('wearable');
              }}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      case 'wearable':
        return (
          <>
            <WearableSync
              language={language}
              onComplete={(wearableData) => {
                setOnboardingData({ ...onboardingData, wearableData });
                setCurrentStep('tutorial');
              }}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      case 'tutorial':
        return (
          <>
            <InteractiveTutorial
              language={language}
              onComplete={() => setCurrentStep('firstAction')}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      case 'firstAction':
        return (
          <>
            <FirstActionScreen
              language={language}
              onComplete={(firstActionData) => {
                const finalData = { ...onboardingData, firstActionData };
                setOnboardingData(finalData);
                onComplete(finalData);
              }}
            />
            {showAIAssistant && (
              <AIAssistantChat
                language={language}
                onClose={() => setShowAIAssistant(false)}
                minimized={aiMinimized}
                onMinimize={() => setAiMinimized(!aiMinimized)}
              />
            )}
          </>
        );

      default:
        return null;
    }
  }

  // Employee Onboarding Flow
  if (userType === 'employee') {
    return (
      <>
        <EmployeeOnboarding
          language={language}
          onComplete={(employeeData) => {
            const finalData = { ...onboardingData, employeeData };
            setOnboardingData(finalData);
            onComplete(finalData);
          }}
        />
        {showAIAssistant && (
          <AIAssistantChat
            language={language}
            onClose={() => setShowAIAssistant(false)}
            minimized={aiMinimized}
            onMinimize={() => setAiMinimized(!aiMinimized)}
          />
        )}
      </>
    );
  }

  return null;
}
