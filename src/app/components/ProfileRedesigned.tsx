/**
 * Profile Screen - Control & Privacy
 * 
 * PURPOSE: User dignity, data control, safe on shared devices
 * 
 * CRITICAL REQUIREMENTS:
 * - AfyaID prominent with QR code
 * - PIN/biometric device security
 * - Auto-lock after 2 min inactivity
 * - Quick logout (<2 taps)
 * - Dependent profiles (caregiver mode)
 * - Data access log (PDPA compliance)
 * - Clear privacy controls
 * - Language toggle (immediate effect)
 * - No hidden settings
 * 
 * USER GROUPS:
 * - Patient (personal data control)
 * - Caregiver (manage dependents)
 * - CHW (professional profile)
 * - Clinic staff (facility profile)
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ProfileIcon,
  EmergencyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  InfoIcon,
  LockIcon,
  GlobeIcon,
  LogOutIcon,
} from './icons/MedicalIcons';
import { MedicalButton } from './ui/medical-button';
import {
  LIST_ITEM,
  prefersReducedMotion,
} from '@/app/styles/motion-tokens';

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  age: number;
  afyaId: string;
}

interface AccessLog {
  id: string;
  accessor: string;
  accessType: string;
  timestamp: string;
  facility: string;
}

interface ProfileProps {
  language: 'sw' | 'en';
  onBack: () => void;
  onNavigate: (route: string) => void;
  onLanguageChange: (lang: 'sw' | 'en') => void;
  onLogout: () => void;
  userData: {
    name: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    email?: string;
    afyaId: string;
    bloodType?: string;
    allergies: string[];
    chronicConditions: string[];
    emergencyContacts: Array<{
      name: string;
      relationship: string;
      phone: string;
    }>;
  };
  userRole: 'patient' | 'caregiver' | 'chw' | 'clinic';
  dependents?: Dependent[];
  linkedFacilities?: string[];
  primaryClinic?: string;
  assignedCHW?: string;
}

export function Profile({
  language,
  onBack,
  onNavigate,
  onLanguageChange,
  onLogout,
  userData,
  userRole,
  dependents = [],
  linkedFacilities = [],
  primaryClinic,
  assignedCHW,
}: ProfileProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  const content = {
    sw: {
      title: 'Profaili Yangu',
      subtitle: 'Taarifa binafsi na udhibiti wa data',
      sections: {
        afyaId: 'Nambari ya AfyaID',
        afyaIdDesc: 'Nambari yako ya kitaifa ya afya. Tumia katika vituo vyote.',
        showQR: 'Onyesha QR Code',
        hideQR: 'Ficha QR Code',
        personalInfo: 'Taarifa Binafsi',
        healthBasics: 'Taarifa za Afya',
        emergencyContacts: 'Wasiliani wa Dharura',
        careNetwork: 'Mtandao wa Huduma',
        dependents: 'Wategemezi',
        privacy: 'Faragha na Data',
        settings: 'Mipangilio',
        security: 'Usalama',
      },
      fields: {
        name: 'Jina',
        dateOfBirth: 'Tarehe ya Kuzaliwa',
        age: 'Umri',
        years: 'miaka',
        gender: 'Jinsia',
        phone: 'Simu',
        email: 'Barua Pepe',
        bloodType: 'Aina ya Damu',
        allergies: 'Mzio',
        noAllergies: 'Hakuna mzio',
        chronicConditions: 'Magonjwa ya Muda Mrefu',
        noConditions: 'Hakuna',
      },
      emergencyContact: {
        relationship: 'Uhusiano',
        addContact: 'Ongeza Mtu wa Kuwasiliana',
      },
      careNetwork: {
        primaryClinic: 'Kituo cha Msingi',
        assignedCHW: 'Mhudumu wa Afya Jamii',
        linkedFacilities: 'Vituo Vilivyounganishwa',
        noFacilities: 'Hakuna vituo',
      },
      dependents: {
        manage: 'Dhibiti Wategemezi',
        add: 'Ongeza Mtegemezi',
        noDependents: 'Hakuna wategemezi',
        viewProfile: 'Angalia Profaili',
      },
      privacy: {
        consentHistory: 'Historia ya Idhini',
        dataSharing: 'Shiriki Data',
        accessLog: 'Logi ya Upatikanaji',
        viewLog: 'Angalia Logi',
        exportData: 'Pakua Data Yako',
        lastAccessed: 'Ilipatikana Mwisho',
        by: 'na',
      },
      settings: {
        language: 'Lugha',
        kiswahili: 'Kiswahili',
        english: 'English',
        notifications: 'Taarifa',
        accessibility: 'Upatikanaji',
        fontSize: 'Ukubwa wa Herufi',
        highContrast: 'Mabadiliko Makubwa',
        voiceNav: 'Urambazaji wa Sauti',
      },
      security: {
        changePIN: 'Badilisha PIN',
        biometric: 'Kitambulisho cha Kibiolojia',
        enabled: 'Imewashwa',
        disabled: 'Imezimwa',
        autoLock: 'Kufunga Kiotomatiki',
        lockAfter: 'Funga baada ya',
        minutes: 'dakika',
      },
      logout: {
        button: 'Toka',
        title: 'Je, una uhakika unataka kutoka?',
        consequences: 'Utahitaji kuingia tena. Data yako ya nje ya mtandao itakaa salama.',
        clearData: 'Futa data ya ndani',
        keepData: 'Weka data ya nje ya mtandao',
        cancel: 'Ghairi',
        confirm: 'Thibitisha Kutoka',
      },
    },
    en: {
      title: 'My Profile',
      subtitle: 'Personal information and data control',
      sections: {
        afyaId: 'AfyaID Number',
        afyaIdDesc: 'Your national health ID. Use at all facilities.',
        showQR: 'Show QR Code',
        hideQR: 'Hide QR Code',
        personalInfo: 'Personal Information',
        healthBasics: 'Health Basics',
        emergencyContacts: 'Emergency Contacts',
        careNetwork: 'Care Network',
        dependents: 'Dependents',
        privacy: 'Privacy & Data',
        settings: 'Settings',
        security: 'Security',
      },
      fields: {
        name: 'Name',
        dateOfBirth: 'Date of Birth',
        age: 'Age',
        years: 'years',
        gender: 'Gender',
        phone: 'Phone',
        email: 'Email',
        bloodType: 'Blood Type',
        allergies: 'Allergies',
        noAllergies: 'No known allergies',
        chronicConditions: 'Chronic Conditions',
        noConditions: 'None',
      },
      emergencyContact: {
        relationship: 'Relationship',
        addContact: 'Add Contact',
      },
      careNetwork: {
        primaryClinic: 'Primary Clinic',
        assignedCHW: 'Community Health Worker',
        linkedFacilities: 'Linked Facilities',
        noFacilities: 'No facilities linked',
      },
      dependents: {
        manage: 'Manage Dependents',
        add: 'Add Dependent',
        noDependents: 'No dependents',
        viewProfile: 'View Profile',
      },
      privacy: {
        consentHistory: 'Consent History',
        dataSharing: 'Data Sharing',
        accessLog: 'Access Log',
        viewLog: 'View Log',
        exportData: 'Export Your Data',
        lastAccessed: 'Last Accessed',
        by: 'by',
      },
      settings: {
        language: 'Language',
        kiswahili: 'Kiswahili',
        english: 'English',
        notifications: 'Notifications',
        accessibility: 'Accessibility',
        fontSize: 'Font Size',
        highContrast: 'High Contrast',
        voiceNav: 'Voice Navigation',
      },
      security: {
        changePIN: 'Change PIN',
        biometric: 'Biometric',
        enabled: 'Enabled',
        disabled: 'Disabled',
        autoLock: 'Auto-Lock',
        lockAfter: 'Lock after',
        minutes: 'minutes',
      },
      logout: {
        button: 'Log Out',
        title: 'Are you sure you want to log out?',
        consequences: 'You will need to log in again. Your offline data will remain safe.',
        clearData: 'Clear local data',
        keepData: 'Keep offline data',
        cancel: 'Cancel',
        confirm: 'Confirm Logout',
      },
    },
  };

  const t = content[language];
  const reducedMotion = prefersReducedMotion();

  // Calculate age
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(userData.dateOfBirth);

  // Mock access logs
  const loadAccessLogs = () => {
    const mockLogs: AccessLog[] = [
      {
        id: '1',
        accessor: 'Dr. Sarah Johnson',
        accessType: 'Viewed records',
        timestamp: '2026-02-07T10:30:00',
        facility: 'Mwananyamala Hospital',
      },
      {
        id: '2',
        accessor: 'Nurse Amina',
        accessType: 'Updated medications',
        timestamp: '2026-02-06T14:15:00',
        facility: 'Temeke Health Center',
      },
      {
        id: '3',
        accessor: 'CHW John',
        accessType: 'Viewed summary',
        timestamp: '2026-02-05T09:00:00',
        facility: 'Community Visit',
      },
    ];
    setAccessLogs(mockLogs);
    setShowAccessLog(true);
  };

  // Logout Confirmation Modal
  if (showLogoutConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOutIcon size={32} color="#DC2626" />
            </div>
            <h2 className="text-xl font-semibold text-[#1E1E1E] mb-2">
              {t.logout.title}
            </h2>
            <p className="text-sm text-[#6B7280]">{t.logout.consequences}</p>
          </div>

          <div className="space-y-3 mb-6">
            <button className="w-full p-3 border-2 border-[#E5E7EB] rounded-lg hover:border-[#0F3D56] transition-colors text-left">
              <p className="text-sm font-medium text-[#1E1E1E]">
                {t.logout.keepData}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {language === 'sw'
                  ? 'Kwa ajili ya simu binafsi'
                  : 'For personal device'}
              </p>
            </button>

            <button className="w-full p-3 border-2 border-[#E5E7EB] rounded-lg hover:border-[#DC2626] transition-colors text-left">
              <p className="text-sm font-medium text-[#DC2626]">
                {t.logout.clearData}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {language === 'sw'
                  ? 'Kwa ajili ya simu inayoshirikiwa'
                  : 'For shared device'}
              </p>
            </button>
          </div>

          <div className="flex gap-3">
            <MedicalButton
              variant="secondary"
              size="md"
              onClick={() => setShowLogoutConfirm(false)}
              fullWidth
            >
              {t.logout.cancel}
            </MedicalButton>
            <MedicalButton
              variant="danger"
              size="md"
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout();
              }}
              fullWidth
            >
              {t.logout.confirm}
            </MedicalButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Emergency Button */}
      <div className="fixed top-4 right-4 z-50">
        <MedicalButton
          variant="danger"
          size="sm"
          onClick={() => onNavigate('emergency')}
          icon={<EmergencyIcon size={20} color="#FFFFFF" />}
        >
          {language === 'sw' ? 'Dharura' : 'Emergency'}
        </MedicalButton>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] pt-4 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B7280] mb-3"
          >
            <ChevronLeftIcon size={20} color="#6B7280" />
            <span className="text-sm">{language === 'sw' ? 'Rudi' : 'Back'}</span>
          </button>

          <h1 className="text-2xl font-semibold text-[#1E1E1E]">{t.title}</h1>
          <p className="text-sm text-[#6B7280] mt-1">{t.subtitle}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* AfyaID Card */}
        <motion.section
          {...(reducedMotion ? {} : LIST_ITEM(0))}
          className="bg-gradient-to-br from-[#0F3D56] to-[#1E88E5] rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">{t.sections.afyaId}</p>
              <p className="text-3xl font-bold tracking-wide">{userData.afyaId}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ProfileIcon size={24} color="#FFFFFF" />
            </div>
          </div>

          <p className="text-xs opacity-75 mb-4">{t.sections.afyaIdDesc}</p>

          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="text-sm underline"
          >
            {showQRCode ? t.sections.hideQR : t.sections.showQR}
          </button>

          {showQRCode && (
            <div className="mt-4 p-4 bg-white rounded-xl">
              <div className="w-32 h-32 bg-[#F7F9FB] mx-auto flex items-center justify-center">
                <p className="text-xs text-[#6B7280]">QR Code Placeholder</p>
              </div>
            </div>
          )}
        </motion.section>

        {/* Personal Information */}
        <Section title={t.sections.personalInfo} index={1}>
          <InfoRow label={t.fields.name} value={userData.name} />
          <InfoRow
            label={t.fields.dateOfBirth}
            value={`${new Date(userData.dateOfBirth).toLocaleDateString(
              language === 'sw' ? 'sw-TZ' : 'en-US'
            )} (${age} ${t.fields.years})`}
          />
          <InfoRow label={t.fields.gender} value={userData.gender} />
          <InfoRow label={t.fields.phone} value={userData.phone} />
          {userData.email && <InfoRow label={t.fields.email} value={userData.email} />}
        </Section>

        {/* Health Basics */}
        <Section title={t.sections.healthBasics} index={2}>
          {userData.bloodType && (
            <InfoRow label={t.fields.bloodType} value={userData.bloodType} />
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#6B7280]">{t.fields.allergies}:</p>
            {userData.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-sm rounded-lg"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">{t.fields.noAllergies}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#6B7280]">
              {t.fields.chronicConditions}:
            </p>
            {userData.chronicConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.chronicConditions.map((condition, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-sm rounded-lg"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">{t.fields.noConditions}</p>
            )}
          </div>
        </Section>

        {/* Emergency Contacts */}
        <Section title={t.sections.emergencyContacts} index={3}>
          {userData.emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="p-3 bg-[#F7F9FB] rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[#1E1E1E]">{contact.name}</p>
                <p className="text-xs text-[#6B7280]">{contact.relationship}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="text-sm text-[#0F3D56] font-medium"
              >
                {contact.phone}
              </a>
            </div>
          ))}
          <button className="w-full p-3 border-2 border-dashed border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#0F3D56] transition-colors">
            + {t.emergencyContact.addContact}
          </button>
        </Section>

        {/* Care Network */}
        <Section title={t.sections.careNetwork} index={4}>
          {primaryClinic && (
            <InfoRow label={t.careNetwork.primaryClinic} value={primaryClinic} />
          )}
          {assignedCHW && (
            <InfoRow label={t.careNetwork.assignedCHW} value={assignedCHW} />
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#6B7280]">
              {t.careNetwork.linkedFacilities}:
            </p>
            {linkedFacilities.length > 0 ? (
              <div className="space-y-2">
                {linkedFacilities.map((facility, i) => (
                  <p key={i} className="text-sm text-[#1E1E1E]">
                    • {facility}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">{t.careNetwork.noFacilities}</p>
            )}
          </div>
        </Section>

        {/* Dependents (Caregiver only) */}
        {userRole === 'caregiver' && (
          <Section title={t.sections.dependents} index={5}>
            {dependents.length > 0 ? (
              <div className="space-y-3">
                {dependents.map((dependent) => (
                  <button
                    key={dependent.id}
                    className="w-full p-3 bg-[#F7F9FB] rounded-lg flex items-center justify-between hover:bg-[#EFF6FF] transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {dependent.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {dependent.relationship} • {dependent.age} {t.fields.years}
                      </p>
                    </div>
                    <ChevronRightIcon size={20} color="#6B7280" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">{t.dependents.noDependents}</p>
            )}
            <button className="w-full p-3 border-2 border-dashed border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#0F3D56] transition-colors">
              + {t.dependents.add}
            </button>
          </Section>
        )}

        {/* Privacy & Data */}
        <Section title={t.sections.privacy} index={6}>
          <ActionButton
            label={t.privacy.accessLog}
            description={t.privacy.viewLog}
            onClick={loadAccessLogs}
          />
          <ActionButton
            label={t.privacy.exportData}
            description="PDPA Compliance"
            onClick={() => alert('Export data functionality')}
          />
        </Section>

        {/* Settings */}
        <Section title={t.sections.settings} index={7}>
          {/* Language Toggle */}
          <div className="p-3 bg-[#F7F9FB] rounded-lg">
            <p className="text-sm font-medium text-[#1E1E1E] mb-3">
              {t.settings.language}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('sw')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                  language === 'sw'
                    ? 'bg-[#0F3D56] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {t.settings.kiswahili}
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-[#0F3D56] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {t.settings.english}
              </button>
            </div>
          </div>

          <ActionButton
            label={t.settings.notifications}
            description="Manage notification preferences"
            onClick={() => {}}
          />
          <ActionButton
            label={t.settings.accessibility}
            description={`${t.settings.fontSize}, ${t.settings.highContrast}`}
            onClick={() => {}}
          />
        </Section>

        {/* Security */}
        <Section title={t.sections.security} index={8}>
          <ActionButton
            label={t.security.changePIN}
            description="Device security"
            onClick={() => {}}
          />
          <div className="p-3 bg-[#F7F9FB] rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1E1E1E]">
                {t.security.biometric}
              </p>
              <p className="text-xs text-[#6B7280]">{t.security.disabled}</p>
            </div>
            <button className="w-12 h-6 bg-[#E5E7EB] rounded-full"></button>
          </div>
          <div className="p-3 bg-[#F7F9FB] rounded-lg">
            <p className="text-sm font-medium text-[#1E1E1E] mb-1">
              {t.security.autoLock}
            </p>
            <p className="text-xs text-[#6B7280]">
              {t.security.lockAfter} 2 {t.security.minutes}
            </p>
          </div>
        </Section>

        {/* Logout Button */}
        <motion.div {...(reducedMotion ? {} : LIST_ITEM(9))}>
          <MedicalButton
            variant="danger"
            size="lg"
            onClick={() => setShowLogoutConfirm(true)}
            icon={<LogOutIcon size={20} color="#FFFFFF" />}
            fullWidth
          >
            {t.logout.button}
          </MedicalButton>
        </motion.div>
      </main>

      {/* Access Log Modal */}
      {showAccessLog && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">
                {t.privacy.accessLog}
              </h3>
              <button
                onClick={() => setShowAccessLog(false)}
                className="p-2 text-[#6B7280] hover:bg-[#F7F9FB] rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {accessLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#F7F9FB] rounded-lg border border-[#E5E7EB]"
                >
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    {log.accessType}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {t.privacy.by} {log.accessor} • {log.facility}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(log.timestamp).toLocaleString(
                      language === 'sw' ? 'sw-TZ' : 'en-US'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function Section({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.section
      {...(reducedMotion ? {} : LIST_ITEM(index))}
      className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
    >
      <div className="p-4 border-b border-[#E5E7EB] bg-[#F7F9FB]">
        <h2 className="font-semibold text-[#1E1E1E]">{title}</h2>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </motion.section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#6B7280]">{label}</p>
      <p className="text-sm font-medium text-[#1E1E1E]">{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  description,
  onClick,
}: {
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-[#F7F9FB] rounded-lg flex items-center justify-between hover:bg-[#EFF6FF] transition-colors"
    >
      <div className="text-left">
        <p className="text-sm font-medium text-[#1E1E1E]">{label}</p>
        <p className="text-xs text-[#6B7280]">{description}</p>
      </div>
      <ChevronRightIcon size={20} color="#6B7280" />
    </button>
  );
}
