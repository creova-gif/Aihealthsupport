/**
 * SectionHeader - Consistent Section Label Component
 * 
 * USAGE:
 * Standard header for grouping related content.
 * Creates clear visual hierarchy and content organization.
 * 
 * DESIGN:
 * - Uppercase text (scannable)
 * - Wide letter spacing (readability)
 * - Gray color (de-emphasized, structural)
 * - Consistent spacing
 * 
 * EXAMPLES:
 * - "IN PROGRESS" (home screen)
 * - "PERSONAL INFO" (profile screen)
 * - "QUICK ACTIONS" (home screen)
 * - "PRIVACY & SHARING" (profile screen)
 */

import React from 'react';
import { components, colors, typography, spacing } from '../tokens';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className = '' }: SectionHeaderProps) {
  return (
    <h2
      className={`
        text-sm font-semibold uppercase tracking-wide mb-3
        ${className}
      `.trim()}
      style={{
        color: colors.neutral[600],
        fontSize: components.sectionHeader.fontSize,
        fontWeight: components.sectionHeader.fontWeight,
        letterSpacing: components.sectionHeader.letterSpacing,
        marginBottom: components.sectionHeader.marginBottom,
      }}
    >
      {children}
    </h2>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <SectionHeader>In Progress</SectionHeader>
 * 
 * // With custom styling
 * <SectionHeader className="mt-6">
 *   Personal Information
 * </SectionHeader>
 * 
 * // Bilingual support
 * <SectionHeader>
 *   {language === 'sw' ? 'Zinaendelea' : 'In Progress'}
 * </SectionHeader>
 */