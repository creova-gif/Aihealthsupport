import React, { useState } from 'react';
import {
  Watch,
  Smartphone,
  Activity,
  Heart,
  TrendingUp,
  CheckCircle2,
  Zap,
  Moon,
  Footprints,
  ChevronRight,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

const translations = {
  sw: {
    title: 'Unganisha Kifaa Chako',
    subtitle: 'Fuatilia afya yako kiotomatiki',
    benefits: {
      title: 'Faida za Kuunganisha',
      auto: 'Ufuatiliaji wa kiotomatiki',
      autoDesc: 'Hakuna haja ya kuweka kwa mkono',
      insights: 'Ufahamu wa AI',
      insightsDesc: 'Upate mapendekezo ya kibinafsi',
      complete: 'Historia kamili',
      completeDesc: 'Data yako yote mahali pamoja',
    },
    devices: {
      title: 'Vifaa vinavyoungwa mkono',
      fitbit: 'Fitbit',
      appleWatch: 'Apple Watch',
      garmin: 'Garmin',
      samsung: 'Samsung Health',
      xiaomi: 'Mi Band',
      googleFit: 'Google Fit',
    },
    metrics: {
      title: 'Utafuatilia nini',
      steps: 'Hatua',
      heartRate: 'Mapigo ya Moyo',
      sleep: 'Usingizi',
      calories: 'Kalori',
      distance: 'Umbali',
      activity: 'Mazoezi',
    },
    connect: 'Unganisha',
    connecting: 'Inaunganisha...',
    connected: 'Imeunganishwa!',
    skip: 'Ruka kwa sasa',
    continue: 'Endelea',
    syncing: 'Inasawazisha data...',
    syncComplete: 'Usawazishaji umekamilika!',
    dataPoints: 'pointi za data',
  },
  en: {
    title: 'Connect Your Device',
    subtitle: 'Track your health automatically',
    benefits: {
      title: 'Benefits of Connecting',
      auto: 'Automatic Tracking',
      autoDesc: 'No manual entry needed',
      insights: 'AI Insights',
      insightsDesc: 'Get personalized recommendations',
      complete: 'Complete History',
      completeDesc: 'All your data in one place',
    },
    devices: {
      title: 'Supported Devices',
      fitbit: 'Fitbit',
      appleWatch: 'Apple Watch',
      garmin: 'Garmin',
      samsung: 'Samsung Health',
      xiaomi: 'Mi Band',
      googleFit: 'Google Fit',
    },
    metrics: {
      title: 'What you\'ll track',
      steps: 'Steps',
      heartRate: 'Heart Rate',
      sleep: 'Sleep',
      calories: 'Calories',
      distance: 'Distance',
      activity: 'Activity',
    },
    connect: 'Connect',
    connecting: 'Connecting...',
    connected: 'Connected!',
    skip: 'Skip for now',
    continue: 'Continue',
    syncing: 'Syncing data...',
    syncComplete: 'Sync complete!',
    dataPoints: 'data points',
  },
};

interface WearableSyncProps {
  onComplete: (data: { device?: string; synced: boolean }) => void;
  language: 'sw' | 'en';
}

export function WearableSync({ onComplete, language }: WearableSyncProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const t = translations[language];

  const devices = [
    {
      id: 'fitbit',
      name: t.devices.fitbit,
      icon: Watch,
      color: 'from-teal-500 to-teal-600',
      logo: '⌚',
    },
    {
      id: 'apple',
      name: t.devices.appleWatch,
      icon: Watch,
      color: 'from-gray-700 to-gray-900',
      logo: '🍎',
    },
    {
      id: 'garmin',
      name: t.devices.garmin,
      icon: Watch,
      color: 'from-blue-500 to-blue-600',
      logo: '🏃',
    },
    {
      id: 'samsung',
      name: t.devices.samsung,
      icon: Smartphone,
      color: 'from-blue-400 to-blue-500',
      logo: '📱',
    },
    {
      id: 'xiaomi',
      name: t.devices.xiaomi,
      icon: Watch,
      color: 'from-orange-500 to-orange-600',
      logo: '⌚',
    },
    {
      id: 'google',
      name: t.devices.googleFit,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      logo: '🏃',
    },
  ];

  const metrics = [
    { id: 'steps', icon: Footprints, label: t.metrics.steps, value: '8,547' },
    { id: 'heart', icon: Heart, label: t.metrics.heartRate, value: '72 bpm' },
    { id: 'sleep', icon: Moon, label: t.metrics.sleep, value: '7.5h' },
    { id: 'calories', icon: Zap, label: t.metrics.calories, value: '1,842' },
    { id: 'distance', icon: TrendingUp, label: t.metrics.distance, value: '6.2 km' },
    { id: 'activity', icon: Activity, label: t.metrics.activity, value: '45 min' },
  ];

  const benefits = [
    {
      icon: RefreshCw,
      title: t.benefits.auto,
      description: t.benefits.autoDesc,
    },
    {
      icon: Zap,
      title: t.benefits.insights,
      description: t.benefits.insightsDesc,
    },
    {
      icon: TrendingUp,
      title: t.benefits.complete,
      description: t.benefits.completeDesc,
    },
  ];

  const handleConnect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setIsSyncing(true);

      // Simulate sync progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSyncProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
        }
      }, 300);
    }, 2000);
  };

  const handleContinue = () => {
    onComplete({
      device: selectedDevice || undefined,
      synced: isConnected,
    });
  };

  const handleSkip = () => {
    onComplete({
      synced: false,
    });
  };

  if (isConnected && !isSyncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--onboarding-bg)' }}>
        <div className="max-w-2xl w-full text-center">
          {/* Success Animation */}
          <div className="bounce-in mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 relative"
              style={{ background: 'var(--gradient-success)' }}
            >
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.connected}
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {t.syncComplete}
            </p>
          </div>

          {/* Synced Data Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: 'var(--onboarding-text-primary)' }}>
                {language === 'sw' ? 'Data iliyosawazishwa' : 'Synced Data'}
              </h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--onboarding-secondary)' }}>
                <CheckCircle2 className="h-5 w-5" />
                <span>2,847 {t.dataPoints}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.id}
                    className="p-4 rounded-xl"
                    style={{ background: 'var(--onboarding-bg)' }}
                  >
                    <Icon className="h-6 w-6 mb-2" style={{ color: 'var(--onboarding-primary)' }} />
                    <p className="text-xs mb-1" style={{ color: 'var(--onboarding-text-secondary)' }}>
                      {metric.label}
                    </p>
                    <p className="text-xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                      {metric.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full max-w-md py-5 rounded-2xl font-semibold text-white transition-all hover:shadow-xl"
            style={{ background: 'var(--gradient-action)' }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">{t.continue}</span>
              <ChevronRight className="h-6 w-6" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--onboarding-bg)' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" />
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-trust)' }}
            >
              <RefreshCw className="h-12 w-12 text-white animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--onboarding-text-primary)' }}>
            {t.syncing}
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--onboarding-text-secondary)' }}>
            {language === 'sw'
              ? 'Tunaleta data yako ya afya...'
              : 'Fetching your health data...'}
          </p>

          <div className="space-y-2 mb-4">
            <Progress value={syncProgress} className="h-3" />
            <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
              {syncProgress}% {language === 'sw' ? 'imekamilika' : 'complete'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--onboarding-bg)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Watch className="h-8 w-8" style={{ color: 'var(--onboarding-primary)' }} />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--onboarding-text-primary)' }}>
                {t.title}
              </h1>
              <p className="text-lg" style={{ color: 'var(--onboarding-text-secondary)' }}>
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.benefits.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl border-2 border-gray-200"
                  >
                    <Icon className="h-8 w-8 mb-3" style={{ color: 'var(--onboarding-secondary)' }} />
                    <h3 className="font-bold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                      {benefit.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--onboarding-text-secondary)' }}>
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Devices */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.devices.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {devices.map((device) => {
                const Icon = device.icon;
                const isSelected = selectedDevice === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => !isConnecting && handleConnect(device.id)}
                    disabled={isConnecting}
                    className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                      isSelected && isConnecting
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    } ${isConnecting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">{device.logo}</div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--onboarding-text-primary)' }}>
                        {device.name}
                      </h3>
                      {isSelected && isConnecting ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{t.connecting}</span>
                        </div>
                      ) : (
                        <div
                          className="text-sm font-medium"
                          style={{ color: 'var(--onboarding-primary)' }}
                        >
                          {t.connect}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* What You'll Track */}
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--onboarding-text-primary)' }}>
              {t.metrics.title}
            </h2>
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.id} className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: 'var(--onboarding-primary-bg)' }}
                      >
                        <Icon className="h-5 w-5" style={{ color: 'var(--onboarding-primary)' }} />
                      </div>
                      <span className="font-medium" style={{ color: 'var(--onboarding-text-primary)' }}>
                        {metric.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            disabled={isConnecting}
            className="px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--onboarding-text-secondary)' }}
          >
            {t.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
