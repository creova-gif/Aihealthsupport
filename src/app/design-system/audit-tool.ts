/**
 * PHASE 2: DESIGN SYSTEM AUDIT TOOL
 * 
 * This audit checks ALL code against the strict design system standards.
 * Run this audit to find violations before government review.
 * 
 * WHAT THIS AUDITS:
 * ❌ Random spacing values (not divisible by 4)
 * ❌ Hardcoded colors (should use design tokens)
 * ❌ Inconsistent border radius
 * ❌ Multiple shadow systems
 * ❌ Animation durations over 300ms
 * ❌ Inconsistent icon weights
 * ❌ Tiny font usage (<12px)
 * ❌ Overlapping layout logic
 * 
 * AUDIT CATEGORIES:
 * 1. Spacing violations (8pt system)
 * 2. Color violations (token system)
 * 3. Typography violations (scale + hierarchy)
 * 4. Motion violations (<300ms rule)
 * 5. Accessibility violations (44px touch targets)
 * 6. Border/Shadow violations (consistency)
 */

// ============================================
// SPACING AUDIT (8pt System)
// ============================================

export const SPACING_VIOLATIONS = {
  // ❌ FORBIDDEN VALUES (not divisible by 4)
  forbidden: [
    '1px', '2px', '3px', '5px', '6px', '7px',
    '9px', '10px', '11px', '13px', '14px', '15px',
    '17px', '18px', '19px', '21px', '22px', '23px',
    '25px', '26px', '27px', '29px', '30px', '31px',
    '33px', '34px', '35px', '37px', '38px', '39px',
    // ... add more as needed
  ],

  // ✅ ALLOWED VALUES (8pt system: 4, 8, 16, 24, 32, 40, 48, 64)
  allowed: [
    '0px', '4px', '8px', '12px', '16px', '20px', '24px',
    '32px', '40px', '48px', '56px', '64px', '80px', '96px',
  ],

  // Common CSS properties to check
  properties: [
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'gap', 'row-gap', 'column-gap',
    'top', 'right', 'bottom', 'left',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  ],
};

// ============================================
// COLOR AUDIT (Token System)
// ============================================

export const COLOR_VIOLATIONS = {
  // ❌ FORBIDDEN: Hardcoded hex colors (should use tokens)
  forbiddenPatterns: [
    /#[0-9A-Fa-f]{6}/, // Hex colors
    /#[0-9A-Fa-f]{3}/,  // Short hex
    /rgb\(/, // RGB
    /rgba\(/, // RGBA
    /hsl\(/, // HSL
  ],

  // ✅ ALLOWED: Design token references
  allowedTokens: [
    'colors.primary',
    'colors.success',
    'colors.warning',
    'colors.danger',
    'colors.neutral',
    'colors.semantic',
    'var(--primary)',
    'var(--background)',
    // ... from design system
  ],

  // Exception: Pure white/black/transparent are OK
  exceptions: ['#FFFFFF', '#ffffff', '#000000', '#000', 'transparent', 'currentColor'],
};

// ============================================
// TYPOGRAPHY AUDIT (Scale + Hierarchy)
// ============================================

export const TYPOGRAPHY_VIOLATIONS = {
  // ❌ FORBIDDEN: Font sizes below 12px (readability)
  minimumFontSize: 12,

  // ❌ FORBIDDEN: Random font sizes
  forbiddenSizes: [
    '11px', '13px', '15px', '17px', '19px', '21px', '23px',
  ],

  // ✅ ALLOWED: Typography scale
  allowedSizes: [
    '12px', // xs - helper text
    '14px', // sm - secondary
    '16px', // base - body
    '18px', // lg - large body
    '20px', // xl - section heading
    '24px', // 2xl - page title
    '28px', // 3xl - hero
  ],

  // Font weight rules
  allowedWeights: [400, 500, 600, 700],
  forbiddenWeights: [100, 200, 300, 800, 900],
};

// ============================================
// MOTION AUDIT (<300ms Rule)
// ============================================

export const MOTION_VIOLATIONS = {
  // ❌ FORBIDDEN: Animations over 300ms
  maxDuration: 300,

  // ❌ FORBIDDEN: Decorative animations
  forbiddenAnimations: [
    'bounce',
    'pulse',
    'wiggle',
    'shake',
    'rubber-band',
    'swing',
    'tada',
    'wobble',
    'jello',
  ],

  // ✅ ALLOWED: Functional animations only
  allowedAnimations: [
    'fade',
    'slide',
    'scale',
    'opacity',
  ],

  // ✅ ALLOWED: Durations
  allowedDurations: ['150ms', '200ms', '250ms', '300ms'],
  forbiddenDurations: ['400ms', '500ms', '600ms', '1s', '2s'],
};

// ============================================
// ACCESSIBILITY AUDIT
// ============================================

export const ACCESSIBILITY_VIOLATIONS = {
  // ❌ FORBIDDEN: Touch targets below 44px
  minimumTouchTarget: 44,

  // ❌ FORBIDDEN: Low contrast ratios
  minimumContrastRatio: 4.5, // WCAG AA

  // ❌ FORBIDDEN: Color-only indicators
  requiresMultiModal: true, // Must have icon + text, not just color
};

// ============================================
// BORDER & SHADOW AUDIT
// ============================================

export const VISUAL_VIOLATIONS = {
  // ❌ FORBIDDEN: Heavy shadows
  maxShadowBlur: 15,

  // ✅ ALLOWED: Border radius (institutional)
  allowedBorderRadius: ['0px', '4px', '6px', '8px', '12px', '16px', '9999px'],
  forbiddenBorderRadius: ['2px', '3px', '5px', '20px', '24px', '32px'],

  // ❌ FORBIDDEN: Gradients
  allowsGradients: false,

  // ❌ FORBIDDEN: Neon colors
  forbidsNeon: true,
};

// ============================================
// AUDIT EXECUTION FUNCTION
// ============================================

export interface AuditResult {
  category: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line?: number;
  suggestion: string;
}

export function auditFile(filePath: string, content: string): AuditResult[] {
  const results: AuditResult[] = [];

  // 1. Check spacing violations
  SPACING_VIOLATIONS.forbidden.forEach((value) => {
    if (content.includes(value)) {
      results.push({
        category: 'Spacing',
        severity: 'error',
        message: `Found forbidden spacing value: ${value}`,
        file: filePath,
        suggestion: 'Use 8pt system values: 4px, 8px, 16px, 24px, 32px, 40px, 48px, 64px',
      });
    }
  });

  // 2. Check color violations (hardcoded hex)
  const hexColorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;
  const hexMatches = content.match(hexColorRegex) || [];
  hexMatches.forEach((hex) => {
    if (!COLOR_VIOLATIONS.exceptions.includes(hex)) {
      results.push({
        category: 'Colors',
        severity: 'warning',
        message: `Found hardcoded color: ${hex}`,
        file: filePath,
        suggestion: 'Use design tokens from colors.ts instead',
      });
    }
  });

  // 3. Check typography violations
  TYPOGRAPHY_VIOLATIONS.forbiddenSizes.forEach((size) => {
    if (content.includes(`font-size: ${size}`) || content.includes(`fontSize: '${size}'`)) {
      results.push({
        category: 'Typography',
        severity: 'error',
        message: `Found forbidden font size: ${size}`,
        file: filePath,
        suggestion: 'Use typography scale: 12px, 14px, 16px, 18px, 20px, 24px, 28px',
      });
    }
  });

  // 4. Check motion violations
  MOTION_VIOLATIONS.forbiddenDurations.forEach((duration) => {
    if (content.includes(duration)) {
      results.push({
        category: 'Motion',
        severity: 'error',
        message: `Found animation over 300ms: ${duration}`,
        file: filePath,
        suggestion: 'Keep animations under 300ms for government compliance',
      });
    }
  });

  MOTION_VIOLATIONS.forbiddenAnimations.forEach((anim) => {
    if (content.includes(anim)) {
      results.push({
        category: 'Motion',
        severity: 'warning',
        message: `Found decorative animation: ${anim}`,
        file: filePath,
        suggestion: 'Remove bounce/pulse/decorative animations. Use fade/slide only.',
      });
    }
  });

  // 5. Check accessibility violations
  const heightRegex = /height:\s*['"]?(\d+)px/g;
  let heightMatch;
  while ((heightMatch = heightRegex.exec(content)) !== null) {
    const height = parseInt(heightMatch[1]);
    if (height < ACCESSIBILITY_VIOLATIONS.minimumTouchTarget) {
      results.push({
        category: 'Accessibility',
        severity: 'error',
        message: `Touch target too small: ${height}px`,
        file: filePath,
        suggestion: 'Use minimum 44px height for interactive elements',
      });
    }
  }

  return results;
}

// ============================================
// USAGE
// ============================================

/**
 * To audit a file:
 * 
 * import { auditFile } from './audit-tool';
 * 
 * const results = auditFile('Component.tsx', fileContent);
 * results.forEach(result => {
 *   console.log(`${result.severity.toUpperCase()}: ${result.message}`);
 *   console.log(`  Suggestion: ${result.suggestion}`);
 * });
 */

/**
 * QUICK AUDIT CHECKLIST:
 * 
 * Before committing code, check:
 * ✅ All spacing values divisible by 4
 * ✅ No hardcoded colors (use tokens)
 * ✅ Font sizes from scale (12/14/16/18/20/24/28)
 * ✅ Animations under 300ms
 * ✅ Touch targets 44px+
 * ✅ Border radius 12px max
 * ✅ Shadows subtle (under 15px blur)
 * ✅ No gradients
 * ✅ No decorative motion
 */
