# 🔬 CLINICAL VALIDATION STUDY PROTOCOL

**Study Title:** Validation of AfyaCare Tanzania Symptom Assessment System Against Clinician Triage in Primary Care Settings

**Protocol Version:** 1.0  
**Date:** February 22, 2026  
**Status:** READY FOR IRB SUBMISSION

---

## 📋 EXECUTIVE SUMMARY

### Purpose
Validate the clinical accuracy and safety of AfyaCare Tanzania's symptom assessment system by comparing its triage recommendations against expert clinician assessments in real-world Tanzanian primary care settings.

### Study Design
Prospective, observational, multi-center validation study

### Timeline
6 months (3 months data collection + 3 months analysis)

### Sample Size
N = 500 patients (minimum) across 3-5 health facilities

### Primary Outcome
Agreement between system triage level and clinician triage level (Cohen's Kappa ≥ 0.70 target)

### Regulatory Status
- TMDA SaMD Class A (advisory only)
- IRB approval required before start
- PDPA compliant data handling

---

## 🎯 STUDY OBJECTIVES

### Primary Objective
Measure concordance between AfyaCare symptom assessment system and expert clinician triage for:
- Emergency vs. non-emergency classification
- Urgency level assignment (emergency/urgent/moderate/mild)

### Secondary Objectives
1. **Safety:** Measure false negative rate for emergency conditions
2. **Sensitivity:** Measure system's ability to detect true emergencies
3. **Specificity:** Measure system's ability to identify non-emergencies
4. **Usability:** Assess patient comprehension and completion rates
5. **Equity:** Test for bias across age, gender, rural/urban, language groups
6. **Time:** Compare time to triage (system vs. clinician)

### Exploratory Objectives
1. Identify symptom patterns where system underperforms
2. Measure patient satisfaction and trust
3. Assess impact on clinic workflow
4. Evaluate Swahili language comprehension

---

## 👥 STUDY POPULATION

### Inclusion Criteria
- **Age:** ≥18 years (adult population)
- **Setting:** Presenting to participating health facilities with new symptoms
- **Consent:** Able and willing to provide informed consent
- **Language:** Able to communicate in Swahili or English
- **Technology:** Able to interact with smartphone/tablet interface OR assisted by study staff

### Exclusion Criteria
- **Emergency:** Patients requiring immediate life-saving interventions (study staff will bypass system)
- **Cognitive:** Unable to understand and respond to symptom questions
- **Prior:** Already assessed by AfyaCare system within last 7 days for same complaint
- **Consent:** Declines participation or unable to provide informed consent

### Study Sites (Proposed)
1. **Mwananyamala Hospital** (Dar es Salaam) - Urban referral hospital
2. **Kigogo Health Center** (Dar es Salaam) - Urban primary care
3. **Tandale Dispensary** (Dar es Salaam) - Urban community clinic
4. **Rural Health Center** (Morogoro Region) - Rural primary care
5. **District Hospital** (Mbeya Region) - Semi-urban referral

**Rationale:** Diverse settings ensure validation across urban/rural, resource levels, and patient populations.

---

## 📊 STUDY DESIGN & METHODOLOGY

### Study Flow

```
Patient presents with symptoms
    ↓
[Study staff approach patient]
    ↓
Explain study + Obtain consent
    ↓
━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: System Assessment
━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Patient completes AfyaCare symptom checker
(Study staff assist if needed, but don't influence answers)
    ↓
System generates triage recommendation
    ↓
[BLIND] - System result sealed in envelope, NOT shared with clinician
    ↓
━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Clinician Assessment
━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Expert clinician performs standard triage
(Blind to system recommendation)
    ↓
Clinician records:
  - Triage level (emergency/urgent/moderate/mild)
  - Provisional diagnosis
  - Disposition (admit/refer/discharge/observe)
    ↓
━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: Comparison
━━━━━━━━━━━━━━━━━━━━━━━
    ↓
Study staff compare results
    ↓
Record agreement/disagreement
    ↓
━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: Follow-up (subset)
━━━━━━━━━━━━━━━━━━━━━━━
    ↓
48-hour follow-up call (20% random sample)
    ↓
Record outcomes:
  - Symptom resolution
  - Hospital admission
  - Adverse events
```

### Blinding Strategy
**Critical:** Clinician assessment MUST be blind to system recommendation to avoid bias.

**Implementation:**
1. System result printed and sealed in envelope
2. Clinician completes assessment before envelope opened
3. Study coordinator compares results after both complete
4. If discordance detected, senior clinician reviews case (for safety)

### Sample Size Calculation

**Target Kappa:** κ ≥ 0.70 (substantial agreement)  
**Expected Agreement:** 80%  
**Alpha:** 0.05  
**Power:** 90%  
**Required Sample:** N = 450

**With 10% loss to follow-up:** N = 500

**Stratification:**
- Emergency: 50 cases (10%)
- Urgent: 150 cases (30%)
- Moderate: 200 cases (40%)
- Mild: 100 cases (20%)

---

## 📈 DATA COLLECTION

### Case Report Form (CRF) Elements

#### Patient Demographics
- Age, gender
- Language preference (Swahili/English)
- Education level
- Rural vs. urban residence
- Previous healthcare technology use

#### System Assessment Data
- Start time, completion time
- Number of questions answered
- Questions skipped
- Final triage level
- Confidence score
- Red flags detected
- Emergency button triggered (yes/no)

#### Clinician Assessment Data
- Start time, completion time
- Chief complaint
- Triage level assigned
- Vital signs (BP, HR, RR, temp, SpO2)
- Provisional diagnosis
- Disposition (home/observe/admit/refer)
- Clinician confidence (1-5 scale)

#### Agreement Analysis
- Concordant vs. discordant
- If discordant: direction (over-triage vs. under-triage)
- Clinical significance of discordance

#### Usability Data (Patient Survey)
- Questions easy to understand (1-5)
- Comfortable using system (1-5)
- Trust in recommendation (1-5)
- Would use again (yes/no)
- Technical difficulties (yes/no)

#### Safety Monitoring
- Adverse events within 48 hours
- Missed emergencies (false negatives)
- Inappropriate reassurance
- System errors/crashes

---

## 📊 STATISTICAL ANALYSIS PLAN

### Primary Analysis
**Cohen's Kappa (κ)** for agreement between system and clinician triage

**Interpretation:**
- κ < 0.40: Poor agreement
- κ 0.40-0.60: Moderate agreement
- κ 0.60-0.80: Substantial agreement
- κ > 0.80: Almost perfect agreement

**Target:** κ ≥ 0.70

### Secondary Analyses

#### 1. Diagnostic Performance Metrics

For **emergency detection** (binary: emergency vs. non-emergency):

| Metric | Formula | Target |
|--------|---------|--------|
| Sensitivity | TP / (TP + FN) | ≥ 95% |
| Specificity | TN / (TN + FP) | ≥ 80% |
| PPV | TP / (TP + FP) | ≥ 50% |
| NPV | TN / (TN + FN) | ≥ 99% |

**Critical:** **Sensitivity ≥ 95%** for emergency detection (minimize false negatives)

#### 2. Safety Analysis

**False Negative Rate** = FN / (TP + FN)

**Target:** < 5% for emergency conditions

**Critical Safety Threshold:** ZERO missed life-threatening emergencies

**Cases requiring detailed review:**
- All false negatives (system said non-emergency, clinician said emergency)
- All adverse outcomes within 48 hours

#### 3. Subgroup Analyses

Test for bias/differential performance across:

| Subgroup | Analysis |
|----------|----------|
| **Age** | <40 vs. ≥40 years |
| **Gender** | Male vs. Female |
| **Language** | Swahili vs. English |
| **Setting** | Urban vs. Rural |
| **Education** | Primary vs. Secondary+ |
| **Pregnancy** | Pregnant vs. Not pregnant (females) |

**Method:** Compare kappa coefficients across subgroups

**Equity Target:** No subgroup kappa < 0.60

#### 4. Time Efficiency

**System completion time:** Target < 5 minutes  
**Clinician triage time:** Measured for comparison

**Hypothesis:** System reduces triage wait time

#### 5. Usability Analysis

**Completion rate:** Target > 95%  
**Skip rate:** Target < 10%  
**Patient satisfaction:** Target > 4.0/5.0

---

## 🔬 VALIDATION CRITERIA (SUCCESS DEFINITION)

### Primary Success Criterion
✅ **Cohen's Kappa ≥ 0.70** (substantial agreement)

### Critical Safety Criteria (All must pass)
✅ **Sensitivity ≥ 95%** for emergency detection  
✅ **False negative rate < 5%**  
✅ **ZERO missed life-threatening emergencies**

### Secondary Success Criteria
✅ Specificity ≥ 80% (avoid over-triage)  
✅ No significant bias across subgroups  
✅ Patient satisfaction ≥ 4.0/5.0  
✅ Completion rate ≥ 95%

### If Study FAILS Primary Criterion

**Action Plan:**
1. Detailed failure mode analysis
2. Identify symptom patterns with poor performance
3. Revise triage algorithms
4. Conduct second validation study
5. **DO NOT deploy until criteria met**

---

## ⚖️ ETHICAL CONSIDERATIONS

### IRB Approval Required
- National Institute for Medical Research (NIMR), Tanzania
- Institutional Review Boards at participating sites

### Informed Consent
**Key Points to Communicate:**
- This is a research study validating a new system
- Participation is voluntary
- Your care will NOT depend on system recommendation
- Clinician will make final triage decision
- Your data will be confidential and encrypted
- You can withdraw at any time

**Consent Process:**
- Written informed consent (Swahili + English versions)
- Study staff explains study verbally
- Patient has opportunity to ask questions
- Copy of consent form provided

### Patient Safety Protections

#### 1. Real-time Safety Monitoring
- If system recommends "mild" but patient appears unwell to study staff → immediately alert clinician
- Study staff trained to recognize emergency signs

#### 2. Clinician Override
- Clinician assessment is ALWAYS final
- System recommendation is advisory only
- If discordance, clinician decision prevails

#### 3. Adverse Event Reporting
- All adverse events within 48 hours reported to IRB
- Serious adverse events (death, hospitalization) reported within 24 hours
- Study paused if pattern of harm detected

#### 4. Data Safety Monitoring Board (DSMB)
- Independent committee reviews safety data monthly
- Authority to pause or stop study if safety concerns arise

### Privacy & Confidentiality

**PDPA Compliance:**
- All patient data encrypted at rest (AES-256)
- No patient names in research database (study IDs only)
- Data access restricted to study team
- Data stored on secure servers in Tanzania
- Patients can request data deletion after study

**Data Retention:**
- Research data: 5 years post-publication (regulatory requirement)
- Patient identifiers: Deleted after 48-hour follow-up complete

---

## 📋 REGULATORY REQUIREMENTS

### TMDA Registration

**Classification:** SaMD Class A (lowest risk)

**Justification:**
- Advisory only, not diagnostic
- Requires clinician validation
- Preliminary triage guidance

**Documents Required:**
1. Clinical validation study report (this study)
2. Risk management file
3. Software documentation
4. User manual
5. PDPA compliance certificate

**Timeline:** Submit after validation study complete (6-9 months)

### Tanzania PDPA Compliance

**Requirements:**
- Data Protection Impact Assessment (DPIA) completed
- Data Processing Agreement with facilities
- Patient consent for data processing
- Right to access, rectify, delete data
- Encrypted data storage and transmission

**Status:** DPIA draft ready, requires IRB review

---

## 📅 STUDY TIMELINE

### Month 1: Preparation
- IRB submission and approval
- Site agreements signed
- Staff training
- CRF finalization
- Pilot testing (n=20 patients)

### Months 2-4: Data Collection
- Patient enrollment: Target 40-50 patients/week/site
- Weekly data quality checks
- Monthly DSMB safety reviews
- Interim analysis at n=250 (futility check)

### Month 5: Follow-up & Data Cleaning
- Complete 48-hour follow-ups
- Database lock
- Data quality audit
- Missing data handling

### Month 6: Analysis & Reporting
- Statistical analysis
- Manuscript preparation
- TMDA report compilation
- Results presentation to stakeholders

---

## 💰 BUDGET ESTIMATE (USD)

| Category | Cost |
|----------|------|
| **Personnel** | |
| - Study coordinator (6 months) | $6,000 |
| - Data entry clerks (2 × 6 months) | $4,000 |
| - Site coordinators (5 sites × 4 months) | $5,000 |
| **Equipment** | |
| - Tablets for data collection (10) | $3,000 |
| - Printer for CRFs | $200 |
| **Site Costs** | |
| - Site activation fees (5 sites) | $2,500 |
| - Patient reimbursement (500 × $2) | $1,000 |
| **Regulatory** | |
| - IRB fees (NIMR + local) | $1,500 |
| - TMDA application fee | $500 |
| **Analysis** | |
| - Biostatistician (50 hours) | $2,500 |
| **Dissemination** | |
| - Conference presentation | $1,500 |
| - Publication fees | $1,000 |
| **Contingency (10%)** | $2,870 |
| **TOTAL** | **$31,570** |

---

## 📚 REFERENCES & GUIDELINES

### Clinical Standards
1. WHO IMAI (Integrated Management of Adolescent and Adult Illness)
2. WHO ETAT+ (Emergency Triage Assessment and Treatment Plus)
3. Tanzania Standard Treatment Guidelines (2017)
4. Tanzania National Guidelines for Clinical Management

### Regulatory Guidelines
1. TMDA Guidelines on Software as a Medical Device (2022)
2. Tanzania Personal Data Protection Act (PDPA) 2022
3. WHO Guidance on Ethics and Governance of AI for Health (2021)

### Study Design Standards
1. STARD (Standards for Reporting Diagnostic Accuracy Studies)
2. TRIPOD (Transparent Reporting of Prediction Models)
3. CONSORT-AI (AI-specific reporting)

---

## 📊 DATA COLLECTION FORMS

### Form 1: Patient Enrollment Log

```
Study ID: ___________
Date: ___/___/______
Site: _______________

Demographics:
- Age: _____ years
- Gender: ☐ Male ☐ Female ☐ Other
- Language: ☐ Swahili ☐ English
- Residence: ☐ Urban ☐ Rural
- Education: ☐ None ☐ Primary ☐ Secondary ☐ Tertiary

Chief Complaint: _________________________________

Time of presentation: _____:_____
```

### Form 2: System Assessment Record

```
Study ID: ___________

System Start Time: _____:_____
System End Time: _____:_____
Total Duration: _____ minutes

Questions Answered: _____ / _____
Questions Skipped: _____

System Triage Result:
☐ Emergency
☐ Urgent  
☐ Moderate
☐ Mild

Confidence Score: _____% 

Red Flags Detected: ☐ Yes ☐ No
If yes, specify: _________________________________

Emergency Button Triggered: ☐ Yes ☐ No

System Recommendation:
_________________________________________________
_________________________________________________

Technical Issues: ☐ None ☐ Occurred
If occurred, describe: ____________________________
```

### Form 3: Clinician Assessment Record

```
Study ID: ___________

[Complete AFTER system assessment, BEFORE viewing system result]

Clinician: _________________
Start Time: _____:_____
End Time: _____:_____

Vital Signs:
- BP: _____/_____  
- HR: _____
- RR: _____  
- Temp: _____°C
- SpO2: _____%

Chief Complaint: _________________________________

Clinical History: ________________________________
_________________________________________________

Physical Examination Findings: __________________
_________________________________________________

Clinician Triage Level:
☐ Emergency - immediate attention required
☐ Urgent - attention within 2-6 hours
☐ Moderate - attention within 1-2 days
☐ Mild - self-care appropriate

Provisional Diagnosis: ___________________________

Disposition:
☐ Discharge home
☐ Observation (specify duration: ______)
☐ Admission
☐ Refer to higher level

Clinician Confidence in Triage: 
☐ 1-Very uncertain ☐ 2 ☐ 3-Moderately confident ☐ 4 ☐ 5-Very confident
```

### Form 4: Agreement Analysis

```
Study ID: ___________

[Complete AFTER both assessments]

System Triage: _______________
Clinician Triage: _______________

Agreement: ☐ Concordant ☐ Discordant

If Discordant:
Direction: ☐ System over-triaged ☐ System under-triaged

Severity: 
☐ Minor (1 level difference, e.g., urgent vs moderate)
☐ Major (2+ levels, e.g., emergency vs moderate)

Clinical Significance:
☐ Low - no impact on care
☐ Moderate - delayed appropriate care
☐ High - potential harm

Senior Clinician Review Required: ☐ Yes ☐ No

If reviewed, outcome: ____________________________
```

### Form 5: Patient Usability Survey

```
Study ID: ___________

[Administered AFTER clinical care complete]

1. The questions were easy to understand:
   ☐ 1-Strongly disagree ☐ 2 ☐ 3-Neutral ☐ 4 ☐ 5-Strongly agree

2. I was comfortable using the system:
   ☐ 1-Strongly disagree ☐ 2 ☐ 3-Neutral ☐ 4 ☐ 5-Strongly agree

3. I trust the system's recommendation:
   ☐ 1-Strongly disagree ☐ 2 ☐ 3-Neutral ☐ 4 ☐ 5-Strongly agree

4. I would use this system again:
   ☐ Yes ☐ No ☐ Unsure

5. Did you experience any difficulties?
   ☐ No ☐ Yes, specify: __________________________

6. How long did it take? (patient perception)
   ☐ Too long ☐ About right ☐ Very quick

7. Do you have any suggestions?
   _____________________________________________
```

### Form 6: 48-Hour Follow-up (Phone Call)

```
Study ID: ___________
Follow-up Date: ___/___/______
Attempted: ☐ 1st ☐ 2nd ☐ 3rd
Reached: ☐ Yes ☐ No

If reached:

1. How are your symptoms now?
   ☐ Resolved
   ☐ Improved
   ☐ Same
   ☐ Worse

2. Did you seek additional medical care?
   ☐ No
   ☐ Yes - Clinic visit
   ☐ Yes - Emergency department
   ☐ Yes - Hospital admission

3. Any adverse events?
   ☐ None
   ☐ Yes, describe: ____________________________

4. Outcome classification:
   ☐ Good outcome (symptoms resolved, no complications)
   ☐ Neutral outcome (ongoing symptoms but stable)
   ☐ Poor outcome (hospitalization, complications)
   ☐ Serious adverse event (death, permanent harm)

If serious adverse event: REPORT TO IRB WITHIN 24 HOURS
```

---

## 🚨 SAFETY MONITORING PROTOCOLS

### Real-Time Safety Triggers (STOP and REVIEW)

**Trigger 1: False Negative Pattern**
- If ≥3 cases where system says "mild" but clinician says "emergency"
- Action: Pause enrollment, conduct urgent review

**Trigger 2: Adverse Outcome**
- Any patient death or permanent harm within 48 hours
- Action: Immediate DSMB review, assess causality

**Trigger 3: Technical Failure**
- System crash rate >5%
- Action: Pause enrollment, fix technical issues

**Trigger 4: Low Clinician Confidence**
- If >30% of clinicians rate confidence as 1-2 in system recommendations
- Action: Investigate root causes

### Monthly DSMB Review

**Data Reviewed:**
- Enrollment rate
- Adverse events
- Agreement rates (cumulative)
- False negative rate
- Patient withdrawals

**DSMB Authority:**
- Recommend study continuation
- Recommend protocol modifications
- Recommend study pause or termination

---

## 📄 DELIVERABLES

### Month 6 (Study Completion)

1. **Final Study Report** (100-150 pages)
   - Executive summary
   - Methods
   - Results (with tables and figures)
   - Discussion
   - Conclusions and recommendations

2. **TMDA Submission Package**
   - Clinical validation report
   - Statistical analysis plan and results
   - Safety data
   - Usability data

3. **Scientific Manuscript**
   - For submission to peer-reviewed journal
   - Target: *BMJ Open, PLOS ONE, or JMIR*

4. **Policy Brief** (2-page summary for MoH)

5. **Dataset** (de-identified for future research)

---

## ✅ READINESS CHECKLIST

### Before IRB Submission
- [ ] Protocol finalized
- [ ] CRFs developed and pilot-tested
- [ ] Site agreements drafted
- [ ] Patient consent forms (Swahili + English)
- [ ] PDPA Data Protection Impact Assessment
- [ ] Study staff training materials
- [ ] Budget approved
- [ ] Data management plan
- [ ] Statistical analysis plan

### Before Patient Enrollment
- [ ] IRB approval received
- [ ] Sites activated
- [ ] Staff trained
- [ ] Tablets configured
- [ ] Pilot testing complete (n=20)
- [ ] DSMB constituted
- [ ] Adverse event reporting system active

---

## 📞 STUDY CONTACTS

**Principal Investigator:** [Name, MD, MPH]  
**Study Coordinator:** [Name]  
**Biostatistician:** [Name]  
**DSMB Chair:** [Name]  

**Emergency Contact:** +255-XXX-XXXXXX (24/7)

---

**Protocol Approval:**

Principal Investigator: __________________ Date: _______

IRB Chair: __________________ Date: _______

TMDA Representative: __________________ Date: _______

---

**END OF PROTOCOL**

*This protocol is ready for IRB submission and represents a rigorous, ethical, and scientifically sound approach to validating the AfyaCare Tanzania symptom assessment system.*
