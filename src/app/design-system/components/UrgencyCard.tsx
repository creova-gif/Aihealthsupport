/**
 * UrgencyCard - Multi-Modal Urgency Indicator Component
 * 
 * USAGE:
 * Displays critical information with accessible urgency indicators.
 * Used for urgent appointments, follow-up reminders, critical health alerts.
 * 
 * ACCESSIBILITY:
 * - Multi-modal urgency: color + icon + background + text
 * - High contrast (WCAG AA compliant)
 * - Screen reader friendly (aria-live="polite" for urgent items)
 * 
 * EXAMPLES:
 * - Urgent appointment reminders
 * - Follow-up needed on health records
 * - Critical medication reminders
 * - Shared device security warnings
 */

import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Info, LucideIcon } from 'lucide-react';
import { colors } from '../tokens';

export type UrgencyLevel = 'urgent' | 'warning' | 'success' | 'info';

interface UrgencyCardProps {
  level: UrgencyLevel;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const urgencyConfig = {
  urgent: {
    bg: colors.semantic.urgent.bg,
    border: colors.semantic.urgent.border,
    textColor: colors.semantic.urgent.text,
    defaultIcon: AlertCircle,
    ariaLabel: 'Urgent',
  },
  warning: {
    bg: colors.semantic.warning.bg,
    border: colors.semantic.warning.border,
    textColor: colors.semantic.warning.text,
    defaultIcon: Clock,
    ariaLabel: 'Warning',
  },
  success: {
    bg: colors.semantic.success.bg,
    border: colors.semantic.success.border,
    textColor: colors.semantic.success.text,
    defaultIcon: CheckCircle2,
    ariaLabel: 'Success',
  },
  info: {
    bg: colors.semantic.info.bg,
    border: colors.semantic.info.border,
    textColor: colors.semantic.info.text,
    defaultIcon: Info,
    ariaLabel: 'Information',
  },
};

export function UrgencyCard({
  level,
  title,
  description,
  icon: CustomIcon,
  children,
  onClick,
  className = '',
}: UrgencyCardProps) {
  const config = urgencyConfig[level];
  const Icon = CustomIcon || config.defaultIcon;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        p-4 rounded-xl border-2 transition-colors
        ${onClick ? 'cursor-pointer hover:opacity-90' : ''}
        ${className}
      `.trim()}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
      aria-live={level === 'urgent' ? 'polite' : undefined}
      aria-label={config.ariaLabel}
      {...(onClick ? { type: 'button' as const } : {})}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon
            className="w-5 h-5"
            style={{ color: config.textColor }}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: config.textColor }}
          >
            {title}
          </p>
          {description && (
            <p
              className="text-sm"
              style={{ color: config.textColor }}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </Component>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Urgent appointment reminder
 * <UrgencyCard
 *   level="urgent"
 *   title="Appointment Tomorrow"
 *   description="10:00 AM at Mwananyamala Hospital"
 * />
 * 
 * // Follow-up needed
 * <UrgencyCard
 *   level="warning"
 *   title="Follow-up Required"
 *   description="Please schedule a checkup within 2 weeks"
 * />
 * 
 * // Success notification
 * <UrgencyCard
 *   level="success"
 *   title="Test Results Ready"
 *   description="All results appear normal"
 * />
 * 
 * // Info with custom content
 * <UrgencyCard
 *   level="info"
 *   title="Shared Device Mode"
 * >
 *   <p className="text-xs mt-2">
 *     Your data will be cleared when you log out
 *   </p>
 * </UrgencyCard>
 * 
 * // Clickable card
 * <UrgencyCard
 *   level="urgent"
 *   title="Action Required"
 *   description="Tap to view details"
 *   onClick={() => navigate('/details')}
 * />
 */