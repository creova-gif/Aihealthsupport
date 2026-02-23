/**
 * PageHeader - Institutional Page Header Component
 * 
 * USAGE:
 * Standard header for all screens (consistency).
 * White background, clean typography, optional back button.
 * 
 * DESIGN:
 * - White background (institutional, not gradients)
 * - Border bottom (clear separation)
 * - Back button (optional, left-aligned)
 * - Title + subtitle layout
 * - Optional action button (right-aligned)
 * 
 * EXAMPLES:
 * - Home screen (no back button)
 * - Profile screen (back button + title)
 * - Messages screen (back + title + unread count)
 */

import React from 'react';
import { ChevronLeft, LucideIcon } from 'lucide-react';
import { colors, spacing } from '../tokens';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  backLabel,
  action,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <header
      className={`bg-white border-b ${className}`.trim()}
      style={{ borderColor: colors.neutral[300] }}
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 transition-colors hover:opacity-80"
            style={{ color: colors.neutral[600] }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.neutral[900];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.neutral[600];
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              {backLabel || 'Back'}
            </span>
          </button>
        )}

        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1
              className="text-2xl font-semibold mb-1"
              style={{ color: colors.neutral[900] }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-base"
                style={{ color: colors.neutral[600] }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Optional Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors"
              style={{
                borderColor: colors.neutral[300],
                color: colors.primary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.neutral[400];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.neutral[300];
              }}
            >
              <action.icon className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )}
        </div>

        {/* Optional Children (e.g., tabs, filters) */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Simple header (no back button)
 * <PageHeader
 *   title="Home"
 *   subtitle="What do you need help with today?"
 * />
 * 
 * // With back button
 * <PageHeader
 *   title="Profile"
 *   subtitle="Your information and settings"
 *   onBack={() => navigate(-1)}
 *   backLabel="Back"
 * />
 * 
 * // With action button
 * <PageHeader
 *   title="Messages"
 *   subtitle="Communication with your care team"
 *   action={{
 *     icon: Plus,
 *     label: 'New',
 *     onClick: () => startNewMessage(),
 *   }}
 * />
 * 
 * // With custom children (filter, tabs, etc.)
 * <PageHeader
 *   title="Health Records"
 *   subtitle="Your clinical history and results"
 *   onBack={() => navigate(-1)}
 * >
 *   <NativeDropdownFilter
 *     label="Filter:"
 *     value={filter}
 *     onChange={setFilter}
 *     options={filterOptions}
 *   />
 * </PageHeader>
 * 
 * // Bilingual support
 * <PageHeader
 *   title={language === 'sw' ? 'Wasifu' : 'Profile'}
 *   subtitle={language === 'sw' ? 'Taarifa zako na mipangilio' : 'Your information and settings'}
 *   onBack={() => navigate(-1)}
 *   backLabel={language === 'sw' ? 'Rudi' : 'Back'}
 * />
 */