/**
 * AIAssistant - Calm, explainable AI guidance
 * Not chat spam. Clear, cautious, and always explains why.
 * AI never replaces doctors. AI always explains.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  HelpCircle,
  Pill,
  FileText,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';

interface AIAssistantProps {
  language: 'sw' | 'en';
  userName?: string;
  onNavigate: (route: string) => void;
}

interface AssistantOption {
  key: string;
  icon: React.ElementType;
  title: { sw: string; en: string };
  description: { sw: string; en: string };
  route: string;
  color: string;
  bgColor: string;
}

export function AIAssistant({ language, userName, onNavigate }: AIAssistantProps) {
  const assistantOptions: AssistantOption[] = [
    {
      key: 'symptoms',
      icon: MessageSquare,
      title: { sw: 'Ushauri wa Dalili', en: 'Symptom guidance' },
      description: {
        sw: 'Nieleze jinsi unavyohisi, nitakusaidia kuelewa',
        en: 'Tell me how you feel, I\'ll help you understand',
      },
      route: 'symptom-checker',
      color: '#1E88E5',
      bgColor: '#EFF6FF',
    },
    {
      key: 'questions',
      icon: HelpCircle,
      title: { sw: 'Maswali ya Afya', en: 'Care questions' },
      description: {
        sw: 'Uliza maswali kuhusu afya yako',
        en: 'Ask questions about your health',
      },
      route: 'care-questions',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      key: 'medication',
      icon: Pill,
      title: { sw: 'Msaada wa Dawa', en: 'Medication help' },
      description: {
        sw: 'Pata taarifa kuhusu dawa zako',
        en: 'Get information about your medications',
      },
      route: 'medication-help',
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      key: 'results',
      icon: FileText,
      title: { sw: 'Elewa Matokeo', en: 'Understanding results' },
      description: {
        sw: 'Nitakusaidia kuelewa matokeo ya vipimo',
        en: 'I\'ll help you understand your test results',
      },
      route: 'results-help',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      key: 'next-steps',
      icon: Lightbulb,
      title: { sw: 'Nifanye Nini?', en: 'What should I do next?' },
      description: {
        sw: 'Pata mapendekezo ya hatua zinazofuata',
        en: 'Get recommendations for next steps',
      },
      route: 'next-steps',
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-3xl font-bold">
              {language === 'sw' ? 'Msaidizi wa AI' : 'AI Assistant'}
            </h1>
          </div>
          <p className="text-white/90 text-base">
            {language === 'sw'
              ? 'Nitakusaidia kuelewa afya yako. Uliza chochote!'
              : 'I\'m here to help you understand your health. Ask me anything!'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-white rounded-xl border border-[#E5E7EB]"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1E88E5]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1A1D23] leading-relaxed">
                {language === 'sw' ? (
                  <>
                    Nina kujifunza kutoka kwa vyanzo vya kibinadamu. Ushauri wangu ni
                    <span className="font-semibold"> wa kielelezo tu</span> - sio
                    mbadala wa madaktari. Nitakuelezea kwa nini nakuambia jambo fulani.
                  </>
                ) : (
                  <>
                    I learn from clinical sources. My guidance is{' '}
                    <span className="font-semibold">informational only</span> - not a
                    replacement for doctors. I\'ll always explain why I tell you something.
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* How can I help? */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">
            {language === 'sw' ? 'Nikusaidie vipi?' : 'How can I help you?'}
          </h2>
        </div>

        {/* Assistant Options */}
        <div className="space-y-3">
          {assistantOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <button
                  onClick={() => onNavigate(option.route)}
                  className="w-full group"
                >
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-md transition-all duration-200 hover:border-[#CBD5E1]">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: option.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: option.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <h3 className="text-base font-semibold text-[#1A1D23] mb-0.5">
                          {option.title[language]}
                        </h3>
                        <p className="text-sm text-[#6B7280]">
                          {option.description[language]}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1E88E5] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Recent conversations (placeholder) */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-[#1A1D23] mb-3">
            {language === 'sw' ? 'Mazungumzo ya Hivi Karibuni' : 'Recent conversations'}
          </h3>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
            <MessageSquare className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280] text-sm">
              {language === 'sw'
                ? 'Hakuna mazungumzo bado. Anza kuzungumza na mimi!'
                : 'No conversations yet. Start chatting with me!'}
            </p>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-6 p-4 bg-[#FEF2F2] rounded-xl border border-[#FEE2E2]">
          <p className="text-xs text-[#991B1B] text-center leading-relaxed">
            {language === 'sw' ? (
              <>
                <span className="font-semibold">Kumbuka:</span> Kwa hali za dharura,
                wasiliana na huduma za dharura mara moja. Usiamini tu ushauri wa AI.
              </>
            ) : (
              <>
                <span className="font-semibold">Remember:</span> For emergencies, contact
                emergency services immediately. Don\'t rely solely on AI guidance.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
