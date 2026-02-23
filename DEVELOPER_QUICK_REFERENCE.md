# AfyaCare Tanzania - Developer Quick Reference

## 🚀 INSTANT IMPLEMENTATION GUIDE

This quick reference provides copy-paste code snippets for implementing all new features.

---

## 📚 TABLE OF CONTENTS

1. [Using Namespaced Translations](#1-using-namespaced-translations)
2. [Accessibility Features](#2-accessibility-features)
3. [Patient Journeys](#3-patient-journeys)
4. [Voice Assistant](#4-voice-assistant)
5. [Analytics Integration](#5-analytics-integration)

---

## 1. USING NAMESPACED TRANSLATIONS

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  // Load specific namespaces
  const { t } = useTranslation(['common', 'home', 'clinical']);
  
  return (
    <div>
      {/* Access translations with namespace prefix */}
      <h1>{t('home:greeting', { name: 'John' })}</h1>
      <p>{t('common:loading')}</p>
      <span>{t('clinical:risk_levels.high')}</span>
    </div>
  );
}
```

### Multiple Namespaces

```tsx
// Load multiple namespaces at once
const { t } = useTranslation([
  'common',      // General terms
  'auth',        // Authentication
  'home',        // Dashboard
  'assistant',   // Health assistant
  'clinical',    // Medical terms
  'validation',  // Form validation
  'errors',      // Error messages
  'notifications', // Alerts
  'messages',    // Messaging
  'profile',     // User profile
  'care'         // Care management
]);

// Use them
{t('common:app_name')}
{t('auth:login')}
{t('clinical:vital_signs.blood_pressure')}
```

### With Interpolation

```tsx
// Variables
{t('home:greeting', { name: userName })}

// Pluralization
{t('common:time.minutes', { count: 5 })}
// Returns: "5 minutes" (en) or "Dakika 5" (sw)

// Date formatting
{t('common:time.ago', { time: '2 hours' })}
```

### Outside React Components

```tsx
import i18n from '@/app/utils/i18n';

// In utility functions, services, etc.
const message = i18n.t('common:loading');
const errorMsg = i18n.t('errors:network.offline');
```

---

## 2. ACCESSIBILITY FEATURES

### Setup Provider (Once in App.tsx)

```tsx
import { AccessibilityProvider } from './utils/AccessibilitySystem';

export default function App() {
  return (
    <AccessibilityProvider>
      {/* Your app */}
    </AccessibilityProvider>
  );
}
```

### Using Accessibility Preferences

```tsx
import { useAccessibility } from './utils/AccessibilitySystem';

function MyComponent() {
  const { preferences, updatePreference } = useAccessibility();
  
  return (
    <div className={preferences.highContrast ? 'high-contrast' : ''}>
      <button onClick={() => updatePreference('fontSize', 'large')}>
        Larger Text
      </button>
      
      <button onClick={() => updatePreference('highContrast', !preferences.highContrast)}>
        Toggle Contrast
      </button>
      
      {/* Check if reduced motion is enabled */}
      {!preferences.reducedMotion && <AnimatedComponent />}
    </div>
  );
}
```

### Add Accessibility Settings Screen

```tsx
import { AccessibilitySettings } from './components/AccessibilitySettings';

function ProfileScreen() {
  return (
    <div>
      <h1>Profile</h1>
      {/* Other profile sections */}
      <AccessibilitySettings onBack={() => navigate('/')} />
    </div>
  );
}
```

### Keyboard Navigation Hook

```tsx
import { useKeyboardNavigation } from './utils/AccessibilitySystem';

function Modal({ onClose, onConfirm }) {
  useKeyboardNavigation(
    () => onConfirm(),     // Enter key
    () => onClose(),       // Escape key
    (direction) => {       // Arrow keys
      console.log(`Arrow ${direction} pressed`);
    }
  );
  
  return <div>Modal content</div>;
}
```

### Screen Reader Announcements

```tsx
import { useScreenReaderAnnouncement } from './utils/AccessibilitySystem';

function DataTable() {
  const announce = useScreenReaderAnnouncement();
  
  const handleSort = () => {
    // Sort data
    announce('Table sorted by date');
  };
  
  return <table>...</table>;
}
```

### Accessible Button

```tsx
import { AccessibleButton } from './utils/AccessibilitySystem';

function MyForm() {
  return (
    <AccessibleButton
      ariaLabel="Submit form"
      loading={isSubmitting}
      onClick={handleSubmit}
    >
      Submit
    </AccessibleButton>
  );
}
```

---

## 3. PATIENT JOURNEYS

### Basic Setup

```tsx
import { 
  usePatientJourneys, 
  PatientJourneyOrchestrator 
} from './components/PatientJourneyOrchestrator';

function Dashboard() {
  const { 
    journeys, 
    createJourney, 
    completeStep, 
    completeJourney 
  } = usePatientJourneys();
  
  return (
    <div>
      <PatientJourneyOrchestrator
        activeJourneys={journeys}
        onStepComplete={completeStep}
        onJourneyComplete={completeJourney}
        onNavigate={(route) => navigateTo(route)}
      />
    </div>
  );
}
```

### Create a Journey

```tsx
function SymptomChecker() {
  const { createJourney } = usePatientJourneys();
  
  const startJourney = () => {
    createJourney(
      'symptom-to-care',           // Journey type
      'Headache and Fever Care',   // Title
      [
        {
          id: 'assess',
          title: 'Assess Symptoms',
          description: 'Tell us about your symptoms',
          required: true,
          action: () => navigateTo('symptom-assessment')
        },
        {
          id: 'triage',
          title: 'Triage Assessment',
          description: 'We\'ll assess the urgency',
          required: true,
          action: () => navigateTo('triage')
        },
        {
          id: 'book',
          title: 'Book Appointment',
          description: 'Schedule with a doctor',
          required: false,
          action: () => navigateTo('appointments')
        }
      ]
    );
  };
  
  return <button onClick={startJourney}>Start Care Journey</button>;
}
```

### Journey Types

```typescript
// Available journey types:
'symptom-to-care'      // Symptom → Triage → Appointment
'medication-adherence' // Prescription → Reminders → Tracking
'test-follow-up'       // Test → Results → Follow-up
'maternal-care'        // Pregnancy tracking
'chronic-disease'      // Long-term management
'preventive-care'      // Screenings & vaccinations
```

---

## 4. VOICE ASSISTANT

### Basic Voice Input

```tsx
import { VoiceAssistant } from './components/VoiceAssistant';

function SymptomInput() {
  const handleTranscript = (text: string) => {
    console.log('User said:', text);
    // Process the symptom description
    processSymptoms(text);
  };
  
  return (
    <VoiceAssistant
      onTranscript={handleTranscript}
      language="sw"  // 'sw' or 'en'
      autoSpeak={true}
      onError={(error) => console.error(error)}
    />
  );
}
```

### Programmatic Text-to-Speech

```tsx
import { useVoiceAssistant } from './components/VoiceAssistant';

function Notification() {
  const { speak, stopSpeaking } = useVoiceAssistant('sw');
  
  const announceResult = () => {
    speak('Matokeo yako ya uchunguzi yameandaliwa');
  };
  
  const announceReminder = () => {
    speak('Wakati wa kutumia dawa yako');
  };
  
  return (
    <div>
      <button onClick={announceResult}>Announce Result</button>
      <button onClick={stopSpeaking}>Stop</button>
    </div>
  );
}
```

### Voice-Enabled Form

```tsx
function VoiceEnabledSymptomForm() {
  const [symptoms, setSymptoms] = useState('');
  
  return (
    <div>
      <textarea 
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Describe your symptoms..."
      />
      
      <VoiceAssistant
        onTranscript={(text) => setSymptoms(prev => prev + ' ' + text)}
        language="sw"
      />
      
      <button onClick={() => submitSymptoms(symptoms)}>
        Submit
      </button>
    </div>
  );
}
```

---

## 5. ANALYTICS INTEGRATION

### Display Analytics Dashboard

```tsx
import { EnhancedAnalyticsDashboard } from './components/EnhancedAnalyticsDashboard';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <EnhancedAnalyticsDashboard
        language="en"
        onBack={() => navigateTo('/')}
      />
    </div>
  );
}
```

### Track Custom Events

```tsx
import { 
  trackFeatureUsage, 
  trackPageView,
  trackDisclaimerAcceptance 
} from './utils/monitoring';

function MyComponent() {
  useEffect(() => {
    // Track page view
    trackPageView('symptom-checker');
  }, []);
  
  const handleFeatureUse = () => {
    // Track feature usage
    trackFeatureUsage('voice-assistant', {
      language: 'sw',
      duration: 45
    });
  };
  
  const handleDisclaimerAccept = () => {
    trackDisclaimerAcceptance('symptom-checker', true);
  };
  
  return <div>...</div>;
}
```

---

## 🎯 COMMON PATTERNS

### Pattern 1: Multilingual Component

```tsx
function PatientCard({ patient }) {
  const { t, i18n } = useTranslation(['common', 'clinical']);
  
  return (
    <Card>
      <h3>{patient.name}</h3>
      <div>
        <span>{t('clinical:vital_signs.blood_pressure')}: </span>
        <span>{patient.bloodPressure}</span>
      </div>
      <Button onClick={() => i18n.changeLanguage(i18n.language === 'sw' ? 'en' : 'sw')}>
        {t('common:switch_language')}
      </Button>
    </Card>
  );
}
```

### Pattern 2: Accessible Form with Validation

```tsx
function AccessibleLoginForm() {
  const { t } = useTranslation(['auth', 'validation', 'errors']);
  const { preferences } = useAccessibility();
  
  return (
    <form className={preferences.largeTouch ? 'large-touch' : ''}>
      <Label htmlFor="phone" className="required">
        {t('auth:phone_number')}
      </Label>
      <Input
        id="phone"
        type="tel"
        aria-invalid={hasError}
        aria-describedby="phone-error"
        className={preferences.highContrast ? 'high-contrast' : ''}
      />
      {hasError && (
        <div id="phone-error" className="error-message" role="alert">
          {t('validation:phone.invalid')}
        </div>
      )}
    </form>
  );
}
```

### Pattern 3: Voice-Enabled Symptom Checker

```tsx
function SmartSymptomChecker() {
  const { t } = useTranslation(['assistant', 'clinical']);
  const { speak } = useVoiceAssistant('sw');
  const [symptoms, setSymptoms] = useState('');
  
  const handleVoiceInput = (text: string) => {
    setSymptoms(text);
    // Acknowledge receipt
    speak(t('assistant:thinking'));
    
    // Process symptoms
    analyzeSymptoms(text).then(result => {
      speak(t('clinical:urgency.urgent'));
    });
  };
  
  return (
    <div>
      <h2>{t('assistant:title')}</h2>
      <VoiceAssistant
        onTranscript={handleVoiceInput}
        language="sw"
      />
    </div>
  );
}
```

### Pattern 4: Journey-Based Appointment Booking

```tsx
function AppointmentBooking() {
  const { createJourney } = usePatientJourneys();
  const { t } = useTranslation(['care', 'notifications']);
  
  const bookAppointment = (symptoms: string) => {
    const journeyId = createJourney(
      'symptom-to-care',
      t('care:appointments.book_new'),
      [
        {
          id: 'symptoms',
          title: t('clinical:symptoms.title'),
          description: t('clinical:symptoms.description'),
          required: true,
          action: () => {}
        },
        {
          id: 'schedule',
          title: t('care:appointments.schedule'),
          description: t('care:appointments.select_time'),
          required: true,
          action: () => navigateTo('schedule')
        }
      ]
    );
    
    return journeyId;
  };
  
  return <button onClick={() => bookAppointment('')}>Book</button>;
}
```

---

## 🔥 PRO TIPS

### 1. Lazy Load Namespaces

```tsx
// Only load namespaces when needed
const { t, ready } = useTranslation(['common'], { useSuspense: false });

useEffect(() => {
  if (showAdvanced) {
    i18n.loadNamespaces(['clinical', 'assistant']);
  }
}, [showAdvanced]);
```

### 2. Combine Accessibility Features

```tsx
function MaxAccessibleComponent() {
  const { preferences } = useAccessibility();
  const { speak } = useVoiceAssistant();
  const announce = useScreenReaderAnnouncement();
  
  const handleAction = () => {
    // Visual feedback
    setSuccess(true);
    
    // Audio feedback
    if (preferences.screenReaderMode) {
      announce('Action completed successfully');
    }
    
    // Voice feedback
    speak('Imefanikiwa');
  };
  
  return (
    <AccessibleButton
      ariaLabel="Complete action"
      onClick={handleAction}
      className={`
        ${preferences.highContrast ? 'high-contrast' : ''}
        ${preferences.largeTouch ? 'large-touch' : ''}
      `}
    >
      Complete
    </AccessibleButton>
  );
}
```

### 3. Journey Persistence

```tsx
// Save journey state to localStorage
const { journeys } = usePatientJourneys();

useEffect(() => {
  localStorage.setItem('active-journeys', JSON.stringify(journeys));
}, [journeys]);

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('active-journeys');
  if (saved) {
    // Restore journeys
  }
}, []);
```

---

## 📞 SUPPORT

For issues or questions:
- Check `/COMPLETE_ENHANCEMENTS_IMPLEMENTATION.md` for detailed documentation
- Review component source code in `/src/app/components/`
- Test with `/src/app/components/I18nTestComponent.tsx`

---

**Last Updated:** February 23, 2026
**Version:** 1.0
