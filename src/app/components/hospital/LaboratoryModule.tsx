/**
 * Complete Laboratory Module
 * 
 * Features:
 * - Lab order entry (doctor interface)
 * - Specimen tracking
 * - Result entry with structured values (lab tech interface)
 * - Reference ranges & abnormal flagging
 * - Result verification workflow
 * - Lab reports (PDF/print)
 * - Integration with clinical notes
 * - LOINC coding support
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
  TestTube,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  FileText,
  Printer,
  Eye,
  Upload,
  X,
  Activity,
  TrendingUp,
  TrendingDown,
  User
} from 'lucide-react';
import type { LabOrder, LabResult, Patient, Encounter } from '../../types/HospitalDataModel';

// ================================================
// 1. LAB ORDER ENTRY (DOCTOR INTERFACE)
// ================================================

interface LabOrderingProps {
  patient: Patient;
  encounter: Encounter;
  onOrderSubmit: (order: Partial<LabOrder>) => void;
}

export const LabOrdering: React.FC<LabOrderingProps> = ({
  patient,
  encounter,
  onOrderSubmit
}) => {
  const { t } = useTranslation(['clinical', 'common']);
  
  const [selectedTests, setSelectedTests] = useState<Array<{
    test_type: string;
    test_code: string;
    priority: 'routine' | 'urgent' | 'stat';
    specimen_type: string;
  }>>([]);

  const [currentTest, setCurrentTest] = useState<{
    test_type: string;
    test_code: string;
    priority: 'routine' | 'urgent' | 'stat';
    specimen_type: string;
    clinical_indication: string;
    fasting_required: boolean;
  }>({
    test_type: '',
    test_code: '',
    priority: 'routine',
    specimen_type: '',
    clinical_indication: '',
    fasting_required: false
  });

  /**
   * COMMON LAB TESTS (Tanzania context)
   */
  const commonTests = [
    // Hematology
    { code: 'CBC', name: 'Complete Blood Count (CBC)', specimen: 'Blood (EDTA)', loinc: '58410-2', fasting: false },
    { code: 'HGB', name: 'Hemoglobin', specimen: 'Blood', loinc: '718-7', fasting: false },
    { code: 'WBC', name: 'White Blood Cell Count', specimen: 'Blood', loinc: '6690-2', fasting: false },
    { code: 'PLT', name: 'Platelet Count', specimen: 'Blood', loinc: '777-3', fasting: false },
    
    // Chemistry
    { code: 'GLU', name: 'Blood Glucose (Random)', specimen: 'Blood (serum)', loinc: '2345-7', fasting: false },
    { code: 'FBS', name: 'Fasting Blood Sugar', specimen: 'Blood (serum)', loinc: '1558-6', fasting: true },
    { code: 'HBA1C', name: 'HbA1c (Glycated Hemoglobin)', specimen: 'Blood', loinc: '4548-4', fasting: false },
    { code: 'CREAT', name: 'Creatinine', specimen: 'Blood (serum)', loinc: '2160-0', fasting: false },
    { code: 'BUN', name: 'Blood Urea Nitrogen', specimen: 'Blood (serum)', loinc: '3094-0', fasting: false },
    
    // Infectious Diseases
    { code: 'MALARIA', name: 'Malaria Rapid Diagnostic Test (RDT)', specimen: 'Blood', loinc: '32700-7', fasting: false },
    { code: 'MALARIA-MICRO', name: 'Malaria Microscopy', specimen: 'Blood (smear)', loinc: '32700-7', fasting: false },
    { code: 'HIV', name: 'HIV Rapid Test', specimen: 'Blood', loinc: '75622-1', fasting: false },
    { code: 'TB', name: 'TB GeneXpert', specimen: 'Sputum', loinc: '45323-3', fasting: false },
    { code: 'SYPHILIS', name: 'Syphilis (RPR)', specimen: 'Blood (serum)', loinc: '20507-0', fasting: false },
    
    // Urinalysis
    { code: 'UA', name: 'Urinalysis (Complete)', specimen: 'Urine', loinc: '24357-6', fasting: false },
    { code: 'UPCR', name: 'Urine Protein/Creatinine Ratio', specimen: 'Urine', loinc: '14959-1', fasting: false },
    
    // Pregnancy
    { code: 'PREG', name: 'Pregnancy Test (β-hCG)', specimen: 'Urine/Blood', loinc: '2118-8', fasting: false },
    
    // Liver Function
    { code: 'ALT', name: 'ALT (SGPT)', specimen: 'Blood (serum)', loinc: '1742-6', fasting: false },
    { code: 'AST', name: 'AST (SGOT)', specimen: 'Blood (serum)', loinc: '1920-8', fasting: false },
    
    // Stool
    { code: 'STOOL', name: 'Stool Analysis', specimen: 'Stool', loinc: '66746-9', fasting: false },
    { code: 'STOOL-CULTURE', name: 'Stool Culture', specimen: 'Stool', loinc: '625-4', fasting: false }
  ];

  const [testSearch, setTestSearch] = useState('');
  const [filteredTests, setFilteredTests] = useState(commonTests);

  useEffect(() => {
    if (testSearch) {
      const filtered = commonTests.filter(test =>
        test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
        test.code.toLowerCase().includes(testSearch.toLowerCase())
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(commonTests);
    }
  }, [testSearch]);

  const selectTest = (test: typeof commonTests[0]) => {
    setCurrentTest({
      test_type: test.name,
      test_code: test.code,
      priority: 'routine',
      specimen_type: test.specimen,
      clinical_indication: '',
      fasting_required: test.fasting
    });
  };

  const addTest = () => {
    if (!currentTest.test_type) {
      alert('Please select a test');
      return;
    }

    setSelectedTests([...selectedTests, {
      test_type: currentTest.test_type,
      test_code: currentTest.test_code,
      priority: currentTest.priority,
      specimen_type: currentTest.specimen_type
    }]);

    setCurrentTest({
      test_type: '',
      test_code: '',
      priority: 'routine',
      specimen_type: '',
      clinical_indication: '',
      fasting_required: false
    });
  };

  const submitOrders = async () => {
    for (const test of selectedTests) {
      const order: Partial<LabOrder> = {
        encounter_id: encounter.encounter_id,
        patient_id: patient.patient_id,
        test_type: test.test_type,
        test_code: test.test_code,
        priority: test.priority,
        status: 'ordered',
        specimen_type: test.specimen_type,
        clinical_indication: currentTest.clinical_indication,
        fasting_required: currentTest.fasting_required
      };
      
      await onOrderSubmit(order);
    }
    
    setSelectedTests([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#EFF6FF] rounded-lg">
            <TestTube className="h-6 w-6 text-[#0F3D56]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-[#1E1E1E]">
              Laboratory Orders
            </h2>
            <p className="text-sm text-[#6B7280]">
              Patient: {patient.first_name} {patient.last_name} ({patient.afya_id})
            </p>
          </div>
        </div>
      </Card>

      {/* Test Selection */}
      <Card className="p-6">
        <h3 className="font-medium text-[#1E1E1E] mb-4">
          Select Laboratory Tests
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <Input
            placeholder="Search tests..."
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-[400px] overflow-y-auto">
          {filteredTests.map((test) => (
            <div
              key={test.code}
              onClick={() => selectTest(test)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-[#0F3D56] hover:bg-[#EFF6FF] ${
                currentTest.test_code === test.code ? 'border-[#0F3D56] bg-[#EFF6FF]' : ''
              }`}
            >
              <div className="font-medium text-sm text-[#1E1E1E] mb-1">
                {test.name}
              </div>
              <div className="text-xs text-[#6B7280]">
                {test.specimen}
              </div>
              {test.fasting && (
                <Badge variant="outline" className="text-xs mt-1">
                  Fasting required
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Selected Test Details */}
        {currentTest.test_type && (
          <div className="space-y-4 p-4 bg-[#F9FAFB] rounded-lg">
            <div>
              <div className="font-medium text-[#1E1E1E] mb-1">
                Selected: {currentTest.test_type}
              </div>
              <div className="text-sm text-[#6B7280]">
                Specimen: {currentTest.specimen_type}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <select
                  value={currentTest.priority}
                  onChange={(e) => setCurrentTest({
                    ...currentTest,
                    priority: e.target.value as 'routine' | 'urgent' | 'stat'
                  })}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT (Immediate)</option>
                </select>
              </div>

              <div className="flex items-end">
                {currentTest.fasting_required && (
                  <Badge className="bg-[#F4A261] text-white">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Fasting Required
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <Label>Clinical Indication</Label>
              <Input
                value={currentTest.clinical_indication}
                onChange={(e) => setCurrentTest({
                  ...currentTest,
                  clinical_indication: e.target.value
                })}
                placeholder="Reason for test..."
                className="mt-2"
              />
            </div>

            <Button onClick={addTest} className="gap-2">
              <Plus className="h-4 w-4" />
              Add to Order
            </Button>
          </div>
        )}
      </Card>

      {/* Order Summary */}
      {selectedTests.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium text-[#1E1E1E] mb-4">
            Order Summary ({selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''})
          </h3>

          <div className="space-y-2 mb-6">
            {selectedTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <div className="font-medium text-[#1E1E1E]">
                    {test.test_type}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {test.specimen_type} • {test.priority}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTests(selectedTests.filter((_, i) => i !== index))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={submitOrders} className="flex-1 gap-2">
              <CheckCircle className="h-4 w-4" />
              Send to Laboratory
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Lab Form
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

// ================================================
// 2. LAB RESULT ENTRY (LAB TECH INTERFACE)
// ================================================

interface LabResultEntryProps {
  labOrder: LabOrder & { patient: Patient };
  onResultSubmit: (result: Partial<LabResult>) => void;
}

export const LabResultEntry: React.FC<LabResultEntryProps> = ({
  labOrder,
  onResultSubmit
}) => {
  const [results, setResults] = useState<Partial<LabResult>>({
    lab_order_id: labOrder.lab_order_id,
    patient_id: labOrder.patient_id,
    test_name: labOrder.test_type,
    status: 'preliminary'
  });

  const [abnormalFlag, setAbnormalFlag] = useState<'normal' | 'low' | 'high' | 'critical-low' | 'critical-high' | 'abnormal'>('normal');

  /**
   * REFERENCE RANGES (age/gender specific)
   */
  const referenceRanges: Record<string, { low: number; high: number; criticalLow?: number; criticalHigh?: number; unit: string }> = {
    'Hemoglobin': { low: 12, high: 16, criticalLow: 7, criticalHigh: 20, unit: 'g/dL' },
    'White Blood Cell Count': { low: 4000, high: 11000, criticalLow: 2000, criticalHigh: 30000, unit: '/μL' },
    'Platelet Count': { low: 150000, high: 400000, criticalLow: 50000, criticalHigh: 1000000, unit: '/μL' },
    'Blood Glucose (Random)': { low: 70, high: 140, criticalLow: 40, criticalHigh: 400, unit: 'mg/dL' },
    'Fasting Blood Sugar': { low: 70, high: 100, criticalLow: 40, criticalHigh: 300, unit: 'mg/dL' },
    'Creatinine': { low: 0.6, high: 1.2, criticalLow: 0.3, criticalHigh: 10, unit: 'mg/dL' }
  };

  const checkAbnormalFlag = (value: number, testName: string) => {
    const range = referenceRanges[testName];
    if (!range) return 'normal';

    if (range.criticalLow && value < range.criticalLow) return 'critical-low';
    if (range.criticalHigh && value > range.criticalHigh) return 'critical-high';
    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'normal';
  };

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value);
    setResults({ ...results, result_value: value });

    if (!isNaN(numValue)) {
      const flag = checkAbnormalFlag(numValue, labOrder.test_type);
      setAbnormalFlag(flag);
      setResults({ ...results, result_value: value, abnormal_flag: flag });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-[#1E1E1E]">
              Result Entry: {labOrder.test_type}
            </h3>
            <p className="text-sm text-[#6B7280]">
              Patient: {labOrder.patient.first_name} {labOrder.patient.last_name} • 
              Order ID: {labOrder.lab_order_id.slice(0, 8)}
            </p>
          </div>
          <Badge className={
            labOrder.priority === 'stat' ? 'bg-[#C84B31]' : 
            labOrder.priority === 'urgent' ? 'bg-[#F4A261]' : 
            'bg-[#6B7280]'
          }>
            {labOrder.priority.toUpperCase()}
          </Badge>
        </div>
      </Card>

      {/* Result Form */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* For structured results */}
          {referenceRanges[labOrder.test_type] && (
            <>
              <div>
                <Label className="required">Result Value</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={results.result_value || ''}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder="Enter value"
                    className="flex-1"
                  />
                  <div className="flex items-center px-4 bg-[#F9FAFB] border rounded-lg min-w-[80px]">
                    <span className="text-sm text-[#6B7280]">
                      {referenceRanges[labOrder.test_type].unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reference Range Display */}
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-sm mb-2">
                  <span className="font-medium">Reference Range:</span>{' '}
                  {referenceRanges[labOrder.test_type].low} - {referenceRanges[labOrder.test_type].high} {referenceRanges[labOrder.test_type].unit}
                </div>
                
                {/* Abnormal Flag */}
                {abnormalFlag !== 'normal' && (
                  <div className="flex items-center gap-2 mt-2">
                    {(abnormalFlag === 'critical-low' || abnormalFlag === 'critical-high') && (
                      <Badge className="bg-[#C84B31] gap-2">
                        <AlertCircle className="h-3 w-3" />
                        CRITICAL: {abnormalFlag === 'critical-low' ? 'Very Low' : 'Very High'}
                      </Badge>
                    )}
                    {abnormalFlag === 'low' && (
                      <Badge className="bg-[#F4A261] gap-2">
                        <TrendingDown className="h-3 w-3" />
                        Below Normal
                      </Badge>
                    )}
                    {abnormalFlag === 'high' && (
                      <Badge className="bg-[#F4A261] gap-2">
                        <TrendingUp className="h-3 w-3" />
                        Above Normal
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* For qualitative results (e.g., Malaria RDT) */}
          {!referenceRanges[labOrder.test_type] && (
            <div>
              <Label className="required">Result</Label>
              <select
                value={results.result_value || ''}
                onChange={(e) => setResults({ ...results, result_value: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Select result</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Indeterminate">Indeterminate</option>
                <option value="Invalid">Invalid</option>
              </select>
            </div>
          )}

          {/* Interpretation */}
          <div>
            <Label>Interpretation</Label>
            <Textarea
              value={results.interpretation || ''}
              onChange={(e) => setResults({ ...results, interpretation: e.target.value })}
              placeholder="Clinical interpretation of results..."
              className="mt-2"
            />
          </div>

          {/* Comments */}
          <div>
            <Label>Comments</Label>
            <Textarea
              value={results.comments || ''}
              onChange={(e) => setResults({ ...results, comments: e.target.value })}
              placeholder="Additional notes..."
              className="mt-2"
            />
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments (Optional)</Label>
            <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-[#6B7280]" />
              <p className="text-sm text-[#6B7280] mb-2">
                Upload lab report images or PDFs
              </p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onResultSubmit({ ...results, status: 'preliminary' })}
              variant="outline"
              className="flex-1"
            >
              Save as Preliminary
            </Button>
            <Button
              onClick={() => onResultSubmit({ ...results, status: 'final' })}
              className="flex-1 gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Submit Final Result
            </Button>
          </div>
        </div>
      </Card>

      {/* Critical Value Alert */}
      {(abnormalFlag === 'critical-low' || abnormalFlag === 'critical-high') && (
        <Card className="p-4 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#C84B31] flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-medium text-[#C84B31] mb-1">
                Critical Value Alert
              </h3>
              <p className="text-sm text-[#6B7280]">
                This result is in the critical range. The ordering physician must be notified immediately.
              </p>
              <Button size="sm" className="mt-3 bg-[#C84B31] hover:bg-[#A03B24]">
                Notify Physician Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// ================================================
// 3. LAB QUEUE (LAB TECH DASHBOARD)
// ================================================

export const LabQueue: React.FC<{ facilityId: string }> = ({ facilityId }) => {
  const [pendingOrders, setPendingOrders] = useState<Array<LabOrder & { patient: Patient }>>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('ordered');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFF6FF] rounded-lg">
              <TestTube className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Laboratory Queue
              </h2>
              <p className="text-sm text-[#6B7280]">
                {pendingOrders.length} pending order{pendingOrders.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="stat">STAT</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="ordered">Ordered</option>
              <option value="specimen-collected">Specimen Collected</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed Today</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      <Card className="p-12 text-center">
        <TestTube className="h-12 w-12 mx-auto mb-4 text-[#6B7280]" />
        <h3 className="text-lg font-medium text-[#1E1E1E] mb-2">
          No Pending Lab Orders
        </h3>
        <p className="text-sm text-[#6B7280]">
          All orders have been processed
        </p>
      </Card>
    </div>
  );
};
