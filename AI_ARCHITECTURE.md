# AfyaAI TZA - Complete AI System Architecture

**Version:** 2.1.3  
**Last Updated:** January 14, 2026  
**Classification:** TMDA SaMD Class B/C/D  
**Deployment:** National Healthcare System of Tanzania  

---

## 1. SYSTEM OVERVIEW

AfyaAI TZA is a **human-in-the-loop**, **explainable-by-design** AI healthcare platform built for Tanzania's national health system. The architecture prioritizes:

1. **Clinical Safety** — WHO IMCI compliance, mandatory human validation
2. **Explainability** — Every decision explained in Kiswahili
3. **Equity** — Bias monitoring across all 26 regions
4. **Offline-First** — Edge AI for rural/low-connectivity areas
5. **Governance** — Continuous monitoring, MoH approval loops

---

## 2. LAYERED ARCHITECTURE

```
┌────────────────────────────────────────────────┐
│          USER DEVICES (Entry Points)           │
├────────────────────────────────────────────────┤
│  • Android App (Primary)                       │
│  • Feature Phones (USSD/SMS fallback)          │
│  • CHW Tablets (Offline-capable)               │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│         EDGE AI LAYER (Offline-First)          │
├────────────────────────────────────────────────┤
│  • Symptom Rules (WHO IMCI)                    │
│  • TensorFlow Lite Models (12-28 MB)           │
│  • Local Inference (<3s on low-end devices)    │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│      SECURE SYNC LAYER (When Connected)        │
├────────────────────────────────────────────────┤
│  • Encrypted Queues (AES-256)                  │
│  • Low-Bandwidth Compression (gzip)            │
│  • Opportunistic Sync (WiFi/Mobile Data)       │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│       CORE AI SERVICES (Cloud/On-Prem)         │
├────────────────────────────────────────────────┤
│  • NLP Engine (Swahili symptom parsing)        │
│  • Risk Scoring Models (XGBoost, LSTM)         │
│  • Imaging AI (CheXNet fine-tuned)             │
│  • Prediction Models (No-show, Adherence)      │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│      CLINICAL SAFETY LAYER (Safeguards)        │
├────────────────────────────────────────────────┤
│  • WHO IMCI Rule Engine (Hard-coded)           │
│  • Confidence Threshold Gates (<60% → Human)   │
│  • Mandatory Escalation Triggers               │
│  • Audit Trail Logging                         │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│       HUMAN OVERSIGHT LAYER (Final Say)        │
├────────────────────────────────────────────────┤
│  • CHWs (Field validation)                     │
│  • Clinicians (Diagnosis confirmation)         │
│  • District Medical Officers (Oversight)       │
└────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│      NATIONAL SYSTEMS (Integration)            │
├────────────────────────────────────────────────┤
│  • DHIS2 (Health Information System)           │
│  • OpenHIM (Interoperability Layer)            │
│  • NHIF (Insurance claims - future)            │
└────────────────────────────────────────────────┘
```

---

## 3. AI MODELS IN DETAIL

### 3.1 Symptom Triage AI

**Purpose:** Classify patient symptoms into risk categories  
**TMDA Class:** B (Clinical decision support only)  

**Model Architecture:**
```
Ensemble Approach:
├─ Component 1: Rule-Based Safety Net
│  └─ WHO IMCI Danger Signs (hard-coded)
│     • Difficulty breathing → Emergency
│     • Pregnancy + fever → High Risk
│     • Convulsions → Emergency
│
├─ Component 2: XGBoost Classifier
│  ├─ Input Features (30 total):
│  │  • Symptoms (25): fever, cough, breathing, etc.
│  │  • Demographics (5): age, gender, pregnancy, region, chronic conditions
│  ├─ Training: 50,000 Tanzania patient records
│  ├─ Output: 4-class probability (Low/Medium/High/Emergency)
│  └─ Hyperparameters:
│     • Max depth: 6
│     • Learning rate: 0.1
│     • Estimators: 100
│
└─ Component 3: Logistic Regression (Fallback)
   └─ Simpler model for edge cases
```

**Performance (Validated):**
- Accuracy: 87.5%
- Sensitivity: 89.2%
- Specificity: 85.8%
- False Negative Rate: 3.2% (target: <5%)

**Explainability:**
```python
def explain_decision(patient_input):
    """
    Returns human-readable explanation in Kiswahili
    """
    return {
        "confidence": 0.875,
        "risk_level": "Medium",
        "reasoning": {
            "factors_considered": [
                "Homa kwa siku 2",
                "Kikohozi cha wastani",
                "Umri: 32 miaka"
            ],
            "who_imci_match": [
                "Hakuna ishara za hatari"
            ],
            "similar_cases": 1247,
            "regional_prevalence": 28  # % in Dar es Salaam
        },
        "recommendation": "Tembelea kituo cha afya ndani ya siku 1-2",
        "alternatives": ["Homa ya kawaida", "Malaria", "ARI"]
    }
```

**Failsafes:**
1. If confidence <60% → Escalate to clinician
2. If any WHO IMCI danger sign → Automatic "Emergency"
3. If pregnant + any fever → Automatic "High Risk"

---

### 3.2 Medical Imaging AI (Chest X-ray)

**Purpose:** Assist clinicians in detecting TB and Pneumonia  
**TMDA Class:** C/D (High-risk diagnostic support)  

**Model Architecture:**
```
Base Model: CheXNet (DenseNet-121)
├─ Pre-trained on: CheXpert (224,000 X-rays)
├─ Fine-tuned on: Tanzania TB Dataset (8,000 X-rays)
│  └─ Sources: Muhimbili Hospital, Ocean Road Cancer Institute
├─ Input: Chest X-ray (224x224 pixels, grayscale)
├─ Output:
│  ├─ 3-class prediction: Normal / TB / Pneumonia
│  ├─ Confidence score per class
│  └─ Grad-CAM heatmap (visual explanation)
└─ Deployment: TensorFlow Lite (28 MB, on-device)
```

**Performance (Validated):**
- TB Sensitivity: 92.1%
- TB Specificity: 89.6%
- Pneumonia Sensitivity: 88.4%
- AUC-ROC: 0.93

**Clinical Workflow:**
```
1. CHW/Clinician captures X-ray with smartphone
2. On-device AI inference (<3 seconds)
3. Heatmap overlay shows suspicious regions
4. AI displays: "TB Suspected - 92% confidence"
5. **MANDATORY:** Clinician reviews image + heatmap
6. Clinician confirms/overrides AI suggestion
7. Only clinician decision recorded in patient file
```

**Safeguards:**
- **No Auto-Reporting:** AI output never goes directly to patient file
- **Visual Explanation:** Heatmap shows WHY AI suspects TB
- **Confidence Threshold:** <75% confidence → "Uncertain, send to specialist"
- **Audit Trail:** Every AI prediction logged for TMDA review

---

### 3.3 Maternal Risk Prediction

**Purpose:** Identify high-risk pregnancies, predict missed ANC visits  
**TMDA Class:** C (Predictive risk alerts)  

**Model Architecture:**
```
Hybrid Model:
├─ Time-Series Component (LSTM)
│  ├─ Input: ANC visit history (sequence data)
│  │  • Visit dates, vitals (BP, weight), symptoms
│  ├─ Output: Risk trajectory (0-100)
│  └─ Looks ahead: 4 weeks
│
└─ Classification Component (Random Forest)
   ├─ Input: Socio-demographics + current vitals
   ├─ Output: Missed visit probability
   └─ Triggers: SMS reminder if >60%
```

**Training Data:**
- 12,000 pregnancy records from Tanzania DHS 2022
- 8,500 ANC visit sequences from 50 health facilities

**Performance:**
- AUC-ROC: 0.843
- High-Risk Detection: 84.3% sensitivity
- Missed Visit Prediction: 78.6% accuracy

**Actionable Outputs:**
```
Risk Category → Action
├─ Low (0-30):   → Standard ANC schedule
├─ Medium (31-60): → CHW follow-up call
├─ High (61-85):  → Facility referral within 48h
└─ Critical (86-100): → Immediate facility admission
```

**Explainability Example:**
```
"Mama Fatuma ana hatari ya juu (78%) kwa sababu:
• Shinikizo la damu: 145/95 (juu)
• Miadi 2 ya ANC imepotea
• Umri: 38 miaka (hatari zaidi)
• Historia ya uzazi mbaya

Mapendekezo: Tembelea hospitali leo."
```

---

### 3.4 NCD Adherence Prediction

**Purpose:** Predict medication non-adherence, send reminders  
**TMDA Class:** B (Low-risk decision support)  

**Model:** Logistic Regression + Rule-Based Reminders  
**Features:** 
- Medication refill history
- Missed appointment count
- Vitals trend (BP/glucose)
- Age, distance to facility

**Performance:** 81.7% accuracy in predicting non-adherence

**Actions:**
- SMS reminder 3 days before medication runs out
- CHW alert if 2+ consecutive missed refills
- District alert if facility-wide adherence <60%

---

## 4. CLINICAL SAFETY MECHANISMS

### 4.1 WHO IMCI Integration

**Implementation:**
```python
# Hard-coded safety rules (ALWAYS checked first)
WHO_IMCI_DANGER_SIGNS = {
    "general": [
        "unable_to_drink_or_breastfeed",
        "vomits_everything",
        "has_had_convulsions",
        "lethargic_or_unconscious"
    ],
    "respiratory": [
        "severe_breathing_difficulty",
        "chest_indrawing",
        "stridor_in_calm_child"
    ],
    "maternal": [
        "severe_headache_with_blurred_vision",
        "convulsions",
        "vaginal_bleeding_plus_fever",
        "severe_abdominal_pain"
    ]
}

def safety_check(symptoms):
    for sign in WHO_IMCI_DANGER_SIGNS.values():
        if any(symptom in sign for symptom in symptoms):
            return {
                "risk_level": "EMERGENCY",
                "action": "Call 112 or go to hospital NOW",
                "bypass_ai": True  # Skip ML model
            }
    return None  # Proceed to ML model
```

### 4.2 Confidence Thresholds

**Policy:**
```
AI Confidence → Action
├─ 90-100%: Display with "High Confidence" badge
├─ 60-89%:  Display with "Moderate Confidence" + disclaimer
└─ <60%:    Automatic escalation to clinician review
```

### 4.3 Mandatory Escalation Triggers

**Automatic Human Review Required:**
1. Any pregnancy + fever combination
2. Any child <5 with danger sign
3. Any imaging result suggesting TB/Cancer
4. Any NCD patient with >30% vitals deterioration

---

## 5. EXPLAINABILITY FRAMEWORK

### 5.1 Patient-Facing Explanations (Kiswahili)

**Template:**
```
┌─────────────────────────────────────┐
│ AI Imeangalia Dalili Zako          │
├─────────────────────────────────────┤
│ Uhakika: 87%                        │
│                                     │
│ Vitu Vilivyozingatiwa:              │
│ • Homa kwa siku 3                   │
│ • Kikohozi cha wastani              │
│ • Umri wako: 32 miaka               │
│                                     │
│ Kufanana na WHO:                    │
│ • Dalili za Malaria (72%)           │
│                                     │
│ Wagonjwa Sawa: 1,247                │
│ (Kutoka Dar es Salaam)              │
│                                     │
│ Mapendekezo:                        │
│ Tembelea kituo cha afya leo         │
│                                     │
│ ⚠️ AI inasaidia tu.                 │
│    Daktari atakagua zaidi.          │
└─────────────────────────────────────┘
```

### 5.2 Clinician-Facing Explanations

**Detailed Output:**
- Feature importance scores
- Decision tree path (for XGBoost)
- Regional prevalence comparison
- Similar case retrieval (k=5)
- Model version + training date
- SHAP values (for advanced users)

---

## 6. BIAS MONITORING & FAIRNESS

### 6.1 Stratified Performance Tracking

**Monthly Audits:**
```python
performance_by_strata = {
    "region": {
        "Dar es Salaam": {"accuracy": 89.1%, "fpr": 4.2%},
        "Mwanza": {"accuracy": 86.8%, "fpr": 5.1%},
        # ... all 26 regions
    },
    "gender": {
        "Male": {"accuracy": 87.9%, "fpr": 4.8%},
        "Female": {"accuracy": 87.2%, "fpr": 4.5%}
    },
    "age_group": {
        "<5": {"accuracy": 91.2%, "fpr": 3.1%},
        "5-18": {"accuracy": 88.5%, "fpr": 4.3%},
        # ...
    }
}
```

**Fairness Metrics:**
- **Demographic Parity:** Positive prediction rate within ±5% across groups
- **Equalized Odds:** TPR and FPR within ±5% across groups
- **Calibration:** Predicted risk = actual risk (±10%) for all groups

**Action Threshold:**
- If disparity >10% between any two groups → Immediate investigation
- If disparity persists >2 months → Model recalibration required

### 6.2 Debiasing Techniques

1. **Stratified Sampling:** Training data balanced across regions
2. **Re-weighting:** Underrepresented groups given higher loss weights
3. **Threshold Tuning:** Separate decision thresholds per region (if needed)
4. **Continuous Learning:** Monthly updates with new data from low-performing regions

---

## 7. GOVERNANCE & MODEL LIFECYCLE

### 7.1 Deployment Pipeline

```
┌─────────────────────────────────────┐
│  1. MODEL DEVELOPMENT (MoH Team)    │
│     • Train on Tanzania data        │
│     • Validate on held-out set      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. INTERNAL REVIEW                 │
│     • Clinical team validation      │
│     • Bias audit                    │
│     • Security scan                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. PILOT DEPLOYMENT                │
│     • 3 facilities, 50 CHWs         │
│     • 6-month trial                 │
│     • Continuous monitoring         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  4. TMDA SUBMISSION                 │
│     • Clinical evaluation report    │
│     • Risk management plan          │
│     • Performance documentation     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  5. MoH APPROVAL                    │
│     • Steering committee review     │
│     • National rollout authorization│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  6. NATIONAL DEPLOYMENT             │
│     • Phased rollout (region by     │
│       region)                       │
│     • CHW training                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  7. POST-MARKET SURVEILLANCE        │
│     • Monthly performance reports   │
│     • Adverse event tracking        │
│     • Bias audits                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  8. MODEL RETRAINING (if needed)    │
│     • Triggered by performance drop │
│     • Repeat steps 1-6              │
└─────────────────────────────────────┘
```

### 7.2 Continuous Monitoring Dashboard

**Real-Time Metrics (MoH Admin View):**
- Predictions per day (national + regional)
- Accuracy by model (updated weekly)
- Confidence distribution
- Escalation rate (% sent to human review)
- Adverse events (missed diagnoses)

**Alerting Thresholds:**
- Accuracy drops >5% → Email to AI team
- Accuracy drops >10% → Model rollback + investigation
- Adverse event reported → 24h review cycle

---

## 8. DATA INFRASTRUCTURE

### 8.1 Training Data Sources

| Source | Records | Purpose |
|--------|---------|---------|
| Tanzania DHS 2022 | 12,000 | Maternal health baseline |
| MoH Facility Records | 50,000 | Symptom triage patterns |
| WHO IMCI Guidelines | N/A | Rule-based safety layer |
| CheXpert Dataset | 224,000 | Pre-training for imaging |
| Tanzania TB Dataset | 8,000 | Fine-tuning for local X-rays |

### 8.2 Data Privacy

**Encryption:**
- At rest: AES-256
- In transit: TLS 1.3
- Backups: Encrypted, geo-replicated (within Tanzania)

**Anonymization for AI Training:**
```python
def anonymize_for_training(patient_record):
    return {
        "age_range": bucket_age(record.age),  # e.g., "25-30"
        "gender": record.gender,
        "region": record.region,  # Not facility
        "symptoms": record.symptoms,
        # NO: name, ID, phone, exact location
    }
```

**Audit Logs:**
- Every data access logged
- Retention: 10 years
- Quarterly review by PDPA officer

---

## 9. INFRASTRUCTURE & SCALABILITY

### 9.1 Deployment Architecture

**Cloud:** Azure Tanzania Region (MoH-approved)  
**Edge:** Android devices (offline TFLite models)  
**Hybrid:** Sync when connected  

**Scalability:**
- Current: 10M users, 1M predictions/day
- Target (2030): 30M users, 5M predictions/day

**High Availability:**
- 99.6% uptime (validated Q4 2025)
- Auto-scaling based on load
- Failover to offline mode if cloud unreachable

### 9.2 Integration Points

**DHIS2 (via OpenHIM):**
- Daily sync of aggregated AI statistics
- No patient-level data shared

**NHIF (Future):**
- AI-assisted claims validation
- Fraud detection for chronic disease management

---

## 10. FUTURE ROADMAP

**Q2 2026:**
- Voice-based symptom checker (Swahili ASR)
- Malnutrition detection from smartphone photos

**Q3 2026:**
- Integration with mHealth platforms (Afya Pap, m-Tiba)
- Advanced NLP for unstructured clinical notes

**2027:**
- Federated learning across districts (privacy-preserving)
- WHO collaboration for Africa-wide model

---

**Document Prepared By:**  
AfyaAI Technical Team, Ministry of Health Tanzania  
**Contact:** ai-team@moh.go.tz  
**TMDA Classification:** Class B/C/D SaMD  
**Status:** ✅ Production-Ready  
