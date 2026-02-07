import React, { useState, useEffect } from 'react';
import {
  Activity,
  Baby,
  Heart,
  MessageSquare,
  Calendar,
  Bell,
  ChevronRight,
  AlertCircle,
  WifiOff,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Clock,
  Phone,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    welcome: 'Karibu',
    offline: 'Bila Mtandao',
    symptoms: 'Nina Dalili',
    symptomsDesc: 'Angalia dalili zako',
    maternal: 'Mama & Mtoto',
    maternalDesc: 'Ufuatiliaji wa mimba',
    ncds: 'Magonjwa Sugu',
    ncdsDesc: 'Shinikizo, kisukari',
    telemedicine: 'Ongea na Daktari',
    telemedicineDesc: 'Mazungumzo na daktari',
    reminders: 'Kumbusho',
    health: 'Afya Yako',
    aiSuggestion: 'Mapendekezo ya AI',
    whyAI: 'Kwa nini?',
    checkupNeeded: 'Ukaguzi unahitajika',
    seeAll: 'Angalia yote',
    nearestFacility: 'Kituo cha Karibu',
    emergency: 'Dharura: 112',
    getDirections: 'Pata Maelekezo',
    bloodPressure: 'Shinikizo la Damu',
    weight: 'Uzito',
    lastSynced: 'Ilisasishwa',
    aiConfidence: 'Kuaminika',
    tapToExplain: 'Gusa ili kueleza',
  },
  en: {
    welcome: 'Welcome',
    offline: 'Offline',
    symptoms: 'I Have Symptoms',
    symptomsDesc: 'Check your symptoms',
    maternal: 'Maternal & Child',
    maternalDesc: 'Pregnancy tracking',
    ncds: 'Chronic Diseases',
    ncdsDesc: 'Hypertension, diabetes',
    telemedicine: 'Talk to Doctor',
    telemedicineDesc: 'Chat with doctor',
    reminders: 'Reminders',
    health: 'Your Health',
    aiSuggestion: 'AI Suggestion',
    whyAI: 'Why?',
    checkupNeeded: 'Checkup needed',
    seeAll: 'See all',
    nearestFacility: 'Nearest Facility',
    emergency: 'Emergency: 112',
    getDirections: 'Get Directions',
    bloodPressure: 'Blood Pressure',
    weight: 'Weight',
    lastSynced: 'Last synced',
    aiConfidence: 'Confidence',
    tapToExplain: 'Tap to explain',
  },
};

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export function PatientDashboard({ onNavigate }: DashboardProps) {
  const { language, isOffline, userData } = useApp();
  const t = translations[language];
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  // Primary action cards - Apple Health inspired
  const primaryActions = [
    {
      id: 'symptoms',
      icon: Activity,
      title: t.symptoms,
      description: t.symptomsDesc,
      gradient: 'from-red-500 to-red-600',
      route: 'symptom-checker',
    },
    {
      id: 'maternal',
      icon: Baby,
      title: t.maternal,
      description: t.maternalDesc,
      gradient: 'from-pink-500 to-pink-600',
      route: 'maternal',
    },
    {
      id: 'ncds',
      icon: Heart,
      title: t.ncds,
      description: t.ncdsDesc,
      gradient: 'from-purple-500 to-purple-600',
      route: 'ncds',
    },
    {
      id: 'telemedicine',
      icon: MessageSquare,
      title: t.telemedicine,
      description: t.telemedicineDesc,
      gradient: 'from-blue-500 to-blue-600',
      route: 'telemedicine',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: '#0F9D58' }}>
                {t.welcome}, {userData?.name || 'Mgonjwa'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{userData?.region || 'Dar es Salaam'}</span>
              </div>
            </div>
            {isOffline && (
              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                <WifiOff className="h-3 w-3 mr-1" />
                {t.offline}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* AI Suggestion Banner - Subtle, never alarming */}
        <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-green-50 overflow-hidden relative">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-100">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">{t.aiSuggestion}</h3>
                  <Badge className="bg-green-500 text-white text-xs">
                    {t.aiConfidence}: 75%
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{t.checkupNeeded}</p>
                <button
                  onClick={() => setShowAIExplanation(!showAIExplanation)}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <AlertCircle className="h-4 w-4" />
                  {t.whyAI}
                </button>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
            </div>

            {/* AI Explanation - Expandable */}
            {showAIExplanation && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {language === 'sw'
                    ? 'Kwa kuwa hukutembelea kliniki kwa miezi 6, AI inapendekeza ukaguzi wa kawaida. Hii ni kwa ajili ya kuhakikisha afya yako iko sawa.'
                    : "Since you haven't visited a clinic in 6 months, AI suggests a routine checkup. This is to ensure your health is on track."}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {t.lastSynced}: 2 {language === 'sw' ? 'masaa' : 'hours'}{' '}
                  {language === 'sw' ? 'iliyopita' : 'ago'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Primary Action Cards - Large, Visual, 1-2 actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.route)}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`h-48 bg-gradient-to-br ${action.gradient} p-6 flex flex-col justify-between`}>
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/60 group-hover:text-white/100 transition-colors" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-white/80">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Health Summary Cards - Apple Health style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reminders Card */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" style={{ color: '#F59E0B' }} />
                  <h3 className="font-semibold text-gray-900">{t.reminders}</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {t.seeAll}
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'sw' ? 'Dawa za asubuhi' : 'Morning medication'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">8:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'sw' ? 'Miadi ya kliniki' : 'Clinic appointment'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'sw' ? 'Jumatatu' : 'Monday'}, 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Vitals Card */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: '#0F9D58' }} />
                  <h3 className="font-semibold text-gray-900">{t.health}</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t.bloodPressure}</span>
                    <span className="text-sm font-semibold text-green-600">120/80</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t.weight}</span>
                    <span className="text-sm font-semibold text-blue-600">68 kg</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nearest Facility Card */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{t.nearestFacility}</h3>
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">Mwananyamala Hospital</p>
                <p className="text-sm text-gray-500">2.3 km {language === 'sw' ? 'mbali' : 'away'}</p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <MapPin className="h-4 w-4 mr-2" />
                {t.getDirections}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Button - Large, Prominent, Never Scary */}
        <button
          onClick={() => (window.location.href = 'tel:112')}
          className="w-full py-6 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          <Phone className="h-6 w-6" />
          <span className="text-xl font-semibold">{t.emergency}</span>
        </button>

        {/* Bottom spacing for navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}
