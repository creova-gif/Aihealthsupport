# ⚡ CREOVA Health OS - Quick Start: Backend Integration

**Connect Your Frontend to Supabase in 30 Minutes**

---

## 🎯 Goal

Transform CREOVA from **mock data** to **real production database** with Supabase.

**What you'll do:**
1. Set up Supabase project (5 min)
2. Run database schema (5 min)
3. Install Supabase client (2 min)
4. Connect components to real data (15 min)
5. Test complete workflow (3 min)

**Total: 30 minutes**

---

## 📋 Prerequisites

- ✅ CREOVA Health OS installed locally
- ✅ Supabase account (free tier is fine)
- ✅ Node.js installed

---

## STEP 1: Create Supabase Project (5 min)

### **1.1 Sign up at Supabase**
```
https://supabase.com
```

### **1.2 Create new project**
- Project name: `creova-health-os`
- Database password: (save this!)
- Region: Choose closest to Tanzania (e.g., Frankfurt, London)
- Click "Create new project"
- Wait 2-3 minutes for database to provision

### **1.3 Get your credentials**

Go to: **Settings → API**

Copy these values:
```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## STEP 2: Run Database Schema (5 min)

### **2.1 Open SQL Editor**

In Supabase Dashboard:
- Click "SQL Editor" (left sidebar)
- Click "+ New query"

### **2.2 Copy & Paste Schema**

Open `/SUPABASE_SETUP_GUIDE.md` and copy the **entire SQL schema** (starts with "CREOVA Health OS - PHASE 1 DATABASE SCHEMA").

Paste into SQL Editor.

### **2.3 Run the query**

Click "Run" (or press Ctrl/Cmd + Enter)

**Expected result:**
```
✅ Success. 25 tables created.
✅ Seed data inserted (clinic + drugs).
```

### **2.4 Verify tables created**

Click "Table Editor" (left sidebar)

You should see:
- patients
- consultations
- prescriptions
- vitals
- triage_records
- ... (25 tables total)

✅ **Database is ready!**

---

## STEP 3: Install Supabase Client (2 min)

### **3.1 Install package**

```bash
npm install @supabase/supabase-js
```

### **3.2 Add environment variables**

Create `.env.local` file (if it doesn't exist):

```bash
# .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace with YOUR credentials from Step 1.3!**

### **3.3 Restart dev server**

```bash
npm run dev
```

✅ **Supabase client is ready!**

---

## STEP 4: Create Supabase Client Helper (3 min)

### **4.1 Create client file**

Create `/src/utils/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TYPE DEFINITIONS (Type-safe database access)
// ============================================

export type Patient = {
  id: string;
  clinic_id: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  phone: string;
  email?: string;
  address?: string;
  blood_type?: string;
  photo_url?: string;
  language_preference: 'sw' | 'en';
  created_at: string;
  updated_at: string;
};

export type PatientAllergy = {
  id: string;
  patient_id: string;
  allergy_name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  created_at: string;
};

export type PatientCondition = {
  id: string;
  patient_id: string;
  condition_name: string;
  diagnosed_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
};

export type Vitals = {
  id: string;
  patient_id: string;
  triage_id?: string;
  temperature?: number;
  blood_pressure?: string;
  pulse?: number;
  respiration?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recorded_by: string;
  recorded_at: string;
};

export type TriageRecord = {
  id: string;
  patient_id: string;
  nurse_id: string;
  chief_complaint: string;
  symptoms?: string[];
  priority: 'emergency' | 'urgent' | 'moderate' | 'routine';
  ai_risk_assessment?: any;
  nurse_notes?: string;
  created_at: string;
};

export type Consultation = {
  id: string;
  patient_id: string;
  doctor_id: string;
  triage_id?: string;
  visit_type: 'new' | 'follow_up' | 'emergency' | 'telemedicine';
  status: 'in_progress' | 'completed' | 'cancelled';
  follow_up_date?: string;
  created_at: string;
  completed_at?: string;
};

export type Prescription = {
  id: string;
  consultation_id: string;
  patient_id: string;
  doctor_id: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  created_at: string;
  dispensed_at?: string;
};

export type PrescriptionItem = {
  id: string;
  prescription_id: string;
  drug_id: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  instructions_sw?: string;
  quantity?: number;
  created_at: string;
};

export type DrugCatalog = {
  id: string;
  generic_name: string;
  brand_name?: string;
  strength?: string;
  form?: string;
  manufacturer?: string;
  category?: string;
  requires_prescription: boolean;
  created_at: string;
};

export type PatientEvent = {
  id: string;
  patient_id: string;
  event_type: 'triage' | 'vitals' | 'consultation' | 'prescription' | 'lab' | 'pharmacy' | 'imaging' | 'vaccination' | 'admission';
  event_title: string;
  event_data?: any;
  created_at: string;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get patient with all related data
export async function getPatientFull(patientId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      patient_allergies(*),
      patient_conditions(*),
      patient_insurance(*),
      patient_contacts(*)
    `)
    .eq('id', patientId)
    .single();

  if (error) throw error;
  return data;
}

// Get latest vitals for patient
export async function getLatestVitals(patientId: string) {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  return data; // null if no vitals yet
}

// Get patient timeline
export async function getPatientTimeline(patientId: string) {
  const { data, error } = await supabase
    .from('patient_events')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Search patients
export async function searchPatients(query: string, clinicId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,patient_number.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;
  return data;
}

// Get all drugs
export async function getAllDrugs() {
  const { data, error } = await supabase
    .from('drug_catalog')
    .select('*')
    .order('generic_name');

  if (error) throw error;
  return data;
}
```

✅ **Helper functions ready!**

---

## STEP 5: Test Database Connection (2 min)

### **5.1 Create test page**

Create `/src/app/test-db/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function TestDatabase() {
  const [status, setStatus] = useState('Testing connection...');
  const [patients, setPatients] = useState<any[]>([]);
  const [drugs, setDrugs] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check connection
        const { data: clinics, error: clinicsError } = await supabase
          .from('clinics')
          .select('*')
          .limit(1);

        if (clinicsError) throw clinicsError;

        // Test 2: Get patients
        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*')
          .limit(5);

        if (patientsError) throw patientsError;
        setPatients(patientsData || []);

        // Test 3: Get drugs
        const { data: drugsData, error: drugsError } = await supabase
          .from('drug_catalog')
          .select('*')
          .limit(5);

        if (drugsError) throw drugsError;
        setDrugs(drugsData || []);

        setStatus('✅ Database connection successful!');
      } catch (error: any) {
        setStatus(`❌ Error: ${error.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>Database Connection Test</h1>
      <p style={{ fontSize: 18, marginTop: 20 }}>{status}</p>

      {patients.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>Patients ({patients.length})</h2>
          <pre>{JSON.stringify(patients, null, 2)}</pre>
        </div>
      )}

      {drugs.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>Drugs ({drugs.length})</h2>
          <pre>{JSON.stringify(drugs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### **5.2 Visit test page**

```
http://localhost:3000/test-db
```

**Expected result:**
```
✅ Database connection successful!

Patients (0-5)
[... patient data ...]

Drugs (8)
[
  { "generic_name": "Paracetamol", ... },
  { "generic_name": "Amoxicillin", ... },
  ...
]
```

✅ **Database connection works!**

---

## STEP 6: Create Test Patient (3 min)

### **6.1 Create patient registration page**

Create `/src/app/test-create-patient/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function CreatePatient() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any>(null);

  const createPatient = async () => {
    try {
      // Get clinic ID (use the first clinic for testing)
      const { data: clinics } = await supabase
        .from('clinics')
        .select('id')
        .limit(1)
        .single();

      if (!clinics) {
        alert('No clinic found. Run the SQL schema first!');
        return;
      }

      // Create patient
      const { data, error } = await supabase
        .from('patients')
        .insert({
          clinic_id: clinics.id,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: '1990-01-01',
          gender: 'F',
          phone: phone,
          blood_type: 'O+',
          language_preference: 'sw',
        })
        .select()
        .single();

      if (error) throw error;

      setResult(data);
      alert(`Patient created! Number: ${data.patient_number}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Test Patient</h1>

      <div style={{ marginTop: 20 }}>
        <label>First Name:</label><br />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ padding: 8, width: '100%', marginTop: 4 }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label>Last Name:</label><br />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ padding: 8, width: '100%', marginTop: 4 }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label>Phone:</label><br />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 8, width: '100%', marginTop: 4 }}
          placeholder="+255 754 123 456"
        />
      </div>

      <button
        onClick={createPatient}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          background: '#1B998B',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        Create Patient
      </button>

      {result && (
        <div style={{ marginTop: 24, padding: 16, background: '#D1FAE5', borderRadius: 8 }}>
          <h3>Patient Created!</h3>
          <p><strong>Patient Number:</strong> {result.patient_number}</p>
          <p><strong>Name:</strong> {result.first_name} {result.last_name}</p>
          <p><strong>ID:</strong> {result.id}</p>
        </div>
      )}
    </div>
  );
}
```

### **6.2 Create patient**

Visit:
```
http://localhost:3000/test-create-patient
```

Fill in:
- First Name: Amina
- Last Name: Juma
- Phone: +255 754 123 456

Click "Create Patient"

**Expected result:**
```
✅ Patient created! Number: P-0001
```

### **6.3 Verify in Supabase**

Go to Supabase Dashboard → Table Editor → `patients`

You should see:
```
patient_number: P-0001
first_name: Amina
last_name: Juma
```

✅ **Patient creation works!**

---

## STEP 7: Update Components to Use Real Data (10 min)

Now update your components to fetch real data instead of mock data.

### **Example: Update PatientTimeline**

Open `/src/app/components/creova/PatientTimeline.tsx`

Replace mock data with:

```typescript
import { useEffect, useState } from 'react';
import { supabase, getPatientTimeline } from '../../../utils/supabase/client';

export default function PatientTimeline({ patientId }: { patientId: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await getPatientTimeline(patientId);
        setEvents(data);
      } catch (error) {
        console.error('Error loading timeline:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();
  }, [patientId]);

  if (loading) return <div>Loading timeline...</div>;

  // ... rest of component
}
```

### **Example: Update PrescribingInterface**

When creating prescription:

```typescript
const createPrescription = async () => {
  try {
    // 1. Create prescription
    const { data: prescription, error: prescError } = await supabase
      .from('prescriptions')
      .insert({
        patient_id: patientId,
        doctor_id: userId, // From auth
        status: 'pending',
      })
      .select()
      .single();

    if (prescError) throw prescError;

    // 2. Add prescription items
    const items = prescriptionDrugs.map(drug => ({
      prescription_id: prescription.id,
      drug_id: drug.id,
      drug_name: drug.name,
      dosage: drug.dose,
      frequency: drug.frequency,
      duration: drug.duration,
      instructions: drug.instructions,
      instructions_sw: drug.instructionsSw,
      quantity: drug.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('prescription_items')
      .insert(items);

    if (itemsError) throw itemsError;

    // 3. Create event
    await supabase
      .from('patient_events')
      .insert({
        patient_id: patientId,
        event_type: 'prescription',
        event_title: 'Prescription issued',
        event_data: {
          prescription_id: prescription.id,
          drugs: prescriptionDrugs.map(d => d.name),
        },
      });

    alert('Prescription created successfully!');
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};
```

---

## ✅ VERIFICATION CHECKLIST

After completing all steps:

- [ ] Supabase project created
- [ ] Database schema deployed (25 tables)
- [ ] Environment variables configured
- [ ] Supabase client installed
- [ ] Test page shows connection success
- [ ] Test patient created (P-0001)
- [ ] Patient visible in Supabase dashboard
- [ ] Components updated to use real data
- [ ] Create prescription works
- [ ] Patient timeline shows events

---

## 🚀 NEXT STEPS

### **1. Connect All Components**

Update these components to use Supabase:
- [ ] HomeDashboard (real queue counts)
- [ ] PatientChartImproved (real patient data)
- [ ] TriageImproved (save to database)
- [ ] PrescribingInterfaceImproved (real prescriptions)
- [ ] PatientTimeline (real events)

### **2. Add Authentication**

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'doctor@clinic.com',
  password: 'securepassword',
});

// Sign in
const { data: { session }, error } = await supabase.auth.signInWithPassword({
  email: 'doctor@clinic.com',
  password: 'securepassword',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### **3. Real-time Updates**

Enable live updates for patient queue:

```typescript
const channel = supabase
  .channel('patient-queue')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'triage_records',
    },
    (payload) => {
      console.log('New patient in queue!', payload);
      // Update queue count
    }
  )
  .subscribe();
```

---

## 🎉 CONGRATULATIONS!

**You now have a PRODUCTION-READY backend! 🎊**

**What you've accomplished:**
- ✅ 25-table relational database
- ✅ Type-safe data access
- ✅ Patient registration working
- ✅ Real-time data storage
- ✅ Multi-tenant security (RLS)

**Time to:**
- Connect all components
- Test full workflows
- Deploy to production
- Onboard real clinics

---

**Need help? Check:**
- `/SUPABASE_SETUP_GUIDE.md` - Full schema details
- `/PHASE2_COMPLETE_SUMMARY.md` - Complete system overview
- Supabase Docs: https://supabase.com/docs

**You're ready to change healthcare in Tanzania! 🇹🇿🏥**
