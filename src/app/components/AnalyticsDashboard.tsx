/**
 * AnalyticsDashboard - Product & Clinical KPIs Monitor
 * Capture UX friction, adoption metrics, clinical KPIs
 * 
 * System Prompt: You are an analytics engine for product & clinical KPIs.
 * Produce daily/weekly dashboards: onboarding completion, USSD usage, CHW sync rate,
 * referral conversion, no-show rate, top friction points (forms with highest abandonment).
 * Provide exportable CSVs and action suggestions.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Smartphone,
  MessageSquare,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';

interface AnalyticsDashboardProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface Metric {
  label: { sw: string; en: string };
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
}

interface FrictionPoint {
  screen: string;
  abandonmentRate: number;
  sessions: number;
  avgTimeSpent: number;
}

export function AnalyticsDashboard({ language, onBack }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [view, setView] = useState<'overview' | 'product' | 'clinical'>('overview');

  const content = {
    sw: {
      title: 'Dashibodi ya Takwimu',
      subtitle: 'Ufuatiliaji wa UX na Afya',
      overview: 'Muhtasari',
      product: 'Bidhaa',
      clinical: 'Kliniki',
      last7Days: 'Siku 7 zilizopita',
      last30Days: 'Siku 30 zilizopita',
      last90Days: 'Siku 90 zilizopita',
      exportCSV: 'Pakua CSV',
      refresh: 'Onyesha Upya',
      totalUsers: 'Watumiaji Jumla',
      activeUsers: 'Watumiaji Hai',
      onboardingCompletion: 'Kukamilisha Kuanzisha',
      avgSessionTime: 'Wastani wa Muda wa Kipindi',
      ussdSessions: 'Vipindi vya USSD',
      chwSyncRate: 'Kiwango cha CHW Sync',
      referralConversion: 'Kubadilisha Rufaa',
      noShowRate: 'Kiwango cha Kutokuja',
      appointmentsMade: 'Miadi Iliyopangwa',
      symptomsChecked: 'Dalili Zilichaguliwa',
      medicationTracking: 'Ufuatiliaji wa Dawa',
      recordsViewed: 'Rekodi Zilizoonwa',
      frictionPoints: 'Nukta za Mkazo',
      topAbandonment: 'Skrini za Kuachwa Zaidi',
      avgTimeSpent: 'Wastani wa Muda',
      sessions: 'Vipindi',
      abandonmentRate: 'Kiwango cha Kuachwa',
      recommendations: 'Mapendekezo',
      minutes: 'dakika',
      seconds: 'sekunde',
    },
    en: {
      title: 'Analytics Dashboard',
      subtitle: 'UX & Clinical Monitoring',
      overview: 'Overview',
      product: 'Product',
      clinical: 'Clinical',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      exportCSV: 'Export CSV',
      refresh: 'Refresh',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      onboardingCompletion: 'Onboarding Completion',
      avgSessionTime: 'Avg Session Time',
      ussdSessions: 'USSD Sessions',
      chwSyncRate: 'CHW Sync Rate',
      referralConversion: 'Referral Conversion',
      noShowRate: 'No-Show Rate',
      appointmentsMade: 'Appointments Made',
      symptomsChecked: 'Symptoms Checked',
      medicationTracking: 'Medication Tracking',
      recordsViewed: 'Records Viewed',
      frictionPoints: 'Friction Points',
      topAbandonment: 'Top Abandonment Screens',
      avgTimeSpent: 'Avg Time Spent',
      sessions: 'Sessions',
      abandonmentRate: 'Abandonment Rate',
      recommendations: 'Recommendations',
      minutes: 'minutes',
      seconds: 'seconds',
    },
  };

  const t = content[language];

  // Mock analytics data
  const overviewMetrics: Metric[] = [
    {
      label: { sw: t.totalUsers, en: 'Total Users' },
      value: '12,458',
      change: 15.3,
      trend: 'up',
    },
    {
      label: { sw: t.activeUsers, en: 'Active Users (7d)' },
      value: '8,234',
      change: 8.2,
      trend: 'up',
    },
    {
      label: { sw: t.onboardingCompletion, en: 'Onboarding Completion' },
      value: '82%',
      change: 12.5,
      trend: 'up',
      target: 85,
    },
    {
      label: { sw: t.avgSessionTime, en: 'Avg Session Time' },
      value: '4:32',
      change: -5.1,
      trend: 'down',
    },
  ];

  const productMetrics: Metric[] = [
    {
      label: { sw: t.ussdSessions, en: 'USSD Sessions' },
      value: '3,421',
      change: 22.4,
      trend: 'up',
    },
    {
      label: { sw: t.symptomsChecked, en: 'Symptoms Checked' },
      value: '5,892',
      change: 18.7,
      trend: 'up',
    },
    {
      label: { sw: t.appointmentsMade, en: 'Appointments Made' },
      value: '2,156',
      change: 9.3,
      trend: 'up',
    },
    {
      label: { sw: t.medicationTracking, en: 'Medication Tracking' },
      value: '1,834',
      change: 15.2,
      trend: 'up',
    },
    {
      label: { sw: t.recordsViewed, en: 'Records Viewed' },
      value: '4,721',
      change: 6.8,
      trend: 'up',
    },
  ];

  const clinicalMetrics: Metric[] = [
    {
      label: { sw: t.chwSyncRate, en: 'CHW Sync Rate' },
      value: '94%',
      change: 3.2,
      trend: 'up',
      target: 95,
    },
    {
      label: { sw: t.referralConversion, en: 'Referral Conversion' },
      value: '76%',
      change: -2.1,
      trend: 'down',
      target: 80,
    },
    {
      label: { sw: t.noShowRate, en: 'No-Show Rate' },
      value: '12%',
      change: -8.5,
      trend: 'up',
      target: 10,
    },
  ];

  const frictionPoints: FrictionPoint[] = [
    {
      screen: language === 'sw' ? 'Fomu ya Kuanzisha - Ridhaa' : 'Onboarding - Consent',
      abandonmentRate: 24,
      sessions: 1456,
      avgTimeSpent: 45,
    },
    {
      screen: language === 'sw' ? 'Tathmini ya Dalili - Swali 4' : 'Symptom Checker - Question 4',
      abandonmentRate: 18,
      sessions: 892,
      avgTimeSpent: 32,
    },
    {
      screen: language === 'sw' ? 'Kupanga Miadi - Chagua Tarehe' : 'Appointments - Date Selection',
      abandonmentRate: 15,
      sessions: 734,
      avgTimeSpent: 28,
    },
    {
      screen: language === 'sw' ? 'Dawa - Ongeza Mpya' : 'Medications - Add New',
      abandonmentRate: 12,
      sessions: 567,
      avgTimeSpent: 38,
    },
  ];

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const MetricCard = ({ metric }: { metric: Metric }) => {
    const TrendIcon = getTrendIcon(metric.trend);
    const trendColor = getTrendColor(metric.trend);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6"
      >
        <p className="text-sm text-[#6B7280] mb-2">{metric.label[language]}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-[#1A1D23]">{metric.value}</p>
            {metric.change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
                <span className="text-sm font-medium" style={{ color: trendColor }}>
                  {metric.change > 0 ? '+' : ''}
                  {metric.change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {metric.target !== undefined && (
            <div className="text-right">
              <p className="text-xs text-[#6B7280]">
                {language === 'sw' ? 'Lengo' : 'Target'}
              </p>
              <p className="text-sm font-semibold text-[#1A1D23]">{metric.target}%</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'sw' ? 'Rudi' : 'Back'}
            </span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8" />
                <h1 className="text-3xl font-bold">{t.title}</h1>
              </div>
              <p className="text-white/90 text-base">{t.subtitle}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => alert(language === 'sw' ? 'Inapakia...' : 'Exporting...')}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <Download className="w-5 h-5 mr-2" />
                {t.exportCSV}
              </Button>
              <Button
                onClick={() => alert(language === 'sw' ? 'Inaonyesha upya...' : 'Refreshing...')}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t.refresh}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* View Tabs */}
            <div className="flex gap-2">
              {(['overview', 'product', 'clinical'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === tab
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {t[tab]}
                </button>
              ))}
            </div>

            {/* Time Range */}
            <div className="flex gap-2 ml-auto">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-[#F3F4F6] text-[#1A1D23]'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {range === '7d' ? t.last7Days : range === '30d' ? t.last30Days : t.last90Days}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {view === 'overview' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {overviewMetrics.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </div>

            {/* Friction Points */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">
                {t.frictionPoints}
              </h2>
              
              <div className="space-y-4">
                {frictionPoints.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 p-4 bg-[#FAFBFC] rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[#1A1D23] mb-1">
                        {point.screen}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span>{point.sessions} {t.sessions}</span>
                        <span>
                          {point.avgTimeSpent}s {t.avgTimeSpent}
                        </span>
                      </div>
                    </div>
                    
                    {/* Abandonment Rate */}
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{
                          color: point.abandonmentRate > 20 ? '#EF4444' : point.abandonmentRate > 15 ? '#F59E0B' : '#10B981',
                        }}
                      >
                        {point.abandonmentRate}%
                      </p>
                      <p className="text-xs text-[#6B7280]">{t.abandonmentRate}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-24">
                      <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${point.abandonmentRate}%`,
                            backgroundColor: point.abandonmentRate > 20 ? '#EF4444' : point.abandonmentRate > 15 ? '#F59E0B' : '#10B981',
                          }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </motion.div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-6 p-4 bg-[#EFF6FF] rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1D23] mb-2">
                      {t.recommendations}
                    </h3>
                    <ul className="space-y-1 text-sm text-[#1E40AF]">
                      <li>
                        •{' '}
                        {language === 'sw'
                          ? 'Rahisisha fomu ya ridhaa - fumbe ndefu sana'
                          : 'Simplify consent form - too many fields'}
                      </li>
                      <li>
                        •{' '}
                        {language === 'sw'
                          ? 'Ongeza maelezo ya hatua 4 katika tathmini ya dalili'
                          : 'Add tooltip to step 4 in symptom checker'}
                      </li>
                      <li>
                        •{' '}
                        {language === 'sw'
                          ? 'Onyesha tarehe zinazopatikana mapema zaidi'
                          : 'Show available dates earlier in appointment flow'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'product' && (
          <div className="grid grid-cols-3 gap-6">
            {productMetrics.map((metric, idx) => (
              <MetricCard key={idx} metric={metric} />
            ))}
          </div>
        )}

        {view === 'clinical' && (
          <div className="grid grid-cols-3 gap-6">
            {clinicalMetrics.map((metric, idx) => (
              <MetricCard key={idx} metric={metric} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
