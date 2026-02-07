# Patient Portal System Flowchart

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                  │
│                    (Main Application)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AppContent Component                          │
│  Manages: Routes, User Role, Language, Splash, Onboarding       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
                  ┌────────┴────────┐
                  │   User Role?    │
                  └────────┬────────┘
                           │
        ┏━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━┓
        ▼                                  ▼
   ┌─────────┐                      ┌──────────┐
   │ Patient │                      │ Other    │
   │  Role   │                      │ Roles    │
   └────┬────┘                      └──────────┘
        │                            (CHW, Clinician, Admin)
        │
        ▼
┌────────────────────────────────────────────────────────────────┐
│              PatientPortalManager (ORCHESTRATOR)                │
│  • Manages all portal enhancement components                   │
│  • Tracks analytics (privacy-safe)                             │
│  • Monitors onboarding status                                  │
│  • Handles EHR sync status                                     │
│  • Shows privacy indicators                                    │
└────────────────────────┬───────────────────────────────────────┘
                         │
        ┏━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┓
        ▼                                ▼
┌──────────────────┐           ┌──────────────────┐
│  Always-On       │           │  On-Demand       │
│  Components      │           │  Components      │
└──────┬───────────┘           └────────┬─────────┘
       │                                 │
       │                                 │
       ▼                                 ▼
```

## 🔄 Always-On Components

These components are always rendered when a patient is logged in:

```
┌────────────────────────────────────────────────────┐
│         InAppGuidanceSystem                        │
│  🎯 Floating help button (bottom-right)           │
│  • Contextual tooltips                             │
│  • Task checklist                                  │
│  • Help center modal                               │
│  • Offline help database                           │
└────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│         NotificationSystem                         │
│  🔔 Floating notification bell (top-right)        │
│  • Multi-channel notifications                     │
│  • Priority levels                                 │
│  • Notification panel (slide-out)                  │
│  • Action buttons                                  │
└────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│         EHRSyncStatus                              │
│  ⚡ Sync status indicator (auto-hide)             │
│  • Synced / Syncing / Error states                │
│  • Human-friendly messages                         │
│  • Offline explanation                             │
└────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│         PrivacyIndicator                           │
│  🔒 Data protection messaging (first load)        │
│  • PDPA Tanzania compliance                        │
│  • Encryption reassurance                          │
│  • Auto-dismiss after 8s                           │
└────────────────────────────────────────────────────┘
```

## 📱 On-Demand Components

These components are triggered by user actions or system events:

```
┌────────────────────────────────────────────────────┐
│         PatientPortalHub                           │
│  🏥 Digital Receptionist                          │
│  Trigger: User taps portal access icon            │
│  • 7 quick action cards                            │
│  • Registration progress                           │
│  • Recent activity                                 │
│  • Upcoming appointments                           │
└────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│         DigitalPatientOnboarding                   │
│  📋 Guided Registration Flow                      │
│  Trigger: New patient OR incomplete registration   │
│  • 4-step progressive form                         │
│  • Auto-save every 1s                              │
│  • Visual progress bar                             │
│  • Celebration screen                              │
└────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│         SelfHelpCenter                             │
│  ❓ Self-Service Support                          │
│  Trigger: User taps help button                   │
│  • Searchable FAQ                                  │
│  • AI chatbot                                      │
│  • Category browsing                               │
│  • Feedback collection                             │
└────────────────────────────────────────────────────┘
```

## 🎬 User Journey Flows

### Flow 1: First-Time Patient Onboarding

```
START: Patient launches app
         │
         ▼
  ┌──────────────┐
  │ SplashScreen │
  └──────┬───────┘
         │
         ▼
  ┌──────────────────┐
  │ OnboardingOrch.  │  (Existing system)
  │ - Language       │
  │ - User type      │
  │ - Account setup  │
  └──────┬───────────┘
         │
         ▼
  ┌──────────────────┐
  │ PatientDashboard │
  └──────┬───────────┘
         │
         ▼
  ┌─────────────────────────────┐
  │ PatientPortalManager kicks in│
  └──────┬──────────────────────┘
         │
         ├─► PrivacyIndicator (8s display)
         │
         ├─► DigitalPatientOnboarding (auto-trigger after 2s)
         │         │
         │         ├─► Step 1: Personal Info
         │         ├─► Step 2: Medical History
         │         ├─► Step 3: Consent & Privacy
         │         └─► Step 4: Confirmation 🎉
         │
         ├─► InAppGuidanceSystem (tooltip: "Welcome to AfyaAI")
         │
         └─► NotificationSystem (bell appears)
         
END: Patient ready to use all features
```

### Flow 2: Returning Patient - Book Appointment

```
START: Patient opens app
         │
         ▼
  ┌──────────────────┐
  │ PatientDashboard │
  └──────┬───────────┘
         │
         ▼
  [Patient sees notification: "Your appointment tomorrow at 10AM"]
         │
         ▼
  [Patient taps "Appointments" card]
         │
         ▼
  ┌──────────────────┐
  │ Appointments     │  ← Step 1: Select date/time
  │ Screen           │  ← Step 2: Choose doctor
  └──────┬───────────┘  ← Step 3: Confirm
         │
         ▼
  [System tracks: portal_navigation → appointments]
         │
         ▼
  [Notification sent: "Appointment confirmed"]
         │
         ▼
  [InAppGuidanceSystem: "Tip completed! ✓"]
         
END: Appointment booked in ≤3 steps
```

### Flow 3: Patient Needs Help

```
START: Patient confused about NHIF
         │
         ▼
  [Patient taps floating help button 🎯]
         │
         ▼
  ┌──────────────────┐
  │ InAppGuidance    │
  │ Help Center      │
  └──────┬───────────┘
         │
         ├─► Search: "NHIF"
         │         │
         │         ▼
         │   [Shows FAQ: "Can I use NHIF?"]
         │         │
         │         ▼
         │   [Patient reads answer]
         │         │
         │         ▼
         │   [Thumbs up ✓]
         │
         ├─► OR: Tap "Ask AI Assistant"
         │         │
         │         ▼
         │   [Chat: "How do I add NHIF?"]
         │         │
         │         ▼
         │   [AI: "Go to Profile → Add NHIF Number"]
         │
         └─► OR: Tap "Contact Support"
                   │
                   ▼
              [Call button / Email button]
              [Emergency: 112]
         
END: Problem solved without calling clinic
```

### Flow 4: No-Show Prevention

```
START: Patient books appointment (7 days out)
         │
         ▼
  [System schedules notifications]
         │
         ├─► 24 hours before: In-app notification
         │         │
         │         └─► [Patient sees: "Appointment tomorrow 10AM"]
         │                  │
         │                  ├─► Tap "Reschedule" → Reschedule flow
         │                  ├─► Tap "Confirm" → Confirmation sent
         │                  └─► Ignore → SMS sent
         │
         ├─► 2 hours before: SMS sent
         │         │
         │         └─► [Patient confirms via SMS]
         │
         └─► If missed: CHW alert triggered
                   │
                   └─► [CHW calls patient]
                            │
                            └─► [Patient reschedules]
         
END: No-show prevented through multi-channel reminders
```

## 🗂️ Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    User Actions                      │
│  • Tap buttons                                       │
│  • Fill forms                                        │
│  • View pages                                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              PatientPortalManager                    │
│  • Tracks events                                     │
│  • Updates localStorage                              │
│  • Calls onPortalDataUpdate callback                 │
└──────────────────┬──────────────────────────────────┘
                   │
        ┏━━━━━━━━━┻━━━━━━━━━┓
        ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│ localStorage │    │  AppContext      │
│              │    │  (Global State)  │
│ • Guidance   │    │  • userRole      │
│ • Onboarding │    │  • language      │
│ • Analytics  │    │  • isOffline     │
│ • Feedback   │    │  • userData      │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       └────────┬────────────┘
                ▼
      [Ready for backend sync]
                │
                ▼
┌─────────────────────────────────────────────────────┐
│          Production Backend (Future)                 │
│  • EHR/DHIS2 Integration                             │
│  • SMS Gateway                                       │
│  • Analytics Dashboard                               │
│  • Content Management System                         │
└─────────────────────────────────────────────────────┘
```

## 🔐 Security & Privacy Flow

```
┌─────────────────────────────────────────────────────┐
│              User enters sensitive data              │
│  • Personal info                                     │
│  • Medical history                                   │
│  • Contact details                                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         Data Protection Layer (Client-side)          │
│  • HTTPS encryption                                  │
│  • localStorage (device-only)                        │
│  • No PII in analytics                               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Consent & Transparency                  │
│  • PrivacyIndicator shown on first use               │
│  • Consent captured in onboarding                    │
│  • "AI assists, not replaces" messaging              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│          Analytics (Privacy-Safe Only)               │
│  ✓ Event types (e.g., "portal_view")                │
│  ✓ Timestamps                                        │
│  ✓ Feature usage counts                              │
│  ✗ Personal information                              │
│  ✗ Medical data                                      │
│  ✗ Identifiable data                                 │
└─────────────────────────────────────────────────────┘
```

## 📊 Component Interaction Matrix

```
┌─────────────┬────────┬────────┬────────┬────────┬────────┐
│ Component   │ Portal │ Onbrd  │ Guide  │ Notify │ Help   │
├─────────────┼────────┼────────┼────────┼────────┼────────┤
│ Portal Hub  │   -    │  Opens │ Tracks │ Checks │   -    │
├─────────────┼────────┼────────┼────────┼────────┼────────┤
│ Onboarding  │ Closes │   -    │ Marks  │ Sends  │   -    │
├─────────────┼────────┼────────┼────────┼────────┼────────┤
│ Guidance    │ Opens  │ Links  │   -    │   -    │ Opens  │
├─────────────┼────────┼────────┼────────┼────────┼────────┤
│ Notify      │ Links  │ Links  │   -    │   -    │   -    │
├─────────────┼────────┼────────┼────────┼────────┼────────┤
│ Help        │   -    │ Links  │   -    │   -    │   -    │
└─────────────┴────────┴────────┴────────┴────────┴────────┘

Legend:
- Opens: Triggers the other component to open
- Closes: Closes the other component
- Links: Provides navigation link to other component
- Tracks: Records analytics about other component
- Checks: Reads state from other component
- Marks: Updates completion status in other component
- Sends: Creates notifications in other component
```

## 🎯 Success Metrics Dashboard (Conceptual)

```
┌─────────────────────────────────────────────────────┐
│           MoH Analytics Dashboard (Future)           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📈 Onboarding Completion: 85%  ↑ +15%             │
│  📉 No-Show Rate: 12%  ↓ -38%                       │
│  ⏱️  Avg. Time to Task: 2.3 steps  ↓ -0.7 steps    │
│  😊 User Satisfaction: 4.2/5  ↑ +0.8               │
│  📞 Support Call Volume: -40%  ↓                    │
│                                                      │
│  🎯 Top Friction Points:                            │
│    1. NHIF integration (23% drop-off)               │
│    2. Medical history form (18% incomplete)         │
│    3. Payment confusion (15% support calls)         │
│                                                      │
│  ✨ Most Used Features:                             │
│    1. Appointment booking (87% of users)            │
│    2. Lab results (62% of users)                    │
│    3. Self-help center (45% of users)               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 🔧 Technical Stack

```
┌─────────────────────────────────────────────────────┐
│                    Frontend Stack                    │
├─────────────────────────────────────────────────────┤
│  • React 18.3.1                                      │
│  • TypeScript                                        │
│  • Tailwind CSS v4                                   │
│  • Motion (Framer Motion) 12.23.24                  │
│  • Radix UI components                               │
│  • Lucide React icons                                │
│  • Vite 6.3.5                                        │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                  State Management                    │
├─────────────────────────────────────────────────────┤
│  • React Context (AppContext)                        │
│  • localStorage (offline-first)                      │
│  • Component-level state (useState)                  │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              Backend Integration (Ready)             │
├─────────────────────────────────────────────────────┤
│  • DHIS2 / OpenHIM (Tanzania MoH standard)          │
│  • SMS Gateway (notifications)                       │
│  • CMS (content management)                          │
│  • Analytics service                                 │
└─────────────────────────────────────────────────────┘
```

---

## 🎓 For Developers

### Adding a New Feature to Portal

1. Create component in `/src/app/components/`
2. Add to `PatientPortalManager.tsx` orchestration
3. Add translations (Kiswahili + English)
4. Add analytics tracking events
5. Test offline functionality
6. Update documentation

### Modifying Guidance Content

1. Edit `guidanceDatabase` in `InAppGuidanceSystem.tsx`
2. Add new guidance objects with:
   - `id`, `type`, `trigger`, `title`, `content`
   - `dismissable`, `priority`
3. Test tooltip positioning
4. Update help center if needed

### Customizing Notifications

1. Edit notification templates in `NotificationSystem.tsx`
2. Add new notification types
3. Configure priority levels
4. Set up multi-channel routing
5. Test SMS integration (production)

---

**Visual Flowchart Status**: ✅ Complete  
**Last Updated**: January 15, 2026
