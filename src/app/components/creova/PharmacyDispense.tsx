/**
 * CREOVA Health OS - Pharmacy Dispense Screen
 * 
 * 3-column layout for pharmacy dispensing
 * 
 * Features:
 * - Left: Queue of prescriptions
 * - Center: Selected prescription details
 * - Right: Stock levels & alternatives
 * - Color-coded stock alerts
 * - M-Pesa payment integration
 * - Swahili/English
 */

import { useState } from 'react';
import { Clock, AlertTriangle, Package, DollarSign, Printer, MessageSquare, Check } from 'lucide-react';

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

interface PrescriptionItem {
  drug: string;
  dose: string;
  frequency: string;
  duration: string;
  quantity: number;
  stock: number;
  expiry: string;
  price: number;
  margin: number;
  alternatives?: string[];
}

interface PrescriptionQueue {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  priority: 'urgent' | 'normal';
  prescribedBy: string;
  time: string;
  items: PrescriptionItem[];
  total: number;
}

const MOCK_QUEUE: PrescriptionQueue[] = [
  {
    id: 'RX-001',
    patientName: 'Amina Juma',
    patientId: 'P-0012',
    age: 28,
    priority: 'urgent',
    prescribedBy: 'Dr. Kamau',
    time: '10:15 AM',
    items: [
      {
        drug: 'Methyldopa 250mg',
        dose: '250mg',
        frequency: 'Three times daily',
        duration: '30 days',
        quantity: 90,
        stock: 200,
        expiry: '2026-12-31',
        price: 0.50,
        margin: 0.15,
      },
      {
        drug: 'Ferrous sulfate 200mg',
        dose: '200mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        stock: 50,
        expiry: '2026-08-15',
        price: 0.30,
        margin: 0.10,
      },
    ],
    total: 54.00,
  },
  {
    id: 'RX-002',
    patientName: 'John Mwangi',
    patientId: 'P-0089',
    age: 45,
    priority: 'normal',
    prescribedBy: 'Dr. Musa',
    time: '10:20 AM',
    items: [
      {
        drug: 'Metformin 500mg',
        dose: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        quantity: 60,
        stock: 15,
        expiry: '2026-06-30',
        price: 0.20,
        margin: 0.08,
        alternatives: ['Glucophage 500mg', 'Metformin XR 500mg'],
      },
    ],
    total: 12.00,
  },
  {
    id: 'RX-003',
    patientName: 'Grace Nduta',
    patientId: 'P-0156',
    age: 32,
    priority: 'normal',
    prescribedBy: 'Dr. Kamau',
    time: '10:25 AM',
    items: [
      {
        drug: 'Amoxicillin 500mg',
        dose: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 21,
        stock: 0,
        expiry: '-',
        price: 0.40,
        margin: 0.12,
        alternatives: ['Augmentin 500mg', 'Cephalexin 500mg'],
      },
    ],
    total: 8.40,
  },
];

export default function PharmacyDispense() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionQueue>(MOCK_QUEUE[0]);
  const [viewMode, setViewMode] = useState<'dispense' | 'inventory'>('dispense');

  const getStockStatus = (stock: number, quantity: number): 'ok' | 'low' | 'out' => {
    if (stock === 0) return 'out';
    if (stock < quantity) return 'low';
    return 'ok';
  };

  const getStockColor = (status: 'ok' | 'low' | 'out') => {
    if (status === 'out') return COLORS.red;
    if (status === 'low') return COLORS.amber;
    return COLORS.green;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: COLORS.neutral50,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        height: 64,
        background: COLORS.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div>
          <h1 style={{ margin: 0, color: COLORS.white, fontSize: 20, fontWeight: 600 }}>
            {language === 'en' ? 'Pharmacy Dispensing' : 'Pharmacy - Kutoa Dawa'}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {language === 'en' ? `${MOCK_QUEUE.length} prescriptions in queue` : `Dawa ${MOCK_QUEUE.length} zinazongoja`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 8 }}>
            <button
              onClick={() => setViewMode('dispense')}
              style={{
                padding: '6px 16px',
                background: viewMode === 'dispense' ? COLORS.white : 'transparent',
                color: viewMode === 'dispense' ? COLORS.primary : COLORS.white,
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Dispense' : 'Toa Dawa'}
            </button>
            <button
              onClick={() => setViewMode('inventory')}
              style={{
                padding: '6px 16px',
                background: viewMode === 'inventory' ? COLORS.white : 'transparent',
                color: viewMode === 'inventory' ? COLORS.primary : COLORS.white,
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Inventory' : 'Hifadhi'}
            </button>
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

      {/* 3-Column Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT: Prescription Queue */}
        <div style={{
          width: 320,
          background: COLORS.white,
          borderRight: `1px solid ${COLORS.neutral200}`,
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{ padding: '16px 16px 8px' }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.neutral700, textTransform: 'uppercase' }}>
              {language === 'en' ? 'Prescription Queue' : 'Foleni ya Dawa'}
            </h2>
          </div>

          {MOCK_QUEUE.map(prescription => (
            <button
              key={prescription.id}
              onClick={() => setSelectedPrescription(prescription)}
              style={{
                width: '100%',
                padding: 16,
                background: selectedPrescription.id === prescription.id ? COLORS.tealLight : 'none',
                border: 'none',
                borderLeft: selectedPrescription.id === prescription.id ? `4px solid ${COLORS.teal}` : '4px solid transparent',
                borderBottom: `1px solid ${COLORS.neutral200}`,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.neutral900 }}>
                    {prescription.patientName}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.neutral600 }}>
                    {prescription.patientId} • {prescription.age}y
                  </div>
                </div>
                {prescription.priority === 'urgent' && (
                  <span style={{
                    padding: '2px 6px',
                    background: COLORS.redLight,
                    color: COLORS.red,
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {language === 'en' ? 'URGENT' : 'DHARURA'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: COLORS.neutral600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  {prescription.time}
                </div>
                <div>
                  {prescription.prescribedBy}
                </div>
              </div>

              <div style={{ marginTop: 8, fontSize: 11, color: COLORS.neutral700 }}>
                {prescription.items.length} {language === 'en' ? 'items' : 'dawa'} • TZS {prescription.total.toFixed(2)}
              </div>
            </button>
          ))}
        </div>

        {/* CENTER: Selected Prescription */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: COLORS.neutral900 }}>
              {selectedPrescription.patientName}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.neutral600 }}>
              {selectedPrescription.patientId} • {language === 'en' ? 'Prescribed by' : 'Imeandikwa na'} {selectedPrescription.prescribedBy}
            </p>
          </div>

          {/* Prescription Items */}
          <div style={{ marginBottom: 24 }}>
            {selectedPrescription.items.map((item, index) => {
              const stockStatus = getStockStatus(item.stock, item.quantity);
              const stockColor = getStockColor(stockStatus);

              return (
                <div
                  key={index}
                  style={{
                    padding: 20,
                    background: COLORS.white,
                    borderRadius: 12,
                    border: `2px solid ${stockStatus === 'out' ? COLORS.red : COLORS.neutral200}`,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600, color: COLORS.neutral900 }}>
                        {item.drug}
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, color: COLORS.neutral600 }}>
                        {item.frequency} • {item.duration}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      background: stockStatus === 'out' ? COLORS.redLight : stockStatus === 'low' ? COLORS.amberLight : COLORS.greenLight,
                      color: stockColor,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {stockStatus === 'out' ? (language === 'en' ? 'OUT OF STOCK' : 'HAKUNA') :
                       stockStatus === 'low' ? (language === 'en' ? 'LOW STOCK' : 'KIDOGO') :
                       (language === 'en' ? 'IN STOCK' : 'IKO')}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                        {language === 'en' ? 'Quantity' : 'Kiasi'}
                      </p>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                        {item.quantity}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                        {language === 'en' ? 'Unit Price' : 'Bei'}
                      </p>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                        TZS {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                        {language === 'en' ? 'Total' : 'Jumla'}
                      </p>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral900 }}>
                        TZS {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: COLORS.neutral600, textTransform: 'uppercase' }}>
                        {language === 'en' ? 'Margin' : 'Faida'}
                      </p>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.green }}>
                        {(item.margin * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {stockStatus === 'out' && item.alternatives && (
                    <div style={{
                      padding: 12,
                      background: COLORS.amberLight,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.amber}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <AlertTriangle size={16} color={COLORS.amber} />
                        <strong style={{ fontSize: 12, color: '#92400E' }}>
                          {language === 'en' ? 'Alternatives available:' : 'Badala zilizopo:'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {item.alternatives.map((alt, i) => (
                          <button
                            key={i}
                            style={{
                              padding: '6px 12px',
                              background: COLORS.white,
                              border: `1px solid ${COLORS.amber}`,
                              borderRadius: 6,
                              fontSize: 11,
                              cursor: 'pointer',
                            }}
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{
            padding: 20,
            background: COLORS.neutral900,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>
                {language === 'en' ? 'Total Amount' : 'Jumla'}
              </span>
              <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.white }}>
                TZS {selectedPrescription.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <button
              style={{
                padding: '14px 20px',
                background: COLORS.white,
                color: COLORS.neutral900,
                border: `2px solid ${COLORS.neutral200}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Printer size={16} />
              {language === 'en' ? 'Print' : 'Chapa'}
            </button>
            <button
              style={{
                padding: '14px 20px',
                background: COLORS.white,
                color: COLORS.neutral900,
                border: `2px solid ${COLORS.neutral200}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <MessageSquare size={16} />
              {language === 'en' ? 'SMS' : 'Tuma'}
            </button>
            <button
              style={{
                padding: '14px 20px',
                background: COLORS.teal,
                color: COLORS.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Check size={16} />
              {language === 'en' ? 'Complete' : 'Maliza'}
            </button>
          </div>
        </div>

        {/* RIGHT: Stock Information */}
        <div style={{
          width: 300,
          background: COLORS.white,
          borderLeft: `1px solid ${COLORS.neutral200}`,
          padding: 20,
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: COLORS.neutral700, textTransform: 'uppercase' }}>
            {language === 'en' ? 'Stock Details' : 'Hifadhi'}
          </h2>

          {selectedPrescription.items.map((item, index) => {
            const stockStatus = getStockStatus(item.stock, item.quantity);
            const stockColor = getStockColor(stockStatus);

            return (
              <div
                key={index}
                style={{
                  padding: 16,
                  background: COLORS.neutral50,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>
                  {item.drug}
                </h3>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: COLORS.neutral600 }}>
                      {language === 'en' ? 'Available' : 'Iliyopo'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: stockColor }}>
                      {item.stock}
                    </span>
                  </div>
                  <div style={{ height: 6, background: COLORS.neutral200, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((item.stock / item.quantity) * 100, 100)}%`,
                      background: stockColor,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 10, color: COLORS.neutral600 }}>
                      {language === 'en' ? 'Needed' : 'Inahitajika'}
                    </p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.neutral900 }}>
                      {item.quantity}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 10, color: COLORS.neutral600 }}>
                      {language === 'en' ? 'Expiry' : 'Mwisho'}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: COLORS.neutral700 }}>
                      {item.expiry !== '-' ? new Date(item.expiry).toLocaleDateString('en-TZ', { month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>

                {stockStatus === 'low' && (
                  <div style={{
                    padding: 8,
                    background: COLORS.amberLight,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <AlertTriangle size={14} color={COLORS.amber} />
                    <span style={{ fontSize: 10, color: '#92400E' }}>
                      {language === 'en' ? 'Low stock alert' : 'Onyo: Dawa kidogo'}
                    </span>
                  </div>
                )}

                {stockStatus === 'out' && (
                  <div style={{
                    padding: 8,
                    background: COLORS.redLight,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <AlertTriangle size={14} color={COLORS.red} />
                    <span style={{ fontSize: 10, color: COLORS.red, fontWeight: 600 }}>
                      {language === 'en' ? 'Out of stock' : 'Dawa hazipatikani'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Payment Section */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${COLORS.neutral200}` }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: COLORS.neutral700 }}>
              {language === 'en' ? 'Payment Method' : 'Njia ya Malipo'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Cash', 'M-Pesa', 'Insurance'].map(method => (
                <button
                  key={method}
                  style={{
                    padding: '10px 14px',
                    background: COLORS.white,
                    border: `2px solid ${COLORS.neutral200}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
