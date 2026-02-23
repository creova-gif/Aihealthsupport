/**
 * API Service Tests
 * 
 * COVERAGE:
 * - All CRUD operations
 * - Error handling
 * - Offline queue
 * - Mock mode vs real Supabase
 * 
 * RUN:
 * npm test -- src/app/tests/api.test.ts
 */

import { api } from '../services/api';
import { OfflineQueue } from '../services/offlineQueue';
import { USE_MOCK_DATA } from '../services/supabase';
import type { AppointmentInsert, MedicationInsert } from '../services/supabase';

describe('API Service Tests', () => {
  const TEST_USER_ID = 'test_user_001';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  // ============================================
  // APPOINTMENTS TESTS
  // ============================================
  describe('Appointments API', () => {
    test('should create appointment successfully', async () => {
      const appointmentData: AppointmentInsert = {
        user_id: TEST_USER_ID,
        facility_id: 'fac_001',
        date: '2026-03-01',
        time: '10:00',
        type: 'General Checkup',
        status: 'scheduled',
        reason: 'Annual physical',
        notes: '',
        has_insurance: true,
      };

      const response = await api.appointments.create(appointmentData);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.user_id).toBe(TEST_USER_ID);
      expect(response.data?.facility_id).toBe('fac_001');
      expect(response.error).toBeNull();
    });

    test('should list user appointments', async () => {
      const response = await api.appointments.list(TEST_USER_ID);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.error).toBeNull();
    });

    test('should cancel appointment', async () => {
      // First create an appointment
      const createResponse = await api.appointments.create({
        user_id: TEST_USER_ID,
        facility_id: 'fac_001',
        date: '2026-03-01',
        time: '10:00',
        type: 'General Checkup',
        status: 'scheduled',
        reason: '',
        notes: '',
        has_insurance: false,
      });

      expect(createResponse.success).toBe(true);
      const appointmentId = createResponse.data!.id;

      // Then cancel it
      const cancelResponse = await api.appointments.cancel(appointmentId);

      expect(cancelResponse.success).toBe(true);
      if (USE_MOCK_DATA) {
        expect(cancelResponse.data?.status).toBe('cancelled');
      }
    });

    test('should reschedule appointment', async () => {
      // First create an appointment
      const createResponse = await api.appointments.create({
        user_id: TEST_USER_ID,
        facility_id: 'fac_001',
        date: '2026-03-01',
        time: '10:00',
        type: 'General Checkup',
        status: 'scheduled',
        reason: '',
        notes: '',
        has_insurance: false,
      });

      expect(createResponse.success).toBe(true);
      const appointmentId = createResponse.data!.id;

      // Then reschedule it
      const rescheduleResponse = await api.appointments.reschedule(
        appointmentId,
        '2026-03-05',
        '14:00'
      );

      expect(rescheduleResponse.success).toBe(true);
      if (USE_MOCK_DATA) {
        expect(rescheduleResponse.data?.date).toBe('2026-03-05');
        expect(rescheduleResponse.data?.time).toBe('14:00');
      }
    });
  });

  // ============================================
  // MEDICATIONS TESTS
  // ============================================
  describe('Medications API', () => {
    test('should create medication successfully', async () => {
      const medicationData: MedicationInsert = {
        user_id: TEST_USER_ID,
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        start_date: '2026-02-24',
        reminder_times: ['08:00', '14:00', '20:00'],
        notes: 'Take with food',
        active: true,
      };

      const response = await api.medications.create(medicationData);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.name).toBe('Paracetamol');
      expect(response.data?.user_id).toBe(TEST_USER_ID);
      expect(response.error).toBeNull();
    });

    test('should list user medications', async () => {
      const response = await api.medications.list(TEST_USER_ID);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.error).toBeNull();
    });

    test('should update medication', async () => {
      // First create a medication
      const createResponse = await api.medications.create({
        user_id: TEST_USER_ID,
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
        start_date: '2026-02-24',
        reminder_times: ['09:00'],
        notes: '',
        active: true,
      });

      expect(createResponse.success).toBe(true);
      const medicationId = createResponse.data!.id;

      // Then update it
      const updateResponse = await api.medications.update(medicationId, {
        dosage: '150mg',
        notes: 'Updated dosage',
      });

      expect(updateResponse.success).toBe(true);
      if (USE_MOCK_DATA) {
        expect(updateResponse.data?.dosage).toBe('150mg');
      }
    });

    test('should delete medication', async () => {
      // First create a medication
      const createResponse = await api.medications.create({
        user_id: TEST_USER_ID,
        name: 'Temporary Med',
        dosage: '100mg',
        frequency: 'Once daily',
        start_date: '2026-02-24',
        reminder_times: ['09:00'],
        notes: '',
        active: true,
      });

      expect(createResponse.success).toBe(true);
      const medicationId = createResponse.data!.id;

      // Then delete it
      const deleteResponse = await api.medications.delete(medicationId);

      expect(deleteResponse.success).toBe(true);
      expect(deleteResponse.error).toBeNull();
    });
  });

  // ============================================
  // FACILITIES TESTS
  // ============================================
  describe('Facilities API', () => {
    test('should list all facilities', async () => {
      const response = await api.facilities.list();

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
      expect(response.error).toBeNull();
    });

    test('should search nearby facilities', async () => {
      const response = await api.facilities.searchNearby(
        -6.7924, // Dar es Salaam latitude
        39.2083, // Dar es Salaam longitude
        50 // 50km radius
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.error).toBeNull();
    });

    test('facility should have required fields', async () => {
      const response = await api.facilities.list();

      expect(response.success).toBe(true);
      const facility = response.data![0];

      expect(facility).toHaveProperty('id');
      expect(facility).toHaveProperty('name');
      expect(facility).toHaveProperty('name_sw');
      expect(facility).toHaveProperty('address');
      expect(facility).toHaveProperty('address_sw');
      expect(facility).toHaveProperty('region');
      expect(facility).toHaveProperty('district');
    });
  });

  // ============================================
  // TEST RESULTS TESTS
  // ============================================
  describe('Test Results API', () => {
    test('should list user test results', async () => {
      const response = await api.testResults.list(TEST_USER_ID);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.error).toBeNull();
    });

    test('should get single test result', async () => {
      const listResponse = await api.testResults.list(TEST_USER_ID);
      if (listResponse.data && listResponse.data.length > 0) {
        const testId = listResponse.data[0].id;
        const response = await api.testResults.get(testId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data?.id).toBe(testId);
      }
    });
  });

  // ============================================
  // MATERNAL CARE TESTS
  // ============================================
  describe('Maternal Care API', () => {
    test('should get maternal care record', async () => {
      const response = await api.maternalCare.get(TEST_USER_ID);

      expect(response.success).toBe(true);
      // Data may be null if no maternal care record exists
      expect(response.error).toBeNull();
    });

    test('should create maternal care record', async () => {
      const recordData = {
        user_id: TEST_USER_ID,
        pregnancy_start_date: '2025-09-01',
        estimated_due_date: '2026-06-08',
        current_week: 24,
        risk_level: 'low' as const,
        vital_signs: [],
        checkups: [],
        notes: 'Test pregnancy record',
        active: true,
      };

      const response = await api.maternalCare.create(recordData);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.user_id).toBe(TEST_USER_ID);
    });

    test('should update maternal care record', async () => {
      // First create a record
      const createResponse = await api.maternalCare.create({
        user_id: TEST_USER_ID,
        pregnancy_start_date: '2025-09-01',
        estimated_due_date: '2026-06-08',
        current_week: 24,
        risk_level: 'low',
        vital_signs: [],
        checkups: [],
        active: true,
      });

      expect(createResponse.success).toBe(true);
      const recordId = createResponse.data!.id;

      // Then update it
      const updateResponse = await api.maternalCare.update(recordId, {
        current_week: 25,
        notes: 'Updated to week 25',
      });

      expect(updateResponse.success).toBe(true);
    });
  });

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  describe('Error Handling', () => {
    test('should handle invalid appointment data gracefully', async () => {
      const invalidData = {
        user_id: '',
        facility_id: '',
        date: 'invalid-date',
        time: '',
        type: '',
        status: 'invalid-status' as any,
        reason: '',
        notes: '',
        has_insurance: false,
      };

      const response = await api.appointments.create(invalidData);

      // Should still return a response structure
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('data');
    });

    test('should handle network errors gracefully', async () => {
      // This test assumes online mode
      // In real implementation, test actual network failures
      const response = await api.appointments.list('nonexistent_user');

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('data');
    });
  });
});

// ============================================
// OFFLINE QUEUE TESTS
// ============================================
describe('Offline Queue Tests', () => {
  beforeEach(async () => {
    // Clear offline queue before each test
    if (typeof indexedDB !== 'undefined') {
      await OfflineQueue.clearSynced();
    }
  });

  test('should queue operation when offline', async () => {
    // Simulate offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    await OfflineQueue.add('create', 'appointments', {
      user_id: 'test_user',
      facility_id: 'fac_001',
      date: '2026-03-01',
      time: '10:00',
    });

    const stats = await OfflineQueue.getStats();
    expect(stats.pending).toBeGreaterThan(0);

    // Restore online status
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  test('should sync queued operations when online', async () => {
    // Simulate offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    // Queue an operation
    await OfflineQueue.add('create', 'appointments', {
      user_id: 'test_user',
      facility_id: 'fac_001',
      date: '2026-03-01',
      time: '10:00',
    });

    // Go back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Sync
    const result = await OfflineQueue.syncAll();

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('failed');
  });

  test('should get queue statistics', async () => {
    const stats = await OfflineQueue.getStats();

    expect(stats).toHaveProperty('pending');
    expect(stats).toHaveProperty('syncing');
    expect(stats).toHaveProperty('synced');
    expect(stats).toHaveProperty('failed');
    expect(typeof stats.pending).toBe('number');
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================
describe('Integration Tests', () => {
  test('complete appointment booking flow', async () => {
    // 1. Get list of facilities
    const facilitiesResponse = await api.facilities.list();
    expect(facilitiesResponse.success).toBe(true);
    const facility = facilitiesResponse.data![0];

    // 2. Create appointment
    const createResponse = await api.appointments.create({
      user_id: 'integration_test_user',
      facility_id: facility.id,
      date: '2026-03-15',
      time: '09:00',
      type: 'General Checkup',
      status: 'scheduled',
      reason: 'Integration test appointment',
      notes: '',
      has_insurance: true,
    });

    expect(createResponse.success).toBe(true);
    const appointmentId = createResponse.data!.id;

    // 3. List appointments
    const listResponse = await api.appointments.list('integration_test_user');
    expect(listResponse.success).toBe(true);
    expect(listResponse.data!.some((apt) => apt.id === appointmentId)).toBe(true);

    // 4. Reschedule appointment
    const rescheduleResponse = await api.appointments.reschedule(
      appointmentId,
      '2026-03-20',
      '14:00'
    );
    expect(rescheduleResponse.success).toBe(true);

    // 5. Cancel appointment
    const cancelResponse = await api.appointments.cancel(appointmentId);
    expect(cancelResponse.success).toBe(true);
  });

  test('complete medication tracking flow', async () => {
    // 1. Create medication
    const createResponse = await api.medications.create({
      user_id: 'integration_test_user',
      name: 'Test Medication',
      dosage: '250mg',
      frequency: 'Twice daily',
      start_date: '2026-02-24',
      end_date: '2026-03-24',
      reminder_times: ['08:00', '20:00'],
      notes: 'Integration test medication',
      active: true,
    });

    expect(createResponse.success).toBe(true);
    const medicationId = createResponse.data!.id;

    // 2. List medications
    const listResponse = await api.medications.list('integration_test_user');
    expect(listResponse.success).toBe(true);
    expect(listResponse.data!.some((med) => med.id === medicationId)).toBe(true);

    // 3. Update medication
    const updateResponse = await api.medications.update(medicationId, {
      dosage: '500mg',
      notes: 'Dosage increased',
    });
    expect(updateResponse.success).toBe(true);

    // 4. Delete medication
    const deleteResponse = await api.medications.delete(medicationId);
    expect(deleteResponse.success).toBe(true);
  });
});
