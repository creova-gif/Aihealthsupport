/**
 * TelemedicineInterface - Talk to Doctor / CHW
 * 
 * ELITE STANDARD: Secure teleconsultation interface
 * Text-based consultation with escalation to voice/video (future)
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Video,
  Send,
  Clock,
  User,
  Stethoscope,
} from 'lucide-react';
import { MedicalButton, MedicalCard, colors } from '@/app/design-system';

interface TelemedicineInterfaceProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface Provider {
  id: string;
  name: string;
  role: string;
  specialty: string;
  available: boolean;
  responseTime: string;
  rating: number;
  consultations: number;
}

interface Message {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  time: string;
}

export function TelemedicineInterface({ language, onBack }: TelemedicineInterfaceProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const t = {
    sw: {
      title: 'Zungumza na Daktari',
      availableProviders: 'Wataalamu Wanapatikana',
      available: 'Anapatikana',
      offline: 'Hayupo',
      responseTime: 'Muda wa Kujibu',
      consultations: 'Mashauriano',
      startChat: 'Anza Mazungumzo',
      callNow: 'Piga Simu',
      videoCall: 'Mazungumzo ya Video',
      typeMessage: 'Andika ujumbe...',
      send: 'Tuma',
      doctor: 'Daktari',
      nurse: 'Muuguzi',
      chw: 'CHW',
      specialist: 'Mtaalamu',
      generalPractitioner: 'Daktari wa Jumla',
      noProviders: 'Hakuna Wataalamu',
      noProvidersMessage: 'Wataalamu wote wako nje ya mtandao. Jaribu tena baadae.',
      disclaimer: 'Onyo: Hii ni ushauri wa msingi tu. Kwa dharura, piga 114.',
      min: 'dak',
    },
    en: {
      title: 'Talk to Doctor',
      availableProviders: 'Available Providers',
      available: 'Available',
      offline: 'Offline',
      responseTime: 'Response Time',
      consultations: 'Consultations',
      startChat: 'Start Chat',
      callNow: 'Call Now',
      videoCall: 'Video Call',
      typeMessage: 'Type a message...',
      send: 'Send',
      doctor: 'Doctor',
      nurse: 'Nurse',
      chw: 'CHW',
      specialist: 'Specialist',
      generalPractitioner: 'General Practitioner',
      noProviders: 'No Providers',
      noProvidersMessage: 'All providers are offline. Please try again later.',
      disclaimer: 'Disclaimer: This is basic guidance only. For emergencies, call 114.',
      min: 'min',
    },
  }[language];

  // Mock provider data (would come from API in production)
  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Amina Mwamba',
      role: language === 'sw' ? 'Daktari wa Jumla' : 'General Practitioner',
      specialty: language === 'sw' ? 'Huduma ya Kwanza' : 'Primary Care',
      available: true,
      responseTime: '5 ' + t.min,
      rating: 4.8,
      consultations: 342,
    },
    {
      id: '2',
      name: 'Nurse John Kilonzo',
      role: language === 'sw' ? 'Muuguzi Mkuu' : 'Senior Nurse',
      specialty: language === 'sw' ? 'Uzazi na Watoto' : 'Maternity & Pediatrics',
      available: true,
      responseTime: '3 ' + t.min,
      rating: 4.9,
      consultations: 567,
    },
    {
      id: '3',
      name: 'CHW Grace Mpemba',
      role: language === 'sw' ? 'CHW' : 'Community Health Worker',
      specialty: language === 'sw' ? 'Afya ya Jamii' : 'Community Health',
      available: false,
      responseTime: '10 ' + t.min,
      rating: 4.7,
      consultations: 189,
    },
  ];

  const availableProviders = providers.filter(p => p.available);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedProvider) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate provider response
    setTimeout(() => {
      const providerResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'provider',
        text: language === 'sw'
          ? 'Asante kwa ujumbe wako. Ninakusaidia sasa...'
          : 'Thank you for your message. I\'m helping you now...',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, providerResponse]);
    }, 2000);
  };

  if (selectedProvider && messages.length > 0) {
    // Chat View
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setMessages([]);
                }}
                className="w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                style={{ backgroundColor: colors.neutral[100] }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: colors.neutral[700] }} />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-[#1A1D23]">{selectedProvider.name}</h1>
                <p className="text-sm text-[#6B7280]">{selectedProvider.role}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                  <Phone className="w-5 h-5" style={{ color: colors.primary[500] }} />
                </button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                  <Video className="w-5 h-5" style={{ color: colors.primary[500] }} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                style={{
                  backgroundColor: message.sender === 'user' ? colors.primary[500] : '#FFFFFF',
                  color: message.sender === 'user' ? '#FFFFFF' : '#1A1D23',
                  border: message.sender === 'provider' ? `1px solid ${colors.neutral[200]}` : 'none',
                }}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.neutral[500],
                  }}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-3 bg-[#FFF9E6] border-t-2" style={{ borderColor: colors.warning[300] }}>
          <p className="text-xs text-center" style={{ color: colors.warning[800] }}>
            {t.disclaimer}
          </p>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-[#E5E7EB] px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typeMessage}
              className="flex-1 px-4 py-3 bg-[#F7F9FB] border border-[#E5E7EB] rounded-xl text-base focus:outline-none focus:border-[#0066CC]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-12 h-12 rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              style={{ backgroundColor: colors.primary[500] }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Provider Selection View
  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: colors.neutral[100] }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: colors.neutral[700] }} />
            </button>
            <h1 className="text-lg font-semibold text-[#1A1D23]">{t.title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {availableProviders.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.neutral[100] }}
            >
              <Stethoscope className="w-8 h-8" style={{ color: colors.neutral[500] }} />
            </div>
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-2">{t.noProviders}</h2>
            <p className="text-[#6B7280]">{t.noProvidersMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
              {t.availableProviders}
            </h2>

            <div className="space-y-4">
              {providers.map((provider) => (
                <MedicalCard key={provider.id}>
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: provider.available ? colors.primary[50] : colors.neutral[100] }}
                    >
                      <User className="w-7 h-7" style={{ color: provider.available ? colors.primary[500] : colors.neutral[500] }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-[#1A1D23]">{provider.name}</h3>
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: provider.available ? colors.success[50] : colors.neutral[100],
                            color: provider.available ? colors.success[700] : colors.neutral[600],
                          }}
                        >
                          {provider.available ? t.available : t.offline}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-1">{provider.role}</p>
                      <p className="text-sm text-[#6B7280] mb-3">{provider.specialty}</p>

                      <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{provider.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{provider.consultations} {t.consultations}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{provider.rating}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <MedicalButton
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setMessages([
                              {
                                id: '1',
                                sender: 'provider',
                                text: language === 'sw'
                                  ? `Habari! Mimi ni ${provider.name}. Ninawezaje kukusaidia leo?`
                                  : `Hello! I'm ${provider.name}. How can I help you today?`,
                                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                              },
                            ]);
                          }}
                          disabled={!provider.available}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t.startChat}
                        </MedicalButton>
                        <MedicalButton
                          variant="secondary"
                          size="sm"
                          disabled={!provider.available}
                        >
                          <Phone className="w-4 h-4" />
                          {t.callNow}
                        </MedicalButton>
                      </div>
                    </div>
                  </div>
                </MedicalCard>
              ))}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.warning[50], border: `1px solid ${colors.warning[200]}` }}>
          <p className="text-sm text-center" style={{ color: colors.warning[800] }}>
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
