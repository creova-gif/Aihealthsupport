/**
 * CREOVA Health OS - Owner/Admin Dashboard
 * 
 * KPI dashboard for clinic and pharmacy owners
 * 
 * Features:
 * - KPI cards (visits, revenue, stockouts, claims)
 * - Charts (visits over time, revenue by payer)
 * - Tables (expiring stock, outstanding balances)
 * - Date range filters
 * - Swahili/English
 */

import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Package, AlertTriangle, Calendar } from 'lucide-react';

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

const MOCK_KPI_DATA = {
  todayVisits: 42,
  todayVisitsChange: 12,
  monthRevenue: 18500000,
  monthRevenueChange: 8,
  stockouts: 5,
  stockoutsChange: -2,
  pendingClaims: 12,
  pendingClaimsValue: 2400000,
};

const MOCK_REVENUE_BY_PAYER = [
  { payer: 'Cash', amount: 8500000, percentage: 46 },
  { payer: 'NHIF', amount: 6200000, percentage: 33 },
  { payer: 'Private HMO', amount: 3100000, percentage: 17 },
  { payer: 'Employer', amount: 700000, percentage: 4 },
];

const MOCK_VISITS_TREND = [
  { date: '8 Mar', visits: 38 },
  { date: '9 Mar', visits: 42 },
  { date: '10 Mar', visits: 45 },
  { date: '11 Mar', visits: 39 },
  { date: '12 Mar', visits: 41 },
  { date: '13 Mar', visits: 44 },
  { date: '14 Mar', visits: 42 },
];

const MOCK_EXPIRING_STOCK = [
  { drug: 'Metformin 500mg', quantity: 200, expiry: '2026-04-15', value: 40000 },
  { drug: 'Amoxicillin 500mg', quantity: 150, expiry: '2026-04-20', value: 60000 },
  { drug: 'Paracetamol 500mg', quantity: 500, expiry: '2026-05-01', value: 100000 },
];

const MOCK_TOP_DIAGNOSES = [
  { diagnosis: 'Upper respiratory infection', count: 45 },
  { diagnosis: 'Hypertension', count: 32 },
  { diagnosis: 'Diabetes mellitus', count: 28 },
  { diagnosis: 'Malaria', count: 22 },
  { diagnosis: 'Urinary tract infection', count: 18 },
];

export default function OwnerDashboard() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [dateRange, setDateRange] = useState('This Month');

  const formatCurrency = (amount: number) => {
    return `TZS ${(amount / 1000000).toFixed(2)}M`;
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
        padding: '20px 32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', color: COLORS.white, fontSize: 24, fontWeight: 600 }}>
              {language === 'en' ? 'Dashboard' : 'Dashibodi'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {language === 'en' ? 'Clinic & Pharmacy Performance' : 'Utendaji wa Kliniki na Pharmacy'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
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
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>

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
      </div>

      {/* Main Content */}
      <div style={{ padding: 32 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
          {/* Today's Visits */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: COLORS.blueLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} color={COLORS.blue} />
              </div>
              <div style={{
                padding: '4px 8px',
                background: COLORS.greenLight,
                color: COLORS.green,
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <TrendingUp size={12} />
                +{MOCK_KPI_DATA.todayVisitsChange}%
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.neutral900, marginBottom: 4 }}>
              {MOCK_KPI_DATA.todayVisits}
            </div>
            <div style={{ fontSize: 13, color: COLORS.neutral600 }}>
              {language === 'en' ? "Today's Visits" : 'Ziara za Leo'}
            </div>
          </div>

          {/* Month Revenue */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: COLORS.greenLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DollarSign size={24} color={COLORS.green} />
              </div>
              <div style={{
                padding: '4px 8px',
                background: COLORS.greenLight,
                color: COLORS.green,
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <TrendingUp size={12} />
                +{MOCK_KPI_DATA.monthRevenueChange}%
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.neutral900, marginBottom: 4 }}>
              {formatCurrency(MOCK_KPI_DATA.monthRevenue)}
            </div>
            <div style={{ fontSize: 13, color: COLORS.neutral600 }}>
              {language === 'en' ? 'This Month Revenue' : 'Mapato Mwezi Huu'}
            </div>
          </div>

          {/* Stockouts */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: COLORS.amberLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Package size={24} color={COLORS.amber} />
              </div>
              <div style={{
                padding: '4px 8px',
                background: COLORS.greenLight,
                color: COLORS.green,
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <TrendingDown size={12} />
                {MOCK_KPI_DATA.stockoutsChange}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.neutral900, marginBottom: 4 }}>
              {MOCK_KPI_DATA.stockouts}
            </div>
            <div style={{ fontSize: 13, color: COLORS.neutral600 }}>
              {language === 'en' ? 'Stockout Items' : 'Dawa Zilizokwisha'}
            </div>
          </div>

          {/* Pending Claims */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: COLORS.tealLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertTriangle size={24} color={COLORS.teal} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.neutral900, marginBottom: 4 }}>
              {MOCK_KPI_DATA.pendingClaims}
            </div>
            <div style={{ fontSize: 13, color: COLORS.neutral600, marginBottom: 4 }}>
              {language === 'en' ? 'Pending Claims' : 'Madai Yanayongoja'}
            </div>
            <div style={{ fontSize: 11, color: COLORS.teal, fontWeight: 600 }}>
              {formatCurrency(MOCK_KPI_DATA.pendingClaimsValue)}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
          {/* Visits Trend */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
              {language === 'en' ? 'Visits Over Time' : 'Ziara kwa Wakati'}
            </h2>

            {/* Simple bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
              {MOCK_VISITS_TREND.map((day, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${(day.visits / 50) * 200}px`,
                      background: COLORS.teal,
                      borderRadius: '4px 4px 0 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingTop: 8,
                      color: COLORS.white,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {day.visits}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.neutral600 }}>
                    {day.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Payer */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
              {language === 'en' ? 'Revenue by Payer' : 'Mapato kwa Mlipaji'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_REVENUE_BY_PAYER.map((payer, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: COLORS.neutral900 }}>{payer.payer}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>
                      {payer.percentage}%
                    </span>
                  </div>
                  <div style={{ height: 8, background: COLORS.neutral200, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${payer.percentage}%`,
                      height: '100%',
                      background: index === 0 ? COLORS.teal : index === 1 ? COLORS.blue : index === 2 ? COLORS.green : COLORS.amber,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.neutral600, marginTop: 4 }}>
                    {formatCurrency(payer.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Expiring Stock */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
              {language === 'en' ? 'Soon to Expire' : 'Zinazoisha Upesi'}
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.neutral200}` }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Drug' : 'Dawa'}
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Qty' : 'Kiasi'}
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Expiry' : 'Mwisho'}
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Value' : 'Thamani'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EXPIRING_STOCK.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${COLORS.neutral200}` }}>
                      <td style={{ padding: '12px 8px', fontSize: 13, color: COLORS.neutral900 }}>
                        {item.drug}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 13, textAlign: 'right', color: COLORS.neutral900 }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 12, textAlign: 'right', color: COLORS.amber, fontWeight: 500 }}>
                        {new Date(item.expiry).toLocaleDateString('en-TZ', { month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 13, textAlign: 'right', color: COLORS.neutral900, fontWeight: 500 }}>
                        TZS {(item.value / 1000).toFixed(0)}k
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Diagnoses */}
          <div style={{
            padding: 24,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.neutral200}`,
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
              {language === 'en' ? 'Top Diagnoses' : 'Magonjwa Makuu'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOCK_TOP_DIAGNOSES.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: index === 0 ? COLORS.teal : COLORS.neutral100,
                    color: index === 0 ? COLORS.white : COLORS.neutral700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: COLORS.neutral900, marginBottom: 4 }}>
                      {item.diagnosis}
                    </div>
                    <div style={{ height: 4, background: COLORS.neutral200, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${(item.count / MOCK_TOP_DIAGNOSES[0].count) * 100}%`,
                        height: '100%',
                        background: COLORS.teal,
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
