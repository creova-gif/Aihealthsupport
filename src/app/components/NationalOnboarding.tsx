/**
 * NationalOnboarding - World-Class Entry Experience
 * 
 * DESIGN PRINCIPLES:
 * - Build trust without hype
 * - No AI claims or certification badges
 * - Clean white space
 * - Clear purpose
 * - Max 4 screens
 * - Skip allowed
 * - Plain Swahili default
 * - No animations >200ms
 * 
 * COMPARED TO: NHS App onboarding, Apple Health setup
 */

import React, { useState } from 'react';
import { ChevronRight, Shield, MapPin, Phone, CheckCircle } from 'lucide-react';
import { colors } from '@/app/design-system';
import { LanguageToggle } from './LanguageToggle';

interface NationalOnboardingProps {
  onComplete: (data: {
    language: 'sw' | 'en';
    name: string;
    phone: string;
    consentGiven: boolean;
  }) => void;
}

export function NationalOnboarding({ onComplete }: NationalOnboardingProps) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const content = {
    sw: {
      skip: 'Ruka',
      next: 'Endelea',
      done: 'Maliza',
      welcome: {
        title: 'Afya yako. Imeshikamana.',
        subtitle: 'Huduma za afya kutoka serikali ya Tanzania',
        cta: 'Anza',
      },
      access: {
        title: 'Pata huduma. Mahali popote nchini.',
        subtitle: 'Vituo vya afya, hospitali, na wataalamu wanapatikana',
        feature1: 'Pata ushauri wa haraka',
        feature2: 'Tafuta kliniki karibu nawe',
        feature3: 'Fuatilia afya yako',
      },
      privacy: {
        title: 'Taarifa zako zinabaki salama.',
        subtitle: 'Data yako ni yako. Unayo udhibiti kamili.',
        feature1: 'Data encrypted',
        feature2: 'Unaona nani anafikia',
        feature3: 'Ufutaji wa data wakati wowote',
      },
      account: {
        title: 'Unda akaunti yako',
        subtitle: 'Ingiza taarifa zako za msingi',
        nameLabel: 'Jina lako kamili',
        namePlaceholder: 'Jina la kwanza na la mwisho',
        phoneLabel: 'Namba ya simu',
        phonePlaceholder: '+255 7XX XXX XXX',
        consentLabel: 'Ninakubali sera ya faragha na masharti ya matumizi',
        consentRequired: 'Lazima ukubali ili kuendelea',
      },
    },
    en: {
      skip: 'Skip',
      next: 'Continue',
      done: 'Get Started',
      welcome: {
        title: 'Your health. Connected.',
        subtitle: 'Healthcare services from the Government of Tanzania',
        cta: 'Begin',
      },
      access: {
        title: 'Access care. Anywhere in Tanzania.',
        subtitle: 'Health facilities, hospitals, and experts available',
        feature1: 'Get quick guidance',
        feature2: 'Find nearby clinics',
        feature3: 'Track your health',
      },
      privacy: {
        title: 'Your information stays secure.',
        subtitle: 'Your data is yours. You have full control.',
        feature1: 'Data encrypted',
        feature2: 'See who accesses',
        feature3: 'Delete data anytime',
      },
      account: {
        title: 'Create your account',
        subtitle: 'Enter your basic information',
        nameLabel: 'Your full name',
        namePlaceholder: 'First and last name',
        phoneLabel: 'Phone number',
        phonePlaceholder: '+255 7XX XXX XXX',
        consentLabel: 'I agree to the privacy policy and terms of use',
        consentRequired: 'You must agree to continue',
      },
    },
  };

  const t = content[language];

  const handleNext = () => {
    if (step === 3) {
      // Final step - validate and complete
      if (name && phone && consentGiven) {
        onComplete({
          language,
          name,
          phone,
          consentGiven,
        });
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    if (step < 2) {
      setStep(2); // Skip to account creation
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Language Toggle - Always visible */}
      <LanguageToggle
        language={language}
        onToggle={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
      />

      {/* Progress Indicators */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 max-w-md mx-auto">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-200"
              style={{
                backgroundColor: i <= step ? colors.primary[500] : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* STEP 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              {/* Ministry Logo Placeholder */}
              <div
                className="w-20 h-20 mx-auto mb-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Shield className="w-10 h-10" style={{ color: colors.primary[500] }} strokeWidth={2} />
              </div>

              <h1 className="text-3xl font-semibold text-[#1A1D23] mb-4">
                {t.welcome.title}
              </h1>
              <p className="text-lg text-[#6B7280] mb-12">
                {t.welcome.subtitle}
              </p>

              <button
                onClick={handleNext}
                className="w-full px-6 py-4 text-white rounded-xl text-lg font-semibold active:scale-[0.99] transition-transform"
                style={{
                  backgroundColor: colors.primary[500],
                  minHeight: '56px',
                }}
              >
                {t.welcome.cta}
              </button>
            </div>
          )}

          {/* STEP 1: Access */}
          {step === 1 && (
            <div>
              <div
                className="w-16 h-16 mb-6 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <MapPin className="w-8 h-8" style={{ color: colors.primary[500] }} strokeWidth={2} />
              </div>

              <h2 className="text-2xl font-semibold text-[#1A1D23] mb-3">
                {t.access.title}
              </h2>
              <p className="text-base text-[#6B7280] mb-8">
                {t.access.subtitle}
              </p>

              <div className="space-y-4 mb-12">
                <FeatureItem text={t.access.feature1} />
                <FeatureItem text={t.access.feature2} />
                <FeatureItem text={t.access.feature3} />
              </div>

              <button
                onClick={handleNext}
                className="w-full px-6 py-4 text-white rounded-xl text-base font-semibold active:scale-[0.99] transition-transform"
                style={{
                  backgroundColor: colors.primary[500],
                  minHeight: '56px',
                }}
              >
                {t.next}
              </button>
            </div>
          )}

          {/* STEP 2: Privacy */}
          {step === 2 && (
            <div>
              <div
                className="w-16 h-16 mb-6 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Shield className="w-8 h-8" style={{ color: colors.primary[500] }} strokeWidth={2} />
              </div>

              <h2 className="text-2xl font-semibold text-[#1A1D23] mb-3">
                {t.privacy.title}
              </h2>
              <p className="text-base text-[#6B7280] mb-8">
                {t.privacy.subtitle}
              </p>

              <div className="space-y-4 mb-12">
                <FeatureItem text={t.privacy.feature1} />
                <FeatureItem text={t.privacy.feature2} />
                <FeatureItem text={t.privacy.feature3} />
              </div>

              <button
                onClick={handleNext}
                className="w-full px-6 py-4 text-white rounded-xl text-base font-semibold active:scale-[0.99] transition-transform"
                style={{
                  backgroundColor: colors.primary[500],
                  minHeight: '56px',
                }}
              >
                {t.next}
              </button>
            </div>
          )}

          {/* STEP 3: Account Creation */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#1A1D23] mb-3">
                {t.account.title}
              </h2>
              <p className="text-base text-[#6B7280] mb-8">
                {t.account.subtitle}
              </p>

              <div className="space-y-6 mb-8">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1D23] mb-2">
                    {t.account.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.account.namePlaceholder}
                    className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg text-base focus:outline-none focus:border-[#1E88E5]"
                    style={{ minHeight: '52px' }}
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1D23] mb-2">
                    {t.account.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.account.phonePlaceholder}
                    className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg text-base focus:outline-none focus:border-[#1E88E5]"
                    style={{ minHeight: '52px' }}
                  />
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-[#E5E7EB]"
                    style={{ accentColor: colors.primary[500] }}
                  />
                  <span className="text-sm text-[#6B7280] leading-relaxed">
                    {t.account.consentLabel}
                  </span>
                </label>
              </div>

              <button
                onClick={handleNext}
                disabled={!name || !phone || !consentGiven}
                className="w-full px-6 py-4 text-white rounded-xl text-base font-semibold active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.primary[500],
                  minHeight: '56px',
                }}
              >
                {t.done}
              </button>

              {!consentGiven && name && phone && (
                <p className="text-sm text-center mt-4" style={{ color: colors.danger[500] }}>
                  {t.account.consentRequired}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skip button (only for steps 0-1) */}
      {step < 2 && (
        <div className="px-6 pb-6">
          <button
            onClick={handleSkip}
            className="w-full py-3 text-[#6B7280] text-sm font-medium"
          >
            {t.skip}
          </button>
        </div>
      )}
    </div>
  );
}

// Feature Item Component
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: colors.primary[500] }} strokeWidth={2} />
      <span className="text-base text-[#1A1D23]">{text}</span>
    </div>
  );
}