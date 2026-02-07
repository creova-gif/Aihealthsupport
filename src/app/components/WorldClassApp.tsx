/**
 * WorldClassApp - Main orchestrator for the redesigned AfyaAI TZA
 * Seamless experience from start to finish
 * Every interaction feels intentional, no clutter, no confusion
 */

import React, { useState, useEffect } from 'react';
import { ModernSplash } from './ModernSplash';
import { ModernOnboarding } from './ModernOnboarding';
import { ModernHome } from './ModernHome';
import { ModernSymptomChecker } from './ModernSymptomChecker';
import { ModernNavigation } from './ModernNavigation';
import { ModernSupportSystem } from './ModernSupportSystem';
import { ModernLogOff } from './ModernLogOff';
import { CareJourneys } from './CareJourneys';
import { AIAssistant } from './AIAssistant';
import { MessagesHub } from './MessagesHub';
import { SymptomCheckerAI } from './SymptomCheckerAI';
import { HealthRecordsTimeline } from './HealthRecordsTimeline';
import { AppointmentSystem } from './AppointmentSystem';
import { MedicationTracker } from './MedicationTracker';
import { MaternalCareJourney } from './MaternalCareJourney';
import { ClinicalDashboard } from './ClinicalDashboard';
import { HelpCircle, Globe } from 'lucide-react';
import { Button } from './ui/button';

interface UserData {
  language: 'sw' | 'en';
  name?: string;
  primaryGoal?: string;
  consentGiven: boolean;
}

export function WorldClassApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [showSupport, setShowSupport] = useState(false);
  const [showLogOff, setShowLogOff] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const savedUserData = localStorage.getItem('afyaai_user_data');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setShowSplash(true); // Still show splash for branding
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!userData) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (data: any) => {
    const newUserData: UserData = {
      language: data.language,
      name: data.name,
      primaryGoal: data.primaryGoal,
      consentGiven: data.consentGiven,
    };
    setUserData(newUserData);
    localStorage.setItem('afyaai_user_data', JSON.stringify(newUserData));
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    setShowLogOff(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('afyaai_user_data');
    setUserData(null);
    setShowLogOff(false);
    setShowOnboarding(true);
    setCurrentRoute('dashboard');
  };

  const handleLanguageToggle = () => {
    if (userData) {
      const newUserData = {
        ...userData,
        language: userData.language === 'sw' ? ('en' as const) : ('sw' as const),
      };
      setUserData(newUserData);
      localStorage.setItem('afyaai_user_data', JSON.stringify(newUserData));
    }
  };

  // Show splash screen
  if (showSplash) {
    return <ModernSplash onComplete={handleSplashComplete} />;
  }

  // Show onboarding
  if (showOnboarding || !userData) {
    return <ModernOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Show support system
  if (showSupport) {
    return (
      <ModernSupportSystem
        language={userData.language}
        onClose={() => setShowSupport(false)}
        onContactSupport={() => {
          setShowSupport(false);
          // Navigate to telemedicine
          setCurrentRoute('telemedicine');
        }}
      />
    );
  }

  // Show log off dialog
  if (showLogOff) {
    return (
      <>
        {/* Render current screen in background */}
        <div className="blur-sm pointer-events-none">
          {renderCurrentScreen()}
        </div>
        <ModernLogOff
          language={userData.language}
          userName={userData.name}
          nextAppointment={undefined}
          onConfirmLogout={handleConfirmLogout}
          onCancel={() => setShowLogOff(false)}
        />
      </>
    );
  }

  function renderCurrentScreen() {
    switch (currentRoute) {
      // Home tab - context-aware starting point
      case 'home':
      case 'dashboard':
        return (
          <ModernHome
            userName={userData?.name}
            language={userData.language}
            onNavigate={setCurrentRoute}
          />
        );

      // Care tab - core care journeys
      case 'care':
        return (
          <CareJourneys
            userName={userData?.name}
            language={userData.language}
            onNavigate={setCurrentRoute}
          />
        );

      // Assistant tab - AI guidance
      case 'assistant':
        return (
          <AIAssistant
            userName={userData?.name}
            language={userData.language}
            onNavigate={setCurrentRoute}
          />
        );

      // Messages tab - human connection
      case 'messages':
        return (
          <MessagesHub
            userName={userData?.name}
            language={userData.language}
            unreadCount={2}
          />
        );

      // Profile tab - trust & control
      case 'profile':
        return (
          <div className="min-h-screen bg-[#FAFBFC] pb-24">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <h1 className="text-3xl font-bold text-[#1A1D23]">
                {userData.language === 'sw' ? 'Profaili Yangu' : 'My Profile'}
              </h1>

              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB]">
                  <h3 className="font-semibold text-[#1A1D23] mb-4">
                    {userData.language === 'sw' ? 'Taarifa Binafsi' : 'Personal Information'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#6B7280]">
                        {userData.language === 'sw' ? 'Jina' : 'Name'}
                      </p>
                      <p className="text-base text-[#1A1D23] font-medium">
                        {userData.name || 'User'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">
                        {userData.language === 'sw' ? 'Lugha' : 'Language'}
                      </p>
                      <p className="text-base text-[#1A1D23] font-medium">
                        {userData.language === 'sw' ? 'Kiswahili' : 'English'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-12 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
                >
                  {userData.language === 'sw' ? 'Toka' : 'Log Out'}
                </Button>
              </div>
            </div>
          </div>
        );

      // Symptom checker - can be accessed from Care or Assistant
      case 'symptom-checker':
        return (
          <ModernSymptomChecker
            language={userData.language}
            onBack={() => setCurrentRoute('home')}
            onBookAppointment={() => setCurrentRoute('appointments')}
          />
        );

      // Appointments - part of Care journey
      case 'appointments':
        return (
          <AppointmentSystem
            language={userData.language}
            onBack={() => setCurrentRoute('care')}
          />
        );

      // Other care journey screens
      case 'maternal':
        return (
          <MaternalCareJourney
            language={userData.language}
            onBack={() => setCurrentRoute('care')}
            onNavigate={setCurrentRoute}
          />
        );

      case 'conditions':
      case 'records':
      case 'emergency':
      case 'care-questions':
      case 'medication-help':
      case 'results-help':
      case 'next-steps':
        return (
          <div className="min-h-screen bg-[#FAFBFC] pb-24 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-[#1A1D23] mb-3">
                {userData.language === 'sw' ? 'Inakuja Hivi Karibuni' : 'Coming Soon'}
              </h2>
              <p className="text-[#6B7280] mb-6">
                {userData.language === 'sw'
                  ? 'Kipengele hiki kinajengwa kwa ubora wa hali ya juu.'
                  : 'This feature is being built with world-class quality.'}
              </p>
              <Button
                onClick={() => setCurrentRoute('home')}
                className="bg-[#1E88E5] hover:bg-[#1976D2]"
              >
                {userData.language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}
              </Button>
            </div>
          </div>
        );

      case 'telemedicine':
        return (
          <div className="min-h-screen bg-[#FAFBFC] pb-24 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-[#1A1D23] mb-3">
                {userData.language === 'sw' ? 'Telemedicine' : 'Telemedicine'}
              </h2>
              <p className="text-[#6B7280] mb-6">
                {userData.language === 'sw'
                  ? 'Kipengele cha mazungumzo na madaktari kinajengwa. Utaweza kuzungumza na daktari kupitia maandishi au video.'
                  : 'The telemedicine chat feature is being built. You\'ll be able to talk to doctors via text or video.'}
              </p>
              <Button
                onClick={() => setCurrentRoute('messages')}
                className="bg-[#1E88E5] hover:bg-[#1976D2]"
              >
                {userData.language === 'sw' ? 'Rudi kwa Ujumbe' : 'Back to Messages'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // Main app with navigation
  return (
    <div className="relative">
      {/* Floating action buttons */}
      <div className="fixed top-6 right-6 z-40 flex gap-3">
        <button
          onClick={handleLanguageToggle}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <Globe className="w-5 h-5 text-[#1E88E5]" />
        </button>
        <button
          onClick={() => setShowSupport(true)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <HelpCircle className="w-5 h-5 text-[#1E88E5]" />
        </button>
      </div>

      {/* Current screen */}
      {renderCurrentScreen()}

      {/* Bottom navigation (hide on certain screens) */}
      {currentRoute !== 'symptom-checker' && (
        <ModernNavigation
          activeRoute={getNormalizedRoute(currentRoute)}
          onNavigate={(route) => setCurrentRoute(route)}
          language={userData.language}
          unreadCount={2}
        />
      )}
    </div>
  );
}

// Helper function to normalize routes for navigation highlighting
function getNormalizedRoute(route: string): string {
  // Map internal routes to navigation tabs
  if (route === 'dashboard') return 'home';
  if (route === 'symptom-checker') return 'assistant';
  if (['maternal', 'conditions', 'records', 'appointments', 'emergency'].includes(route)) {
    return 'care';
  }
  if (['care-questions', 'medication-help', 'results-help', 'next-steps'].includes(route)) {
    return 'assistant';
  }
  if (route === 'telemedicine') return 'messages';
  return route; // home, care, assistant, messages, profile
}