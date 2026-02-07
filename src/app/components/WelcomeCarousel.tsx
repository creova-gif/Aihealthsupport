import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, MessageSquare, Activity, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const translations = {
  sw: {
    skip: 'Ruka',
    next: 'Endelea',
    getStarted: 'Anza Sasa',
    slide1: {
      title: 'Karibu AfyaAI TZA',
      subtitle: 'Huduma ya Afya kwa Wananchi wote wa Tanzania',
      description: 'Pata huduma bora za kiafya bila kusafiri mbali. AI inakusaidia kupata matibabu ya haraka na sahihi.',
    },
    slide2: {
      title: 'Panga Miadi kwa Urahisi',
      subtitle: 'Hakuna foleni, hakuna muda kupotea',
      description: 'Buku miadi ya hospitali moja kwa moja kutoka simu yako. Pata ukumbusho kabla ya tarehe yako.',
    },
    slide3: {
      title: 'Ongea na Daktari Mtaalam',
      subtitle: 'Ushauri wa afya popote, wakati wowote',
      description: 'Pata ushauri wa kiafya kupitia simu, chat au video. Huduma za telemedicine zenye ubora wa kimataifa.',
    },
    slide4: {
      title: 'Fuatilia Afya Yako',
      subtitle: 'Jifunze mwili wako vizuri',
      description: 'Rekodi dalili, virutubisho, na maendeleo yako. AI itakusaidia kuelewa mwili wako vizuri zaidi.',
    },
  },
  en: {
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',
    slide1: {
      title: 'Welcome to AfyaAI TZA',
      subtitle: 'Healthcare for all Tanzanian Citizens',
      description: 'Access quality healthcare without traveling far. AI helps you get faster and more accurate treatment.',
    },
    slide2: {
      title: 'Book Appointments Easily',
      subtitle: 'No queues, no wasted time',
      description: 'Schedule hospital appointments directly from your phone. Get reminders before your appointment date.',
    },
    slide3: {
      title: 'Talk to Expert Doctors',
      subtitle: 'Health advice anywhere, anytime',
      description: 'Get medical advice via phone, chat, or video. World-class telemedicine services.',
    },
    slide4: {
      title: 'Track Your Health',
      subtitle: 'Understand your body better',
      description: 'Record symptoms, vitals, and your progress. AI helps you understand your body better.',
    },
  },
};

interface WelcomeCarouselProps {
  onComplete: () => void;
  language: 'sw' | 'en';
}

export function WelcomeCarousel({ onComplete, language }: WelcomeCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[language];

  const slides = [
    {
      icon: Sparkles,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: t.slide1.title,
      subtitle: t.slide1.subtitle,
      description: t.slide1.description,
      image: '✨',
    },
    {
      icon: Calendar,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: t.slide2.title,
      subtitle: t.slide2.subtitle,
      description: t.slide2.description,
      image: '📅',
    },
    {
      icon: MessageSquare,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: t.slide3.title,
      subtitle: t.slide3.subtitle,
      description: t.slide3.description,
      image: '💬',
    },
    {
      icon: Activity,
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: t.slide4.title,
      subtitle: t.slide4.subtitle,
      description: t.slide4.description,
      image: '📊',
    },
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--onboarding-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" style={{ color: 'var(--onboarding-primary)' }} />
          <span className="font-semibold" style={{ color: 'var(--onboarding-text-primary)' }}>
            AfyaAI TZA
          </span>
        </div>
        <button
          onClick={onComplete}
          className="px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          style={{ color: 'var(--onboarding-text-secondary)' }}
        >
          {t.skip}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Icon */}
        <div
          className={`w-32 h-32 rounded-full ${currentSlideData.iconBg} flex items-center justify-center mb-8 slide-in`}
          key={currentSlide}
        >
          <span className="text-7xl">{currentSlideData.image}</span>
        </div>

        {/* Text Content */}
        <div className="text-center max-w-md slide-in" key={`text-${currentSlide}`}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--onboarding-primary)' }}>
            {currentSlideData.subtitle}
          </p>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--onboarding-text-primary)' }}>
            {currentSlideData.title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--onboarding-text-secondary)' }}>
            {currentSlideData.description}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 bg-white">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8' : 'w-2'
              }`}
              style={{
                background:
                  index === currentSlide
                    ? 'var(--onboarding-primary)'
                    : 'var(--onboarding-text-tertiary)',
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className={`p-3 rounded-xl transition-all ${
              currentSlide === 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-6 w-6" style={{ color: 'var(--onboarding-primary)' }} />
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
            style={{
              background: isLastSlide
                ? 'var(--gradient-action)'
                : 'var(--gradient-trust)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{isLastSlide ? t.getStarted : t.next}</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
