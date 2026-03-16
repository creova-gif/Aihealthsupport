1. Global design system for CREOVA Health OS
Product-wide UX principles
Speed over everything: minimize clicks, flat navigation, keyboard shortcuts, and smart defaults.

Familiar patterns from top EMRs, adapted to small clinics, to reduce training and errors.

Responsive layouts for small laptops and Android tablets; forms broken into steps for low cognitive load.

Visual and interaction design
Color: calm light background, muted neutrals, one primary accent (blue/teal), reserved strong reds/yellows for safety alerts only.

Typography: modern sans-serif (Inter/Roboto), clear size hierarchy (patient name largest, data medium, labels small).

Components: top app bar, left nav, patient header card, tabbed content, cards, tables, stepper, pill tags, toasts, modals.

Accessibility: high contrast, big tap targets, no tiny inline links, consistent button positions.

Prompt for the design system
“Design a complete visual and interaction design system for a dual-language (Swahili/English) clinic and pharmacy OS used in East African private clinics.

Prioritize clinician speed and safety.

Follow EMR/EHR UX best practices (Epic/Cerner-level density but cleaner) with responsive layouts for 10–13 inch laptops and Android tablets.

Define colors, typography, spacing, iconography, components, and interaction states (hover, focus, error, warning).

Include examples of a patient chart, triage flow, pharmacy screen, and admin dashboard using this system.”

2. Patient chart / EMR main screen
What this screen must do
Clinician understands patient status in under 3 seconds.

From one screen, they can read history, document today, order labs, prescribe, and finish the visit.

Layout spec
Top fixed patient header:

Name, age, sex, ID, photo, primary language, contact.

Big allergy banner, chronic conditions chips, pregnancy flag when relevant.

Tabs under header: Summary | Visits | Labs & Imaging | Medications | Billing & Insurance | Files. 

Summary tab (2‑column):

Left: current visit notes (complaint, vitals, assessment, plan) with structured sections and templates.

Right: key history – problem list, last 3 labs, current meds, recent visits.

Right rail: AI assistant card with: suggested differentials, red‑flag alerts, guideline links. Clearly labelled “AI suggestions – not a diagnosis.”

Primary actions: Order labs, Prescribe, Refer, End visit, all pinned.

Patient chart prompts
“Design a clean, high-density patient chart screen for a clinic EMR used on 13” laptops and Android tablets.

Show a fixed patient header with demographics, allergies, chronic conditions, and warning banners.

Use tabs for Summary, Visits, Labs & Imaging, Medications, Billing & Insurance, Files.

The Summary tab is split into two columns: left for today’s visit documentation, right for key history and trends.

Add a narrow right-side panel for an AI assistant with suggested differentials, red-flag alerts, and guideline shortcuts, clearly labelled as ‘AI suggestions’.

Prioritize readability and quick scanning; keep colors muted except for warnings.
Output: wireframe and polished mock description using the product-wide design system.”

3. Triage and consultation flows
Triage screen spec
Multi-step stepper: 1) Complaint 2) Vitals 3) Symptoms 4) Risk factors 5) Summary & triage level.

Quick chips for common complaints and symptoms, minimal typing.

Final step: triage category with color (emergency/urgent/routine) plus explanation; override button with reason.

Consultation form spec
Structured sections (History, Exam, Assessment, Plan), collapsible.

Smart templates for common visit types; checkboxes and radios before free text.

Inline AI helper: suggest question prompts or summarize patient story from notes.

Triage & consult prompts
“Design a step-based triage UI for a nurse, optimized for tablets in a busy Tanzanian clinic.

Steps: Complaint, Vitals, Symptoms, Risk factors, Summary & Triage.

Each step shows large chips for common options, minimal typing, and clear progress indicator.

The final step shows triage category with strong color coding, explanation of why, and an override button with reason.

Use offline-friendly patterns and simple language suitable for mid-level clinicians.”

“Design the consultation documentation screen that follows triage.

Separate sections for History, Examination, Assessment, and Plan; make them collapsible.

Provide template shortcuts for acute visits, chronic disease follow-ups, antenatal, and child visits.

Integrate a small AI helper area that can suggest differential diagnoses and check red flags based on entered data, but never blocks clinician decisions.

Optimize layout so a full visit can be documented in under 3 minutes.”

4. E‑prescribing and pharmacy inventory
Prescribing screen spec
Embedded in the visit: search drug → select dosage form → pick dose/frequency/duration via presets.

Show interaction/allergy warnings inline with clear color and icons.

One-click treatment bundles for common conditions.

Pharmacy dispense screen spec
Left: queue of prescriptions with patient name and priority.

Center: selected prescription, line-by-line with dose and instructions.

Right: stock card with available qty, expiry, alternatives, and margin.

Actions: Mark dispensed, partial dispense, switch to alternative (with reason), take payment.

Pharmacy management spec
Inventory list with search, filters (low stock, near expiry, high margin).

Purchase orders: recommend order qty based on consumption and lead time.

Clear color coding: green = healthy stock, amber = low, red = out, subtle yet visible.

Prescribing & pharmacy prompts
“Design a prescribing UI inside a clinic EMR.

Doctor can search for a medicine, see generic & brand options, then choose dose, frequency, and duration using preset chips.

Show allergy and drug interaction warnings clearly but unobtrusively.

Allow care bundles (e.g., standard malaria regimen) that pre-fill multiple prescriptions.

Provide a clean, one-page layout so clinicians never lose context of the visit.”

“Design a modern pharmacy dispensing and stock management screen for a combined clinic & pharmacy OS.

Left column: queue of open prescriptions with patient name, age, priority flag.

Center: details of the current prescription with each medicine editable.

Right column: inventory details for each item (stock, expiry, alternatives, margin).

Use clear color signalling for stock levels, and make the main actions (dispense, partial, alternative, payment) prominent.

Include a toggle to switch into full inventory mode using the same visual system.”

5. Owner/admin dashboards
Dashboard spec
KPI cards at top: today’s visits, this month’s revenue, revenue by payer, stockout alerts, rejected claims.

Charts: visits over time, revenue by payer, top diagnoses, top medicines.

Tables: near-expiry items, high outstanding balances, frequent no-show patients.

Dashboard prompts
“Design a clinic & pharmacy owner dashboard for a small East African facility.

At the top, show cards for today’s visits, this month’s revenue, revenue by payer (cash, NHIF, HMO), number of stockout items, and pending claims.

Include a visits over time chart, revenue-by-payer bar chart, and a table of soon-to-expire medicines with quantities and value.

Keep the layout minimal and legible on 13” laptops, with filters by date range and provider.

Use EMR dashboard best practices: focus on a few key metrics, clear labels, progressive drill-down.”

6. Patient-facing portal / SMS
Core elements
Simple view of visit history, medications, and upcoming appointments.

Medication reminders and appointment reminders via SMS/WhatsApp.

Education cards in Swahili; plain language and visuals.

Prompts
“Design a lightweight patient portal and SMS layout for a Tanzanian clinic’s OS.

Patients can see last visits, medications with instructions, and upcoming appointments.

Provide simple, friendly Swahili/English wording, large touch targets, and clear next actions.

Focus on medication adherence and appointment attendance, not on complex health analytics.”

7. Continuous UX improvement
From EMR/pharmacy UX research, you should:

Customize screens by role (doctor, nurse, pharmacist, owner) so each sees only what they need.

Break long forms into steps with progress indicators and autosave.

Run quick usability tests, then iterate layouts based on time-to-complete and error rates.

If you share which tool you’re using to design (Figma, Penpot, a specific AI UI generator), I can translate this into an exact step-by-step workflow for rebuilding your screens there.