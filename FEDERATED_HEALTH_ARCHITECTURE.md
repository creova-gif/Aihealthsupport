# AfyaAI TZA - Federated Health Record Architecture
## "Records Follow Patients, Not Facilities"

## 🎯 CORE PROBLEM SOLVED

**In Tanzania:** Patients move more than records.
- Rural patients change clinics frequently
- Records are paper-based or siloed
- No continuity between hospitals, clinics, pharmacies
- Pregnant women and chronic patients get lost
- Medication adherence is invisible
- Diagnostic data (X-ray, labs) stays trapped

**Solution:** Federated Health Record System
- Records remain owned by facilities
- Summaries + pointers follow the patient
- No centralized storage = no political resistance
- Works offline = rural-ready
- Consent-first = privacy-safe

---

## 1️⃣ NATIONAL PATIENT ID SYSTEM

### AfyaID Format
```
AFYA-TZA-XXXX-XXXX
```

**Example:** `AFYA-TZA-2847-9156`

### Primary Identifier: Phone Number
- Most Tanzanians have phones
- Portable across facilities
- Works with USSD/SMS
- No dependency on NIDA/NHIF

### ID Generation Logic
```javascript
// AfyaID Generator
function generateAfyaID(phoneNumber) {
  const hash = sha256(phoneNumber + salt);
  const segment1 = hash.substring(0, 4).toUpperCase();
  const segment2 = hash.substring(4, 8).toUpperCase();
  return `AFYA-TZA-${segment1}-${segment2}`;
}

// Example
generateAfyaID("+255712345678")
// Output: AFYA-TZA-4B2C-8F91
```

### Lookup Methods
1. **Phone number** (primary)
2. **AfyaID** (QR code or manual entry)
3. **NIDA/NHIF** (future integration)
4. **Biometric** (fingerprint, photo — phase 2)

### Offline Capability
```json
{
  "offline_id_cache": [
    {
      "afya_id": "AFYA-TZA-4B2C-8F91",
      "phone": "+255712345678",
      "name": "Maria Kamau",
      "last_seen": "2026-02-06",
      "facility": "Mwanza Health Center"
    }
  ]
}
```

---

## 2️⃣ FEDERATED RECORD MODEL

### What Travels With Patient (Portable Summary)
```json
{
  "afya_id": "AFYA-TZA-4B2C-8F91",
  "basic_info": {
    "name": "Maria Kamau",
    "age": 28,
    "gender": "F",
    "phone": "+255712345678"
  },
  "red_flags": {
    "pregnant": true,
    "gestational_age": 24,
    "chronic_conditions": ["hypertension"],
    "allergies": ["penicillin"],
    "critical_notes": "High-risk pregnancy"
  },
  "current_medications": [
    {
      "drug": "Methyldopa 250mg",
      "dosage": "2x daily",
      "started": "2025-12-01"
    }
  ],
  "recent_visits": [
    {
      "date": "2026-01-15",
      "facility": "Mwanza Health Center",
      "facility_hfr_id": "HFR-1234",
      "type": "ANC",
      "summary": "BP 140/90, advised rest"
    },
    {
      "date": "2025-12-20",
      "facility": "Mwanza Health Center",
      "facility_hfr_id": "HFR-1234",
      "type": "ANC",
      "summary": "Normal checkup"
    }
  ],
  "diagnostic_pointers": [
    {
      "date": "2026-01-15",
      "type": "ultrasound",
      "facility": "HFR-1234",
      "summary": "Normal fetal development",
      "full_record_available": true
    }
  ]
}
```

### What Stays at Facility (Full Records)
```json
{
  "patient_id": "AFYA-TZA-4B2C-8F91",
  "facility_internal_id": "MWZ-2023-00847",
  "full_clinical_notes": "...",
  "raw_lab_results": {...},
  "imaging_files": ["ultrasound_20260115.dcm"],
  "prescriptions": [...],
  "internal_workflows": {...},
  "billing_records": {...}
}
```

### Record Sharing Rules
1. **Default:** Only summary visible
2. **With Consent:** Full record accessible
3. **Emergency:** Summary + red flags auto-shared
4. **Audit:** Every access logged

---

## 3️⃣ CROSS-HOSPITAL ACCESS FLOW

### Scenario: Patient Arrives at New Hospital

**Step 1: Search Patient**
```
Hospital B searches: "Maria Kamau" or "+255712345678"
System returns: AFYA-TZA-4B2C-8F91
```

**Step 2: View Summary**
```
Hospital B sees:
- Basic info
- Red flags (pregnant, hypertension)
- Current medications
- Last 2 visits
```

**Step 3: Request Full Records**
```
Hospital B clicks "Request full records from Mwanza HC"
```

**Step 4: Patient Consent**
```
Patient receives SMS:
"Dodoma Hospital inauomba rekodi zako kutoka Mwanza HC. 
Kubali? Reply 1=Yes, 2=No"
```

**Step 5: Record Transfer**
```
If approved:
- Full records pulled from Mwanza HC
- Attached to patient timeline
- Access logged
```

### Technical Implementation
```javascript
// Cross-facility record request
async function requestPatientRecords(afyaID, requestingFacility, sourceFacility) {
  // 1. Check requesting facility authorization
  const authorized = await verifyFacility(requestingFacility);
  if (!authorized) throw new Error("Unauthorized facility");
  
  // 2. Request patient consent
  const patient = await getPatient(afyaID);
  const consentRequest = await sendConsentSMS(patient.phone, {
    requesting: requestingFacility.name,
    source: sourceFacility.name
  });
  
  // 3. Wait for consent (timeout 24h)
  const consent = await waitForConsent(consentRequest.id, timeout: 86400);
  
  // 4. If approved, fetch records
  if (consent.approved) {
    const records = await fetchRecords(sourceFacility, afyaID);
    await logAccess({
      patient: afyaID,
      accessor: requestingFacility,
      timestamp: new Date(),
      consent_id: consent.id
    });
    return records;
  }
  
  return { error: "Consent denied or expired" };
}
```

---

## 4️⃣ PREGNANT WOMEN MONITORING

### Automatic Pregnancy Tracking
```json
{
  "patient": "AFYA-TZA-4B2C-8F91",
  "pregnancy": {
    "active": true,
    "lmp": "2025-08-20",
    "edd": "2026-05-27",
    "gestational_age": 24,
    "risk_level": "high",
    "assigned_chw": "CHW-0847",
    "anc_schedule": [
      {"visit": 1, "date": "2025-09-15", "status": "completed"},
      {"visit": 2, "date": "2025-11-10", "status": "completed"},
      {"visit": 3, "date": "2026-01-15", "status": "completed"},
      {"visit": 4, "date": "2026-02-20", "status": "upcoming"}
    ],
    "missed_visits": 0,
    "danger_signs_reported": []
  }
}
```

### Missed Visit Alert System
```javascript
// Daily cron job
async function checkMissedANCVisits() {
  const pregnantPatients = await db.patients.find({ 
    "pregnancy.active": true 
  });
  
  for (const patient of pregnantPatients) {
    const nextVisit = patient.pregnancy.anc_schedule.find(
      v => v.status === "upcoming"
    );
    
    if (nextVisit && isPastDue(nextVisit.date, days: 3)) {
      // Alert patient
      await sendSMS(patient.phone, 
        `Dada ${patient.name}, umekosa miadi ya ANC. ` +
        `Tafadhali tembelea kituo cha afya.`
      );
      
      // Alert CHW
      await notifyCHW(patient.pregnancy.assigned_chw, {
        patient: patient.name,
        afya_id: patient.afya_id,
        action: "missed_anc_visit",
        priority: "high"
      });
      
      // Alert nearest facility
      await notifyFacility(patient.last_facility, {
        patient: patient.afya_id,
        issue: "missed_anc_visit"
      });
    }
  }
}
```

### Danger Sign Detection
```javascript
// Pregnancy danger signs (WHO IMCI)
const dangerSigns = [
  "vaginal_bleeding",
  "severe_headache",
  "blurred_vision",
  "severe_abdominal_pain",
  "fever",
  "reduced_fetal_movement",
  "fluid_leakage"
];

async function checkDangerSigns(afyaID, symptoms) {
  const hasDangerSign = symptoms.some(s => 
    dangerSigns.includes(s)
  );
  
  if (hasDangerSign) {
    // Immediate escalation
    await triggerEmergencyProtocol(afyaID, {
      type: "pregnancy_danger",
      symptoms: symptoms,
      nearest_hospital: await findNearestHospital(patient)
    });
  }
}
```

---

## 5️⃣ NEARBY FACILITIES DISCOVERY

### Facility Registry (Offline-Cached)
```json
{
  "facilities": [
    {
      "hfr_id": "HFR-1234",
      "name": "Mwanza Regional Hospital",
      "type": "hospital",
      "services": ["emergency", "maternity", "surgery", "imaging"],
      "coordinates": [-2.5164, 32.9175],
      "phone": "+255282500760",
      "hours": "24/7",
      "nhif_accepted": true
    },
    {
      "hfr_id": "HFR-5678",
      "name": "Nyamagana Health Center",
      "type": "health_center",
      "services": ["outpatient", "anc", "vaccination"],
      "coordinates": [-2.4618, 32.9139],
      "phone": "+255282501234",
      "hours": "08:00-17:00",
      "nhif_accepted": true
    }
  ]
}
```

### Geolocation Search
```javascript
// Find nearest facilities
async function findNearestFacilities(userLocation, filters = {}) {
  const allFacilities = await loadFacilityRegistry(); // Offline cache
  
  const nearby = allFacilities
    .map(facility => ({
      ...facility,
      distance: calculateDistance(userLocation, facility.coordinates)
    }))
    .filter(f => {
      if (filters.type && f.type !== filters.type) return false;
      if (filters.service && !f.services.includes(filters.service)) return false;
      if (filters.nhif && !f.nhif_accepted) return false;
      return true;
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
  
  return nearby;
}

// Patient view
const nearest = await findNearestFacilities(
  userGPS, 
  { service: "maternity", nhif: true }
);
```

### One-Tap Actions
```javascript
// UI Actions
<FacilityCard facility={facility}>
  <Button onClick={() => call(facility.phone)}>
    Call Hospital
  </Button>
  <Button onClick={() => navigate(facility.coordinates)}>
    Get Directions
  </Button>
  <Button onClick={() => initiateReferral(facility)}>
    Request Referral
  </Button>
</FacilityCard>
```

---

## 6️⃣ MEDICATION ADHERENCE TRACKING

### Multi-Reporter System
```json
{
  "patient": "AFYA-TZA-4B2C-8F91",
  "medication": "Methyldopa 250mg",
  "schedule": "2x daily (morning, evening)",
  "reporters": [
    {"type": "patient", "phone": "+255712345678"},
    {"type": "caregiver", "phone": "+255712999888", "name": "Mama Jane"},
    {"type": "chw", "id": "CHW-0847"}
  ],
  "adherence_log": [
    {"date": "2026-02-06", "morning": true, "evening": true, "reporter": "patient"},
    {"date": "2026-02-05", "morning": true, "evening": false, "reporter": "caregiver"},
    {"date": "2026-02-04", "morning": true, "evening": true, "reporter": "chw"}
  ]
}
```

### USSD Adherence Check-In
```
*123*2*1# → Medication Check

Dawa ya Maria leo?
1. Ameshatumia asubuhi na jioni
2. Ametumia asubuhi tu
3. Hajaanza bado
4. Sijui

[User selects 2]

Asante. Tutamkumbushia Maria asubuhi.
```

### SMS Daily Reminder
```javascript
// Daily medication reminder (cron)
async function sendMedicationReminders() {
  const patients = await db.medications.find({
    active: true,
    next_dose: { $lte: new Date() }
  });
  
  for (const patient of patients) {
    await sendSMS(patient.phone,
      `Kumbusho: Wakati wa kumeza dawa yako (${patient.medication}). ` +
      `Baada ya kutumia, reply YES.`
    );
  }
}

// Handle SMS response
async function handleAdherenceResponse(phone, message) {
  if (message.toLowerCase() === 'yes') {
    await logAdherence(phone, {
      timestamp: new Date(),
      confirmed: true,
      method: "sms"
    });
  }
}
```

### Missed Dose Alert
```javascript
// Alert clinician if 3+ consecutive misses
async function checkMissedDoses(afyaID) {
  const log = await getAdherenceLog(afyaID, days: 7);
  const missedConsecutive = log.filter(d => !d.taken).length;
  
  if (missedConsecutive >= 3) {
    const patient = await getPatient(afyaID);
    
    // Notify CHW
    await notifyCHW(patient.assigned_chw, {
      priority: "high",
      patient: patient.name,
      issue: `Missed ${missedConsecutive} doses of ${patient.medication}`
    });
    
    // Notify clinician
    await notifyClinician(patient.primary_provider, {
      patient: afyaID,
      alert: "medication_non_adherence"
    });
  }
}
```

---

## 7️⃣ PATIENT WELLNESS DASHBOARD

### What Patients See (Plain Language)
```json
{
  "wellness_summary": {
    "your_care_journey": {
      "status": "active",
      "type": "pregnancy",
      "week": 24,
      "next_visit": "2026-02-20",
      "message": "Everything looks good. Keep taking your medication."
    },
    "medication_streak": {
      "current": 18,
      "total": 30,
      "percentage": 60,
      "message": "You're doing well! 18 days in a row."
    },
    "upcoming": [
      {
        "type": "appointment",
        "date": "2026-02-20",
        "location": "Mwanza Health Center",
        "what_to_bring": ["NHIF card", "previous test results"]
      }
    ],
    "reminders": [
      "Take your medication this evening",
      "Drink plenty of water",
      "Rest when tired"
    ]
  }
}
```

### UI Design (No Medical Jargon)
```jsx
<WellnessDashboard>
  {/* Progress ring */}
  <ProgressRing value={60} label="Medication taken" />
  
  {/* Timeline */}
  <Timeline>
    <TimelineItem icon="check" color="green">
      Visited clinic on Jan 15
    </TimelineItem>
    <TimelineItem icon="pill" color="blue">
      18 days medication streak
    </TimelineItem>
    <TimelineItem icon="calendar" color="orange">
      Next visit: Feb 20
    </TimelineItem>
  </Timeline>
  
  {/* Simple health tip */}
  <HealthTip>
    "You're at 24 weeks. Your baby is about the size of a corn cob."
  </HealthTip>
</WellnessDashboard>
```

---

## 8️⃣ DIAGNOSTIC DATA INGESTION (3-TIER)

### Tier 1: Manual Upload
```javascript
// Hospital staff uploads PDF/image
async function uploadDiagnostic(file, metadata) {
  const uploaded = await storage.upload(file, {
    patient_id: metadata.afya_id,
    type: metadata.diagnostic_type,
    facility: metadata.facility_hfr_id,
    date: metadata.date,
    encryption: "AES-256"
  });
  
  // Attach to patient timeline
  await attachToTimeline(metadata.afya_id, {
    type: "diagnostic",
    file_id: uploaded.id,
    summary: metadata.summary,
    facility: metadata.facility_hfr_id
  });
  
  return { success: true, file_id: uploaded.id };
}
```

### Tier 2: Device Export (HL7/DICOM)
```javascript
// Auto-ingest from imaging equipment
async function ingestDICOM(dicomFile, facilityID) {
  const metadata = parseDICOM(dicomFile);
  
  // Match to patient
  const patient = await findPatient({
    name: metadata.patientName,
    dob: metadata.patientDOB,
    facility: facilityID
  });
  
  if (patient) {
    await uploadDiagnostic(dicomFile, {
      afya_id: patient.afya_id,
      diagnostic_type: metadata.modality,
      facility_hfr_id: facilityID,
      date: metadata.studyDate
    });
  }
}
```

### Tier 3: AI-Assisted Summary (Staff Only)
```javascript
// AI suggests findings (assistive only)
async function generateDiagnosticSummary(fileID, clinicianID) {
  const file = await storage.fetch(fileID);
  const aiAnalysis = await runImagingAI(file); // TFLite model
  
  return {
    file_id: fileID,
    ai_confidence: aiAnalysis.confidence,
    suggested_findings: aiAnalysis.findings,
    disclaimer: "AI-assisted. Clinician review required.",
    reviewed_by: null, // Clinician must confirm
    timestamp: new Date()
  };
}

// Clinician reviews and confirms
async function confirmDiagnostic(fileID, clinicianID, findings) {
  await db.diagnostics.update(fileID, {
    reviewed_by: clinicianID,
    confirmed_findings: findings,
    ai_used: true,
    final_report: true,
    timestamp: new Date()
  });
}
```

---

## 9️⃣ SECURITY & GOVERNANCE

### Role-Based Access Control
```json
{
  "roles": {
    "patient": {
      "can_view": ["own_summary", "own_timeline"],
      "can_edit": ["contact_info"],
      "can_share": ["consent_management"]
    },
    "chw": {
      "can_view": ["assigned_patients_summary"],
      "can_edit": ["visit_logs", "adherence_reports"],
      "can_share": ["referrals"]
    },
    "clinician": {
      "can_view": ["patient_full_records"],
      "can_edit": ["clinical_notes", "prescriptions"],
      "can_request": ["cross_facility_records"]
    },
    "facility_admin": {
      "can_view": ["facility_patients", "analytics"],
      "can_manage": ["staff_access", "facility_settings"]
    },
    "moh": {
      "can_view": ["anonymized_analytics", "population_health"],
      "can_audit": ["all_access_logs"]
    }
  }
}
```

### Audit Log (Every Action Logged)
```json
{
  "log_id": "LOG-20260206-0001",
  "timestamp": "2026-02-06T14:23:45Z",
  "action": "view_patient_record",
  "actor": {
    "id": "CLN-8472",
    "name": "Dr. John Mwita",
    "facility": "HFR-1234",
    "role": "clinician"
  },
  "subject": {
    "afya_id": "AFYA-TZA-4B2C-8F91",
    "consent_id": "CONSENT-12847"
  },
  "ip_address": "41.93.x.x",
  "device": "AfyaAI_Web",
  "result": "success"
}
```

### Consent Management
```javascript
// Patient grants/revokes access
async function manageConsent(patientID, facilityID, action) {
  if (action === "grant") {
    await db.consents.create({
      patient: patientID,
      facility: facilityID,
      granted_at: new Date(),
      expires_at: addDays(new Date(), 90), // 90-day default
      scope: "summary_and_diagnostics"
    });
  } else if (action === "revoke") {
    await db.consents.delete({
      patient: patientID,
      facility: facilityID
    });
  }
}

// Check consent before access
async function canAccessRecords(facilityID, patientID) {
  const consent = await db.consents.findOne({
    patient: patientID,
    facility: facilityID,
    expires_at: { $gt: new Date() }
  });
  
  return !!consent;
}
```

---

## 🔟 GOVERNMENT TRUST MODEL

### Why MoH Will Accept This

1. **Facility Data Sovereignty**
   - Each facility owns its data
   - No central government database
   - Records stay local unless shared

2. **National Visibility Without Control**
   - MoH sees aggregated trends
   - Cannot access individual records
   - Privacy-preserving analytics

3. **Incremental Rollout**
   - Start with 2-3 pilot facilities
   - Expand region by region
   - No "big bang" deployment

4. **Works Offline**
   - Rural clinics can participate
   - No constant internet dependency
   - Syncs when connection available

5. **Auditable & Compliant**
   - Every access logged
   - PDPA compliant
   - TMDA SaMD approved

---

## ✅ WHAT THIS SOLVES

| Problem | Solution |
|---------|----------|
| Patients move, records don't | AfyaID + portable summary |
| Hospitals can't collaborate | Federated record sharing |
| Pregnant women get lost | Automatic maternal monitoring |
| Medication adherence invisible | Multi-reporter tracking |
| Diagnostics stay trapped | 3-tier ingestion + sharing |
| No continuity of care | Cross-facility patient timeline |
| Government fears centralization | Federated model preserves sovereignty |

---

## 🚀 DEPLOYMENT ROADMAP

### Phase 1: Pilot (3 months)
- 2 hospitals (1 urban, 1 rural)
- 50 CHWs
- 1,000 patients
- Test federated record sharing

### Phase 2: Regional (6 months)
- 10 facilities
- 200 CHWs
- 10,000 patients
- Pregnancy monitoring at scale

### Phase 3: National (12+ months)
- All regions
- Integration with HFR/DHIS2
- Full MoH dashboard

---

**Built for Tanzania 🇹🇿 | Federated, Not Centralized 🌍 | Records Follow Patients 💚**
