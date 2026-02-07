# AfyaAI TZA — Onboarding Enhancement System

## Overview

This document describes the **add-on onboarding enhancement system** that layers on top of the existing AfyaAI TZA onboarding experience. These enhancements build immediate trust, deliver early value, and enable long-term habit formation while maintaining TMDA, PDPA, and ethical AI compliance.

## ✅ Implementation Status

All 9 enhancement workflows have been successfully implemented:

### 1️⃣ Trust & Safety Overlay ✓
**Component:** `TrustSafetyOverlay.tsx`
- Lightweight, non-blocking overlay shown on first launch
- Displays MoH + TMDA badges
- Swahili-first messaging: "AfyaAI inasaidia wataalamu wa afya. Haibadilishi daktari."
- Collapsible data privacy information
- Auto-dismisses after 15 seconds if user doesn't interact

**Usage:**
```tsx
<TrustSafetyOverlay
  language={language}
  onDismiss={() => setShowTrustOverlay(false)}
/>
```

### 2️⃣ Progressive Consent & Permissions ✓
**Component:** `ProgressivePermissions.tsx`
- Just-in-time permission requests (location, notifications, health data, camera)
- Context-specific microcopy explaining why permission is needed
- Shows clear benefit to the user
- PDPA compliant with informed consent

**Usage:**
```tsx
<ProgressivePermissions
  language={language}
  permission={{
    type: 'location',
    reason: 'Tunakuomba ruhusa hii ili kukusaidia kupata vituo vya afya...',
    benefit: 'Utaweza kuona madaktari na vituo vya afya vilivyo karibu.',
    required: false,
  }}
  onAllow={handleAllow}
  onDeny={handleDeny}
  onDismiss={handleDismiss}
/>
```

**Permission Types:**
- `location` - For finding nearby health facilities
- `notifications` - For medication/appointment reminders
- `health-data` - For personalized AI advice
- `camera` - For medical imaging/documents

### 3️⃣ Smart Role-Based Onboarding ✓
**Component:** `OnboardingEnhancementManager.tsx`
- Silent adaptive logic based on user role (Patient/CHW/Clinician)
- Automatically adjusts flow based on connectivity and language
- Users only see relevant content
- State machine manages onboarding stages

**Roles Supported:**
- **Patient:** Symptom checking, health tracking
- **CHW:** Patient registration, AI recommendations
- **Clinician:** AI triage review, workflow configuration

### 4️⃣ Micro Personalization ✓
**Component:** `MicroPersonalization.tsx`
- Max 5 questions, all skippable
- Adaptive questions based on user context
- No medical history required upfront
- Smooth animations with progress tracking

**Questions:**
1. "Nani unamhudumia zaidi?" (Who are you caring for?)
2. "Unapatikana wapi mara nyingi?" (Where are you located?)
3. "Ni jambo gani la afya unalolitaka zaidi?" (What health feature do you need?)

### 5️⃣ Interactive Feature Discovery ✓
**Component:** `FeatureTooltip.tsx`
- Contextual tooltips that appear on first feature use
- Non-blocking, auto-dismissible after 8 seconds
- LocalStorage-based tracking to show once
- No forced walkthroughs

**Tooltip Manager:**
```tsx
// Check if tooltip was shown
TooltipManager.hasShown('symptom-checker-intro');

// Mark as shown
TooltipManager.markAsShown('symptom-checker-intro');
```

### 6️⃣ First "Aha" Moment ✓
**Component:** `FirstAhaMoment.tsx`
- Role-specific quick wins within 60 seconds
- **Patient:** 2-question symptom check → AI reassurance
- **CHW:** Register patient → AI suggestion
- **Clinician:** View AI triage → Override option
- Positive reinforcement on completion

### 7️⃣ Habit Formation Layer ✓
**Component:** `HabitChecklist.tsx`
- Dismissible checklist on home screen
- Progress tracking with visual indicators
- Role-specific tasks
- Gentle reminders, no streak pressure
- Celebrates completion

**Patient Checklist:**
- ✓ Angalia dalili (Check symptoms)
- ✓ Weka kumbusho (Set reminders)
- ✓ Tafuta kituo (Find facility)
- ✓ Kamilisha wasifu (Complete profile)

**CHW Checklist:**
- ✓ Sajili mgonjwa (Register patient)
- ✓ Tumia AI (Use AI)
- ✓ Sync data (Sync to cloud)

**Clinician Checklist:**
- ✓ Pitia AI (Review AI)
- ✓ Weka mchakato (Setup workflow)
- ✓ Jaribu imaging (Test imaging)

### 8️⃣ Embedded AI Guide ✓
**Component:** `AIGuide.tsx`
- Humanized AI assistant named "AfyaAI"
- Introduces itself after onboarding, not during
- Minimizable floating widget
- Example questions for guidance
- **Always shows "Talk to a human" option**

**Capabilities:**
- Answer "How do I...?" questions
- Explain AI results
- Route to human healthcare workers

### 9️⃣ Feedback & Continuous Improvement ✓
**Component:** `MicroFeedback.tsx`
- Micro-feedback prompts after key actions
- Triggers:
  - After first successful action
  - After 7 days of use
  - After feature use
- Emoji-based responses (1-5 stars)
- Optional text comment
- Max 2 questions

## Architecture

### Onboarding Enhancement Manager

The `OnboardingEnhancementManager` orchestrates all enhancement components using a state machine:

```
trust-overlay → personalization → first-aha → feature-discovery → habit-formation → complete
```

**Integration in App.tsx:**
```tsx
<OnboardingEnhancementManager
  language={language}
  userRole={userRole}
  isFirstLaunch={isFirstLaunch}
  onEnhancementComplete={handleEnhancementComplete}
/>
```

### State Persistence

All enhancement states are stored in `localStorage`:
- `trust_overlay_shown` - Trust overlay shown
- `personalization_shown` - Personalization completed
- `first_aha_shown` - First aha moment completed
- `tooltip_shown_{id}` - Individual tooltips shown
- `permission_{type}` - Permission grants/denials
- `checklist_{role}` - Checklist progress
- `7day_feedback_shown` - 7-day feedback shown
- `ai_guide_shown` - AI guide introduced

### Helper Functions

**Permission Helpers:**
```tsx
import { OnboardingEnhancementHelpers } from '@/app/components/OnboardingEnhancementManager';

// Request location permission
const locationPerm = OnboardingEnhancementHelpers.requestLocationPermission(language);

// Request notification permission
const notifPerm = OnboardingEnhancementHelpers.requestNotificationPermission(language);

// Request health data permission
const healthPerm = OnboardingEnhancementHelpers.requestHealthDataPermission(language);
```

**Tooltip Helpers:**
```tsx
// Create a feature tooltip
const tooltip = OnboardingEnhancementHelpers.createFeatureTooltip(
  'symptom-checker-intro',
  'Angalia Dalili',
  'Uliza swali moja kwa wakati',
  '#symptom-checker-button',
  'bottom'
);
```

## Design Principles

✅ **Swahili-first, plain language**
✅ **Icons + text (low literacy friendly)**
✅ **Large touch targets**
✅ **Works offline-first**
✅ **Zero medical jargon**
✅ **Explain AI decisions ("Kwa nini?" links)**
✅ **Non-blocking, dismissible**
✅ **Progressive disclosure**
✅ **Celebrate small wins**

## Success Metrics

The system is designed to achieve:
- ⏱️ Time to first action < 60 seconds
- ✅ Onboarding completion > 85%
- 🧠 Consent comprehension > 80%
- 📉 Drop-off during onboarding < 20%
- ⭐ Trust score (post-onboarding) > 4/5

## Compliance

✅ **TMDA:** No automated diagnosis, clinician-in-the-loop
✅ **PDPA Tanzania:** Informed consent, data privacy disclosures
✅ **WHO Ethical AI:** Transparency, explainability, human oversight
✅ **Audit Trail:** All consent actions logged
✅ **Bias Reviews:** Supports monitoring and audits

## Customization

### Adding New Tooltips

1. Create tooltip config:
```tsx
const newTooltip = {
  id: 'new-feature-intro',
  title: 'Kipengele Kipya',
  description: 'Maelezo ya kipengele',
  targetElement: '#feature-button',
  position: 'bottom',
};
```

2. Show tooltip:
```tsx
showTooltip(newTooltip);
```

### Adding Checklist Items

Edit `HabitChecklist.tsx` translations:
```tsx
patient: [
  {
    id: 'new-task',
    title: 'Task Title',
    description: 'Task description',
    icon: '🎯',
  },
]
```

### Triggering Feedback

```tsx
setFeedbackTrigger('feature-use');
setShowFeedback(true);
```

## Animation & Motion

All components use `motion/react` for smooth animations:
- Fade in/out transitions
- Scale and spring animations
- Staggered list animations
- Progress bar animations

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Large touch targets (min 44x44px)

## Future Enhancements

Potential additions:
- 📱 SMS/USSD onboarding for feature phones
- 🌐 Offline queue for delayed permission requests
- 📊 Advanced analytics dashboard
- 🎮 Gamification elements (achievement badges)
- 🗣️ Voice-guided onboarding (Swahili)

## Testing Recommendations

1. **First Launch Flow:** Clear localStorage and test complete flow
2. **Role Switching:** Test all three roles (Patient, CHW, Clinician)
3. **Language Toggle:** Test Swahili ↔ English switching
4. **Offline Mode:** Test with network disconnected
5. **Low Literacy:** Test with users unfamiliar with smartphones
6. **7-Day Flow:** Manually set `first_use_date` to test feedback trigger

## Reset Onboarding (for Testing)

```javascript
// Clear all onboarding states
localStorage.removeItem('app_launched');
localStorage.removeItem('trust_overlay_shown');
localStorage.removeItem('personalization_shown');
localStorage.removeItem('first_aha_shown');
localStorage.removeItem('ai_guide_shown');
localStorage.removeItem('7day_feedback_shown');

// Clear checklist
localStorage.removeItem('checklist_patient');
localStorage.removeItem('checklist_chw');
localStorage.removeItem('checklist_clinician');

// Clear permissions
localStorage.removeItem('permission_location');
localStorage.removeItem('permission_notifications');
localStorage.removeItem('permission_health-data');
localStorage.removeItem('permission_camera');

// Reload app
window.location.reload();
```

---

**Built with ❤️ for Tanzania's healthcare transformation**

*AfyaAI inasaidia, sio badala ya daktari*
