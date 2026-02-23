/**
 * TestResultsViewer - View Lab and Test Results
 * 
 * ELITE STANDARD: Secure medical records viewer
 * HIPAA-style privacy with patient consent
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  FileText,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import { MedicalButton, MedicalCard, colors, StatusBadge } from '@/app/design-system';

interface TestResultsViewerProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface TestResult {
  id: string;
  type: string;
  date: string;
  status: 'normal' | 'abnormal' | 'pending';
  facility: string;
  results: { name: string; value: string; range: string; status: 'normal' | 'high' | 'low' }[];
}

export function TestResultsViewer({ language, onBack }: TestResultsViewerProps) {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const t = {
    sw: {
      title: 'Matokeo ya Maabara',
      recent: 'Matokeo ya Hivi Karibuni',
      viewDetails: 'Angalia Maelezo',
      download: 'Pakua',
      share: 'Shiriki',
      normal: 'Kawaida',
      abnormal: 'Si Kawaida',
      pending: 'Inasubiri',
      testName: 'Jina la Mtihani',
      result: 'Matokeo',
      normalRange: 'Kiwango cha Kawaida',
      status: 'Hali',
      testedAt: 'Imefanywa',
      contactDoctor: 'Wasiliana na Daktari',
      noResults: 'Hakuna Matokeo',
      noResultsMessage: 'Matokeo yako ya maabara yataonekana hapa.',
      back: 'Rudi',
      high: 'Juu',
      low: 'Chini',
    },
    en: {
      title: 'Test Results',
      recent: 'Recent Results',
      viewDetails: 'View Details',
      download: 'Download',
      share: 'Share',
      normal: 'Normal',
      abnormal: 'Abnormal',
      pending: 'Pending',
      testName: 'Test Name',
      result: 'Result',
      normalRange: 'Normal Range',
      status: 'Status',
      testedAt: 'Tested at',
      contactDoctor: 'Contact Doctor',
      noResults: 'No Results',
      noResultsMessage: 'Your lab results will appear here.',
      back: 'Back',
      high: 'High',
      low: 'Low',
    },
  }[language];

  // Mock test results (would come from secure API in production)
  const testResults: TestResult[] = [
    {
      id: '1',
      type: language === 'sw' ? 'Kipimo cha Damu Kamili' : 'Complete Blood Count (CBC)',
      date: '2026-02-20',
      status: 'normal',
      facility: language === 'sw' ? 'Hospitali ya Mwananyamala' : 'Mwananyamala Hospital',
      results: [
        { name: 'Hemoglobin', value: '14.2', range: '12-16 g/dL', status: 'normal' },
        { name: 'WBC', value: '7.5', range: '4-11 K/uL', status: 'normal' },
        { name: 'Platelets', value: '250', range: '150-400 K/uL', status: 'normal' },
      ],
    },
    {
      id: '2',
      type: language === 'sw' ? 'Mtihani wa Sukari ya Damu' : 'Blood Sugar Test',
      date: '2026-02-18',
      status: 'abnormal',
      facility: language === 'sw' ? 'Kituo cha Afya Kigogo' : 'Kigogo Health Center',
      results: [
        { name: 'Fasting Glucose', value: '126', range: '70-100 mg/dL', status: 'high' },
      ],
    },
    {
      id: '3',
      type: language === 'sw' ? 'Mtihani wa Malaria' : 'Malaria Test',
      date: '2026-02-15',
      status: 'normal',
      facility: language === 'sw' ? 'Zahanati ya Tandale' : 'Tandale Dispensary',
      results: [
        { name: 'Malaria Parasites', value: 'Negative', range: 'Negative', status: 'normal' },
      ],
    },
  ];

  const getStatusColor = (status: TestResult['status']) => {
    return status === 'normal'
      ? colors.success[500]
      : status === 'abnormal'
      ? colors.danger[500]
      : colors.warning[500];
  };

  const getStatusIcon = (status: TestResult['status']) => {
    return status === 'normal' ? CheckCircle : status === 'abnormal' ? AlertCircle : Clock;
  };

  const getResultStatusColor = (status: 'normal' | 'high' | 'low') => {
    return status === 'normal'
      ? colors.success[500]
      : status === 'high'
      ? colors.danger[500]
      : colors.warning[500];
  };

  if (selectedResult) {
    // Detail View
    const StatusIcon = getStatusIcon(selectedResult.status);
    return (
      <div className="min-h-screen bg-[#F7F9FB] pb-24">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedResult(null)}
                className="w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                style={{ backgroundColor: colors.neutral[100] }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: colors.neutral[700] }} />
              </button>
              <h1 className="text-lg font-semibold text-[#1A1D23]">{selectedResult.type}</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
          {/* Overall Status */}
          <MedicalCard>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getStatusColor(selectedResult.status)}10` }}
              >
                <StatusIcon className="w-6 h-6" style={{ color: getStatusColor(selectedResult.status) }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#6B7280] mb-1">{t.status}</p>
                <p className="text-xl font-semibold" style={{ color: getStatusColor(selectedResult.status) }}>
                  {selectedResult.status === 'normal' ? t.normal : selectedResult.status === 'abnormal' ? t.abnormal : t.pending}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {language === 'sw' ? 'Tarehe' : 'Date'}
                  </p>
                  <p className="font-medium text-[#1A1D23]">{selectedResult.date}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">{t.testedAt}</p>
                  <p className="font-medium text-[#1A1D23]">{selectedResult.facility}</p>
                </div>
              </div>
            </div>
          </MedicalCard>

          {/* Individual Results */}
          <div>
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
              {t.result}
            </h2>
            <div className="space-y-3">
              {selectedResult.results.map((result, idx) => (
                <MedicalCard key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#1A1D23]">{result.name}</p>
                    <span
                      className="text-sm font-medium px-2 py-1 rounded"
                      style={{
                        color: getResultStatusColor(result.status),
                        backgroundColor: `${getResultStatusColor(result.status)}10`,
                      }}
                    >
                      {result.status === 'normal' ? t.normal : result.status === 'high' ? t.high : t.low}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#6B7280]">{t.result}</p>
                      <p className="font-semibold text-[#1A1D23]">{result.value}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">{t.normalRange}</p>
                      <p className="font-semibold text-[#1A1D23]">{result.range}</p>
                    </div>
                  </div>
                </MedicalCard>
              ))}
            </div>
          </div>

          {/* Actions */}
          {selectedResult.status === 'abnormal' && (
            <MedicalCard style={{ backgroundColor: colors.danger[50], borderColor: colors.danger[200] }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.danger[500] }} />
                <div className="flex-1">
                  <p className="font-semibold text-[#1A1D23] mb-2">
                    {language === 'sw' ? 'Matokeo Yanahitaji Ufuatiliaji' : 'Results Need Follow-Up'}
                  </p>
                  <p className="text-sm text-[#6B7280] mb-4">
                    {language === 'sw'
                      ? 'Wasiliana na daktari wako kujadili matokeo haya.'
                      : 'Contact your doctor to discuss these results.'}
                  </p>
                  <MedicalButton variant="danger" size="sm">
                    {t.contactDoctor}
                  </MedicalButton>
                </div>
              </div>
            </MedicalCard>
          )}

          <div className="flex gap-3">
            <MedicalButton variant="secondary" size="md" fullWidth>
              <Download className="w-5 h-5" />
              {t.download}
            </MedicalButton>
            <MedicalButton variant="secondary" size="md" fullWidth>
              <Share2 className="w-5 h-5" />
              {t.share}
            </MedicalButton>
          </div>
        </div>
      </div>
    );
  }

  // List View
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
        {testResults.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.neutral[100] }}
            >
              <FileText className="w-8 h-8" style={{ color: colors.neutral[500] }} />
            </div>
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-2">{t.noResults}</h2>
            <p className="text-[#6B7280]">{t.noResultsMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
              {t.recent}
            </h2>

            <div className="space-y-4">
              {testResults.map((result) => {
                const StatusIcon = getStatusIcon(result.status);
                return (
                  <MedicalCard key={result.id}>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${getStatusColor(result.status)}10` }}
                      >
                        <StatusIcon className="w-6 h-6" style={{ color: getStatusColor(result.status) }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1A1D23] mb-1">{result.type}</h3>
                        <p className="text-sm text-[#6B7280] mb-2">{result.facility}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#6B7280]">{result.date}</span>
                          <span
                            className="font-medium"
                            style={{ color: getStatusColor(result.status) }}
                          >
                            {result.status === 'normal' ? t.normal : result.status === 'abnormal' ? t.abnormal : t.pending}
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={() => setSelectedResult(result)}
                        className="flex-shrink-0"
                      >
                        <MedicalButton variant="secondary" size="sm">
                          {t.viewDetails}
                        </MedicalButton>
                      </div>
                    </div>
                  </MedicalCard>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}