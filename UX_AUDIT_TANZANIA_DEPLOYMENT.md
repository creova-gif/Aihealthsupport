# AfyaAI TZA - Comprehensive UX Audit & Redesign Plan
## Senior Digital Health Product Audit - Tanzania National Deployment

**Date:** February 7, 2026  
**Auditor Role:** Senior Digital Health UX Architect  
**Target:** Production deployment for Tanzania Ministry of Health

---

## 🚨 CRITICAL ISSUES FOUND (IMMEDIATE FIX REQUIRED)

### 1. **AI REFERENCES STILL PRESENT**
**Location:** ModernHome.tsx, multiple components  
**Issue:** Sparkles icon (line 23, 59, 103), "AI Assistant" label  
**Risk:** Violates approved design system, regulatory risk  
**Fix Required:** Replace with neutral "Health Assistant" or "Ask Questions"

### 2. **NON-MEDICAL ICONS IN USE**
**Location:** Throughout app using lucide-react  
**Issue:** Not using custom medical icon system  
**Risk:** Inconsistent visual language, non-professional appearance  
**Fix Required:** Migrate all icons to `/components/icons/MedicalIcons.tsx`

### 3. **MOTION VIOLATIONS**
**Location:** ModernHome.tsx and other components  
**Issue:** Using arbitrary delays (0.1, 0.4, 0.5), not using motion tokens  
**Risk:** Inconsistent timing, potential >300ms delays  
**Fix Required:** Use motion tokens from `/styles/motion-tokens.ts`

### 4. **MISSING OFFLINE-FIRST ARCHITECTURE**
**Location:** All API interactions  
**Issue:** No service worker, no offline queue, no sync strategy  
**Risk:** App fails in rural areas with intermittent connectivity  
**Fix Required:** Implement comprehensive offline system

### 5. **DEVICE SHARING NOT ADDRESSED**
**Location:** Login/logout flow  
**Issue:** No PIN/biometric lock, no session timeout  
**Risk:** Privacy violation in household device sharing scenarios  
**Fix Required:** Add device-level security layer

---

## 📊 SCREEN-BY-SCREEN AUDIT

### ONBOARDING FLOW

#### ❌ **Issues Found:**
1. Language selection timing unclear
2. No data sovereignty explanation (federated records)
3. Missing "Why do you need this?" for permissions
4. No offline capability indicator
5. Consent language may not meet PDPA requirements

#### ✅ **Redesign Requirements:**
1. **Language First** - Before splash, ask language preference
2. **Progressive Trust** - Explain federated system early
3. **Permission Context** - Show "Why" before "Allow"
4. **Offline Indicator** - Show capability upfront
5. **Legal Compliance** - PDPA-compliant consent language

#### 🎯 **Benchmarks to Match:**
- NHS App onboarding (progressive, trust-first)
- Apple Health setup (permission context)
- Signal (privacy-first messaging)

---

### HOME SCREEN (ModernHome.tsx)

#### ❌ **Critical Issues:**
1. **Sparkles icon** for AI Assistant (line 23, 59, 103)
2. **Arbitrary motion delays** (0.1, 0.4, 0.5s)
3. **"AI Assistant" label** - not neutral
4. **Generic lucide icons** instead of medical system
5. **No offline status indicator**
6. **No contextual help** for first-time users
7. **"What do you need right now?"** assumes literacy
8. **Missing emergency access** - should be prominently visible
9. **No appointment reminders** - critical for continuity

#### ✅ **Redesign Requirements:**

**Header:**
- Show connectivity status (online/offline/syncing)
- Show AfyaID (federated patient ID)
- Emergency button (always visible, red, right side)

**Main Actions:**
- Replace "AI Assistant" with "Ask Questions"
- Remove sparkles, use medical MessagesIcon
- Add visual indicators for offline availability
- Show appointment countdown if upcoming

**Content:**
- Add health records quick access
- Show medication reminders (if applicable)
- Add "Find Clinic" with distance
- Progressive disclosure for complex features

**Accessibility:**
- Icon + text (never icon alone)
- High contrast mode toggle
- Font size control
- Voice navigation support

#### 🎯 **Benchmarks:**
- Apple Health home (clean, scannable)
- NHS App dashboard (task-oriented)
- Zocdoc homepage (appointment-first)

---

### SYMPTOM CHECKER

#### ❌ **Issues Found:**
1. May contain "AI thinking" animations
2. No clinical disclaimer visibility
3. Missing red flag symptom detection
4. No emergency escalation path
5. Unclear triage output format
6. No offline capability

#### ✅ **Redesign Requirements:**

**Critical Safety:**
- **Red flag detection** - Immediate emergency screen (no animation)
- **Clinical disclaimer** - Every screen, not just once
- **Escalation paths** - Clear "Book appointment" or "Seek care now"

**Interaction Flow:**
- **One question per screen** - Mobile-friendly
- **Visual body map** - For low-literacy users
- **Common symptoms first** - Fever, cough, pain
- **Progressive depth** - Only ask necessary follow-ups

**Output:**
- **Plain language** - No medical jargon
- **Action-oriented** - "What to do next"
- **Facility finder** - Nearest capable facility
- **Offline mode** - Basic triage works offline

#### 🎯 **Benchmarks:**
- NHS 111 online (clear triage)
- Ada Health (visual, progressive)
- Buoy Health (plain language output)

---

### APPOINTMENTS SYSTEM

#### ❌ **Issues Found:**
1. No queue transparency
2. No transport considerations
3. No appointment preparation info
4. Missing rescheduling flow
5. No reminder system
6. Unclear cancellation policy

#### ✅ **Redesign Requirements:**

**Booking Flow:**
- **Reason for visit** - Free text + common options
- **Facility selection** - Distance, transport, queue time
- **Date/time picker** - Show queue length per slot
- **Preparation** - What to bring, fasting, etc.
- **Confirmation** - SMS + in-app + calendar export

**Queue Management:**
- **Real-time position** - "You are #12 in queue"
- **Estimated wait** - "Approximately 45 minutes"
- **Delay notifications** - Proactive updates
- **Check-in** - QR code or SMS code

**Pre-Appointment:**
- **Reminders** - 24h, 2h, 30min before
- **Directions** - Map + transport options
- **Preparation checklist** - Medications, records, questions

**Post-Appointment:**
- **Follow-up scheduling** - If needed
- **Prescription fulfillment** - Nearby pharmacies
- **Records update** - Auto-sync to timeline

#### 🎯 **Benchmarks:**
- Zocdoc (booking flow)
- Solv (queue transparency)
- One Medical (preparation info)

---

### HEALTH RECORDS TIMELINE

#### ❌ **Issues Found:**
1. Federated architecture not visible to user
2. No cross-facility record viewing
3. Missing document upload
4. No family member access (caregiver support)
5. Unclear data ownership
6. No export capability

#### ✅ **Redesign Requirements:**

**Timeline View:**
- **Chronological** - Most recent first
- **Filterable** - By type, facility, date range
- **Searchable** - Free text search
- **Visual** - Icons for visit types

**Record Details:**
- **Facility name** - Clear source attribution
- **Clinician name** - Who provided care
- **Diagnosis** - Plain language
- **Medications** - Active prescriptions
- **Lab results** - With reference ranges
- **Documents** - View PDF, images

**Cross-Facility:**
- **AfyaID shown** - User understands it's universal
- **Multiple facilities** - Clear which facility owns record
- **Consent management** - Control who sees what
- **Sync status** - Show if records are syncing

**Family/Caregiver:**
- **Dependent profiles** - For children, elderly
- **Access delegation** - Time-limited sharing
- **Emergency contacts** - Auto-notify if configured

#### 🎯 **Benchmarks:**
- Apple Health Records (cross-facility)
- MyChart (Epic) (timeline view)
- NHS App (GP record access)

---

### MEDICATION TRACKER

#### ❌ **Issues Found:**
1. No barcode scanning
2. Missing refill reminders
3. No pharmacy integration
4. Unclear adherence tracking
5. No drug interaction warnings
6. Missing side effect reporting

#### ✅ **Redesign Requirements:**

**Add Medication:**
- **Barcode scan** - From prescription or bottle
- **Search** - By name (generic + brand)
- **Photo** - Take picture of prescription
- **Manual entry** - For traditional medicines

**Reminders:**
- **Time-based** - Multiple times per day
- **Dose-based** - Number of pills/ml
- **Visual confirmation** - Check off when taken
- **Missed dose** - What to do

**Refills:**
- **Auto-calculate** - Based on supply and dosage
- **Pharmacy integration** - Request refill
- **Alternative pharmacies** - If out of stock
- **Cost comparison** - Generic vs brand

**Safety:**
- **Drug interactions** - Check with current meds
- **Allergy warnings** - Cross-reference profile
- **Side effects** - Report and track
- **Emergency info** - What to do if overdose

#### 🎯 **Benchmarks:**
- Medisafe (reminders, tracking)
- GoodRx (pharmacy integration)
- Mayo Clinic app (drug information)

---

### MATERNAL CARE JOURNEY

#### ❌ **Issues Found:**
1. Missing traditional birth attendant coordination
2. No family planning integration
3. Unclear ANC schedule
4. Missing danger signs education
5. No postpartum care path
6. Husband/partner involvement unclear

#### ✅ **Redesign Requirements:**

**Pregnancy Tracking:**
- **Week-by-week** - What to expect
- **ANC schedule** - WHO-recommended visits
- **Danger signs** - Red flags for emergency
- **Birth plan** - Hospital vs home, preferences
- **Nutrition** - What to eat, supplements

**Antenatal Care:**
- **Visit reminders** - When to go
- **Test tracking** - Blood, urine, ultrasound
- **Weight/BP** - Track at home or facility
- **Fetal movement** - Kick counting
- **Questions for clinician** - Prepare for visits

**Delivery:**
- **Facility selection** - Capabilities, distance
- **Transport plan** - How to get there
- **Emergency contacts** - Who to call
- **Birth companion** - Bring support person
- **What to bring** - Checklist

**Postpartum:**
- **Recovery timeline** - What's normal
- **Breastfeeding** - Support and guidance
- **Family planning** - Options and scheduling
- **Postpartum depression** - Screening and resources
- **Newborn care** - Immunizations, growth

#### 🎯 **Benchmarks:**
- What to Expect app (week-by-week)
- BabyCenter (community + tracking)
- WHO MCSP guidelines (clinical accuracy)

---

### MESSAGES HUB

#### ❌ **Issues Found:**
1. No message prioritization
2. Unclear who can message
3. Missing translation support
4. No voice message option
5. Unclear response time expectations
6. No emergency escalation

#### ✅ **Redesign Requirements:**

**Message Types:**
- **Urgent** - Red, clinician responds <1h
- **Normal** - Blue, response within 24h
- **Administrative** - Gray, non-clinical

**Contacts:**
- **Care team** - Assigned clinician, CHW
- **Facility** - Appointment questions
- **Support** - Technical help
- **Emergency** - Escalation path

**Accessibility:**
- **Voice messages** - For low-literacy users
- **Translation** - Auto-translate Swahili ↔ English
- **Read receipts** - Know if clinician saw it
- **Offline queueing** - Send when back online

**Safety:**
- **Clinical disclaimer** - "Not for emergencies"
- **Emergency button** - Visible in every screen
- **Escalation prompt** - "Does this need urgent care?"

#### 🎯 **Benchmarks:**
- Patient access platforms (MyChart, Cerner)
- Telemedicine apps (Teladoc message threading)
- WhatsApp (familiar UX for voice messages)

---

### PROFILE & SETTINGS

#### ❌ **Issues Found:**
1. No AfyaID visibility
2. Missing consent management
3. No data export
4. Unclear logout implications
5. No device management
6. Missing accessibility settings

#### ✅ **Redesign Requirements:**

**Identity:**
- **AfyaID** - Large, copyable
- **QR code** - For facility check-in
- **Photo** - Optional profile picture
- **Demographics** - Name, DOB, gender
- **Contact** - Phone, email

**Health Profile:**
- **Allergies** - Drug, food, environmental
- **Chronic conditions** - Diabetes, hypertension, etc.
- **Blood type** - For emergencies
- **Emergency contacts** - Name, phone, relationship
- **Insurance** - NHIF or private

**Privacy & Data:**
- **Consent history** - What you agreed to
- **Data sharing** - Control who sees records
- **Federated records** - Explanation of system
- **Export data** - Download all records
- **Delete account** - GDPR/PDPA compliance

**Settings:**
- **Language** - Kiswahili, English, others
- **Notifications** - Appointment, medication, messages
- **Accessibility** - Font size, high contrast, voice
- **Offline mode** - Manual sync control
- **Device security** - PIN, biometric, auto-lock

**Logout:**
- **Confirm** - "Are you sure?"
- **Clear local data** - If device is shared
- **Keep offline data** - For continuity
- **Emergency access** - Medical info remains

#### 🎯 **Benchmarks:**
- Apple Health (privacy controls)
- Signal (data ownership clarity)
- NHS App (identity verification)

---

## 🏥 MISSING CRITICAL FEATURES

### 1. **EMERGENCY ACCESS**
**What:** Always-visible emergency button  
**Why:** Life-saving, no time to navigate  
**Implementation:**
- Red button, top-right of every screen
- No login required (public access mode)
- Shows nearest emergency facility
- One-tap call 911/emergency number
- Location sharing with emergency contacts

### 2. **OFFLINE-FIRST ARCHITECTURE**
**What:** App works without internet  
**Why:** Rural Tanzania has intermittent connectivity  
**Implementation:**
- Service worker for caching
- IndexedDB for local storage
- Background sync when online
- Clear offline/online status
- Queue actions for sync

### 3. **CHW COORDINATION**
**What:** Community Health Worker integration  
**Why:** CHWs are first point of contact in rural areas  
**Implementation:**
- CHW dashboard (separate role)
- Patient list management
- Visit scheduling
- Referral system
- Stock management (basic medicines)

### 4. **USSD/SMS FALLBACK**
**What:** Feature phone access  
**Why:** Not everyone has smartphone  
**Implementation:**
- USSD menu system
- SMS appointment reminders
- SMS medication reminders
- SMS test results
- SMS emergency alerts

### 5. **FACILITY FINDER**
**What:** Find nearest healthcare facility  
**Why:** Users don't know where to go  
**Implementation:**
- Map view + list view
- Filter by service type
- Distance + transport time
- Queue times (if available)
- Facility capabilities

### 6. **FAMILY PROFILES**
**What:** Manage dependents (children, elderly)  
**Why:** Household device sharing  
**Implementation:**
- Add family member
- Delegate access (caregiver)
- Switch profiles easily
- Age-appropriate content
- Parent/guardian consent

---

## 🌍 TANZANIA-SPECIFIC REQUIREMENTS

### LANGUAGE & LITERACY

#### Issues:
- Assumes literacy
- Limited visual aids
- No voice navigation
- English bias in medical terms

#### Solutions:
1. **Visual First** - Icons + images before text
2. **Plain Language** - 5th grade reading level
3. **Voice Support** - Text-to-speech for all content
4. **Local Terms** - Kiswahili medical terms (not English)
5. **Audio Instructions** - For complex flows

### CONNECTIVITY

#### Issues:
- Assumes always-online
- No bandwidth optimization
- No offline queue
- Missing sync indicators

#### Solutions:
1. **Offline-First** - Everything works offline
2. **Lazy Loading** - Load images only when needed
3. **Progressive Enhancement** - Basic features work on 2G
4. **Sync Queue** - Show what's pending upload
5. **Bandwidth Meter** - Let user control data usage

### DEVICE SHARING

#### Issues:
- No session management
- No quick logout
- No privacy lock
- Missing profile switching

#### Solutions:
1. **Auto-Lock** - After 2 minutes inactivity
2. **PIN/Biometric** - Device-level security
3. **Quick Logout** - Prominent on every screen
4. **Profile Switcher** - Fast family member switching
5. **Private Browsing** - No local storage of sensitive data

### CULTURAL CONTEXT

#### Issues:
- Individual-centric (Western model)
- Missing family/community involvement
- No traditional medicine integration
- Gender considerations unclear

#### Solutions:
1. **Family Profiles** - Household health management
2. **Birth Companions** - Include in maternal care
3. **Traditional Medicine** - Track herbal remedies
4. **Gender Settings** - Male/female clinician preference
5. **Community Health** - CHW as primary contact

---

## 📋 IMPLEMENTATION PRIORITY

### PHASE 1: CRITICAL SAFETY (Week 1)
1. Remove all AI branding (sparkles, labels)
2. Migrate to medical icon system
3. Add emergency access button
4. Fix motion timing to <300ms
5. Add clinical disclaimers

### PHASE 2: CORE FUNCTIONALITY (Weeks 2-3)
1. Implement offline-first architecture
2. Add device-level security (PIN/biometric)
3. Redesign Home screen (this document)
4. Redesign Symptom Checker (safety-first)
5. Fix Appointments (queue transparency)

### PHASE 3: TANZANIA-SPECIFIC (Weeks 4-5)
1. Add USSD/SMS fallback
2. Implement CHW dashboard
3. Add facility finder
4. Family profiles
5. Voice navigation

### PHASE 4: POLISH & SCALE (Week 6)
1. Accessibility audit (WCAG AA)
2. Performance optimization (<3s load)
3. Regional pilot (Dar es Salaam + rural)
4. Government review preparation
5. Launch readiness

---

## ✅ SUCCESS CRITERIA

### USER METRICS
- [ ] 80% task completion rate (first attempt)
- [ ] <30s to book appointment
- [ ] <2 minutes to complete symptom check
- [ ] Zero emergency access failures
- [ ] 90% offline functionality available

### TECHNICAL METRICS
- [ ] <3s initial load time (3G)
- [ ] <1s navigation transitions
- [ ] 100% offline form submission queue
- [ ] <5MB initial app download
- [ ] Zero motion >300ms

### REGULATORY METRICS
- [ ] Zero AI claims in UI
- [ ] 100% PDPA consent compliance
- [ ] TMDA Class B documentation ready
- [ ] Clinical disclaimers on every screen
- [ ] Audit trail for all medical data

---

**Next Step:** Begin systematic redesign of each screen, starting with ModernHome.tsx

**Status:** 🔴 **NOT PRODUCTION READY** - Critical issues must be resolved before launch
