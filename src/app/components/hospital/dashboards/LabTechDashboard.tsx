/**
 * LAB TECH DASHBOARD
 * 
 * Laboratory technician workspace
 * 
 * Features:
 * - Pending lab orders queue
 * - Result entry workflow
 * - Quality control tracking
 * - Equipment status
 * - Reagent inventory
 * - Critical results alert
 * - Daily performance metrics
 */

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  TestTube,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Package,
  Settings,
  TrendingUp,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface LabTechDashboardProps {
  userId: string;
  facilityId: string;
}

export const LabTechDashboard: React.FC<LabTechDashboardProps> = ({
  userId,
  facilityId
}) => {
  const [stats, setStats] = useState({
    pendingOrders: 8,
    completedToday: 45,
    criticalResults: 2,
    avgTurnaroundTime: 35
  });

  const [pendingTests, setPendingTests] = useState([
    {
      orderId: 'L-001',
      patient: { name: 'John Mwangi', afya_id: 'AFY-012-2024' },
      test: 'Complete Blood Count (CBC)',
      priority: 'stat',
      orderedBy: 'Dr. Mwangi',
      orderedAt: '5 min ago',
      specimen: 'collected'
    },
    {
      orderId: 'L-002',
      patient: { name: 'Grace Mwakasege', afya_id: 'AFY-045-2024' },
      test: 'Malaria RDT',
      priority: 'urgent',
      orderedBy: 'Dr. Hassan',
      orderedAt: '12 min ago',
      specimen: 'collected'
    }
  ]);

  const [criticalResults, setCriticalResults] = useState([
    {
      patient: 'Emmanuel Kileo',
      test: 'Hemoglobin',
      value: '6.2 g/dL',
      expected: '12-16 g/dL'
    },
    {
      patient: 'Sarah Ndosi',
      test: 'Blood Glucose',
      value: '420 mg/dL',
      expected: '70-140 mg/dL'
    }
  ]);

  const [reagentStatus, setReagentStatus] = useState([
    { reagent: 'CBC Reagent', level: 45, status: 'ok' },
    { reagent: 'Malaria RDT Kits', level: 15, status: 'low' },
    { reagent: 'Chemistry Panel', level: 78, status: 'ok' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Laboratory Dashboard
          </h1>
          <p className="text-[#6B7280]">
            Lab Technician • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Button className="gap-2">
          <TestTube className="h-4 w-4" />
          Quality Control
        </Button>
      </div>

      {/* Critical Results Alert */}
      {criticalResults.length > 0 && (
        <Card className="p-4 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#C84B31] flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-medium text-[#C84B31] mb-2">
                {criticalResults.length} Critical Result{criticalResults.length !== 1 ? 's' : ''} - Notify Physician Immediately
              </h3>
              <div className="space-y-2">
                {criticalResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <div className="font-medium text-[#1E1E1E]">{result.patient}</div>
                      <div className="text-sm text-[#6B7280]">
                        {result.test}: <span className="font-medium text-[#C84B31]">{result.value}</span> (Expected: {result.expected})
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#C84B31] hover:bg-[#A03B24]">
                      Notify Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#F4A261]" />
          </div>
          <div className="text-3xl font-bold text-[#F4A261] mb-1">
            {stats.pendingOrders}
          </div>
          <div className="text-sm text-[#6B7280]">Pending Orders</div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {stats.completedToday}
          </div>
          <div className="text-sm text-[#6B7280]">Completed Today</div>
        </Card>

        <Card className="p-6 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-[#C84B31]" />
          </div>
          <div className="text-3xl font-bold text-[#C84B31] mb-1">
            {stats.criticalResults}
          </div>
          <div className="text-sm text-[#6B7280]">Critical Results</div>
        </Card>

        <Card className="p-6 bg-[#EFF6FF] border-[#0F3D56]/20">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {stats.avgTurnaroundTime}m
          </div>
          <div className="text-sm text-[#6B7280]">Avg Turnaround</div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Tests */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Pending Lab Orders ({pendingTests.length})
              </h2>
            </div>

            <div className="space-y-3">
              {pendingTests.map((test) => (
                <div
                  key={test.orderId}
                  className="p-4 border rounded-lg hover:border-[#0F3D56] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-[#0F3D56]">
                        {test.orderId}
                      </div>
                      <div>
                        <div className="font-medium text-[#1E1E1E]">
                          {test.patient.name}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {test.patient.afya_id}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      test.priority === 'stat' ? 'bg-[#C84B31]' :
                      test.priority === 'urgent' ? 'bg-[#F4A261]' :
                      'bg-[#6B7280]'
                    }>
                      {test.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-3 bg-[#F9FAFB] rounded mb-3">
                    <div className="font-medium text-[#1E1E1E] mb-1">
                      {test.test}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Ordered by {test.orderedBy} • {test.orderedAt}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Specimen {test.specimen}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="gap-2">
                        <TestTube className="h-4 w-4" />
                        Process
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Reagent Status */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Reagent Inventory
            </h2>
            <div className="space-y-3">
              {reagentStatus.map((reagent, index) => (
                <div key={index} className="p-3 bg-[#F9FAFB] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1E1E1E]">
                      {reagent.reagent}
                    </span>
                    <Badge className={
                      reagent.status === 'low' ? 'bg-[#C84B31]' : 'bg-green-600'
                    }>
                      {reagent.level}%
                    </Badge>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        reagent.status === 'low' ? 'bg-[#C84B31]' : 'bg-green-600'
                      }`}
                      style={{ width: `${reagent.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <Package className="h-4 w-4" />
              Order Supplies
            </Button>
          </Card>

          {/* Equipment Status */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Equipment Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[#1E1E1E]">Hematology Analyzer</div>
                  <div className="text-xs text-[#6B7280]">Last QC: 2 hours ago</div>
                </div>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  OK
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[#1E1E1E]">Chemistry Analyzer</div>
                  <div className="text-xs text-[#6B7280]">Last QC: 1 hour ago</div>
                </div>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  OK
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FEF3E7] rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[#1E1E1E]">Centrifuge</div>
                  <div className="text-xs text-[#6B7280]">Calibration due</div>
                </div>
                <Badge className="bg-[#F4A261]">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Attention
                </Badge>
              </div>
            </div>
          </Card>

          {/* Today's Performance */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Today's Performance
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Tests Completed</span>
                <span className="font-medium">{stats.completedToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Pending</span>
                <span className="font-medium">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">QC Tests Run</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Turnaround Time</span>
                <span className="font-medium text-green-600">{stats.avgTurnaroundTime}m</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
