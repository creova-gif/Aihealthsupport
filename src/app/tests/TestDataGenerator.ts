/**
 * TEST DATA GENERATOR
 * AfyaCare Tanzania
 * 
 * Generates realistic test data for:
 * - Patients (with Tanzanian names)
 * - Clinical encounters
 * - Lab results
 * - Prescriptions
 * - Vitals
 * - Complete patient histories
 * - Multi-facility scenarios
 * - Edge cases & stress testing
 * 
 * Usage:
 *   const generator = new TestDataGenerator();
 *   const patients = generator.generatePatients(100);
 *   const hospital = generator.generateHospitalDay('fac-001', 500);
 */

export class TestDataGenerator {
  private patientCounter = 1;
  private encounterCounter = 1;

  // Tanzanian names for realistic test data
  private maleFirstNames = [
    'Juma', 'Hassan', 'Hamisi', 'Ramadhani', 'Selemani', 'Saidi', 'Omari',
    'Ally', 'Abdallah', 'Salum', 'Shabani', 'Musa', 'Rashidi', 'Bakari'
  ];

  private femaleFirstNames = [
    'Fatuma', 'Halima', 'Zainab', 'Mwanaisha', 'Amina', 'Asha', 'Rehema',
    'Mariam', 'Hadija', 'Aziza', 'Neema', 'Grace', 'Esther', 'Sarah'
  ];

  private lastNames = [
    'Mwangi', 'Kileo', 'Mbwana', 'Mushi', 'Haule', 'Ngowi', 'Lukindo',
    'Msigwa', 'Mtega', 'Massawe', 'Kimaro', 'Mosha', 'Lyimo', 'Pallangyo',
    'Rugemalira', 'Malipula', 'Mahundi', 'Swai', 'Mollel', 'Kisamo'
  ];

  private cities = [
    'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro',
    'Tanga', 'Kahama', 'Tabora', 'Zanzibar', 'Kigoma', 'Songea', 'Moshi',
    'Musoma', 'Shinyanga', 'Iringa', 'Singida', 'Njombe', 'Bukoba', 'Lindi'
  ];

  /**
   * GENERATE SINGLE PATIENT
   */
  generatePatient(overrides?: Partial<any>): any {
    const sex = overrides?.sex || this.randomChoice(['male', 'female']);
    const firstName = sex === 'male' 
      ? this.randomChoice(this.maleFirstNames)
      : this.randomChoice(this.femaleFirstNames);
    const lastName = this.randomChoice(this.lastNames);
    const dateOfBirth = this.randomDate(new Date('1940-01-01'), new Date('2023-12-31'));
    const age = this.calculateAge(dateOfBirth);

    return {
      patient_id: `test-pat-${String(this.patientCounter++).padStart(5, '0')}`,
      afya_id: `AFY-${this.randomNumber(100, 999)}-${new Date().getFullYear()}`,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      age,
      sex,
      phone_number: `+2557${this.randomNumber(10000000, 99999999)}`,
      city: this.randomChoice(this.cities),
      region: this.randomChoice(['Dar es Salaam', 'Kilimanjaro', 'Arusha', 'Mwanza']),
      blood_type: this.randomChoice(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      allergies: this.generateAllergies(),
      chronic_conditions: this.generateChronicConditions(age),
      nhif_number: Math.random() > 0.4 ? `NHIF-${this.randomNumber(100000, 999999)}` : null,
      created_at: new Date(),
      ...overrides
    };
  }

  /**
   * GENERATE MULTIPLE PATIENTS
   */
  generatePatients(count: number): any[] {
    const patients = [];
    for (let i = 0; i < count; i++) {
      patients.push(this.generatePatient());
    }
    return patients;
  }

  /**
   * GENERATE PATIENT WITH COMPLETE MEDICAL HISTORY
   */
  generatePatientWithHistory(yearsOfHistory: number = 5): any {
    const patient = this.generatePatient();
    const encounters = [];
    const currentDate = new Date();

    // Generate encounters over the years
    for (let year = 0; year < yearsOfHistory; year++) {
      const encountersThisYear = this.randomNumber(2, 8);
      
      for (let i = 0; i < encountersThisYear; i++) {
        const encounterDate = new Date(
          currentDate.getFullYear() - year,
          this.randomNumber(0, 11),
          this.randomNumber(1, 28)
        );

        const encounter = this.generateEncounter(patient.patient_id, encounterDate);
        encounters.push(encounter);
      }
    }

    return {
      patient,
      encounters,
      totalVisits: encounters.length,
      lastVisit: encounters[encounters.length - 1]?.check_in_time
    };
  }

  /**
   * GENERATE ENCOUNTER
   */
  generateEncounter(patientId: string, date?: Date): any {
    const encounterDate = date || new Date();
    const encounterTypes = [
      { type: 'outpatient', department: 'OPD', weight: 70 },
      { type: 'emergency', department: 'Emergency', weight: 15 },
      { type: 'inpatient', department: 'Medical Ward', weight: 10 },
      { type: 'maternity', department: 'Maternity', weight: 5 }
    ];

    const encounterType = this.weightedRandomChoice(encounterTypes);

    return {
      encounter_id: `test-enc-${String(this.encounterCounter++).padStart(6, '0')}`,
      patient_id: patientId,
      encounter_type: encounterType.type,
      department: encounterType.department,
      check_in_time: encounterDate,
      check_out_time: new Date(encounterDate.getTime() + this.randomNumber(30, 240) * 60000),
      status: this.randomChoice(['completed', 'in-progress', 'checked-out']),
      chief_complaint: this.generateChiefComplaint(),
      vitals: this.generateVitals(),
      clinical_note: this.generateClinicalNote(),
      prescriptions: this.generatePrescriptions(),
      lab_orders: Math.random() > 0.7 ? this.generateLabOrders() : [],
      diagnosis: this.generateDiagnosis(),
      created_at: encounterDate
    };
  }

  /**
   * GENERATE VITALS
   */
  generateVitals(): any {
    const systolic = this.randomNumber(90, 180);
    const diastolic = this.randomNumber(60, 110);
    const temp = this.randomFloat(36.0, 40.0, 1);
    const isAbnormal = systolic > 140 || diastolic > 90 || temp > 37.5;

    return {
      blood_pressure_systolic: systolic,
      blood_pressure_diastolic: diastolic,
      heart_rate: this.randomNumber(60, 120),
      respiratory_rate: this.randomNumber(12, 24),
      temperature: temp,
      oxygen_saturation: this.randomNumber(92, 100),
      weight: this.randomFloat(40, 120, 1),
      height: this.randomNumber(140, 190),
      is_abnormal: isAbnormal,
      recorded_at: new Date()
    };
  }

  /**
   * GENERATE CLINICAL NOTE (SOAP FORMAT)
   */
  generateClinicalNote(): any {
    const templates = [
      {
        subjective: 'Patient reports fever and body aches for 3 days. No cough or difficulty breathing.',
        objective: 'Temperature 38.5°C, BP 120/80, HR 88. Chest clear, no lymphadenopathy.',
        assessment: 'Likely viral syndrome',
        plan: 'Symptomatic treatment with paracetamol. Advised rest and fluids. Return if worsening.'
      },
      {
        subjective: 'Headache and dizziness for 1 week. No trauma.',
        objective: 'BP 160/100, neurological exam normal.',
        assessment: 'Hypertension, newly diagnosed',
        plan: 'Start amlodipine 5mg daily. Lifestyle counseling. Follow-up in 2 weeks.'
      },
      {
        subjective: 'Cough with yellow sputum for 5 days, shortness of breath.',
        objective: 'Fever 38.2°C, crackles in right lower lobe, SpO2 94%.',
        assessment: 'Community-acquired pneumonia',
        plan: 'Chest X-ray ordered. Start amoxicillin. Consider admission if no improvement.'
      }
    ];

    const note = this.randomChoice(templates);
    return {
      ...note,
      is_signed: Math.random() > 0.3,
      signed_by: 'doctor-001',
      signed_at: new Date()
    };
  }

  /**
   * GENERATE PRESCRIPTIONS
   */
  generatePrescriptions(): any[] {
    const commonMeds = [
      { name: 'Paracetamol 500mg', dosage: '1 tablet every 8 hours', duration: 5 },
      { name: 'Amoxicillin 500mg', dosage: '1 capsule every 8 hours', duration: 7 },
      { name: 'Amlodipine 5mg', dosage: '1 tablet once daily', duration: 30 },
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: 30 },
      { name: 'ORS sachets', dosage: '1 sachet in 1L water after each loose stool', duration: 3 },
      { name: 'Artemether-Lumefantrine', dosage: 'As per weight-based protocol', duration: 3 }
    ];

    const count = this.randomNumber(1, 3);
    const prescriptions = [];

    for (let i = 0; i < count; i++) {
      const med = this.randomChoice(commonMeds);
      prescriptions.push({
        prescription_id: `test-rx-${this.randomNumber(100000, 999999)}`,
        medication_name: med.name,
        dosage: med.dosage,
        quantity: med.duration * 3,
        duration_days: med.duration,
        dispense_status: this.randomChoice(['pending', 'dispensed', 'partially_dispensed']),
        created_at: new Date()
      });
    }

    return prescriptions;
  }

  /**
   * GENERATE LAB ORDERS
   */
  generateLabOrders(): any[] {
    const tests = [
      'Complete Blood Count (CBC)',
      'Malaria RDT',
      'Blood Glucose',
      'Urinalysis',
      'Stool Microscopy',
      'Liver Function Tests',
      'Kidney Function Tests',
      'HIV Test',
      'Pregnancy Test'
    ];

    const count = this.randomNumber(1, 3);
    const orders = [];

    for (let i = 0; i < count; i++) {
      orders.push({
        order_id: `test-lab-${this.randomNumber(100000, 999999)}`,
        test_name: this.randomChoice(tests),
        status: this.randomChoice(['pending', 'in_progress', 'completed']),
        result: Math.random() > 0.5 ? this.generateLabResult() : null,
        ordered_at: new Date()
      });
    }

    return orders;
  }

  /**
   * GENERATE LAB RESULT
   */
  generateLabResult(): any {
    return {
      result_value: this.randomFloat(10, 150, 1),
      unit: this.randomChoice(['g/dL', 'mmol/L', 'mg/dL', 'cells/μL']),
      reference_range: '10.0-15.0',
      interpretation: this.randomChoice(['normal', 'low', 'high', 'critical']),
      verified_at: new Date(),
      verified_by: 'lab-tech-001'
    };
  }

  /**
   * GENERATE COMPLETE HOSPITAL DAY
   */
  generateHospitalDay(facilityId: string, patientCount: number): any {
    const patients = this.generatePatients(patientCount);
    const encounters = patients.map(p => this.generateEncounter(p.patient_id));
    
    const stats = {
      total_patients: patientCount,
      opd_visits: encounters.filter(e => e.encounter_type === 'outpatient').length,
      emergency_visits: encounters.filter(e => e.encounter_type === 'emergency').length,
      admissions: encounters.filter(e => e.encounter_type === 'inpatient').length,
      total_prescriptions: encounters.reduce((sum, e) => sum + e.prescriptions.length, 0),
      total_lab_orders: encounters.reduce((sum, e) => sum + e.lab_orders.length, 0)
    };

    return {
      facility_id: facilityId,
      date: new Date(),
      patients,
      encounters,
      stats
    };
  }

  /**
   * GENERATE EDGE CASES
   */
  generateEdgeCases(): any {
    return {
      extremeAges: [
        this.generatePatient({ date_of_birth: new Date('1920-01-01') }), // 106 years old
        this.generatePatient({ date_of_birth: new Date() }) // Newborn
      ],
      longNames: this.generatePatient({
        first_name: 'Abcdefghijklmnopqrstuvwxyz',
        last_name: 'VeryLongLastNameThatExceedsNormalLength'
      }),
      specialCharacters: this.generatePatient({
        first_name: "O'Brien-Smith",
        last_name: "N'Dour-François"
      }),
      multipleAllergies: this.generatePatient({
        allergies: ['Penicillin', 'Sulfa drugs', 'NSAIDs', 'Latex', 'Shellfish']
      }),
      noPhoneNumber: this.generatePatient({ phone_number: null }),
      internationalPhone: this.generatePatient({ phone_number: '+1-555-123-4567' })
    };
  }

  /**
   * GENERATE STRESS TEST DATA
   */
  generateStressTestData(patientCount: number, encountersPerPatient: number): any {
    const patients = this.generatePatients(patientCount);
    const allEncounters = [];

    patients.forEach(patient => {
      for (let i = 0; i < encountersPerPatient; i++) {
        allEncounters.push(this.generateEncounter(patient.patient_id));
      }
    });

    return {
      patients,
      encounters: allEncounters,
      totalRecords: patients.length + allEncounters.length,
      estimatedSizeKB: (patients.length * 2) + (allEncounters.length * 5) // Rough estimate
    };
  }

  /**
   * GENERATE DUPLICATE PATIENTS (FOR MPI TESTING)
   */
  generateDuplicatePatients(): any[] {
    const original = this.generatePatient({
      first_name: 'John',
      last_name: 'Mwangi',
      date_of_birth: new Date('1990-05-15')
    });

    return [
      original,
      // Exact duplicate
      { ...original, patient_id: 'test-pat-dup-1' },
      // Typo in first name
      { ...original, patient_id: 'test-pat-dup-2', first_name: 'Jon' },
      // Typo in last name
      { ...original, patient_id: 'test-pat-dup-3', last_name: 'Mwanga' },
      // Different phone
      { ...original, patient_id: 'test-pat-dup-4', phone_number: '+255712999999' }
    ];
  }

  /**
   * HELPER FUNCTIONS
   */
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private weightedRandomChoice(options: Array<{ weight: number; [key: string]: any }>): any {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const option of options) {
      random -= option.weight;
      if (random <= 0) return option;
    }
    
    return options[0];
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFloat(min: number, max: number, decimals: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  private randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  private generateAllergies(): string[] {
    const allergies = ['Penicillin', 'Sulfa drugs', 'NSAIDs', 'Codeine', 'Aspirin'];
    if (Math.random() > 0.7) {
      const count = this.randomNumber(1, 2);
      return Array.from({ length: count }, () => this.randomChoice(allergies));
    }
    return [];
  }

  private generateChronicConditions(age: number): string[] {
    if (age < 40) return [];
    
    const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis'];
    if (Math.random() > 0.6) {
      const count = this.randomNumber(1, 2);
      return Array.from({ length: count }, () => this.randomChoice(conditions));
    }
    return [];
  }

  private generateChiefComplaint(): string {
    const complaints = [
      'Fever for 3 days',
      'Headache and dizziness',
      'Cough and chest pain',
      'Abdominal pain',
      'Diarrhea and vomiting',
      'Body weakness',
      'Joint pain',
      'Difficulty breathing'
    ];
    return this.randomChoice(complaints);
  }

  private generateDiagnosis(): any {
    const diagnoses = [
      { name: 'Malaria', code: 'B50.9' },
      { name: 'Upper Respiratory Tract Infection', code: 'J06.9' },
      { name: 'Gastroenteritis', code: 'A09' },
      { name: 'Hypertension', code: 'I10' },
      { name: 'Diabetes Mellitus Type 2', code: 'E11' },
      { name: 'Pneumonia', code: 'J18.9' }
    ];
    
    const diagnosis = this.randomChoice(diagnoses);
    return {
      name: diagnosis.name,
      code: diagnosis.code,
      confidence: this.randomChoice(['confirmed', 'provisional', 'suspected'])
    };
  }
}

/**
 * EXPORT CONVENIENCE FUNCTIONS
 */
export function generateTestPatient(overrides?: any) {
  const generator = new TestDataGenerator();
  return generator.generatePatient(overrides);
}

export function generateTestPatients(count: number) {
  const generator = new TestDataGenerator();
  return generator.generatePatients(count);
}

export function generateTestEncounter(patientId: string) {
  const generator = new TestDataGenerator();
  return generator.generateEncounter(patientId);
}

export function generateHospitalDay(facilityId: string, patientCount: number) {
  const generator = new TestDataGenerator();
  return generator.generateHospitalDay(facilityId, patientCount);
}

/**
 * CLI USAGE
 */
if (require.main === module) {
  const generator = new TestDataGenerator();
  
  console.log('\n🏥 AFYACARE TEST DATA GENERATOR\n');
  
  const command = process.argv[2];
  const count = parseInt(process.argv[3] || '10', 10);
  
  switch (command) {
    case 'patients':
      const patients = generator.generatePatients(count);
      console.log(JSON.stringify(patients, null, 2));
      break;
    
    case 'hospital-day':
      const hospitalDay = generator.generateHospitalDay('fac-001', count);
      console.log(JSON.stringify(hospitalDay, null, 2));
      break;
    
    case 'edge-cases':
      const edgeCases = generator.generateEdgeCases();
      console.log(JSON.stringify(edgeCases, null, 2));
      break;
    
    case 'stress-test':
      const stressData = generator.generateStressTestData(1000, 5);
      console.log(`Generated ${stressData.totalRecords} records (~${stressData.estimatedSizeKB}KB)`);
      break;
    
    default:
      console.log('Usage: node TestDataGenerator.ts <command> [count]');
      console.log('\nCommands:');
      console.log('  patients <count>       - Generate N patients');
      console.log('  hospital-day <count>   - Generate full day with N patients');
      console.log('  edge-cases             - Generate edge case test data');
      console.log('  stress-test            - Generate large dataset');
  }
}
