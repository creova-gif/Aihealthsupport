/**
 * NationalBottomNav - World-Class Navigation
 * 
 * REFACTORED: Now uses MedicalNavigation component
 * Follows strict 8pt spacing system and government-grade standards
 * 
 * DESIGN PRINCIPLES:
 * - Clear labels (icon + text)
 * - 44px touch targets
 * - Consistent spacing
 * - Active state clear
 * - Institutional design
 * 
 * COMPARED TO: NHS App navigation, Apple Health tabs
 */

import React from 'react';
import { MedicalNavigation } from '@/app/design-system';

interface NationalBottomNavProps {
  currentRoute: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
}

export function NationalBottomNav({ currentRoute, language, onNavigate }: NationalBottomNavProps) {
  return (
    <MedicalNavigation
      currentRoute={currentRoute}
      language={language}
      onNavigate={onNavigate}
    />
  );
}