/**
 * Supabase Client Configuration
 * 
 * PRODUCTION SETUP:
 * 1. Replace SUPABASE_URL and SUPABASE_ANON_KEY with real values
 * 2. Enable RLS policies in Supabase dashboard
 * 3. Set up database tables (see schema.sql)
 * 
 * SECURITY:
 * - Uses anon key (safe for client-side)
 * - RLS policies enforce data access control
 * - No secrets exposed
 */

import { createClient } from '@supabase/supabase-js';

// DEPLOYMENT: Replace with actual Supabase project credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'afyacare-tanzania',
    },
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: Appointment;
        Insert: AppointmentInsert;
        Update: AppointmentUpdate;
      };
      medications: {
        Row: Medication;
        Insert: MedicationInsert;
        Update: MedicationUpdate;
      };
      test_results: {
        Row: TestResult;
        Insert: TestResultInsert;
        Update: TestResultUpdate;
      };
      facilities: {
        Row: Facility;
        Insert: FacilityInsert;
        Update: FacilityUpdate;
      };
      symptom_assessments: {
        Row: SymptomAssessment;
        Insert: SymptomAssessmentInsert;
        Update: SymptomAssessmentUpdate;
      };
      maternal_care: {
        Row: MaternalCare;
        Insert: MaternalCareInsert;
        Update: MaternalCareUpdate;
      };
      offline_queue: {
        Row: OfflineQueueItem;
        Insert: OfflineQueueInsert;
        Update: OfflineQueueUpdate;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
    };
  };
}

// Type Definitions
export interface Appointment {
  id: string;
  user_id: string;
  facility_id: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
  notes?: string;
  has_insurance: boolean;
  created_at: string;
  updated_at: string;
}

export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
export type AppointmentUpdate = Partial<AppointmentInsert>;

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  reminder_times: string[];
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type MedicationInsert = Omit<Medication, 'id' | 'created_at' | 'updated_at'>;
export type MedicationUpdate = Partial<MedicationInsert>;

export interface TestResult {
  id: string;
  user_id: string;
  facility_id: string;
  test_type: string;
  test_date: string;
  results: any; // JSON field
  status: 'pending' | 'completed' | 'reviewed';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export type TestResultInsert = Omit<TestResult, 'id' | 'created_at' | 'updated_at'>;
export type TestResultUpdate = Partial<TestResultInsert>;

export interface Facility {
  id: string;
  name: string;
  name_sw: string;
  type: 'hospital' | 'health_center' | 'dispensary' | 'clinic';
  address: string;
  address_sw: string;
  region: string;
  district: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  services: string[];
  operating_hours?: any; // JSON field
  current_load?: 'low' | 'medium' | 'high';
  wait_time_minutes?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type FacilityInsert = Omit<Facility, 'id' | 'created_at' | 'updated_at'>;
export type FacilityUpdate = Partial<FacilityInsert>;

export interface SymptomAssessment {
  id: string;
  user_id?: string;
  session_id: string;
  symptoms: any; // JSON field - array of answered questions
  triage_result: any; // JSON field - ClinicalTriageEngine output
  language: 'sw' | 'en';
  created_at: string;
}

export type SymptomAssessmentInsert = Omit<SymptomAssessment, 'id' | 'created_at'>;
export type SymptomAssessmentUpdate = Partial<SymptomAssessmentInsert>;

export interface MaternalCare {
  id: string;
  user_id: string;
  pregnancy_start_date: string;
  estimated_due_date: string;
  current_week: number;
  risk_level: 'low' | 'medium' | 'high';
  vital_signs: any[]; // JSON array
  checkups: any[]; // JSON array
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type MaternalCareInsert = Omit<MaternalCare, 'id' | 'created_at' | 'updated_at'>;
export type MaternalCareUpdate = Partial<MaternalCareInsert>;

export interface OfflineQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any; // JSON field
  status: 'pending' | 'synced' | 'failed';
  retry_count: number;
  error_message?: string;
  created_at: string;
  synced_at?: string;
}

export type OfflineQueueInsert = Omit<OfflineQueueItem, 'id' | 'created_at' | 'synced_at'>;
export type OfflineQueueUpdate = Partial<OfflineQueueInsert>;

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata: any; // JSON field
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>;
export type AuditLogUpdate = Partial<AuditLogInsert>;

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL !== 'https://your-project.supabase.co' &&
    SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

// Mock mode check
export const USE_MOCK_DATA = !isSupabaseConfigured();

if (USE_MOCK_DATA) {
  console.warn(
    '⚠️ Supabase not configured. Running in MOCK MODE. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}
