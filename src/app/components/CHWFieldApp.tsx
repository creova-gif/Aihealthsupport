/**
 * CHWFieldApp - Community Health Worker Offline Field Application
 * Capture household visits offline, triage, refer, sync later
 * 
 * System Prompt: You are the CHW field assistant. Provide a compact visit form,
 * perform on-device triage (same rules as USSD), produce a referral if needed,
 * queue attachments (photos/x-rays), and generate a printable / SMS referral
 * token for the patient. Store signed consent and keep audit logs.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Plus,
  Camera,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  WifiOff,
  Wifi,
  MapPin,
  User,
  Calendar,
  Clock,
  Upload,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from './ui/button';

interface CHWFieldAppProps {
  language: 'sw' | 'en';
  onBack: () => void;
  chwId: string;
  chwName: string;
}

interface Household {
  id: string;
  headName: string;
  address: string;
  members: number;
  lastVisit?: Date;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface HouseholdMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  relationship: string;
}

interface VisitRecord {
  id: string;
  householdId: string;
  patientId: string;
  patientName: string;
  symptoms: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  referralRequired: boolean;
  referralCode?: string;
  imageIds: string[];
  timestamp: Date;
  geoLocation?: { lat: number; lng: number };
  consentGiven: boolean;
  synced: boolean;
}

export function CHWFieldApp({ language, onBack, chwId, chwName }: CHWFieldAppProps) {
  const [view, setView] = useState<'households' | 'visit' | 'confirmation'>('households');
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [selectedMember, setSelectedMember] = useState<HouseholdMember | null>(null);
  const [visitData, setVisitData] = useState<Partial<VisitRecord>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);

  const content = {
    sw: {
      title: 'Programu ya CHW',
      subtitle: 'Rekodi za ziara za nyumbani',
      offline: 'Nje ya Mtandao',
      online: 'Kwenye Mtandao',
      pendingSync: 'Zinasubiri Kulandanishwa',
      households: 'Kaya',
      newVisit: 'Ziara Mpya',
      sync: 'Landanisha',
      householdList: 'Orodha ya Kaya',
      selectHousehold: 'Chagua Kaya',
      selectMember: 'Chagua Mgonjwa',
      members: 'Wanakaya',
      lastVisit: 'Ziara ya Mwisho',
      headOfHousehold: 'Mkuu wa Kaya',
      startVisit: 'Anza Ziara',
      visitForm: 'Fomu ya Ziara',
      symptoms: 'Dalili',
      selectSymptoms: 'Chagua dalili (zaidi ya moja)',
      fever: 'Homa',
      cough: 'Kikohozi',
      diarrhea: 'Kuhara',
      vomiting: 'Kutapika',
      breathing: 'Shida ya kupumua',
      pain: 'Maumivu',
      bleeding: 'Kutokwa na damu',
      weakness: 'Udhaifu',
      addPhoto: 'Ongeza Picha',
      consent: 'Ridhaa',
      consentText: 'Mgonjwa amekubali kushiriki taarifa na AfyaAI kwa ajili ya matibabu.',
      giveConsent: 'Toa Ridhaa',
      submitVisit: 'Wasilisha Ziara',
      riskAssessment: 'Tathmini ya Hatari',
      referralNeeded: 'Inahitaji Rufaa',
      referralCode: 'Nambari ya Rufaa',
      facility: 'Kituo',
      printReferral: 'Chapisha Rufaa',
      smsReferral: 'Tuma SMS',
      visitComplete: 'Ziara Imekamilika',
      visitSaved: 'Ziara imehifadhiwa. Itaandanishwa kituo kitakapopatikana.',
      newHouseholdVisit: 'Ziara Mpya ya Kaya',
      backToList: 'Rudi kwa Orodha',
      riskLevels: {
        LOW: 'Chini',
        MEDIUM: 'Wastani',
        HIGH: 'Juu',
      },
    },
    en: {
      title: 'CHW Field App',
      subtitle: 'Home visit records',
      offline: 'Offline',
      online: 'Online',
      pendingSync: 'Pending Sync',
      households: 'Households',
      newVisit: 'New Visit',
      sync: 'Sync',
      householdList: 'Household List',
      selectHousehold: 'Select Household',
      selectMember: 'Select Patient',
      members: 'Members',
      lastVisit: 'Last Visit',
      headOfHousehold: 'Head of Household',
      startVisit: 'Start Visit',
      visitForm: 'Visit Form',
      symptoms: 'Symptoms',
      selectSymptoms: 'Select symptoms (multiple)',
      fever: 'Fever',
      cough: 'Cough',
      diarrhea: 'Diarrhea',
      vomiting: 'Vomiting',
      breathing: 'Breathing difficulty',
      pain: 'Pain',
      bleeding: 'Bleeding',
      weakness: 'Weakness',
      addPhoto: 'Add Photo',
      consent: 'Consent',
      consentText: 'Patient consents to share information with AfyaAI for treatment.',
      giveConsent: 'Give Consent',
      submitVisit: 'Submit Visit',
      riskAssessment: 'Risk Assessment',
      referralNeeded: 'Referral Needed',
      referralCode: 'Referral Code',
      facility: 'Facility',
      printReferral: 'Print Referral',
      smsReferral: 'Send SMS',
      visitComplete: 'Visit Complete',
      visitSaved: 'Visit saved. Will sync when network is available.',
      newHouseholdVisit: 'New Household Visit',
      backToList: 'Back to List',
      riskLevels: {
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: 'High',
      },
    },
  };

  const t = content[language];

  // Mock households
  const mockHouseholds: Household[] = [
    {
      id: 'HH001',
      headName: 'Fatuma Hassan',
      address: 'Kariakoo, Mji wa Dar',
      members: 5,
      lastVisit: new Date('2026-01-15'),
      riskLevel: 'low',
    },
    {
      id: 'HH002',
      headName: 'John Mwangi',
      address: 'Kinondoni, Dar es Salaam',
      members: 4,
      lastVisit: new Date('2026-01-20'),
      riskLevel: 'medium',
    },
    {
      id: 'HH003',
      headName: 'Grace Kimani',
      address: 'Temeke, Dar es Salaam',
      members: 6,
      lastVisit: undefined,
      riskLevel: 'high',
    },
  ];

  // Mock household members
  const mockMembers: HouseholdMember[] = [
    { id: 'M001', name: 'Fatuma Hassan', age: 45, gender: 'F', relationship: 'Head' },
    { id: 'M002', name: 'Hassan Ali', age: 50, gender: 'M', relationship: 'Spouse' },
    { id: 'M003', name: 'Amina Hassan', age: 12, gender: 'F', relationship: 'Daughter' },
    { id: 'M004', name: 'Omar Hassan', age: 8, gender: 'M', relationship: 'Son' },
    { id: 'M005', name: 'Zainab Hassan', age: 3, gender: 'F', relationship: 'Daughter' },
  ];

  const symptomOptions = [
    { value: 'fever', label: { sw: t.fever, en: 'Fever' } },
    { value: 'cough', label: { sw: t.cough, en: 'Cough' } },
    { value: 'diarrhea', label: { sw: t.diarrhea, en: 'Diarrhea' } },
    { value: 'vomiting', label: { sw: t.vomiting, en: 'Vomiting' } },
    { value: 'breathing', label: { sw: t.breathing, en: 'Breathing difficulty' } },
    { value: 'pain', label: { sw: t.pain, en: 'Pain' } },
    { value: 'bleeding', label: { sw: t.bleeding, en: 'Bleeding' } },
    { value: 'weakness', label: { sw: t.weakness, en: 'Weakness' } },
  ];

  const computeRisk = (symptoms: string[], age: number): 'LOW' | 'MEDIUM' | 'HIGH' => {
    const highRiskSymptoms = ['bleeding', 'breathing'];
    const moderateRiskSymptoms = ['fever', 'vomiting', 'diarrhea'];
    const isChild = age < 5;
    const isElderly = age > 60;

    if (symptoms.some(s => highRiskSymptoms.includes(s))) {
      return 'HIGH';
    }
    if (isChild || isElderly || symptoms.some(s => moderateRiskSymptoms.includes(s))) {
      return 'MEDIUM';
    }
    return 'LOW';
  };

  const handleSubmitVisit = () => {
    if (!selectedMember || !visitData.symptoms || visitData.symptoms.length === 0) {
      alert(language === 'sw' ? 'Tafadhali jaza taarifa zote' : 'Please fill all information');
      return;
    }

    const risk = computeRisk(visitData.symptoms, selectedMember.age);
    const referralNeeded = risk === 'HIGH' || risk === 'MEDIUM';
    const referralCode = referralNeeded ? `CHW-${Date.now().toString().slice(-6)}` : undefined;

    const visit: VisitRecord = {
      id: `V${Date.now()}`,
      householdId: selectedHousehold!.id,
      patientId: selectedMember.id,
      patientName: selectedMember.name,
      symptoms: visitData.symptoms,
      riskLevel: risk,
      referralRequired: referralNeeded,
      referralCode,
      imageIds: visitData.imageIds || [],
      timestamp: new Date(),
      geoLocation: { lat: -6.7924, lng: 39.2083 }, // Mock GPS
      consentGiven: visitData.consentGiven || false,
      synced: false,
    };

    setVisitData(visit);
    setView('confirmation');
    setPendingSyncCount(prev => prev + 1);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' };
      case 'MEDIUM':
        return { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' };
      case 'LOW':
        return { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  // Households List View
  if (view === 'households') {
    return (
      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">{t.title}</h1>
                </div>
                <p className="text-white/90 text-sm">CHW: {chwName}</p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {isOnline ? t.online : t.offline}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        {pendingSyncCount > 0 && (
          <div className="bg-[#FFFBEB] border-b border-[#FDE68A]">
            <div className="max-w-4xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm font-medium text-[#92400E]">
                    {pendingSyncCount} {t.pendingSync}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    if (isOnline) {
                      alert(language === 'sw' ? 'Kuandanisha...' : 'Syncing...');
                      setTimeout(() => setPendingSyncCount(0), 2000);
                    } else {
                      alert(language === 'sw' ? 'Hakuna mtandao' : 'No network');
                    }
                  }}
                  size="sm"
                  variant="outline"
                  className="border-[#F59E0B] text-[#F59E0B]"
                  disabled={!isOnline}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.sync}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">{t.householdList}</h2>

          <div className="space-y-4">
            {mockHouseholds.map((household, index) => {
              const riskColors = household.riskLevel ? getRiskColor(household.riskLevel.toUpperCase()) : null;

              return (
                <motion.div
                  key={household.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A1D23] mb-1">
                        {household.headName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{household.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{household.members} {t.members}</span>
                        </div>
                      </div>
                      {household.lastVisit && (
                        <p className="text-xs text-[#6B7280] mt-2">
                          {t.lastVisit}:{' '}
                          {household.lastVisit.toLocaleDateString(
                            language === 'sw' ? 'sw-TZ' : 'en-US'
                          )}
                        </p>
                      )}
                    </div>
                    {riskColors && (
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: riskColors.bg,
                          color: riskColors.text,
                          borderColor: riskColors.border,
                          borderWidth: '1px',
                        }}
                      >
                        {household.riskLevel?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedHousehold(household);
                      setView('visit');
                    }}
                    className="w-full bg-[#43A047] hover:bg-[#2E7D32]"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t.startVisit}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Visit Form View
  if (view === 'visit' && selectedHousehold) {
    const selectedSymptoms = visitData.symptoms || [];

    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={() => setView('households')}
              className="flex items-center gap-2 mb-4 text-[#6B7280] hover:text-[#1A1D23] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t.backToList}</span>
            </button>

            <h1 className="text-2xl font-bold text-[#1A1D23] mb-1">{t.visitForm}</h1>
            <p className="text-[#6B7280]">
              {t.headOfHousehold}: {selectedHousehold.headName}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {/* Select Member */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">{t.selectMember}</h2>
            <div className="grid grid-cols-2 gap-3">
              {mockMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMember?.id === member.id
                      ? 'border-[#43A047] bg-[#F1F8E9]'
                      : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#6B7280]" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#1A1D23]">{member.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {member.age} {language === 'sw' ? 'miaka' : 'years'} •{' '}
                        {member.relationship}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedMember && (
            <>
              {/* Symptoms */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#1A1D23] mb-2">{t.symptoms}</h2>
                <p className="text-sm text-[#6B7280] mb-4">{t.selectSymptoms}</p>
                <div className="grid grid-cols-2 gap-3">
                  {symptomOptions.map(symptom => (
                    <button
                      key={symptom.value}
                      onClick={() => {
                        const newSymptoms = selectedSymptoms.includes(symptom.value)
                          ? selectedSymptoms.filter(s => s !== symptom.value)
                          : [...selectedSymptoms, symptom.value];
                        setVisitData({ ...visitData, symptoms: newSymptoms });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedSymptoms.includes(symptom.value)
                          ? 'border-[#43A047] bg-[#F1F8E9]'
                          : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedSymptoms.includes(symptom.value) && (
                          <CheckCircle className="w-5 h-5 text-[#43A047]" />
                        )}
                        <span className="text-sm font-medium text-[#1A1D23]">
                          {symptom.label[language]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">
                  {t.addPhoto}{' '}
                  <span className="text-sm font-normal text-[#6B7280]">
                    ({language === 'sw' ? 'Hiari' : 'Optional'})
                  </span>
                </h2>
                <Button variant="outline" className="w-full h-24 border-dashed">
                  <Camera className="w-8 h-8 text-[#6B7280]" />
                </Button>
              </div>

              {/* Consent */}
              <div className="bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] p-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-[#1A1D23] mb-2">
                      {t.consent}
                    </h3>
                    <p className="text-sm text-[#1E40AF]">{t.consentText}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setVisitData({ ...visitData, consentGiven: true })}
                  variant={visitData.consentGiven ? 'default' : 'outline'}
                  className={
                    visitData.consentGiven
                      ? 'w-full bg-[#43A047] hover:bg-[#2E7D32]'
                      : 'w-full'
                  }
                >
                  {visitData.consentGiven && <CheckCircle className="w-5 h-5 mr-2" />}
                  {visitData.consentGiven
                    ? language === 'sw'
                      ? 'Ridhaa Imetolewa'
                      : 'Consent Given'
                    : t.giveConsent}
                </Button>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmitVisit}
                disabled={!visitData.consentGiven || selectedSymptoms.length === 0}
                className="w-full h-14 bg-[#43A047] hover:bg-[#2E7D32] text-base font-semibold"
              >
                <Send className="w-5 h-5 mr-2" />
                {t.submitVisit}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Confirmation View
  if (view === 'confirmation' && visitData.riskLevel) {
    const colors = getRiskColor(visitData.riskLevel);

    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-2xl font-bold text-[#1A1D23]">{t.visitComplete}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
          {/* Risk Assessment */}
          <div
            className="rounded-2xl border-2 p-6"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
              {t.riskAssessment}
            </p>
            <h2 className="text-4xl font-bold" style={{ color: colors.text }}>
              {t.riskLevels[visitData.riskLevel]}
            </h2>
          </div>

          {/* Referral Info */}
          {visitData.referralRequired && visitData.referralCode && (
            <>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-4">
                  {t.referralNeeded}
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#FAFBFC] rounded-lg">
                    <p className="text-sm text-[#6B7280] mb-1">{t.referralCode}</p>
                    <p className="font-mono text-2xl font-bold text-[#1A1D23]">
                      {visitData.referralCode}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFBFC] rounded-lg">
                    <p className="text-sm text-[#6B7280] mb-1">{t.facility}</p>
                    <p className="text-base font-medium text-[#1A1D23]">
                      {language === 'sw'
                        ? 'Kituo cha Afya Kariakoo'
                        : 'Kariakoo Health Centre'}
                    </p>
                    <p className="text-sm text-[#6B7280]">HFR-005678</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <FileText className="w-5 h-5 mr-2" />
                  {t.printReferral}
                </Button>
                <Button className="h-12 bg-[#1E88E5] hover:bg-[#1976D2]">
                  <Send className="w-5 h-5 mr-2" />
                  {t.smsReferral}
                </Button>
              </div>
            </>
          )}

          {/* Save Status */}
          <div className="bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
              <p className="text-sm text-[#065F46]">{t.visitSaved}</p>
            </div>
          </div>

          {/* New Visit */}
          <Button
            onClick={() => {
              setView('households');
              setSelectedHousehold(null);
              setSelectedMember(null);
              setVisitData({});
            }}
            className="w-full h-12 bg-[#43A047] hover:bg-[#2E7D32]"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.newHouseholdVisit}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
