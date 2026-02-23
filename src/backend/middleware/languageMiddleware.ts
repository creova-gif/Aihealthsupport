/**
 * BACKEND LANGUAGE MIDDLEWARE
 * AfyaCare Tanzania
 * 
 * Ensures:
 * - Language negotiation on every request
 * - Consistent language in responses
 * - No mixed-language payloads
 * - JWT-based language persistence
 * - Clinical safety validation
 */

import { Request, Response, NextFunction } from 'express';

export type SupportedLanguage = 'sw' | 'en';

interface LanguageContext {
  language: SupportedLanguage;
  source: 'jwt' | 'header' | 'facility' | 'system';
  fallbackLanguage: SupportedLanguage;
  facilityDefault?: SupportedLanguage;
}

/**
 * LANGUAGE NEGOTIATION MIDDLEWARE
 * Priority Order:
 * 1. JWT stored language
 * 2. Accept-Language header
 * 3. Facility default
 * 4. System default (sw)
 */
export function languageNegotiationMiddleware(
  req: Request & { languageContext?: LanguageContext },
  res: Response,
  next: NextFunction
) {
  try {
    const languageContext = negotiateLanguage(req);
    
    // Attach to request
    req.languageContext = languageContext;
    
    // Set response header
    res.setHeader('Content-Language', languageContext.language);
    
    // Log for audit
    logLanguageSelection(req, languageContext);
    
    next();
  } catch (error) {
    console.error('Language negotiation failed:', error);
    
    // Fallback to Swahili (Tanzania default)
    req.languageContext = {
      language: 'sw',
      source: 'system',
      fallbackLanguage: 'sw'
    };
    
    next();
  }
}

/**
 * NEGOTIATE LANGUAGE
 */
function negotiateLanguage(req: any): LanguageContext {
  let language: SupportedLanguage = 'sw';
  let source: LanguageContext['source'] = 'system';

  // 1. Check JWT for stored language preference
  if (req.user?.language) {
    const jwtLang = req.user.language.toLowerCase();
    if (jwtLang === 'sw' || jwtLang === 'en') {
      language = jwtLang;
      source = 'jwt';
    }
  }

  // 2. Check Accept-Language header (only if no JWT language)
  if (source === 'system') {
    const acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
      const parsed = parseAcceptLanguage(acceptLanguage);
      if (parsed === 'sw' || parsed === 'en') {
        language = parsed;
        source = 'header';
      }
    }
  }

  // 3. Check facility default (if user associated with facility)
  if (source === 'system' && req.user?.facilityId) {
    const facilityDefault = getFacilityDefaultLanguage(req.user.facilityId);
    if (facilityDefault) {
      language = facilityDefault;
      source = 'facility';
    }
  }

  // 4. System default is always 'sw' for Tanzania
  return {
    language,
    source,
    fallbackLanguage: 'sw'
  };
}

/**
 * PARSE ACCEPT-LANGUAGE HEADER
 */
function parseAcceptLanguage(header: string): SupportedLanguage | null {
  // Examples:
  // "sw" -> sw
  // "en-US,en;q=0.9" -> en
  // "sw,en;q=0.8" -> sw
  
  const languages = header.split(',').map(lang => {
    const [code] = lang.split(';');
    return code.trim().toLowerCase().substring(0, 2);
  });

  // Find first supported language
  for (const lang of languages) {
    if (lang === 'sw' || lang === 'en') {
      return lang;
    }
  }

  return null;
}

/**
 * GET FACILITY DEFAULT LANGUAGE
 */
function getFacilityDefaultLanguage(facilityId: string): SupportedLanguage | null {
  // Mock implementation - replace with actual DB query
  const facilityDefaults: Record<string, SupportedLanguage> = {
    'fac-001': 'sw',
    'fac-international-001': 'en'
  };

  return facilityDefaults[facilityId] || null;
}

/**
 * LOG LANGUAGE SELECTION (for audit trail)
 */
function logLanguageSelection(req: any, context: LanguageContext) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Language] ${req.method} ${req.path} -> ${context.language} (${context.source})`);
  }

  // In production, log to audit database
  if (process.env.NODE_ENV === 'production') {
    logToAuditDatabase({
      timestamp: new Date(),
      userId: req.user?.id,
      endpoint: req.path,
      method: req.method,
      selectedLanguage: context.language,
      languageSource: context.source,
      acceptLanguageHeader: req.headers['accept-language'],
      userAgent: req.headers['user-agent']
    });
  }
}

/**
 * RESPONSE VALIDATION MIDDLEWARE
 * Ensures response language matches request language
 */
export function validateResponseLanguage(
  req: Request & { languageContext?: LanguageContext },
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json;

  // Intercept res.json()
  res.json = function (data: any) {
    const languageContext = req.languageContext;

    if (languageContext && process.env.NODE_ENV === 'production') {
      // Validate response language
      const validation = validatePayloadLanguage(data, languageContext.language);

      if (!validation.valid) {
        console.error('❌ LANGUAGE MISMATCH IN RESPONSE', {
          endpoint: req.path,
          expected: languageContext.language,
          issues: validation.issues
        });

        // In production, block mixed-language responses
        return originalJson.call(this, {
          error: 'Language consistency error',
          message_key: 'errors.languageMismatch'
        });
      }
    }

    return originalJson.call(this, data);
  };

  next();
}

/**
 * VALIDATE PAYLOAD LANGUAGE
 */
interface LanguageValidation {
  valid: boolean;
  issues: string[];
}

function validatePayloadLanguage(
  data: any,
  expectedLanguage: SupportedLanguage
): LanguageValidation {
  const issues: string[] = [];

  // Recursively check all string values
  function checkStrings(obj: any, path = ''): void {
    if (typeof obj === 'string') {
      const detectedLanguage = detectLanguage(obj);
      
      if (detectedLanguage && detectedLanguage !== expectedLanguage) {
        issues.push(`${path}: Expected ${expectedLanguage}, found ${detectedLanguage}`);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => checkStrings(item, `${path}[${index}]`));
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        checkStrings(obj[key], path ? `${path}.${key}` : key);
      });
    }
  }

  checkStrings(data);

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * DETECT LANGUAGE IN STRING
 * Uses heuristics to detect Swahili vs English
 */
function detectLanguage(text: string): SupportedLanguage | null {
  if (!text || text.length < 10) return null;

  const words = text.toLowerCase().split(/\s+/);

  // Common Swahili words
  const swahiliIndicators = [
    'na', 'kwa', 'ya', 'wa', 'za', 'ni', 'si', 'katika',
    'kuwa', 'hii', 'hiyo', 'hizi', 'hivi', 'yule', 'wale',
    'mimi', 'wewe', 'yeye', 'sisi', 'ninyi', 'wao',
    'daktari', 'mgonjwa', 'homa', 'maumivu', 'dalili'
  ];

  // Common English words
  const englishIndicators = [
    'the', 'is', 'are', 'was', 'were', 'have', 'has',
    'this', 'that', 'these', 'those', 'you', 'your',
    'doctor', 'patient', 'fever', 'pain', 'symptom'
  ];

  let swahiliCount = 0;
  let englishCount = 0;

  words.forEach(word => {
    if (swahiliIndicators.includes(word)) swahiliCount++;
    if (englishIndicators.includes(word)) englishCount++;
  });

  // If significant difference, return detected language
  if (swahiliCount > englishCount * 2) return 'sw';
  if (englishCount > swahiliCount * 2) return 'en';

  return null; // Ambiguous
}

/**
 * TRANSLATION KEY RESPONSE HELPER
 * Instead of sending hardcoded messages, send keys
 */
export function createTranslatableResponse(
  messageKey: string,
  data?: Record<string, any>,
  status: number = 200
) {
  return {
    status,
    message_key: messageKey,
    data: data || {},
    _meta: {
      requires_translation: true,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * EXAMPLE USAGE IN API ENDPOINT
 */
export function exampleApiEndpoint(req: any, res: Response) {
  const { languageContext } = req;

  // ❌ DON'T do this:
  // res.json({ message: "Appointment created successfully" });

  // ✅ DO this instead:
  res.json(createTranslatableResponse(
    'appointments.created',
    { appointmentId: '123', time: '14:30' }
  ));

  // Frontend will render:
  // t('appointments.created', { appointmentId: '123', time: '14:30' })
}

/**
 * AI RESPONSE LANGUAGE SAFETY
 */
export async function validateAIResponse(
  aiResponse: string,
  expectedLanguage: SupportedLanguage
): Promise<{ valid: boolean; reason?: string }> {
  // 1. Detect language
  const detectedLanguage = detectLanguage(aiResponse);

  // 2. Check for language mixing
  const words = aiResponse.split(/\s+/);
  const totalWords = words.length;

  let unexpectedLanguageWords = 0;

  if (expectedLanguage === 'sw') {
    // Count English words
    const englishWords = ['the', 'is', 'are', 'was', 'were', 'doctor', 'patient', 'emergency'];
    unexpectedLanguageWords = words.filter(w => 
      englishWords.includes(w.toLowerCase())
    ).length;
  } else {
    // Count Swahili words
    const swahiliWords = ['na', 'kwa', 'ya', 'daktari', 'mgonjwa', 'homa'];
    unexpectedLanguageWords = words.filter(w => 
      swahiliWords.includes(w.toLowerCase())
    ).length;
  }

  const unexpectedPercentage = (unexpectedLanguageWords / totalWords) * 100;

  // 3. Validate
  if (unexpectedPercentage > 30) {
    return {
      valid: false,
      reason: `AI response contains ${unexpectedPercentage.toFixed(1)}% ${
        expectedLanguage === 'sw' ? 'English' : 'Swahili'
      } words (threshold: 30%)`
    };
  }

  return { valid: true };
}

/**
 * CLINICAL MESSAGE VALIDATION
 * Emergency/critical messages must exist in translation DB
 */
export async function validateClinicalMessage(
  messageKey: string,
  language: SupportedLanguage
): Promise<{ valid: boolean; message?: string }> {
  // Check if message exists in clinical translations table
  const clinicalMessage = await getClinicalTranslation(messageKey, language);

  if (!clinicalMessage) {
    return {
      valid: false,
      message: `Clinical message key "${messageKey}" not found for language "${language}"`
    };
  }

  // Check if reviewed
  if (!clinicalMessage.reviewed_at) {
    console.warn(`⚠️  Clinical message "${messageKey}" not clinically reviewed`);
  }

  return {
    valid: true,
    message: clinicalMessage.value
  };
}

/**
 * MOCK DATABASE FUNCTIONS
 */
async function logToAuditDatabase(data: any) {
  // Implement actual database logging
  console.log('[Audit]', data);
}

async function getClinicalTranslation(key: string, language: SupportedLanguage) {
  // Mock - replace with actual DB query
  const clinicalTranslations: Record<string, any> = {
    'emergency.seekImmediateCare_sw': {
      value: 'DHARURA - Tafuta msaada haraka!',
      reviewed_at: new Date('2026-01-15'),
      reviewed_by: 'Dr. Mwenda (MoH)'
    },
    'emergency.seekImmediateCare_en': {
      value: 'EMERGENCY - Seek immediate care!',
      reviewed_at: new Date('2026-01-15'),
      reviewed_by: 'Dr. Mwenda (MoH)'
    }
  };

  return clinicalTranslations[`${key}_${language}`];
}

export default {
  languageNegotiationMiddleware,
  validateResponseLanguage,
  createTranslatableResponse,
  validateAIResponse,
  validateClinicalMessage
};
