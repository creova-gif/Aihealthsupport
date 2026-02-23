/**
 * CHWRouteOptimizer - Intelligent route planning for CHW visits
 * Optimizes visit order based on urgency, location, and time
 */

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  ChevronRight,
  Route,
  User,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion } from 'motion/react';

const translations = {
  sw: {
    title: 'Ratibu Ziara',
    subtitle: 'Panga ziara zako kwa ufanisi',
    todayRoute: 'Njia ya Leo',
    optimize: 'Boresha Njia',
    startRoute: 'Anza Ziara',
    totalDistance: 'Umbali Jumla',
    estimatedTime: 'Muda Uliokadiriwa',
    visits: 'Ziara',
    urgent: 'Dharura',
    routine: 'Kawaida',
    visitOrder: 'Mpangilio wa Ziara',
    patient: 'Mgonjwa',
    reason: 'Sababu',
    priority: 'Kipaumbele',
    completed: 'Imekamilika',
    pending: 'Inasubiri',
    markComplete: 'Weka Imekamilika',
    navigate: 'Elekeza',
    optimized: 'Imeboreshwa',
    manual: 'Wewe Mwenyewe',
  },
  en: {
    title: 'Route Planner',
    subtitle: 'Plan your visits efficiently',
    todayRoute: "Today's Route",
    optimize: 'Optimize Route',
    startRoute: 'Start Route',
    totalDistance: 'Total Distance',
    estimatedTime: 'Estimated Time',
    visits: 'Visits',
    urgent: 'Urgent',
    routine: 'Routine',
    visitOrder: 'Visit Order',
    patient: 'Patient',
    reason: 'Reason',
    priority: 'Priority',
    completed: 'Completed',
    pending: 'Pending',
    markComplete: 'Mark Complete',
    navigate: 'Navigate',
    optimized: 'Optimized',
    manual: 'Manual',
  },
};

interface Visit {
  id: string;
  patientName: string;
  address: Record<'sw' | 'en', string>;
  reason: Record<'sw' | 'en', string>;
  priority: 'urgent' | 'routine';
  riskScore: number;
  distance: number; // km from current location
  estimatedDuration: number; // minutes
  latitude: number;
  longitude: number;
  completed: boolean;
}

export function CHWRouteOptimizer({ onBack }: { onBack: () => void }) {
  const { language } = useApp();
  const t = translations[language];
  const [routeMode, setRouteMode] = useState<'optimized' | 'manual'>('optimized');
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: '1',
      patientName: 'Mama Fatuma Hassan',
      address: {
        sw: 'Nyumba ya 45, Mtaa wa Uhuru',
        en: 'House 45, Uhuru Street',
      },
      reason: {
        sw: 'Mimba - homa kwa siku 3',
        en: 'Pregnancy - fever for 3 days',
      },
      priority: 'urgent',
      riskScore: 92,
      distance: 0.5,
      estimatedDuration: 30,
      latitude: -6.7924,
      longitude: 39.2083,
      completed: false,
    },
    {
      id: '2',
      patientName: 'Halima Saleh',
      address: {
        sw: 'Nyumba ya 12, Mtaa wa Amani',
        en: 'House 12, Amani Street',
      },
      reason: {
        sw: 'Mtoto - kuhara na kutapika',
        en: 'Child - diarrhea and vomiting',
      },
      priority: 'urgent',
      riskScore: 88,
      distance: 1.2,
      estimatedDuration: 25,
      latitude: -6.7950,
      longitude: 39.2100,
      completed: false,
    },
    {
      id: '3',
      patientName: 'Juma Ramadhani',
      address: {
        sw: 'Nyumba ya 23, Mtaa wa Mwenge',
        en: 'House 23, Mwenge Street',
      },
      reason: {
        sw: 'Shinikizo la damu - dawa zimekwisha',
        en: 'Hypertension - medication finished',
      },
      priority: 'urgent',
      riskScore: 75,
      distance: 2.1,
      estimatedDuration: 20,
      latitude: -6.8000,
      longitude: 39.2150,
      completed: false,
    },
    {
      id: '4',
      patientName: 'Grace Mwakasege',
      address: {
        sw: 'Nyumba ya 67, Mtaa wa Kariakoo',
        en: 'House 67, Kariakoo Street',
      },
      reason: {
        sw: 'ANC kufuatilia',
        en: 'ANC follow-up',
      },
      priority: 'routine',
      riskScore: 58,
      distance: 0.8,
      estimatedDuration: 15,
      latitude: -6.7880,
      longitude: 39.2050,
      completed: false,
    },
  ]);

  // Calculate route stats
  const urgentVisits = visits.filter((v) => v.priority === 'urgent' && !v.completed);
  const totalDistance = visits.reduce((sum, v) => sum + (v.completed ? 0 : v.distance), 0);
  const totalTime = visits.reduce((sum, v) => sum + (v.completed ? 0 : v.estimatedDuration), 0);

  // Optimize route (simple algorithm: sort by priority then risk score)
  const optimizeRoute = () => {
    const optimized = [...visits].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return b.riskScore - a.riskScore;
    });
    setVisits(optimized);
    setRouteMode('optimized');
  };

  const markComplete = (id: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: true } : v))
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="text-sm font-medium">{language === 'sw' ? 'Rudi' : 'Back'}</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
            <Route className="w-8 h-8 text-blue-600" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">{visits.length}</p>
              <p className="text-xs text-blue-600">{t.visits}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-2xl font-bold text-orange-700">{urgentVisits.length}</p>
              <p className="text-xs text-orange-600">{t.urgent}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <p className="text-2xl font-bold text-green-700">{totalDistance.toFixed(1)}</p>
              <p className="text-xs text-green-600">km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={optimizeRoute}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Zap className="w-5 h-5" />
            {t.optimize}
          </button>

          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Navigation className="w-5 h-5" />
            {t.startRoute}
          </button>
        </div>

        {/* Route Mode Badge */}
        {routeMode === 'optimized' && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              {language === 'sw' ? 'Njia imeboreshwa kwa ufanisi' : 'Route optimized for efficiency'}
            </span>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-64 flex items-center justify-center border-2 border-blue-200 mb-6">
          <div className="text-center">
            <Route className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-blue-900">
              {language === 'sw' ? 'Ramani ya Njia Itaonekana Hapa' : 'Route Map will appear here'}
            </p>
            <p className="text-xs text-blue-700 mt-2">
              {t.totalDistance}: {totalDistance.toFixed(1)} km • {t.estimatedTime}: {totalTime} {t.minutes}
            </p>
          </div>
        </div>

        {/* Visit List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">{t.visitOrder}</h2>

          {visits.map((visit, idx) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-xl border-2 p-5 ${
                visit.completed
                  ? 'border-green-200 opacity-60'
                  : visit.priority === 'urgent'
                  ? 'border-red-200'
                  : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Order Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    visit.completed
                      ? 'bg-green-600'
                      : visit.priority === 'urgent'
                      ? 'bg-red-600'
                      : 'bg-blue-600'
                  }`}
                >
                  {visit.completed ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                </div>

                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{visit.patientName}</h3>
                    {visit.priority === 'urgent' && !visit.completed && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t.urgent}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{visit.address[language]}</p>

                  {/* Reason */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded mb-3">
                    <p className="text-sm text-blue-900">{visit.reason[language]}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-600 mb-1">{t.priority}</p>
                      <p className={`text-sm font-bold ${
                        visit.priority === 'urgent' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {visit.riskScore}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <MapPin className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{visit.distance} km</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <Clock className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{visit.estimatedDuration} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!visit.completed && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${visit.latitude},${visit.longitude}`,
                        '_blank'
                      )
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    {t.navigate}
                  </button>

                  <button
                    onClick={() => markComplete(visit.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t.markComplete}
                  </button>
                </div>
              )}

              {visit.completed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{t.completed}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
