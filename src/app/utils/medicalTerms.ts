/**
 * Medical Terminology Control Layer
 * 
 * CRITICAL: Medical terms must be manually verified by healthcare professionals.
 * Never rely on automated translation for clinical phrases.
 * 
 * All terms follow MoH Tanzania standards and WHO medical terminology guidelines.
 * 
 * COMPLIANCE:
 * - TMDA SaMD regulations
 * - Tanzania Medical Council terminology standards
 * - WHO ICD-11 alignment where applicable
 */

export interface MedicalTerm {
  sw: string;
  en: string;
  category: 'emergency' | 'diagnosis' | 'symptom' | 'treatment' | 'medication' | 'vital' | 'condition';
  verified: boolean; // Must be verified by qualified healthcare professional
  source?: string; // Reference to verification source
}

/**
 * EMERGENCY TERMS
 * Highest priority - must be immediately recognizable
 */
export const emergencyTerms: Record<string, MedicalTerm> = {
  emergency: {
    sw: 'Dharura',
    en: 'Emergency',
    category: 'emergency',
    verified: true,
    source: 'Tanzania MoH Emergency Care Guidelines 2023'
  },
  urgent: {
    sw: 'Ya Haraka',
    en: 'Urgent',
    category: 'emergency',
    verified: true,
    source: 'Tanzania MoH Triage Protocol'
  },
  criticalCondition: {
    sw: 'Hali Hatari',
    en: 'Critical Condition',
    category: 'emergency',
    verified: true,
    source: 'Tanzania MoH Emergency Care Guidelines 2023'
  },
  ambulance: {
    sw: 'Gari la Wagonjwa',
    en: 'Ambulance',
    category: 'emergency',
    verified: true
  },
  firstAid: {
    sw: 'Msaada wa Kwanza',
    en: 'First Aid',
    category: 'emergency',
    verified: true
  }
};

/**
 * COMMON SYMPTOMS
 * Patient-facing terminology, must be culturally appropriate
 */
export const symptomTerms: Record<string, MedicalTerm> = {
  fever: {
    sw: 'Homa',
    en: 'Fever',
    category: 'symptom',
    verified: true,
    source: 'Tanzania Standard Treatment Guidelines'
  },
  headache: {
    sw: 'Maumivu ya Kichwa',
    en: 'Headache',
    category: 'symptom',
    verified: true
  },
  cough: {
    sw: 'Kikohozi',
    en: 'Cough',
    category: 'symptom',
    verified: true
  },
  diarrhea: {
    sw: 'Kuhara',
    en: 'Diarrhea',
    category: 'symptom',
    verified: true
  },
  vomiting: {
    sw: 'Kutapika',
    en: 'Vomiting',
    category: 'symptom',
    verified: true
  },
  chestPain: {
    sw: 'Maumivu ya Kifua',
    en: 'Chest Pain',
    category: 'symptom',
    verified: true,
    source: 'Tanzania MoH Emergency Care Guidelines 2023'
  },
  breathingDifficulty: {
    sw: 'Ugumu wa Kupumua',
    en: 'Difficulty Breathing',
    category: 'symptom',
    verified: true,
    source: 'Tanzania MoH Emergency Care Guidelines 2023'
  },
  abdominalPain: {
    sw: 'Maumivu ya Tumbo',
    en: 'Abdominal Pain',
    category: 'symptom',
    verified: true
  },
  fatigue: {
    sw: 'Uchovu',
    en: 'Fatigue',
    category: 'symptom',
    verified: true
  },
  dizziness: {
    sw: 'Kizunguzungu',
    en: 'Dizziness',
    category: 'symptom',
    verified: true
  }
};

/**
 * VITAL SIGNS
 * Medical measurement terminology
 */
export const vitalTerms: Record<string, MedicalTerm> = {
  bloodPressure: {
    sw: 'Shinikizo la Damu',
    en: 'Blood Pressure',
    category: 'vital',
    verified: true,
    source: 'Tanzania Standard Treatment Guidelines'
  },
  heartRate: {
    sw: 'Mapigo ya Moyo',
    en: 'Heart Rate',
    category: 'vital',
    verified: true
  },
  temperature: {
    sw: 'Joto la Mwili',
    en: 'Temperature',
    category: 'vital',
    verified: true
  },
  respiratoryRate: {
    sw: 'Kasi ya Kupumua',
    en: 'Respiratory Rate',
    category: 'vital',
    verified: true
  },
  oxygenSaturation: {
    sw: 'Kiwango cha Oksijeni',
    en: 'Oxygen Saturation',
    category: 'vital',
    verified: true
  },
  bloodGlucose: {
    sw: 'Sukari ya Damu',
    en: 'Blood Glucose',
    category: 'vital',
    verified: true
  },
  weight: {
    sw: 'Uzito',
    en: 'Weight',
    category: 'vital',
    verified: true
  },
  height: {
    sw: 'Urefu',
    en: 'Height',
    category: 'vital',
    verified: true
  }
};

/**
 * COMMON CONDITIONS
 * Diagnosed conditions and chronic diseases
 */
export const conditionTerms: Record<string, MedicalTerm> = {
  hypertension: {
    sw: 'Shinikizo la Juu la Damu',
    en: 'Hypertension',
    category: 'condition',
    verified: true,
    source: 'Tanzania Standard Treatment Guidelines - NCDs'
  },
  diabetes: {
    sw: 'Kisukari',
    en: 'Diabetes',
    category: 'condition',
    verified: true,
    source: 'Tanzania Standard Treatment Guidelines - NCDs'
  },
  asthma: {
    sw: 'Pumu',
    en: 'Asthma',
    category: 'condition',
    verified: true
  },
  malaria: {
    sw: 'Malaria',
    en: 'Malaria',
    category: 'condition',
    verified: true,
    source: 'Tanzania National Malaria Guidelines'
  },
  tuberculosis: {
    sw: 'Kifua Kikuu',
    en: 'Tuberculosis',
    category: 'condition',
    verified: true,
    source: 'Tanzania TB Guidelines'
  },
  hiv: {
    sw: 'VVU',
    en: 'HIV',
    category: 'condition',
    verified: true,
    source: 'Tanzania HIV Care and Treatment Guidelines'
  },
  pregnancy: {
    sw: 'Ujauzito',
    en: 'Pregnancy',
    category: 'condition',
    verified: true,
    source: 'Tanzania RCH Guidelines'
  }
};

/**
 * TREATMENT TERMS
 */
export const treatmentTerms: Record<string, MedicalTerm> = {
  prescription: {
    sw: 'Agizo la Dawa',
    en: 'Prescription',
    category: 'treatment',
    verified: true
  },
  medication: {
    sw: 'Dawa',
    en: 'Medication',
    category: 'treatment',
    verified: true
  },
  dosage: {
    sw: 'Kipimo',
    en: 'Dosage',
    category: 'treatment',
    verified: true
  },
  treatment: {
    sw: 'Matibabu',
    en: 'Treatment',
    category: 'treatment',
    verified: true
  },
  therapy: {
    sw: 'Tiba',
    en: 'Therapy',
    category: 'treatment',
    verified: true
  },
  vaccination: {
    sw: 'Chanjo',
    en: 'Vaccination',
    category: 'treatment',
    verified: true,
    source: 'Tanzania Immunization Guidelines'
  }
};

/**
 * Get medical term in specified language
 * Fallback to English if term not found or not verified
 */
export function getMedicalTerm(
  termKey: string,
  language: 'sw' | 'en',
  category?: MedicalTerm['category']
): string {
  // Search in all categories
  const allTerms = {
    ...emergencyTerms,
    ...symptomTerms,
    ...vitalTerms,
    ...conditionTerms,
    ...treatmentTerms
  };

  const term = allTerms[termKey];

  if (!term) {
    console.warn(`Medical term not found: ${termKey}`);
    return termKey; // Return key as fallback
  }

  if (!term.verified) {
    console.warn(`Medical term not verified: ${termKey}. Using English fallback.`);
    return term.en;
  }

  return term[language];
}

/**
 * Validate if a medical term is properly verified
 * Used during development to ensure all terms meet standards
 */
export function validateMedicalTerms(): {
  valid: boolean;
  unverified: string[];
  missing: string[];
} {
  const allTerms = {
    ...emergencyTerms,
    ...symptomTerms,
    ...vitalTerms,
    ...conditionTerms,
    ...treatmentTerms
  };

  const unverified = Object.entries(allTerms)
    .filter(([_, term]) => !term.verified)
    .map(([key]) => key);

  const missingSources = Object.entries(allTerms)
    .filter(([_, term]) => term.category === 'emergency' && !term.source)
    .map(([key]) => key);

  return {
    valid: unverified.length === 0 && missingSources.length === 0,
    unverified,
    missing: missingSources
  };
}

/**
 * USAGE EXAMPLE:
 * 
 * import { getMedicalTerm } from '@/app/utils/medicalTerms';
 * 
 * const emergencyText = getMedicalTerm('emergency', language);
 * const feverText = getMedicalTerm('fever', language);
 */

/**
 * CRITICAL MEDICAL PHRASES
 * These phrases must never be altered or auto-translated
 */
export const criticalPhrases = {
  emergencyDisclaimer: {
    sw: 'Kama hii ni hali ya dharura ya matibabu, piga simu 112 mara moja au nenda hospitali ya karibu zaidi.',
    en: 'If this is a medical emergency, call 112 immediately or go to the nearest hospital.',
    verified: true
  },
  notMedicalAdvice: {
    sw: 'Msaada huu si badala ya ushauri wa kitaalamu wa matibabu.',
    en: 'This assistance is not a substitute for professional medical advice.',
    verified: true
  },
  seekProfessionalHelp: {
    sw: 'Tafadhali wasiliana na mtaalamu wa afya kwa ushauri wa kibinafsi.',
    en: 'Please consult with a healthcare professional for personalized advice.',
    verified: true
  }
};
