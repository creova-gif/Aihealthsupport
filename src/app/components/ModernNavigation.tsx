/**
 * ModernNavigation - New 5-Tab Bottom Navigation
 * Organized by human intent: Home, Care, Emergency, Messages, Profile
 * Emergency is ALWAYS visible as center tab (most critical action)
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, Heart, AlertCircle, MessageCircle, User } from 'lucide-react';

interface ModernNavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  language: 'sw' | 'en';
  unreadCount?: number;
}

export function ModernNavigation({
  activeRoute,
  onNavigate,
  language,
  unreadCount = 0,
}: ModernNavigationProps) {
  const navItems = [
    {
      key: 'home',
      icon: Home,
      label: language === 'sw' ? 'Nyumbani' : 'Home',
    },
    {
      key: 'care',
      icon: Heart,
      label: language === 'sw' ? 'Huduma' : 'Care',
    },
    {
      key: 'emergency',
      icon: AlertCircle,
      label: language === 'sw' ? 'Dharura' : 'Emergency',
      isEmergency: true,
    },
    {
      key: 'messages',
      icon: MessageCircle,
      label: language === 'sw' ? 'Ujumbe' : 'Messages',
      badge: unreadCount,
    },
    {
      key: 'profile',
      icon: User,
      label: language === 'sw' ? 'Profaili' : 'Profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] safe-area-bottom">
      <div className="max-w-4xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeRoute === item.key;
            const Icon = item.icon;
            const isEmergency = item.isEmergency;

            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[64px] ${
                  isEmergency ? 'scale-110' : ''
                }`}
                aria-label={isEmergency ? `${item.label} - Always available` : item.label}
              >
                {/* Active indicator */}
                {isActive && !isEmergency && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#EFF6FF] rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}

                {/* Emergency background (always visible) */}
                {isEmergency && (
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-[#DC2626] rounded-xl"
                  />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isEmergency
                        ? 'text-white'
                        : isActive
                        ? 'text-[#1E88E5]'
                        : 'text-[#9CA3AF]'
                    }`}
                    strokeWidth={isEmergency ? 2.5 : 2}
                  />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 text-xs font-medium transition-colors ${
                    isEmergency
                      ? 'text-white font-semibold'
                      : isActive
                      ? 'text-[#1E88E5]'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}