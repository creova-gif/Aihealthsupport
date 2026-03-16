# AfyaCare Tanzania - Supabase Integration Guide

Complete guide for integrating AfyaCare with Supabase for production deployment.

## 📋 Overview

AfyaCare Tanzania now includes comprehensive Supabase integration for:

### ✅ Core Healthcare Modules (Already Integrated)
- **Authentication** - Phone OTP with role-based access (Patient, CHW, Clinician, Admin)
- **Appointments** - Booking and management system
- **Medications** - Tracking and reminders
- **Test Results** - Lab results viewer
- **Facilities** - Hospital/clinic finder
- **Symptom Checker** - AI-powered triage
- **Maternal Care** - Pregnancy tracking

### 🆕 NEW: Wellness Module
- **Wellness Profiles** - User + family member profiles
- **Nutrition Tracking** - Meal logging with calorie tracking
- **Activity Tracking** - Workout and exercise logging
- **Daily Habits** - Water, sleep, and step tracking

### 🆕 NEW: Patient Queue Management
- **Queue Tracking** - Hospital patient workflow
- **Clinical Notes** - SOAP documentation
- **Lab Orders** - Test ordering and results
- **Medication Dispensing** - Pharmacy workflow

---

## 🚀 Quick Start

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: AfyaCare Tanzania
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to Tanzania (e.g., eu-central-1)
4. Wait for project to initialize (~2 minutes)

### Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy and paste `/supabase-schema.sql` (base schema)
4. Click **Run**
5. Repeat for `/supabase-schema-extensions.sql` (wellness + queue)

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- **Settings** → **API** in Supabase Dashboard

### Step 4: Enable SMS Authentication (Optional)

For production phone OTP:

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Phone** provider
3. Configure SMS provider:
   - **Twilio** (recommended for Tanzania)
   - **Africa's Talking** (local provider)
   - **MessageBird**

#### Twilio Configuration for Tanzania:
```
Account SID: [from Twilio dashboard]
Auth Token: [from Twilio dashboard]
Phone Number: +255... (purchase Tanzania number)
```

### Step 5: Deploy

```bash
npm run build
npm run deploy
```

---

## 📊 Database Schema

### Core Tables

#### `user_profiles`
User information with role-based access control.
```sql
- id (UUID, PK)
- phone (TEXT, unique)
- name (TEXT)
- email (TEXT)
- role (patient | chw | clinician | admin)
- facility_id (UUID)
- language_preference (sw | en)
- biometric_enabled (BOOLEAN)
```

#### `appointments`
Medical appointments.
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- facility_id (UUID, FK)
- date (DATE)
- time (TIME)
- type (TEXT)
- status (scheduled | confirmed | cancelled | completed)
```

#### `medications`
Medication tracking and reminders.
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- name (TEXT)
- dosage (TEXT)
- frequency (TEXT)
- start_date (DATE)
- reminder_times (TEXT[])
```

### Wellness Tables

#### `wellness_profiles`
User and family member wellness profiles.
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- name (TEXT)
- age (INTEGER)
- weight (DECIMAL) -- kg
- height (DECIMAL) -- cm
- goals (TEXT[])
- activity_level (INTEGER 0-3)
- daily_calorie_target (INTEGER)
- is_primary (BOOLEAN)
- relationship (TEXT) -- for family members
```

#### `wellness_meals`
Nutrition tracking.
```sql
- id (UUID, PK)
- profile_id (UUID, FK → wellness_profiles)
- date (TIMESTAMPTZ)
- meal_type (breakfast | lunch | dinner | snack)
- foods (JSONB) -- [{name, portion, calories}]
- total_calories (INTEGER)
```

#### `wellness_workouts`
Activity and exercise tracking.
```sql
- id (UUID, PK)
- profile_id (UUID, FK)
- date (TIMESTAMPTZ)
- activity_type (TEXT)
- duration_minutes (INTEGER)
- intensity (low | medium | high)
- calories_burned (INTEGER)
```

#### `wellness_habits`
Daily habits (water, sleep, steps).
```sql
- id (UUID, PK)
- profile_id (UUID, FK)
- date (DATE)
- water_glasses (INTEGER)
- sleep_hours (DECIMAL)
- steps (INTEGER)
- UNIQUE(profile_id, date) -- one per day
```

### Patient Queue Tables

#### `patient_queue`
Hospital patient workflow.
```sql
- id (UUID, PK)
- patient_id (TEXT) -- e.g., P-0012
- patient_name (TEXT)
- age (INTEGER)
- sex (M | F | O)
- risk_level (low | medium | high)
- complaint (TEXT)
- department (TEXT)
- status (Waiting | In Consultation | Completed)
- arrival_time (TIMESTAMPTZ)
-- Vitals
- blood_pressure (TEXT)
- heart_rate (INTEGER)
- temperature (DECIMAL)
- oxygen_saturation (INTEGER)
-- Maternal
- is_pregnant (BOOLEAN)
- weeks_gestation (INTEGER)
```

#### `clinical_notes`
SOAP clinical documentation.
```sql
- id (UUID, PK)
- queue_id (UUID, FK → patient_queue)
- clinician_id (UUID, FK → auth.users)
- subjective (TEXT) -- S
- objective (TEXT) -- O
- assessment (TEXT) -- A
- plan (TEXT) -- P
- icd10_codes (TEXT[])
- signed (BOOLEAN)
- signed_at (TIMESTAMPTZ)
```

#### `lab_orders`
Laboratory test orders.
```sql
- id (UUID, PK)
- queue_id (UUID, FK)
- test_type (TEXT)
- priority (Routine | Urgent | STAT)
- status (Ordered | Processing | Completed)
- results (JSONB)
- ordered_by (UUID, FK)
```

#### `medication_dispense`
Pharmacy medication dispensing.
```sql
- id (UUID, PK)
- queue_id (UUID, FK)
- drug_name (TEXT)
- dosage (TEXT)
- status (Verify | Ready | Dispensed)
- prescribed_by (UUID, FK)
- dispensed_by (UUID, FK)
```

---

## 🔒 Row Level Security (RLS)

### Wellness Module Policies

**Wellness Profiles**: Users can only access their own profiles
```sql
CREATE POLICY wellness_profiles_select ON wellness_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY wellness_profiles_insert ON wellness_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

**Meals/Workouts/Habits**: Users can only access data for their profiles
```sql
CREATE POLICY wellness_meals_select ON wellness_meals
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM wellness_profiles WHERE user_id = auth.uid()
    )
  );
```

### Patient Queue Policies

**Queue Access**: Only clinicians, CHWs, and admins can view queue
```sql
CREATE POLICY patient_queue_select ON patient_queue
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('clinician', 'chw', 'admin')
    )
  );
```

**Clinical Notes**: Only clinicians can create/modify
```sql
CREATE POLICY clinical_notes_insert ON clinical_notes
  FOR INSERT WITH CHECK (
    clinician_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'clinician'
    )
  );
```

---

## 🔌 API Usage

### Wellness API

```typescript
import { wellnessApi } from '@/app/services/wellnessApi';

// Get user's wellness profiles (self + family)
const profiles = await wellnessApi.getProfiles();

// Create new profile
const profile = await wellnessApi.createProfile({
  user_id: userId,
  name: "Amina Juma",
  age: 32,
  goals: ["Improve nutrition", "Be more active"],
  activity_level: 2,
  language: 'sw',
  daily_calorie_target: 2000,
  profile_type: 'adult',
  is_primary: true,
});

// Add meal
await wellnessApi.addMeal({
  profile_id: profile.id,
  date: new Date().toISOString(),
  meal_type: 'lunch',
  foods: [
    { name: 'Wali na Maharage', portion: '1 plate', calories: 450 },
    { name: 'Salad', portion: '1 bowl', calories: 50 }
  ],
  total_calories: 500,
});

// Add workout
await wellnessApi.addWorkout({
  profile_id: profile.id,
  date: new Date().toISOString(),
  activity_type: 'Walking',
  duration_minutes: 30,
  intensity: 'medium',
  calories_burned: 150,
});

// Update daily habits
const todayHabits = await wellnessApi.getTodayHabits(profile.id);
await wellnessApi.updateHabits(todayHabits.id, {
  water_glasses: 6,
  sleep_hours: 7.5,
  steps: 8200,
});
```

### Patient Queue API

```typescript
import { patientQueueApi } from '@/app/services/patientQueueApi';

// Get all patients in queue
const queue = await patientQueueApi.getQueue({
  department: 'OPD',
  status: 'Waiting',
  risk_level: 'high',
});

// Add patient to queue
const patient = await patientQueueApi.addPatient({
  patient_id: 'P-0015',
  patient_name: 'David Ochieng',
  age: 34,
  sex: 'M',
  risk_level: 'low',
  complaint: 'Follow-up, diabetes management',
  department: 'OPD',
  status: 'Waiting',
  arrival_time: new Date().toISOString(),
  blood_pressure: '122/78',
  heart_rate: 74,
  temperature: 36.5,
  oxygen_saturation: 99,
  is_pregnant: false,
});

// Create clinical note (SOAP)
await patientQueueApi.saveClinicalNote({
  queue_id: patient.id,
  clinician_id: userId,
  subjective: 'Patient reports...',
  objective: 'BP 122/78, HR 74...',
  assessment: 'Type 2 diabetes, controlled...',
  plan: 'Continue metformin, follow up 3 months...',
  icd10_codes: ['E11.9'],
  signed: false,
});

// Create lab order
await patientQueueApi.createLabOrder({
  queue_id: patient.id,
  test_type: 'HbA1c + fasting glucose',
  priority: 'Routine',
  status: 'Ordered',
  ordered_by: userId,
  ordered_at: new Date().toISOString(),
});

// Prescribe medication
await patientQueueApi.createMedication({
  queue_id: patient.id,
  drug_name: 'Metformin 500mg',
  dosage: '1 tablet twice daily with meals',
  status: 'Verify',
  prescribed_by: userId,
});
```

---

## 🧪 Mock Mode vs Production

The app automatically detects if Supabase is configured:

### Mock Mode (Development)
- Used when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set
- Returns realistic mock data
- Logs all operations to console
- Perfect for UI development and testing
- **Yellow banner shows**: "Demo Mode: Enter any phone (+255...) and use code 123456 to login"

### Production Mode
- Real Supabase database connections
- Actual phone OTP authentication
- RLS policies enforced
- Audit logging enabled
- Offline queue for poor connectivity

---

## 📱 Offline Support

All APIs support offline-first operation:

```typescript
// Offline queue automatically handles:
await wellnessApi.addMeal(mealData); 
// ↓ If offline
// → Queued locally
// → Auto-synced when back online
// → User notified of sync status
```

The `OfflineQueue` service:
- Queues create/update/delete operations
- Automatically syncs when connectivity restored
- Handles conflicts and retries
- Shows sync status to users

---

## 🔐 Security Best Practices

### ✅ DO
- Use environment variables for keys
- Enable RLS on all tables
- Validate user roles server-side
- Log all clinical actions to audit_logs
- Use signed URLs for file storage
- Implement rate limiting

### ❌ DON'T
- Hardcode credentials
- Disable RLS policies
- Trust client-side role checks
- Store PII without encryption
- Share service role key with clients

---

## 📊 Analytics & Monitoring

### Built-in Views

**Wellness Summary**
```sql
SELECT * FROM wellness_summary;
-- Returns per-profile analytics for last 7 days
```

**Queue Summary**
```sql
SELECT * FROM queue_summary;
-- Returns patient count by department, status, risk
```

### Enable Realtime

For live queue updates:

1. Go to **Database** → **Replication** in Supabase
2. Enable replication for `patient_queue` table
3. In your app:

```typescript
const channel = supabase
  .channel('queue-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'patient_queue' },
    (payload) => {
      console.log('Queue updated:', payload);
      // Refresh UI
    }
  )
  .subscribe();
```

---

## 🚨 Troubleshooting

### "Failed to fetch" errors
- Check SUPABASE_URL is correct
- Verify SUPABASE_ANON_KEY is valid
- Ensure RLS policies allow access

### "Row Level Security policy violation"
- Check user is authenticated
- Verify user role in `user_profiles`
- Review RLS policies for table

### Offline sync not working
- Check `OfflineQueue.processQueue()` is called on connectivity change
- View queue status: `OfflineQueue.getQueueStatus()`

### SMS OTP not sending
- Verify SMS provider configured in Supabase
- Check Twilio/provider account balance
- Review provider API keys

---

## 📞 Support

For technical issues:
- **GitHub Issues**: [Report bugs](https://github.com/afyacare)
- **Discord**: [Community support](#)
- **Email**: support@afyacare.tz

---

## ✅ Production Checklist

Before deploying to hospitals:

- [ ] Supabase project created
- [ ] Database schemas deployed
- [ ] RLS policies enabled and tested
- [ ] SMS authentication configured
- [ ] Environment variables set
- [ ] Test with real Tanzania phone numbers
- [ ] Offline mode tested
- [ ] Role-based access verified
- [ ] Audit logging confirmed
- [ ] TMDA compliance review
- [ ] Tanzania PDPA compliance review
- [ ] Hospital pilot testing completed
- [ ] User training materials prepared

---

## 📄 License

AfyaCare Tanzania © 2026 - Licensed for government deployment in Tanzania
