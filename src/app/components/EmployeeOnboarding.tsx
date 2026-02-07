import React, { useState } from 'react';
import {
  Stethoscope,
  ClipboardCheck,
  GraduationCap,
  Shield,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle2,
  FileText,
  Video,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';

const translations = {
  sw: {
    title: 'Karibu Timu ya AfyaAI',
    subtitle: 'Tunakaribisha mfanyakazi mpya!',
    roleSelection: 'Chagua Wadhifa Wako',
    preboardingTab: 'Kabla ya Kufanya Kazi',
    complianceTab: 'Ufuatiliaji wa Sheria',
    trainingTab: 'Mafunzo ya Mfumo',
    teamIntro: 'Jifunze Timu',
    complete: 'Maliza Usajili',
    roles: {
      clinician: 'Mtaalamu wa Afya',
      clinicianDesc: 'Daktari, Muuguzi, Clinical Officer',
      admin: 'Msimamizi',
      adminDesc: 'Ratiba, Fedha, Usimamizi',
      chw: 'CHW - Mfanyakazi wa Jamii',
      chwDesc: 'Huduma za afya jamii',
    },
    preboarding: {
      title: 'Pokea Nyaraka za Kufanya Kazi',
      welcome: 'Video ya Karibu',
      contract: 'Mkataba wa Kazi',
      credentials: 'Stakabadhi za Kitaalamu',
      id: 'Kitambulisho cha Taifa',
    },
    compliance: {
      title: 'Ufuatiliaji wa Sheria',
      tmda: 'Sheria za TMDA',
      pdpa: 'Ulinzi wa Data (PDPA)',
      hipaa: 'Faragha ya Mgonjwa',
      safety: 'Usalama Kazini',
      quiz: 'Jaribio (70% kupita)',
    },
    training: {
      title: 'Mafunzo ya Mfumo',
      ehr: 'Mfumo wa Rekodi za Mgonjwa (EHR)',
      telemedicine: 'Huduma za Telemedicine',
      ai: 'Matumizi ya AI kwa Usalama',
      scheduling: 'Ratiba na Usimamizi wa Miadi',
    },
    team: {
      title: 'Jifunze Timu Yako',
      mentor: 'Mtaalamu Mwenza',
      colleagues: 'Wafanyakazi Wenzako',
      supervisor: 'Msimamizi Wako',
    },
    checkpoints: {
      day30: 'Tathmini ya Siku 30',
      day60: 'Tathmini ya Siku 60',
      day90: 'Tathmini ya Siku 90',
    },
  },
  en: {
    title: 'Welcome to AfyaAI Team',
    subtitle: 'Onboarding new team member!',
    roleSelection: 'Select Your Role',
    preboardingTab: 'Preboarding',
    complianceTab: 'Compliance & Safety',
    trainingTab: 'System Training',
    teamIntro: 'Meet Your Team',
    complete: 'Complete Onboarding',
    roles: {
      clinician: 'Clinical Staff',
      clinicianDesc: 'Doctor, Nurse, Clinical Officer',
      admin: 'Administrative Staff',
      adminDesc: 'Scheduling, Billing, Management',
      chw: 'Community Health Worker',
      chwDesc: 'Community-based services',
    },
    preboarding: {
      title: 'Receive Onboarding Materials',
      welcome: 'Welcome Video',
      contract: 'Employment Contract',
      credentials: 'Professional Credentials',
      id: 'National ID Verification',
    },
    compliance: {
      title: 'Compliance & Safety Training',
      tmda: 'TMDA Regulations',
      pdpa: 'Data Protection (PDPA)',
      hipaa: 'Patient Privacy (HIPAA-style)',
      safety: 'Workplace Safety',
      quiz: 'Assessment Quiz (70% to pass)',
    },
    training: {
      title: 'System Training',
      ehr: 'Electronic Health Records (EHR)',
      telemedicine: 'Telemedicine Platform',
      ai: 'AI-Assisted Diagnosis Safety',
      scheduling: 'Appointment Management',
    },
    team: {
      title: 'Meet Your Team',
      mentor: 'Your Mentor',
      colleagues: 'Your Colleagues',
      supervisor: 'Your Supervisor',
    },
    checkpoints: {
      day30: '30-Day Check-In',
      day60: '60-Day Check-In',
      day90: '90-Day Review',
    },
  },
};

interface EmployeeOnboardingProps {
  onComplete: (data: {
    role: string;
    completedModules: string[];
    quizScore?: number;
  }) => void;
  language: 'sw' | 'en';
}

export function EmployeeOnboarding({ onComplete, language }: EmployeeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  const t = translations[language];
  const totalSteps = 5;

  const roles = [
    {
      id: 'clinician',
      icon: Stethoscope,
      label: t.roles.clinician,
      description: t.roles.clinicianDesc,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'admin',
      icon: ClipboardCheck,
      label: t.roles.admin,
      description: t.roles.adminDesc,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'chw',
      icon: Users,
      label: t.roles.chw,
      description: t.roles.chwDesc,
      color: 'from-green-500 to-green-600',
    },
  ];

  const preboardingItems = [
    { id: 'welcome', label: t.preboarding.welcome, icon: Video },
    { id: 'contract', label: t.preboarding.contract, icon: FileText },
    { id: 'credentials', label: t.preboarding.credentials, icon: Award },
    { id: 'id', label: t.preboarding.id, icon: UserCheck },
  ];

  const complianceModules = [
    { id: 'tmda', label: t.compliance.tmda, duration: '15 min' },
    { id: 'pdpa', label: t.compliance.pdpa, duration: '20 min' },
    { id: 'hipaa', label: t.compliance.hipaa, duration: '25 min' },
    { id: 'safety', label: t.compliance.safety, duration: '10 min' },
  ];

  const trainingModules = [
    { id: 'ehr', label: t.training.ehr, duration: '45 min', icon: FileText },
    { id: 'telemedicine', label: t.training.telemedicine, duration: '30 min', icon: Video },
    { id: 'ai', label: t.training.ai, duration: '20 min', icon: Shield },
    { id: 'scheduling', label: t.training.scheduling, duration: '15 min', icon: ClipboardCheck },
  ];

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        role: selectedRole || 'unknown',
        completedModules,
        quizScore,
      });
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Role Selection
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.roleSelection}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-6 rounded-2xl border-2 transition-all hover:shadow-xl ${
                      isSelected ? 'border-transparent' : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${role.color})` : undefined,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-white/20' : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className="h-10 w-10"
                          style={{ color: isSelected ? 'white' : 'var(--onboarding-primary)' }}
                        />
                      </div>
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: isSelected ? 'white' : 'var(--onboarding-text-primary)' }}
                      >
                        {role.label}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: isSelected ? 'white' : 'var(--onboarding-text-secondary)' }}
                      >
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1:
        // Preboarding
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.preboarding.title}
            </h2>

            <div className="space-y-4">
              {preboardingItems.map((item) => {
                const Icon = item.icon;
                const isCompleted = completedModules.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="p-3 rounded-xl"
                          style={{ background: 'var(--onboarding-primary-bg)' }}
                        >
                          <Icon className="h-6 w-6" style={{ color: 'var(--onboarding-primary)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold" style={{ color: 'var(--onboarding-text-primary)' }}>
                            {item.label}
                          </h4>
                        </div>
                      </div>
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleModuleComplete(item.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        // Compliance Training
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--onboarding-secondary)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.compliance.title}
              </h2>
            </div>

            <div className="space-y-4">
              {complianceModules.map((module, index) => {
                const isCompleted = completedModules.includes(module.id);
                return (
                  <div
                    key={module.id}
                    className="bg-white p-5 rounded-xl border-2 border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold" style={{ color: 'var(--onboarding-text-primary)' }}>
                            {module.label}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleModuleComplete(module.id)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          isCompleted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isCompleted
                          ? language === 'sw'
                            ? 'Imekamilika'
                            : 'Completed'
                          : language === 'sw'
                          ? 'Anza'
                          : 'Start'}
                      </button>
                    </div>
                    {isCompleted && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                        <Award className="h-4 w-4" />
                        <span>{language === 'sw' ? 'Umefaulu!' : 'Passed!'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Section */}
            <div
              className="mt-6 p-6 rounded-xl"
              style={{ background: 'var(--onboarding-accent-bg)' }}
            >
              <h3 className="font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.compliance.quiz}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {language === 'sw'
                  ? 'Jaribio la maswali 20 - Lazima upate angalau 70%'
                  : '20-question assessment - Must score 70% or higher'}
              </p>
              <button
                onClick={() => setQuizScore(85)}
                className="px-6 py-3 rounded-lg font-semibold text-white"
                style={{ background: 'var(--onboarding-accent)' }}
              >
                {language === 'sw' ? 'Anza Jaribio' : 'Start Quiz'}
              </button>
            </div>
          </div>
        );

      case 3:
        // System Training
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--onboarding-primary)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.training.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingModules.map((module) => {
                const Icon = module.icon;
                const isCompleted = completedModules.includes(module.id);
                return (
                  <div
                    key={module.id}
                    className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-8 w-8" style={{ color: 'var(--onboarding-primary)' }} />
                      <div className="flex-1">
                        <h4 className="font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                          {module.label}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                          {module.duration}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleModuleComplete(module.id)}
                      className={`w-full py-3 rounded-lg font-medium ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>{language === 'sw' ? 'Imekamilika' : 'Completed'}</span>
                        </div>
                      ) : (
                        language === 'sw' ? 'Anza Mafunzo' : 'Start Training'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        // Team Introduction
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--onboarding-secondary)' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.team.title}
              </h2>
            </div>

            {/* Mentor Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--onboarding-text-primary)' }}>
                    Dr. John Mwamba
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                    {t.team.mentor}
                  </p>
                </div>
              </div>
              <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
                {language === 'sw' ? 'Agiza Mkutano wa Kwanza' : 'Schedule First Meeting'}
              </button>
            </div>

            {/* Colleagues */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border-2 border-gray-200 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-300 mb-2" />
                  <p className="font-medium text-sm" style={{ color: 'var(--onboarding-text-primary)' }}>
                    {language === 'sw' ? 'Mfanyakazi' : 'Colleague'} {i}
                  </p>
                </div>
              ))}
            </div>

            {/* Check-in Schedule */}
            <div
              className="mt-8 p-6 rounded-xl"
              style={{ background: 'var(--onboarding-secondary-bg)' }}
            >
              <h3 className="font-bold mb-4" style={{ color: 'var(--onboarding-secondary)' }}>
                {language === 'sw' ? 'Ratiba ya Tathmini' : 'Check-in Schedule'}
              </h3>
              <div className="space-y-2">
                {[
                  { label: t.checkpoints.day30, icon: '📅' },
                  { label: t.checkpoints.day60, icon: '📊' },
                  { label: t.checkpoints.day90, icon: '🎯' },
                ].map((checkpoint, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{checkpoint.icon}</span>
                    <span style={{ color: 'var(--onboarding-text-primary)' }}>{checkpoint.label}</span>
                  </div>
                ))}
              </div>
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8" style={{ color: 'var(--onboarding-primary)' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.title}
              </h1>
              <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--onboarding-text-secondary)' }}>
                {language === 'sw' ? 'Hatua' : 'Step'} {currentStep + 1} {language === 'sw' ? 'kati ya' : 'of'}{' '}
                {totalSteps}
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
        <div className="max-w-4xl mx-auto px-6 py-8 slide-in" key={currentStep}>
          {renderStep()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--onboarding-text-secondary)' }}
          >
            {language === 'sw' ? 'Rudi' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === 0 && !selectedRole}
            className="flex-1 max-w-xs py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                currentStep === totalSteps - 1
                  ? 'var(--gradient-action)'
                  : 'var(--gradient-trust)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === totalSteps - 1
                  ? t.complete
                  : language === 'sw'
                  ? 'Endelea'
                  : 'Continue'}
              </span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}