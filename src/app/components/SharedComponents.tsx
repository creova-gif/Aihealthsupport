import React from 'react';
import { Shield, CheckCircle, AlertCircle, WifiOff, HelpCircle } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

// MoH/TMDA Trust Badge Component
export function TrustBadge({ type, language = 'sw' }: { type: 'moh' | 'tmda'; language?: 'sw' | 'en' }) {
  const labels = {
    sw: { moh: 'Wizara ya Afya', tmda: 'TMDA' },
    en: { moh: 'Ministry of Health', tmda: 'TMDA' },
  };

  return (
    <Badge className="bg-green-600 flex items-center gap-1">
      <Shield className="h-3 w-3" />
      {labels[language][type]}
    </Badge>
  );
}

// Offline Status Indicator
export function OfflineIndicator({ isOffline, language = 'sw' }: { isOffline: boolean; language?: 'sw' | 'en' }) {
  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700">
        <WifiOff className="h-4 w-4 mr-2" />
        {language === 'sw' ? 'Bila Mtandao' : 'Offline Mode'}
      </Badge>
    </div>
  );
}

// AI Confidence Display with Explainability
export function AIConfidenceDisplay({
  confidence,
  explanation,
  language = 'sw',
}: {
  confidence: number;
  explanation?: string;
  language?: 'sw' | 'en';
}) {
  const getColor = () => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {language === 'sw' ? 'Uhakika wa AI' : 'AI Confidence'}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge className={`${getColor()} bg-transparent border-current`}>
                {confidence}%
                {explanation && <HelpCircle className="h-3 w-3 ml-1" />}
              </Badge>
            </TooltipTrigger>
            {explanation && (
              <TooltipContent className="max-w-xs">
                <p>{explanation}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={confidence} className="h-2" />
    </div>
  );
}

// Risk Level Card
export function RiskLevelCard({
  level,
  title,
  description,
  language = 'sw',
}: {
  level: 'low' | 'medium' | 'high' | 'emergency';
  title: string;
  description: string;
  language?: 'sw' | 'en';
}) {
  const configs = {
    low: {
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
    },
    medium: {
      icon: AlertCircle,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    high: {
      icon: AlertCircle,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      iconColor: 'text-orange-600',
    },
    emergency: {
      icon: AlertCircle,
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-600',
    },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <Card className={`border-2 ${config.color}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AI Disclaimer Banner
export function AIDisclaimerBanner({ language = 'sw' }: { language?: 'sw' | 'en' }) {
  const text = {
    sw: 'AI inasaidia tu. Ushauri wa madaktari ni muhimu daima.',
    en: 'AI assists only. Doctor advice is always essential.',
  };

  return (
    <Card className="bg-yellow-50 border-yellow-300">
      <CardContent className="p-3 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <p className="text-sm">{text[language]}</p>
      </CardContent>
    </Card>
  );
}

// Region Badge with Location
export function RegionBadge({ region, language = 'sw' }: { region: string; language?: 'sw' | 'en' }) {
  return (
    <Badge variant="outline" className="text-sm">
      <span className="mr-1">📍</span>
      {region}
    </Badge>
  );
}

// Loading State for AI Analysis
export function AILoadingState({ language = 'sw' }: { language?: 'sw' | 'en' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-pulse mb-4">
        <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center">
          <div className="h-10 w-10 bg-blue-400 rounded-full"></div>
        </div>
      </div>
      <p className="text-lg text-gray-600">
        {language === 'sw' ? 'AI inachambua...' : 'AI analyzing...'}
      </p>
      <Progress value={45} className="w-48 mt-3" />
    </div>
  );
}
