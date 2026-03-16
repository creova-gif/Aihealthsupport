DRUG CATALOG + INTERACTION ENGINE

This becomes the master medication database used by prescriptions and pharmacy.

Drug Catalog Table
create table drug_catalog (
  id uuid primary key default gen_random_uuid(),
  generic_name text not null,
  brand_name text,
  strength text,
  form text,
  manufacturer text,
  created_at timestamp default now()
);

Example entries:

Paracetamol | Panadol | 500mg | tablet
Amoxicillin | Amoxil | 250mg | capsule
Artemether-Lumefantrine | Coartem | 20/120mg | tablet
Drug Interaction Table

This prevents dangerous prescriptions.

create table drug_interactions (
  id uuid primary key default gen_random_uuid(),
  drug_a uuid references drug_catalog(id),
  drug_b uuid references drug_catalog(id),
  severity text,
  description text,
  recommendation text
);

Severity levels:

severe
moderate
mild

Example record:

Drug A: Warfarin
Drug B: Aspirin
Severity: severe
Risk: bleeding
Recommendation: avoid combination
Prescription Safety Check Logic

Before saving prescription:

loop through prescription drugs
compare with patient medications
check interaction table
if interaction found → show alert
2️⃣ PHARMACY INVENTORY + DISPENSING

Now prescriptions connect to real pharmacy stock.

Pharmacy Inventory
create table pharmacy_inventory (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  drug_id uuid references drug_catalog(id),
  stock_quantity integer,
  reorder_level integer,
  created_at timestamp default now()
);
Batch Tracking

Pharmacies must track expiry dates.

create table pharmacy_batches (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid references pharmacy_inventory(id),
  batch_number text,
  expiry_date date,
  quantity integer
);
Dispense Records
create table dispenses (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid references prescriptions(id),
  pharmacist_id uuid references staff_profiles(id),
  dispensed_at timestamp default now()
);
Dispense Items
create table dispense_items (
  id uuid primary key default gen_random_uuid(),
  dispense_id uuid references dispenses(id),
  drug_id uuid references drug_catalog(id),
  quantity integer
);
Pharmacy Workflow
Doctor writes prescription
↓
Pharmacy queue receives prescription
↓
Pharmacist confirms drug
↓
Inventory updated
↓
Dispense recorded
3️⃣ LABORATORY ORDERS + RESULTS

Doctors can now request diagnostic tests.

Lab Test Catalog
create table lab_tests (
  id uuid primary key default gen_random_uuid(),
  test_name text,
  category text,
  description text
);

Example tests:

Malaria test
Complete blood count
Typhoid test
HIV test
Lab Orders
create table lab_orders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  doctor_id uuid references staff_profiles(id),
  status text,
  ordered_at timestamp default now()
);

Status:

ordered
sample_collected
processing
completed
Lab Order Items
create table lab_order_items (
  id uuid primary key default gen_random_uuid(),
  lab_order_id uuid references lab_orders(id),
  test_id uuid references lab_tests(id)
);
Lab Results
create table lab_results (
  id uuid primary key default gen_random_uuid(),
  lab_order_item_id uuid references lab_order_items(id),
  result_value text,
  normal_range text,
  notes text,
  recorded_at timestamp default now()
);
Lab Workflow
Doctor orders test
↓
Lab receives order
↓
Sample collected
↓
Result entered
↓
Doctor notified
↓
Saved in patient timeline
4️⃣ AI VOICE CLINICAL NOTES

This is one of the most powerful features of your system.

Doctors speak → notes are generated.

Speech recognition can use Whisper.

AI Transcription Table
create table ai_transcriptions (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid references consultations(id),
  transcript text,
  structured_note jsonb,
  created_at timestamp default now()
);
SOAP Structure Output

AI should convert speech into:

Subjective
Objective
Assessment
Plan

Example stored JSON:

{
  "subjective": "Patient reports headache for 3 days",
  "objective": "Temperature 38.5C",
  "assessment": "Possible malaria",
  "plan": "Order malaria test and prescribe paracetamol"
}
AI Workflow
Doctor taps microphone
↓
Speech recorded
↓
Audio → text transcription
↓
AI formats SOAP note
↓
Doctor edits
↓
Saved to EMR
SYSTEM NOW SUPPORTS FULL CLINIC WORKFLOW

Your platform can now handle:

Patient registration
Triage
Vitals
Consultation
Prescription
Drug safety
Pharmacy dispensing
Lab orders
Lab results
AI clinical notes

This is already a real EMR + clinic system.