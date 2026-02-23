/**
 * InputSanitizer - XSS Protection and Input Validation
 * 
 * SECURITY FEATURES:
 * - XSS (Cross-Site Scripting) prevention
 * - SQL injection prevention (for backend)
 * - Phone number validation (Tanzania format)
 * - HTML sanitization
 * - Rate limiting
 * 
 * USAGE:
 * ```typescript
 * const cleanText = InputSanitizer.sanitizeText(userInput);
 * const cleanPhone = InputSanitizer.sanitizePhone(phoneInput);
 * const isValid = InputSanitizer.validatePhone(phoneInput);
 * ```
 */

export class InputSanitizer {
  /**
   * Sanitize general text input
   * Removes HTML tags and dangerous characters
   */
  static sanitizeText(input: string): string {
    if (!input) return '';

    // Convert to string if not already
    const text = String(input);

    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, '');

    // Remove potential script injections
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length (prevent DoS)
    const MAX_LENGTH = 10000;
    if (sanitized.length > MAX_LENGTH) {
      sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
  }

  /**
   * Sanitize HTML (allow safe tags only)
   */
  static sanitizeHTML(input: string): string {
    if (!input) return '';

    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
    const text = String(input);

    // Remove script tags completely
    let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous attributes
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove tags not in allowlist
    const tagRegex = /<\/?(\w+)[^>]*>/g;
    sanitized = sanitized.replace(tagRegex, (match, tagName) => {
      return allowedTags.includes(tagName.toLowerCase()) ? match : '';
    });

    return sanitized;
  }

  /**
   * Validate Tanzania phone number
   * Format: +255 7XX XXX XXX or 0XXX XXX XXX
   */
  static validatePhone(phone: string): boolean {
    if (!phone) return false;

    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Tanzania mobile patterns
    const patterns = [
      /^\+2557\d{8}$/, // +255 7XX XXX XXX
      /^07\d{8}$/, // 07XX XXX XXX
      /^7\d{8}$/, // 7XX XXX XXX
    ];

    return patterns.some((pattern) => pattern.test(cleaned));
  }

  /**
   * Sanitize phone number to standard format
   */
  static sanitizePhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digits except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Convert local format to international
    if (cleaned.startsWith('0')) {
      cleaned = '+255' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '+255' + cleaned;
    }

    // Validate
    if (!this.validatePhone(cleaned)) {
      throw new Error('Invalid phone number format');
    }

    return cleaned;
  }

  /**
   * Validate email address
   */
  static validateEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    if (!email) return '';

    const sanitized = email.toLowerCase().trim();

    if (!this.validateEmail(sanitized)) {
      throw new Error('Invalid email format');
    }

    return sanitized;
  }

  /**
   * Validate age (reasonable range)
   */
  static validateAge(age: number): boolean {
    return age >= 0 && age <= 150 && Number.isInteger(age);
  }

  /**
   * Validate date (not in future, not too far in past)
   */
  static validateDate(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return false;
    }

    const now = new Date();
    const minDate = new Date('1900-01-01');

    return dateObj >= minDate && dateObj <= now;
  }

  /**
   * Sanitize alphanumeric (IDs, usernames)
   */
  static sanitizeAlphanumeric(input: string): string {
    if (!input) return '';

    // Allow only letters, numbers, underscore, hyphen
    return String(input).replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumeric(input: string | number): number {
    const num = typeof input === 'number' ? input : parseFloat(input);

    if (isNaN(num) || !isFinite(num)) {
      throw new Error('Invalid numeric value');
    }

    return num;
  }

  /**
   * Validate blood pressure
   */
  static validateBloodPressure(systolic: number, diastolic: number): boolean {
    return (
      systolic >= 70 &&
      systolic <= 250 &&
      diastolic >= 40 &&
      diastolic <= 150 &&
      systolic > diastolic
    );
  }

  /**
   * Validate heart rate
   */
  static validateHeartRate(hr: number): boolean {
    return hr >= 30 && hr <= 250;
  }

  /**
   * Validate temperature (Celsius)
   */
  static validateTemperature(temp: number): boolean {
    return temp >= 30 && temp <= 45;
  }

  /**
   * Validate oxygen saturation (SpO2)
   */
  static validateSpO2(spo2: number): boolean {
    return spo2 >= 50 && spo2 <= 100;
  }

  /**
   * Prevent SQL injection (for backend queries)
   */
  static escapeSQLString(input: string): string {
    if (!input) return '';

    // Escape single quotes
    let escaped = String(input).replace(/'/g, "''");

    // Remove dangerous SQL keywords
    const dangerousPatterns = [
      /;\s*DROP\s+TABLE/gi,
      /;\s*DELETE\s+FROM/gi,
      /;\s*UPDATE\s+.*SET/gi,
      /UNION\s+SELECT/gi,
      /--/g,
      /\/\*/g,
      /\*\//g,
    ];

    dangerousPatterns.forEach((pattern) => {
      escaped = escaped.replace(pattern, '');
    });

    return escaped;
  }

  /**
   * Validate URL
   */
  static validateURL(url: string): boolean {
    if (!url) return false;

    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Sanitize file name
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName) return '';

    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\./g, '');

    // Allow only safe characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Limit length
    if (sanitized.length > 255) {
      const ext = sanitized.split('.').pop();
      sanitized = sanitized.substring(0, 250) + '.' + ext;
    }

    return sanitized;
  }

  /**
   * Check for common attack patterns
   */
  static containsMaliciousContent(input: string): boolean {
    if (!input) return false;

    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /onload=/i,
      /<iframe/i,
      /eval\(/i,
      /alert\(/i,
      /document\.cookie/i,
      /\.\.\/\.\.\//,
    ];

    return maliciousPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * Sanitize form data (entire object)
   */
  static sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeText(value);
      } else if (typeof value === 'number') {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string' ? this.sanitizeText(item) : item
        );
      } else if (value && typeof value === 'object') {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized as T;
  }

  /**
   * Rate limit checker (client-side)
   */
  static checkRateLimit(action: string, maxAttempts: number, windowMs: number): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();

    try {
      const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];

      // Remove expired attempts
      const validAttempts = attempts.filter((time) => now - time < windowMs);

      // Check limit
      if (validAttempts.length >= maxAttempts) {
        return false; // Rate limit exceeded
      }

      // Record this attempt
      validAttempts.push(now);
      localStorage.setItem(key, JSON.stringify(validAttempts));

      return true; // Allowed
    } catch {
      return true; // Fail open on error
    }
  }
}

/**
 * Validation Schemas for Common Forms
 */
export const ValidationSchemas = {
  /**
   * Patient registration
   */
  patientRegistration: {
    name: (value: string) => {
      const sanitized = InputSanitizer.sanitizeText(value);
      if (sanitized.length < 2) return 'Name must be at least 2 characters';
      if (sanitized.length > 100) return 'Name is too long';
      return null;
    },

    phone: (value: string) => {
      if (!InputSanitizer.validatePhone(value)) {
        return 'Invalid phone number. Use format: +255 7XX XXX XXX';
      }
      return null;
    },

    age: (value: number) => {
      if (!InputSanitizer.validateAge(value)) {
        return 'Age must be between 0 and 150';
      }
      return null;
    },

    email: (value?: string) => {
      if (!value) return null; // Optional
      if (!InputSanitizer.validateEmail(value)) {
        return 'Invalid email address';
      }
      return null;
    },
  },

  /**
   * Vital signs
   */
  vitalSigns: {
    bloodPressure: (systolic: number, diastolic: number) => {
      if (!InputSanitizer.validateBloodPressure(systolic, diastolic)) {
        return 'Invalid blood pressure values';
      }
      return null;
    },

    heartRate: (value: number) => {
      if (!InputSanitizer.validateHeartRate(value)) {
        return 'Heart rate must be between 30 and 250 bpm';
      }
      return null;
    },

    temperature: (value: number) => {
      if (!InputSanitizer.validateTemperature(value)) {
        return 'Temperature must be between 30°C and 45°C';
      }
      return null;
    },

    spO2: (value: number) => {
      if (!InputSanitizer.validateSpO2(value)) {
        return 'SpO2 must be between 50% and 100%';
      }
      return null;
    },
  },
};
