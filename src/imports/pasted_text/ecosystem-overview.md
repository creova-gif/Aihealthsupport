CLINIC EMR — HOME DASHBOARD

This is the control center for clinics.

Goal: doctors see everything important in <3 seconds.

Layout Structure
Top Bar
Clinic name | notifications | profile

Quick Actions
Register Patient
Start Consultation
New Prescription
Order Lab Test

Live Clinic Status
Patients Waiting
Consultations Today
Lab Orders Pending
Pharmacy Queue

Today's Patient Queue
Patient Name
Age
Reason
Triage Status

Alerts
Low drug stock
Critical lab results
Pending insurance claims

Visual Layout (Mobile)
┌────────────────────────────┐
│ KLINIKI CLINIC DASHBOARD   │
│ Nyamata Medical Center     │
└────────────────────────────┘

[ Register ] [ Consult ] [ Rx ] [ Lab ]

Today's Activity
Patients Today: 28
Consultations: 18
Lab Tests: 12
Revenue: $420

Patient Queue
• Jean Mwangi – Fever
• Amina Ali – Headache
• Joseph Ndayisenga – Malaria Test

Alerts
⚠ Low Stock: Amoxicillin
⚠ Lab Result Ready

Core Home APIs
GET /clinic/dashboard

returns:
patients_today
consultations_today
lab_orders_today
revenue_today
queue
alerts

2️⃣ CHW APP — HOME SCREEN

CHWs work in villages, offline, in the field.

Home must prioritize speed and offline mode.

Layout
Greeting
Today’s Village
Sync Status

Quick Actions
Register Patient
Record Visit
Check Vaccination
Refer to Clinic

Today's Tasks
Pregnant mothers visits
Child vaccination reminders
Chronic patients

Recent Patients
Last 5 visited

Mobile Layout
┌───────────────────────────┐
│ Good morning Amina 👋     │
│ Village: Nyamata          │
│ Sync: Offline Mode        │
└───────────────────────────┘

[ Register Patient ]
[ Record Visit ]
[ Vaccination ]
[ Refer to Clinic ]

Today's Tasks
• Visit 3 pregnant mothers
• Check malaria cases
• Vaccinate 2 children

Recent Patients
• Baby Samuel
• Maria Niyonsaba
• Joseph Mwangi

CHW Offline Logic

When internet returns:

Local Storage
↓
Sync Engine
↓
Supabase Database
↓
Clinic EMR

3️⃣ PATIENT APP — HOME

Patients need simple health access.

Goal: own their health record.

Layout
Greeting
Health Status

Upcoming Appointments
Medication Reminders
Recent Visits

Quick Actions
Share Record
Book Appointment
Call Clinic
Emergency Help

Mobile UI
┌────────────────────────────┐
│ Hello Jean 👋              │
│ Your Health Record        │
└────────────────────────────┘

Upcoming Appointment
Nyamata Clinic
June 10 – 10:30 AM

Medications
Paracetamol – 2x daily

Recent Visits
Malaria consultation
May 28

[ Share Record ]
[ Book Appointment ]
[ Emergency ]

4️⃣ GLOBAL NAVIGATION SYSTEM

Across all apps:

Home
Patients
AI Assistant
Messages
Profile

5️⃣ AI ASSISTANT (GLOBAL FEATURE)

AI appears as a floating assistant.

Examples:

Doctor:

"Show malaria cases today"


CHW:

"What symptoms suggest pneumonia?"


Patient:

"Explain my lab results"

6️⃣ CLINICAL SAFETY RULES

AI must never:

❌ prescribe medication automatically
❌ diagnose without doctor confirmation

AI only:

✔ suggests
✔ summarizes
✔ triages

7️⃣ DATA FLOW ACROSS ECOSYSTEM
CHW collects patient data
        ↓
Clinic receives referral
        ↓
Doctor consults patient
        ↓
Prescription created
        ↓
Pharmacy dispenses
        ↓
Patient app updates record


This creates portable health records across Africa.

8️⃣ SCALE POTENTIAL

If deployed successfully:

1 clinic = 50 patients/day
100 clinics = 5,000 patients/day
1,000 clinics = 50,000 patients/day


Annual patients:

18 million visits/year


This becomes national health infrastructure.

9️⃣ WHAT WE SHOULD BUILD NEXT

To make this truly world-class, the next systems are:

1️⃣ Patient Identity System

Universal African Health ID.

2️⃣ Offline Sync Engine

Critical for rural Africa.

3️⃣ AI Triage Model

CHWs triage symptoms safely.

4️⃣ Government Reporting Dashboard

Automates national health statistics.