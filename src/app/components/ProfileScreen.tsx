import React, { useState } from 'react';
import {
  ChevronLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Heart,
  FileText,
  Eye,
  Settings,
  LogOut,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useApp } from '@/app/context/AppContext';
import { useSharedDevice } from '../context/SharedDeviceContext';
import {
  PageHeader,
  SectionHeader,
  UrgencyCard,
  colors,
} from '@/app/design-system';

const translations = {
  sw: {
    title: 'Wasifu',
    subtitle: 'Taarifa zako na mipangilio',
    personalInfo: 'Taarifa Binafsi',
    medicalInfo: 'Taarifa ya Kiafya',
    emergencyContacts: 'Anwani za Dharura',
    privacySharing: 'Faragha na Ushiriki',
    settings: 'Mipangilio',
    logout: 'Ondoka',
    name: 'Jina',
    region: 'Mkoa',
    phone: 'Simu',
    email: 'Barua pepe',
    dob: 'Tarehe ya Kuzaliwa',
    bloodType: 'Aina ya Damu',
    allergies: 'Mzio',
    conditions: 'Hali za Afya',
    medications: 'Dawa',
    viewRecords: 'Angalia Kumbukumbu',
    addContact: 'Ongeza Anwani',
    whoHasAccess: 'Nani Ana Ruhusa?',
    dataSharing: 'Ushiriki wa Data',
    viewAccessLog: 'Angalia Logi ya Upatikanaji',
    language: 'Lugha',
    deviceMode: 'Aina ya Kifaa',
    dataProtected: 'Taarifa zako zimehifadhiwa salama',
    pdpaCompliant: 'Tunafuata sheria za PDPA na TMDA',
    logoutWarning: 'Unataka kuondoka?',
    sharedDeviceWarning: 'Kifaa kinashirikiwa - Ondoka baada ya matumizi',
    edit: 'Hariri',
    add: 'Ongeza',
    view: 'Angalia',
  },
  en: {
    title: 'Profile',
    subtitle: 'Your information and settings',
    personalInfo: 'Personal Info',
    medicalInfo: 'Medical Info',
    emergencyContacts: 'Emergency Contacts',
    privacySharing: 'Privacy & Sharing',
    settings: 'Settings',
    logout: 'Log Out',
    name: 'Name',
    region: 'Region',
    phone: 'Phone',
    email: 'Email',
    dob: 'Date of Birth',
    bloodType: 'Blood Type',
    allergies: 'Allergies',
    conditions: 'Conditions',
    medications: 'Medications',
    viewRecords: 'View Records',
    addContact: 'Add Contact',
    whoHasAccess: 'Who Has Access?',
    dataSharing: 'Data Sharing',
    viewAccessLog: 'View Access Log',
    language: 'Language',
    deviceMode: 'Device Mode',
    dataProtected: 'Your data is protected',
    pdpaCompliant: 'We comply with PDPA and TMDA regulations',
    logoutWarning: 'Do you want to log out?',
    sharedDeviceWarning: 'Shared device - Log out after use',
    edit: 'Edit',
    add: 'Add',
    view: 'View',
  },
};

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const { language, userData } = useApp();
  const { isSharedDevice, activityLog } = useSharedDevice();
  const t = translations[language];
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* PageHeader from Design System */}
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        onBack={onBack}
        backLabel={language === 'sw' ? 'Rudi' : 'Back'}
      />

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Profile Header - Simplified */}
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-[#1A1D23] mb-1">
                {userData?.name || 'Mgonjwa'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <MapPin className="w-4 h-4" />
                <span>{userData?.region || 'Dar es Salaam'}</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice - Compact */}
          <div className="mt-4 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981] flex-shrink-0" />
              <p className="text-xs text-[#065F46]">
                {t.dataProtected} • {t.pdpaCompliant}
              </p>
            </div>
          </div>
        </div>

        {/* 1. PERSONAL INFO */}
        <ProfileSection
          title={t.personalInfo}
          icon={User}
          items={[
            { icon: Phone, label: t.phone, value: '+255 712 345 678' },
            { icon: Mail, label: t.email, value: 'user@example.com' },
            { icon: Calendar, label: t.dob, value: 'Jan 15, 1990' },
          ]}
          action={{ label: t.edit, onClick: () => {} }}
        />

        {/* 2. MEDICAL INFO */}
        <ProfileSection
          title={t.medicalInfo}
          icon={Heart}
          items={[
            { icon: Heart, label: t.bloodType, value: 'O+', highlight: true },
            { icon: AlertTriangle, label: t.allergies, value: 'Penicillin', highlight: true },
            { icon: FileText, label: t.medications, value: '2 active' },
          ]}
          action={{ label: t.viewRecords, onClick: () => {} }}
        />

        {/* 3. EMERGENCY CONTACTS */}
        <ProfileSection
          title={t.emergencyContacts}
          icon={Phone}
          items={[
            { icon: User, label: 'Primary', value: 'John Doe (+255 712 000 000)' },
          ]}
          action={{ label: t.addContact, onClick: () => {} }}
        />

        {/* 4. PRIVACY & SHARING */}
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {t.privacySharing}
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => {}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#1E88E5]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1D23]">
                    {t.whoHasAccess}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {language === 'sw' ? '2 vituo vina ruhusa' : '2 facilities have access'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => {}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F5F3FF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1D23]">
                    {t.viewAccessLog}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {activityLog.length} {language === 'sw' ? 'tukio' : 'events'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* 5. SETTINGS */}
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {t.settings}
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => {}}
              className="w-full p-4 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFFBEB] rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#F59E0B]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1D23]">
                    {t.language}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {language === 'sw' ? 'Kiswahili' : 'English'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {isSharedDevice && (
              <div className="p-4 bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DC2626] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#991B1B]">
                      {t.deviceMode}
                    </p>
                    <p className="text-xs text-[#991B1B]">
                      {language === 'sw' ? 'Kifaa Kinachoshirikiwa' : 'Shared Device'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. LOG OUT - PROMINENT RED BUTTON */}
        <div className="pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full p-4 bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-base font-semibold text-white">{t.logout}</p>
              <ChevronRight className="w-5 h-5 text-white/80 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* App Version - Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-[#9CA3AF]">
            AfyaCare Tanzania v1.0.0 • {language === 'sw' ? 'Februari 2026' : 'February 2026'}
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">
              {t.logoutWarning}
            </h3>
            {isSharedDevice && (
              <p className="text-sm text-[#DC2626] mb-4">
                {language === 'sw'
                  ? 'Data yako itafutwa kiotomatiki kwa usalama'
                  : 'Your data will be automatically cleared for security'}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowLogoutConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                {language === 'sw' ? 'Endelea' : 'Cancel'}
              </Button>
              <Button
                onClick={onLogout}
                className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Profile Section Component
function ProfileSection({
  title,
  icon: Icon,
  items,
  action,
}: {
  title: string;
  icon: React.ElementType;
  items: Array<{
    icon: React.ElementType;
    label: string;
    value: string;
    highlight?: boolean;
  }>;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl space-y-4">
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <ItemIcon className="w-5 h-5 text-[#6B7280]" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">{item.label}</p>
                <p
                  className={`text-sm font-medium ${
                    item.highlight ? 'text-[#DC2626]' : 'text-[#1A1D23]'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
        <button
          onClick={action.onClick}
          className="w-full mt-2 py-2 text-sm font-medium text-[#1E88E5] hover:text-[#1976D2] transition-colors"
        >
          {action.label}
        </button>
      </div>
    </div>
  );
}