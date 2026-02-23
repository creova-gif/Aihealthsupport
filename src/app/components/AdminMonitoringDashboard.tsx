/**
 * Admin Monitoring Dashboard
 * 
 * Real-time metrics for MoH administrators and pilot coordinators
 * Shows anonymized usage data, performance metrics, and system health
 * 
 * COMPLIANCE:
 * - No PII displayed
 * - All data anonymized
 * - Export capability for analysis
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Heart,
  MapPin,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  getStoredMetrics,
  clearStoredMetrics,
  exportMetrics,
  trackPageView,
} from '@/app/utils/monitoring';

interface AdminMonitoringDashboardProps {
  onBack: () => void;
  language: 'sw' | 'en';
}

const translations = {
  sw: {
    title: 'Dashibodi ya Ufuatiliaji',
    subtitle: 'Takwimu na Ufuatiliaji wa Mfumo',
    overview: 'Muhtasari',
    errors: 'Makosa',
    performance: 'Utendaji',
    features: 'Matumizi ya Vipengele',
    medical: 'Takwimu za Kiafya',
    export: 'Pakua Data',
    clear: 'Futa Historia',
    refresh: 'Sasisha',
    back: 'Rudi',
    
    // Stats
    totalUsers: 'Watumiaji Jumla',
    activeToday: 'Wanaotumia Leo',
    totalErrors: 'Makosa',
    avgResponseTime: 'Muda wa Majibu',
    
    // Features
    symptomChecks: 'Angalizi ya Dalili',
    appointments: 'Miadi',
    medications: 'Dawa',
    facilities: 'Vituo',
    routes: 'Njia za CHW',
    
    // Medical
    adherenceRate: 'Kiwango cha Kuzingatia Dawa',
    highRiskPatients: 'Wagonjwa Hatari',
    disclaimersShown: 'Maonyo Yaliyoonyeshwa',
    
    // Performance
    avgLoadTime: 'Muda wa Kupakia',
    offlineUsage: 'Matumizi bila Mtandao',
    
    // Actions
    lastUpdated: 'Imesasishwa',
    noData: 'Hakuna data bado',
    dataCleared: 'Data imefutwa',
    dataExported: 'Data imepakuliwa',
    
    // Chart labels
    last7Days: 'Siku 7 Zilizopita',
    today: 'Leo',
    thisWeek: 'Wiki Hii',
    thisMonth: 'Mwezi Huu',
  },
  en: {
    title: 'Monitoring Dashboard',
    subtitle: 'System Analytics & Tracking',
    overview: 'Overview',
    errors: 'Errors',
    performance: 'Performance',
    features: 'Feature Usage',
    medical: 'Medical Metrics',
    export: 'Export Data',
    clear: 'Clear History',
    refresh: 'Refresh',
    back: 'Back',
    
    // Stats
    totalUsers: 'Total Users',
    activeToday: 'Active Today',
    totalErrors: 'Errors',
    avgResponseTime: 'Avg Response Time',
    
    // Features
    symptomChecks: 'Symptom Checks',
    appointments: 'Appointments',
    medications: 'Medications',
    facilities: 'Facilities',
    routes: 'CHW Routes',
    
    // Medical
    adherenceRate: 'Adherence Rate',
    highRiskPatients: 'High-Risk Patients',
    disclaimersShown: 'Disclaimers Shown',
    
    // Performance
    avgLoadTime: 'Avg Load Time',
    offlineUsage: 'Offline Usage',
    
    // Actions
    lastUpdated: 'Last updated',
    noData: 'No data yet',
    dataCleared: 'Data cleared',
    dataExported: 'Data exported',
    
    // Chart labels
    last7Days: 'Last 7 Days',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },
};

export function AdminMonitoringDashboard({ onBack, language }: AdminMonitoringDashboardProps) {
  const t = translations[language];
  const [metrics, setMetrics] = useState(getStoredMetrics());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    trackPageView('/admin/monitoring', 'admin');
  }, []);

  const handleRefresh = () => {
    setMetrics(getStoredMetrics());
    setLastUpdated(new Date());
  };

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afyacare-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (showClearConfirm) {
      clearStoredMetrics();
      setMetrics(getStoredMetrics());
      setShowClearConfirm(false);
      setLastUpdated(new Date());
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  // Calculate statistics
  const stats = {
    totalPageViews: metrics.pageViews.length,
    totalErrors: metrics.errors.length,
    totalDisclaimers: metrics.disclaimers.length,
    totalSymptomChecks: metrics.symptomChecks.length,
    totalAppointments: metrics.appointments.length,
    totalMedications: metrics.adherence.length,
    totalFacilitySearches: metrics.facilitySearches.length,
    totalRoutes: metrics.routes.length,
    
    // Performance
    avgPerformance: metrics.performance.length > 0
      ? Math.round(
          metrics.performance.reduce((sum, p) => sum + p.duration, 0) / metrics.performance.length
        )
      : 0,
      
    // Medical
    avgAdherence: metrics.adherence.length > 0
      ? Math.round(
          metrics.adherence.reduce((sum, a) => sum + a.adherenceRate, 0) / metrics.adherence.length
        )
      : 0,
      
    // Recent activity (last 24 hours)
    recentPageViews: metrics.pageViews.filter(
      (pv) => Date.now() - pv.timestamp < 24 * 60 * 60 * 1000
    ).length,
    
    recentErrors: metrics.errors.filter(
      (e) => Date.now() - e.timestamp < 24 * 60 * 60 * 1000
    ).length,
  };

  // Feature usage breakdown
  const featureUsage = metrics.featureUsage.reduce((acc, usage) => {
    const key = usage.feature;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.refresh}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {t.export}
            </Button>
            <Button
              variant={showClearConfirm ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleClear}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {showClearConfirm ? 'Confirm?' : t.clear}
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-gray-500 mb-6">
          {t.lastUpdated}: {lastUpdated.toLocaleString(language === 'sw' ? 'sw-TZ' : 'en-US')}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t.totalUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPageViews}</div>
              <div className="text-sm text-green-600 mt-1">
                +{stats.recentPageViews} {t.today}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.totalErrors}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.totalErrors}</div>
              <div className="text-sm text-gray-600 mt-1">
                {stats.recentErrors} {t.today}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {t.avgResponseTime}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.avgPerformance}
                <span className="text-lg">ms</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stats.avgPerformance < 100 ? '🟢 Excellent' : stats.avgPerformance < 300 ? '🟡 Good' : '🔴 Slow'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {t.adherenceRate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.avgAdherence}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stats.totalMedications} records
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.features}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalSymptomChecks}</div>
                <div className="text-sm text-gray-600">{t.symptomChecks}</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <div className="text-sm text-gray-600">{t.appointments}</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Heart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{stats.totalMedications}</div>
                <div className="text-sm text-gray-600">{t.medications}</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{stats.totalFacilitySearches}</div>
                <div className="text-sm text-gray-600">{t.facilities}</div>
              </div>

              <div className="text-center p-4 bg-cyan-50 rounded-xl">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                <div className="text-2xl font-bold">{stats.totalRoutes}</div>
                <div className="text-sm text-gray-600">{t.routes}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Compliance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t.disclaimersShown}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {metrics.disclaimers.slice(-3).map((disclaimer, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold capitalize">{disclaimer.tool}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(disclaimer.timestamp).toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US')}
                  </div>
                </div>
              ))}
              {metrics.disclaimers.length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  {t.noData}
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Total: {stats.totalDisclaimers} disclaimers shown
            </div>
          </CardContent>
        </Card>

        {/* Recent Errors */}
        {stats.totalErrors > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Recent Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.errors.slice(-5).reverse().map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-red-800">{error.message}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {error.route} • {error.userRole} • {new Date(error.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t.performance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.performance.slice(-10).reverse().map((perf, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{perf.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(perf.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={perf.duration < 100 ? 'default' : perf.duration < 300 ? 'secondary' : 'destructive'}>
                      {perf.duration}ms
                    </Badge>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {metrics.performance.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {t.noData}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
