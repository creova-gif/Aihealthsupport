import React, { useState, useEffect } from 'react';
import { TrustSafetyOverlay } from './TrustSafetyOverlay';
import { ProgressivePermissions, PermissionType } from './ProgressivePermissions';
import { MicroPersonalization, PersonalizationData } from './MicroPersonalization';
import { FeatureTooltip, TooltipConfig, TooltipManager } from './FeatureTooltip';
import { FirstAhaMoment, UserRole } from './FirstAhaMoment';
import { HabitChecklist } from './HabitChecklist';
import { AIGuide } from './AIGuide';

interface OnboardingEnhancementManagerProps {
  language: 'sw' | 'en';
  userRole: UserRole;
  isFirstLaunch: boolean;
  onEnhancementComplete?: (data: any) => void;
}

// Enhanced onboarding state machine
type OnboardingStage =
  | 'trust-overlay'
  | 'personalization'
  | 'first-aha'
  | 'feature-discovery'
  | 'habit-formation'
  | 'complete';

export function OnboardingEnhancementManager({
  language,
  userRole,
  isFirstLaunch,
  onEnhancementComplete,
}: OnboardingEnhancementManagerProps) {
  const [currentStage, setCurrentStage] = useState<OnboardingStage>('trust-overlay');
  const [showTrustOverlay, setShowTrustOverlay] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showFirstAha, setShowFirstAha] = useState(false);
  const [showHabitChecklist, setShowHabitChecklist] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  
  const [permissionQueue, setPermissionQueue] = useState<Array<{
    type: PermissionType;
    reason: string;
    benefit: string;
    required: boolean;
  }>>([]);
  const [currentPermission, setCurrentPermission] = useState<any>(null);
  
  const [tooltipQueue, setTooltipQueue] = useState<TooltipConfig[]>([]);
  const [currentTooltip, setCurrentTooltip] = useState<TooltipConfig | null>(null);
  
  const [enhancementData, setEnhancementData] = useState<any>({});

  // Initialize onboarding flow
  useEffect(() => {
    if (isFirstLaunch) {
      startEnhancedOnboarding();
    }
  }, [isFirstLaunch]);

  const startEnhancedOnboarding = () => {
    // Check if trust overlay was already shown
    const trustShown = localStorage.getItem('trust_overlay_shown') === 'true';
    
    if (!trustShown) {
      setShowTrustOverlay(true);
      setCurrentStage('trust-overlay');
    } else {
      // Skip to personalization
      handleTrustOverlayComplete();
    }
  };

  const handleTrustOverlayComplete = () => {
    localStorage.setItem('trust_overlay_shown', 'true');
    setShowTrustOverlay(false);
    
    // Move to personalization
    const personalizationShown = localStorage.getItem('personalization_shown') === 'true';
    if (!personalizationShown) {
      setShowPersonalization(true);
      setCurrentStage('personalization');
    } else {
      handlePersonalizationComplete({});
    }
  };

  const handlePersonalizationComplete = (data: PersonalizationData) => {
    localStorage.setItem('personalization_shown', 'true');
    setEnhancementData((prev: any) => ({ ...prev, personalization: data }));
    setShowPersonalization(false);
    
    // Move to first "aha" moment
    const ahaShown = localStorage.getItem('first_aha_shown') === 'true';
    if (!ahaShown) {
      setShowFirstAha(true);
      setCurrentStage('first-aha');
    } else {
      handleFirstAhaComplete({});
    }
  };

  const handleFirstAhaComplete = (data: any) => {
    localStorage.setItem('first_aha_shown', 'true');
    setEnhancementData((prev: any) => ({ ...prev, firstAha: data }));
    setShowFirstAha(false);
    
    // Start habit formation
    setCurrentStage('habit-formation');
    setShowHabitChecklist(true);
    
    // Show AI guide after a delay
    setTimeout(() => {
      const aiGuideShown = localStorage.getItem('ai_guide_shown') === 'true';
      if (!aiGuideShown) {
        setShowAIGuide(true);
        localStorage.setItem('ai_guide_shown', 'true');
      }
    }, 3000);
    
    // Complete enhancement flow
    setCurrentStage('complete');
    onEnhancementComplete?.(enhancementData);
  };

  // Permission request handler
  const requestPermission = (
    type: PermissionType,
    reason: string,
    benefit: string,
    required: boolean = false
  ) => {
    const permission = { type, reason, benefit, required };
    setCurrentPermission(permission);
  };

  const handlePermissionAllow = () => {
    if (currentPermission) {
      // Store permission grant
      localStorage.setItem(`permission_${currentPermission.type}`, 'granted');
      setEnhancementData((prev: any) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [currentPermission.type]: 'granted',
        },
      }));
    }
    setCurrentPermission(null);
  };

  const handlePermissionDeny = () => {
    if (currentPermission) {
      localStorage.setItem(`permission_${currentPermission.type}`, 'denied');
    }
    setCurrentPermission(null);
  };

  // Tooltip handler
  const showTooltip = (tooltip: TooltipConfig) => {
    if (!TooltipManager.hasShown(tooltip.id)) {
      setCurrentTooltip(tooltip);
    }
  };

  const handleTooltipDismiss = () => {
    if (currentTooltip) {
      TooltipManager.markAsShown(currentTooltip.id);
    }
    setCurrentTooltip(null);
  };

  const handleChecklistItemComplete = (itemId: string) => {
    setEnhancementData((prev: any) => ({
      ...prev,
      checklistItems: [...(prev.checklistItems || []), itemId],
    }));
  };

  return (
    <>
      {/* 1. Trust & Safety Overlay */}
      {showTrustOverlay && (
        <TrustSafetyOverlay
          language={language}
          onDismiss={handleTrustOverlayComplete}
        />
      )}

      {/* 2. Progressive Permissions */}
      {currentPermission && (
        <ProgressivePermissions
          language={language}
          permission={currentPermission}
          onAllow={handlePermissionAllow}
          onDeny={handlePermissionDeny}
          onDismiss={handlePermissionDeny}
        />
      )}

      {/* 3. Micro Personalization */}
      {showPersonalization && (
        <MicroPersonalization
          language={language}
          onComplete={handlePersonalizationComplete}
        />
      )}

      {/* 4. Feature Tooltips */}
      {currentTooltip && (
        <FeatureTooltip
          language={language}
          tooltip={currentTooltip}
          onDismiss={handleTooltipDismiss}
        />
      )}

      {/* 5. First "Aha" Moment */}
      {showFirstAha && (
        <FirstAhaMoment
          language={language}
          role={userRole}
          onComplete={handleFirstAhaComplete}
        />
      )}

      {/* 6. Habit Formation Checklist */}
      {showHabitChecklist && (
        <HabitChecklist
          language={language}
          role={userRole}
          onItemComplete={handleChecklistItemComplete}
          onDismiss={() => setShowHabitChecklist(false)}
        />
      )}

      {/* 7. AI Guide */}
      {showAIGuide && (
        <AIGuide
          language={language}
          onClose={() => setShowAIGuide(false)}
        />
      )}
    </>
  );
}

// Export helper functions to trigger specific enhancements from app
const helpers = {
  requestLocationPermission: (language: 'sw' | 'en') => ({
    type: 'location' as PermissionType,
    reason:
      language === 'sw'
        ? 'Tunakuomba ruhusa hii ili kukusaidia kupata vituo vya afya vilivyo karibu nawe.'
        : 'We need this permission to help you find nearby health facilities.',
    benefit:
      language === 'sw'
        ? 'Utaweza kuona madaktari na vituo vya afya vilivyo karibu.'
        : 'You can see nearby doctors and health centers.',
    required: false,
  }),

  requestNotificationPermission: (language: 'sw' | 'en') => ({
    type: 'notifications' as PermissionType,
    reason:
      language === 'sw'
        ? 'Tunakuomba ruhusa hii ili kukukumbusha dawa na miadi yako.'
        : 'We need this permission to remind you about medications and appointments.',
    benefit:
      language === 'sw'
        ? 'Utapokea ukumbusho wa dawa na miadi yako kwa wakati.'
        : 'You will receive timely reminders for meds and appointments.',
    required: false,
  }),

  requestHealthDataPermission: (language: 'sw' | 'en') => ({
    type: 'health-data' as PermissionType,
    reason:
      language === 'sw'
        ? 'Tunakuomba ruhusa hii ili kukupa ushauri wa afya unaokufaa.'
        : 'We need this permission to provide personalized health advice.',
    benefit:
      language === 'sw'
        ? 'AI itakupa ushauri unaokufaa kulingana na hali yako.'
        : 'AI will provide advice tailored to your health condition.',
    required: false,
  }),

  createFeatureTooltip: (
    id: string,
    title: string,
    description: string,
    targetElement?: string,
    position?: 'top' | 'bottom' | 'left' | 'right'
  ): TooltipConfig => ({
    id,
    title,
    description,
    targetElement,
    position: position || 'bottom',
  }),
};

export const OnboardingEnhancementHelpers = helpers;