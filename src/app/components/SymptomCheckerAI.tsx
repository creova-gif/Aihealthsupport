/**
 * SymptomCheckerAI - Conversational AI Symptom Assessment
 * Step-by-step, one question at a time
 * Risk-based recommendations with clear explanations
 * Tanzania-focused (malaria, TB, maternal risk, respiratory, NCDs)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Info,
  Thermometer,
  Heart,
  Activity,
  Send,
  Sparkles,
  Calendar,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/button';

interface SymptomCheckerAIProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onBookAppointment: () => void;
  onContactCHW: () => void;
}

interface Message {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface Assessment {
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  conditions: string[];
  reasoning: string;
  nextSteps: string[];
  urgency: string;
}

export function SymptomCheckerAI({
  language,
  onBack,
  onBookAppointment,
  onContactCHW,
}: SymptomCheckerAIProps) {
  const [step, setStep] = useState<'intro' | 'assessment' | 'results'>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const content = {
    sw: {
      title: 'Tathmini ya Dalili',
      subtitle: 'Nitakusaidia kuelewa dalili zako',
      intro: {
        welcome: 'Habari! Nina furaha kukusaidia kuelewa dalili zako.',
        explanation:
          'Nitakuuliza maswali machache kuhusu jinsi unavyohisi. Majibu yako yatasaidia kupanga hatua zinazofuata salama.',
        disclaimer:
          'Kumbuka: Sitoi uchunguzi. Ninasaidia kukuelekeza kwa huduma sahihi.',
        startButton: 'Anza Tathmini',
      },
      questions: [
        {
          text: 'Nini kinakusumbua zaidi?',
          options: [
            'Homa',
            'Maumivu ya kichwa',
            'Kikohozi',
            'Maumivu ya tumbo',
            'Uchovu',
            'Nyingine',
          ],
          followUp: 'Naelewa. Nieleze zaidi...',
        },
        {
          text: 'Umehisi hivi kwa muda gani?',
          options: ['Saa chache', 'Siku 1-2', 'Wiki moja', 'Zaidi ya wiki moja'],
          followUp: 'Asante. Ni muhimu kujua muda.',
        },
        {
          text: 'Je, una homa?',
          options: ['Ndio, joto sana', 'Ndio, kidogo', 'Hapana', 'Sijui'],
          followUp: 'Hii inasaidia kuelewa hali yako.',
        },
      ],
      riskLevels: {
        low: {
          title: 'Hatari ya Chini',
          color: '#10B981',
          icon: CheckCircle,
        },
        medium: {
          title: 'Hatari ya Wastani',
          color: '#F59E0B',
          icon: Info,
        },
        high: {
          title: 'Hatari ya Juu',
          color: '#EF4444',
          icon: AlertCircle,
        },
        emergency: {
          title: 'Hali ya Dharura',
          color: '#DC2626',
          icon: AlertCircle,
        },
      },
      results: {
        title: 'Matokeo ya Tathmini',
        reasoning: 'Kwa nini nasema hivi:',
        nextSteps: 'Hatua Zinazofuata:',
        bookAppointment: 'Panga Miadi',
        contactCHW: 'Wasiliana na CHW',
        startOver: 'Anza Upya',
      },
      typing: 'Inaandika...',
    },
    en: {
      title: 'Symptom Assessment',
      subtitle: 'I\'ll help you understand your symptoms',
      intro: {
        welcome: 'Hello! I\'m here to help you understand your symptoms.',
        explanation:
          'I\'ll ask you a few questions about how you\'re feeling. Your answers will help determine the safest next steps.',
        disclaimer:
          'Remember: I don\'t diagnose. I help guide you to the right care.',
        startButton: 'Start Assessment',
      },
      questions: [
        {
          text: 'What\'s bothering you the most?',
          options: [
            'Fever',
            'Headache',
            'Cough',
            'Stomach pain',
            'Fatigue',
            'Other',
          ],
          followUp: 'I understand. Tell me more...',
        },
        {
          text: 'How long have you felt this way?',
          options: ['A few hours', '1-2 days', 'About a week', 'More than a week'],
          followUp: 'Thank you. Duration is important.',
        },
        {
          text: 'Do you have a fever?',
          options: ['Yes, very high', 'Yes, mild', 'No', 'Not sure'],
          followUp: 'This helps me understand your condition.',
        },
      ],
      riskLevels: {
        low: {
          title: 'Low Risk',
          color: '#10B981',
          icon: CheckCircle,
        },
        medium: {
          title: 'Medium Risk',
          color: '#F59E0B',
          icon: Info,
        },
        high: {
          title: 'High Risk',
          color: '#EF4444',
          icon: AlertCircle,
        },
        emergency: {
          title: 'Emergency',
          color: '#DC2626',
          icon: AlertCircle,
        },
      },
      results: {
        title: 'Assessment Results',
        reasoning: 'Why I\'m telling you this:',
        nextSteps: 'Recommended Next Steps:',
        bookAppointment: 'Book Appointment',
        contactCHW: 'Contact CHW',
        startOver: 'Start Over',
      },
      typing: 'Typing...',
    },
  };

  const t = content[language];

  const handleStartAssessment = () => {
    setStep('assessment');
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: t.questions[0].text,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleOptionSelect = (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option,
      timestamp: new Date(),
    };

    // Store response
    const newResponses = {
      ...responses,
      [`question_${currentQuestion}`]: option,
    };
    setResponses(newResponses);

    // Show follow-up
    const followUpMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: t.questions[currentQuestion].followUp,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, followUpMessage]);

    // Move to next question or complete
    setTimeout(() => {
      if (currentQuestion < t.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        const nextQuestion: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: t.questions[currentQuestion + 1].text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, nextQuestion]);
      } else {
        // Complete assessment
        completeAssessment(newResponses);
      }
    }, 1500);
  };

  const completeAssessment = (allResponses: Record<string, any>) => {
    // Simple risk assessment logic (in production, this would be more sophisticated)
    const mainSymptom = allResponses.question_0 || '';
    const duration = allResponses.question_1 || '';
    const hasFever = allResponses.question_2 || '';

    let riskLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    let conditions: string[] = [];
    let reasoning = '';
    let nextSteps: string[] = [];
    let urgency = '';

    // Risk assessment logic
    if (hasFever.includes('very high') || mainSymptom.includes('Stomach pain')) {
      riskLevel = 'high';
      if (language === 'sw') {
        conditions = ['Uwezekano wa malaria', 'Uwezekano wa ugonjwa wa tumbo'];
        reasoning =
          'Homa kali pamoja na dalili nyingine inaweza kuonyesha ugonjwa unaohitaji matibabu ya haraka. Malaria ni kawaida Tanzania na inahitaji uchunguzi wa damu.';
        nextSteps = [
          'Tembelea kituo cha afya ndani ya saa 24',
          'Fanya vipimo vya damu',
          'Usisubiri dalili ziwe mbaya zaidi',
        ];
        urgency = 'Tembelea kituo ndani ya saa 24';
      } else {
        conditions = ['Possible malaria', 'Possible gastric infection'];
        reasoning =
          'High fever combined with your other symptoms may indicate an infection requiring prompt medical attention. Malaria is common in Tanzania and requires blood testing.';
        nextSteps = [
          'Visit a health facility within 24 hours',
          'Get blood tests done',
          'Don\'t wait for symptoms to worsen',
        ];
        urgency = 'Visit facility within 24 hours';
      }
    } else if (
      duration.includes('week') ||
      mainSymptom.includes('Cough') ||
      mainSymptom.includes('Kikohozi')
    ) {
      riskLevel = 'medium';
      if (language === 'sw') {
        conditions = ['Uwezekano wa ugonjwa wa hewa ya kupumua'];
        reasoning =
          'Kikohozi kinachoendelea au dalili za wiki nyingi zinahitaji tathmini ya daktari. Hii inaweza kuwa ugonjwa wa kawaida au uwezekano wa hali ya ziada.';
        nextSteps = [
          'Panga miadi ndani ya siku 2-3',
          'Pumzika vizuri',
          'Kunywa maji mengi',
          'Fuata maelekezo ya matibabu',
        ];
        urgency = 'Panga miadi ndani ya siku 2-3';
      } else {
        conditions = ['Possible respiratory infection'];
        reasoning =
          'A persistent cough or symptoms lasting weeks needs medical evaluation. This could be a common illness or potentially something requiring further investigation.';
        nextSteps = [
          'Schedule an appointment within 2-3 days',
          'Get adequate rest',
          'Stay hydrated',
          'Follow medication guidance',
        ];
        urgency = 'Schedule appointment within 2-3 days';
      }
    } else {
      riskLevel = 'low';
      if (language === 'sw') {
        conditions = ['Dalili za kawaida'];
        reasoning =
          'Dalili zako zinaonekana kuwa za kawaida na zinaweza kuwa za muda mfupi. Hata hivyo, kama zinaendelea au zinazidi, tembelea kituo cha afya.';
        nextSteps = [
          'Pumzika vizuri',
          'Kunywa maji mengi',
          'Fuatilia dalili',
          'Tembelea daktari kama haziendi',
        ];
        urgency = 'Dhibiti nyumbani, tembelea kama haziendi';
      } else {
        conditions = ['Common symptoms'];
        reasoning =
          'Your symptoms appear to be mild and may be temporary. However, if they persist or worsen, please visit a health facility.';
        nextSteps = [
          'Get adequate rest',
          'Stay hydrated',
          'Monitor symptoms',
          'Visit doctor if they don\'t improve',
        ];
        urgency = 'Self-care at home, visit if symptoms persist';
      }
    }

    setAssessment({
      riskLevel,
      conditions,
      reasoning,
      nextSteps,
      urgency,
    });

    setStep('results');
  };

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-6 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <Thermometer className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t.title}</h1>
            </div>
            <p className="text-white/90 text-base">{t.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Introduction */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#1E88E5]" />
                </div>
                <div className="flex-1">
                  <p className="text-base text-[#1A1D23] leading-relaxed mb-4">
                    {t.intro.welcome}
                  </p>
                  <p className="text-base text-[#6B7280] leading-relaxed">
                    {t.intro.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-[#FEF2F2] rounded-xl border border-[#FEE2E2] p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#991B1B] leading-relaxed">
                  {t.intro.disclaimer}
                </p>
              </div>
            </div>

            {/* What to expect */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1A1D23]">
                {language === 'sw' ? 'Nini kutarajia:' : 'What to expect:'}
              </h3>
              <div className="space-y-2">
                {[
                  language === 'sw'
                    ? 'Maswali 3-5 ya rahisi'
                    : '3-5 simple questions',
                  language === 'sw'
                    ? 'Muda wa dakika 2-3'
                    : '2-3 minutes of your time',
                  language === 'sw'
                    ? 'Mapendekezo wazi ya hatua zinazofuata'
                    : 'Clear next-step recommendations',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                    <span className="text-[#6B7280]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartAssessment}
              className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] text-lg font-semibold"
            >
              {t.intro.startButton}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Assessment Screen
  if (step === 'assessment') {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D23] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === 'sw' ? 'Rudi' : 'Back'}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1E88E5]" />
                <span className="text-sm font-medium text-[#1A1D23]">
                  {language === 'sw' ? 'Msaidizi wa AI' : 'AI Assistant'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#1E88E5]" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm border border-[#E5E7EB] p-4">
                        <p className="text-base text-[#1A1D23] leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="bg-[#1E88E5] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-base leading-relaxed">{message.content}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white border-t border-[#E5E7EB] px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {t.questions[currentQuestion].options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  variant="outline"
                  className="h-auto py-4 text-left justify-start hover:bg-[#EFF6FF] hover:border-[#1E88E5]"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === 'results' && assessment) {
    const riskInfo = t.riskLevels[assessment.riskLevel];
    const RiskIcon = riskInfo.icon;

    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-[#1A1D23] mb-2">
              {t.results.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
          {/* Risk Level */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border-2 p-6"
            style={{ borderColor: riskInfo.color }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${riskInfo.color}15` }}
              >
                <RiskIcon className="w-8 h-8" style={{ color: riskInfo.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1D23]">
                  {riskInfo.title}
                </h2>
                <p className="text-[#6B7280]">{assessment.urgency}</p>
              </div>
            </div>
          </motion.div>

          {/* Possible Conditions */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">
              {language === 'sw' ? 'Uwezekano:' : 'Possible conditions:'}
            </h3>
            <ul className="space-y-2">
              {assessment.conditions.map((condition, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1A1D23]">{condition}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reasoning */}
          <div className="bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] p-6">
            <div className="flex items-start gap-3 mb-3">
              <Info className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
              <h3 className="text-base font-semibold text-[#1A1D23]">
                {t.results.reasoning}
              </h3>
            </div>
            <p className="text-[#1A1D23] leading-relaxed">{assessment.reasoning}</p>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#1A1D23] mb-4">
              {t.results.nextSteps}
            </h3>
            <ol className="space-y-3">
              {assessment.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#1E88E5] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-[#1A1D23] flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {(assessment.riskLevel === 'high' ||
              assessment.riskLevel === 'medium') && (
              <Button
                onClick={onBookAppointment}
                className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] text-base font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t.results.bookAppointment}
              </Button>
            )}
            <Button
              onClick={onContactCHW}
              variant="outline"
              className="w-full h-14 border-[#1E88E5] text-[#1E88E5] hover:bg-[#EFF6FF] text-base font-semibold"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {t.results.contactCHW}
            </Button>
            <Button
              onClick={() => {
                setStep('intro');
                setMessages([]);
                setCurrentQuestion(0);
                setResponses({});
                setAssessment(null);
              }}
              variant="ghost"
              className="w-full h-12 text-[#6B7280] hover:text-[#1A1D23]"
            >
              {t.results.startOver}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#FEF2F2] rounded-xl border border-[#FEE2E2] p-4">
            <p className="text-xs text-[#991B1B] text-center leading-relaxed">
              {language === 'sw'
                ? 'Tathmini hii ni kwa maelekezo tu. Wasiliana na daktari kwa uchunguzi wa kina.'
                : 'This assessment is for guidance only. Consult a doctor for proper diagnosis.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
