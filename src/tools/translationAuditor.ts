/**
 * TRANSLATION COMPLIANCE AUDITOR
 * AfyaCare Tanzania
 * 
 * Scans codebase for:
 * - Hardcoded strings
 * - Missing translation keys
 * - Unused translations
 * - Layout overflow risks
 * - ICU pluralization
 * - Backend API language consistency
 * 
 * BLOCKS DEPLOYMENT if any critical issues found
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface AuditResult {
  passed: boolean;
  errors: AuditError[];
  warnings: AuditWarning[];
  summary: AuditSummary;
}

interface AuditError {
  type: 'hardcoded' | 'missing_key' | 'mixed_language' | 'overflow';
  severity: 'critical' | 'high' | 'medium';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

interface AuditWarning {
  type: 'unused_key' | 'length_difference' | 'no_review';
  file: string;
  message: string;
}

interface AuditSummary {
  totalFiles: number;
  filesScanned: number;
  hardcodedStrings: number;
  missingKeys: number;
  unusedKeys: number;
  translationCoverage: number;
}

export class TranslationAuditor {
  private srcPath: string;
  private translationPath: string;
  private swTranslations: any;
  private enTranslations: any;
  private errors: AuditError[] = [];
  private warnings: AuditWarning[] = [];

  constructor(
    srcPath: string = './src',
    translationPath: string = './src/i18n/locales'
  ) {
    this.srcPath = srcPath;
    this.translationPath = translationPath;
    this.loadTranslations();
  }

  /**
   * LOAD TRANSLATION FILES
   */
  private loadTranslations() {
    try {
      this.swTranslations = JSON.parse(
        fs.readFileSync(path.join(this.translationPath, 'sw.json'), 'utf8')
      );
      this.enTranslations = JSON.parse(
        fs.readFileSync(path.join(this.translationPath, 'en.json'), 'utf8')
      );
    } catch (error) {
      console.error('Failed to load translations:', error);
      throw error;
    }
  }

  /**
   * RUN COMPLETE AUDIT
   */
  async runFullAudit(): Promise<AuditResult> {
    console.log('\n🔍 STARTING TRANSLATION AUDIT\n');

    this.errors = [];
    this.warnings = [];

    // 1. Scan for hardcoded strings
    await this.scanHardcodedStrings();

    // 2. Check missing keys
    await this.checkMissingKeys();

    // 3. Find unused keys
    await this.findUnusedKeys();

    // 4. Check length overflow risk
    await this.checkLengthOverflow();

    // 5. Validate ICU pluralization
    await this.validatePluralization();

    // 6. Backend API language check (if available)
    if (fs.existsSync('./src/backend')) {
      await this.checkBackendLanguageConsistency();
    }

    // Generate summary
    const summary = this.generateSummary();

    return {
      passed: this.errors.filter(e => e.severity === 'critical').length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary
    };
  }

  /**
   * 1. SCAN FOR HARDCODED STRINGS
   */
  private async scanHardcodedStrings() {
    console.log('📝 Scanning for hardcoded strings...');

    const files = this.getComponentFiles();

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Pattern 1: JSX text content
        // <h1>Hardcoded Text</h1>
        const jsxTextPattern = />([A-Z][a-zA-Z\s]{5,})</;
        const jsxMatch = line.match(jsxTextPattern);

        if (jsxMatch && !line.includes('{t(')) {
          const text = jsxMatch[1];
          
          // Ignore common exceptions
          if (!this.isExceptionString(text)) {
            this.errors.push({
              type: 'hardcoded',
              severity: 'critical',
              file,
              line: index + 1,
              message: `Hardcoded string found: "${text}"`,
              suggestion: `Replace with {t('appropriate.key')}`
            });
          }
        }

        // Pattern 2: String literals with medical terms
        const medicalTerms = [
          'Emergency', 'Doctor', 'Patient', 'Appointment',
          'Symptom', 'Fever', 'Malaria', 'Prescription', 'Diagnosis'
        ];

        medicalTerms.forEach(term => {
          const stringPattern = new RegExp(`["'\`]${term}["'\`]`, 'g');
          if (stringPattern.test(line) && !line.includes('t(')) {
            this.errors.push({
              type: 'hardcoded',
              severity: 'critical',
              file,
              line: index + 1,
              message: `Hardcoded medical term: "${term}"`,
              suggestion: `Use translation key from medical.* or conditions.*`
            });
          }
        });
      });
    }

    console.log(`   Found ${this.errors.filter(e => e.type === 'hardcoded').length} hardcoded strings`);
  }

  /**
   * 2. CHECK MISSING KEYS
   */
  private async checkMissingKeys() {
    console.log('🔑 Checking for missing translation keys...');

    const files = this.getComponentFiles();
    const usedKeys = new Set<string>();

    // Extract all t('key') calls
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Match t('key') and t("key")
      const tCallPattern = /t\(['"]([\w.]+)['"]\)/g;
      let match;

      while ((match = tCallPattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    }

    // Check if keys exist in both language files
    usedKeys.forEach(key => {
      const existsInSw = this.getNestedValue(this.swTranslations, key);
      const existsInEn = this.getNestedValue(this.enTranslations, key);

      if (!existsInSw) {
        this.errors.push({
          type: 'missing_key',
          severity: 'high',
          file: 'sw.json',
          message: `Missing Swahili translation for key: "${key}"`,
          suggestion: `Add translation in /src/i18n/locales/sw.json`
        });
      }

      if (!existsInEn) {
        this.errors.push({
          type: 'missing_key',
          severity: 'high',
          file: 'en.json',
          message: `Missing English translation for key: "${key}"`,
          suggestion: `Add translation in /src/i18n/locales/en.json`
        });
      }
    });

    console.log(`   Found ${this.errors.filter(e => e.type === 'missing_key').length} missing keys`);
  }

  /**
   * 3. FIND UNUSED KEYS
   */
  private async findUnusedKeys() {
    console.log('🗑️  Finding unused translation keys...');

    const files = this.getComponentFiles();
    const usedKeys = new Set<string>();

    // Extract all used keys
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const tCallPattern = /t\(['"]([\w.]+)['"]\)/g;
      let match;

      while ((match = tCallPattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    }

    // Get all defined keys
    const allSwKeys = this.getAllKeys(this.swTranslations);
    const allEnKeys = this.getAllKeys(this.enTranslations);

    // Find unused
    const unusedSw = allSwKeys.filter(key => !usedKeys.has(key));
    const unusedEn = allEnKeys.filter(key => !usedKeys.has(key));

    unusedSw.forEach(key => {
      this.warnings.push({
        type: 'unused_key',
        file: 'sw.json',
        message: `Unused translation key: "${key}"`
      });
    });

    console.log(`   Found ${unusedSw.length} unused keys`);
  }

  /**
   * 4. CHECK LENGTH OVERFLOW
   */
  private async checkLengthOverflow() {
    console.log('📏 Checking for length overflow risks...');

    const allKeys = this.getAllKeys(this.swTranslations);

    allKeys.forEach(key => {
      const swText = this.getNestedValue(this.swTranslations, key);
      const enText = this.getNestedValue(this.enTranslations, key);

      if (typeof swText === 'string' && typeof enText === 'string') {
        const lengthDiff = Math.abs(swText.length - enText.length);
        const percentDiff = (lengthDiff / Math.max(swText.length, enText.length)) * 100;

        if (percentDiff > 40) {
          this.warnings.push({
            type: 'length_difference',
            file: `${key}`,
            message: `Large length difference (${percentDiff.toFixed(0)}%): SW="${swText.substring(0, 30)}..." EN="${enText.substring(0, 30)}..."`
          });
        }
      }
    });

    console.log(`   Found ${this.warnings.filter(w => w.type === 'length_difference').length} length warnings`);
  }

  /**
   * 5. VALIDATE PLURALIZATION
   */
  private async validatePluralization() {
    console.log('🔢 Validating ICU pluralization...');

    // Check for plural forms
    const pluralKeys = this.getAllKeys(this.swTranslations).filter(key => 
      key.includes('_count') || key.includes('_plural')
    );

    if (pluralKeys.length === 0) {
      this.warnings.push({
        type: 'no_review',
        file: 'pluralization',
        message: 'No plural forms found. Consider adding count-based translations.'
      });
    }
  }

  /**
   * 6. CHECK BACKEND API LANGUAGE CONSISTENCY
   */
  private async checkBackendLanguageConsistency() {
    console.log('🔌 Checking backend API language consistency...');

    try {
      // Scan backend files for hardcoded messages
      const backendFiles = this.getFiles('./src/backend', ['.ts']);

      backendFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Look for res.json({ message: "..." })
        const hardcodedMessagePattern = /res\.json\(\{[^}]*message:\s*["']([^"']+)["']/g;
        let match;

        while ((match = hardcodedMessagePattern.exec(content)) !== null) {
          const message = match[1];

          // Check if it's English (heuristic)
          if (this.isEnglishMessage(message)) {
            this.errors.push({
              type: 'hardcoded',
              severity: 'high',
              file,
              message: `Backend returns hardcoded English message: "${message}"`,
              suggestion: `Use createTranslatableResponse('message.key') instead`
            });
          }
        }
      });
    } catch (error) {
      console.warn('   Could not scan backend files:', error);
    }
  }

  /**
   * HELPER: Get all component files
   */
  private getComponentFiles(): string[] {
    return this.getFiles(this.srcPath, ['.tsx', '.ts']);
  }

  /**
   * HELPER: Get files recursively
   */
  private getFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getFiles(fullPath, extensions));
      } else if (extensions.some(ext => fullPath.endsWith(ext))) {
        files.push(fullPath);
      }
    });

    return files;
  }

  /**
   * HELPER: Get all keys from translation object
   */
  private getAllKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(this.getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }

    return keys;
  }

  /**
   * HELPER: Get nested value
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * HELPER: Check if string is exception
   */
  private isExceptionString(text: string): boolean {
    const exceptions = [
      'OK', 'ID', 'API', 'URL', 'SMS', 'OTP', 'PDF', 'CSV',
      'COVID-19', 'HIV', 'TB', 'NHIF', 'MoH', 'CHW', 'FHIR'
    ];

    return exceptions.includes(text.trim()) || 
           text.length < 3 || 
           /^\d+$/.test(text);
  }

  /**
   * HELPER: Check if message is English
   */
  private isEnglishMessage(text: string): boolean {
    const englishWords = ['the', 'is', 'are', 'was', 'were', 'successfully', 'created', 'updated', 'deleted'];
    const lowerText = text.toLowerCase();

    return englishWords.some(word => lowerText.includes(word));
  }

  /**
   * GENERATE SUMMARY
   */
  private generateSummary(): AuditSummary {
    const files = this.getComponentFiles();

    return {
      totalFiles: files.length,
      filesScanned: files.length,
      hardcodedStrings: this.errors.filter(e => e.type === 'hardcoded').length,
      missingKeys: this.errors.filter(e => e.type === 'missing_key').length,
      unusedKeys: this.warnings.filter(w => w.type === 'unused_key').length,
      translationCoverage: this.calculateCoverage()
    };
  }

  /**
   * CALCULATE TRANSLATION COVERAGE
   */
  private calculateCoverage(): number {
    const swKeys = this.getAllKeys(this.swTranslations);
    const enKeys = this.getAllKeys(this.enTranslations);

    if (swKeys.length === 0) return 0;

    const matchingKeys = swKeys.filter(key => enKeys.includes(key)).length;
    return (matchingKeys / swKeys.length) * 100;
  }

  /**
   * PRINT REPORT
   */
  printReport(result: AuditResult) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TRANSLATION AUDIT REPORT');
    console.log('='.repeat(60) + '\n');

    // Summary
    console.log('📈 SUMMARY:');
    console.log(`   Files scanned: ${result.summary.filesScanned}`);
    console.log(`   Translation coverage: ${result.summary.translationCoverage.toFixed(1)}%`);
    console.log(`   Hardcoded strings: ${result.summary.hardcodedStrings}`);
    console.log(`   Missing keys: ${result.summary.missingKeys}`);
    console.log(`   Unused keys: ${result.summary.unusedKeys}\n`);

    // Critical errors
    const criticalErrors = result.errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      console.log('🚨 CRITICAL ERRORS:');
      criticalErrors.forEach(error => {
        console.log(`   [${error.type}] ${error.file}:${error.line || '?'}`);
        console.log(`      ${error.message}`);
        if (error.suggestion) {
          console.log(`      💡 ${error.suggestion}`);
        }
      });
      console.log('');
    }

    // High priority errors
    const highErrors = result.errors.filter(e => e.severity === 'high');
    if (highErrors.length > 0) {
      console.log('⚠️  HIGH PRIORITY ERRORS:');
      highErrors.slice(0, 10).forEach(error => {
        console.log(`   [${error.type}] ${error.file}`);
        console.log(`      ${error.message}`);
      });
      if (highErrors.length > 10) {
        console.log(`   ... and ${highErrors.length - 10} more`);
      }
      console.log('');
    }

    // Warnings
    if (result.warnings.length > 0) {
      console.log(`ℹ️  WARNINGS: ${result.warnings.length} (showing first 5)`);
      result.warnings.slice(0, 5).forEach(warning => {
        console.log(`   [${warning.type}] ${warning.file}`);
        console.log(`      ${warning.message}`);
      });
      console.log('');
    }

    // Result
    console.log('='.repeat(60));
    if (result.passed) {
      console.log('✅ AUDIT PASSED - Safe to deploy\n');
    } else {
      console.log('❌ AUDIT FAILED - Fix critical issues before deploying\n');
      process.exit(1);
    }
  }
}

/**
 * CLI EXECUTION
 */
if (require.main === module) {
  const auditor = new TranslationAuditor();

  auditor.runFullAudit().then(result => {
    auditor.printReport(result);
  }).catch(error => {
    console.error('Audit failed:', error);
    process.exit(1);
  });
}

export default TranslationAuditor;
