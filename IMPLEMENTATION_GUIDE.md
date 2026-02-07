# AfyaAI TZA - Production Implementation Guide
## Complete Screen Specifications & Acceptance Criteria

**Date:** February 7, 2026  
**Status:** ✅ **READY FOR ENGINEERING HANDOFF**  
**Target:** Tanzania National Healthcare Deployment

---

## 📋 TABLE OF CONTENTS

1. [Screen Specifications](#screen-specifications)
2. [Acceptance Criteria](#acceptance-criteria)
3. [Role-Based Variants](#role-based-variants)
4. [Usability Test Scripts](#usability-test-scripts)
5. [Technical Requirements](#technical-requirements)
6. [Quality Assurance](#quality-assurance)

---

## 1️⃣ SCREEN SPECIFICATIONS

### **HOME SCREEN** - "Care at a Glance"
**File:** `/src/app/components/ModernHomeRedesigned.tsx`  
**Status:** ✅ Complete

#### Purpose:
Immediate orientation + next action for any user, any literacy level.

#### Layout Structure:
```
[Top Status Bar]
├─ Connectivity: Online/Offline indicator
└─ Emergency: Fixed button (top-right, always visible)

[Header]
├─ Greeting: "Hello, [Name]"
├─ Tagline: "What do you need help with today?"
└─ AfyaID: Federated patient ID with info button

[Priority Alerts]
├─ Next Appointment (if upcoming <24h)
├─ Medication Reminder (if due today)
└─ Pregnancy Alert (if applicable)

[Primary Actions] (4 cards)
├─ I Have Symptoms (offline indicator if available)
├─ My Care (care journeys)
├─ Ask Questions (no AI branding)
└─ Messages (unread count badge)

[Quick Actions] (2x2 grid)
├─ Book Appointment
├─ Health Records
├─ Medications
└─ Find Clinic

[Health Tip]
└─ Daily rotating educational content

[Footer Navigation]
Home | Care | Assistant | Messages | Profile
```

#### Acceptance Criteria:
- [ ] **Emergency button** visible <1 second after load
- [ ] **Works offline** - All cached actions functional
- [ ] **No AI branding** - "Ask Questions" not "AI Assistant"
- [ ] **AfyaID visible** - Federated ID displayed prominently
- [ ] **Connectivity clear** - Banner shows online/offline state
- [ ] **Priority sorting** - Most urgent information at top
- [ ] **Max 5 actions** visible without scrolling
- [ ] **Touch targets** ≥44px (mobile accessibility)
- [ ] **Load time** <2s on 3G
- [ ] **Motion** all transitions <300ms

#### Content Requirements:
- **Kiswahili default** - English as secondary
- **5th grade reading level** - Plain language only
- **Icon + text** - Never icon alone
- **High contrast** - WCAG AA minimum
- **No medical jargon** - Explain in simple terms

#### Offline Functionality:
- ✅ View cached health records
- ✅ Access symptom checker (basic)
- ✅ View medication list
- ✅ View appointment details
- ✅ See nearby clinics (cached)
- ❌ Book new appointment (queued)
- ❌ Send messages (queued)

---

### **CARE SCREEN** - "My Health Timeline"
**File:** `/src/app/components/CareTimelineRedesigned.tsx`  
**Status:** ✅ Complete

#### Purpose:
Continuity of care across multiple hospitals & clinics (federated records).

#### Layout Structure:
```
[Emergency Button]
└─ Fixed top-right, always visible

[Header]
├─ Back button
├─ Title: "My Health History"
└─ Subtitle: "Your records from all healthcare facilities"

[Patient Summary Card]
├─ Name, Age, AfyaID
├─ Blood Type (if known)
├─ Pregnancy Week (if applicable)
├─ Allergies (color-coded badges)
├─ Chronic Conditions
└─ Current Medications

[Actions]
├─ Share Records (consent-based)
└─ Upload Document (photo/PDF)

[Timeline Filters]
All | Visits | Medications | Tests | Pregnancy

[Timeline Items] (chronological, newest first)
Each item shows:
├─ Type icon (color-coded)
├─ Date
├─ Facility name + location
├─ Plain language summary
└─ Tap to view details

[Offline Indicator]
└─ "Cached records - will sync when online"
```

#### Acceptance Criteria:
- [ ] **Timeline loads** <2s
- [ ] **Plain language** - No medical codes visible to patient
- [ ] **Cross-facility** - Records from multiple facilities shown
- [ ] **Consent required** - Explicit consent before sharing
- [ ] **Facility attribution** - Clear source for each record
- [ ] **Offline access** - Cached records viewable
- [ ] **Upload capable** - Photo/PDF document upload
- [ ] **Filterable** - By type (visit, med, test, pregnancy)
- [ ] **Searchable** - Free text search (online only)
- [ ] **AfyaID prominent** - User understands it's universal

#### Data Structure:
```typescript
interface HealthRecord {
  id: string;
  date: string;
  type: 'visit' | 'medication' | 'diagnostic' | 'pregnancy';
  facility: string;
  facilityLocation: string;
  summary: string; // Plain language
  clinicalDetails?: string; // Hidden from patient
  urgent?: boolean;
  documents?: string[];
}
```

#### Sharing Consent Flow:
1. User taps "Share Records"
2. Modal asks: "Which facility?"
3. Modal asks: "What to share?" (All | Recent | Specific)
4. User confirms
5. Time-limited access granted (e.g., 30 days)
6. User can revoke anytime

#### Security:
- **End-to-end encryption** for record transfers
- **Audit trail** - Log all access
- **Consent expiry** - Time-limited sharing
- **Revocable** - User can revoke anytime
- **PDPA compliant** - Tanzania data protection

---

### **ASSISTANT SCREEN** - "Guided Care" (NO BOT FEEL)
**File:** `/src/app/components/HealthAssistantRedesigned.tsx`  
**Status:** ✅ Complete

#### Purpose:
Safe triage & guidance without feeling automated.

#### Layout Structure:
```
[Emergency Button]
└─ Fixed top-right, always visible

[Header]
├─ Back button
├─ Title: "Health Guidance"
└─ Progress indicator (1 of 3)

[Clinical Disclaimer]
"This is guidance only. A healthcare professional makes the final clinical decision."

[Question Area]
├─ Question text (large, clear)
└─ Explanation box (Why we need to know this)

[Answer Options] (large touch targets)
├─ Option 1
├─ Option 2
├─ Option 3
└─ Option 4 (if needed)

[Always-Visible Escalation]
├─ Talk to Health Worker
└─ Find Clinic

[Footer]
"This guidance is not a diagnosis."
```

#### Acceptance Criteria:
- [ ] **One question per screen** - No scrolling
- [ ] **Explanation visible** - "Why we ask" always shown
- [ ] **Emergency override** - Immediate exit for red flags
- [ ] **Escalation <2 taps** - "Talk to worker" always visible
- [ ] **No bot personality** - Neutral, clinical tone
- [ ] **No diagnosis claims** - Clear disclaimer every screen
- [ ] **No AI language** - No "I think" or "I believe"
- [ ] **Red flag detection** - Immediate emergency screen
- [ ] **Offline capable** - Basic triage cached
- [ ] **Pregnancy-safe** - Different paths if pregnant
- [ ] **Child-specific** - Age-appropriate questions
- [ ] **Caregiver mode** - Can answer for dependent

#### Red Flag Symptoms (Immediate Emergency):
- Severe difficulty breathing
- Chest pain (especially left arm)
- Sudden severe headache
- Unconsciousness or fainting
- Heavy bleeding
- Severe abdominal pain in pregnancy
- Child unresponsive or very high fever (>40°C)
- Major accident/trauma

#### Question Flow Example:
```
1. "What kind of help do you need?"
   └─ Symptoms | Medication | Pregnancy | Child | General

2. "How are you feeling?"
   └─ Fever | Cough | Headache | Stomach | Other

3. "How long have you had a fever?"
   └─ 1 day | 2-3 days | 4+ days

→ GUIDANCE: Urgency + Recommendation + Next Steps
```

#### Guidance Output:
```
[Urgency Badge]
Emergency | Urgent | Routine

[Recommendation]
Plain language advice

[Next Steps] (numbered list)
1. Immediate action
2. Follow-up action
3. When to return

[Action Buttons]
├─ Book Appointment
├─ Talk to Worker
└─ Find Clinic
```

#### NO Bot Feel Rules:
❌ "I think you might have..."  
❌ "Let me check..."  
❌ "I'm analyzing..."  
❌ Conversational chitchat  
❌ Personality traits  

✅ "Based on your answers..."  
✅ "You may want to..."  
✅ "Next, we need to know..."  
✅ Direct, clinical language  
✅ Actionable guidance  

---

### **MESSAGES SCREEN** - "Trusted Communication"
**File:** `/src/app/components/MessagesHubRedesigned.tsx`  
**Status:** 🟡 To be implemented

#### Purpose:
Official, traceable communication with care team.

#### Layout Structure:
```
[Emergency Button]
└─ Fixed top-right, always visible

[Header]
├─ Title: "Messages"
└─ Filter: All | Appointments | Medications | Follow-ups

[Emergency Messages] (pinned top)
└─ Red banner, always visible if present

[Message List]
Each message shows:
├─ Sender identity (Clinic name + role)
├─ Category badge (Appointment | Medication | Follow-up)
├─ Subject line
├─ Timestamp
├─ Read/Unread indicator
└─ SMS fallback icon (if via SMS)

[Empty State]
"No messages yet. Your care team will contact you here."

[New Message Button]
└─ Floating action button (bottom-right)
```

#### Acceptance Criteria:
- [ ] **Clear sender** - Clinic name + role visible
- [ ] **Category badges** - Appointment | Med | Follow-up
- [ ] **Emergency pinned** - Red messages at top
- [ ] **Read/unread** - Clear visual distinction
- [ ] **Offline queueing** - Messages queue when offline
- [ ] **SMS fallback** - Indicator if sent via SMS
- [ ] **No chat ambiguity** - Official communication only
- [ ] **Reply capability** - Can reply to care team
- [ ] **Attachment support** - Photos, PDFs
- [ ] **Translation** - Auto-translate Swahili ↔ English

#### Message Types:
1. **Appointment** - Booking confirmation, reminders, changes
2. **Medication** - Prescription, refill reminders, instructions
3. **Follow-up** - Test results, care instructions, next steps
4. **Emergency** - Urgent communications (pinned, red)
5. **Administrative** - General facility communications

#### Security:
- **End-to-end encryption** for messages
- **Audit trail** - All messages logged
- **Verified senders** - Only authenticated care team can send
- **No patient-to-patient** - Only patient ↔ care team
- **PDPA compliant** - Data protection standards

---

### **PROFILE SCREEN** - "Control & Privacy"
**File:** `/src/app/components/ProfileScreenRedesigned.tsx`  
**Status:** 🟡 To be implemented

#### Purpose:
User dignity, data control, safe on shared devices.

#### Layout Structure:
```
[Header]
├─ Profile photo (optional)
├─ Name
└─ Role badge (Patient | Caregiver)

[AfyaID Card]
├─ ID number (large, copyable)
├─ QR code (for facility check-in)
└─ Info button (explains federated system)

[Personal Information]
├─ Name
├─ Date of birth
├─ Gender
├─ Phone
└─ Email (optional)

[Health Basics]
├─ Blood type
├─ Allergies
├─ Chronic conditions
└─ Emergency contacts

[My Care Network]
├─ Linked facilities
├─ Assigned CHW (if applicable)
└─ Primary clinic

[Dependents] (if caregiver)
├─ Child 1
├─ Child 2
└─ Add dependent

[Privacy & Data]
├─ Consent history
├─ Data sharing permissions
├─ Access log (who viewed my records)
└─ Export all data (PDPA)

[Settings]
├─ Language (Kiswahili | English)
├─ Notifications (on/off per type)
├─ Accessibility (font size, high contrast)
└─ Offline mode (manual sync control)

[Security]
├─ Change PIN
├─ Enable biometric
├─ Auto-lock timer
└─ Device management

[Logout]
└─ Red button, clear consequences
```

#### Acceptance Criteria:
- [ ] **AfyaID prominent** - Large, copyable, QR code
- [ ] **Device security** - PIN/biometric lock
- [ ] **Auto-lock** - After 2 min inactivity
- [ ] **Quick logout** - <2 taps
- [ ] **Dependent profiles** - Manage family
- [ ] **Caregiver permissions** - Time-limited delegation
- [ ] **Access log** - View who accessed records
- [ ] **Data export** - Download all data (PDPA)
- [ ] **Clear consequences** - Logout explains what happens
- [ ] **Language toggle** - Immediate effect
- [ ] **Notification control** - Per-type settings
- [ ] **Accessibility** - Font size, contrast, voice

#### Logout Flow:
1. User taps "Log Out"
2. Modal asks: "Are you sure?"
3. Modal explains:
   - "You will need to log in again"
   - "Your offline data will remain safe"
   - "Emergency information stays accessible"
4. Options:
   - "Clear local data" (if shared device)
   - "Keep offline data" (if personal device)
5. Confirm logout

#### Caregiver Permissions:
- **Add dependent** - Child, elderly parent
- **Time-limited** - Can set expiry (e.g., 30 days)
- **Scope-limited** - Choose what they can see/do
- **Revocable** - Cancel anytime
- **Audit trail** - Log all caregiver actions

---

## 2️⃣ ACCEPTANCE CRITERIA

### **Global Requirements (ALL SCREENS)**

#### Functionality:
- [ ] Works with poor internet (<1 Mbps)
- [ ] Emergency button visible <1 second
- [ ] No hidden claims (MoH certified, TMDA approved)
- [ ] No AI labels or confidence scores
- [ ] Actions reachable in ≤3 taps
- [ ] Load time <3s on 3G
- [ ] Offline core features functional

#### Design:
- [ ] Text readable by older adults (16px min)
- [ ] High contrast (WCAG AA minimum)
- [ ] Icon + text (never icon alone)
- [ ] Touch targets ≥44px
- [ ] No decorative icons or animations
- [ ] Motion <300ms max
- [ ] Reduced motion support

#### Content:
- [ ] Kiswahili default, English secondary
- [ ] 5th grade reading level
- [ ] No medical jargon
- [ ] Clinical disclaimers visible
- [ ] Emergency info accessible without login

#### Security:
- [ ] End-to-end encryption for records
- [ ] Audit trail for data access
- [ ] PIN/biometric device lock
- [ ] Auto-lock after 2 min inactivity
- [ ] PDPA compliant (Tanzania)

---

### **Home Screen** Specific:
- [ ] Emergency button loads first
- [ ] AfyaID visible without scroll
- [ ] Next appointment shown if <24h
- [ ] Offline banner if disconnected
- [ ] Max 5 primary actions
- [ ] Health tip rotates daily
- [ ] Caregiver switch (if applicable)
- [ ] CHW quick access (role-based)

---

### **Care Screen** Specific:
- [ ] Timeline chronological (newest first)
- [ ] Plain language summaries only
- [ ] Facility name + location visible
- [ ] Consent required before share
- [ ] Upload photo/PDF capability
- [ ] Filter by type functional
- [ ] Offline records cached
- [ ] Sync indicator visible

---

### **Assistant Screen** Specific:
- [ ] One question per screen
- [ ] Explanation always visible
- [ ] Red flag → emergency screen
- [ ] No bot personality
- [ ] No diagnosis claims
- [ ] Escalation <2 taps away
- [ ] Pregnancy-safe paths
- [ ] Child-specific flows
- [ ] Caregiver answering mode
- [ ] Clinical disclaimer every screen

---

### **Messages Screen** Specific:
- [ ] Clear sender identity
- [ ] Category badges visible
- [ ] Emergency messages pinned
- [ ] Read/unread distinction
- [ ] SMS fallback indicator
- [ ] Offline queueing works
- [ ] Reply capability
- [ ] Attachment support (photo/PDF)

---

### **Profile Screen** Specific:
- [ ] AfyaID large + QR code
- [ ] PIN/biometric lock
- [ ] Auto-lock functional
- [ ] Quick logout (<2 taps)
- [ ] Dependent profiles supported
- [ ] Access log viewable
- [ ] Data export (PDPA)
- [ ] Language toggle immediate
- [ ] Notification settings per-type

---

## 3️⃣ ROLE-BASED VARIANTS

### **👤 PATIENT** (Default Experience)
**Target Users:** General public, individual patients  
**Characteristics:**
- Simplified language
- No clinical codes
- Focus on next steps
- Health tips and education
- Appointment booking
- Medication reminders

**Home Screen Differences:**
- Shows "I Have Symptoms" prominently
- Displays upcoming appointments
- Medication reminders
- Health tips visible

**Care Screen Differences:**
- Plain language summaries only
- Clinical details hidden by default
- Share records requires consent

**Messages Differences:**
- Can only message care team
- No access to facility communications

---

### **👨‍👩‍👧 CAREGIVER** (Managing Family)
**Target Users:** Parents, adult children caring for elderly, guardians  
**Characteristics:**
- Manage multiple profiles
- Switch between dependents quickly
- Medication reporting for others
- Appointment scheduling for family
- Proxy answering in Assistant

**Home Screen Differences:**
- Profile switcher at top
- Shows all dependents' appointments
- Medication reminders for all profiles
- Quick actions for each dependent

**Care Screen Differences:**
- View records for all dependents
- Upload documents for others
- Share records on behalf of dependent (with consent)

**Assistant Differences:**
- "Answering for" mode
- Age-appropriate questions for children
- Caregiver-specific guidance

**Profile Differences:**
- Dependent management section
- Permission settings per dependent
- Access expiry dates
- Audit trail of caregiver actions

---

### **🧑🏽‍⚕️ CHW** (Community Health Worker)
**Target Users:** Field workers, village health workers  
**Characteristics:**
- Assigned household list
- Offline-first workflow
- Missed visit alerts
- Basic stock management
- Referral capability

**Home Screen Differences:**
- "My Households" section
- Missed visit alerts
- Stock level warnings
- Daily task list
- Offline sync status

**Care Screen Differences:**
- View patient records (with consent)
- Add visit notes
- Upload photos (wound care, etc.)
- Referral system to facilities

**Messages Differences:**
- Communicate with patients
- Coordinate with facility staff
- Group messages for health campaigns

**CHW Dashboard** (Separate):
```
[Daily Tasks]
├─ Visits scheduled
├─ Follow-ups needed
└─ Referrals to check

[My Households]
├─ List view (scrollable)
├─ Filter: Due visits | All | Pregnant | Children
└─ Tap to view household details

[Stock Management]
├─ Medication inventory
├─ Low stock warnings
└─ Request resupply

[Reports]
├─ Weekly summary (auto-generated)
└─ Submit to supervisor

[Offline Status]
└─ Data pending sync (badge count)
```

---

### **🏥 CLINIC STAFF** (Nurse, Receptionist)
**Target Users:** Facility front desk, triage nurses  
**Characteristics:**
- Patient intake
- Queue management
- Record lookup (AfyaID)
- Appointment check-in
- Risk flag visibility

**Home Screen Differences:**
- Search patient by AfyaID
- Today's appointment list
- Check-in patients (QR scan)
- Queue management
- Emergency alerts

**Care Screen Differences:**
- Full clinical details visible
- Add clinical notes
- Update diagnoses
- Prescribe medications
- Order diagnostics

**Intake Dashboard:**
```
[Search Patient]
├─ AfyaID number input
├─ QR code scan
└─ Name search

[Patient Summary]
├─ Name, age, AfyaID
├─ Allergies (prominent)
├─ Chronic conditions
├─ Risk flags (pregnancy, child, elderly)
└─ Recent visits (last 3)

[Quick Actions]
├─ Check-in
├─ Start visit
├─ View full records
└─ Send message

[Today's Queue]
├─ Waiting (count)
├─ In progress (count)
└─ Completed (count)
```

---

### **🏛 ADMIN / GOVERNMENT** (MoH Dashboard)
**Target Users:** Ministry of Health officials, policy makers  
**Characteristics:**
- Aggregated insights only
- No patient-identifiable data
- Facility performance
- Disease surveillance
- Stock levels national view

**Dashboard:**
```
[National Overview]
├─ Registered patients (count)
├─ Facilities active (count)
├─ CHWs active (count)
└─ Visits last 30 days

[Disease Surveillance]
├─ Malaria cases (trending)
├─ TB screening (completion rate)
├─ Maternal health (ANC attendance)
└─ Child health (vaccination coverage)

[Facility Performance]
├─ Average wait time
├─ Appointment no-show rate
├─ Patient satisfaction
└─ Stock-out incidents

[Geographic View]
└─ Map with regional metrics

[Alerts]
├─ Disease outbreak indicators
├─ Stock shortages (critical)
└─ System issues
```

**Privacy Rules:**
- ❌ No patient names
- ❌ No individual records
- ❌ No facility-level patient lists
- ✅ Aggregated data only
- ✅ De-identified insights
- ✅ Regional comparisons

---

## 4️⃣ USABILITY TEST SCRIPTS

### **TEST SETUP**

**Test Groups:**
1. Rural patient (feature phone / shared smartphone)
2. Urban patient (smartphone)
3. Pregnant woman
4. CHW (community health worker)
5. Clinic nurse

**Test Environment:**
- Real devices (mix of Android versions)
- 2G/3G network simulation
- Offline mode testing
- Kiswahili interface primary
- Age range: 18-65

**Success Metrics:**
- Task completion rate: >80%
- Time to complete: <target time
- Errors: <2 per task
- User satisfaction: >4/5

---

### **TASK SET 1: FIND CARE**

**Scenario:**
"You feel unwell. Show me how you would get help."

**Success Criteria:**
✅ User reaches guidance or clinic in ≤3 steps  
✅ No hesitation >5 seconds  
✅ No backtracking  

**Test Steps:**
1. Hand device to participant (on Home screen)
2. Read scenario
3. Ask: "What would you do?"
4. Observe without help
5. Record: Steps taken, time, errors

**Observe:**
- [ ] Did they see "I Have Symptoms"?
- [ ] Did they understand the icons?
- [ ] Did they find emergency button?
- [ ] Did they see "Talk to Health Worker"?
- [ ] Could they find nearest clinic?

**Pass/Fail:**
- **Pass:** Reached guidance in ≤3 taps, <30 seconds
- **Fail:** Got lost, >3 taps, or asked for help

---

### **TASK SET 2: CHANGE FACILITY**

**Scenario:**
"You moved to another town. Show how a new clinic can see your history."

**Success Criteria:**
✅ User finds care summary  
✅ Understands consent clearly  
✅ Completes sharing flow  

**Test Steps:**
1. Start on Home screen
2. Read scenario
3. Ask: "Show me how you would share your records"
4. Observe sharing consent flow
5. Record: Understanding, consent clarity

**Observe:**
- [ ] Did they find "Care" screen?
- [ ] Did they see "Share Records"?
- [ ] Did they understand consent options?
- [ ] Could they choose what to share?
- [ ] Did they understand time limit?

**Pass/Fail:**
- **Pass:** Found sharing, understood consent, completed
- **Fail:** Couldn't find, or unclear on consent

---

### **TASK SET 3: MEDICATION REPORTING**

**Scenario:**
"Your relative took their medication. Show how you record this."

**Success Criteria:**
✅ Proxy reporting found without help  
✅ Medication list accessible  
✅ Check-off mechanism clear  

**Test Steps:**
1. Start on Home screen
2. Read scenario
3. Ask: "How would you mark that they took it?"
4. Observe caregiver mode awareness
5. Record: Profile switching, reporting

**Observe:**
- [ ] Did they understand proxy reporting?
- [ ] Did they find dependent profile?
- [ ] Could they switch profiles?
- [ ] Did they find medication list?
- [ ] Could they check off medication?

**Pass/Fail:**
- **Pass:** Found dependent profile, marked medication
- **Fail:** Couldn't find or thought had to log in as dependent

---

### **TASK SET 4: EMERGENCY**

**Scenario:**
"A child has trouble breathing."

**Success Criteria:**
✅ Emergency action found in ≤2 seconds  
✅ No scrolling required  
✅ One-tap call possible  

**Test Steps:**
1. Start on ANY screen (random)
2. Read scenario with urgency
3. Ask: "QUICK - what do you do?"
4. Observe immediate action
5. Record: Time to find emergency, understanding

**Observe:**
- [ ] Did they see emergency button immediately?
- [ ] Was it on current screen (no navigation)?
- [ ] Could they tap to call?
- [ ] Did they understand it's 112?
- [ ] Did they see danger signs?

**Pass/Fail:**
- **Pass:** Found emergency button in <2 seconds, one tap
- **Fail:** Had to search, scroll, or navigate

---

### **TEST RESULTS TEMPLATE**

```
PARTICIPANT: [ID]
GROUP: [Rural Patient | Urban | Pregnant | CHW | Nurse]
DEVICE: [Model]
LANGUAGE: [Kiswahili | English]
AGE: [Years]

TASK 1: Find Care
Time: [Seconds]
Steps: [Count]
Errors: [Count]
Success: [YES | NO]
Notes: [Observations]

TASK 2: Change Facility
Time: [Seconds]
Steps: [Count]
Consent understood: [YES | NO]
Success: [YES | NO]
Notes: [Observations]

TASK 3: Medication Reporting
Time: [Seconds]
Proxy understood: [YES | NO]
Profile switch: [YES | NO]
Success: [YES | NO]
Notes: [Observations]

TASK 4: Emergency
Time: [Seconds]
Found button: [YES | NO]
Understood action: [YES | NO]
Success: [YES | NO]
Notes: [Observations]

OVERALL SATISFACTION: [1-5]
WOULD RECOMMEND: [YES | NO]
COMMENTS: [Free text]
```

---

## 5️⃣ TECHNICAL REQUIREMENTS

### **Performance**
- [ ] Initial load: <3s on 3G
- [ ] Page transitions: <300ms
- [ ] Emergency button: <1s to interactive
- [ ] Timeline load: <2s
- [ ] Search results: <1s
- [ ] Image upload: Progress indicator
- [ ] Offline sync: Background, no blocking

### **Offline Capability**
- [ ] Service worker installed
- [ ] IndexedDB for local storage
- [ ] Background sync when online
- [ ] Offline queue for actions
- [ ] Cached critical assets
- [ ] Fallback UI for unavailable features

### **Security**
- [ ] HTTPS only
- [ ] End-to-end encryption for records
- [ ] PIN/biometric at device level
- [ ] Auto-lock after 2 min
- [ ] Session timeout: 30 min
- [ ] Audit logging for data access
- [ ] PDPA compliant data handling

### **Accessibility**
- [ ] WCAG AA minimum
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Reduced motion mode
- [ ] High contrast mode
- [ ] Font scaling (up to 200%)
- [ ] Voice navigation ready

### **Browser Support**
- [ ] Chrome Android 90+
- [ ] Safari iOS 14+
- [ ] Firefox Android 90+
- [ ] KaiOS (feature phone)

### **Data Sync**
- [ ] Optimistic UI updates
- [ ] Conflict resolution strategy
- [ ] Retry logic for failed syncs
- [ ] Manual sync trigger
- [ ] Sync status indicators
- [ ] Last sync timestamp visible

---

## 6️⃣ QUALITY ASSURANCE

### **Pre-Launch Checklist**

#### Content:
- [ ] All text in Kiswahili + English
- [ ] No AI claims or labels
- [ ] No certification badges
- [ ] Clinical disclaimers present
- [ ] Plain language (5th grade)
- [ ] No medical jargon

#### Design:
- [ ] Medical icon system used
- [ ] Motion <300ms everywhere
- [ ] Reduced motion tested
- [ ] High contrast tested
- [ ] Font sizes ≥16px
- [ ] Touch targets ≥44px

#### Functionality:
- [ ] Emergency button on all screens
- [ ] Offline mode tested
- [ ] Poor network tested (2G)
- [ ] Auto-lock works
- [ ] Logout flow clear
- [ ] Role switching works

#### Security:
- [ ] Encryption verified
- [ ] Audit logging active
- [ ] PIN/biometric works
- [ ] Session timeout works
- [ ] PDPA compliance verified

#### Performance:
- [ ] Load times <3s (3G)
- [ ] Transitions <300ms
- [ ] No jank (60fps)
- [ ] Memory leaks checked
- [ ] Battery impact minimal

#### Usability:
- [ ] 5 users per group tested
- [ ] >80% task completion
- [ ] >4/5 satisfaction
- [ ] Zero emergency access failures
- [ ] Clear navigation (<3 taps)

#### Compliance:
- [ ] TMDA Class B ready
- [ ] PDPA documentation
- [ ] Clinical validation complete
- [ ] MoH review prepared
- [ ] Privacy policy clear

---

## 🚀 DEPLOYMENT READINESS

### **✅ READY FOR PRODUCTION**
- Medical icon system
- Motion token system
- Home screen (redesigned)
- Care screen (redesigned)
- Assistant screen (redesigned)
- Emergency access screen
- Design system documentation

### **🟡 READY FOR DEVELOPMENT**
- Messages screen (spec complete)
- Profile screen (spec complete)
- CHW dashboard (spec complete)
- Facility finder (spec complete)

### **🟠 NEEDS BACKEND**
- Offline sync service worker
- USSD/SMS gateway integration
- Federated record sharing
- Real-time queue management
- Push notification system

### **🔴 NEEDS GOVERNMENT APPROVAL**
- TMDA Class B certification
- MoH review and sign-off
- PDPA compliance audit
- Clinical validation study
- National pilot program

---

**Status:** ✅ **PHASE 1-2 COMPLETE**  
**Next Milestone:** User testing + Phase 3 development  
**Launch Target:** Q2 2026

Built for Tanzania 🇹🇿 | World-Class Quality 🌍 | Healthcare for All 💚
