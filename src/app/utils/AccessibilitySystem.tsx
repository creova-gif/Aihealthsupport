/**
 * Accessibility Enhancement System for AfyaCare Tanzania
 * 
 * WORLD-CLASS ACCESSIBILITY FEATURES
 * 
 * Compliance:
 * - WCAG 2.1 Level AA (targeting AAA where feasible)
 * - Tanzania Persons with Disabilities Act (2010)
 * - WHO accessibility guidelines for health systems
 * 
 * Features:
 * - Font size controls (4 levels: Small, Medium, Large, Extra Large)
 * - High contrast mode
 * - Screen reader optimization
 * - Keyboard navigation
 * - Focus indicators
 * - ARIA labels and landmarks
 * - Reduced motion mode
 * - Touch target sizing (minimum 48x48px)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Accessibility preferences interface
export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  largeTouch: boolean; // Extra large touch targets
}

// Default preferences
const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  largeTouch: false
};

// Storage key
const STORAGE_KEY = 'accessibility_preferences';

// Context
interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Accessibility Provider Component
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error);
    }
    
    // Check system preferences
    const systemPreferences: Partial<AccessibilityPreferences> = {};
    
    // Detect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      systemPreferences.reducedMotion = true;
    }
    
    // Detect prefers-contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      systemPreferences.highContrast = true;
    }
    
    return { ...DEFAULT_PREFERENCES, ...systemPreferences };
  });

  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    root.style.setProperty('--font-size', fontSizeMap[preferences.fontSize]);
    
    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Large touch targets
    if (preferences.largeTouch) {
      root.classList.add('large-touch');
    } else {
      root.classList.remove('large-touch');
    }
    
    // Keyboard navigation
    if (preferences.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error);
    }
  }, [preferences]);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * Keyboard Navigation Hook
 * Provides utilities for keyboard navigation
 */
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          if (onEnter) {
            e.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowKeys) {
            e.preventDefault();
            onArrowKeys('up');
          }
          break;
        case 'ArrowDown':
          if (onArrowKeys) {
            e.preventDefault();
            onArrowKeys('down');
          }
          break;
        case 'ArrowLeft':
          if (onArrowKeys) {
            e.preventDefault();
            onArrowKeys('left');
          }
          break;
        case 'ArrowRight':
          if (onArrowKeys) {
            e.preventDefault();
            onArrowKeys('right');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowKeys]);
};

/**
 * Focus Management Hook
 * Trap focus within a container (for modals, dialogs)
 */
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey as any);
    return () => container.removeEventListener('keydown', handleTabKey as any);
  }, [containerRef, isActive]);
};

/**
 * Screen Reader Announcement Hook
 * Announce messages to screen readers
 */
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!announcement) return;

    // Create or get live region
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = announcement;

    // Clear after announcement
    const timer = setTimeout(() => {
      setAnnouncement('');
      if (liveRegion) liveRegion.textContent = '';
    }, 1000);

    return () => clearTimeout(timer);
  }, [announcement]);

  return (message: string) => setAnnouncement(message);
};

/**
 * Skip to Content Link Component
 */
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
    >
      Skip to main content
    </a>
  );
};

/**
 * Accessible Button Wrapper
 * Ensures buttons have proper ARIA attributes and touch targets
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  ariaLabel,
  loading,
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      aria-label={ariaLabel}
      aria-busy={loading}
      disabled={disabled || loading}
      className="min-h-[48px] min-w-[48px]"
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Utility: Generate unique ID for ARIA associations
 */
let idCounter = 0;
export const useUniqueId = (prefix: string = 'id'): string => {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
};

/**
 * ARIA Live Region Component
 * For announcing dynamic content changes
 */
interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ message, politeness = 'polite' }) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};
