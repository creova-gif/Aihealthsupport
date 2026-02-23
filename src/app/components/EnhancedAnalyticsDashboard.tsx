/**
 * Enhanced Analytics Dashboard
 * 
 * Comprehensive analytics for healthcare platform monitoring
 * 
 * Features:
 * - Real-time user engagement metrics
 * - Clinical outcome tracking
 * - Accessibility usage patterns
 * - Voice assistant effectiveness
 * - Translation quality monitoring
 * - Patient journey completion rates
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    completedJourneys: number;
    avgSessionTime: number;
  };
  engagement: {
    dailyActiveUsers: Array<{ date: string; count: number }>;
    featureUsage: Array<{ name: string; value: number }>;
  };
  accessibility: {
    fontSizeDistribution: Array<{ size: string; percentage: number }>;
    highContrastUsers: number;
    voiceAssistantUsers: number;
    keyboardNavigationUsers: number;
  };
  clinical: {
    symptomCheckCompletions: number;
    appointmentsBooked: number;
    emergencyDetections: number;
    avgTriageTime: number;
  };
  languages: {
    en: number;
    sw: number;
  };
}

interface EnhancedAnalyticsDashboardProps {
  onBack?: () => void;
  language: 'sw' | 'en';
}

export const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  onBack,
  language
}) => {
  const { t } = useTranslation(['common', 'profile']);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Simulate API call - replace with actual analytics API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    setData({
      overview: {
        totalUsers: 15234,
        activeUsers: 8921,
        completedJourneys: 3456,
        avgSessionTime: 847 // seconds
      },
      engagement: {
        dailyActiveUsers: [
          { date: '2026-02-17', count: 1200 },
          { date: '2026-02-18', count: 1450 },
          { date: '2026-02-19', count: 1380 },
          { date: '2026-02-20', count: 1620 },
          { date: '2026-02-21', count: 1890 },
          { date: '2026-02-22', count: 1750 },
          { date: '2026-02-23', count: 1920 }
        ],
        featureUsage: [
          { name: 'Symptom Checker', value: 3456 },
          { name: 'Appointments', value: 2890 },
          { name: 'Medications', value: 2134 },
          { name: 'Voice Assistant', value: 1678 },
          { name: 'Facility Finder', value: 1234 }
        ]
      },
      accessibility: {
        fontSizeDistribution: [
          { size: 'Medium', percentage: 58 },
          { size: 'Large', percentage: 28 },
          { size: 'Extra Large', percentage: 10 },
          { size: 'Small', percentage: 4 }
        ],
        highContrastUsers: 342,
        voiceAssistantUsers: 1678,
        keyboardNavigationUsers: 567
      },
      clinical: {
        symptomCheckCompletions: 3456,
        appointmentsBooked: 2890,
        emergencyDetections: 87,
        avgTriageTime: 142 // seconds
      },
      languages: {
        en: 3421,
        sw: 11813
      }
    });
    
    setLoading(false);
  };

  const exportData = () => {
    // Export analytics data
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString()}.json`;
    link.click();
  };

  const COLORS = {
    primary: '#0F3D56',
    secondary: '#1B998B',
    success: '#2E7D32',
    warning: '#F4A261',
    danger: '#C84B31'
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 text-[#0F3D56] animate-spin" />
          <p className="text-[#6B7280]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const languageTotal = data.languages.en + data.languages.sw;
  const languageData = [
    { name: 'Kiswahili', value: data.languages.sw, percentage: Math.round((data.languages.sw / languageTotal) * 100) },
    { name: 'English', value: data.languages.en, percentage: Math.round((data.languages.en / languageTotal) * 100) }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#D1D5DB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-[#1E1E1E]">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Platform performance and user insights
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </Button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#EFF6FF] rounded-lg">
                <Users className="h-6 w-6 text-[#0F3D56]" />
              </div>
              <TrendingUp className="h-5 w-5 text-[#2E7D32]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Total Users</p>
              <p className="text-3xl font-semibold text-[#1E1E1E] mt-1">
                {data.overview.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-[#2E7D32] mt-2">
                +12% from last period
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#F0FDF4] rounded-lg">
                <Activity className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <TrendingUp className="h-5 w-5 text-[#2E7D32]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Active Users</p>
              <p className="text-3xl font-semibold text-[#1E1E1E] mt-1">
                {data.overview.activeUsers.toLocaleString()}
              </p>
              <p className="text-xs text-[#2E7D32] mt-2">
                +8% from last period
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#FEF3F2] rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#C84B31]" />
              </div>
              <Target className="h-5 w-5 text-[#1B998B]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Completed Journeys</p>
              <p className="text-3xl font-semibold text-[#1E1E1E] mt-1">
                {data.overview.completedJourneys.toLocaleString()}
              </p>
              <p className="text-xs text-[#1B998B] mt-2">
                87% completion rate
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#FEF3E7] rounded-lg">
                <Clock className="h-6 w-6 text-[#F4A261]" />
              </div>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Avg Session Time</p>
              <p className="text-3xl font-semibold text-[#1E1E1E] mt-1">
                {Math.floor(data.overview.avgSessionTime / 60)}m {data.overview.avgSessionTime % 60}s
              </p>
              <p className="text-xs text-[#6B7280] mt-2">
                Per user session
              </p>
            </div>
          </Card>
        </div>

        {/* Tabs for Different Analytics Views */}
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
          </TabsList>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">
                Daily Active Users
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.engagement.dailyActiveUsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">
                Feature Usage
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.engagement.featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-5 w-5 text-[#0F3D56]" />
                  <h4 className="font-medium text-[#1E1E1E]">High Contrast</h4>
                </div>
                <p className="text-3xl font-semibold text-[#0F3D56]">
                  {data.accessibility.highContrastUsers}
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  {((data.accessibility.highContrastUsers / data.overview.totalUsers) * 100).toFixed(1)}% of users
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-5 w-5 text-[#1B998B]" />
                  <h4 className="font-medium text-[#1E1E1E]">Voice Assistant</h4>
                </div>
                <p className="text-3xl font-semibold text-[#1B998B]">
                  {data.accessibility.voiceAssistantUsers}
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  {((data.accessibility.voiceAssistantUsers / data.overview.totalUsers) * 100).toFixed(1)}% of users
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-[#F4A261]" />
                  <h4 className="font-medium text-[#1E1E1E]">Keyboard Nav</h4>
                </div>
                <p className="text-3xl font-semibold text-[#F4A261]">
                  {data.accessibility.keyboardNavigationUsers}
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  {((data.accessibility.keyboardNavigationUsers / data.overview.totalUsers) * 100).toFixed(1)}% of users
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">
                Font Size Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.accessibility.fontSizeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="size" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Clinical Tab */}
          <TabsContent value="clinical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-sm text-[#6B7280]">Symptom Checks</p>
                <p className="text-3xl font-semibold text-[#1E1E1E] mt-2">
                  {data.clinical.symptomCheckCompletions}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-[#6B7280]">Appointments Booked</p>
                <p className="text-3xl font-semibold text-[#1E1E1E] mt-2">
                  {data.clinical.appointmentsBooked}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-[#6B7280]">Emergency Detections</p>
                <p className="text-3xl font-semibold text-[#C84B31] mt-2">
                  {data.clinical.emergencyDetections}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm text-[#6B7280]">Avg Triage Time</p>
                <p className="text-3xl font-semibold text-[#1E1E1E] mt-2">
                  {data.clinical.avgTriageTime}s
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-[#1E1E1E] mb-6">
                Language Preference Distribution
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill={COLORS.primary} />
                        <Cell fill={COLORS.secondary} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1E1E1E]">Kiswahili</span>
                      <span className="text-sm text-[#6B7280]">
                        {data.languages.sw.toLocaleString()} ({languageData[0].percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#0F3D56] h-3 rounded-full transition-all"
                        style={{ width: `${languageData[0].percentage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1E1E1E]">English</span>
                      <span className="text-sm text-[#6B7280]">
                        {data.languages.en.toLocaleString()} ({languageData[1].percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#1B998B] h-3 rounded-full transition-all"
                        style={{ width: `${languageData[1].percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
