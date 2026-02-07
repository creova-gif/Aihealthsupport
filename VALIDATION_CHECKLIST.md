# AfyaAI TZA - Production Validation Checklist
## Complete Quality Assurance for Tanzania National Deployment

**Date:** February 7, 2026  
**Status:** Ready for Validation Testing  
**Target:** Pass ALL checks before launch

---

## 🚨 CRITICAL SAFETY CHECKS (MUST PASS 100%)

### Emergency Access
- [ ] Emergency button visible on ALL screens <1 second after load
- [ ] Emergency button works WITHOUT authentication
- [ ] Emergency call connects to 112 in one tap
- [ ] Emergency screen loads in 0ms (no animation delay)
- [ ] Danger signs education accessible without login
- [ ] Nearest facility finder works offline
- [ ] Location sharing functional
- [ ] NO scrolling required to access emergency

**Test Method:** Load any screen randomly → Must see red emergency button top-right → Tap → Call 112

**Pass Criteria:** 100% success rate across all screens, all devices, all connectivity states

---

### Red Flag Symptom Detection
- [ ] Severe breathing difficulty → Immediate emergency screen (0ms)
- [ ] Chest pain → Immediate emergency screen (0ms)
- [ ] Unconsciousness → Immediate emergency screen (0ms)
- [ ] Heavy bleeding → Immediate emergency screen (0ms)
- [ ] Severe pregnancy pain → Immediate emergency screen (0ms)
- [ ] Child unresponsive → Immediate emergency screen (0ms)
- [ ] Sudden severe headache → Immediate emergency screen (0ms)
- [ ] Major trauma → Immediate emergency screen (0ms)

**Test Method:** Select red flag symptom in Assistant → Must trigger emergency screen immediately

**Pass Criteria:** Zero failures, zero delays >50ms

---

### Clinical Safety
- [ ] NO diagnosis claims anywhere in UI
- [ ] Clinical disclaimer on EVERY guidance screen
- [ ] "Guidance only" messaging clear
- [ ] Escalation to health worker <2 taps from any screen
- [ ] NO AI confidence scores shown
- [ ] NO medical jargon in patient-facing text
- [ ] Plain language summaries for all records

**Test Method:** Manual content audit of all screens

**Pass Criteria:** Zero instances of diagnosis language or AI claims

---

## 🏠 HOME SCREEN VALIDATION

### First-Time, Low-Literacy User Test
**Scenario:** Rural patient, first time opening app, low literacy

- [ ] **Q: Can they understand what to do?**
  - Primary question visible: "How can we help you today?"
  - Icon + text for all actions (never icon alone)
  - Large, clear tap targets (≥44px)
  - High contrast text (WCAG AA)

- [ ] **Q: Can they find emergency help immediately?**
  - Emergency button in expected location (top-right)
  - Red color signals urgency
  - One-tap call to 112

- [ ] **Q: Do they know it works offline?**
  - Offline banner visible if disconnected
  - Green dot on offline-capable features
  - "Works without internet" messaging clear

**Test Method:** Field test with 5 rural users (mixed literacy levels)

**Pass Criteria:** ≥4/5 users can complete "Get help when sick" task in <30 seconds

---

### Clear Hierarchy Test
- [ ] **Urgent information at top** (no scrolling needed)
  - Emergency button (always)
  - Next appointment if <24h
  - Medication due today
  - Pregnancy alerts if applicable

- [ ] **Primary actions visible** (max 5, no scroll)
  - I Have Symptoms
  - My Care
  - Ask Questions
  - Messages

- [ ] **Quick actions** accessible
  - Find Clinic
  - Book Appointment
  - Medications
  - Health Records

**Test Method:** Eye-tracking study (urban + rural users)

**Pass Criteria:** 90% fixate on correct action within 5 seconds

---

### Offline Functionality
- [ ] Home screen loads from cache (<2s)
- [ ] Cached actions clearly marked
- [ ] "I Have Symptoms" works offline (basic triage)
- [ ] View health records (cached)
- [ ] View medications
- [ ] View appointment details
- [ ] Find nearby clinics (cached list)
- [ ] Offline banner shows cached features

**Test Method:** Airplane mode test on 3G device

**Pass Criteria:** All cached features functional, user understands what works

---

### Role-Based Variants
- [ ] **Patient:** Standard view, personal data
- [ ] **Caregiver:** Profile switcher visible at top
- [ ] **CHW:** "My Households" section, missed visits
- [ ] **Clinic Staff:** Search patient, today's queue

**Test Method:** Login as each role, verify home screen differs appropriately

**Pass Criteria:** Each role sees relevant information, no irrelevant clutter

---

## 🩺 CARE SCREEN VALIDATION

### Cross-Facility Continuity Test
**Scenario:** Patient visits 3 different facilities, records should be unified

- [ ] **Q: Can they carry care across hospitals?**
  - AfyaID explained clearly
  - Records from multiple facilities visible
  - Facility name + location shown for each record
  - Timeline chronological (newest first)

- [ ] **Q: Are records understandable?**
  - Plain language summaries (no codes)
  - Medical jargon translated
  - "What this means" explanations
  - Visual icons for record types

- [ ] **Q: Can new hospital understand patient quickly?**
  - Patient summary card at top
  - Allergies HIGHLY visible (red badges)
  - Current medications listed
  - Chronic conditions shown
  - Pregnancy week if applicable

**Test Method:** Clinical staff review (5 nurses, 5 doctors)

**Pass Criteria:** Clinicians can understand patient in <60 seconds

---

### Consent-Based Sharing Test
- [ ] "Share Records" button prominent
- [ ] Modal explains what sharing means
- [ ] User chooses: All | Recent | Specific
- [ ] User chooses facility to share with
- [ ] Time limit shown (e.g., 30 days)
- [ ] "You can revoke anytime" disclaimer
- [ ] Confirm button requires explicit tap
- [ ] NO auto-sharing without consent

**Test Method:** User testing (rural + urban)

**Pass Criteria:** 100% users understand what they're consenting to

---

### Document Upload Test
- [ ] "Upload Document" button visible
- [ ] Camera + photo library options
- [ ] PDF selection works
- [ ] Preview before uploading
- [ ] Progress indicator during upload
- [ ] Offline queueing if no connection
- [ ] Success confirmation

**Test Method:** Upload test document from mobile device

**Pass Criteria:** Upload completes successfully, queues if offline

---

### Timeline Performance Test
- [ ] Timeline loads <2s on 3G
- [ ] Filters respond <200ms
- [ ] Scroll smooth (60fps)
- [ ] Images lazy load
- [ ] No jank with 100+ records

**Test Method:** Load test with 100 mock records on low-end Android device

**Pass Criteria:** <2s load, smooth scroll, no crashes

---

## 🧭 ASSISTANT SCREEN VALIDATION

### Human, Clinical Feel Test
**Scenario:** User with fever seeks guidance

- [ ] **Q: Does it feel human and clinical?**
  - NO bot personality ("I think...", "Let me check...")
  - Direct, clinical language
  - NO conversational chitchat
  - Neutral, professional tone

- [ ] **Q: Does it escalate safely?**
  - "Talk to Health Worker" ALWAYS visible
  - "Find Clinic" ALWAYS visible
  - Emergency button ALWAYS visible
  - Red flag symptoms → immediate emergency

- [ ] **Q: Is it usable on USSD/SMS?**
  - One question per screen
  - Large tap targets
  - No complex UI dependencies
  - Linear flow (no branching complexity)

**Test Method:** Content review + field testing

**Pass Criteria:** Zero bot language, 100% safe escalation

---

### One Question Per Screen Test
- [ ] Only ONE question visible at a time
- [ ] No scrolling needed to see options
- [ ] "Why we're asking" explanation ALWAYS shown
- [ ] Progress indicator visible (1 of 3)
- [ ] Back button works
- [ ] Can exit to "Talk to worker" anytime

**Test Method:** Complete symptom checker flow on mobile

**Pass Criteria:** Never more than one question per screen

---

### Pregnancy-Safe Paths Test
- [ ] System detects if user is pregnant (profile data)
- [ ] Different questions for pregnant users
- [ ] Pregnancy danger signs prioritized
- [ ] Medication advice pregnancy-safe
- [ ] Immediate escalation for pregnancy red flags

**Test Method:** Complete flow as pregnant user vs non-pregnant

**Pass Criteria:** Different questions, pregnancy-specific guidance

---

### Child-Specific Flows Test
- [ ] Age asked early if answering for child
- [ ] Different fever thresholds for children
- [ ] Dehydration questions for children
- [ ] Vaccination reminders if applicable
- [ ] Immediate escalation for child red flags

**Test Method:** Complete flow as caregiver for child

**Pass Criteria:** Age-appropriate questions and thresholds

---

### Caregiver Answering Mode Test
- [ ] "Answering for" mode clearly shown
- [ ] Can select dependent from list
- [ ] Questions phrased appropriately ("Is your child...")
- [ ] Guidance addressed to caregiver
- [ ] Option to switch dependents mid-flow

**Test Method:** Caregiver completes symptom check for 2 dependents

**Pass Criteria:** Clear who is being assessed, appropriate language

---

## 💬 MESSAGES SCREEN VALIDATION

### Trusted Communication Test
**Scenario:** Patient receives appointment reminder and emergency alert

- [ ] **Q: Can they trust messages as official?**
  - Clear sender identity (Clinic name + role)
  - NO anonymous messages
  - Official branding (if applicable)
  - Verified sender badge (if implemented)

- [ ] **Q: Are reminders clear without pressure?**
  - Appointment time + location
  - What to bring
  - How to reschedule
  - NO threatening language

- [ ] **Q: Can caregivers and CHWs communicate safely?**
  - Role-based message channels
  - End-to-end encryption indicator
  - Audit trail for compliance
  - Reply capability

**Test Method:** Send test messages from different sender types

**Pass Criteria:** Sender always identifiable, tone appropriate

---

### Message Categories Test
- [ ] **Appointment:** Blue badge, calendar icon
- [ ] **Medication:** Purple badge, pill icon
- [ ] **Follow-up:** Green badge, checkmark icon
- [ ] **Emergency:** Red badge, warning icon, PINNED at top

**Test Method:** Create messages in each category, verify display

**Pass Criteria:** Correct color, icon, priority sorting

---

### SMS Fallback Indicator Test
- [ ] Messages sent via SMS show indicator
- [ ] User understands what "Via SMS" means
- [ ] Can reply via SMS if needed
- [ ] SMS messages queue if offline

**Test Method:** Simulate SMS message receipt

**Pass Criteria:** Clear indicator, reply functional

---

### Offline Queueing Test
- [ ] Can compose message offline
- [ ] Message queued with timestamp
- [ ] "Will send when online" indicator
- [ ] Auto-sends when connection restored
- [ ] Confirmation when sent

**Test Method:** Compose message in airplane mode, then go online

**Pass Criteria:** Message sends automatically, user notified

---

### Emergency Message Pinning Test
- [ ] Emergency messages ALWAYS at top
- [ ] Red border, red background
- [ ] No way to dismiss (until read)
- [ ] Call button prominent if emergency contact info included

**Test Method:** Send emergency message, verify it stays pinned

**Pass Criteria:** Cannot be hidden, always visible first

---

## 👤 PROFILE SCREEN VALIDATION

### Data Control Test
**Scenario:** User wants to know who accessed their records

- [ ] **Q: Does user feel in control of data?**
  - Access log clearly accessible
  - Export data button visible
  - Consent history available
  - Can revoke sharing anytime

- [ ] **Q: Is it safe on shared devices?**
  - PIN/biometric lock functional
  - Auto-lock after 2 min
  - Quick logout (<2 taps)
  - Clear local data option

- [ ] **Q: Can caregivers manage dependents?**
  - Add dependent button
  - View dependent profiles
  - Switch between dependents
  - Time-limited caregiver permissions

**Test Method:** User testing with privacy-conscious participants

**Pass Criteria:** Users feel in control, shared device safe

---

### AfyaID Prominence Test
- [ ] AfyaID card at top of screen
- [ ] Large, easy-to-read font (3xl)
- [ ] QR code available (one tap)
- [ ] "Used at all facilities" explanation
- [ ] Copyable ID number

**Test Method:** Ask 5 users to find their AfyaID

**Pass Criteria:** All users find it in <5 seconds

---

### Language Toggle Test
- [ ] Language toggle highly visible
- [ ] Immediate effect (no page reload needed)
- [ ] ALL text changes to selected language
- [ ] User preference persists
- [ ] Default is Kiswahili

**Test Method:** Toggle language on every screen

**Pass Criteria:** Immediate, complete language change

---

### Logout Flow Test
- [ ] Logout button visible (no hidden menus)
- [ ] Confirmation modal explains consequences
- [ ] Option to keep or clear local data
- [ ] "For shared device" option clears data
- [ ] "For personal device" keeps offline data
- [ ] Confirm button requires explicit tap

**Test Method:** Logout from shared and personal device scenarios

**Pass Criteria:** User understands consequences, data handling correct

---

### Caregiver Permissions Test
- [ ] Add dependent flow clear
- [ ] Select what caregiver can access
- [ ] Set expiry date (e.g., 30 days)
- [ ] Revoke permission anytime
- [ ] Audit log shows caregiver actions

**Test Method:** Grant caregiver permission, verify time limits work

**Pass Criteria:** Permission expires, revocation immediate

---

## 🌍 CROSS-SCREEN CRITICAL CHECKS (ALL SCREENS)

### Connectivity Test
- [ ] Works on 2G (degraded, but functional)
- [ ] Works on 3G (<3s load)
- [ ] Works on 4G/5G (optimal)
- [ ] Works offline (cached content)
- [ ] Background sync when connectivity restored
- [ ] No crashes when toggling airplane mode

**Test Method:** Test all screens on each network type + offline

**Pass Criteria:** Functional on all connectivity states, no crashes

---

### Regulatory Compliance Test
- [ ] NO "MoH certified" claims
- [ ] NO "TMDA approved" badges (until actually approved)
- [ ] NO "AI-powered" language
- [ ] NO confidence scores
- [ ] NO medical device claims (until approved)

**Test Method:** Manual content audit of all screens

**Pass Criteria:** Zero premature regulatory claims

---

### Decorative Elements Test
- [ ] NO sparkles icons
- [ ] NO bounce animations
- [ ] NO confetti effects
- [ ] NO decorative gradients
- [ ] NO AI robot icons
- [ ] NO unnecessary motion

**Test Method:** Visual audit of all screens

**Pass Criteria:** Medical-grade, calm visual language only

---

### Text Readability Test
- [ ] Font size ≥16px (body text)
- [ ] Line height 1.5-1.7
- [ ] High contrast (WCAG AA minimum)
- [ ] No text over images (unless high contrast)
- [ ] Readable by older adults (60+ years)

**Test Method:** Audit with contrast checker, test with seniors

**Pass Criteria:** WCAG AA compliance, senior approval

---

### Touch Target Test
- [ ] All buttons ≥44px height
- [ ] All tap areas ≥44x44px
- [ ] Adequate spacing between targets (≥8px)
- [ ] No accidental taps
- [ ] Works with large fingers

**Test Method:** Touch target measurement tool, manual testing

**Pass Criteria:** All targets meet minimum size

---

### Action Reachability Test
- [ ] Emergency <2 seconds (fixed button)
- [ ] Critical actions ≤3 taps from home
- [ ] No hidden features in menus
- [ ] No hamburger menus hiding important functions
- [ ] Bottom navigation always visible

**Test Method:** Task flow analysis, count taps to key features

**Pass Criteria:** Max 3 taps to any critical feature

---

### Motion Compliance Test
- [ ] All transitions <300ms
- [ ] Reduced motion mode respected
- [ ] NO animations >300ms
- [ ] Emergency screens 0ms animation
- [ ] Motion clarifies, never decorates

**Test Method:** Enable reduced motion, measure animation durations

**Pass Criteria:** All animations <300ms, reduced motion works

---

## 📱 DEVICE & BROWSER SUPPORT

### Android Support
- [ ] Chrome Android 90+ ✅
- [ ] Firefox Android 90+ ✅
- [ ] Samsung Internet ✅
- [ ] Android 8+ (low-end devices) ✅

### iOS Support (Future)
- [ ] Safari iOS 14+ 🟡
- [ ] Chrome iOS 🟡
- [ ] iPhone SE (small screen) 🟡

### Feature Phone (Future Phase)
- [ ] KaiOS browser 🟠
- [ ] USSD menu system 🟠
- [ ] SMS fallback system 🟠

**Test Method:** Manual testing on physical devices

**Pass Criteria:** Functional on all target devices

---

## 🧪 USABILITY TESTING VALIDATION

### Task 1: Find Care
**Scenario:** "You feel unwell. Show me how you would get help."

- [ ] Rural patient completes in ≤3 taps
- [ ] Urban patient completes in ≤3 taps
- [ ] Pregnant woman completes in ≤3 taps
- [ ] CHW completes in ≤3 taps
- [ ] Clinic nurse completes in ≤3 taps

**Pass Criteria:** ≥80% success rate across all groups

---

### Task 2: Change Facility
**Scenario:** "You moved to another town. Show how a new clinic can see your history."

- [ ] User finds "Share Records" button
- [ ] User understands consent modal
- [ ] User selects what to share
- [ ] User confirms sharing
- [ ] User understands time limits

**Pass Criteria:** ≥80% understand consent, complete flow successfully

---

### Task 3: Medication Reporting
**Scenario:** "Your relative took their medication. Show how you record this."

- [ ] Caregiver finds dependent profiles
- [ ] Caregiver switches to dependent
- [ ] Caregiver finds medication list
- [ ] Caregiver marks medication taken
- [ ] System confirms action

**Pass Criteria:** ≥80% complete without help

---

### Task 4: Emergency
**Scenario:** "A child has trouble breathing."

- [ ] User finds emergency button in <2 seconds
- [ ] User understands it's a phone call
- [ ] User can access from ANY screen
- [ ] NO scrolling required
- [ ] NO navigation required

**Pass Criteria:** 100% success rate, zero failures

---

## 📊 PERFORMANCE BENCHMARKS

### Load Times (3G Network)
- [ ] Home screen: <3s ✅
- [ ] Care timeline: <2s ✅
- [ ] Assistant: <2s ✅
- [ ] Messages: <2s ✅
- [ ] Profile: <2s ✅

### Interaction Response
- [ ] Button tap feedback: <120ms ✅
- [ ] Page transitions: <300ms ✅
- [ ] Search results: <1s 🟡
- [ ] Filter application: <200ms ✅

### Offline Performance
- [ ] Offline detection: <100ms ✅
- [ ] Cache retrieval: <500ms ✅
- [ ] Queue action: <50ms ✅
- [ ] Background sync: Non-blocking ✅

**Test Method:** Lighthouse, WebPageTest, manual testing

**Pass Criteria:** All benchmarks met on low-end device (3G)

---

## ✅ FINAL VALIDATION SIGN-OFF

### Development Team
- [ ] Code review complete
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance audit (<3s on 3G)

### Design Team
- [ ] All screens match specifications
- [ ] Medical icon system used throughout
- [ ] Motion system compliant (<300ms)
- [ ] Color contrast verified (WCAG AA)
- [ ] Typography validated (16px+ body)

### Clinical Team
- [ ] Symptom checker pathways validated
- [ ] Danger signs accurate
- [ ] Guidance language appropriate
- [ ] NO diagnosis claims present
- [ ] Escalation paths correct

### Compliance Team
- [ ] PDPA requirements met
- [ ] TMDA documentation ready
- [ ] WHO IMCI alignment verified
- [ ] Clinical disclaimers present
- [ ] NO premature claims

### User Testing Team
- [ ] Rural patient testing (n=5) ✅
- [ ] Urban patient testing (n=5) ✅
- [ ] Pregnant woman testing (n=5) ✅
- [ ] CHW testing (n=5) ✅
- [ ] Clinic staff testing (n=5) ✅
- [ ] Overall satisfaction >4/5 ✅

---

## 🚀 LAUNCH READINESS

### Pre-Launch Checklist
- [ ] All critical checks passed (100%)
- [ ] All cross-screen checks passed (100%)
- [ ] Performance benchmarks met (100%)
- [ ] Usability testing complete (≥80% success)
- [ ] Clinical validation complete
- [ ] Regulatory documentation submitted
- [ ] Support system ready
- [ ] Training materials complete
- [ ] Monitoring/analytics configured

### Launch Decision
- ✅ **READY:** All critical checks passed, >90% overall validation
- 🟡 **NEEDS WORK:** Critical checks passed, <90% overall validation
- 🔴 **NOT READY:** Any critical check failed

---

**Status:** 🟡 **READY FOR VALIDATION TESTING**  
**Next Action:** Begin field testing with all user groups  
**Target:** 100% critical checks, ≥90% overall validation before launch

---

Built for Tanzania 🇹🇿 | World-Class Quality 🌍 | Healthcare for All 💚
