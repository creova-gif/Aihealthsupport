/**
 * StatusBadge - Status Indicator with Icon Component
 * 
 * USAGE:
 * Displays status information with visual indicators.
 * Used for health records, messages, care journeys.
 * 
 * ACCESSIBILITY:
 * - Icon + text (multi-modal)
 * - High contrast colors
 * - Semantic color meanings
 * 
 * EXAMPLES:
 * - "Completed" (green check)
 * - "In Progress" (yellow clock)
 * - "Needs Action" (red alert)
 * - "Week 24" (blue info)
 */

import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Info, LucideIcon } from 'lucide-react';
import { colors, components } from '../tokens';

export type StatusType = 'completed' | 'in-progress' | 'needs-action' | 'info';

interface StatusBadgeProps {
  type: StatusType;
  label: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig = {
  completed: {
    bg: colors.success[50],
    text: colors.success[500],
    icon: CheckCircle2,
  },
  'in-progress': {
    bg: colors.warning[50],
    text: colors.warning[500],
    icon: Clock,
  },
  'needs-action': {
    bg: colors.danger[50],
    text: colors.danger[600],
    icon: AlertCircle,
  },
  info: {
    bg: colors.primary[50],
    text: colors.primary[500],
    icon: Info,
  },
};

export function StatusBadge({
  type,
  label,
  icon: CustomIcon,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const config = statusConfig[type];
  const Icon = CustomIcon || config.icon;

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1.5';

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${padding} ${textSize} ${className}
      `.trim()}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <Icon
        className={iconSize}
        strokeWidth={2}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Completed status (green)
 * <StatusBadge
 *   type="completed"
 *   label="Completed"
 * />
 * 
 * // In progress (yellow)
 * <StatusBadge
 *   type="in-progress"
 *   label="Week 24"
 * />
 * 
 * // Needs action (red)
 * <StatusBadge
 *   type="needs-action"
 *   label="Follow-up Needed"
 * />
 * 
 * // Info badge (blue)
 * <StatusBadge
 *   type="info"
 *   label="New"
 * />
 * 
 * // Small size
 * <StatusBadge
 *   type="completed"
 *   label="Done"
 *   size="sm"
 * />
 * 
 * // Custom icon
 * <StatusBadge
 *   type="info"
 *   label="2 new"
 *   icon={Bell}
 * />
 */