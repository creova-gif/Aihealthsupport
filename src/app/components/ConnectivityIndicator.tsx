/**
 * ConnectivityIndicator - Tanzania Network Reality
 * 
 * Shows connectivity status for offline-first design
 */

import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { colors } from '@/app/design-system';

interface ConnectivityIndicatorProps {
  isOnline: boolean;
  language: 'sw' | 'en';
}

export function ConnectivityIndicator({ isOnline, language }: ConnectivityIndicatorProps) {
  if (isOnline) return null;

  const content = {
    sw: 'Nje ya mtandao',
    en: 'Offline',
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-[#FEF2F2] border-2 rounded-lg text-sm font-medium"
      style={{
        borderColor: colors.danger[500],
        color: colors.danger[700],
      }}
    >
      <WifiOff className="w-4 h-4" />
      <span>{content[language]}</span>
    </div>
  );
}
