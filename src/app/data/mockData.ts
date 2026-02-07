// Mock Data for AfyaAI TZA Demo
// In production, this would connect to real databases and APIs

export const mockUserData = {
  patient: {
    id: 'P12345',
    name: 'Amina Hassan',
    age: 32,
    gender: 'Female',
    region: 'Dar es Salaam',
    ward: 'Kinondoni',
    phone: '+255 712 345 678',
    isPregnant: false,
    chronicConditions: ['Hypertension'],
    lastVisit: '2026-01-10',
  },
  chw: {
    id: 'CHW456',
    name: 'James Mwakasege',
    region: 'Dar es Salaam',
    ward: 'Kinondoni',
    households: 156,
    totalPatients: 624,
    visitsDone: 1247,
  },
  clinician: {
    id: 'CLN789',
    name: 'Dr. Sarah Mbwana',
    specialty: 'General Practice',
    facility: 'Mwananyamala Hospital',
    patientsToday: 28,
  },
  admin: {
    id: 'ADM001',
    name: 'Dr. Mohamed Khamis',
    role: 'Regional Health Officer',
    region: 'Dar es Salaam',
  },
};

// Mock AI Models Info
export const aiModels = {
  symptomChecker: {
    version: '2.1.3',
    accuracy: 87.5,
    trainingData: 'WHO IMCI + Tanzania DHS 2022',
    lastUpdated: '2025-12-15',
  },
  imagingAI: {
    version: '1.8.2',
    accuracy: 92.1,
    trainingData: 'Tanzania Chest X-ray Dataset + WHO TB Dataset',
    lastUpdated: '2025-11-20',
  },
  riskPrediction: {
    version: '3.0.1',
    accuracy: 84.3,
    trainingData: 'Tanzania Facility Data 2020-2025',
    lastUpdated: '2026-01-05',
  },
};

// Mock Disease Patterns (for AI symptom checker)
export const diseasePatterns = {
  malaria: {
    symptoms: ['fever', 'headache', 'chills', 'sweating'],
    prevalence: 0.35,
    seasonality: 'high_in_rainy_season',
  },
  tb: {
    symptoms: ['cough', 'fever', 'weight_loss', 'night_sweats'],
    prevalence: 0.12,
    duration: 'chronic',
  },
  ari: {
    symptoms: ['cough', 'fever', 'breathing_difficulty', 'chest_pain'],
    prevalence: 0.25,
    duration: 'acute',
  },
  diarrhea: {
    symptoms: ['diarrhea', 'vomiting', 'dehydration', 'fever'],
    prevalence: 0.18,
    duration: 'acute',
  },
};

// Mock Facility Data
export const mockFacilities = [
  {
    id: 'FAC001',
    name: 'Mwananyamala Hospital',
    type: 'Hospital',
    region: 'Dar es Salaam',
    coordinates: { lat: -6.7924, lng: 39.2083 },
    capacity: 450,
    currentLoad: 385,
    hasXray: true,
    hasMRI: false,
    hasUltrasound: true,
    stockStatus: {
      malariaDrugs: 'adequate',
      tbDrugs: 'low',
      vaccines: 'adequate',
    },
  },
  {
    id: 'FAC002',
    name: 'Temeke District Hospital',
    type: 'Hospital',
    region: 'Dar es Salaam',
    coordinates: { lat: -6.8642, lng: 39.2733 },
    capacity: 320,
    currentLoad: 295,
    hasXray: true,
    hasMRI: false,
    hasUltrasound: true,
    stockStatus: {
      malariaDrugs: 'adequate',
      tbDrugs: 'adequate',
      vaccines: 'low',
    },
  },
];

// Mock Maternal Health Data
export const mockMaternalData = {
  totalPregnant: 12450,
  highRisk: 2340,
  anc4Coverage: 78, // percentage
  deliveryInFacility: 82, // percentage
  maternalMortality: 398, // per 100,000 live births - Tanzania target
  aiPredictions: {
    potentialComplications: 450,
    needingReferral: 125,
  },
};

// Mock NCD Data
export const mockNCDData = {
  hypertension: {
    total: 45600,
    controlled: 28900,
    onMedication: 38200,
  },
  diabetes: {
    total: 18900,
    controlled: 12300,
    onMedication: 16700,
  },
  aiRiskPredictions: {
    newCasesNextMonth: 1250,
    hospitalizationRisk: 340,
  },
};

// Mock Regional Health Statistics
export const mockRegionalStats = {
  'Dar es Salaam': {
    population: 5465133,
    facilities: 245,
    chws: 489,
    patients: 125670,
    diseasePrevalence: {
      malaria: 0.28,
      tb: 0.15,
      ncds: 0.32,
    },
  },
  Mwanza: {
    population: 3625844,
    facilities: 189,
    chws: 378,
    patients: 89500,
    diseasePrevalence: {
      malaria: 0.42,
      tb: 0.11,
      ncds: 0.21,
    },
  },
  Arusha: {
    population: 2258571,
    facilities: 156,
    chws: 312,
    patients: 67200,
    diseasePrevalence: {
      malaria: 0.18,
      tb: 0.09,
      ncds: 0.25,
    },
  },
};

// WHO IMCI Danger Signs (used by AI)
export const whoIMCIDangerSigns = {
  general: [
    'unable_to_drink_or_breastfeed',
    'vomits_everything',
    'has_had_convulsions',
    'lethargic_or_unconscious',
  ],
  respiratory: [
    'severe_breathing_difficulty',
    'chest_indrawing',
    'stridor_in_calm_child',
    'very_fast_breathing',
  ],
  maternal: [
    'severe_headache',
    'blurred_vision',
    'convulsions',
    'severe_abdominal_pain',
    'vaginal_bleeding',
    'high_fever',
  ],
};

// Mock Telemedicine Queue
export const mockTelemedicineQueue = [
  {
    id: 'TM001',
    patientName: 'Amina Hassan',
    symptoms: 'Fever, headache',
    waitTime: 15,
    priority: 'medium',
  },
  {
    id: 'TM002',
    patientName: 'John Mwanga',
    symptoms: 'Chest pain',
    waitTime: 5,
    priority: 'high',
  },
];

// Export all mock data
export const mockData = {
  users: mockUserData,
  aiModels,
  diseasePatterns,
  facilities: mockFacilities,
  maternal: mockMaternalData,
  ncds: mockNCDData,
  regional: mockRegionalStats,
  dangerSigns: whoIMCIDangerSigns,
  telemedicine: mockTelemedicineQueue,
};
