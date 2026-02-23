/**
 * MedicalNavigation - Government-Grade Bottom Navigation
 * 
 * DESIGN SYSTEM COMPLIANCE:
 * ✅ 24px uniform icon size
 * ✅ Single stroke style (consistent weight)
 * ✅ 44px minimum touch targets
 * ✅ Predictable active state (no bounce)
 * ✅ Clear visual hierarchy
 * ✅ Motion under 250ms
 * 
 * COMPARED TO: NHS App navigation, Apple Health bottom tabs
 */

import React from 'react';
import { Home, FileText, MessageCircle, User, Stethoscope } from 'lucide-react';
import { colors } from '../tokens';

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

interface MedicalNavigationProps {
  currentRoute: string;
  language: 'sw' | 'en';
  onNavigate: (route: string) => void;
  className?: string;
}

/**
 * NAVIGATION SPECIFICATIONS:
 * 
 * Icon size: 24px uniform (no variation)
 * Stroke weight: 2px default, 2.5px active
 * Touch target: 56px height (44px minimum + padding)
 * Active state: Primary color background + icon + text
 * Inactive state: Neutral gray
 * 
 * NO bounce animations
 * NO spring physics
 * NO decorative motion
 * 
 * Transition: 200ms ease (under 250ms requirement)
 */

export function MedicalNavigation({
  currentRoute,
  language,
  onNavigate,
  className = '',
}: MedicalNavigationProps) {
  const content = {
    sw: {
      home: 'Nyumbani',
      care: 'Huduma',
      assistant: 'Ushauri',
      messages: 'Ujumbe',
      profile: 'Wasifu',
    },
    en: {
      home: 'Home',
      care: 'Care',
      assistant: 'Guidance',
      messages: 'Messages',
      profile: 'Profile',
    },
  };

  const t = content[language];

  const tabs: NavigationTab[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'care', label: t.care, icon: FileText },
    { id: 'assistant', label: t.assistant, icon: Stethoscope },
    { id: 'messages', label: t.messages, icon: MessageCircle },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTop: `1px solid ${colors.neutral[200]}`,
    zIndex: 40,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '8px 8px', // 8pt system
  };

  return (
    <nav className={className} style={navStyle}>
      <div style={containerStyle}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.id;

          const buttonStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px', // 4pt
            padding: '8px 12px', // 8pt system
            minWidth: '64px',
            minHeight: '56px', // Exceeds 44px touch target
            borderRadius: '8px',
            backgroundColor: isActive ? colors.primary[50] : 'transparent',
            color: isActive ? colors.primary[600] : colors.neutral[600],
            border: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease', // Under 250ms
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
          };

          const iconStyle: React.CSSProperties = {
            width: '24px', // Uniform size
            height: '24px',
            flexShrink: 0,
          };

          const labelStyle: React.CSSProperties = {
            fontSize: '12px',
            fontWeight: isActive ? 600 : 500,
            lineHeight: 1,
          };

          return (
            <button
              key={tab.id}
              style={buttonStyle}
              onClick={() => onNavigate(tab.id)}
              onMouseDown={(e) => {
                // Subtle press feedback only (no bounce)
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div style={iconStyle}>
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2} // Slight weight increase when active
                />
              </div>
              <span style={labelStyle}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <MedicalNavigation
 *   currentRoute={currentRoute}
 *   language={language}
 *   onNavigate={(route) => setCurrentRoute(route)}
 * />
 * 
 * ACCESSIBILITY:
 * - Semantic HTML (nav, button)
 * - aria-label for screen readers
 * - aria-current for active page
 * - Keyboard navigable
 * - No reliance on color alone (icon + text + background)
 */
