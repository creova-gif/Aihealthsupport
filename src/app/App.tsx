import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WorldClassApp } from './components/WorldClassApp';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingOrchestrator, OnboardingData } from './components/OnboardingOrchestrator';
import { OnboardingEnhancementManager } from './components/OnboardingEnhancementManager';
import { MicroFeedback } from './components/MicroFeedback';
import { PatientPortalManager } from './components/PatientPortalManager';
import { PatientDashboard } from './components/PatientDashboard';
import { EnhancedSymptomChecker } from './components/EnhancedSymptomChecker';
import { AppointmentsScreen } from './components/AppointmentsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MaternalCareTracker } from './components/MaternalCareTracker';
import { BottomNavigation } from './components/BottomNavigation';
import { CHWDashboard } from './components/CHWDashboard';
import { MoHDashboard } from './components/MoHDashboard';
import { AIArchitectureDashboard } from './components/AIArchitectureDashboard';
import { Globe } from 'lucide-react';
import { Button } from './components/ui/button';

function AppContent() {
  const { userRole, language, setLanguage, setUserRole, setUserData } = useApp();
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTrigger, setFeedbackTrigger] = useState<'first-action' | '7-days' | 'feature-use'>('first-action');
  const [useWorldClassMode, setUseWorldClassMode] = useState(true); // Toggle for world-class experience

  // Check if this is first launch
  useEffect(() => {
    const hasLaunchedBefore = localStorage.getItem('app_launched') === 'true';
    const worldClassPref = localStorage.getItem('world_class_mode');
    if (worldClassPref !== null) {
      setUseWorldClassMode(worldClassPref === 'true');
    }
    if (!hasLaunchedBefore) {
      setIsFirstLaunch(true);
      localStorage.setItem('app_launched', 'true');
    }
  }, []);

  // Check for 7-day feedback trigger
  useEffect(() => {
    if (userRole) {
      const firstUseDate = localStorage.getItem('first_use_date');
      if (!firstUseDate) {
        localStorage.setItem('first_use_date', new Date().toISOString());
      } else {
        const daysSinceFirstUse = Math.floor(
          (new Date().getTime() - new Date(firstUseDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceFirstUse >= 7 && !localStorage.getItem('7day_feedback_shown')) {
          setFeedbackTrigger('7-days');
          setShowFeedback(true);
          localStorage.setItem('7day_feedback_shown', 'true');
        }
      }
    }
  }, [userRole]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!userRole) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    // Determine role from user type
    let role: string;
    if (data.userType === 'patient') {
      role = 'patient';
    } else if (data.employeeData?.role === 'clinician') {
      role = 'clinician';
    } else if (data.employeeData?.role === 'admin') {
      role = 'admin';
    } else if (data.employeeData?.role === 'chw') {
      role = 'chw';
    } else {
      role = 'patient'; // fallback
    }

    setUserRole(role as any);
    setLanguage(data.language);
    setUserData({
      consented: data.accountData?.consented || true,
      name: data.accountData?.phone || 'User',
      phone: data.accountData?.phone,
      email: data.accountData?.email,
      biometricEnabled: data.accountData?.biometricEnabled,
      goals: data.personalizationData?.goals,
      wearableConnected: data.wearableData?.synced,
    });
    setShowOnboarding(false);
  };

  const handleEnhancementComplete = (data: any) => {
    console.log('Enhancement onboarding completed:', data);
    // Store enhancement data if needed
  };

  const handleFeedbackSubmit = (feedback: { rating: number; comment?: string }) => {
    console.log('User feedback:', feedback);
    // Send feedback to analytics/backend
    setShowFeedback(false);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentRoute('dashboard');
    setShowOnboarding(true);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show new onboarding orchestrator if no user role
  if (showOnboarding || !userRole) {
    return <OnboardingOrchestrator onComplete={handleOnboardingComplete} />;
  }

  // Language toggle button (accessible from anywhere)
  const LanguageToggle = () => (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
        className="bg-white shadow-lg"
      >
        <Globe className="h-4 w-4 mr-2" />
        {language === 'sw' ? 'EN' : 'SW'}
      </Button>
    </div>
  );

  // Patient role routing
  if (userRole === 'patient') {
    return (
      <>
        <LanguageToggle />
        
        {/* Patient Portal Manager - Comprehensive portal enhancement system */}
        <PatientPortalManager
          enabled={true}
          onPortalDataUpdate={(data) => {
            console.log('Portal data updated:', data);
          }}
        />
        
        {/* Onboarding Enhancement Manager */}
        {userRole && (
          <OnboardingEnhancementManager
            language={language}
            userRole={userRole}
            isFirstLaunch={isFirstLaunch}
            onEnhancementComplete={handleEnhancementComplete}
          />
        )}

        {/* Micro Feedback */}
        {showFeedback && (
          <MicroFeedback
            language={language}
            trigger={feedbackTrigger}
            onSubmit={handleFeedbackSubmit}
            onDismiss={() => setShowFeedback(false)}
          />
        )}

        {currentRoute === 'dashboard' && (
          <PatientDashboard onNavigate={setCurrentRoute} />
        )}
        {currentRoute === 'symptom-checker' && (
          <EnhancedSymptomChecker onBack={() => setCurrentRoute('dashboard')} />
        )}
        {currentRoute === 'appointments' && (
          <AppointmentsScreen onBack={() => setCurrentRoute('dashboard')} />
        )}
        {currentRoute === 'profile' && (
          <ProfileScreen 
            onBack={() => setCurrentRoute('dashboard')} 
            onLogout={handleLogout}
          />
        )}
        {currentRoute === 'maternal' && (
          <MaternalCareTracker onBack={() => setCurrentRoute('dashboard')} />
        )}
        {(currentRoute === 'ncds' || currentRoute === 'telemedicine') && (
          <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl mb-4">
                {language === 'sw' ? 'Inakuja Hivi Karibuni' : 'Coming Soon'}
              </h2>
              <p className="text-gray-600 mb-4">
                {language === 'sw'
                  ? 'Kipengele hiki kinajengwa.'
                  : 'This feature is being built.'}
              </p>
              <Button onClick={() => setCurrentRoute('dashboard')}>
                {language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}
              </Button>
            </div>
          </div>
        )}
        <BottomNavigation
          activeRoute={currentRoute}
          onNavigate={setCurrentRoute}
        />
      </>
    );
  }

  // CHW role
  if (userRole === 'chw') {
    return (
      <>
        <LanguageToggle />
        
        {/* Onboarding Enhancement Manager */}
        <OnboardingEnhancementManager
          language={language}
          userRole={userRole}
          isFirstLaunch={isFirstLaunch}
          onEnhancementComplete={handleEnhancementComplete}
        />

        <CHWDashboard onBack={handleLogout} />
      </>
    );
  }

  // Clinician role (similar to patient for demo)
  if (userRole === 'clinician') {
    return (
      <>
        <LanguageToggle />
        
        {/* Onboarding Enhancement Manager */}
        <OnboardingEnhancementManager
          language={language}
          userRole={userRole}
          isFirstLaunch={isFirstLaunch}
          onEnhancementComplete={handleEnhancementComplete}
        />

        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <h2 className="text-3xl mb-4">
              {language === 'sw' ? 'Dashibodi ya Daktari' : 'Clinician Dashboard'}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === 'sw'
                ? 'Kipengele cha daktari kinajengwa. Itajumuisha: Maelezo ya wagonjwa, AI diagnosis support, Medical imaging analysis, Prescription management.'
                : 'Clinician features being built. Will include: Patient records, AI diagnosis support, Medical imaging analysis, Prescription management.'}
            </p>
            <Button onClick={handleLogout}>
              {language === 'sw' ? 'Rudi' : 'Back'}
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Admin role
  if (userRole === 'admin') {
    if (currentRoute === 'ai-architecture') {
      return (
        <>
          <LanguageToggle />
          <AIArchitectureDashboard onBack={() => setCurrentRoute('dashboard')} />
        </>
      );
    }
    
    return (
      <>
        <LanguageToggle />
        <MoHDashboard 
          onBack={handleLogout}
          onViewArchitecture={() => setCurrentRoute('ai-architecture')}
        />
      </>
    );
  }

  return null;
}

export default function App() {
  // Check if we should use world-class mode
  const [useWorldClass, setUseWorldClass] = useState(true);

  useEffect(() => {
    const savedPref = localStorage.getItem('world_class_mode');
    if (savedPref !== null) {
      setUseWorldClass(savedPref === 'true');
    }
  }, []);

  // If world-class mode is enabled, use the new experience
  if (useWorldClass) {
    return (
      <AppProvider>
        <WorldClassApp />
      </AppProvider>
    );
  }

  // Otherwise, use the existing experience
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}