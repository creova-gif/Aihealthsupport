/**
 * CareJourneys - The Core Care Experience
 * Organized by human intent, not features
 * Each path is guided, step-by-step, with clear start → middle → end
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Stethoscope,
  Heart,
  Activity,
  FileText,
  Calendar,
  ArrowRight,
  Baby,
  Thermometer,
} from 'lucide-react';
import { Button } from './ui/button';

interface CareJourneysProps {
  language: 'sw' | 'en';
  userName?: string;
  onNavigate: (route: string) => void;
}

interface CarePathData {
  key: string;
  icon: React.ElementType;
  title: { sw: string; en: string };
  description: { sw: string; en: string };
  color: string;
  bgColor: string;
  route: string;
}

export function CareJourneys({ language, userName, onNavigate }: CareJourneysProps) {
  const carePaths: CarePathData[] = [
    {
      key: 'symptoms',
      icon: Thermometer,
      title: { sw: 'Nina Dalili', en: 'I have symptoms' },
      description: {
        sw: 'Fahamu dalili zako na pata ushauri wa haraka',
        en: 'Understand your symptoms and get quick guidance',
      },
      color: '#EF4444',
      bgColor: '#FEF2F2',
      route: 'symptom-checker',
    },
    {
      key: 'pregnancy',
      icon: Baby,
      title: { sw: 'Mimba & Mtoto', en: 'Pregnancy & child care' },
      description: {
        sw: 'Fuatilia uzazi na afya ya watoto',
        en: 'Track maternity and child health',
      },
      color: '#EC4899',
      bgColor: '#FDF2F8',
      route: 'maternal',
    },
    {
      key: 'conditions',
      icon: Activity,
      title: { sw: 'Magonjwa Yanayoendelea', en: 'Ongoing conditions' },
      description: {
        sw: 'Simamia magonjwa ya muda mrefu',
        en: 'Manage chronic conditions',
      },
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      route: 'conditions',
    },
    {
      key: 'records',
      icon: FileText,
      title: { sw: 'Matokeo & Rekodi', en: 'Test results & records' },
      description: {
        sw: 'Angalia matokeo ya vipimo na historia yako',
        en: 'View test results and your health history',
      },
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      route: 'records',
    },
    {
      key: 'appointments',
      icon: Calendar,
      title: { sw: 'Miadi Yangu', en: 'Appointments' },
      description: {
        sw: 'Panga na simamia miadi yako',
        en: 'Schedule and manage your appointments',
      },
      color: '#1E88E5',
      bgColor: '#EFF6FF',
      route: 'appointments',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1A1D23] mb-2">
            {language === 'sw' ? 'Huduma za Afya' : 'Care'}
          </h1>
          <p className="text-[#6B7280] text-base">
            {language === 'sw'
              ? 'Je, unahitaji msaada gani leo?'
              : 'What do you need help with today?'}
          </p>
        </div>
      </div>

      {/* Care Paths */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {carePaths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => onNavigate(path.route)}
                  className="w-full group"
                >
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-all duration-300 hover:border-[#CBD5E1]">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: path.bgColor }}
                      >
                        <Icon className="w-7 h-7" style={{ color: path.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-[#1A1D23] mb-1">
                          {path.title[language]}
                        </h3>
                        <p className="text-[#6B7280] text-sm">
                          {path.description[language]}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#1E88E5] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Access Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-[#1E88E5] to-[#1976D2] rounded-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                {language === 'sw' ? 'Hali ya Dharura?' : 'Emergency?'}
              </h3>
              <p className="text-white/90 text-sm mb-4">
                {language === 'sw'
                  ? 'Kwa hali ya dharura, wasiliana na huduma za dharura mara moja.'
                  : 'For emergencies, contact emergency services immediately.'}
              </p>
              <Button
                variant="outline"
                className="bg-white text-[#1E88E5] hover:bg-white/90 border-0"
                onClick={() => onNavigate('emergency')}
              >
                {language === 'sw' ? 'Piga Simu 112' : 'Call 112'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Reminder */}
        <div className="mt-6 p-4 bg-[#EFF6FF] rounded-xl border border-[#DBEAFE]">
          <p className="text-sm text-[#1E40AF] text-center">
            {language === 'sw' ? (
              <>
                <span className="font-medium">Kumbuka:</span> AI inasaidia, haibadilishi madaktari.
                Ushauri wetu unakusaidia kuelewa hatua zinazofuata.
              </>
            ) : (
              <>
                <span className="font-medium">Remember:</span> AI assists, not replaces doctors.
                Our guidance helps you understand next steps.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
