import { useState } from 'react';
import SplashModern from '../../components/creova/SplashModern';
import OnboardingModern from '../../components/creova/OnboardingModern';

export default function SplashModernPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (data: any) => {
    console.log('Setup complete:', data);
    window.location.href = '/creova/home';
  };

  const handleSkip = () => {
    window.location.href = '/creova/home';
  };

  if (showSplash) {
    return <SplashModern onComplete={handleSplashComplete} duration={3000} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingModern 
        onComplete={handleOnboardingComplete}
        onSkip={handleSkip}
      />
    );
  }

  return null;
}
