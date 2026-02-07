import React, { useState } from 'react';
import { Bot, MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIGuideProps {
  language: 'sw' | 'en';
  onClose?: () => void;
}

const translations = {
  sw: {
    greeting: 'Habari! Mimi ni AfyaAI.',
    intro: 'Nimefundishwa kwa ushauri wa wataalamu wa afya Tanzania. Ninaweza kukusaidia kupata huduma za afya.',
    capabilities: [
      'Jibu maswali kuhusu afya',
      'Eleza matokeo ya AI',
      'Kuongoza kwa wataalamu wa afya',
    ],
    placeholder: 'Andika swali lako...',
    talkToHuman: '💬 Ongea na mtu',
    examples: [
      'Ninaangalia dalili vipi?',
      'Ninapataje daktari?',
      'AI inafanyaje kazi?',
    ],
    examplesTitle: 'Maswali ya kawaida:',
    minimize: 'Punguza',
    close: 'Funga',
  },
  en: {
    greeting: 'Hello! I am AfyaAI.',
    intro: "I've been trained with advice from Tanzania's health experts. I can help you access healthcare services.",
    capabilities: [
      'Answer health questions',
      'Explain AI results',
      'Route to human healthcare workers',
    ],
    placeholder: 'Type your question...',
    talkToHuman: '💬 Talk to a human',
    examples: [
      'How do I check symptoms?',
      'How do I find a doctor?',
      'How does AI work?',
    ],
    examplesTitle: 'Common questions:',
    minimize: 'Minimize',
    close: 'Close',
  },
};

export function AIGuide({ language, onClose }: AIGuideProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const t = translations[language];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: messageText }]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(messageText);
      setMessages((prev) => [...prev, { type: 'ai', text: response }]);
    }, 500);
  };

  const getAIResponse = (question: string) => {
    const q = question.toLowerCase();

    if (language === 'sw') {
      if (q.includes('dalili') || q.includes('symptom')) {
        return 'Unaweza kuangalia dalili kwa kubofya kitufe cha "Angalia Dalili" kwenye dashibodi. Utaulizwa maswali machache kuhusu hali yako, na AI itakupa ushauri. Kumbuka: AI inasaidia, sio badala ya daktari.';
      }
      if (q.includes('daktari') || q.includes('doctor')) {
        return 'Unaweza kupata madaktari wa karibu kwa kubofya "Vituo vya Afya". Mfumo utakuonyesha madaktari na vituo vilivyo karibu nawe.';
      }
      if (q.includes('ai') || q.includes('kazi')) {
        return 'AI ya AfyaAI imefunzwa kwa data ya Tanzania na wataalamu wa afya. Inakusaidia kutambua dalili na kukupa ushauri wa awali. Lakini daima wasiliana na daktari kwa diagnosis halisi.';
      }
      return 'Asante kwa swali lako. Je, ungependa kuongea na mfanyakazi wa afya? Au unaweza kuuliza swali lingine.';
    } else {
      if (q.includes('symptom') || q.includes('check')) {
        return 'You can check symptoms by clicking the "Symptom Checker" button on the dashboard. You\'ll be asked a few questions about your condition, and AI will provide guidance. Remember: AI assists, it doesn\'t replace a doctor.';
      }
      if (q.includes('doctor') || q.includes('find')) {
        return 'You can find nearby doctors by clicking "Health Facilities". The system will show you nearby doctors and health centers.';
      }
      if (q.includes('ai') || q.includes('work')) {
        return 'AfyaAI has been trained with Tanzania health data and expert guidance. It helps identify symptoms and provides initial advice. But always consult a doctor for real diagnosis.';
      }
      return 'Thank you for your question. Would you like to speak with a healthcare worker? Or you can ask another question.';
    }
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1E88E5 0%, #0F9D58 100%)' }}
      >
        <Bot className="h-7 w-7 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-blue-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AfyaAI</h3>
              <p className="text-xs text-blue-100">
                {language === 'sw' ? 'Msaidizi wako wa AI' : 'Your AI Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={t.minimize}
            >
              <Minimize2 className="h-4 w-4 text-white" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={t.close}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {/* Initial greeting */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <p className="font-bold text-gray-900 mb-2">{t.greeting}</p>
                <p className="text-sm text-gray-700 mb-3">{t.intro}</p>
                
                <div className="space-y-1 mb-3">
                  {t.capabilities.map((capability, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>

                {/* Example questions */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">{t.examplesTitle}</p>
                  <div className="space-y-2">
                    {t.examples.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(example)}
                        className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        💡 {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Conversation */}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-600">AfyaAI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Talk to human button */}
        <div className="border-t border-gray-200 p-3 bg-green-50">
          <button
            onClick={() => alert(language === 'sw' ? 'Kuunganisha na mfanyakazi wa afya...' : 'Connecting to healthcare worker...')}
            className="w-full py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            {t.talkToHuman}
          </button>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
