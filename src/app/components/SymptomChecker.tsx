import React, { useState } from 'react';
import {
  MessageCircle,
  ThermometerSun,
  Droplets,
  Wind,
  HeartPulse,
  Baby,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Angalizi wa Dalili za AI',
    subtitle: 'Jibu maswali kuhusu hali yako ya afya',
    question: 'Swali',
    yes: 'Ndio',
    no: 'Hapana',
    little: 'Kidogo',
    moderate: 'Wastani',
    severe: 'Kali',
    analyzing: 'AI inachambua...',
    results: 'Matokeo',
    recommendation: 'Mapendekezo',
    confidence: 'Uhakika wa AI',
    disclaimer: 'AI inasaidia tu - Daktari ni muhimu',
    back: 'Rudi',
    restart: 'Anza Upya',
    callDoctor: 'Piga Simu Daktari',
    visitFacility: 'Nenda Kituo cha Afya',
    selfCare: 'Jitunze Nyumbani',
    emergency: 'Dharura - Piga 112',
    why: 'Kwa nini AI inasema hivi?',
  },
  en: {
    title: 'AI Symptom Checker',
    subtitle: 'Answer questions about your health condition',
    question: 'Question',
    yes: 'Yes',
    no: 'No',
    little: 'A little',
    moderate: 'Moderate',
    severe: 'Severe',
    analyzing: 'AI analyzing...',
    results: 'Results',
    recommendation: 'Recommendation',
    confidence: 'AI Confidence',
    disclaimer: 'AI assists only - Doctor is essential',
    back: 'Back',
    restart: 'Restart',
    callDoctor: 'Call Doctor',
    visitFacility: 'Visit Health Facility',
    selfCare: 'Self-care at Home',
    emergency: 'Emergency - Call 112',
    why: 'Why does AI say this?',
  },
};

const symptomQuestions = {
  sw: [
    { id: 'fever', text: 'Je, una homa?', icon: ThermometerSun, type: 'yesno' },
    { id: 'cough', text: 'Je, una kikohozi?', icon: Wind, type: 'severity' },
    { id: 'breathing', text: 'Je, unapata shida ya kupumua?', icon: Wind, type: 'yesno' },
    { id: 'headache', text: 'Je, una maumivu ya kichwa?', icon: HeartPulse, type: 'severity' },
    { id: 'diarrhea', text: 'Je, una kuhara?', icon: Droplets, type: 'yesno' },
    { id: 'pregnant', text: 'Je, una mimba?', icon: Baby, type: 'yesno' },
  ],
  en: [
    { id: 'fever', text: 'Do you have a fever?', icon: ThermometerSun, type: 'yesno' },
    { id: 'cough', text: 'Do you have a cough?', icon: Wind, type: 'severity' },
    { id: 'breathing', text: 'Do you have difficulty breathing?', icon: Wind, type: 'yesno' },
    { id: 'headache', text: 'Do you have a headache?', icon: HeartPulse, type: 'severity' },
    { id: 'diarrhea', text: 'Do you have diarrhea?', icon: Droplets, type: 'yesno' },
    { id: 'pregnant', text: 'Are you pregnant?', icon: Baby, type: 'yesno' },
  ],
};

interface SymptomCheckerProps {
  onBack: () => void;
}

export function SymptomChecker({ onBack }: SymptomCheckerProps) {
  const { language } = useApp();
  const t = translations[language];
  const questions = symptomQuestions[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer,
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeSymptoms(newAnswers);
    }
  };

  const analyzeSymptoms = (symptoms: Record<string, string>) => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI logic - in real app, this would call backend
      const hasFever = symptoms.fever === 'yes';
      const hasDifficultBreathing = symptoms.breathing === 'yes';
      const severeCough = symptoms.cough === 'severe';
      const isPregnant = symptoms.pregnant === 'yes';

      let riskLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
      let recommendation = '';
      let confidence = 70;
      let actions = [];

      if (hasDifficultBreathing || (hasFever && severeCough)) {
        riskLevel = 'emergency';
        recommendation =
          language === 'sw'
            ? 'Hali yako inahitaji uangalifu wa haraka. Nenda hospitali mara moja au piga 112.'
            : 'Your condition requires immediate attention. Go to hospital now or call 112.';
        confidence = 90;
        actions = ['emergency'];
      } else if (hasFever && isPregnant) {
        riskLevel = 'high';
        recommendation =
          language === 'sw'
            ? 'Kwa kuwa una mimba na homa, ni muhimu kutembelea kituo cha afya leo.'
            : 'Since you are pregnant with fever, it is important to visit a health facility today.';
        confidence = 85;
        actions = ['visitFacility', 'callDoctor'];
      } else if (hasFever || symptoms.cough === 'moderate') {
        riskLevel = 'medium';
        recommendation =
          language === 'sw'
            ? 'Dalili zako zinaonyesha uwezekano wa ugonjwa wa homa au ugonjwa wa pumzi. Tembelea kituo cha afya ndani ya siku 1-2.'
            : 'Your symptoms suggest possible fever or respiratory illness. Visit health facility within 1-2 days.';
        confidence = 75;
        actions = ['visitFacility', 'selfCare'];
      } else {
        riskLevel = 'low';
        recommendation =
          language === 'sw'
            ? 'Dalili zako ni za kawaida. Jitunze nyumbani, nywa maji mengi, na upumzike. Ikiwa utazidi kuwa mbaya, tembelea kituo cha afya.'
            : 'Your symptoms are mild. Self-care at home, drink plenty of water, and rest. If worsening, visit health facility.';
        confidence = 70;
        actions = ['selfCare'];
      }

      setResults({
        riskLevel,
        recommendation,
        confidence,
        actions,
        possibleConditions:
          language === 'sw'
            ? ['Homa ya Kawaida', 'Kikohozi', 'Malaria']
            : ['Common Fever', 'Cough', 'Malaria'],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'emergency':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse mb-4">
              <MessageCircle className="h-16 w-16 mx-auto text-blue-600" />
            </div>
            <h2 className="text-2xl mb-2">{t.analyzing}</h2>
            <Progress value={65} className="mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>

          <Card className={`mb-4 border-2 ${getRiskColor(results.riskLevel)}`}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                {results.riskLevel === 'emergency' || results.riskLevel === 'high' ? (
                  <AlertCircle className="h-6 w-6" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}
                {t.results}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-lg mb-2">
                    <strong>{t.recommendation}:</strong>
                  </p>
                  <p className="text-lg">{results.recommendation}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">{t.confidence}</span>
                    <Badge>{results.confidence}%</Badge>
                  </div>
                  <Progress value={results.confidence} className="h-2" />
                </div>

                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-blue-600 text-sm"
                >
                  <HelpCircle className="h-4 w-4" />
                  {t.why}
                </button>

                {showExplanation && (
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p>
                      {language === 'sw'
                        ? 'AI imeangalia dalili zako na kulinganisha na mifumo ya magonjwa 1000+ kutoka WHO IMCI. Matokeo haya ni mapendekezo tu. Daktari ataangalia zaidi.'
                        : 'AI analyzed your symptoms and compared with 1000+ disease patterns from WHO IMCI. These results are suggestions only. A doctor will examine further.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {results.actions.includes('emergency') && (
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-xl py-6"
              >
                <AlertCircle className="h-6 w-6 mr-2" />
                {t.emergency}
              </Button>
            )}
            {results.actions.includes('visitFacility') && (
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
                {t.visitFacility}
              </Button>
            )}
            {results.actions.includes('callDoctor') && (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 border-2"
              >
                {t.callDoctor}
              </Button>
            )}
            {results.actions.includes('selfCare') && (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 border-2"
              >
                {t.selfCare}
              </Button>
            )}
          </div>

          {/* Disclaimer */}
          <Card className="mt-6 bg-yellow-50 border-yellow-300">
            <CardContent className="p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <p className="text-sm">{t.disclaimer}</p>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            onClick={() => {
              setResults(null);
              setAnswers({});
              setCurrentQuestion(0);
            }}
            className="w-full mt-4"
          >
            {t.restart}
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <p className="text-gray-600">{t.subtitle}</p>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600">
              {t.question} {currentQuestion + 1} / {questions.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Icon className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl md:text-3xl">{question.text}</h2>
            </div>

            {question.type === 'yesno' ? (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  onClick={() => handleAnswer('yes')}
                  className="text-xl py-8 bg-green-600 hover:bg-green-700"
                >
                  {t.yes}
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleAnswer('no')}
                  variant="outline"
                  className="text-xl py-8 border-2"
                >
                  {t.no}
                </Button>
              </div>
            ) : (
              <RadioGroup className="space-y-4">
                {['little', 'moderate', 'severe'].map((severity) => (
                  <div
                    key={severity}
                    className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleAnswer(severity)}
                  >
                    <RadioGroupItem value={severity} id={severity} />
                    <Label htmlFor={severity} className="text-xl cursor-pointer flex-1">
                      {t[severity as keyof typeof t]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}