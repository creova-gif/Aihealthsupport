/**
 * AfyaAI TZA - Federated Health Record System
 * 
 * CORE PRINCIPLE:
 * Records stay at facilities, summaries follow patients
 * 
 * Key Features:
 * - AfyaID patient identification
 * - Federated record sharing with consent
 * - Pregnancy monitoring
 * - Medication adherence tracking
 * - Facility discovery
 * - Diagnostic ingestion
 */

const crypto = require('crypto');
const { DateTime } = require('luxon');

// ==========================================
// 1. PATIENT ID SYSTEM (AfyaID)
// ==========================================

class AfyaIDSystem {
  /**
   * Generate AfyaID from phone number
   * Format: AFYA-TZA-XXXX-XXXX
   */
  static generateAfyaID(phoneNumber) {
    const salt = process.env.AFYA_ID_SALT || 'default-salt-change-in-prod';
    const hash = crypto
      .createHash('sha256')
      .update(phoneNumber + salt)
      .digest('hex');
    
    const segment1 = hash.substring(0, 4).toUpperCase();
    const segment2 = hash.substring(4, 8).toUpperCase();
    
    return `AFYA-TZA-${segment1}-${segment2}`;
  }

  /**
   * Lookup patient by phone, AfyaID, or NIDA
   */
  static async lookupPatient(identifier) {
    // Try phone number first
    if (identifier.startsWith('+255') || identifier.startsWith('0')) {
      const normalized = this.normalizePhone(identifier);
      const afyaID = this.generateAfyaID(normalized);
      return await db.patients.findOne({ afya_id: afyaID });
    }
    
    // Try AfyaID
    if (identifier.startsWith('AFYA-TZA-')) {
      return await db.patients.findOne({ afya_id: identifier });
    }
    
    // Try NIDA (future)
    if (identifier.match(/^\d{20}$/)) {
      return await db.patients.findOne({ nida: identifier });
    }
    
    throw new Error('Invalid identifier format');
  }

  static normalizePhone(phone) {
    // Convert 0712345678 → +255712345678
    if (phone.startsWith('0')) {
      return '+255' + phone.substring(1);
    }
    return phone;
  }
}

// ==========================================
// 2. FEDERATED RECORD SYSTEM
// ==========================================

class FederatedRecordSystem {
  /**
   * Create portable patient summary
   * (What travels with the patient)
   */
  static async createPortableSummary(afyaID) {
    const patient = await db.patients.findOne({ afya_id: afyaID });
    const recentVisits = await db.visits.find({ 
      patient_id: afyaID 
    }).sort({ date: -1 }).limit(3);
    
    const activeMedications = await db.medications.find({
      patient_id: afyaID,
      active: true
    });
    
    const diagnosticPointers = await db.diagnostics.find({
      patient_id: afyaID
    }).sort({ date: -1 }).limit(5);
    
    return {
      afya_id: afyaID,
      basic_info: {
        name: patient.name,
        age: this.calculateAge(patient.date_of_birth),
        gender: patient.gender,
        phone: patient.phone
      },
      red_flags: {
        pregnant: patient.pregnancy?.active || false,
        gestational_age: patient.pregnancy?.gestational_age || null,
        chronic_conditions: patient.chronic_conditions || [],
        allergies: patient.allergies || [],
        critical_notes: patient.critical_notes || null
      },
      current_medications: activeMedications.map(med => ({
        drug: med.drug_name,
        dosage: med.dosage,
        frequency: med.frequency,
        started: med.start_date
      })),
      recent_visits: recentVisits.map(visit => ({
        date: visit.date,
        facility: visit.facility_name,
        facility_hfr_id: visit.facility_hfr_id,
        type: visit.visit_type,
        summary: visit.summary
      })),
      diagnostic_pointers: diagnosticPointers.map(diag => ({
        date: diag.date,
        type: diag.type,
        facility: diag.facility_hfr_id,
        summary: diag.summary,
        full_record_available: true
      })),
      last_updated: new Date()
    };
  }

  /**
   * Request full records from another facility
   * (Requires patient consent)
   */
  static async requestCrossFacilityRecords(params) {
    const { afyaID, requestingFacility, sourceFacility } = params;
    
    // 1. Verify requesting facility is authorized
    const authorized = await this.verifyFacility(requestingFacility);
    if (!authorized) {
      throw new Error('Unauthorized facility');
    }
    
    // 2. Check if consent already exists
    const existingConsent = await db.consents.findOne({
      patient: afyaID,
      facility: requestingFacility,
      expires_at: { $gt: new Date() }
    });
    
    if (existingConsent) {
      // Consent already granted, fetch records
      return await this.fetchFullRecords(sourceFacility, afyaID);
    }
    
    // 3. Request new consent from patient
    const patient = await db.patients.findOne({ afya_id: afyaID });
    const consentRequest = await this.sendConsentSMS(patient.phone, {
      requesting: requestingFacility.name,
      source: sourceFacility.name,
      afya_id: afyaID
    });
    
    // 4. Wait for consent (async, will be handled by SMS webhook)
    return {
      status: 'pending_consent',
      consent_request_id: consentRequest.id,
      message: 'Patient consent requested via SMS'
    };
  }

  /**
   * Send SMS requesting patient consent
   */
  static async sendConsentSMS(phone, details) {
    const message = `${details.requesting} inauomba rekodi zako kutoka ${details.source}. ` +
                    `Kubali? Reply: YES ${details.afya_id.slice(-4)}`;
    
    const smsID = await smsService.send(phone, message);
    
    return await db.consent_requests.create({
      id: generateID(),
      patient_afya_id: details.afya_id,
      requesting_facility: details.requesting,
      source_facility: details.source,
      sms_id: smsID,
      status: 'pending',
      created_at: new Date(),
      expires_at: DateTime.now().plus({ hours: 24 }).toJSDate()
    });
  }

  /**
   * Handle consent response from SMS
   */
  static async handleConsentResponse(phone, message) {
    // Extract AfyaID from response: "YES 8F91"
    const match = message.match(/YES (\w{4})/i);
    if (!match) return { error: 'Invalid response format' };
    
    const idSuffix = match[1].toUpperCase();
    const patient = await db.patients.findOne({ 
      phone: phone,
      afya_id: { $regex: idSuffix + '$' }
    });
    
    if (!patient) {
      return { error: 'Patient not found' };
    }
    
    // Find pending consent request
    const request = await db.consent_requests.findOne({
      patient_afya_id: patient.afya_id,
      status: 'pending',
      expires_at: { $gt: new Date() }
    });
    
    if (!request) {
      return { error: 'No pending consent request' };
    }
    
    // Grant consent
    await db.consents.create({
      patient: patient.afya_id,
      facility: request.requesting_facility,
      granted_at: new Date(),
      expires_at: DateTime.now().plus({ days: 90 }).toJSDate(),
      scope: 'full_records',
      consent_method: 'sms'
    });
    
    // Update request status
    await db.consent_requests.update(request.id, { 
      status: 'approved',
      approved_at: new Date()
    });
    
    // Log audit trail
    await this.logAccess({
      action: 'consent_granted',
      patient: patient.afya_id,
      facility: request.requesting_facility,
      method: 'sms'
    });
    
    // Send confirmation SMS
    await smsService.send(phone, 
      `Asante. Rekodi zako zimeshirikiwa na ${request.requesting_facility}.`
    );
    
    return { success: true, consent_granted: true };
  }

  /**
   * Fetch full records from source facility
   */
  static async fetchFullRecords(facilityHFR, afyaID) {
    // This would call the facility's API or database
    // For now, simplified local fetch
    const fullRecords = await db.patient_full_records.findOne({
      patient_id: afyaID,
      facility_hfr_id: facilityHFR
    });
    
    return fullRecords;
  }

  static calculateAge(dob) {
    return DateTime.now().diff(DateTime.fromISO(dob), 'years').years;
  }

  static async verifyFacility(facilityID) {
    const facility = await db.facilities.findOne({ hfr_id: facilityID });
    return facility && facility.authorized === true;
  }
}

// ==========================================
// 3. PREGNANCY MONITORING SYSTEM
// ==========================================

class PregnancyMonitoringSystem {
  /**
   * Activate pregnancy tracking
   */
  static async activatePregnancy(afyaID, lmp) {
    const edd = DateTime.fromISO(lmp).plus({ days: 280 }).toISODate();
    const gestationalAge = this.calculateGestationalAge(lmp);
    
    await db.patients.update({ afya_id: afyaID }, {
      $set: {
        'pregnancy.active': true,
        'pregnancy.lmp': lmp,
        'pregnancy.edd': edd,
        'pregnancy.gestational_age': gestationalAge,
        'pregnancy.risk_level': 'normal', // Will be assessed
        'pregnancy.anc_schedule': this.generateANCSchedule(lmp),
        'pregnancy.missed_visits': 0
      }
    });
    
    // Assign CHW
    const nearestCHW = await this.findNearestCHW(afyaID);
    if (nearestCHW) {
      await db.patients.update({ afya_id: afyaID }, {
        $set: { 'pregnancy.assigned_chw': nearestCHW.id }
      });
    }
    
    return { success: true, edd, gestational_age: gestationalAge };
  }

  /**
   * Generate ANC visit schedule (WHO guidelines)
   */
  static generateANCSchedule(lmp) {
    const lmpDate = DateTime.fromISO(lmp);
    return [
      { visit: 1, week: 12, date: lmpDate.plus({ weeks: 12 }).toISODate(), status: 'upcoming' },
      { visit: 2, week: 20, date: lmpDate.plus({ weeks: 20 }).toISODate(), status: 'upcoming' },
      { visit: 3, week: 26, date: lmpDate.plus({ weeks: 26 }).toISODate(), status: 'upcoming' },
      { visit: 4, week: 30, date: lmpDate.plus({ weeks: 30 }).toISODate(), status: 'upcoming' },
      { visit: 5, week: 34, date: lmpDate.plus({ weeks: 34 }).toISODate(), status: 'upcoming' },
      { visit: 6, week: 36, date: lmpDate.plus({ weeks: 36 }).toISODate(), status: 'upcoming' },
      { visit: 7, week: 38, date: lmpDate.plus({ weeks: 38 }).toISODate(), status: 'upcoming' },
      { visit: 8, week: 40, date: lmpDate.plus({ weeks: 40 }).toISODate(), status: 'upcoming' }
    ];
  }

  /**
   * Check for missed ANC visits (run daily via cron)
   */
  static async checkMissedANCVisits() {
    const pregnantPatients = await db.patients.find({ 
      'pregnancy.active': true 
    });
    
    for (const patient of pregnantPatients) {
      const schedule = patient.pregnancy.anc_schedule;
      const nextVisit = schedule.find(v => v.status === 'upcoming');
      
      if (!nextVisit) continue;
      
      const visitDate = DateTime.fromISO(nextVisit.date);
      const daysPastDue = DateTime.now().diff(visitDate, 'days').days;
      
      if (daysPastDue >= 3) {
        // Missed visit detected
        await this.handleMissedANCVisit(patient, nextVisit);
      }
    }
  }

  /**
   * Handle missed ANC visit
   */
  static async handleMissedANCVisit(patient, missedVisit) {
    // 1. Alert patient
    await smsService.send(patient.phone,
      `Dada ${patient.name}, umekosa miadi ya ANC ya wiki ${missedVisit.week}. ` +
      `Tafadhali tembelea kituo cha afya mara moja.`
    );
    
    // 2. Alert CHW
    if (patient.pregnancy.assigned_chw) {
      await db.chw_alerts.create({
        chw_id: patient.pregnancy.assigned_chw,
        patient_afya_id: patient.afya_id,
        patient_name: patient.name,
        alert_type: 'missed_anc_visit',
        priority: 'high',
        details: `Missed ANC visit ${missedVisit.visit} (week ${missedVisit.week})`,
        created_at: new Date()
      });
    }
    
    // 3. Alert facility
    const lastFacility = patient.last_visited_facility;
    if (lastFacility) {
      await db.facility_alerts.create({
        facility_hfr_id: lastFacility,
        patient_afya_id: patient.afya_id,
        alert_type: 'missed_anc_visit',
        priority: 'medium',
        created_at: new Date()
      });
    }
    
    // 4. Increment missed visit counter
    await db.patients.update({ afya_id: patient.afya_id }, {
      $inc: { 'pregnancy.missed_visits': 1 }
    });
  }

  /**
   * Check for pregnancy danger signs
   */
  static async checkDangerSigns(afyaID, symptoms) {
    const dangerSigns = [
      'vaginal_bleeding',
      'severe_headache',
      'blurred_vision',
      'severe_abdominal_pain',
      'fever',
      'reduced_fetal_movement',
      'fluid_leakage',
      'seizures',
      'severe_swelling'
    ];
    
    const hasDangerSign = symptoms.some(s => dangerSigns.includes(s));
    
    if (hasDangerSign) {
      const patient = await db.patients.findOne({ afya_id: afyaID });
      await this.triggerEmergencyProtocol(patient, symptoms);
    }
    
    return { danger_detected: hasDangerSign };
  }

  /**
   * Trigger emergency protocol for pregnancy danger
   */
  static async triggerEmergencyProtocol(patient, symptoms) {
    // 1. Find nearest hospital with maternity services
    const nearestHospital = await FacilityDiscovery.findNearest(
      patient.last_known_location,
      { service: 'maternity', type: 'hospital' }
    );
    
    // 2. Alert patient
    await smsService.send(patient.phone,
      `DHARURA: Tafadhali nenda hospitali mara moja. ` +
      `Karibu: ${nearestHospital.name} (${nearestHospital.phone}). ` +
      `Au piga 112.`
    );
    
    // 3. Alert CHW immediately
    if (patient.pregnancy.assigned_chw) {
      await smsService.send(
        await this.getCHWPhone(patient.pregnancy.assigned_chw),
        `DHARURA: ${patient.name} (${patient.afya_id}) ana dalili za hatari za ujauzito. ` +
        `Mtembelee au piga ${patient.phone}.`
      );
    }
    
    // 4. Alert nearest hospital
    await db.emergency_alerts.create({
      patient_afya_id: patient.afya_id,
      alert_type: 'pregnancy_emergency',
      symptoms: symptoms,
      nearest_facility: nearestHospital.hfr_id,
      status: 'active',
      created_at: new Date()
    });
    
    // 5. Log incident
    await db.audit_logs.create({
      action: 'emergency_protocol_triggered',
      patient: patient.afya_id,
      reason: 'pregnancy_danger_signs',
      symptoms: symptoms,
      timestamp: new Date()
    });
  }

  static calculateGestationalAge(lmp) {
    return Math.floor(DateTime.now().diff(DateTime.fromISO(lmp), 'weeks').weeks);
  }

  static async findNearestCHW(afyaID) {
    const patient = await db.patients.findOne({ afya_id: afyaID });
    return await db.chws.findOne({
      coverage_area: patient.ward,
      active: true
    });
  }

  static async getCHWPhone(chwID) {
    const chw = await db.chws.findOne({ id: chwID });
    return chw.phone;
  }
}

// ==========================================
// 4. MEDICATION ADHERENCE SYSTEM
// ==========================================

class MedicationAdherenceSystem {
  /**
   * Log medication taken
   */
  static async logAdherence(afyaID, medicationID, params) {
    const { timestamp, reporter, method } = params;
    
    await db.adherence_logs.create({
      patient_afya_id: afyaID,
      medication_id: medicationID,
      timestamp: timestamp || new Date(),
      taken: true,
      reporter_type: reporter.type, // 'patient', 'caregiver', 'chw'
      reporter_id: reporter.id,
      method: method, // 'app', 'sms', 'ussd', 'chw_visit'
      created_at: new Date()
    });
    
    // Check if this completes a daily dose
    await this.checkDailyCompletion(afyaID, medicationID);
    
    return { success: true };
  }

  /**
   * Handle USSD adherence check-in
   */
  static async handleUSSDAdherence(sessionID, input) {
    // Session state managed in memory/cache
    const session = await cache.get(`ussd_session:${sessionID}`);
    
    if (!session) {
      // Start new session
      return {
        response: 'CON Dawa ya nani?\nIngiza namba ya simu:',
        state: 'awaiting_phone'
      };
    }
    
    if (session.state === 'awaiting_phone') {
      const phone = input;
      const afyaID = AfyaIDSystem.generateAfyaID(phone);
      const patient = await db.patients.findOne({ afya_id: afyaID });
      
      if (!patient) {
        return { response: 'END Mgonjwa hajapatikana.' };
      }
      
      await cache.set(`ussd_session:${sessionID}`, {
        state: 'awaiting_adherence',
        afya_id: afyaID,
        patient_name: patient.name
      });
      
      return {
        response: `CON Dawa ya ${patient.name} leo?\n` +
                  `1. Ametumia\n` +
                  `2. Hajaanza\n` +
                  `3. Sijui`,
        state: 'awaiting_adherence'
      };
    }
    
    if (session.state === 'awaiting_adherence') {
      const taken = input === '1';
      
      if (taken) {
        // Get active medication
        const medication = await db.medications.findOne({
          patient_id: session.afya_id,
          active: true
        });
        
        await this.logAdherence(session.afya_id, medication.id, {
          reporter: { type: 'proxy', id: 'ussd_reporter' },
          method: 'ussd'
        });
        
        return { response: 'END Asante. Umerekodiwa.' };
      } else if (input === '2') {
        // Not taken - send reminder
        const patient = await db.patients.findOne({ afya_id: session.afya_id });
        await smsService.send(patient.phone,
          `Kumbusho: Wakati wa kumeza dawa yako.`
        );
        return { response: 'END Tutamkumbushia.' };
      } else {
        return { response: 'END Asante kwa kutujulisha.' };
      }
    }
  }

  /**
   * Send daily medication reminder
   */
  static async sendDailyReminders() {
    const activeMedications = await db.medications.find({ active: true });
    
    for (const med of activeMedications) {
      const patient = await db.patients.findOne({ afya_id: med.patient_id });
      const schedule = this.parseSchedule(med.frequency);
      
      for (const doseTime of schedule) {
        const now = DateTime.now();
        const reminderTime = DateTime.fromFormat(doseTime, 'HH:mm');
        
        if (Math.abs(now.diff(reminderTime, 'minutes').minutes) < 5) {
          // Time to send reminder
          await smsService.send(patient.phone,
            `Kumbusho: Wakati wa kumeza dawa yako (${med.drug_name}). ` +
            `Baada ya kutumia, reply YES.`
          );
          
          // Also notify caregivers
          if (patient.caregivers && patient.caregivers.length > 0) {
            for (const caregiver of patient.caregivers) {
              await smsService.send(caregiver.phone,
                `Kumbusho: ${patient.name} anahitaji kumeza dawa (${med.drug_name}).`
              );
            }
          }
        }
      }
    }
  }

  /**
   * Check for consecutive missed doses
   */
  static async checkMissedDoses() {
    const activeMedications = await db.medications.find({ active: true });
    
    for (const med of activeMedications) {
      const recentLogs = await db.adherence_logs.find({
        patient_afya_id: med.patient_id,
        medication_id: med.id
      }).sort({ timestamp: -1 }).limit(7);
      
      const missedConsecutive = recentLogs.filter(log => !log.taken).length;
      
      if (missedConsecutive >= 3) {
        await this.alertNonAdherence(med.patient_id, med, missedConsecutive);
      }
    }
  }

  /**
   * Alert clinician and CHW of non-adherence
   */
  static async alertNonAdherence(afyaID, medication, missedCount) {
    const patient = await db.patients.findOne({ afya_id: afyaID });
    
    // Alert CHW
    if (patient.assigned_chw) {
      await db.chw_alerts.create({
        chw_id: patient.assigned_chw,
        patient_afya_id: afyaID,
        patient_name: patient.name,
        alert_type: 'medication_non_adherence',
        priority: 'high',
        details: `Missed ${missedCount} consecutive doses of ${medication.drug_name}`,
        created_at: new Date()
      });
    }
    
    // Alert primary provider
    if (patient.primary_provider) {
      await db.clinician_alerts.create({
        clinician_id: patient.primary_provider,
        patient_afya_id: afyaID,
        alert_type: 'medication_non_adherence',
        details: `Patient has missed ${missedCount} doses`,
        created_at: new Date()
      });
    }
  }

  static parseSchedule(frequency) {
    // "2x daily" → ['08:00', '20:00']
    // "3x daily" → ['08:00', '14:00', '20:00']
    const match = frequency.match(/(\d+)x daily/i);
    if (!match) return ['08:00'];
    
    const times = parseInt(match[1]);
    if (times === 2) return ['08:00', '20:00'];
    if (times === 3) return ['08:00', '14:00', '20:00'];
    return ['08:00'];
  }

  static async checkDailyCompletion(afyaID, medicationID) {
    // Check if all daily doses logged
    const med = await db.medications.findOne({ id: medicationID });
    const schedule = this.parseSchedule(med.frequency);
    const todayLogs = await db.adherence_logs.find({
      patient_afya_id: afyaID,
      medication_id: medicationID,
      timestamp: { $gte: DateTime.now().startOf('day').toJSDate() }
    });
    
    if (todayLogs.length >= schedule.length) {
      // Daily goal completed
      await db.adherence_streaks.increment(afyaID, medicationID);
    }
  }
}

// ==========================================
// 5. FACILITY DISCOVERY SYSTEM
// ==========================================

class FacilityDiscovery {
  /**
   * Find nearest facilities
   */
  static async findNearest(userLocation, filters = {}) {
    const allFacilities = await db.facilities.find();
    
    const nearby = allFacilities
      .map(facility => ({
        ...facility,
        distance: this.calculateDistance(
          userLocation,
          [facility.latitude, facility.longitude]
        )
      }))
      .filter(f => {
        if (filters.type && f.type !== filters.type) return false;
        if (filters.service && !f.services.includes(filters.service)) return false;
        if (filters.nhif && !f.nhif_accepted) return false;
        if (filters.max_distance && f.distance > filters.max_distance) return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, filters.limit || 10);
    
    return nearby;
  }

  /**
   * Calculate distance using Haversine formula
   */
  static calculateDistance(point1, point2) {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get facility details
   */
  static async getFacilityInfo(hfrID) {
    return await db.facilities.findOne({ hfr_id: hfrID });
  }

  /**
   * Initiate referral to facility
   */
  static async initiateReferral(afyaID, targetFacilityHFR, reason) {
    const patient = await db.patients.findOne({ afya_id: afyaID });
    const facility = await this.getFacilityInfo(targetFacilityHFR);
    
    // Create referral record
    const referral = await db.referrals.create({
      id: generateID(),
      patient_afya_id: afyaID,
      patient_name: patient.name,
      from_facility: patient.last_visited_facility,
      to_facility: targetFacilityHFR,
      reason: reason,
      status: 'pending',
      created_at: new Date()
    });
    
    // Notify target facility
    await db.facility_notifications.create({
      facility_hfr_id: targetFacilityHFR,
      type: 'incoming_referral',
      patient_afya_id: afyaID,
      referral_id: referral.id,
      priority: 'normal',
      created_at: new Date()
    });
    
    // Send SMS to patient
    await smsService.send(patient.phone,
      `Umepokea rejea kwenda ${facility.name}. ` +
      `Simu: ${facility.phone}. Rejea #: ${referral.id}`
    );
    
    return referral;
  }
}

// ==========================================
// 6. DIAGNOSTIC INGESTION SYSTEM
// ==========================================

class DiagnosticIngestionSystem {
  /**
   * Tier 1: Manual upload (PDF/Image)
   */
  static async uploadDiagnostic(file, metadata) {
    const { afya_id, diagnostic_type, facility_hfr_id, summary, date } = metadata;
    
    // Encrypt and upload file
    const encrypted = await encryptFile(file);
    const fileID = await storage.upload(encrypted, {
      bucket: 'diagnostics',
      encryption: 'AES-256',
      metadata: {
        patient_id: afya_id,
        type: diagnostic_type,
        facility: facility_hfr_id
      }
    });
    
    // Create diagnostic record
    const diagnostic = await db.diagnostics.create({
      id: generateID(),
      patient_afya_id: afya_id,
      file_id: fileID,
      type: diagnostic_type,
      facility_hfr_id: facility_hfr_id,
      summary: summary,
      date: date || new Date(),
      upload_method: 'manual',
      reviewed: false,
      created_at: new Date()
    });
    
    // Attach to patient timeline
    await db.patient_timeline.create({
      patient_afya_id: afya_id,
      event_type: 'diagnostic',
      event_id: diagnostic.id,
      summary: `${diagnostic_type}: ${summary}`,
      facility: facility_hfr_id,
      timestamp: new Date()
    });
    
    return { success: true, diagnostic_id: diagnostic.id };
  }

  /**
   * Tier 2: Device export (DICOM/HL7)
   */
  static async ingestDICOM(dicomFile, facilityHFR) {
    // Parse DICOM metadata
    const metadata = await parseDICOM(dicomFile);
    
    // Try to match patient
    const patient = await db.patients.findOne({
      name: { $regex: metadata.patientName, $options: 'i' },
      date_of_birth: metadata.patientDOB
    });
    
    if (!patient) {
      // Queue for manual matching
      await db.unmatched_diagnostics.create({
        file: dicomFile,
        metadata: metadata,
        facility: facilityHFR,
        status: 'pending_match',
        created_at: new Date()
      });
      return { success: false, reason: 'patient_not_found', queued: true };
    }
    
    // Patient found, upload diagnostic
    return await this.uploadDiagnostic(dicomFile, {
      afya_id: patient.afya_id,
      diagnostic_type: metadata.modality,
      facility_hfr_id: facilityHFR,
      summary: `${metadata.modality} - ${metadata.bodyPart}`,
      date: metadata.studyDate
    });
  }

  /**
   * Tier 3: AI-assisted summary (staff only)
   */
  static async generateAISummary(diagnosticID, clinicianID) {
    const diagnostic = await db.diagnostics.findOne({ id: diagnosticID });
    const file = await storage.fetch(diagnostic.file_id);
    
    // Run AI model (TFLite for imaging)
    const aiAnalysis = await runImagingAI(file, diagnostic.type);
    
    // Store AI suggestion (not final report)
    await db.ai_analyses.create({
      diagnostic_id: diagnosticID,
      model_version: aiAnalysis.model_version,
      confidence: aiAnalysis.confidence,
      suggested_findings: aiAnalysis.findings,
      heatmap_url: aiAnalysis.heatmap_url,
      disclaimer: 'AI-assisted. Clinician review required.',
      generated_at: new Date(),
      reviewed_by: null
    });
    
    return {
      diagnostic_id: diagnosticID,
      ai_confidence: aiAnalysis.confidence,
      suggested_findings: aiAnalysis.findings,
      heatmap_url: aiAnalysis.heatmap_url,
      status: 'pending_clinician_review'
    };
  }

  /**
   * Clinician confirms/overrides AI findings
   */
  static async confirmDiagnostic(diagnosticID, clinicianID, confirmedFindings) {
    const aiAnalysis = await db.ai_analyses.findOne({ diagnostic_id: diagnosticID });
    
    // Update with clinician confirmation
    await db.ai_analyses.update(aiAnalysis.id, {
      reviewed_by: clinicianID,
      reviewed_at: new Date(),
      clinician_findings: confirmedFindings,
      ai_agreed: confirmedFindings === aiAnalysis.suggested_findings
    });
    
    // Mark diagnostic as reviewed
    await db.diagnostics.update(diagnosticID, {
      reviewed: true,
      reviewed_by: clinicianID,
      final_findings: confirmedFindings,
      reviewed_at: new Date()
    });
    
    // Log audit
    await db.audit_logs.create({
      action: 'diagnostic_reviewed',
      clinician_id: clinicianID,
      diagnostic_id: diagnosticID,
      ai_used: true,
      timestamp: new Date()
    });
    
    return { success: true };
  }
}

// ==========================================
// 7. AUDIT & SECURITY SYSTEM
// ==========================================

class AuditSystem {
  /**
   * Log every record access
   */
  static async logAccess(params) {
    const { action, actor, subject, result, ip, device } = params;
    
    await db.audit_logs.create({
      id: generateID(),
      timestamp: new Date(),
      action: action,
      actor: {
        id: actor.id,
        name: actor.name,
        role: actor.role,
        facility: actor.facility
      },
      subject: {
        afya_id: subject.afya_id,
        consent_id: subject.consent_id
      },
      result: result || 'success',
      ip_address: ip,
      device: device,
      created_at: new Date()
    });
  }

  /**
   * Check if access is allowed
   */
  static async checkAccess(actorID, subjectAfyaID, action) {
    // 1. Check role permissions
    const actor = await db.users.findOne({ id: actorID });
    const permissions = rolePermissions[actor.role];
    
    if (!permissions.includes(action)) {
      await this.logAccess({
        action: action,
        actor: actor,
        subject: { afya_id: subjectAfyaID },
        result: 'denied_insufficient_permissions'
      });
      return false;
    }
    
    // 2. Check consent (for cross-facility access)
    if (action === 'view_full_records' && actor.facility !== subject.last_facility) {
      const consent = await db.consents.findOne({
        patient: subjectAfyaID,
        facility: actor.facility,
        expires_at: { $gt: new Date() }
      });
      
      if (!consent) {
        await this.logAccess({
          action: action,
          actor: actor,
          subject: { afya_id: subjectAfyaID },
          result: 'denied_no_consent'
        });
        return false;
      }
    }
    
    // 3. Log successful access
    await this.logAccess({
      action: action,
      actor: actor,
      subject: { afya_id: subjectAfyaID },
      result: 'allowed'
    });
    
    return true;
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateID() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

async function encryptFile(file) {
  // Implement AES-256 encryption
  const algorithm = 'aes-256-cbc';
  const key = process.env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(file);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
}

async function runImagingAI(file, type) {
  // Placeholder for TFLite inference
  // In production, this would run CheXNet or similar
  return {
    model_version: 'v1.0',
    confidence: 0.85,
    findings: ['Possible TB patterns detected'],
    heatmap_url: 'https://storage/heatmaps/123.png'
  };
}

async function parseDICOM(file) {
  // Placeholder for DICOM parsing
  // In production, use dcmjs or similar
  return {
    patientName: 'Maria Kamau',
    patientDOB: '1995-03-15',
    modality: 'CR',
    bodyPart: 'CHEST',
    studyDate: '2026-02-06'
  };
}

const rolePermissions = {
  patient: ['view_own_summary', 'manage_consent'],
  chw: ['view_assigned_patients', 'log_visits', 'create_referrals'],
  clinician: ['view_patient_records', 'edit_clinical_notes', 'request_records'],
  facility_admin: ['view_facility_patients', 'manage_staff_access'],
  moh: ['view_anonymized_analytics', 'audit_logs']
};

// Mock database and services
const db = {
  patients: { find: async () => [], findOne: async () => null, update: async () => {} },
  visits: { find: async () => [], create: async () => {} },
  medications: { find: async () => [], findOne: async () => null },
  diagnostics: { find: async () => [], findOne: async () => null, create: async () => {}, update: async () => {} },
  consents: { findOne: async () => null, create: async () => {} },
  consent_requests: { findOne: async () => null, create: async () => {}, update: async () => {} },
  facilities: { find: async () => [], findOne: async () => null },
  chws: { findOne: async () => null },
  chw_alerts: { create: async () => {} },
  facility_alerts: { create: async () => {} },
  adherence_logs: { find: async () => [], create: async () => {} },
  audit_logs: { create: async () => {} },
  referrals: { create: async () => {} },
  patient_timeline: { create: async () => {} },
  ai_analyses: { findOne: async () => null, create: async () => {}, update: async () => {} },
  emergency_alerts: { create: async () => {} },
  clinician_alerts: { create: async () => {} }
};

const smsService = {
  send: async (phone, message) => {
    console.log(`SMS to ${phone}: ${message}`);
    return 'SMS-' + generateID();
  }
};

const storage = {
  upload: async (file, options) => {
    return 'FILE-' + generateID();
  },
  fetch: async (fileID) => {
    return Buffer.from('mock-file-data');
  }
};

const cache = {
  get: async (key) => null,
  set: async (key, value) => {}
};

// Export all systems
module.exports = {
  AfyaIDSystem,
  FederatedRecordSystem,
  PregnancyMonitoringSystem,
  MedicationAdherenceSystem,
  FacilityDiscovery,
  DiagnosticIngestionSystem,
  AuditSystem
};
