/**
 * ModernSplash - First Impression (0-5 seconds)
 * Creates immediate trust through calm motion, clear messaging, and government credibility
 */

import React, { useEffect, useState } from 'react';
import { Heart, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ModernSplashProps {
  onComplete: () => void;
}

export function ModernSplash({ onComplete }: ModernSplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9FF] flex flex-col items-center justify-center p-6">
      {/* Breathing heart animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="relative mb-12"
      >
        {/* Outer pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[#1E88E5] rounded-full"
          style={{ width: '120px', height: '120px', margin: '-10px' }}
        />
        
        {/* Main icon container */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 w-[100px] h-[100px] bg-gradient-to-br from-[#1E88E5] to-[#1976D2] rounded-full flex items-center justify-center shadow-xl"
        >
          <Heart className="w-12 h-12 text-white fill-white" />
        </motion.div>
      </motion.div>

      {/* App name and tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-[#1A1D23] mb-2 tracking-tight">
          AfyaCare Tanzania
        </h1>
        <p className="text-lg text-[#6B7280]">
          Huduma za Afya Zinazotegemewa
        </p>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Trusted Healthcare Services
        </p>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-6 mb-12"
      >
        <TrustBadge
          icon={<Shield className="w-4 h-4" />}
          text="MoH Certified"
        />
        <TrustBadge
          icon={<CheckCircle2 className="w-4 h-4" />}
          text="TMDA Compliant"
        />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-64"
      >
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1E88E5] to-[#43A047]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
        <p className="text-xs text-center text-[#9CA3AF] mt-3">
          Initializing secure connection...
        </p>
      </motion.div>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFF6FF] rounded-full">
      <span className="text-[#1976D2]">{icon}</span>
      <span className="text-sm font-medium text-[#1976D2]">{text}</span>
    </div>
  );
}