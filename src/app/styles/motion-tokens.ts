/**
 * Medical Motion System - Non-Negotiable Standards
 * 
 * PHILOSOPHY:
 * Motion exists only to clarify, never to decorate.
 * 
 * Motion must:
 * - Reduce cognitive load
 * - Confirm user actions
 * - Signal hierarchy and direction
 * - Feel calm, predictable, and respectful
 * 
 * Motion must never:
 * - Entertain
 * - Surprise
 * - Distract
 * - Imply intelligence or automation
 * - Delay access to care
 */

// ==========================================
// 1. TIMING TOKENS (NON-NEGOTIABLE)
// ==========================================

export const MOTION_DURATION = {
  instant: 0,        // 0ms - State changes
  fast: 120,         // 120ms - Button press feedback
  standard: 180,     // 180ms - Navigation, toggles
  slow: 240,         // 240ms - Full-screen transitions
  max: 300,          // 300ms - Absolute maximum
} as const;

// Convert to seconds for Motion/Framer
export const MOTION_DURATION_S = {
  instant: 0,
  fast: 0.12,
  standard: 0.18,
  slow: 0.24,
  max: 0.3,
} as const;

// ❌ NEVER exceed 300ms
// ❌ NEVER chain animations

// ==========================================
// 2. EASING CURVES (CALM, PREDICTABLE)
// ==========================================

export const MOTION_EASING = {
  // Most interactions (exits, fades)
  out: [0.2, 0, 0, 1],
  
  // Navigation (balanced)
  inOut: [0.4, 0, 0.2, 1],
  
  // Loaders only (constant speed)
  linear: [0, 0, 1, 1],
} as const;

// CSS format
export const MOTION_EASING_CSS = {
  out: 'cubic-bezier(0.2, 0, 0, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
} as const;

// ❌ NO bounce
// ❌ NO spring physics
// ❌ NO elastic easing

// ==========================================
// 3. OPACITY TOKENS
// ==========================================

export const MOTION_OPACITY = {
  disabled: 0.4,
  hover: 0.85,
  loading: 0.6,
  hidden: 0,
  visible: 1,
} as const;

// ==========================================
// 4. SCALE TOKENS
// ==========================================

export const MOTION_SCALE = {
  press: 0.98,      // Button press only
  none: 1.0,        // Default
} as const;

// ❌ NEVER scale above 1.0
// ❌ NEVER pulse

// ==========================================
// 5. SLIDE DISTANCES (NAVIGATION)
// ==========================================

export const MOTION_SLIDE = {
  full: '100%',     // Full screen slide
  partial: '20%',   // Peek/overlay
} as const;

// ==========================================
// 6. PREDEFINED MOTION VARIANTS
// ==========================================

/**
 * Button Press (Standard)
 */
export const BUTTON_PRESS = {
  initial: { scale: MOTION_SCALE.none, opacity: MOTION_OPACITY.visible },
  pressed: { scale: MOTION_SCALE.press, opacity: MOTION_OPACITY.hover },
  transition: {
    duration: MOTION_DURATION_S.fast,
    ease: MOTION_EASING.out,
  },
} as const;

/**
 * Button Hover (Subtle)
 */
export const BUTTON_HOVER = {
  initial: { opacity: MOTION_OPACITY.visible },
  hover: { opacity: MOTION_OPACITY.hover },
  transition: {
    duration: MOTION_DURATION_S.fast,
    ease: MOTION_EASING.out,
  },
} as const;

/**
 * Navigation - Forward (Slide Left)
 */
export const NAV_FORWARD = {
  initial: { x: MOTION_SLIDE.full, opacity: 0 },
  animate: { x: 0, opacity: MOTION_OPACITY.visible },
  exit: { x: `-${MOTION_SLIDE.partial}`, opacity: 0 },
  transition: {
    duration: MOTION_DURATION_S.standard,
    ease: MOTION_EASING.inOut,
  },
} as const;

/**
 * Navigation - Back (Slide Right)
 */
export const NAV_BACK = {
  initial: { x: `-${MOTION_SLIDE.partial}`, opacity: 0 },
  animate: { x: 0, opacity: MOTION_OPACITY.visible },
  exit: { x: MOTION_SLIDE.full, opacity: 0 },
  transition: {
    duration: MOTION_DURATION_S.standard,
    ease: MOTION_EASING.inOut,
  },
} as const;

/**
 * Modal/Sheet - Slide Up
 */
export const MODAL_SLIDE_UP = {
  initial: { y: MOTION_SLIDE.full, opacity: 0 },
  animate: { y: 0, opacity: MOTION_OPACITY.visible },
  exit: { y: MOTION_SLIDE.full, opacity: 0 },
  transition: {
    duration: MOTION_DURATION_S.standard,
    ease: MOTION_EASING.out,
  },
} as const;

/**
 * Fade (Confirmations, Tooltips)
 */
export const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: MOTION_OPACITY.visible },
  exit: { opacity: 0 },
  transition: {
    duration: MOTION_DURATION_S.fast,
    ease: MOTION_EASING.out,
  },
} as const;

/**
 * Backdrop Dim
 */
export const BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 0.4 },
  exit: { opacity: 0 },
  transition: {
    duration: MOTION_DURATION_S.fast,
    ease: MOTION_EASING.out,
  },
} as const;

/**
 * List Item Stagger (Subtle)
 */
export const LIST_ITEM = (index: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { 
    opacity: MOTION_OPACITY.visible, 
    y: 0,
    transition: {
      duration: MOTION_DURATION_S.fast,
      delay: index * 0.03, // Max 30ms per item
      ease: MOTION_EASING.out,
    },
  },
});

/**
 * Collapse/Expand (Accordion)
 */
export const COLLAPSE = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: MOTION_OPACITY.visible,
    transition: {
      duration: MOTION_DURATION_S.standard,
      ease: MOTION_EASING.inOut,
    },
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      duration: MOTION_DURATION_S.standard,
      ease: MOTION_EASING.inOut,
    },
  },
} as const;

/**
 * EMERGENCY - NO MOTION
 */
export const EMERGENCY = {
  initial: { opacity: MOTION_OPACITY.visible },
  animate: { opacity: MOTION_OPACITY.visible },
  exit: { opacity: MOTION_OPACITY.visible },
  transition: { duration: MOTION_DURATION.instant },
} as const;

// ==========================================
// 7. UTILITY FUNCTIONS
// ==========================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get duration based on reduced motion preference
 */
export const getMotionDuration = (
  duration: keyof typeof MOTION_DURATION_S,
  respectReducedMotion = true
): number => {
  if (respectReducedMotion && prefersReducedMotion()) {
    return MOTION_DURATION.instant;
  }
  return MOTION_DURATION_S[duration];
};

/**
 * Haptic feedback (mobile only)
 */
export const triggerHaptic = (duration = 10): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

// ==========================================
// 8. CSS UTILITY CLASSES
// ==========================================

/**
 * Generate CSS for consistent transitions
 */
export const MOTION_CSS = {
  // Standard transition for most elements
  standard: `transition: all ${MOTION_DURATION.standard}ms ${MOTION_EASING_CSS.inOut}`,
  
  // Fast transition for buttons, hovers
  fast: `transition: all ${MOTION_DURATION.fast}ms ${MOTION_EASING_CSS.out}`,
  
  // Slow transition for page changes
  slow: `transition: all ${MOTION_DURATION.slow}ms ${MOTION_EASING_CSS.inOut}`,
  
  // No transition (instant)
  none: `transition: none`,
} as const;

// ==========================================
// 9. MOTION RULES (DOCUMENTATION)
// ==========================================

/**
 * RULES TO FOLLOW:
 * 
 * ✅ DO:
 * - Keep all motion under 300ms
 * - Use motion to confirm actions
 * - Respect reduced motion preferences
 * - Make motion subtle and predictable
 * - Test on low-end devices
 * 
 * ❌ DON'T:
 * - Chain multiple animations
 * - Use bounce or spring physics
 * - Scale elements above 1.0
 * - Add decorative motion
 * - Use motion in emergency states
 * - Animate "thinking" or "processing"
 * - Create surprise effects
 * - Distract from healthcare tasks
 */

// ==========================================
// 10. ANTI-PATTERNS (FORBIDDEN)
// ==========================================

/**
 * NEVER USE:
 * ❌ Sparkles
 * ❌ Pulsing elements
 * ❌ Animated mascots
 * ❌ Micro-celebrations
 * ❌ "Success" fireworks
 * ❌ Bounce effects
 * ❌ AI-style animations
 * ❌ Loading dots that "think"
 * ❌ Morphing shapes
 * ❌ Parallax effects
 * ❌ Confetti
 * ❌ Gradient animations
 */

export type MotionDuration = keyof typeof MOTION_DURATION;
export type MotionEasing = keyof typeof MOTION_EASING;
