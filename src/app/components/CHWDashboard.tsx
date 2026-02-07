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
  },
};

interface CHWDashboardProps {
  onBack: () => void;
}

export function CHWDashboard({ onBack }: CHWDashboardProps) {
  const { language } = useApp();
  const t = translations[language];

  const priorityHouseholds = [
    {
      name: 'Mama Fatuma Hassan',
      status: 'pregnant',
      risk: 'high',
      reason: language === 'sw' ? 'Mimba - homa kwa siku 3' : 'Pregnancy - fever for 3 days',
      lastVisit: '5 days ago',
    },
    {
      name: 'Juma Ramadhani',
      status: 'ncd',
      risk: 'medium',
      reason: language === 'sw' ? 'Shinikizo la damu - dawa zimekwisha' : 'Hypertension - medication finished',
      lastVisit: '2 weeks ago',
    },
    {
      name: 'Halima Saleh',
      status: 'child',
      risk: 'high',
      reason: language === 'sw' ? 'Mtoto - kuhara na kutapika' : 'Child - diarrhea and vomiting',
      lastVisit: '1 day ago',
    },
  ];

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

        {/* AI Priority List */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {t.aiPriority} - {t.visitToday}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityHouseholds.map((household, idx) => (
                <Card key={idx} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{household.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{household.reason}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            className={
                              household.risk === 'high'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {household.risk === 'high' ? '🔴 High Risk' : '🟡 Medium Risk'}
                          </Badge>
                          <Badge variant="outline">{household.lastVisit}</Badge>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        {language === 'sw' ? 'Tembelea' : 'Visit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
