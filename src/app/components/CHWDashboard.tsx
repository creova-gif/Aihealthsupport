import React from 'react';
import {
  Users,
  Home,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Clock,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Dashibodi ya CHW',
    households: 'Kaya',
    visits: 'Ziara Leo',
    highRisk: 'Hatari Kubwa',
    referrals: 'Marejesho',
    aiPriority: 'Kipaumbele cha AI',
    visitToday: 'Tembelea Leo',
    overdue: 'Umechelewa',
    pregnant: 'Wajawazito',
    children: 'Watoto',
    ncds: 'Magonjwa Sugu',
    coverage: 'Ufikaji',
    performance: 'Utendaji',
    back: 'Rudi',
    // NEW: Enhanced priority section
    urgentAction: 'Hatua za Haraka',
    aiRecommends: 'AI Inapendekeza',
    urgentPatients: 'Wagonjwa wa Haraka',
    actionNeeded: 'Hatua Inahitajika',
    lastVisit: 'Ziara ya Mwisho',
    riskScore: 'Hatari',
    daysOverdue: 'Siku Zilizopita',
    viewDetails: 'Angalia Maelezo',
    markVisited: 'Weka Ametembelewa',
    callPatient: 'Piga Simu',
    planRoute: 'Ratibu Ziara',
    planRouteDesc: 'Panga njia bora ya kutembelea',
  },
  en: {
    title: 'CHW Dashboard',
    households: 'Households',
    visits: 'Visits Today',
    highRisk: 'High Risk',
    referrals: 'Referrals',
    aiPriority: 'AI Priority',
    visitToday: 'Visit Today',
    overdue: 'Overdue',
    pregnant: 'Pregnant Women',
    children: 'Children',
    ncds: 'Chronic Diseases',
    coverage: 'Coverage',
    performance: 'Performance',
    back: 'Back',
    // NEW: Enhanced priority section
    urgentAction: 'Urgent Action Required',
    aiRecommends: 'AI Recommends',
    urgentPatients: 'Urgent Patients',
    actionNeeded: 'Action Needed',
    lastVisit: 'Last Visit',
    riskScore: 'Risk',
    daysOverdue: 'Days Overdue',
    viewDetails: 'View Details',
    markVisited: 'Mark Visited',
    callPatient: 'Call Patient',
    planRoute: 'Plan Route',
    planRouteDesc: 'Optimize your visit schedule',
  },
};

interface CHWDashboardProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function CHWDashboard({ onBack, onNavigate }: CHWDashboardProps) {
  const { language } = useApp();
  const t = translations[language];

  // ENHANCED: Priority patients with AI-generated risk scores and actions
  const priorityHouseholds = [
    {
      id: '1',
      name: 'Mama Fatuma Hassan',
      age: 28,
      status: 'pregnant',
      risk: 'critical',
      riskScore: 92,
      reason: language === 'sw' ? 'Mimba - homa kwa siku 3' : 'Pregnancy - fever for 3 days',
      aiAction: language === 'sw'
        ? 'Rejesha kwa kliniki SASA - homa wakati wa ujauzito ni hatari'
        : 'Refer to clinic NOW - fever during pregnancy is dangerous',
      lastVisit: '5 days ago',
      daysOverdue: 5,
      phone: '+255 741 234 567',
      nextAction: language === 'sw' ? 'Rejesha Kliniki' : 'Refer to Clinic',
    },
    {
      id: '2',
      name: 'Halima Saleh',
      age: 2,
      status: 'child',
      risk: 'critical',
      riskScore: 88,
      reason: language === 'sw' ? 'Mtoto (2 years) - kuhara na kutapika' : 'Child (2 years) - diarrhea and vomiting',
      aiAction: language === 'sw'
        ? 'Tembelea LEO - hatari ya ukosefu wa maji kwa watoto'
        : 'Visit TODAY - risk of dehydration in children',
      lastVisit: '1 day ago',
      daysOverdue: 1,
      phone: '+255 742 345 678',
      nextAction: language === 'sw' ? 'Tembelea Leo' : 'Visit Today',
    },
    {
      id: '3',
      name: 'Juma Ramadhani',
      age: 56,
      status: 'ncd',
      risk: 'high',
      riskScore: 75,
      reason: language === 'sw' ? 'Shinikizo la damu - dawa zimekwisha' : 'Hypertension - medication finished',
      aiAction: language === 'sw'
        ? 'Leta dawa mpya wiki hii - shinikizo lisilo na dawa ni hatari'
        : 'Deliver new medication this week - uncontrolled BP is risky',
      lastVisit: '2 weeks ago',
      daysOverdue: 7,
      phone: '+255 743 456 789',
      nextAction: language === 'sw' ? 'Leta Dawa' : 'Deliver Medication',
    },
    {
      id: '4',
      name: 'Grace Mwakasege',
      age: 31,
      status: 'pregnant',
      risk: 'medium',
      riskScore: 58,
      reason: language === 'sw' ? 'Mimba - kliniki ya ANC ya 4' : 'Pregnancy - 4th ANC visit due',
      aiAction: language === 'sw'
        ? 'Tathmini ya kawaida - hakikisha ANC inafuatiliwa'
        : 'Routine assessment - ensure ANC follow-up',
      lastVisit: '3 weeks ago',
      daysOverdue: 2,
      phone: '+255 744 567 890',
      nextAction: language === 'sw' ? 'ANC Kufuatilia' : 'ANC Follow-up',
    },
  ];

  // Sort by risk score (highest first)
  const sortedPriorities = [...priorityHouseholds].sort((a, b) => b.riskScore - a.riskScore);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-600 text-white animate-pulse';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <Activity className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <h1 className="text-3xl md:text-4xl mb-6">{t.title}</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t.households}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t.visits}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">8</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.highRisk}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">12</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t.referrals}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">5</div>
            </CardContent>
          </Card>
        </div>

        {/* Route Optimizer Button - Prominent CTA */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('route-optimizer')}
            className="w-full mb-6 p-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MapPin className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-1">{t.planRoute}</h3>
                  <p className="text-sm text-blue-100">{t.planRouteDesc}</p>
                </div>
              </div>
              <ArrowLeft className="h-6 w-6 text-white/60 group-hover:text-white/100 transition-colors rotate-180" />
            </div>
          </button>
        )}

        {/* AI Priority List */}
        <Card className="mb-6 border-l-4 border-l-red-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-red-600" />
                {t.urgentAction}
              </CardTitle>
              <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                {sortedPriorities.length} {t.urgentPatients}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {t.aiRecommends}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {sortedPriorities.map((household) => (
                <div key={household.id} className="p-5 hover:bg-gray-50 transition-colors">
                  {/* Header: Name + Risk Score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{household.name}</h3>
                        <Badge className={getRiskBadgeColor(household.risk)}>
                          {getRiskIcon(household.risk)}
                          <span className="ml-1.5">{household.riskScore}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {household.age} {language === 'sw' ? 'miaka' : 'years old'} • {household.status}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-gray-50 border-l-4 border-l-blue-500 p-3 rounded mb-3">
                    <p className="text-sm font-medium text-gray-900">{household.reason}</p>
                  </div>

                  {/* AI Action Recommendation */}
                  <div className="bg-blue-50 border-l-4 border-l-blue-600 p-3 rounded mb-3">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-blue-900 uppercase mb-1">
                          {t.aiRecommends}
                        </p>
                        <p className="text-sm text-blue-800">{household.aiAction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.lastVisit}: {household.lastVisit}</span>
                    </div>
                    {household.daysOverdue > 0 && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {household.daysOverdue} {t.daysOverdue}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      {household.nextAction}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => (window.location.href = `tel:${household.phone}`)}
                    >
                      <Clock className="w-4 h-4 mr-1.5" />
                      {t.callPatient}
                    </Button>
                    {onNavigate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onNavigate(`route/${household.id}`)}
                      >
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {t.planRoute}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                {t.coverage}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.pregnant}</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.children} {'<'}5</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.ncds}</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {t.performance}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">{language === 'sw' ? 'Ziara Wiki Hii' : 'Visits This Week'}</span>
                  <Badge className="bg-green-600">42</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">{language === 'sw' ? 'Marejesho Yaliyofanikiwa' : 'Successful Referrals'}</span>
                  <Badge className="bg-blue-600">38</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm">{language === 'sw' ? 'Data Iliyopokelewa' : 'Data Synced'}</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}