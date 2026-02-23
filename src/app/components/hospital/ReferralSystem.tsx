/**
 * REFERRAL SYSTEM
 * 
 * Inter-facility patient transfers
 * 
 * Features:
 * - Create referral with clinical summary
 * - Facility selection
 * - Urgency levels
 * - Transfer acceptance/rejection
 * - Patient transport coordination
 * - Referral outcome tracking
 * - MoH oversight dashboard
 */

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Send,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Navigation,
  Phone,
  X
} from 'lucide-react';
import type { Referral, Patient, Encounter } from '../../types/HospitalDataModel';

interface ReferralSystemProps {
  patient: Patient;
  encounter: Encounter;
  currentFacilityId: string;
  onReferralCreated: (referral: Referral) => void;
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({
  patient,
  encounter,
  currentFacilityId,
  onReferralCreated
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [referralData, setReferralData] = useState({
    referring_facility_id: currentFacilityId,
    receiving_facility_id: '',
    reason: '',
    urgency: 'routine' as 'emergency' | 'urgent' | 'routine',
    clinical_summary: '',
    diagnosis: '',
    specialty_needed: '',
    transport_required: false,
    patient_condition: 'stable' as 'stable' | 'unstable' | 'critical'
  });

  const facilities = [
    { id: 'fac-mnh', name: 'Muhimbili National Hospital', level: 'National', specialty: 'All specialties' },
    { id: 'fac-knh', name: 'Kilimanjaro Christian Medical Centre', level: 'Zonal', specialty: 'Cardiology, Neurology' },
    { id: 'fac-bmc', name: 'Benjamin Mkapa Hospital', level: 'Regional', specialty: 'Cardiac care' },
    { id: 'fac-dar', name: 'Dar es Salaam Regional Hospital', level: 'Regional', specialty: 'General' }
  ];

  const specialties = [
    'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
    'Obstetrics', 'Surgery', 'Internal Medicine', 'ICU'
  ];

  const handleSubmit = () => {
    const referral: Referral = {
      referral_id: `ref-${Date.now()}`,
      patient_id: patient.patient_id,
      encounter_id: encounter.encounter_id,
      referring_facility_id: referralData.referring_facility_id,
      receiving_facility_id: referralData.receiving_facility_id,
      referring_provider_id: encounter.provider_id,
      receiving_provider_id: null,
      referral_date: new Date(),
      reason: referralData.reason,
      urgency: referralData.urgency,
      status: 'pending',
      clinical_summary: referralData.clinical_summary,
      diagnosis: referralData.diagnosis,
      specialty_needed: referralData.specialty_needed,
      transport_required: referralData.transport_required,
      patient_condition: referralData.patient_condition,
      expected_arrival: null,
      actual_arrival: null,
      outcome: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    onReferralCreated(referral);
    setShowCreateModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowCreateModal(true)} className="gap-2">
        <Send className="h-4 w-4" />
        Create Referral
      </Button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F3D56]">Create Referral</h2>
                  <p className="text-[#6B7280] mt-1">
                    {patient.first_name} {patient.last_name} ({patient.afya_id})
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Urgency Level *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['emergency', 'urgent', 'routine'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setReferralData({ ...referralData, urgency: level })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        referralData.urgency === level
                          ? level === 'emergency' ? 'border-[#C84B31] bg-[#FEF3F2]' :
                            level === 'urgent' ? 'border-[#F4A261] bg-[#FEF3E7]' :
                            'border-[#0F3D56] bg-[#EFF6FF]'
                          : 'border-[#E5E7EB] hover:border-[#6B7280]'
                      }`}
                    >
                      <div className={`font-medium capitalize ${
                        referralData.urgency === level
                          ? level === 'emergency' ? 'text-[#C84B31]' :
                            level === 'urgent' ? 'text-[#F4A261]' :
                            'text-[#0F3D56]'
                          : 'text-[#6B7280]'
                      }`}>
                        {level}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {level === 'emergency' ? 'Immediate transfer' :
                         level === 'urgent' ? 'Within 24 hours' :
                         'Within 7 days'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Receiving Facility */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Receiving Facility *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => setReferralData({ ...referralData, receiving_facility_id: facility.id })}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        referralData.receiving_facility_id === facility.id
                          ? 'border-[#0F3D56] bg-[#EFF6FF]'
                          : 'border-[#E5E7EB] hover:border-[#6B7280]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <Building className="h-5 w-5 text-[#0F3D56]" />
                        <Badge variant="outline">{facility.level}</Badge>
                      </div>
                      <div className="font-medium text-[#1E1E1E] mt-2">
                        {facility.name}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {facility.specialty}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Needed */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Specialty Needed *
                </label>
                <select
                  value={referralData.specialty_needed}
                  onChange={(e) => setReferralData({ ...referralData, specialty_needed: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select specialty...</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Reason for Referral */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Reason for Referral *
                </label>
                <Input
                  value={referralData.reason}
                  onChange={(e) => setReferralData({ ...referralData, reason: e.target.value })}
                  placeholder="e.g., Advanced cardiac care required"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Diagnosis
                </label>
                <Input
                  value={referralData.diagnosis}
                  onChange={(e) => setReferralData({ ...referralData, diagnosis: e.target.value })}
                  placeholder="Primary diagnosis"
                />
              </div>

              {/* Clinical Summary */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Clinical Summary *
                </label>
                <textarea
                  value={referralData.clinical_summary}
                  onChange={(e) => setReferralData({ ...referralData, clinical_summary: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Include: History of present illness, relevant past medical history, current medications, recent investigations, treatment provided so far..."
                />
              </div>

              {/* Patient Condition */}
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Patient Condition
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['stable', 'unstable', 'critical'] as const).map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setReferralData({ ...referralData, patient_condition: condition })}
                      className={`p-3 border-2 rounded-lg text-center capitalize transition-colors ${
                        referralData.patient_condition === condition
                          ? 'border-[#0F3D56] bg-[#EFF6FF]'
                          : 'border-[#E5E7EB] hover:border-[#6B7280]'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Required */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="transport"
                  checked={referralData.transport_required}
                  onChange={(e) => setReferralData({ ...referralData, transport_required: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="transport" className="text-sm font-medium text-[#1E1E1E]">
                  Ambulance transport required
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-[#F9FAFB]">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!referralData.receiving_facility_id || !referralData.reason || !referralData.clinical_summary}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Referral
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

/**
 * REFERRAL INBOX (For Receiving Facility)
 */
export const ReferralInbox: React.FC<{ facilityId: string }> = ({ facilityId }) => {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      referral_id: 'ref-001',
      patient_id: 'pat-001',
      encounter_id: 'enc-001',
      referring_facility_id: 'fac-district',
      receiving_facility_id: facilityId,
      referring_provider_id: 'prov-001',
      receiving_provider_id: null,
      referral_date: new Date(),
      reason: 'Cardiac emergency - requires catheterization',
      urgency: 'emergency',
      status: 'pending',
      clinical_summary: 'Patient presenting with chest pain, elevated troponins',
      diagnosis: 'Acute Coronary Syndrome',
      specialty_needed: 'Cardiology',
      transport_required: true,
      patient_condition: 'unstable',
      expected_arrival: null,
      actual_arrival: null,
      outcome: null,
      notes: null,
      created_at: new Date(Date.now() - 1800000),
      updated_at: new Date(Date.now() - 1800000)
    }
  ]);

  const acceptReferral = (referralId: string) => {
    setReferrals(prev => prev.map(r => 
      r.referral_id === referralId ? { ...r, status: 'accepted' as const } : r
    ));
  };

  const rejectReferral = (referralId: string, reason: string) => {
    setReferrals(prev => prev.map(r => 
      r.referral_id === referralId ? { ...r, status: 'rejected' as const, notes: reason } : r
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0F3D56]">Incoming Referrals</h2>

      <div className="space-y-4">
        {referrals.filter(r => r.status === 'pending').map((referral) => (
          <Card key={referral.referral_id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className={
                  referral.urgency === 'emergency' ? 'bg-[#C84B31]' :
                  referral.urgency === 'urgent' ? 'bg-[#F4A261]' :
                  'bg-[#6B7280]'
                }>
                  {referral.urgency.toUpperCase()}
                </Badge>
                <h3 className="text-lg font-medium text-[#1E1E1E] mt-2">
                  {referral.diagnosis || referral.reason}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Referred {new Date(referral.referral_date).toLocaleString()}
                </p>
              </div>
              <Badge variant="outline" className={
                referral.patient_condition === 'critical' ? 'border-[#C84B31] text-[#C84B31]' :
                referral.patient_condition === 'unstable' ? 'border-[#F4A261] text-[#F4A261]' :
                'border-green-600 text-green-600'
              }>
                {referral.patient_condition}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-[#6B7280]">Specialty Needed</div>
                <div className="text-sm text-[#1E1E1E]">{referral.specialty_needed}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#6B7280]">Transport</div>
                <div className="text-sm text-[#1E1E1E]">
                  {referral.transport_required ? '✓ Ambulance required' : 'Not required'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F9FAFB] rounded-lg mb-4">
              <div className="text-sm font-medium text-[#1E1E1E] mb-2">Clinical Summary</div>
              <div className="text-sm text-[#6B7280]">{referral.clinical_summary}</div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700" onClick={() => acceptReferral(referral.referral_id)}>
                <CheckCircle className="h-4 w-4" />
                Accept Referral
              </Button>
              <Button variant="outline" className="flex-1 gap-2 text-[#C84B31] border-[#C84B31]" onClick={() => rejectReferral(referral.referral_id, 'No capacity')}>
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
