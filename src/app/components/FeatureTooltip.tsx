import React, { useEffect, useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TooltipConfig {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: string; // CSS selector
}

interface FeatureTooltipProps {
  language: 'sw' | 'en';
  tooltip: TooltipConfig;
  onDismiss: () => void;
}

const translations = {
  sw: {
    gotIt: 'Nimeelewa',
    tip: 'Kidokezo',
  },
  en: {
    gotIt: 'Got It',
    tip: 'Tip',
  },
};

export function FeatureTooltip({ language, tooltip, onDismiss }: FeatureTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const t = translations[language];

  useEffect(() => {
    if (tooltip.targetElement) {
      const element = document.querySelector(tooltip.targetElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Calculate position based on tooltip position preference
        let top = rect.top + scrollTop;
        let left = rect.left + scrollLeft;

        switch (tooltip.position) {
          case 'bottom':
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'top':
            top = rect.top + scrollTop - 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 10;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 10;
            break;
          default:
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + rect.width / 2;
        }

        setPosition({ top, left });
      }
    }
  }, [tooltip.targetElement, tooltip.position]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {/* Backdrop with spotlight effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(1px)',
        }}
        onClick={onDismiss}
      />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed z-50 max-w-xs"
        style={{
          top: tooltip.targetElement ? `${position.top}px` : '50%',
          left: tooltip.targetElement ? `${position.left}px` : '50%',
          transform: tooltip.targetElement 
            ? `translateX(-50%)` 
            : 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-300" fill="currentColor" />
              <span className="text-white font-bold text-sm">{t.tip}</span>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-2 text-base">
              {tooltip.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {tooltip.description}
            </p>

            {/* Action button */}
            <button
              onClick={onDismiss}
              className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              {t.gotIt}
            </button>
          </div>

          {/* Arrow indicator (optional, based on position) */}
          {tooltip.targetElement && (
            <div
              className="absolute w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid #3B82F6',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Tooltip manager for tracking shown tooltips
class TooltipManagerClass {
  private static shownTooltips: Set<string> = new Set();

  static hasShown(tooltipId: string): boolean {
    const key = `tooltip_shown_${tooltipId}`;
    return localStorage.getItem(key) === 'true' || this.shownTooltips.has(tooltipId);
  }

  static markAsShown(tooltipId: string): void {
    const key = `tooltip_shown_${tooltipId}`;
    localStorage.setItem(key, 'true');
    this.shownTooltips.add(tooltipId);
  }

  static reset(): void {
    this.shownTooltips.clear();
    // Optionally clear localStorage
  }
}

export const TooltipManager = TooltipManagerClass;