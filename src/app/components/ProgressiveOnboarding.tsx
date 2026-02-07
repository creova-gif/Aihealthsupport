import React, { useState } from 'react';
import {
  Shield,
  Globe,
  MapPin,
  Check,
  ChevronRight,
  Volume2,
  User,
  Stethoscope,
  Users,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';

interface ProgressiveOnboardingProps {
  onComplete: (data: {
    role: string;
    language: string;
    region?: string;
    consented: boolean;
  }) => void;
}

export function ProgressiveOnboarding({ onComplete }: ProgressiveOnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('sw');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [consented, setConsented] = useState(false);

  const totalSteps = 4;

  // Step 1: Role Selection
  const roles = [
    {
      id: 'patient',
      icon: User,
      label: selectedLanguage === 'sw' ? 'Mgonjwa / Raia' : 'Patient / Citizen',
      description:
        selectedLanguage === 'sw'
          ? 'Angalia dalili, pima afya, ongea na madaktari'
          : 'Check symptoms, track health, consult doctors',
      color: '#1C4ED8',
    },
    {
      id: 'chw',
      icon: Users,
      label: selectedLanguage === 'sw' ? 'Mtoa Huduma wa Jamii (CHW)' : 'Community Health Worker',
      description:
        selectedLanguage === 'sw'
          ? 'Tembelea nyumba, kusanya data, rufaa wagonjwa'
          : 'Visit households, collect data, refer patients',
      color: '#0F9D58',
    },
    {
      id: 'clinician',
      icon: Stethoscope,
      label: selectedLanguage === 'sw' ? 'Daktari / Muuguzi' : 'Clinician / Nurse',
      description:
        selectedLanguage === 'sw'
          ? 'Tathmini wagonjwa, tumia AI kusaidia uchunguzi'
          : 'Assess patients, use AI for diagnosis support',
      color: '#8B5CF6',
    },
    {
      id: 'admin',
      icon: BarChart3,
      label: selectedLanguage === 'sw' ? 'Msimamizi / Wizara' : 'Administrator / Ministry',
      description:
        selectedLanguage === 'sw'
          ? 'Angalia takwimu, fuatilia matukio, unda sera'
          : 'View analytics, monitor trends, shape policy',
      color: '#F59E0B',
    },
  ];

  // Step 2: Language Selection
  const languages = [
    {
      id: 'sw',
      name: 'Kiswahili',
      flag: '🇹🇿',
      description: 'Lugha rasmi ya Tanzania',
      isDefault: true,
    },
    {
      id: 'en',
      name: 'English',
      flag: '🇬🇧',
      description: 'International language',
      isDefault: false,
    },
  ];

  // Step 3: Region Selection
  const regions = [
    'Dar es Salaam',
    'Mwanza',
    'Arusha',
    'Dodoma',
    'Mbeya',
    'Morogoro',
    'Tanga',
    'Kahama',
    'Tabora',
    'Zanzibar',
  ].sort();

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps && consented) {
      onComplete({
        role: selectedRole,
        language: selectedLanguage,
        region: selectedRegion,
        consented,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canContinue = () => {
    if (step === 1) return selectedRole !== '';
    if (step === 2) return selectedLanguage !== '';
    if (step === 3) return selectedRegion !== '';
    if (step === 4) return consented;
    return false;
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: '#6B7280' }}>
          {selectedLanguage === 'sw' ? 'Hatua' : 'Step'} {step}/{totalSteps}
        </span>
        <span className="text-sm" style={{ color: '#0F9D58' }}>
          {Math.round((step / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(step / totalSteps) * 100}%`,
            backgroundColor: '#0F9D58',
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: '#0F9D58' }} />
          <h1 className="text-3xl md:text-4xl mb-2">
            {selectedLanguage === 'sw' ? 'Karibu AfyaAI' : 'Welcome to AfyaAI'}
          </h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            {selectedLanguage === 'sw'
              ? 'Hatua kadhaa za kuanza'
              : 'A few steps to get started'}
          </p>
        </div>

        <ProgressBar />

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-4">
              {selectedLanguage === 'sw' ? 'Wewe ni nani?' : 'Who are you?'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-6 rounded-xl text-left transition-all border-2 ${
                      selectedRole === role.id
                        ? 'shadow-lg scale-[1.02]'
                        : 'hover:shadow-md hover:scale-[1.01]'
                    }`}
                    style={{
                      borderColor: selectedRole === role.id ? role.color : '#E5E7EB',
                      backgroundColor: selectedRole === role.id ? `${role.color}10` : 'white',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Icon className="h-8 w-8" style={{ color: role.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl">{role.label}</h3>
                          {selectedRole === role.id && (
                            <Check className="h-5 w-5" style={{ color: role.color }} />
                          )}
                        </div>
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Language Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-4">
              <Globe className="inline h-6 w-6 mr-2" style={{ color: '#0F9D58' }} />
              {selectedLanguage === 'sw' ? 'Chagua Lugha' : 'Select Language'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`p-6 rounded-xl text-left transition-all border-2 ${
                    selectedLanguage === lang.id
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{lang.flag}</span>
                      <div>
                        <h3 className="text-xl mb-1">{lang.name}</h3>
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          {lang.description}
                        </p>
                        {lang.isDefault && (
                          <Badge className="mt-2" style={{ backgroundColor: '#0F9D58' }}>
                            {selectedLanguage === 'sw' ? 'Chaguo-msingi' : 'Default'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedLanguage === lang.id && (
                      <Check className="h-6 w-6" style={{ color: '#0F9D58' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Voice Option */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                  <p className="text-sm">
                    {selectedLanguage === 'sw'
                      ? 'Sauti itapatikana baadaye kwa wale wasioweza kusoma'
                      : 'Voice support coming soon for low-literacy users'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Region Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-4">
              <MapPin className="inline h-6 w-6 mr-2" style={{ color: '#0F9D58' }} />
              {selectedLanguage === 'sw' ? 'Unaishi wapi?' : 'Where do you live?'}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`p-4 rounded-lg text-left transition-all border-2 ${
                    selectedRegion === region
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{region}</span>
                    {selectedRegion === region && (
                      <Check className="h-5 w-5" style={{ color: '#0F9D58' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {selectedLanguage === 'sw'
                    ? '📍 GPS itatumika kiotomatiki ikiwa inapatikana'
                    : '📍 GPS will be used automatically when available'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Consent */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl mb-4">
              <Shield className="inline h-6 w-6 mr-2" style={{ color: '#0F9D58' }} />
              {selectedLanguage === 'sw' ? 'Faragha na Usalama' : 'Privacy & Safety'}
            </h2>

            <Card className="border-2" style={{ borderColor: '#0F9D58' }}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#0F9D58' }} />
                    <p className="text-base">
                      {selectedLanguage === 'sw'
                        ? 'Taarifa zako zimefichwa na AES-256 encryption'
                        : 'Your data is protected with AES-256 encryption'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#0F9D58' }} />
                    <p className="text-base">
                      {selectedLanguage === 'sw'
                        ? 'Kufuata Sheria ya Ulinzi wa Data ya Tanzania (PDPA)'
                        : 'Complies with Tanzania Personal Data Protection Act (PDPA)'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#0F9D58' }} />
                    <p className="text-base">
                      {selectedLanguage === 'sw'
                        ? 'Data yako haitouzwa kwa watu wengine'
                        : 'Your data will never be sold to third parties'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#0F9D58' }} />
                    <p className="text-base">
                      {selectedLanguage === 'sw'
                        ? 'Unaweza kufuta taarifa zako wakati wowote'
                        : 'You can delete your data at any time'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consented}
                      onCheckedChange={(checked) => setConsented(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="consent" className="text-base cursor-pointer leading-relaxed">
                      {selectedLanguage === 'sw'
                        ? 'Ninakubali matumizi ya taarifa zangu kwa huduma za afya na ninaeelewa kuwa AI ni kusaidia tu, si kubadilisha madaktari.'
                        : 'I consent to the use of my data for healthcare services and understand that AI is for assistance only, not to replace doctors.'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Read-Aloud Option */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                // TODO: Text-to-speech implementation
                alert(
                  selectedLanguage === 'sw'
                    ? 'Kipengele cha sauti kinakuja hivi karibuni'
                    : 'Voice feature coming soon'
                );
              }}
            >
              <Volume2 className="h-4 w-4" />
              {selectedLanguage === 'sw' ? 'Soma kwa Sauti' : 'Read Aloud'}
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              {selectedLanguage === 'sw' ? 'Nyuma' : 'Back'}
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="flex-1 gap-2"
            style={{ backgroundColor: canContinue() ? '#0F9D58' : '#D1D5DB' }}
          >
            {step === totalSteps
              ? selectedLanguage === 'sw'
                ? 'Anza Kutumia'
                : 'Start Using'
              : selectedLanguage === 'sw'
              ? 'Endelea'
              : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
