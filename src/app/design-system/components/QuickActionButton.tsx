/**
 * QuickActionButton - Secondary Navigation Button
 * 
 * USAGE:
 * Grid-based quick access to common features.
 * Used on home screen for secondary navigation.
 * 
 * DESIGN:
 * - Icon + label layout (scannable)
 * - Colored icon background (visual categorization)
 * - White card with border (institutional feel)
 * - Optional badge for notifications
 * 
 * ACCESSIBILITY:
 * - 44px minimum touch target
 * - Clear hover/focus states
 * - Badge for notification count
 * 
 * EXAMPLES:
 * - Appointments (blue calendar)
 * - Records (green document)
 * - Medications (purple pill)
 * - Messages (yellow chat with badge)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { colors, accessibility, borderRadius, spacing } from '../tokens';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color: string;
  badge?: number;
  className?: string;
}

export function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  color,
  badge,
  className = '',
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 bg-white border-2 border-[#E5E7EB] rounded-xl
        hover:border-[#D1D5DB] transition-colors text-left group
        ${className}
      `.trim()}
      style={{
        minHeight: accessibility.minTouchTarget,
      }}
    >
      {/* Notification Badge */}
      {badge && badge > 0 && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: colors.danger[500],
          }}
        >
          <span className="text-xs font-bold text-white">
            {badge > 9 ? '9+' : badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
        style={{
          backgroundColor: `${color}15`,
        }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color }}
          strokeWidth={2}
        />
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-[#1A1D23]">
        {label}
      </p>
    </button>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic quick action
 * <QuickActionButton
 *   icon={Calendar}
 *   label="Appointments"
 *   onClick={() => navigate('/appointments')}
 *   color="#1E88E5"
 * />
 * 
 * // With notification badge
 * <QuickActionButton
 *   icon={MessageCircle}
 *   label="Messages"
 *   onClick={() => navigate('/messages')}
 *   color="#F59E0B"
 *   badge={3}
 * />
 * 
 * // Grid layout (2x2)
 * <div className="grid grid-cols-2 gap-3">
 *   <QuickActionButton icon={Calendar} label="Appointments" onClick={...} color="#1E88E5" />
 *   <QuickActionButton icon={FileText} label="Records" onClick={...} color="#43A047" />
 *   <QuickActionButton icon={Pill} label="Medications" onClick={...} color="#8B5CF6" />
 *   <QuickActionButton icon={MessageCircle} label="Messages" onClick={...} color="#F59E0B" badge={3} />
 * </div>
 */