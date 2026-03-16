/**
 * CREOVA Health OS - Home Dashboard
 * 
 * Central command center for clinic operations
 * 
 * Features:
 * - Quick actions (most common tasks)
 * - Today's queue (waiting, in triage, with doctor, completed)
 * - Critical alerts (high fever, drug interactions, etc.)
 * - Inventory alerts (stockouts, near expiry)
 * - Collapsible AI assistant
 * - Adaptive responsive layout
 */

import { useState } from 'react';
import { Plus, Users, Activity, Package, AlertTriangle, TrendingUp, Clock, Pill, FileText } from 'lucide-react';

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

const QUICK_ACTIONS = [
  { icon: Plus, label: 'New Patient', labelSw: 'Mgonjwa Mpya', color: COLORS.teal, route: '/patients/new' },
  { icon: Activity, label: 'Start Triage', labelSw: 'Anza Triage', color: COLORS.blue, route: '/creova/triage' },
  { icon: Pill, label: 'Write Prescription', labelSw: 'Andika Dawa', color: COLORS.green, route: '/creova/prescribe' },
  { icon: Package, label: 'Dispense', labelSw: 'Toa Dawa', color: COLORS.amber, route: '/creova/pharmacy' },
];

const MOCK_QUEUE = {
  waiting: 6,
  inTriage: 3,
  withDoctor: 4,
  completed: 18,
};

const MOCK_CRITICAL_ALERTS = [
  { id: 1, type: 'clinical', severity: 'high', message: 'Patient P-0023: High fever 39.5°C flagged', time: '5 min ago' },
  { id: 2, type: 'clinical', severity: 'medium', message: 'Patient P-0012: BP 165/110 - pre-eclampsia risk', time: '12 min ago' },
  { id: 3, type: 'drug', severity: 'high', message: 'Drug interaction: Warfarin + Aspirin for P-0045', time: '18 min ago' },
];

const MOCK_INVENTORY_ALERTS = [
  { id: 1, drug: 'Amoxicillin 500mg', type: 'stockout', quantity: 0, action: 'Reorder now' },
  { id: 2, drug: 'Paracetamol 500mg', type: 'low', quantity: 45, action: 'Low stock' },
  { id: 3, drug: 'ORS Sachets', type: 'expiry', quantity: 200, expiryDays: 7, action: 'Expires in 7 days' },
];

const MOCK_AI_INSIGHTS = [
  '3 patients flagged as high-risk today',
  '2 prescriptions need interaction review',
  'Malaria cases up 15% this week',
  'Stockout predicted: Metformin (4 days)',
];

export default function HomeDashboard() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [showAI, setShowAI] = useState(false);

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return COLORS.red;
    if (severity === 'medium') return COLORS.amber;
    return COLORS.blue;
  };

  const getSeverityBg = (severity: string) => {
    if (severity === 'high') return COLORS.redLight;
    if (severity === 'medium') return COLORS.amberLight;
    return COLORS.blueLight;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: COLORS.neutral50,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.primary,
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', color: COLORS.white, fontSize: 24, fontWeight: 600 }}>
              {language === 'en' ? 'CREOVA Health OS' : 'CREOVA Mfumo wa Afya'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {language === 'en' ? 'Clinic Command Center' : 'Kituo cha Kliniki'}
            </p>
          </div>

          <button
            onClick={() => setLanguage(lang => lang === 'en' ? 'sw' : 'en')}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              color: COLORS.white,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {language === 'en' ? '🇬🇧 English' : '🇹🇿 Kiswahili'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: COLORS.neutral700, textTransform: 'uppercase' }}>
            {language === 'en' ? 'Quick Actions' : 'Vitendo vya Haraka'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.route}
                style={{
                  padding: 20,
                  background: COLORS.white,
                  border: `2px solid ${COLORS.neutral200}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.neutral200;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${action.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <action.icon size={24} color={action.color} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.neutral900 }}>
                    {language === 'en' ? action.label : action.labelSw}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Today's Queue */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Users size={20} color={COLORS.teal} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? "Today's Queue" : 'Foleni ya Leo'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.amber }} />
                  <span style={{ fontSize: 14, color: COLORS.neutral700 }}>
                    {language === 'en' ? 'Waiting' : 'Wanaongoja'}
                  </span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.neutral900 }}>
                  {MOCK_QUEUE.waiting}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.blue }} />
                  <span style={{ fontSize: 14, color: COLORS.neutral700 }}>
                    {language === 'en' ? 'In Triage' : 'Kwenye Triage'}
                  </span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.neutral900 }}>
                  {MOCK_QUEUE.inTriage}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.teal }} />
                  <span style={{ fontSize: 14, color: COLORS.neutral700 }}>
                    {language === 'en' ? 'With Doctor' : 'Kwa Daktari'}
                  </span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.neutral900 }}>
                  {MOCK_QUEUE.withDoctor}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.green }} />
                  <span style={{ fontSize: 14, color: COLORS.neutral700 }}>
                    {language === 'en' ? 'Completed' : 'Wamekamilika'}
                  </span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.neutral900 }}>
                  {MOCK_QUEUE.completed}
                </span>
              </div>
            </div>

            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.neutral200}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: COLORS.neutral600 }}>
                {language === 'en' ? 'Total Today' : 'Jumla Leo'}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.teal }}>
                {MOCK_QUEUE.waiting + MOCK_QUEUE.inTriage + MOCK_QUEUE.withDoctor + MOCK_QUEUE.completed}
              </span>
            </div>
          </div>

          {/* Critical Alerts */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <AlertTriangle size={20} color={COLORS.red} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'Critical Alerts' : 'Tahadhari Muhimu'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_CRITICAL_ALERTS.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: 12,
                    background: getSeverityBg(alert.severity),
                    borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 13, color: COLORS.neutral900, marginBottom: 4 }}>
                    {alert.message}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: COLORS.neutral600 }}>
                    <Clock size={12} />
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Package size={20} color={COLORS.amber} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'Inventory Alerts' : 'Tahadhari za Dawa'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_INVENTORY_ALERTS.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: 12,
                    background: alert.type === 'stockout' ? COLORS.redLight : alert.type === 'low' ? COLORS.amberLight : COLORS.blueLight,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.neutral900, marginBottom: 4 }}>
                    {alert.drug}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: COLORS.neutral600 }}>
                      {language === 'en' ? 'Quantity:' : 'Kiasi:'} {alert.quantity}
                    </span>
                    <button
                      style={{
                        padding: '4px 12px',
                        background: alert.type === 'stockout' ? COLORS.red : alert.type === 'low' ? COLORS.amber : COLORS.blue,
                        color: COLORS.white,
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible AI Assistant */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowAI(!showAI)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: showAI ? COLORS.blueLight : COLORS.white,
              border: `2px solid ${COLORS.blue}`,
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TrendingUp size={20} color={COLORS.blue} />
              <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.blue }}>
                {language === 'en' ? 'AI Assistant' : 'Msaidizi wa AI'}
              </span>
            </div>
            <span style={{ fontSize: 18, color: COLORS.blue }}>
              {showAI ? '−' : '+'}
            </span>
          </button>

          {showAI && (
            <div style={{
              marginTop: 12,
              padding: 20,
              background: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.neutral200}`,
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: COLORS.neutral900 }}>
                {language === 'en' ? 'AI Insights Today' : 'Maarifa ya AI Leo'}
              </h3>
              <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_AI_INSIGHTS.map((insight, index) => (
                  <li key={index} style={{ fontSize: 13, color: COLORS.neutral700 }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
