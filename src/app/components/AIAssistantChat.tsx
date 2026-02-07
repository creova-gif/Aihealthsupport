import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Volume2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

const translations = {
  sw: {
    title: 'Msaidizi wa AI',
    subtitle: 'Nina hapa kukusaidia!',
    placeholder: 'Andika swali lako hapa...',
    send: 'Tuma',
    minimize: 'Punguza',
    close: 'Funga',
    listening: 'Nasikiliza...',
    thinking: 'Ninafikiria...',
    quickActions: 'Maswali ya Haraka',
    suggestions: [
      'Ninawezaje kupanga miadi?',
      'Nifanye nini kama nina homa?',
      'EHR inafanya kazi vipi?',
      'Ninawezaje kuweka rekodi?',
      'Huduma za telemedicine ni nini?',
    ],
    welcome: 'Karibu! Nina hapa kukusaidia na maswali yoyote kuhusu AfyaAI TZA. Unataka kujua nini?',
    helpTopics: [
      { icon: '🩺', label: 'Dalili & Uchunguzi', topic: 'symptoms' },
      { icon: '📅', label: 'Miadi', topic: 'appointments' },
      { icon: '📊', label: 'Rekodi za Afya', topic: 'records' },
      { icon: '💊', label: 'Dawa', topic: 'medication' },
      { icon: '🤰', label: 'Mama & Mtoto', topic: 'maternal' },
    ],
  },
  en: {
    title: 'AI Assistant',
    subtitle: "I'm here to help!",
    placeholder: 'Type your question here...',
    send: 'Send',
    minimize: 'Minimize',
    close: 'Close',
    listening: 'Listening...',
    thinking: 'Thinking...',
    quickActions: 'Quick Questions',
    suggestions: [
      'How do I book an appointment?',
      'What should I do if I have a fever?',
      'How does the EHR work?',
      'How can I log my health data?',
      'What are telemedicine services?',
    ],
    welcome: 'Welcome! I\'m here to help you with any questions about AfyaAI TZA. What would you like to know?',
    helpTopics: [
      { icon: '🩺', label: 'Symptoms & Diagnosis', topic: 'symptoms' },
      { icon: '📅', label: 'Appointments', topic: 'appointments' },
      { icon: '📊', label: 'Health Records', topic: 'records' },
      { icon: '💊', label: 'Medications', topic: 'medication' },
      { icon: '🤰', label: 'Maternal Care', topic: 'maternal' },
    ],
  },
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
}

interface AIAssistantChatProps {
  language: 'sw' | 'en';
  onClose?: () => void;
  minimized?: boolean;
  onMinimize?: () => void;
}

export function AIAssistantChat({
  language,
  onClose,
  minimized = false,
  onMinimize,
}: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: translations[language].welcome,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, language);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
      setInputValue(language === 'sw' ? 'Nina dalili za homa' : 'I have fever symptoms');
    }, 2000);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  if (minimized) {
    return (
      <button
        onClick={onMinimize}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center pulse"
        style={{ background: 'var(--gradient-trust)', zIndex: 1000 }}
      >
        <Bot className="h-8 w-8 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {messages.length}
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden slide-in"
      style={{ zIndex: 1000 }}
    >
      {/* Header */}
      <div
        className="p-4 text-white flex items-center justify-between"
        style={{ background: 'var(--gradient-trust)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold">{t.title}</h3>
            <p className="text-xs text-white/80">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--onboarding-bg)' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" style={{ color: 'var(--onboarding-accent)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--onboarding-accent)' }}>
                    AI Assistant
                  </span>
                </div>
              )}
              <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {message.text}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString(language === 'sw' ? 'sw-TZ' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-gray-200 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-gray-600">{t.thinking}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--onboarding-text-secondary)' }}>
            {t.quickActions}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.helpTopics.slice(0, 3).map((topic, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(topic.label)}
                className="px-3 py-1.5 text-xs rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors"
                style={{ color: 'var(--onboarding-text-primary)' }}
              >
                {topic.icon} {topic.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {isListening && (
          <div className="mb-2 flex items-center gap-2 text-sm" style={{ color: 'var(--onboarding-accent)' }}>
            <Volume2 className="h-4 w-4 animate-pulse" />
            <span>{t.listening}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.placeholder}
            className="flex-1 py-6"
            disabled={isListening}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isListening}
            className="p-3 rounded-xl text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--onboarding-primary)' }}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// AI Response Generator (Mock)
function generateAIResponse(userMessage: string, language: 'sw' | 'en'): string {
  const lowerMessage = userMessage.toLowerCase();

  // Swahili responses
  if (language === 'sw') {
    if (lowerMessage.includes('miadi') || lowerMessage.includes('panga')) {
      return 'Unaweza kupanga miadi kwa njia hizi:\n\n1. Bonyeza kitufe cha "Panga Miadi" kwenye dashibodi\n2. Chagua hospitali na daktari\n3. Chagua tarehe na wakati\n4. Thibitisha miadi yako\n\nUtapokea ujumbe wa ukumbusho kabla ya miadi yako. Je, unataka kukusaidia kupanga miadi sasa?';
    }
    if (lowerMessage.includes('homa') || lowerMessage.includes('dalili')) {
      return 'Kwa dalili za homa, napendekeza:\n\n1. Rekodi joto lako\n2. Tumia kifaa cha "Angalia Dalili" ili kuchunguza dalili zako\n3. Nywa maji mengi\n4. Pata mapumziko ya kutosha\n\nKama homa inazidi siku 3 au una dalili kali zaidi, tafadhali tembelea kituo cha afya. Je, unataka kutumia kifaa cha kuchunguza dalili?';
    }
    if (lowerMessage.includes('ehr') || lowerMessage.includes('rekodi')) {
      return 'Mfumo wa Rekodi za Kiafya (EHR) unakuruhusu:\n\n✓ Kuona historia yako ya matibabu\n✓ Kuweka vitambulisho vya msingi\n✓ Kuona matokeo ya maabara\n✓ Kushiriki rekodi na madaktari\n\nRekodi zako zimehifadhiwa salama na zimefungwa kwa usalama wa hali ya juu. Je, unataka kujifunza zaidi?';
    }
    return 'Asante kwa swali lako. Nina hapa kukusaidia na:\n\n• Kupanga miadi\n• Kuchunguza dalili\n• Rekodi za afya\n• Huduma za telemedicine\n• Maswali mengine kuhusu AfyaAI\n\nTafadhali nieleze ni sehemu gani unataka kusaidia nayo.';
  }

  // English responses
  if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    return 'You can book appointments by:\n\n1. Click "Book Appointment" on the dashboard\n2. Select your preferred facility and doctor\n3. Choose date and time slot\n4. Confirm your booking\n\nYou\'ll receive reminder notifications before your appointment. Would you like me to help you book one now?';
  }
  if (lowerMessage.includes('fever') || lowerMessage.includes('symptom')) {
    return 'For fever symptoms, I recommend:\n\n1. Record your temperature\n2. Use the "Symptom Checker" to assess your symptoms\n3. Stay hydrated\n4. Get adequate rest\n\nIf fever persists beyond 3 days or you have severe symptoms, please visit a health facility. Would you like to use the symptom checker?';
  }
  if (lowerMessage.includes('ehr') || lowerMessage.includes('record')) {
    return 'The Electronic Health Record (EHR) system allows you to:\n\n✓ View your medical history\n✓ Track vital signs\n✓ Access lab results\n✓ Share records with providers\n\nYour records are securely encrypted and protected. Would you like to learn more?';
  }
  if (lowerMessage.includes('telemedicine')) {
    return 'Telemedicine services include:\n\n✓ Video consultations with doctors\n✓ Chat-based medical advice\n✓ Prescription refills\n✓ Follow-up appointments\n\nAvailable 24/7 for urgent consultations. Would you like to schedule a telemedicine appointment?';
  }

  return 'Thank you for your question. I can help you with:\n\n• Booking appointments\n• Symptom checking\n• Health records\n• Telemedicine services\n• General AfyaAI questions\n\nPlease let me know which area you\'d like assistance with.';
}
