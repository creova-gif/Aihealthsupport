/**
 * MessagesHub - Human Connection
 * Async-first, low bandwidth, clear response expectations
 * Connect with care team, CHWs, and receive updates
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Users,
  Bell,
  Stethoscope,
  Clock,
  CheckCheck,
  Circle,
  ArrowRight,
} from 'lucide-react';
import { Button } from './ui/button';

interface MessagesHubProps {
  language: 'sw' | 'en';
  userName?: string;
  unreadCount?: number;
}

interface MessageThread {
  id: string;
  type: 'care-team' | 'chw' | 'appointment' | 'system';
  sender: { sw: string; en: string };
  lastMessage: { sw: string; en: string };
  timestamp: string;
  unread: boolean;
  responseTime?: { sw: string; en: string };
}

export function MessagesHub({ language, userName, unreadCount = 0 }: MessagesHubProps) {
  // Mock message threads - in production, this would come from API
  const messageThreads: MessageThread[] = [
    {
      id: '1',
      type: 'care-team',
      sender: { sw: 'Dkt. Mwangi', en: 'Dr. Mwangi' },
      lastMessage: {
        sw: 'Matokeo yako ya damu yamepatikana. Kila kitu kiko sawa.',
        en: 'Your blood test results are ready. Everything looks good.',
      },
      timestamp: '2 hours ago',
      unread: true,
      responseTime: { sw: 'Kawaida hujibu ndani ya saa 4', en: 'Usually responds within 4 hours' },
    },
    {
      id: '2',
      type: 'appointment',
      sender: { sw: 'Mfumo wa Miadi', en: 'Appointment System' },
      lastMessage: {
        sw: 'Ukumbusho: Una miadi kesho saa 10:00 asubuhi',
        en: 'Reminder: You have an appointment tomorrow at 10:00 AM',
      },
      timestamp: '1 day ago',
      unread: false,
    },
  ];

  const getThreadIcon = (type: string) => {
    switch (type) {
      case 'care-team':
        return Stethoscope;
      case 'chw':
        return Users;
      case 'appointment':
        return Clock;
      case 'system':
        return Bell;
      default:
        return MessageCircle;
    }
  };

  const getThreadColor = (type: string) => {
    switch (type) {
      case 'care-team':
        return { color: '#1E88E5', bg: '#EFF6FF' };
      case 'chw':
        return { color: '#10B981', bg: '#ECFDF5' };
      case 'appointment':
        return { color: '#F59E0B', bg: '#FFFBEB' };
      case 'system':
        return { color: '#8B5CF6', bg: '#F5F3FF' };
      default:
        return { color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#1A1D23]">
              {language === 'sw' ? 'Ujumbe' : 'Messages'}
            </h1>
            {unreadCount > 0 && (
              <div className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {unreadCount} {language === 'sw' ? 'mpya' : 'new'}
              </div>
            )}
          </div>
          <p className="text-[#6B7280] text-base">
            {language === 'sw'
              ? 'Wasiliana na timu yako ya afya'
              : 'Connect with your care team'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Network Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0]"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-[#065F46]">
              {language === 'sw'
                ? 'Ujumbe utapokelewa hata kama mtandao ni dhaifu. Tutakuarifu unapojibiwa.'
                : 'Messages will be delivered even on low bandwidth. We\'ll notify you when you get a reply.'}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1D23] mb-3">
            {language === 'sw' ? 'Radhi za Haraka' : 'Quick actions'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-[#E5E7EB] hover:bg-[#FAFBFC]"
            >
              <Stethoscope className="w-6 h-6 text-[#1E88E5]" />
              <span className="text-sm font-medium text-[#1A1D23]">
                {language === 'sw' ? 'Wasiliana na Daktari' : 'Contact doctor'}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-[#E5E7EB] hover:bg-[#FAFBFC]"
            >
              <Users className="w-6 h-6 text-[#10B981]" />
              <span className="text-sm font-medium text-[#1A1D23]">
                {language === 'sw' ? 'Wasiliana na CHW' : 'Contact CHW'}
              </span>
            </Button>
          </div>
        </div>

        {/* Message Threads */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#1A1D23] mb-3">
            {language === 'sw' ? 'Mazungumzo' : 'Conversations'}
          </h2>
        </div>

        {messageThreads.length > 0 ? (
          <div className="space-y-3">
            {messageThreads.map((thread, index) => {
              const Icon = getThreadIcon(thread.type);
              const colors = getThreadColor(thread.type);

              return (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button className="w-full group">
                    <div
                      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 ${
                        thread.unread
                          ? 'border-[#1E88E5] bg-[#EFF6FF]'
                          : 'border-[#E5E7EB]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: colors.bg }}
                        >
                          <Icon className="w-6 h-6" style={{ color: colors.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-[#1A1D23]">
                              {thread.sender[language]}
                            </h3>
                            {thread.unread && (
                              <Circle className="w-2 h-2 fill-[#1E88E5] text-[#1E88E5]" />
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280] mb-2 line-clamp-2">
                            {thread.lastMessage[language]}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                            <span>{thread.timestamp}</span>
                            {thread.responseTime && (
                              <>
                                <span>•</span>
                                <span>{thread.responseTime[language]}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {thread.unread ? (
                            <ArrowRight className="w-5 h-5 text-[#1E88E5] group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <CheckCheck className="w-5 h-5 text-[#10B981]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
            <MessageCircle className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1A1D23] mb-2">
              {language === 'sw' ? 'Hakuna ujumbe bado' : 'No messages yet'}
            </h3>
            <p className="text-[#6B7280] text-sm">
              {language === 'sw'
                ? 'Ujumbe wako utaonekana hapa unapopokea'
                : 'Your messages will appear here when you receive them'}
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#1A1D23] mb-2">
            {language === 'sw' ? 'Jinsi Ujumbe Unavyofanya Kazi' : 'How messaging works'}
          </h3>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-start gap-2">
              <CheckCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span>
                {language === 'sw'
                  ? 'Ujumbe unapokelewa hata bila mtandao'
                  : 'Messages are delivered even offline'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span>
                {language === 'sw'
                  ? 'Madaktari wana saa 24 kujibu'
                  : 'Doctors have 24 hours to respond'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span>
                {language === 'sw'
                  ? 'CHW wana saa 4 kujibu'
                  : 'CHWs have 4 hours to respond'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
