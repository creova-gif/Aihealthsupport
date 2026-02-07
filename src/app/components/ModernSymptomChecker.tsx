/**
 * ModernSymptomChecker - AI as a Quiet Guide
 * Conversational, one question at a time, visual aids, confidence levels
 * Never alarmist, always defers to clinicians
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Heart,
  Activity,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Brain,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  options?: string[];
  metadata?: {
    confidence?: 'low' | 'medium' | 'high';
    urgent?: boolean;
  };
}

interface ModernSymptomCheckerProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onBookAppointment?: () => void;
}

export function ModernSymptomChecker({
  language,
  onBack,
  onBookAppointment,
}: ModernSymptomCheckerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        language === 'sw'
          ? 'Habari. Niko hapa kukusaidia kuelewa dalili zako. Tutaongea pole pole, na unaweza kuuliza swali lolote.'
          : 'Hello. I\'m here to help you understand your symptoms. We\'ll take it step by step, and you can ask questions anytime.',
      metadata: { confidence: 'high' },
    },
  ]);
  const [step, setStep] = useState<'intro' | 'questions' | 'assessment'>('intro');
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const content = {
    sw: {
      title: 'Tathmini ya Dalili',
      subtitle: 'AI inasaidia, sio kubadilisha madaktari',
      placeholder: 'Eleza jinsi unavyohisi...',
      send: 'Tuma',
      disclaimer:
        'Hii ni maoni tu. Kwa uchunguzi sahihi, tafadhali tembelea daktari wa binadamu.',
      questions: {
        mainSymptom:
          'Je, ni dalili gani kuu unayohisi leo? (mfano: maumivu ya kichwa, homa, kikohozi)',
        duration: 'Umekuwa na dalili hii kwa muda gani?',
        severity: 'Je, dalili hii ni kali kiasi gani? (1-10, ambapo 10 ni kali sana)',
        otherSymptoms: 'Je, una dalili nyingine zozote?',
      },
      assessment: {
        title: 'Tathmini Yangu',
        confidence: 'Kujiamini',
        recommendations: 'Mapendekezo',
        nextSteps: 'Hatua Zinazofuata',
        bookAppointment: 'Panga Miadi na Daktari',
        emergency: 'Kwa dalili kali, tafadhali tembelea hospitali mara moja',
      },
    },
    en: {
      title: 'Symptom Assessment',
      subtitle: 'AI assists, not replaces doctors',
      placeholder: 'Describe how you\'re feeling...',
      send: 'Send',
      disclaimer: 'This is guidance only. For accurate diagnosis, please see a human clinician.',
      questions: {
        mainSymptom:
          'What is the main symptom you\'re experiencing today? (e.g., headache, fever, cough)',
        duration: 'How long have you had this symptom?',
        severity: 'How severe is this symptom? (1-10, where 10 is very severe)',
        otherSymptoms: 'Do you have any other symptoms?',
      },
      assessment: {
        title: 'My Assessment',
        confidence: 'Confidence',
        recommendations: 'Recommendations',
        nextSteps: 'Next Steps',
        bookAppointment: 'Book Appointment with Doctor',
        emergency: 'For severe symptoms, please visit a hospital immediately',
      },
    },
  };

  const t = content[language];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          messages.length === 1
            ? t.questions.duration
            : messages.length === 3
            ? t.questions.severity
            : messages.length === 5
            ? t.questions.otherSymptoms
            : language === 'sw'
            ? 'Asante kwa maelezo. Nina tathmini taarifa...'
            : 'Thank you for the information. Let me assess this...',
        options:
          messages.length === 3
            ? ['Siku 1-2', '3-7 days', '1-2 weeks', 'More than 2 weeks']
            : undefined,
        metadata: { confidence: 'medium' },
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      // Move to assessment after a few exchanges
      if (messages.length >= 7) {
        setTimeout(() => setStep('assessment'), 2000);
      }
    }, 1500);
  };

  const handleQuickOption = (option: string) => {
    setUserInput(option);
    setTimeout(handleSendMessage, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D23]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[#1A1D23]">{t.title}</h1>
            <p className="text-sm text-[#6B7280]">{t.subtitle}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#1976D2] rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#FFF7ED] border-b border-[#FFB300] px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <Info className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#92400E]">{t.disclaimer}</p>
        </div>
      </div>

      {step === 'intro' || step === 'questions' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <MessageBubble key={message.id} message={message} index={index} />
                ))}
              </AnimatePresence>

              {isTyping && <TypingIndicator />}
            </div>
          </div>

          {/* Input */}
          <div className="bg-white border-t border-[#E5E7EB] px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {messages[messages.length - 1]?.options && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {messages[messages.length - 1].options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleQuickOption(option)}
                      className="px-4 py-2 bg-[#EFF6FF] text-[#1E88E5] rounded-full text-sm font-medium hover:bg-[#DBEAFE] transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.placeholder}
                  className="flex-1 h-12 px-4 bg-[#F3F4F6] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="w-12 h-12 bg-[#1E88E5] hover:bg-[#1976D2] disabled:bg-[#E5E7EB] rounded-xl flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AssessmentView
          language={language}
          content={t.assessment}
          onBookAppointment={onBookAppointment}
        />
      )}
    </div>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isAI = message.type === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      {isAI && (
        <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#1976D2] rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isAI
            ? 'bg-white border border-[#E5E7EB]'
            : 'bg-[#1E88E5] text-white'
        }`}
      >
        <p className={`text-base leading-relaxed ${isAI ? 'text-[#1A1D23]' : ''}`}>
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#1976D2] rounded-full flex items-center justify-center flex-shrink-0">
        <Brain className="w-5 h-5 text-white" />
      </div>
      <div className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl">
        <div className="flex gap-1">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-2 h-2 bg-[#9CA3AF] rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2 h-2 bg-[#9CA3AF] rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2 h-2 bg-[#9CA3AF] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

function AssessmentView({ language, content, onBookAppointment }: any) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#43A047] to-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1D23] mb-2">{content.title}</h2>
          <p className="text-[#6B7280]">
            {language === 'sw'
              ? 'Nimetathmini taarifa zako'
              : 'I\'ve assessed your information'}
          </p>
        </motion.div>

        {/* Confidence indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#6B7280]">{content.confidence}</span>
            <span className="text-sm font-semibold text-[#43A047]">
              {language === 'sw' ? 'Ya kati' : 'Medium'}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[70%] bg-gradient-to-r from-[#FFB300] to-[#43A047] rounded-full" />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2">
            {language === 'sw'
              ? 'Tathmini hii ni kulingana na maelezo yako. Madaktari wa binadamu wataweza kukupa uchunguzi kamili.'
              : 'This assessment is based on your description. Human clinicians can provide a complete diagnosis.'}
          </p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl border border-[#E5E7EB]"
        >
          <h3 className="font-semibold text-[#1A1D23] mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#1E88E5]" />
            {content.recommendations}
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1D23]">
                {language === 'sw'
                  ? 'Pumzika na unywe maji mengi'
                  : 'Rest and drink plenty of water'}
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1D23]">
                {language === 'sw'
                  ? 'Fuatilia joto lako kwa siku 2-3 zinazofuata'
                  : 'Monitor your temperature for the next 2-3 days'}
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
              <span className="text-[#1A1D23]">
                {language === 'sw'
                  ? 'Kama dalili zinaendelea au kuwa mbaya, tafadhali tembelea daktari'
                  : 'If symptoms persist or worsen, please see a doctor'}
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button
            onClick={onBookAppointment}
            className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-xl text-base font-medium"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {content.bookAppointment}
          </Button>
          <div className="p-4 bg-[#FFF7ED] rounded-xl border border-[#FFB300]">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#92400E]">{content.emergency}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}