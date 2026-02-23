/**
 * AfyaCare Tanzania Design System - Component Library
 * 
 * Reusable components extracted from Phase 2 UX redesigns.
 * Based on UX audit findings and accessibility best practices.
 * 
 * DESIGN PRINCIPLES:
 * 1. Institutional over consumer (white backgrounds, clean typography)
 * 2. Multi-modal accessibility (color + icon + text)
 * 3. Native controls where possible (dropdowns, inputs)
 * 4. Clear visual hierarchy (urgent vs informational)
 * 5. Mobile-first (44px touch targets, native controls)
 * 
 * USAGE:
 * Import components as needed:
 * ```tsx
 * import { UrgencyCard, SectionHeader, StatusBadge } from '@/app/design-system';
 * ```
 */

// ============================================
// COMPONENTS
// ============================================

export { UrgencyCard } from './components/UrgencyCard';
export type { UrgencyLevel } from './components/UrgencyCard';

export { SectionHeader } from './components/SectionHeader';

export { StatusBadge } from './components/StatusBadge';
export type { StatusType } from './components/StatusBadge';

export { QuickActionButton } from './components/QuickActionButton';

export { NativeDropdownFilter } from './components/NativeDropdownFilter';

export { PageHeader } from './components/PageHeader';

// ============================================
// MEDICAL-GRADE CORE COMPONENTS (2026 Refactor)
// ============================================

export { MedicalButton } from './components/MedicalButton';
export { MedicalInput } from './components/MedicalInput';
export { MedicalCard, MedicalCardHeader, MedicalCardContent, MedicalCardFooter } from './components/MedicalCard';
export { MedicalNavigation } from './components/MedicalNavigation';

// ============================================
// DESIGN TOKENS
// ============================================

export { theme, colors, typography, spacing, borderRadius, shadows, components } from './tokens';
export type { Theme } from './tokens';

// ============================================
// COMPONENT PATTERNS
// ============================================

/**
 * PATTERN 1: Urgency Indicators
 * 
 * Use UrgencyCard for any critical information:
 * - Urgent appointments
 * - Follow-up reminders
 * - Critical health alerts
 * - Shared device warnings
 * 
 * WHY: Multi-modal accessibility (color + icon + text)
 * ensures all users can identify urgency.
 */

/**
 * PATTERN 2: Section Organization
 * 
 * Use SectionHeader to group related content:
 * - "IN PROGRESS" (care journeys)
 * - "PERSONAL INFO" (profile fields)
 * - "QUICK ACTIONS" (navigation)
 * 
 * WHY: Uppercase labels with wide tracking create
 * scannable visual hierarchy.
 */

/**
 * PATTERN 3: Status Communication
 * 
 * Use StatusBadge for state information:
 * - "Completed" (green check)
 * - "In Progress" (yellow clock)
 * - "Needs Action" (red alert)
 * 
 * WHY: Icon + text provides clear status even
 * for color-blind users.
 */

/**
 * PATTERN 4: Quick Navigation
 * 
 * Use QuickActionButton in 2x2 grids:
 * - Appointments, Records
 * - Medications, Messages
 * 
 * WHY: Icon + label layout is scannable,
 * colored backgrounds provide visual categorization.
 */

/**
 * PATTERN 5: Filtering Lists
 * 
 * Use NativeDropdownFilter for all filters:
 * - Message grouping
 * - Health records filtering
 * - Date range selection
 * 
 * WHY: Native <select> works everywhere,
 * no horizontal scroll issues on mobile.
 */

/**
 * PATTERN 6: Page Structure
 * 
 * Use PageHeader for consistent layout:
 * - White background (institutional)
 * - Optional back button
 * - Title + subtitle
 * - Optional action button
 * 
 * WHY: Consistency reduces cognitive load,
 * users know where to find navigation.
 */