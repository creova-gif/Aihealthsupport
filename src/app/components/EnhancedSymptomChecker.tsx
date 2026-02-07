import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Info,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Angalia Dalili',
    question: 'Swali',
    yes: 'Ndiyo',
    no: 'Hapana',
    results: 'Matokeo',
    riskLevel: 'Kiwango cha Hatari',
    whatItMeans: 'Maana Yake',
    whatToDo: 'Nini Cha Kufanya',
    nearestFacility: 'Kituo cha Karibu',
    callNow: 'Piga Simu Sasa',
    aiConfidence: 'Kuaminika ya AI',
    whyAI: 'Kwa nini AI inasema hivi?',
    factorsConsidered: 'Vitu Vilivyoangaliwa',
    similarCases: 'Matukio Sawa',
    regionalData: 'Takwimu za Mkoa',
    backHome: 'Rudi Nyumbani',
    emergency: 'Dharura',
    high: 'Juu',
    medium: 'Kati',
    low: 'Chini',
  },
  en: {
    title: 'Check Symptoms',
    question: 'Question',
    yes: 'Yes',
    no: 'No',
    results: 'Results',
    riskLevel: 'Risk Level',
    whatItMeans: 'What It Means',
    whatToDo: 'What To Do',
    nearestFacility: 'Nearest Facility',
    callNow: 'Call Now',
    aiConfidence: 'AI Confidence',
    whyAI: 'Why does AI say this?',
    factorsConsidered: 'Factors Considered',
    similarCases: 'Similar Cases',
    regionalData: 'Regional Data',
    backHome: 'Back Home',
    emergency: 'Emergency',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
};

// Conversational questions - Ada Health style
const questions = [
  {
    id: 1,
    sw: 'Una homa kali?',
    en: 'Do you have a high fever?',
    icon: '🌡️',
  },
  {
    id: 2,
    sw: 'Una shida ya kupumua?',
    en: 'Do you have difficulty breathing?',
    icon: '🫁',
  },
  {
    id: 3,
    sw: 'Una maumivu ya kichwa?',
    en: 'Do you have a headache?',
    icon: '🤕',
  },
  {
    id: 4,
    sw: 'Una kichefuchefu au kutapika?',
    en: 'Do you have nausea or vomiting?',
    icon: '🤢',
  },
  {
    id: 5,
    sw: 'Dalili zimekuwepo kwa siku ngapi?',
    en: 'How many days have you had symptoms?',
    icon: '📅',
    options: ['1-2', '3-5', '6+'],
  },
];

interface SymptomCheckerProps {
  onBack: () => void;
}

export function EnhancedSymptomChecker({ onBack }: SymptomCheckerProps) {
  const { language } = useApp();
  const t = translations[language];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answer: boolean | string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateRisk = () => {
    // Simple risk calculation (would be replaced with actual AI)
    const yesCount = Object.values(answers).filter(a => a === true).length;
    if (yesCount >= 3) return 'high';
    if (yesCount >= 2) return 'medium';
    return 'low';
  };

  const getRiskData = () => {
    const risk = calculateRisk();
    const data = {
      high: {
        level: t.high,
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        confidence: 85,
        diagnosis: language === 'sw' ? 'Hukuunganisha na malaria au homa ya kifua' : 'Possible malaria or pneumonia',
        action: language === 'sw' ? 'Tembelea hospitali SASA' : 'Visit hospital IMMEDIATELY',
        facility: 'Mwananyamala Hospital - 2.3 km',
      },
      medium: {
        level: t.medium,
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        confidence: 72,
        diagnosis: language === 'sw' ? 'Hukuunganisha na mafua au homa ya kawaida' : 'Possible flu or common cold',
        action: language === 'sw' ? 'Ongea na daktari ndani ya siku 1-2' : 'Consult doctor within 1-2 days',
        facility: 'Kigogo Health Center - 1.5 km',
      },
      low: {
        level: t.low,
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        confidence: 68,
        diagnosis: language === 'sw' ? 'Dalili za kawaida, hakuna hatari' : 'Mild symptoms, no immediate concern',
        action: language === 'sw' ? 'Pumzika na kunywa maji mengi' : 'Rest and stay hydrated',
        facility: 'Tandale Dispensary - 0.8 km',
      },
    };
    return data[risk];
  };

  if (showResults) {
    const riskData = getRiskData();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
              {t.backHome}
            </button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Risk Level Card */}
          <Card className={`border-2 ${riskData.borderColor} ${riskData.bgColor}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.riskLevel}</p>
                  <h2 className={`text-3xl font-bold ${riskData.textColor}`}>
                    {riskData.level}
                  </h2>
                </div>
                <Badge className={`bg-${riskData.color}-500 text-white text-sm px-3 py-1`}>
                  {t.aiConfidence}: {riskData.confidence}%
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.whatItMeans}</h3>
                  <p className="text-gray-700 leading-relaxed">{riskData.diagnosis}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.whatToDo}</h3>
                  <p className="text-gray-700 leading-relaxed">{riskData.action}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Explainability */}
          <Card className="border border-blue-100">
            <CardContent className="p-5">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{t.whyAI}</h3>
                </div>
                <ChevronLeft
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    showExplanation ? '-rotate-90' : 'rotate-180'
                  }`}
                />
              </button>

              {showExplanation && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="text-sm font-semibold text-gray-900">{t.factorsConsidered}</h4>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-600 ml-6">
                      {Object.entries(answers).map(([idx, answer]) => {
                        const q = questions[parseInt(idx)];
                        return (
                          <li key={idx}>
                            {q[language]} -{' '}
                            {typeof answer === 'boolean'
                              ? answer
                                ? t.yes
                                : t.no
                              : answer}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-gray-900">{t.similarCases}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {language === 'sw'
                        ? '1,247 matukio sawa kutoka Tanzania'
                        : '1,247 similar cases from Tanzania'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-gray-900">{t.regionalData}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {language === 'sw'
                        ? '28% ya matukio Dar es Salaam'
                        : '28% prevalence in Dar es Salaam'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nearest Facility */}
          <Card className="border border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{t.nearestFacility}</h3>
                  </div>
                  <p className="text-base font-medium text-gray-900">{riskData.facility}</p>
                </div>
                <Button size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {language === 'sw' ? 'Maelekezo' : 'Directions'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Call Button */}
          {calculateRisk() === 'high' && (
            <button
              onClick={() => (window.location.href = 'tel:112')}
              className="w-full py-6 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3"
            >
              <Phone className="h-6 w-6" />
              <span className="text-xl font-semibold">{t.callNow}: 112</span>
            </button>
          )}

          <div className="h-20" />
        </div>
      </div>
    );
  }

  // Question Screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
              {t.backHome}
            </button>
            <span className="text-sm text-gray-600">
              {t.question} {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Question Card - Large, Visual, One per screen */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6 animate-pulse">{question.icon}</div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            {question[language]}
          </h2>
        </div>

        {/* Answer Buttons - Large touch targets */}
        {question.options ? (
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full py-6 px-6 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                <span className="text-xl font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="py-8 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <CheckCircle className="h-12 w-12 mx-auto mb-3" />
              <span className="text-2xl font-semibold">{t.yes}</span>
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="py-8 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <XCircle className="h-12 w-12 mx-auto mb-3" />
              <span className="text-2xl font-semibold">{t.no}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
