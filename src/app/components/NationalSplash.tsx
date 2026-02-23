/**
 * NationalSplash - Institutional Entry
 * 
 * DESIGN PRINCIPLES:
 * - Government branding
 * - No flashy animations
 * - Simple fade-in (200ms)
 * - Professional
 * - Tanzania identity
 */

import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';
import { colors } from '@/app/design-system';

interface NationalSplashProps {
  onComplete: () => void;
}

export function NationalSplash({ onComplete }: NationalSplashProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500); // Reduced to 1.5s for faster testing
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: colors.primary[500] }}
    >
      {/* Ministry Logo */}
      <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
        <Shield className="w-12 h-12 text-white" strokeWidth={2} />
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-semibold text-white mb-2">
        AfyaCare Tanzania
      </h1>

      {/* Government Attribution */}
      <p className="text-sm text-white/80">
        Ministry of Health
      </p>

      {/* Version */}
      <p className="text-xs text-white/60 mt-8">
        Version 1.0.0
      </p>
    </div>
  );
}