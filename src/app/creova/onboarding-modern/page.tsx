import OnboardingModern from '../../components/creova/OnboardingModern';

export default function OnboardingModernPage() {
  const handleComplete = (data: any) => {
    console.log('Onboarding completed with data:', data);
    alert(`Welcome ${data.clinicName}! Redirecting to dashboard...`);
    // In production, redirect to dashboard
    window.location.href = '/creova/home';
  };

  const handleSkip = () => {
    console.log('Onboarding skipped');
    window.location.href = '/creova/home';
  };

  return (
    <OnboardingModern 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
