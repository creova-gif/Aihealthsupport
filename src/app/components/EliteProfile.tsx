/**
 * EliteProfile - WORLD-CLASS REDESIGN
 * 
 * DESIGN PRINCIPLES:
 * - Privacy controls at top (not buried)
 * - One-tap logout (always visible)
 * - 3 main sections only (consolidated)
 * - Clear data sharing controls
 * - Institutional design
 * - Zero decorative elements
 * 
 * COMPARED TO: NHS App profile, Apple Health profile
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  FileText,
  ChevronRight,
  LogOut,
  Settings,
  Eye,
  Globe,
} from 'lucide-react';
import {
  PageHeader,
  StatusBadge,
  UrgencyCard,
  colors,
} from '@/app/design-system';
import { useApp } from '@/app/context/AppContext';
import { useSharedDevice } from '../context/SharedDeviceContext';

interface EliteProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export function EliteProfile({ onBack, onLogout }: EliteProfileProps) {
  const { language, setLanguage, userData } = useApp();
  const { isSharedDevice } = useSharedDevice();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const content = {
    sw: {
      title: 'Wasifu',
      subtitle: 'Mipangilio na taarifa zako',
      personalInfo: 'Taarifa Binafsi',
      medicalInfo: 'Taarifa ya Kiafya',
      privacySettings: 'Mipangilio ya Faragha',
      name: 'Jina',
      phone: 'Simu',
      region: 'Mkoa',
      bloodType: 'Aina ya Damu',
      allergies: 'Mzio',
      conditions: 'Hali',
      whoHasAccess: 'Nani Ana Ruhusa?',
      dataSharing: 'Ushiriki wa Data',
      viewAccessLog: 'Angalia Logi',
      language: 'Lugha',
      sharedDevice: 'Kifaa Kinashirikiwa',
      sharedDeviceDesc: 'Ondoka baada ya matumizi',
      logout: 'Ondoka',
      logoutConfirm: 'Una uhakika unataka kuondoka?',
      cancel: 'Ghairi',
      edit: 'Hariri',
      view: 'Angalia',
      english: 'English',
      swahili: 'Kiswahili',
    },
    en: {
      title: 'Profile',
      subtitle: 'Your settings and information',
      personalInfo: 'Personal Information',
      medicalInfo: 'Medical Information',
      privacySettings: 'Privacy Settings',
      name: 'Name',
      phone: 'Phone',
      region: 'Region',
      bloodType: 'Blood Type',
      allergies: 'Allergies',
      conditions: 'Conditions',
      whoHasAccess: 'Who Has Access?',
      dataSharing: 'Data Sharing',
      viewAccessLog: 'View Access Log',
      language: 'Language',
      sharedDevice: 'Shared Device',
      sharedDeviceDesc: 'Log out after use',
      logout: 'Log Out',
      logoutConfirm: 'Are you sure you want to log out?',
      cancel: 'Cancel',
      edit: 'Edit',
      view: 'View',
      english: 'English',
      swahili: 'Kiswahili',
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={onBack}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Shared Device Warning (if applicable) */}
        {isSharedDevice && (
          <UrgencyCard
            level="warning"
            title={t.sharedDevice}
            description={t.sharedDeviceDesc}
            icon={Shield}
          />
        )}

        {/* SECTION 1: PERSONAL INFO */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
              {t.personalInfo}
            </h2>
            <button className="text-sm font-medium" style={{ color: colors.primary[500] }}>
              {t.edit}
            </button>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#E5E7EB] divide-y divide-[#E5E7EB]">
            <InfoRow label={t.name} value={userData?.name || 'Jane Mwangi'} />
            <InfoRow label={t.phone} value={userData?.phone || '+255 712 345 678'} />
            <InfoRow label={t.region} value="Dar es Salaam" />
          </div>
        </section>

        {/* SECTION 2: MEDICAL INFO */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
              {t.medicalInfo}
            </h2>
            <button className="text-sm font-medium" style={{ color: colors.primary[500] }}>
              {t.edit}
            </button>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#E5E7EB] divide-y divide-[#E5E7EB]">
            <InfoRow label={t.bloodType} value="O+" />
            <InfoRow label={t.allergies} value={language === 'sw' ? 'Penicillin' : 'Penicillin'} />
            <InfoRow label={t.conditions} value={language === 'sw' ? 'Hakuna' : 'None'} />
          </div>
        </section>

        {/* SECTION 3: PRIVACY & SETTINGS */}
        <section>
          <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {t.privacySettings}
          </h2>

          <div className="space-y-3">
            {/* Who Has Access */}
            <button
              onClick={() => {/* Navigate to access management */}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                  <Eye className="w-5 h-5" style={{ color: colors.primary[500] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.whoHasAccess}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Data Sharing */}
            <button
              onClick={() => {/* Navigate to data sharing */}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                  <Shield className="w-5 h-5" style={{ color: colors.neutral[700] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.dataSharing}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Access Log */}
            <button
              onClick={() => {/* Navigate to access log */}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                  <FileText className="w-5 h-5" style={{ color: colors.neutral[700] }} strokeWidth={2} />
                </div>
                <span className="font-medium text-[#1A1D23]">{t.viewAccessLog}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </button>

            {/* Language Toggle */}
            <div className="p-4 bg-white border-2 border-[#E5E7EB] rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                    <Globe className="w-5 h-5" style={{ color: colors.neutral[700] }} strokeWidth={2} />
                  </div>
                  <span className="font-medium text-[#1A1D23]">{t.language}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('sw')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      language === 'sw'
                        ? 'text-white'
                        : 'text-[#6B7280] bg-[#F3F4F6]'
                    }`}
                    style={{
                      backgroundColor: language === 'sw' ? colors.primary[500] : undefined,
                    }}
                  >
                    {t.swahili}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'text-white'
                        : 'text-[#6B7280] bg-[#F3F4F6]'
                    }`}
                    style={{
                      backgroundColor: language === 'en' ? colors.primary[500] : undefined,
                    }}
                  >
                    {t.english}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT - Always visible, one tap */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full p-4 bg-white border-2 rounded-xl text-left flex items-center justify-between active:scale-[0.99] transition-transform"
          style={{
            borderColor: colors.danger[500],
            minHeight: '64px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.danger[50] }}>
              <LogOut className="w-5 h-5" style={{ color: colors.danger[500] }} strokeWidth={2} />
            </div>
            <span className="font-semibold" style={{ color: colors.danger[500] }}>
              {t.logout}
            </span>
          </div>
        </button>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <p className="text-lg font-semibold text-[#1A1D23] mb-4">
                {t.logoutConfirm}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 bg-[#F3F4F6] rounded-lg font-medium text-[#6B7280]"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: colors.danger[500] }}
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <span className="text-sm font-medium text-[#6B7280]">{label}</span>
      <span className="text-sm font-semibold text-[#1A1D23]">{value}</span>
    </div>
  );
}
