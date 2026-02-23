/**
 * DATA INTEGRITY VALIDATOR
 * AfyaCare Tanzania
 * 
 * Nightly validation checks for:
 * - Orphan records
 * - Broken foreign keys
 * - Negative inventory
 * - Duplicate MPI records
 * - Mismatched reporting totals
 * - Checksum validation
 * - Audit trail integrity
 * 
 * Run: npm run validate:data-integrity
 * Schedule: Nightly at 2 AM EAT
 */

export class DataIntegrityValidator {
  private errors: any[] = [];
  private warnings: any[] = [];

  async runFullValidation() {
    console.log('\n🔍 AFYACARE DATA INTEGRITY VALIDATION\n');
    console.log(`Started: ${new Date().toISOString()}\n`);

    await this.validateOrphanRecords();
    await this.validateForeignKeys();
    await this.validateInventoryIntegrity();
    await this.validateMPIDuplicates();
    await this.validateReportingTotals();
    await this.validateChecksums();
    await this.validateAuditTrailIntegrity();
    await this.validateEncounterWorkflow();
    await this.validatePrescriptionDispenseIntegrity();
    await this.validateLabResultIntegrity();

    this.generateReport();
    
    return {
      passed: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * 1. ORPHAN RECORDS DETECTION
   */
  private async validateOrphanRecords() {
    console.log('📝 Checking for orphan records...');

    // Orphan encounters (patient deleted but encounter remains)
    const orphanEncounters = await this.query(`
      SELECT e.encounter_id, e.patient_id
      FROM encounters e
      LEFT JOIN patients p ON e.patient_id = p.patient_id
      WHERE p.patient_id IS NULL
    `);

    if (orphanEncounters.length > 0) {
      this.errors.push({
        category: 'orphan_records',
        type: 'orphan_encounters',
        count: orphanEncounters.length,
        message: `Found ${orphanEncounters.length} orphan encounters`,
        records: orphanEncounters
      });
    }

    // Orphan lab results
    const orphanLabResults = await this.query(`
      SELECT lr.result_id, lr.order_id
      FROM lab_results lr
      LEFT JOIN lab_orders lo ON lr.order_id = lo.order_id
      WHERE lo.order_id IS NULL
    `);

    if (orphanLabResults.length > 0) {
      this.errors.push({
        category: 'orphan_records',
        type: 'orphan_lab_results',
        count: orphanLabResults.length,
        message: `Found ${orphanLabResults.length} orphan lab results`,
        records: orphanLabResults
      });
    }

    // Orphan prescriptions
    const orphanPrescriptions = await this.query(`
      SELECT p.prescription_id, p.encounter_id
      FROM prescriptions p
      LEFT JOIN encounters e ON p.encounter_id = e.encounter_id
      WHERE e.encounter_id IS NULL
    `);

    if (orphanPrescriptions.length > 0) {
      this.errors.push({
        category: 'orphan_records',
        type: 'orphan_prescriptions',
        count: orphanPrescriptions.length
      });
    }

    console.log(`   ✓ Orphan check complete\n`);
  }

  /**
   * 2. FOREIGN KEY INTEGRITY
   */
  private async validateForeignKeys() {
    console.log('🔗 Validating foreign key constraints...');

    const tables = [
      { table: 'encounters', fk: 'patient_id', ref: 'patients', ref_pk: 'patient_id' },
      { table: 'clinical_notes', fk: 'encounter_id', ref: 'encounters', ref_pk: 'encounter_id' },
      { table: 'prescriptions', fk: 'patient_id', ref: 'patients', ref_pk: 'patient_id' },
      { table: 'lab_orders', fk: 'patient_id', ref: 'patients', ref_pk: 'patient_id' },
      { table: 'lab_results', fk: 'order_id', ref: 'lab_orders', ref_pk: 'order_id' },
      { table: 'vital_signs', fk: 'encounter_id', ref: 'encounters', ref_pk: 'encounter_id' }
    ];

    for (const fk of tables) {
      const broken = await this.query(`
        SELECT t.*, '${fk.table}' as source_table
        FROM ${fk.table} t
        LEFT JOIN ${fk.ref} r ON t.${fk.fk} = r.${fk.ref_pk}
        WHERE r.${fk.ref_pk} IS NULL AND t.${fk.fk} IS NOT NULL
      `);

      if (broken.length > 0) {
        this.errors.push({
          category: 'foreign_key_violation',
          table: fk.table,
          foreignKey: fk.fk,
          references: `${fk.ref}.${fk.ref_pk}`,
          count: broken.length,
          records: broken.slice(0, 10) // Sample
        });
      }
    }

    console.log(`   ✓ Foreign key validation complete\n`);
  }

  /**
   * 3. INVENTORY INTEGRITY
   */
  private async validateInventoryIntegrity() {
    console.log('💊 Checking inventory integrity...');

    // Negative stock
    const negativeStock = await this.query(`
      SELECT * FROM pharmacy_inventory
      WHERE current_stock < 0
    `);

    if (negativeStock.length > 0) {
      this.errors.push({
        category: 'inventory_integrity',
        type: 'negative_stock',
        count: negativeStock.length,
        message: 'CRITICAL: Negative inventory detected',
        records: negativeStock
      });
    }

    // Mismatch between dispensed and stock
    const stockMismatch = await this.query(`
      SELECT 
        i.medication_name,
        i.current_stock,
        i.initial_stock,
        COALESCE(SUM(p.dispensed_quantity), 0) as total_dispensed,
        (i.initial_stock - COALESCE(SUM(p.dispensed_quantity), 0)) as expected_stock,
        (i.initial_stock - COALESCE(SUM(p.dispensed_quantity), 0) - i.current_stock) as discrepancy
      FROM pharmacy_inventory i
      LEFT JOIN prescriptions p ON i.medication_code = p.medication_code 
        AND p.dispense_status = 'dispensed'
      GROUP BY i.inventory_id, i.medication_name, i.current_stock, i.initial_stock
      HAVING ABS(i.initial_stock - COALESCE(SUM(p.dispensed_quantity), 0) - i.current_stock) > 5
    `);

    if (stockMismatch.length > 0) {
      this.warnings.push({
        category: 'inventory_integrity',
        type: 'stock_discrepancy',
        count: stockMismatch.length,
        message: 'Stock count mismatch detected (threshold: 5 units)',
        records: stockMismatch
      });
    }

    // Expired medications not flagged
    const unflaggedExpired = await this.query(`
      SELECT * FROM pharmacy_inventory
      WHERE expiry_date < NOW()
        AND status != 'expired'
    `);

    if (unflaggedExpired.length > 0) {
      this.warnings.push({
        category: 'inventory_integrity',
        type: 'unflagged_expired',
        count: unflaggedExpired.length
      });
    }

    console.log(`   ✓ Inventory check complete\n`);
  }

  /**
   * 4. MPI DUPLICATE DETECTION
   */
  private async validateMPIDuplicates() {
    console.log('👥 Scanning for duplicate MPI records...');

    // Exact duplicates (same name, DOB, sex)
    const exactDuplicates = await this.query(`
      SELECT 
        first_name, 
        last_name, 
        date_of_birth, 
        sex,
        COUNT(*) as duplicate_count,
        STRING_AGG(patient_id, ', ') as patient_ids
      FROM patients
      GROUP BY first_name, last_name, date_of_birth, sex
      HAVING COUNT(*) > 1
    `);

    if (exactDuplicates.length > 0) {
      this.errors.push({
        category: 'mpi_duplicates',
        type: 'exact_duplicates',
        count: exactDuplicates.length,
        message: 'CRITICAL: Exact duplicate patients detected',
        records: exactDuplicates
      });
    }

    // Duplicate AfyaID
    const duplicateAfyaID = await this.query(`
      SELECT afya_id, COUNT(*) as count
      FROM patients
      GROUP BY afya_id
      HAVING COUNT(*) > 1
    `);

    if (duplicateAfyaID.length > 0) {
      this.errors.push({
        category: 'mpi_duplicates',
        type: 'duplicate_afya_id',
        count: duplicateAfyaID.length,
        message: 'CRITICAL: Duplicate AfyaID detected (should be unique)',
        records: duplicateAfyaID
      });
    }

    // Fuzzy duplicates (similar names, same DOB)
    const fuzzyDuplicates = await this.queryFuzzyDuplicates();
    
    if (fuzzyDuplicates.length > 0) {
      this.warnings.push({
        category: 'mpi_duplicates',
        type: 'potential_duplicates',
        count: fuzzyDuplicates.length,
        message: 'Potential duplicate patients (fuzzy match)',
        records: fuzzyDuplicates.slice(0, 20) // Top 20
      });
    }

    console.log(`   ✓ MPI duplicate scan complete\n`);
  }

  /**
   * 5. REPORTING TOTALS VALIDATION
   */
  private async validateReportingTotals() {
    console.log('📊 Validating reporting aggregations...');

    // OPD count validation
    const opdActual = await this.query(`
      SELECT COUNT(*) as count
      FROM encounters
      WHERE encounter_type = 'outpatient'
        AND DATE(check_in_time) = CURRENT_DATE
    `);

    const opdReported = await this.query(`
      SELECT total_opd_visits
      FROM daily_reports
      WHERE report_date = CURRENT_DATE
    `);

    if (opdReported.length > 0 && opdActual[0].count !== opdReported[0].total_opd_visits) {
      this.errors.push({
        category: 'reporting_mismatch',
        type: 'opd_count',
        actual: opdActual[0].count,
        reported: opdReported[0].total_opd_visits,
        discrepancy: Math.abs(opdActual[0].count - opdReported[0].total_opd_visits)
      });
    }

    // Disease surveillance counts
    const malariaActual = await this.query(`
      SELECT COUNT(*) as count
      FROM clinical_notes cn
      JOIN encounters e ON cn.encounter_id = e.encounter_id
      WHERE cn.diagnosis_codes LIKE '%B50%' -- Malaria ICD-10
        AND DATE(e.check_in_time) = CURRENT_DATE
    `);

    const malariaReported = await this.query(`
      SELECT malaria_cases
      FROM disease_surveillance_reports
      WHERE report_date = CURRENT_DATE
    `);

    if (malariaReported.length > 0 && malariaActual[0].count !== malariaReported[0].malaria_cases) {
      this.warnings.push({
        category: 'reporting_mismatch',
        type: 'malaria_count',
        actual: malariaActual[0].count,
        reported: malariaReported[0].malaria_cases
      });
    }

    console.log(`   ✓ Reporting validation complete\n`);
  }

  /**
   * 6. CHECKSUM VALIDATION
   */
  private async validateChecksums() {
    console.log('🔐 Verifying data checksums...');

    // Validate audit log hash chain
    const auditLogs = await this.query(`
      SELECT log_id, previous_hash, current_hash, log_data
      FROM audit_logs
      ORDER BY created_at ASC
    `);

    for (let i = 1; i < auditLogs.length; i++) {
      const prevLog = auditLogs[i - 1];
      const currentLog = auditLogs[i];
      
      if (currentLog.previous_hash !== prevLog.current_hash) {
        this.errors.push({
          category: 'checksum_failure',
          type: 'audit_hash_chain_broken',
          logId: currentLog.log_id,
          message: 'Audit trail hash chain integrity violated'
        });
        break; // Chain is broken, no point checking further
      }
    }

    // Validate clinical note signatures
    const signedNotes = await this.query(`
      SELECT note_id, note_data, signature_hash
      FROM clinical_notes
      WHERE is_signed = true
    `);

    for (const note of signedNotes) {
      const computedHash = await this.computeHash(note.note_data);
      if (computedHash !== note.signature_hash) {
        this.errors.push({
          category: 'checksum_failure',
          type: 'note_signature_invalid',
          noteId: note.note_id,
          message: 'Clinical note has been tampered with after signing'
        });
      }
    }

    console.log(`   ✓ Checksum validation complete\n`);
  }

  /**
   * 7. AUDIT TRAIL INTEGRITY
   */
  private async validateAuditTrailIntegrity() {
    console.log('📜 Validating audit trail completeness...');

    // Check for gaps in audit log
    const gapsInAuditLog = await this.query(`
      WITH numbered AS (
        SELECT 
          log_id,
          ROW_NUMBER() OVER (ORDER BY created_at) as row_num,
          created_at,
          LAG(created_at) OVER (ORDER BY created_at) as prev_timestamp
        FROM audit_logs
      )
      SELECT *
      FROM numbered
      WHERE EXTRACT(EPOCH FROM (created_at - prev_timestamp)) > 3600
        AND prev_timestamp IS NOT NULL
    `);

    if (gapsInAuditLog.length > 0) {
      this.warnings.push({
        category: 'audit_integrity',
        type: 'audit_log_gaps',
        count: gapsInAuditLog.length,
        message: 'Gaps > 1 hour detected in audit log (potential logging failure)',
        records: gapsInAuditLog
      });
    }

    // Verify all critical actions are logged
    const unsignedNotesMissingAudit = await this.query(`
      SELECT cn.note_id, cn.is_signed, cn.signed_at
      FROM clinical_notes cn
      LEFT JOIN audit_logs al ON al.entity_id = cn.note_id 
        AND al.action = 'sign_note'
      WHERE cn.is_signed = true
        AND al.log_id IS NULL
    `);

    if (unsignedNotesMissingAudit.length > 0) {
      this.errors.push({
        category: 'audit_integrity',
        type: 'missing_signature_audit',
        count: unsignedNotesMissingAudit.length,
        message: 'Signed notes without audit trail entry'
      });
    }

    console.log(`   ✓ Audit trail validation complete\n`);
  }

  /**
   * 8. ENCOUNTER WORKFLOW INTEGRITY
   */
  private async validateEncounterWorkflow() {
    console.log('🏥 Checking encounter workflow integrity...');

    // Encounters without vitals (after check-in > 30 min)
    const encountersWithoutVitals = await this.query(`
      SELECT e.encounter_id, e.patient_id, e.check_in_time
      FROM encounters e
      LEFT JOIN vital_signs vs ON e.encounter_id = vs.encounter_id
      WHERE vs.vital_id IS NULL
        AND e.status = 'in-progress'
        AND e.check_in_time < NOW() - INTERVAL '30 minutes'
    `);

    if (encountersWithoutVitals.length > 0) {
      this.warnings.push({
        category: 'workflow_integrity',
        type: 'encounters_without_vitals',
        count: encountersWithoutVitals.length
      });
    }

    // Encounters without clinical notes (completed > 24 hours ago)
    const encountersWithoutNotes = await this.query(`
      SELECT e.encounter_id, e.patient_id, e.check_out_time
      FROM encounters e
      LEFT JOIN clinical_notes cn ON e.encounter_id = cn.encounter_id
      WHERE cn.note_id IS NULL
        AND e.status = 'completed'
        AND e.check_out_time < NOW() - INTERVAL '24 hours'
    `);

    if (encountersWithoutNotes.length > 0) {
      this.warnings.push({
        category: 'workflow_integrity',
        type: 'encounters_without_notes',
        count: encountersWithoutNotes.length,
        message: 'Completed encounters without clinical documentation'
      });
    }

    console.log(`   ✓ Workflow validation complete\n`);
  }

  /**
   * 9. PRESCRIPTION-DISPENSE INTEGRITY
   */
  private async validatePrescriptionDispenseIntegrity() {
    console.log('💊 Validating prescription-dispense integrity...');

    // Prescriptions marked dispensed without inventory deduction
    const dispensedWithoutDeduction = await this.query(`
      SELECT 
        p.prescription_id,
        p.medication_name,
        p.quantity as prescribed_qty,
        p.dispensed_quantity,
        i.current_stock
      FROM prescriptions p
      LEFT JOIN pharmacy_inventory i ON p.medication_code = i.medication_code
      WHERE p.dispense_status = 'dispensed'
        AND p.dispensed_date > i.last_updated
    `);

    if (dispensedWithoutDeduction.length > 0) {
      this.warnings.push({
        category: 'prescription_integrity',
        type: 'dispense_without_stock_update',
        count: dispensedWithoutDeduction.length
      });
    }

    // Overd ispensing (dispensed > prescribed)
    const overdispensed = await this.query(`
      SELECT *
      FROM prescriptions
      WHERE dispensed_quantity > quantity
    `);

    if (overdispensed.length > 0) {
      this.errors.push({
        category: 'prescription_integrity',
        type: 'overdispensed',
        count: overdispensed.length,
        records: overdispensed
      });
    }

    console.log(`   ✓ Prescription integrity validation complete\n`);
  }

  /**
   * 10. LAB RESULT INTEGRITY
   */
  private async validateLabResultIntegrity() {
    console.log('🔬 Checking lab result integrity...');

    // Lab results without verification (> 48 hours old)
    const unverifiedResults = await this.query(`
      SELECT *
      FROM lab_results
      WHERE verified_at IS NULL
        AND result_date < NOW() - INTERVAL '48 hours'
    `);

    if (unverifiedResults.length > 0) {
      this.warnings.push({
        category: 'lab_integrity',
        type: 'unverified_results',
        count: unverifiedResults.length
      });
    }

    // Critical results without alert
    const criticalWithoutAlert = await this.query(`
      SELECT lr.*
      FROM lab_results lr
      LEFT JOIN critical_alerts ca ON lr.result_id = ca.result_id
      WHERE lr.is_critical = true
        AND ca.alert_id IS NULL
    `);

    if (criticalWithoutAlert.length > 0) {
      this.errors.push({
        category: 'lab_integrity',
        type: 'critical_without_alert',
        count: criticalWithoutAlert.length,
        message: 'Critical lab results without alerts sent'
      });
    }

    console.log(`   ✓ Lab result validation complete\n`);
  }

  /**
   * HELPER METHODS
   */
  private async query(sql: string): Promise<any[]> {
    // Mock implementation - replace with actual DB query
    return [];
  }

  private async queryFuzzyDuplicates(): Promise<any[]> {
    // Levenshtein distance or soundex-based fuzzy matching
    return [];
  }

  private async computeHash(data: string): Promise<string> {
    // SHA-256 hash
    return 'mock-hash';
  }

  private generateReport() {
    console.log(`\n${'='.repeat(60)}`);
    console.log('📋 DATA INTEGRITY VALIDATION REPORT');
    console.log(`${'='.repeat(60)}\n`);

    console.log(`🔴 ERRORS: ${this.errors.length}`);
    this.errors.forEach((error, idx) => {
      console.log(`\n${idx + 1}. [${error.category}] ${error.type}`);
      console.log(`   Message: ${error.message || 'N/A'}`);
      console.log(`   Count: ${error.count || 1}`);
    });

    console.log(`\n⚠️  WARNINGS: ${this.warnings.length}`);
    this.warnings.forEach((warning, idx) => {
      console.log(`\n${idx + 1}. [${warning.category}] ${warning.type}`);
      console.log(`   Count: ${warning.count || 1}`);
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Critical Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Status: ${this.errors.length === 0 ? '✅ PASS' : '❌ FAIL'}`);

    if (this.errors.length === 0) {
      console.log(`\n✅ DATA INTEGRITY VALIDATED - DATABASE IS CONSISTENT`);
    } else {
      console.log(`\n❌ DATA INTEGRITY ISSUES DETECTED - IMMEDIATE ACTION REQUIRED`);
    }

    console.log(`\n${'='.repeat(60)}\n`);
  }
}

/**
 * RUN VALIDATION
 */
export async function runDataIntegrityValidation() {
  const validator = new DataIntegrityValidator();
  const result = await validator.runFullValidation();
  
  if (!result.passed) {
    process.exit(1); // Fail CI/CD if errors found
  }
}

if (require.main === module) {
  runDataIntegrityValidation().catch(console.error);
}
