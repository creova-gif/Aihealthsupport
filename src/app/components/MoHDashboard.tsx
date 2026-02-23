import React from 'react';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Baby,
  Heart,
  BarChart3,
  ArrowLeft,
  Brain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Dashibodi ya Wizara ya Afya',
    overview: 'Muhtasari',
    regions: 'Mikoa',
    diseases: 'Magonjwa',
    facilities: 'Vituo vya Afya',
    alerts: 'Tahadhari',
    totalPatients: 'Wagonjwa Jumla',
    activeCHWs: 'CHWs Hai',
    aiPredictions: 'Utabiri wa AI',
    outbreakRisk: 'Hatari ya Mlipuko',
    stockouts: 'Upungufu wa Dawa',
    maternalMortality: 'Vifo vya Wazazi',
    childMortality: 'Vifo vya Watoto',
    ncdPrevalence: 'Kiwango cha Magonjwa Sugu',
    back: 'Rudi',
    week: 'Wiki',
    high: 'Juu',
    medium: 'Wastani',
    low: 'Chini',
  },
  en: {
    title: 'Ministry of Health Dashboard',
    overview: 'Overview',
    regions: 'Regions',
    diseases: 'Diseases',
    facilities: 'Facilities',
    alerts: 'Alerts',
    totalPatients: 'Total Patients',
    activeCHWs: 'Active CHWs',
    aiPredictions: 'AI Predictions',
    outbreakRisk: 'Outbreak Risk',
    stockouts: 'Drug Stockouts',
    maternalMortality: 'Maternal Mortality',
    childMortality: 'Child Mortality',
    ncdPrevalence: 'NCD Prevalence',
    back: 'Back',
    week: 'Week',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
};

const weeklyData = [
  { week: 'W1', malaria: 420, tb: 85, ari: 340 },
  { week: 'W2', malaria: 385, tb: 92, ari: 380 },
  { week: 'W3', malaria: 450, tb: 78, ari: 325 },
  { week: 'W4', malaria: 395, tb: 88, ari: 410 },
];

const regionData = [
  { name: 'Dar es Salaam', patients: 12500, chws: 245, risk: 'high' },
  { name: 'Mwanza', patients: 8900, chws: 189, risk: 'medium' },
  { name: 'Arusha', patients: 6700, chws: 156, risk: 'low' },
  { name: 'Dodoma', patients: 5400, chws: 132, risk: 'medium' },
  { name: 'Mbeya', patients: 7200, chws: 167, risk: 'medium' },
];

const diseaseDistribution = [
  { name: 'Malaria', value: 35, color: '#EF4444' },
  { name: 'ARIs', value: 25, color: '#F59E0B' },
  { name: 'Diarrhea', value: 18, color: '#10B981' },
  { name: 'TB', value: 12, color: '#3B82F6' },
  { name: 'NCDs', value: 10, color: '#8B5CF6' },
];

interface MoHDashboardProps {
  onBack: () => void;
  onViewArchitecture?: () => void;
  onViewMonitoring?: () => void;
}

export function MoHDashboard({ onBack, onViewArchitecture, onViewMonitoring }: MoHDashboardProps) {
  const { language } = useApp();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          
          {onViewArchitecture && (
            <Button
              onClick={onViewArchitecture}
              className="gap-2"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              <Brain className="h-4 w-4" />
              {language === 'sw' ? 'Muundo wa AI' : 'AI Architecture'}
            </Button>
          )}
          
          {onViewMonitoring && (
            <Button
              onClick={onViewMonitoring}
              className="gap-2"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              <Brain className="h-4 w-4" />
              {language === 'sw' ? 'Mfumo wa AI' : 'AI Monitoring'}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl">{t.title}</h1>
          <Badge className="bg-green-600 text-lg px-4 py-2">
            {language === 'sw' ? 'Mwezi Jana 2026' : 'January 2026'}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.totalPatients}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">245,670</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5.2%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {t.activeCHWs}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3,489</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.8%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t.facilities}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,256</div>
              <div className="flex items-center text-sm text-gray-600 mt-1">98% Active</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.alerts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">8</div>
              <div className="flex items-center text-sm text-red-600 mt-1">
                {t.high}: 3
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Predictions Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              {t.aiPredictions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t.outbreakRisk} - Malaria</span>
                  <Badge className="bg-orange-600">{t.high}</Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {language === 'sw'
                    ? 'Mwanza & Geita - Mvua zinazoendelea'
                    : 'Mwanza & Geita - Ongoing rains'}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t.stockouts}</span>
                  <Badge className="bg-red-600">45 {t.facilities}</Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {language === 'sw' ? 'Dawa za Malaria' : 'Malaria medications'}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t.maternalMortality}</span>
                  <Badge className="bg-green-600">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -12%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {language === 'sw' ? 'Robo ya mwaka' : 'Quarterly'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="regions">{t.regions}</TabsTrigger>
            <TabsTrigger value="diseases">{t.diseases}</TabsTrigger>
            <TabsTrigger value="facilities">{t.facilities}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'sw' ? 'Magonjwa kwa Wiki' : 'Disease Trends by Week'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="malaria" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="tb" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="ari" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'sw' ? 'Mgawanyo wa Magonjwa' : 'Disease Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diseaseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'sw' ? 'Takwimu za Mikoa' : 'Regional Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region) => (
                    <div
                      key={region.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{region.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{language === 'sw' ? 'Wagonjwa' : 'Patients'}: {region.patients.toLocaleString()}</span>
                          <span>CHWs: {region.chws}</span>
                        </div>
                      </div>
                      <Badge
                        className={
                          region.risk === 'high'
                            ? 'bg-red-100 text-red-800'
                            : region.risk === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {t[region.risk]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diseases">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'sw' ? 'Magonjwa kwa Mkoa' : 'Diseases by Region'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="patients" fill="#3B82F6" />
                    <Bar dataKey="chws" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'sw' ? 'Hali ya Vituo' : 'Facility Status'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="text-3xl font-bold text-green-700 mb-1">1,232</div>
                      <div className="text-sm text-gray-600">
                        {language === 'sw' ? 'Hai' : 'Active'}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="text-3xl font-bold text-yellow-700 mb-1">18</div>
                      <div className="text-sm text-gray-600">
                        {language === 'sw' ? 'Tatizo la Dawa' : 'Drug Issues'}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="text-3xl font-bold text-red-700 mb-1">6</div>
                      <div className="text-sm text-gray-600">
                        {language === 'sw' ? 'Zimefungwa' : 'Offline'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}