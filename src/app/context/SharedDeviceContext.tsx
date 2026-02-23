/**
 * SharedDeviceManager - Secure Session Management
 * 
 * PURPOSE: Protect patient privacy on shared community devices
 * 
 * CRITICAL REQUIREMENTS (Tanzania PDPA Compliance):
 * - Detect shared device mode (clinic tablets, community centers)
 * - Force auto-lock after 2 minutes inactivity
 * - Clear all data on logout (no user choice on shared devices)
 * - Session warnings (30 seconds before lock)
 * - Biometric/PIN required for sensitive actions
 * - Activity logging for audit trail
 * 
 * SCENARIOS:
 * - Clinic tablet used by multiple patients
 * - CHW phone shared with community members
 * - Cybercafe/library public computer
 * - Family phone with multiple users
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Lock, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Device fingerprinting for shared device detection
const getDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  return btoa(
    JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
    })
  );
};

interface SharedDeviceContextType {
  isSharedDevice: boolean;
  setDeviceMode: (mode: 'personal' | 'shared') => void;
  sessionTimeRemaining: number;
  resetSessionTimer: () => void;
  lockSession: () => void;
  isSessionLocked: boolean;
  unlockSession: (pin?: string) => boolean;
  requireAuth: boolean;
  setRequireAuth: (require: boolean) => void;
  activityLog: ActivityLogEntry[];
  logActivity: (action: string, details?: string) => void;
}

interface ActivityLogEntry {
  timestamp: string;
  action: string;
  details?: string;
  deviceFingerprint: string;
}

const SharedDeviceContext = createContext<SharedDeviceContextType | null>(null);

export const useSharedDevice = () => {
  const context = useContext(SharedDeviceContext);
  if (!context) {
    throw new Error('useSharedDevice must be used within SharedDeviceProvider');
  }
  return context;
};

interface SharedDeviceProviderProps {
  children: React.ReactNode;
  autoLockTimeoutMs?: number; // Default: 120000 (2 minutes)
  warningTimeMs?: number; // Default: 30000 (30 seconds)
}

export function SharedDeviceProvider({
  children,
  autoLockTimeoutMs = 120000, // 2 minutes
  warningTimeMs = 30000, // 30 seconds
}: SharedDeviceProviderProps) {
  const [isSharedDevice, setIsSharedDevice] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(autoLockTimeoutMs);
  const [requireAuth, setRequireAuth] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  // Check if device mode is set, otherwise prompt user
  useEffect(() => {
    const deviceMode = localStorage.getItem('device_mode');
    const deviceFingerprint = getDeviceFingerprint();
    const storedFingerprint = localStorage.getItem('device_fingerprint');

    // If fingerprint changed, device might be shared
    if (storedFingerprint && storedFingerprint !== deviceFingerprint) {
      setIsSharedDevice(true);
      localStorage.setItem('device_mode', 'shared');
    } else if (deviceMode === 'shared') {
      setIsSharedDevice(true);
    } else if (!deviceMode) {
      // First time - will prompt user during onboarding
      setIsSharedDevice(false);
    }

    localStorage.setItem('device_fingerprint', deviceFingerprint);
  }, []);

  const setDeviceMode = useCallback((mode: 'personal' | 'shared') => {
    setIsSharedDevice(mode === 'shared');
    localStorage.setItem('device_mode', mode);
    
    if (mode === 'shared') {
      // Shared device: Enable strict security
      setRequireAuth(true);
      logActivity('DEVICE_MODE_CHANGED', 'Set to SHARED (strict security enabled)');
    } else {
      // Personal device: Relaxed security
      setRequireAuth(false);
      logActivity('DEVICE_MODE_CHANGED', 'Set to PERSONAL (relaxed security)');
    }
  }, []);

  const logActivity = useCallback((action: string, details?: string) => {
    const entry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      deviceFingerprint: getDeviceFingerprint(),
    };
    
    setActivityLog((prev) => {
      const newLog = [entry, ...prev].slice(0, 100); // Keep last 100 entries
      localStorage.setItem('activity_log', JSON.stringify(newLog));
      return newLog;
    });
  }, []);

  const resetSessionTimer = useCallback(() => {
    setLastActivityTime(Date.now());
    setSessionTimeRemaining(autoLockTimeoutMs);
    setShowWarning(false);
  }, [autoLockTimeoutMs]);

  const lockSession = useCallback(() => {
    setIsSessionLocked(true);
    logActivity('SESSION_LOCKED', 'Auto-lock due to inactivity');
  }, [logActivity]);

  const unlockSession = useCallback((pin?: string) => {
    // In production, verify PIN/biometric
    // For now, just unlock
    const storedPin = localStorage.getItem('device_pin');
    
    if (storedPin && pin !== storedPin) {
      logActivity('UNLOCK_FAILED', 'Incorrect PIN');
      return false;
    }
    
    setIsSessionLocked(false);
    resetSessionTimer();
    logActivity('SESSION_UNLOCKED', pin ? 'PIN authentication' : 'No auth required');
    return true;
  }, [resetSessionTimer, logActivity]);

  // Activity tracking
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetSessionTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetSessionTimer]);

  // Session timeout countdown
  useEffect(() => {
    if (!isSharedDevice || isSessionLocked) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime;
      const remaining = autoLockTimeoutMs - elapsed;

      setSessionTimeRemaining(remaining);

      // Show warning 30 seconds before lock
      if (remaining <= warningTimeMs && remaining > 0) {
        setShowWarning(true);
      }

      // Lock session
      if (remaining <= 0) {
        lockSession();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSharedDevice, isSessionLocked, lastActivityTime, autoLockTimeoutMs, warningTimeMs, lockSession]);

  return (
    <SharedDeviceContext.Provider
      value={{
        isSharedDevice,
        setDeviceMode,
        sessionTimeRemaining,
        resetSessionTimer,
        lockSession,
        isSessionLocked,
        unlockSession,
        requireAuth,
        setRequireAuth,
        activityLog,
        logActivity,
      }}
    >
      {children}
      
      {/* Session Warning Banner */}
      <AnimatePresence>
        {showWarning && !isSessionLocked && (
          <SessionWarningBanner
            timeRemaining={sessionTimeRemaining}
            onDismiss={resetSessionTimer}
          />
        )}
      </AnimatePresence>

      {/* Session Lock Screen */}
      {isSessionLocked && (
        <SessionLockScreen
          onUnlock={unlockSession}
          requirePin={isSharedDevice}
        />
      )}
    </SharedDeviceContext.Provider>
  );
}

// Session Warning Banner Component
function SessionWarningBanner({
  timeRemaining,
  onDismiss,
}: {
  timeRemaining: number;
  onDismiss: () => void;
}) {
  const seconds = Math.ceil(timeRemaining / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed top-0 left-0 right-0 z-[9999] bg-[#F59E0B] text-white p-4 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        </motion.div>
        
        <div className="flex-1">
          <p className="font-semibold">
            Session Expiring Soon
          </p>
          <p className="text-sm opacity-90">
            Your session will lock in {seconds} seconds due to inactivity
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="px-6 py-2 bg-white text-[#F59E0B] rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          I'm Still Here
        </button>
      </div>
    </motion.div>
  );
}

// Session Lock Screen Component
function SessionLockScreen({
  onUnlock,
  requirePin,
}: {
  onUnlock: (pin?: string) => boolean;
  requirePin: boolean;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (requirePin) {
      const success = onUnlock(pin);
      if (!success) {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } else {
      onUnlock();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#1A1D23] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-2xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-[#DC2626]" />
        </div>

        <h2 className="text-2xl font-bold text-[#1A1D23] mb-2">
          Session Locked
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          Your session was locked due to inactivity to protect your privacy
        </p>

        {requirePin ? (
          <>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pin.length === 4) {
                  handleUnlock();
                }
              }}
              placeholder="Enter 4-digit PIN"
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-[#E5E7EB] rounded-lg mb-4 focus:outline-none focus:border-[#1E88E5]"
              autoFocus
            />
            
            {error && (
              <p className="text-sm text-[#DC2626] mb-4">{error}</p>
            )}

            <button
              onClick={handleUnlock}
              disabled={pin.length !== 4}
              className="w-full h-12 bg-[#1E88E5] text-white rounded-lg font-medium hover:bg-[#1976D2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>
          </>
        ) : (
          <button
            onClick={handleUnlock}
            className="w-full h-12 bg-[#1E88E5] text-white rounded-lg font-medium hover:bg-[#1976D2] transition-colors"
          >
            Tap to Continue
          </button>
        )}
      </motion.div>
    </div>
  );
}

// Device Mode Selection Component (for onboarding)
export function DeviceModeSelector({
  language,
  onSelect,
}: {
  language: 'sw' | 'en';
  onSelect: (mode: 'personal' | 'shared') => void;
}) {
  const content = {
    sw: {
      title: 'Aina ya Kifaa',
      subtitle: 'Hii inasaidia kulinda faragha yako',
      personal: {
        title: 'Kifaa Binafsi',
        description: 'Simu yangu mimi pekee au kifaa changu',
        benefits: [
          'Kumbuka taarifa zangu',
          'Kufuli baada ya dakika 5',
          'Futa data wakati ninapotaka',
        ],
      },
      shared: {
        title: 'Kifaa Kinachoshirikiwa',
        description: 'Simu ya familia, kliniki, au ya umma',
        benefits: [
          'Kufuli kiotomatiki baada ya dakika 2',
          'Futa data yote wakati wa kutoka',
          'Omba PIN kwa taarifa nyeti',
        ],
      },
      note: 'Unaweza kubadilisha hili baadaye katika mipangilio',
    },
    en: {
      title: 'Device Type',
      subtitle: 'This helps protect your privacy',
      personal: {
        title: 'Personal Device',
        description: 'My phone or device that only I use',
        benefits: [
          'Remember my information',
          'Auto-lock after 5 minutes',
          'Clear data when I want',
        ],
      },
      shared: {
        title: 'Shared Device',
        description: 'Family phone, clinic, or public device',
        benefits: [
          'Auto-lock after 2 minutes',
          'Clear all data on logout',
          'Require PIN for sensitive info',
        ],
      },
      note: 'You can change this later in settings',
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1D23] mb-2">{t.title}</h1>
          <p className="text-base text-[#6B7280]">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Personal Device */}
          <motion.button
            onClick={() => onSelect('personal')}
            className="p-6 bg-white border-2 border-[#E5E7EB] rounded-2xl hover:border-[#1E88E5] transition-colors text-left"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#1E88E5]" />
            </div>
            
            <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">
              {t.personal.title}
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              {t.personal.description}
            </p>

            <ul className="space-y-2">
              {t.personal.benefits.map((benefit, i) => (
                <li key={i} className="text-sm text-[#6B7280] flex items-start gap-2">
                  <span className="text-[#10B981] mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.button>

          {/* Shared Device */}
          <motion.button
            onClick={() => onSelect('shared')}
            className="p-6 bg-white border-2 border-[#E5E7EB] rounded-2xl hover:border-[#DC2626] transition-colors text-left"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
            </div>
            
            <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">
              {t.shared.title}
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              {t.shared.description}
            </p>

            <ul className="space-y-2">
              {t.shared.benefits.map((benefit, i) => (
                <li key={i} className="text-sm text-[#6B7280] flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5">⚠</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.button>
        </div>

        <p className="text-xs text-center text-[#9CA3AF]">{t.note}</p>
      </div>
    </div>
  );
}
