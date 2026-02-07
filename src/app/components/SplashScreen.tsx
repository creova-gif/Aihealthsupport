import React, { useEffect, useState } from 'react';
import { Shield, Heart } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth loading animation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo & Shield */}
        <div className="mb-8 relative">
          <div className="inline-block relative">
            <Shield
              className="h-24 w-24 mx-auto mb-4"
              style={{ color: '#0F9D58' }}
              strokeWidth={1.5}
            />
            {/* Heartbeat pulse animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart
                className="h-12 w-12 animate-pulse"
                style={{ color: '#DC2626' }}
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl mb-2" style={{ color: '#0F9D58' }}>
          AfyaAI Tanzania
        </h1>
        <p className="text-xl mb-6" style={{ color: '#6B7280' }}>
          Afya Bora kwa Kila Mtanzania
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Badge className="text-sm px-3 py-1" style={{ backgroundColor: '#0F9D58' }}>
            <Shield className="h-3 w-3 mr-1" />
            Wizara ya Afya
          </Badge>
          <Badge className="text-sm px-3 py-1" style={{ backgroundColor: '#1C4ED8' }}>
            TMDA Certified
          </Badge>
        </div>

        {/* AI Disclaimer - Calm, Clinical Tone */}
        <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-6 border" style={{ borderColor: '#0F9D58' }}>
          <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
            <strong>AI inasaidia madaktari</strong>
            <br />
            <span className="text-sm">Haibadilishi huduma ya afya</span>
          </p>
        </div>

        {/* Data Privacy Reassurance */}
        <div className="text-sm mb-8" style={{ color: '#6B7280' }}>
          🔒 Taarifa zako zimefichwa na salama
          <br />
          ✓ Kufuata PDPA Tanzania
        </div>

        {/* Loading Progress Bar - Heartbeat Style */}
        <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-out rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: '#0F9D58',
              boxShadow: '0 0 10px rgba(15, 157, 88, 0.5)',
            }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-xs mt-3 animate-pulse" style={{ color: '#6B7280' }}>
          Inapakia...
        </p>
      </div>
    </div>
  );
}
