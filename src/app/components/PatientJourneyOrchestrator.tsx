/**
 * Patient Journey Orchestrator
 * 
 * Manages complete patient care flows from symptom to treatment
 * 
 * Features:
 * - Symptom assessment → Triage → Appointment booking flow
 * - Medication adherence tracking with reminders
 * - Test result notification → Follow-up scheduling
 * - Emergency detection with immediate action
 * - Maternal care journey management
 * - Chronic disease management pathways
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Heart,
  Phone,
  Pill,
  Stethoscope,
  TrendingUp,
  ArrowRight,
  X
} from 'lucide-react';

// Journey types
export type JourneyType = 
  | 'symptom-to-care'
  | 'medication-adherence'
  | 'test-follow-up'
  | 'maternal-care'
  | 'chronic-disease'
  | 'preventive-care';

// Journey step
interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  action?: () => void;
  required: boolean;
}

// Journey state
interface PatientJourney {
  id: string;
  type: JourneyType;
  title: string;
  currentStep: number;
  steps: JourneyStep[];
  startedAt: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface PatientJourneyOrchestratorProps {
  activeJourneys: PatientJourney[];
  onJourneyComplete: (journeyId: string) => void;
  onStepComplete: (journeyId: string, stepId: string) => void;
  onNavigate: (route: string) => void;
}

export const PatientJourneyOrchestrator: React.FC<PatientJourneyOrchestratorProps> = ({
  activeJourneys,
  onJourneyComplete,
  onStepComplete,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'care', 'clinical']);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

  // Priority-based sorting
  const sortedJourneys = [...activeJourneys].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#C84B31';
      case 'high': return '#F4A261';
      case 'medium': return '#1B998B';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityIcon = (type: JourneyType) => {
    switch (type) {
      case 'symptom-to-care': return Stethoscope;
      case 'medication-adherence': return Pill;
      case 'test-follow-up': return TrendingUp;
      case 'maternal-care': return Heart;
      case 'chronic-disease': return Heart;
      case 'preventive-care': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getProgress = (journey: PatientJourney): number => {
    const completedSteps = journey.steps.filter(s => s.status === 'completed').length;
    return (completedSteps / journey.steps.length) * 100;
  };

  if (activeJourneys.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-[#2E7D32]" />
        <h3 className="text-lg font-medium text-[#1E1E1E] mb-2">
          All Caught Up!
        </h3>
        <p className="text-sm text-[#6B7280]">
          You have no active care journeys at the moment.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-[#1E1E1E]">
          Your Care Journey
        </h2>
        <span className="text-sm text-[#6B7280]">
          {activeJourneys.length} active
        </span>
      </div>

      {sortedJourneys.map((journey) => {
        const Icon = getPriorityIcon(journey.type);
        const isExpanded = expandedJourney === journey.id;
        const progress = getProgress(journey);
        const currentStepData = journey.steps[journey.currentStep];

        return (
          <Card 
            key={journey.id}
            className="overflow-hidden border-l-4"
            style={{ borderLeftColor: getPriorityColor(journey.priority) }}
          >
            {/* Journey Header */}
            <button
              onClick={() => setExpandedJourney(isExpanded ? null : journey.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${getPriorityColor(journey.priority)}15` }}
                >
                  <Icon 
                    className="h-5 w-5" 
                    style={{ color: getPriorityColor(journey.priority) }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-medium text-[#1E1E1E]">
                        {journey.title}
                      </h3>
                      {journey.priority === 'urgent' && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#C84B31] mt-1">
                          <AlertCircle className="h-3 w-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#6B7280] whitespace-nowrap">
                      Step {journey.currentStep + 1}/{journey.steps.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Current Step */}
                  {currentStepData && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#6B7280]">
                        {currentStepData.title}
                      </span>
                    </div>
                  )}
                </div>

                <ArrowRight 
                  className={`h-5 w-5 text-[#6B7280] transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expanded Journey Steps */}
            {isExpanded && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-3">
                  {journey.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        step.status === 'active' 
                          ? 'bg-[#EFF6FF] border border-[#93C5FD]' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {/* Step Status Icon */}
                      <div className="mt-0.5">
                        {step.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-[#2E7D32]" />
                        )}
                        {step.status === 'active' && (
                          <div className="h-5 w-5 rounded-full border-2 border-[#0F3D56] flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-[#0F3D56]" />
                          </div>
                        )}
                        {step.status === 'pending' && (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        {step.status === 'skipped' && (
                          <X className="h-5 w-5 text-[#6B7280]" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm text-[#1E1E1E]">
                            {step.title}
                            {step.required && (
                              <span className="text-[#C84B31] ml-1">*</span>
                            )}
                          </h4>
                          <span className="text-xs text-[#6B7280] capitalize">
                            {step.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">
                          {step.description}
                        </p>

                        {/* Step Action Button */}
                        {step.status === 'active' && step.action && (
                          <Button
                            size="sm"
                            onClick={step.action}
                            className="w-full sm:w-auto"
                          >
                            Continue
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Journey Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  {progress === 100 ? (
                    <Button
                      onClick={() => onJourneyComplete(journey.id)}
                      className="flex-1"
                      variant="default"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Journey
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Skip current step if not required
                          if (currentStepData && !currentStepData.required) {
                            onStepComplete(journey.id, currentStepData.id);
                          }
                        }}
                        disabled={currentStepData?.required}
                      >
                        {currentStepData?.required ? 'Required' : 'Skip Step'}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          if (currentStepData?.action) {
                            currentStepData.action();
                          }
                        }}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Emergency Action Card */}
      {sortedJourneys.some(j => j.priority === 'urgent') && (
        <Card className="p-4 bg-[#FEF3F2] border-[#FCA5A5]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#C84B31] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-[#C84B31] mb-1">
                Urgent Action Needed
              </h3>
              <p className="text-sm text-[#6B7280] mb-3">
                You have urgent care steps that require immediate attention.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onNavigate('emergency')}
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Emergency (114)
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Hook to manage patient journeys
 */
export const usePatientJourneys = () => {
  const [journeys, setJourneys] = useState<PatientJourney[]>([]);

  const createJourney = (type: JourneyType, title: string, steps: Omit<JourneyStep, 'status'>[]) => {
    const newJourney: PatientJourney = {
      id: `journey-${Date.now()}`,
      type,
      title,
      currentStep: 0,
      steps: steps.map(step => ({ ...step, status: 'pending' as const })),
      startedAt: new Date(),
      priority: type === 'symptom-to-care' ? 'high' : 'medium'
    };

    // Mark first step as active
    if (newJourney.steps.length > 0) {
      newJourney.steps[0].status = 'active';
    }

    setJourneys(prev => [...prev, newJourney]);
    return newJourney.id;
  };

  const completeStep = (journeyId: string, stepId: string) => {
    setJourneys(prev => prev.map(journey => {
      if (journey.id !== journeyId) return journey;

      const stepIndex = journey.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return journey;

      const updatedSteps = [...journey.steps];
      updatedSteps[stepIndex].status = 'completed';

      // Activate next step
      const nextStep = updatedSteps.find((s, i) => i > stepIndex && s.status === 'pending');
      if (nextStep) {
        nextStep.status = 'active';
      }

      return {
        ...journey,
        steps: updatedSteps,
        currentStep: Math.min(stepIndex + 1, journey.steps.length - 1)
      };
    }));
  };

  const completeJourney = (journeyId: string) => {
    setJourneys(prev => prev.map(journey => {
      if (journey.id !== journeyId) return journey;
      
      return {
        ...journey,
        steps: journey.steps.map(s => ({ ...s, status: 'completed' as const })),
        completedAt: new Date()
      };
    }));

    // Remove completed journey after a delay
    setTimeout(() => {
      setJourneys(prev => prev.filter(j => j.id !== journeyId));
    }, 2000);
  };

  return {
    journeys,
    createJourney,
    completeStep,
    completeJourney
  };
};
