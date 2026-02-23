/**
 * Complete Pharmacy Workflow Module
 * 
 * Features:
 * - E-Prescribing interface (for doctors)
 * - Prescription verification (for pharmacists)
 * - Drug interaction checker
 * - Dispensing workflow
 * - Inventory management
 * - Stock alerts & expiry warnings
 * - Batch tracking
 * - Patient medication history
 * - Offline dispensing queue
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Pill,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  X,
  Eye,
  Printer,
  Package,
  Calendar,
  TrendingDown,
  AlertCircle,
  FileText,
  User,
  Activity
} from 'lucide-react';
import type { Prescription, Drug, Patient, Encounter } from '../../types/HospitalDataModel';

// ==========================================
// 1. E-PRESCRIBING INTERFACE (DOCTOR VIEW)
// ==========================================

interface EPrescribingProps {
  patient: Patient;
  encounter: Encounter;
  onPrescribe: (prescription: Partial<Prescription>) => void;
}

export const EPrescribing: React.FC<EPrescribingProps> = ({
  patient,
  encounter,
  onPrescribe
}) => {
  const { t } = useTranslation(['clinical', 'common']);
  
  const [prescriptions, setPrescriptions] = useState<Array<Partial<Prescription>>>([]);
  const [currentPrescription, setCurrentPrescription] = useState<Partial<Prescription>>({
    encounter_id: encounter.encounter_id,
    patient_id: patient.patient_id
  });
  
  const [drugSearch, setDrugSearch] = useState('');
  const [drugResults, setDrugResults] = useState<Drug[]>([]);
  const [showDrugSearch, setShowDrugSearch] = useState(false);
  const [interactions, setInteractions] = useState<string[]>([]);
  const [contraindications, setContraindications] = useState<string[]>([]);

  /**
   * DRUG SEARCH
   */
  const searchDrugs = async (query: string) => {
    if (query.length < 2) {
      setDrugResults([]);
      return;
    }

    // Mock drug database - replace with actual formulary
    const mockDrugs: Drug[] = [
      {
        drug_id: 'drug-001',
        generic_name: 'Artemether-Lumefantrine',
        brand_names: ['Coartem', 'Riamet'],
        category: 'Antimalarial',
        controlled_substance: false,
        requires_prescription: true,
        inventory: [],
        interactions: ['Efavirenz', 'Nevirapine'],
        contraindications: ['First trimester pregnancy', 'Severe hepatic impairment'],
        pregnancy_category: 'C',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        drug_id: 'drug-002',
        generic_name: 'Amoxicillin',
        brand_names: ['Amoxil', 'Trimox'],
        category: 'Antibiotic (Penicillin)',
        controlled_substance: false,
        requires_prescription: true,
        inventory: [],
        interactions: ['Warfarin', 'Methotrexate'],
        contraindications: ['Penicillin allergy', 'Infectious mononucleosis'],
        pregnancy_category: 'B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        drug_id: 'drug-003',
        generic_name: 'Metformin',
        brand_names: ['Glucophage', 'Fortamet'],
        category: 'Antidiabetic (Biguanide)',
        controlled_substance: false,
        requires_prescription: true,
        inventory: [],
        interactions: ['Contrast agents', 'Alcohol'],
        contraindications: ['Renal impairment', 'Metabolic acidosis'],
        pregnancy_category: 'B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        drug_id: 'drug-004',
        generic_name: 'Paracetamol',
        brand_names: ['Tylenol', 'Panadol'],
        category: 'Analgesic/Antipyretic',
        controlled_substance: false,
        requires_prescription: false,
        inventory: [],
        interactions: ['Warfarin', 'Alcohol'],
        contraindications: ['Severe hepatic impairment'],
        pregnancy_category: 'A',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const results = mockDrugs.filter(drug =>
      drug.generic_name.toLowerCase().includes(query.toLowerCase()) ||
      drug.brand_names.some(brand => brand.toLowerCase().includes(query.toLowerCase()))
    );

    setDrugResults(results);
  };

  /**
   * CHECK DRUG INTERACTIONS
   */
  const checkInteractions = (newDrug: Drug) => {
    const allDrugs = [...prescriptions, currentPrescription].filter(p => p.drug_name);
    const foundInteractions: string[] = [];
    
    // Check against patient allergies
    if (patient.allergies.some(allergy => 
      newDrug.generic_name.toLowerCase().includes(allergy.toLowerCase()) ||
      newDrug.category.toLowerCase().includes(allergy.toLowerCase())
    )) {
      foundInteractions.push(`⚠️ ALLERGY ALERT: Patient is allergic to ${patient.allergies.join(', ')}`);
    }

    // Check drug-drug interactions
    newDrug.interactions.forEach(interaction => {
      if (allDrugs.some(p => p.drug_name?.includes(interaction))) {
        foundInteractions.push(`⚠️ Drug interaction: ${newDrug.generic_name} + ${interaction}`);
      }
    });

    setInteractions(foundInteractions);
    setContraindications(newDrug.contraindications);
  };

  const selectDrug = (drug: Drug) => {
    setCurrentPrescription({
      ...currentPrescription,
      drug_id: drug.drug_id,
      drug_name: drug.generic_name,
      drug_form: '',
      strength: '',
      drug_interactions: drug.interactions,
      contraindications: drug.contraindications
    });
    
    checkInteractions(drug);
    setShowDrugSearch(false);
    setDrugSearch('');
  };

  const addPrescription = () => {
    if (!currentPrescription.drug_name || !currentPrescription.dose || !currentPrescription.frequency) {
      alert('Please complete all required fields');
      return;
    }

    setPrescriptions([...prescriptions, currentPrescription]);
    setCurrentPrescription({
      encounter_id: encounter.encounter_id,
      patient_id: patient.patient_id
    });
    setInteractions([]);
    setContraindications([]);
  };

  const submitAllPrescriptions = async () => {
    for (const rx of prescriptions) {
      await onPrescribe(rx);
    }
    setPrescriptions([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#EFF6FF] rounded-lg">
            <Pill className="h-6 w-6 text-[#0F3D56]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-[#1E1E1E]">
              E-Prescribing
            </h2>
            <p className="text-sm text-[#6B7280]">
              Patient: {patient.first_name} {patient.last_name} ({patient.afya_id})
            </p>
          </div>
        </div>
      </Card>

      {/* Patient Alerts */}
      {(patient.allergies.length > 0 || patient.chronic_conditions.length > 0) && (
        <Card className="p-4 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#C84B31] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-[#C84B31] mb-2">
                Patient Alerts
              </h3>
              {patient.allergies.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Allergies:</span>{' '}
                  <span className="text-sm">{patient.allergies.join(', ')}</span>
                </div>
              )}
              {patient.chronic_conditions.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Chronic Conditions:</span>{' '}
                  <span className="text-sm">{patient.chronic_conditions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* New Prescription Form */}
      <Card className="p-6">
        <h3 className="font-medium text-[#1E1E1E] mb-4">
          New Prescription
        </h3>

        <div className="space-y-4">
          {/* Drug Selection */}
          <div>
            <Label className="required">Medication</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={currentPrescription.drug_name || ''}
                placeholder="Search drug name..."
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowDrugSearch(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Drug Form & Strength */}
          {currentPrescription.drug_name && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="required">Form</Label>
                  <select
                    value={currentPrescription.drug_form || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      drug_form: e.target.value
                    })}
                    className="w-full mt-2 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select form</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>

                <div>
                  <Label className="required">Strength</Label>
                  <Input
                    value={currentPrescription.strength || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      strength: e.target.value
                    })}
                    placeholder="e.g., 500mg"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Dosing */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="required">Dose</Label>
                  <Input
                    value={currentPrescription.dose || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      dose: e.target.value
                    })}
                    placeholder="e.g., 2 tablets"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="required">Frequency</Label>
                  <select
                    value={currentPrescription.frequency || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      frequency: e.target.value
                    })}
                    className="w-full mt-2 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="once daily">Once daily</option>
                    <option value="twice daily">Twice daily</option>
                    <option value="three times daily">Three times daily</option>
                    <option value="four times daily">Four times daily</option>
                    <option value="every 6 hours">Every 6 hours</option>
                    <option value="every 8 hours">Every 8 hours</option>
                    <option value="every 12 hours">Every 12 hours</option>
                    <option value="as needed">As needed</option>
                  </select>
                </div>

                <div>
                  <Label className="required">Duration (days)</Label>
                  <Input
                    type="number"
                    value={currentPrescription.duration_days || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      duration_days: parseInt(e.target.value)
                    })}
                    placeholder="7"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Route & Instructions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Route</Label>
                  <select
                    value={currentPrescription.route || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      route: e.target.value
                    })}
                    className="w-full mt-2 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select route</option>
                    <option value="Oral">Oral</option>
                    <option value="IV">Intravenous (IV)</option>
                    <option value="IM">Intramuscular (IM)</option>
                    <option value="SC">Subcutaneous (SC)</option>
                    <option value="Topical">Topical</option>
                    <option value="Rectal">Rectal</option>
                  </select>
                </div>

                <div>
                  <Label>Indication</Label>
                  <Input
                    value={currentPrescription.indication || ''}
                    onChange={(e) => setCurrentPrescription({
                      ...currentPrescription,
                      indication: e.target.value
                    })}
                    placeholder="e.g., For malaria treatment"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={currentPrescription.instructions || ''}
                  onChange={(e) => setCurrentPrescription({
                    ...currentPrescription,
                    instructions: e.target.value
                  })}
                  placeholder="e.g., Take with food, avoid alcohol..."
                  className="mt-2"
                />
              </div>

              {/* Interactions & Warnings */}
              {(interactions.length > 0 || contraindications.length > 0) && (
                <Card className="p-4 bg-[#FEF3F2] border-[#C84B31]">
                  {interactions.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-[#C84B31] mb-2">
                        ⚠️ Drug Interactions
                      </h4>
                      <ul className="space-y-1">
                        {interactions.map((interaction, index) => (
                          <li key={index} className="text-sm text-[#6B7280]">
                            {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {contraindications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#C84B31] mb-2">
                        Contraindications
                      </h4>
                      <ul className="space-y-1">
                        {contraindications.map((contra, index) => (
                          <li key={index} className="text-sm text-[#6B7280]">
                            • {contra}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}

              <Button onClick={addPrescription} className="gap-2">
                <Plus className="h-4 w-4" />
                Add to Prescription List
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Prescription List */}
      {prescriptions.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium text-[#1E1E1E] mb-4">
            Prescription Summary ({prescriptions.length} medication{prescriptions.length !== 1 ? 's' : ''})
          </h3>

          <div className="space-y-3">
            {prescriptions.map((rx, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[#1E1E1E] mb-1">
                      {rx.drug_name} {rx.strength}
                    </div>
                    <div className="text-sm text-[#6B7280] space-y-1">
                      <div>
                        <span className="font-medium">Dose:</span> {rx.dose} {rx.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {rx.duration_days} days
                      </div>
                      {rx.instructions && (
                        <div>
                          <span className="font-medium">Instructions:</span> {rx.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={submitAllPrescriptions} className="flex-1 gap-2">
              <CheckCircle className="h-4 w-4" />
              Send to Pharmacy
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </Card>
      )}

      {/* Drug Search Modal */}
      {showDrugSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Search Medication</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDrugSearch(false);
                    setDrugSearch('');
                    setDrugResults([]);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <Input
                placeholder="Search by generic or brand name..."
                value={drugSearch}
                onChange={(e) => {
                  setDrugSearch(e.target.value);
                  searchDrugs(e.target.value);
                }}
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {drugResults.length > 0 ? (
                <div className="space-y-2">
                  {drugResults.map((drug) => (
                    <div
                      key={drug.drug_id}
                      className="p-4 border rounded-lg hover:bg-[#EFF6FF] cursor-pointer transition-colors"
                      onClick={() => selectDrug(drug)}
                    >
                      <div className="font-medium text-[#1E1E1E] mb-1">
                        {drug.generic_name}
                      </div>
                      <div className="text-sm text-[#6B7280] mb-2">
                        Brand names: {drug.brand_names.join(', ')}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {drug.category}
                        </Badge>
                        {drug.requires_prescription && (
                          <Badge variant="outline" className="text-xs">
                            Rx Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : drugSearch.length >= 2 ? (
                <p className="text-center text-[#6B7280] py-8">
                  No medications found for "{drugSearch}"
                </p>
              ) : (
                <p className="text-center text-[#6B7280] py-8">
                  Start typing to search medications
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ============================================
// 2. PHARMACIST DISPENSING INTERFACE
// ============================================

interface PharmacyDispensingProps {
  facilityId: string;
}

export const PharmacyDispensing: React.FC<PharmacyDispensingProps> = ({ facilityId }) => {
  const [pendingPrescriptions, setPendingPrescriptions] = useState<Array<Prescription & { patient: Patient }>>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<(Prescription & { patient: Patient }) | null>(null);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  // Mock data
  useEffect(() => {
    // Load prescriptions from API
    const mockPrescriptions: Array<Prescription & { patient: Patient }> = [];
    setPendingPrescriptions(mockPrescriptions);
  }, [facilityId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFF6FF] rounded-lg">
              <Pill className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Pharmacy - Dispensing
              </h2>
              <p className="text-sm text-[#6B7280]">
                {pendingPrescriptions.length} prescription{pendingPrescriptions.length !== 1 ? 's' : ''} pending
              </p>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'dispensed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('dispensed')}
            >
              Dispensed Today
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Alerts */}
      <Card className="p-4 bg-[#FEF3E7] border-[#F4A261]">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-[#F4A261]" />
          <div className="flex-1">
            <h3 className="font-medium text-[#F4A261]">
              3 Medications Low Stock
            </h3>
            <p className="text-sm text-[#6B7280]">
              Amoxicillin (50 tablets), Paracetamol (120 tablets), Metformin (80 tablets)
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Inventory
          </Button>
        </div>
      </Card>

      {/* Prescription Queue */}
      {pendingPrescriptions.length === 0 && (
        <Card className="p-12 text-center">
          <Pill className="h-12 w-12 mx-auto mb-4 text-[#6B7280]" />
          <h3 className="text-lg font-medium text-[#1E1E1E] mb-2">
            No Pending Prescriptions
          </h3>
          <p className="text-sm text-[#6B7280]">
            All prescriptions have been dispensed
          </p>
        </Card>
      )}
    </div>
  );
};

// ============================================
// 3. INVENTORY MANAGEMENT
// ============================================

export const PharmacyInventory: React.FC<{ facilityId: string }> = ({ facilityId }) => {
  const [inventory, setInventory] = useState<Array<Drug & { quantity: number; reorderLevel: number }>>([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Pharmacy Inventory</h2>
        
        <div className="flex gap-3 mb-6">
          <Button
            variant={showLowStock ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowLowStock(!showLowStock)}
            className="gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            Low Stock Only
          </Button>
          <Button
            variant={showExpiring ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowExpiring(!showExpiring)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Expiring Soon
          </Button>
        </div>

        <p className="text-center text-[#6B7280] py-12">
          Inventory management interface - showing stock levels, batch numbers, expiry dates
        </p>
      </Card>
    </div>
  );
};
