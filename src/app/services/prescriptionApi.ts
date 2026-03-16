/**
 * E-Prescription System - AfyaCare Tanzania
 * 
 * Digital prescription management with drug interaction checking
 * 
 * Features:
 * - Digital prescription creation
 * - Drug interaction checks (AI-powered)
 * - Pharmacy integration
 * - Prescription fraud prevention
 * - Medication tracking
 */

import { supabase, USE_MOCK_DATA } from './supabase';
import { pharmacyApi } from './pharmacyApi';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Prescription {
  id: string;
  prescription_number: string; // Unique ID (e.g., RX-12345)
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_weight?: number;
  prescriber_id: string;
  prescriber_name: string;
  prescriber_license: string;
  clinic_id?: string;
  clinic_name?: string;
  diagnosis: string;
  medications: PrescriptionMedication[];
  instructions: string;
  status: 'Pending' | 'Dispensed' | 'Partially Dispensed' | 'Cancelled';
  created_at: string;
  dispensed_at?: string;
  dispensed_by?: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
  interactions_checked: boolean;
  interactions?: any[];
}

export interface PrescriptionMedication {
  drug_name: string;
  generic_name?: string;
  dosage: string; // e.g., "500mg"
  frequency: string; // e.g., "3 times daily", "Every 8 hours"
  duration: string; // e.g., "7 days", "14 days"
  quantity: number;
  unit: string; // tablets, capsules, ml, etc.
  route: string; // Oral, IV, IM, Topical, etc.
  instructions: string; // "Take with food", "Before bedtime", etc.
  dispensed: boolean;
  dispensed_quantity?: number;
}

export interface PrescriptionInput {
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_weight?: number;
  prescriber_id: string;
  prescriber_name: string;
  prescriber_license: string;
  clinic_id?: string;
  clinic_name?: string;
  diagnosis: string;
  medications: Omit<PrescriptionMedication, 'dispensed' | 'dispensed_quantity'>[];
  instructions: string;
}

// ============================================================================
// PRESCRIPTION API
// ============================================================================

export const prescriptionApi = {
  /**
   * Create new prescription with drug interaction checking
   */
  async createPrescription(input: PrescriptionInput): Promise<Prescription> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Prescription created', input);
      return getMockPrescription(input);
    }

    try {
      // Check drug interactions
      const drugNames = input.medications.map(m => m.drug_name);
      const interactions = await pharmacyApi.checkDrugInteractions(drugNames);

      // Generate prescription number
      const prescriptionNumber = await generatePrescriptionNumber();

      const prescription: Omit<Prescription, 'id'> = {
        prescription_number: prescriptionNumber,
        patient_id: input.patient_id,
        patient_name: input.patient_name,
        patient_age: input.patient_age,
        patient_weight: input.patient_weight,
        prescriber_id: input.prescriber_id,
        prescriber_name: input.prescriber_name,
        prescriber_license: input.prescriber_license,
        clinic_id: input.clinic_id,
        clinic_name: input.clinic_name,
        diagnosis: input.diagnosis,
        medications: input.medications.map(m => ({
          ...m,
          dispensed: false,
        })),
        instructions: input.instructions,
        status: 'Pending',
        created_at: new Date().toISOString(),
        interactions_checked: true,
        interactions: interactions.length > 0 ? interactions : undefined,
      };

      // Save to database
      const { data, error } = await supabase
        .from('prescriptions')
        .insert(prescription)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  /**
   * Get prescription by ID
   */
  async getPrescription(id: string): Promise<Prescription | null> {
    if (USE_MOCK_DATA) {
      return getMockPrescriptions()[0];
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get prescriptions for patient
   */
  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    if (USE_MOCK_DATA) {
      return getMockPrescriptions();
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get pending prescriptions for pharmacy
   */
  async getPendingPrescriptions(pharmacyId?: string): Promise<Prescription[]> {
    if (USE_MOCK_DATA) {
      return getMockPrescriptions().filter(p => p.status === 'Pending');
    }

    let query = supabase
      .from('prescriptions')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });

    if (pharmacyId) {
      query = query.eq('pharmacy_id', pharmacyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Dispense prescription (full or partial)
   */
  async dispensePrescription(
    prescriptionId: string,
    dispensedMedications: Array<{ drug_name: string; quantity: number }>,
    pharmacyId: string,
    pharmacyName: string,
    dispensedBy: string
  ): Promise<Prescription> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Prescription dispensed', prescriptionId);
      const mock = getMockPrescriptions()[0];
      return {
        ...mock,
        status: 'Dispensed',
        dispensed_at: new Date().toISOString(),
        dispensed_by: dispensedBy,
        pharmacy_id: pharmacyId,
        pharmacy_name: pharmacyName,
      };
    }

    // Get prescription
    const prescription = await this.getPrescription(prescriptionId);
    if (!prescription) throw new Error('Prescription not found');

    // Update medications dispensed status
    const updatedMedications = prescription.medications.map(med => {
      const dispensed = dispensedMedications.find(d => d.drug_name === med.drug_name);
      if (dispensed) {
        return {
          ...med,
          dispensed: dispensed.quantity === med.quantity,
          dispensed_quantity: dispensed.quantity,
        };
      }
      return med;
    });

    // Determine status
    const allDispensed = updatedMedications.every(m => m.dispensed);
    const anyDispensed = updatedMedications.some(m => m.dispensed);
    const status = allDispensed ? 'Dispensed' : anyDispensed ? 'Partially Dispensed' : 'Pending';

    // Update prescription
    const { data, error } = await supabase
      .from('prescriptions')
      .update({
        medications: updatedMedications,
        status,
        dispensed_at: status !== 'Pending' ? new Date().toISOString() : undefined,
        dispensed_by: dispensedBy,
        pharmacy_id: pharmacyId,
        pharmacy_name: pharmacyName,
      })
      .eq('id', prescriptionId)
      .select()
      .single();

    if (error) throw error;

    // Record stock movements for dispensed medications
    for (const med of dispensedMedications) {
      await pharmacyApi.recordMovement({
        drug_id: 'temp', // In production, look up drug_id
        drug_name: med.drug_name,
        movement_type: 'OUT',
        quantity: med.quantity,
        batch_number: 'BATCH-TBD',
        reference: prescription.prescription_number,
        notes: `Dispensed for prescription ${prescription.prescription_number}`,
        performed_by: dispensedBy,
      });
    }

    return data;
  },

  /**
   * Cancel prescription
   */
  async cancelPrescription(prescriptionId: string, reason: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Prescription cancelled', prescriptionId, reason);
      return;
    }

    const { error } = await supabase
      .from('prescriptions')
      .update({
        status: 'Cancelled',
        instructions: `CANCELLED: ${reason}`,
      })
      .eq('id', prescriptionId);

    if (error) throw error;
  },

  /**
   * Verify prescription authenticity
   */
  async verifyPrescription(prescriptionNumber: string, prescriberLicense: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return true;
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .select('prescriber_license')
      .eq('prescription_number', prescriptionNumber)
      .single();

    if (error) return false;
    return data.prescriber_license === prescriberLicense;
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function generatePrescriptionNumber(): Promise<string> {
  // Format: RX-YYYYMMDD-XXXXX
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `RX-${dateStr}-${random}`;
}

// ============================================================================
// MOCK DATA
// ============================================================================

function getMockPrescription(input: PrescriptionInput): Prescription {
  return {
    id: 'mock-rx-' + Date.now(),
    prescription_number: 'RX-20260314-12345',
    patient_id: input.patient_id,
    patient_name: input.patient_name,
    patient_age: input.patient_age,
    patient_weight: input.patient_weight,
    prescriber_id: input.prescriber_id,
    prescriber_name: input.prescriber_name,
    prescriber_license: input.prescriber_license,
    clinic_id: input.clinic_id,
    clinic_name: input.clinic_name,
    diagnosis: input.diagnosis,
    medications: input.medications.map(m => ({ ...m, dispensed: false })),
    instructions: input.instructions,
    status: 'Pending',
    created_at: new Date().toISOString(),
    interactions_checked: true,
    interactions: [],
  };
}

function getMockPrescriptions(): Prescription[] {
  return [
    {
      id: 'rx-001',
      prescription_number: 'RX-20260314-00001',
      patient_id: 'P-0012',
      patient_name: 'Amina Juma',
      patient_age: 28,
      patient_weight: 68,
      prescriber_id: 'DR-001',
      prescriber_name: 'Dr. Kamau',
      prescriber_license: 'MD-TZ-12345',
      clinic_id: 'clinic-001',
      clinic_name: 'Muhimbili Clinic',
      diagnosis: 'Upper respiratory infection',
      medications: [
        {
          drug_name: 'Amoxicillin',
          generic_name: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '7 days',
          quantity: 21,
          unit: 'capsules',
          route: 'Oral',
          instructions: 'Take with food',
          dispensed: false,
        },
        {
          drug_name: 'Paracetamol',
          generic_name: 'Acetaminophen',
          dosage: '500mg',
          frequency: 'Every 6 hours as needed',
          duration: '5 days',
          quantity: 20,
          unit: 'tablets',
          route: 'Oral',
          instructions: 'For fever or pain',
          dispensed: false,
        },
      ],
      instructions: 'Complete the full course of antibiotics. Return if symptoms persist after 3 days.',
      status: 'Pending',
      created_at: new Date().toISOString(),
      interactions_checked: true,
      interactions: [],
    },
  ];
}

// ============================================================================
// COMMON MEDICATIONS
// ============================================================================

export const COMMON_MEDICATIONS = [
  { name: 'Paracetamol', dosages: ['500mg', '1000mg'], forms: ['Tablet', 'Syrup'] },
  { name: 'Amoxicillin', dosages: ['250mg', '500mg'], forms: ['Capsule', 'Suspension'] },
  { name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], forms: ['Tablet'] },
  { name: 'Omeprazole', dosages: ['20mg', '40mg'], forms: ['Capsule'] },
  { name: 'Ibuprofen', dosages: ['200mg', '400mg'], forms: ['Tablet', 'Suspension'] },
  { name: 'Artemether-Lumefantrine (Coartem)', dosages: ['20/120mg'], forms: ['Tablet'] },
  { name: 'Ciprofloxacin', dosages: ['250mg', '500mg'], forms: ['Tablet'] },
  { name: 'ORS (Oral Rehydration Salts)', dosages: ['20.5g sachet'], forms: ['Powder'] },
];

export const DOSAGE_FREQUENCIES = [
  'Once daily',
  'Twice daily',
  '3 times daily',
  '4 times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before bedtime',
  'With meals',
];

export const ROUTES_OF_ADMINISTRATION = [
  'Oral',
  'Intravenous (IV)',
  'Intramuscular (IM)',
  'Subcutaneous (SC)',
  'Topical',
  'Rectal',
  'Inhalation',
];
