/**
 * CREOVA Health OS - Improved Patient Chart
 * 
 * PHASE 1 UX IMPROVEMENTS:
 * - Collapsible AI panel (25% more screen space)
 * - Compact patient header (80px vs 140px)
 * - Reduced tabs (3 vs 6): Summary, History, Admin
 * - Responsive adaptive layout
 * - One-tap complete visit
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, FileText, Clock, DollarSign } from 'lucide-react';

const COLORS = {
  primary: '#0F3D56',
  teal: '#1B998B',
  tealLight: '#E8F5F3',
  red: '#DC2626',
  redLight: '#FEE2E2',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  green: '#059669',
  greenLight: '#D1FAE5',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral400: '#9CA3AF',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral900: '#111827',
  white: '#FFFFFF',
};

const TABS = [
  { id: 'summary', label: 'Summary', labelSw: 'Muhtasari', icon: '📋', description: 'Current visit + key info' },
  { id: 'history', label: 'History', labelSw: 'Historia', icon: '📚', description: 'Past visits, labs, medications' },
  { id: 'admin', label: 'Admin', labelSw: 'Usimamizi', icon: '📄', description: 'Billing, insurance, files' },
];

export default function PatientChartImproved() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [activeTab, setActiveTab] = useState('summary');
  const [showAI, setShowAI] = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(false);

  // Mock patient data
  const patient = {
    name: 'Amina Juma',
    age: 28,
    sex: 'F',
    id: 'P-0012',
    phone: '+255 754 123 456',
    insurance: 'NHIF-123456789',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Gestational hypertension'],
    pregnant: true,
    gestationWeeks: 32,
    bloodType: 'O+',
    nextOfKin: 'Hassan Juma',
  };

  const vitals = {
    bp: '165/110',
    hr: 98,
    temp: 37.2,
    spo2: 98,
    weight: 75,
    height: 160,
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: COLORS.neutral50,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Top Bar */}
      <div style={{
        height: 56,
        background: COLORS.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ margin: 0, color: COLORS.white, fontSize: 18, fontWeight: 600 }}>
            {language === 'en' ? 'Patient Chart' : 'Kadi ya Mgonjwa'}
          </h1>
        </div>

        <button
          onClick={() => setLanguage(lang => lang === 'en' ? 'sw' : 'en')}
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            color: COLORS.white,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {language === 'en' ? '🇬🇧 English' : '🇹🇿 Kiswahili'}
        </button>
      </div>

      {/* COMPACT PATIENT HEADER (80px) */}
      <div style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.neutral200}`,
        padding: '12px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Photo */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            background: COLORS.tealLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 600,
            color: COLORS.teal,
            flexShrink: 0,
          }}>
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Compact Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.neutral900 }}>
                {patient.name}
              </h2>
              <span style={{ fontSize: 13, color: COLORS.neutral600 }}>
                {patient.age}y, {patient.sex}
              </span>
              <span style={{ fontSize: 13, color: COLORS.neutral600 }}>•</span>
              <span style={{
                padding: '2px 8px',
                background: COLORS.blueLight,
                color: COLORS.blue,
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
              }}>
                {patient.id}
              </span>
              {patient.pregnant && (
                <span style={{
                  padding: '2px 8px',
                  background: '#F3E8FF',
                  color: '#7C3AED',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  🤰 {patient.gestationWeeks}w
                </span>
              )}
            </div>

            {/* Allergies & Chronic Conditions (Compact) */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {patient.allergies.length > 0 && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.red }}>
                    ⚠️ ALLERGIES:
                  </span>
                  {patient.allergies.map(allergy => (
                    <span
                      key={allergy}
                      style={{
                        padding: '2px 6px',
                        background: COLORS.redLight,
                        border: `1px solid ${COLORS.red}`,
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 600,
                        color: COLORS.red,
                      }}
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              )}

              {patient.chronicConditions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {patient.chronicConditions.map(condition => (
                    <span
                      key={condition}
                      style={{
                        padding: '2px 6px',
                        background: COLORS.amberLight,
                        border: `1px solid ${COLORS.amber}`,
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 500,
                        color: '#92400E',
                      }}
                    >
                      🟡 {condition}
                    </span>
                  ))}
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setHeaderExpanded(!headerExpanded)}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 8px',
                  background: COLORS.neutral100,
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 11,
                  color: COLORS.neutral600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {headerExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {language === 'en' ? 'More' : 'Zaidi'}
              </button>
            </div>

            {/* Expanded Details */}
            {headerExpanded && (
              <div style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${COLORS.neutral200}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                fontSize: 12,
              }}>
                <div>
                  <span style={{ color: COLORS.neutral600 }}>Phone:</span>
                  <span style={{ marginLeft: 6, color: COLORS.neutral900 }}>{patient.phone}</span>
                </div>
                <div>
                  <span style={{ color: COLORS.neutral600 }}>Insurance:</span>
                  <span style={{ marginLeft: 6, color: COLORS.neutral900 }}>{patient.insurance}</span>
                </div>
                <div>
                  <span style={{ color: COLORS.neutral600 }}>Blood Type:</span>
                  <span style={{ marginLeft: 6, color: COLORS.neutral900 }}>{patient.bloodType}</span>
                </div>
                <div>
                  <span style={{ color: COLORS.neutral600 }}>Next of Kin:</span>
                  <span style={{ marginLeft: 6, color: COLORS.neutral900 }}>{patient.nextOfKin}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REDUCED TABS (3 instead of 6) */}
      <div style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.neutral200}`,
        display: 'flex',
        padding: '0 24px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? `3px solid ${COLORS.teal}` : '3px solid transparent',
              color: activeTab === tab.id ? COLORS.teal : COLORS.neutral600,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>{tab.icon}</span>
            {language === 'en' ? tab.label : tab.labelSw}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT + COLLAPSIBLE AI PANEL */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 24,
          paddingRight: showAI ? 24 : 24,
        }}>
          {activeTab === 'summary' && (
            <>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'Current Visit' : 'Ziara ya Sasa'}
              </h2>

              {/* COMPACT VITALS TABLE (instead of cards) */}
              <div style={{
                padding: 16,
                background: COLORS.white,
                borderRadius: 8,
                border: `1px solid ${COLORS.neutral200}`,
                marginBottom: 16,
              }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Vitals' : 'Dalili'}
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${COLORS.neutral200}` }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>BP</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>HR</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>Temp</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>SpO₂</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>Weight</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600 }}>BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{
                        padding: '10px 12px',
                        fontSize: 14,
                        fontWeight: 700,
                        color: parseInt(vitals.bp.split('/')[0]) > 140 ? COLORS.red : COLORS.neutral900,
                        background: parseInt(vitals.bp.split('/')[0]) > 140 ? COLORS.redLight : 'none',
                      }}>
                        {vitals.bp}
                        {parseInt(vitals.bp.split('/')[0]) > 140 && ' 🔴'}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>{vitals.hr}</td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>{vitals.temp}°C</td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>{vitals.spo2}%</td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>{vitals.weight}kg</td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>
                        {(vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Chief Complaint */}
              <div style={{
                padding: 16,
                background: COLORS.white,
                borderRadius: 8,
                border: `1px solid ${COLORS.neutral200}`,
                marginBottom: 16,
              }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Chief Complaint' : 'Malalamiko'}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: COLORS.neutral900 }}>
                  Severe headache and blurred vision for 2 days
                </p>
              </div>

              {/* Assessment & Plan */}
              <div style={{
                padding: 16,
                background: COLORS.white,
                borderRadius: 8,
                border: `1px solid ${COLORS.neutral200}`,
              }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Assessment' : 'Tathmini'}
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: COLORS.neutral900 }}>
                  Severe pre-eclampsia, 32 weeks gestation
                </p>

                <h3 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Plan' : 'Mpango'}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: COLORS.neutral900 }}>
                  Admit for observation. Start methyldopa 250mg TDS. Refer to obstetrician.
                </p>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'Patient History' : 'Historia ya Mgonjwa'}
              </h2>
              <p style={{ fontSize: 14, color: COLORS.neutral600 }}>
                Past visits, lab results, medications, and imaging...
              </p>
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'Admin & Billing' : 'Usimamizi na Malipo'}
              </h2>
              <p style={{ fontSize: 14, color: COLORS.neutral600 }}>
                Insurance claims, billing, payments, and documents...
              </p>
            </div>
          )}

          {/* ONE-TAP COMPLETE VISIT */}
          <div style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            right: showAI ? 344 : 24,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                padding: '14px 20px',
                background: COLORS.white,
                color: COLORS.neutral900,
                border: `2px solid ${COLORS.neutral200}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {language === 'en' ? '💊 Prescribe' : '💊 Dawa'}
              </button>
              <button style={{
                padding: '14px 20px',
                background: COLORS.white,
                color: COLORS.neutral900,
                border: `2px solid ${COLORS.neutral200}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {language === 'en' ? '🧪 Order Labs' : '🧪 Maabara'}
              </button>
            </div>
            <button style={{
              padding: '14px 32px',
              background: COLORS.teal,
              color: COLORS.white,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              {language === 'en' ? '✓ Complete Visit' : '✓ Maliza Ziara'}
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE AI PANEL */}
        {showAI ? (
          <div style={{
            width: 320,
            background: COLORS.white,
            borderLeft: `1px solid ${COLORS.neutral200}`,
            padding: 20,
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} color={COLORS.blue} />
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.blue }}>
                  {language === 'en' ? 'AI Assistant' : 'Msaidizi wa AI'}
                </h3>
              </div>
              <button
                onClick={() => setShowAI(false)}
                style={{
                  padding: '4px 8px',
                  background: COLORS.neutral100,
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 11,
                  color: COLORS.neutral600,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Hide' : 'Ficha'}
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: 11, color: COLORS.neutral600, fontStyle: 'italic' }}>
              {language === 'en' ? 'AI suggestions - not a diagnosis. Always use clinical judgement.' : 'Mapendekezo ya AI - si utambuzi. Tumia uamuzi wa kitaalamu.'}
            </p>

            {/* Red Flags */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: COLORS.neutral700, textTransform: 'uppercase' }}>
                🚨 {language === 'en' ? 'Red Flags' : 'Tahadhari'}
              </h4>
              <div style={{
                padding: 10,
                background: COLORS.redLight,
                border: `1px solid ${COLORS.red}`,
                borderRadius: 6,
                marginBottom: 8,
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: COLORS.red }}>
                  Severe hypertension in pregnancy
                </p>
                <p style={{ margin: 0, fontSize: 10, color: COLORS.neutral700 }}>
                  → Immediate obstetric consultation required
                </p>
              </div>
            </div>

            {/* Differentials */}
            <div>
              <h4 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: COLORS.neutral700, textTransform: 'uppercase' }}>
                🔍 {language === 'en' ? 'Possible Conditions' : 'Hali Zinazowezekana'}
              </h4>
              <div style={{
                padding: 10,
                background: COLORS.neutral50,
                borderRadius: 6,
                marginBottom: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>Severe pre-eclampsia</span>
                  <span style={{
                    padding: '2px 6px',
                    background: COLORS.redLight,
                    color: COLORS.red,
                    borderRadius: 3,
                    fontSize: 9,
                    fontWeight: 600,
                  }}>
                    HIGH
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: COLORS.neutral600 }}>
                  BP 165/110 + headache + blurred vision
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAI(true)}
            style={{
              position: 'fixed',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '40px 8px',
              background: COLORS.blue,
              color: COLORS.white,
              border: 'none',
              borderRadius: '8px 0 0 8px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              writingMode: 'vertical-rl',
              boxShadow: '-2px 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {language === 'en' ? 'AI Assistant ▶' : 'Msaidizi wa AI ▶'}
          </button>
        )}
      </div>
    </div>
  );
}
