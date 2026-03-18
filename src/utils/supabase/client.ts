/**
 * Supabase Client for Kliniki
 * 
 * Singleton instance for database operations
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please add to .env file:');
  console.warn('VITE_SUPABASE_URL=your-project-url');
  console.warn('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Create singleton client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application': 'kliniki',
    },
  },
});

// Database types (auto-generated from schema)
export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          patient_number: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: string;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_number?: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_number?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          updated_at?: string;
        };
      };
      triage_records: {
        Row: {
          id: string;
          patient_id: string;
          staff_id: string;
          chief_complaint: string;
          priority: string;
          symptoms: string[] | null;
          notes: string | null;
          created_at: string;
        };
      };
      vitals: {
        Row: {
          id: string;
          patient_id: string;
          triage_id: string | null;
          temperature: number | null;
          bp_systolic: number | null;
          bp_diastolic: number | null;
          heart_rate: number | null;
          respiratory_rate: number | null;
          oxygen_saturation: number | null;
          weight: number | null;
          height: number | null;
          bmi: number | null;
          created_at: string;
        };
      };
      prescriptions: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          consultation_id: string | null;
          status: string;
          created_at: string;
        };
      };
      prescription_items: {
        Row: {
          id: string;
          prescription_id: string;
          drug_id: string;
          dosage: string;
          frequency: string;
          duration: string;
          instructions: string | null;
          quantity: number;
        };
      };
    };
  };
};

// Helper functions
export const db = {
  // Patients
  patients: {
    list: async (limit = 50, offset = 0) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      return { data, error };
    },
    
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    
    create: async (patient: Database['public']['Tables']['patients']['Insert']) => {
      const { data, error } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single();
      
      return { data, error };
    },
    
    update: async (id: string, updates: Database['public']['Tables']['patients']['Update']) => {
      const { data, error } = await supabase
        .from('patients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    },
    
    search: async (query: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,patient_number.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      return { data, error };
    },
  },
  
  // Triage
  triage: {
    create: async (triage: {
      patient_id: string;
      staff_id: string;
      chief_complaint: string;
      priority: string;
      symptoms?: string[];
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('triage_records')
        .insert(triage)
        .select()
        .single();
      
      return { data, error };
    },
    
    getByPatient: async (patientId: string) => {
      const { data, error } = await supabase
        .from('triage_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },
  },
  
  // Vitals
  vitals: {
    create: async (vitals: {
      patient_id: string;
      triage_id?: string;
      temperature?: number;
      bp_systolic?: number;
      bp_diastolic?: number;
      heart_rate?: number;
      respiratory_rate?: number;
      oxygen_saturation?: number;
      weight?: number;
      height?: number;
    }) => {
      const { data, error } = await supabase
        .from('vitals')
        .insert(vitals)
        .select()
        .single();
      
      return { data, error };
    },
    
    getByPatient: async (patientId: string, limit = 10) => {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return { data, error };
    },
    
    getLatest: async (patientId: string) => {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    },
  },
  
  // Prescriptions
  prescriptions: {
    create: async (prescription: {
      patient_id: string;
      doctor_id: string;
      consultation_id?: string;
      items: Array<{
        drug_id: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
        quantity: number;
      }>;
    }) => {
      // Create prescription header
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: prescription.patient_id,
          doctor_id: prescription.doctor_id,
          consultation_id: prescription.consultation_id,
          status: 'active',
        })
        .select()
        .single();
      
      if (prescriptionError) return { data: null, error: prescriptionError };
      
      // Add items
      const itemsWithPrescriptionId = prescription.items.map(item => ({
        ...item,
        prescription_id: prescriptionData.id,
      }));
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('prescription_items')
        .insert(itemsWithPrescriptionId)
        .select();
      
      if (itemsError) return { data: null, error: itemsError };
      
      return {
        data: {
          ...prescriptionData,
          items: itemsData,
        },
        error: null,
      };
    },
    
    getByPatient: async (patientId: string) => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },
  },
};

export default supabase;
