/**
 * DOCTOR DASHBOARD
 * 
 * Comprehensive clinical workspace for doctors
 * 
 * Features:
 * - Today's patients & appointments
 * - Active encounters queue
 * - Recent patients
 * - High-risk alerts
 * - Pending tasks (unsigned notes, pending orders)
 * - Clinical performance metrics
 * - Quick actions (new patient, documentation, orders)
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Users,
  Clock,
  FileText,
  AlertCircle,
  Activity,
  TrendingUp,
  Calendar,
  Stethoscope,
  Pill,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  ArrowRight,
  Heart,
  Baby
} from 'lucide-react';
import type { Encounter, Patient } from '../../../types/HospitalDataModel';

interface DoctorDashboardProps {
  userId: string;
  facilityId: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  userId,
  facilityId
}) => {
  const { t } = useTranslation(['clinical', 'common']);
  
  const [todayStats, setTodayStats] = useState({
    totalPatients: 12,
    completed: 8,
    inProgress: 2,
    waiting: 2,
    avgConsultationTime: 18 // minutes
  });

  const [highRiskAlerts, setHighRiskAlerts] = useState([
    {
      patient: { name: 'Emmanuel Kileo', afya_id: 'AFY-001-2024', age: 38 },
      alert: 'Chest pain - Possible ACS',
      priority: 'critical',
      time: '10 min ago'
    },
    {
      patient: { name: 'Grace Mwakasege', afya_id: 'AFY-045-2024', age: 28 },
      alert: 'Pregnancy complications - High BP',
      priority: 'urgent',
      time: '25 min ago'
    }
  ]);

  const [myQueue, setMyQueue] = useState([
    {
      queueNumber: 3,
      patient: { name: 'John Mwangi', afya_id: 'AFY-012-2024', age: 45, gender: 'M' },
      chiefComplaint: 'Fever for 3 days, headache',
      triagePriority: 3,
      waitTime: 15,
      vitals: { bp: '130/85', temp: 38.5, hr: 88 }
    },
    {
      queueNumber: 4,
      patient: { name: 'Amina Hassan', afya_id: 'AFY-024-2024', age: 32, gender: 'F' },
      chiefComplaint: 'Abdominal pain',
      triagePriority: 2,
      waitTime: 8,
      vitals: { bp: '120/80', temp: 37.2, hr: 92 }
    }
  ]);

  const [pendingTasks, setPendingTasks] = useState({
    unsignedNotes: 3,
    pendingOrders: 2,
    followUpsToday: 5
  });

  const [recentPatients, setRecentPatients] = useState([
    { name: 'Peter Lukwago', afya_id: 'AFY-067-2024', lastSeen: '2 hours ago', diagnosis: 'Malaria' },
    { name: 'Sarah Ndosi', afya_id: 'AFY-089-2024', lastSeen: '1 day ago', diagnosis: 'UTI' },
    { name: 'David Kamau', afya_id: 'AFY-034-2024', lastSeen: '3 days ago', diagnosis: 'Hypertension' }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Good Morning, Dr. Mwangi
          </h1>
          <p className="text-[#6B7280]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Patient
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Appointments
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {highRiskAlerts.length > 0 && (
        <Card className="p-4 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-[#C84B31] flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-medium text-[#C84B31] mb-3">
                {highRiskAlerts.length} High-Risk Patient{highRiskAlerts.length !== 1 ? 's' : ''} Require Immediate Attention
              </h3>
              <div className="space-y-2">
                {highRiskAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={alert.priority === 'critical' ? 'bg-[#C84B31]' : 'bg-[#F4A261]'}>
                        {alert.priority === 'critical' ? 'CRITICAL' : 'URGENT'}
                      </Badge>
                      <div>
                        <div className="font-medium text-[#1E1E1E]">
                          {alert.patient.name} ({alert.patient.age}yo)
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {alert.alert} • {alert.patient.afya_id} • {alert.time}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#C84B31] hover:bg-[#A03B24]">
                      See Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Patients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-[#0F3D56]" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {todayStats.totalPatients}
          </div>
          <div className="text-sm text-[#6B7280]">
            Patients Today
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {todayStats.completed}
          </div>
          <div className="text-sm text-[#6B7280]">
            Completed
          </div>
        </Card>

        {/* In Progress */}
        <Card className="p-6 bg-[#EFF6FF] border-[#0F3D56]/20">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {todayStats.inProgress}
          </div>
          <div className="text-sm text-[#6B7280]">
            In Progress
          </div>
        </Card>

        {/* Waiting */}
        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#F4A261]" />
          </div>
          <div className="text-3xl font-bold text-[#F4A261] mb-1">
            {todayStats.waiting}
          </div>
          <div className="text-sm text-[#6B7280]">
            Waiting
          </div>
        </Card>

        {/* Avg Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#2A9D8F]" />
          </div>
          <div className="text-3xl font-bold text-[#2A9D8F] mb-1">
            {todayStats.avgConsultationTime}m
          </div>
          <div className="text-sm text-[#6B7280]">
            Avg. Time
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Queue */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                My Queue ({myQueue.length} patients)
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {myQueue.map((entry) => (
                <div
                  key={entry.queueNumber}
                  className="p-4 border rounded-lg hover:border-[#0F3D56] hover:bg-[#EFF6FF] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-[#0F3D56]">
                        {entry.queueNumber.toString().padStart(2, '0')}
                      </div>
                      <div>
                        <div className="font-medium text-[#1E1E1E]">
                          {entry.patient.name} ({entry.patient.age}{entry.patient.gender})
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {entry.patient.afya_id}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      entry.triagePriority === 1 ? 'bg-[#C84B31]' :
                      entry.triagePriority === 2 ? 'bg-[#F4A261]' :
                      'bg-[#E9C46A] text-black'
                    }>
                      P{entry.triagePriority}
                    </Badge>
                  </div>

                  {/* Chief Complaint */}
                  <div className="mb-3 p-3 bg-[#F9FAFB] rounded">
                    <div className="text-sm font-medium text-[#1E1E1E] mb-1">
                      Chief Complaint:
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {entry.chiefComplaint}
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-[#6B7280]">BP:</span>{' '}
                        <span className="font-medium">{entry.vitals.bp}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Temp:</span>{' '}
                        <span className={entry.vitals.temp > 37.5 ? 'font-medium text-[#C84B31]' : 'font-medium'}>
                          {entry.vitals.temp}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">HR:</span>{' '}
                        <span className="font-medium">{entry.vitals.hr}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Start
                      </Button>
                    </div>
                  </div>

                  {/* Wait Time */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280]">
                    <Clock className="h-3 w-3" />
                    Waiting {entry.waitTime} minutes
                  </div>
                </div>
              ))}

              {myQueue.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-[#6B7280]" />
                  <p className="text-[#6B7280]">No patients in queue</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Patients */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Recent Patients
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-2">
              {recentPatients.map((patient, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-[#F9FAFB] cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[#1E1E1E]">
                      {patient.name}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {patient.afya_id} • {patient.diagnosis} • {patient.lastSeen}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Tasks & Actions */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Pending Tasks
            </h2>

            <div className="space-y-3">
              {pendingTasks.unsignedNotes > 0 && (
                <div className="p-3 bg-[#FEF3E7] rounded-lg border border-[#F4A261]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#F4A261]" />
                      <span className="font-medium text-[#F4A261]">
                        Unsigned Notes
                      </span>
                    </div>
                    <Badge className="bg-[#F4A261]">
                      {pendingTasks.unsignedNotes}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Review & Sign
                  </Button>
                </div>
              )}

              {pendingTasks.pendingOrders > 0 && (
                <div className="p-3 bg-[#F0F9FF] rounded-lg border border-[#0F3D56]/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[#0F3D56]" />
                      <span className="font-medium text-[#0F3D56]">
                        Pending Orders
                      </span>
                    </div>
                    <Badge className="bg-[#0F3D56]">
                      {pendingTasks.pendingOrders}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Review Orders
                  </Button>
                </div>
              )}

              {pendingTasks.followUpsToday > 0 && (
                <div className="p-3 bg-[#F0FDF4] rounded-lg border border-[#2A9D8F]/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#2A9D8F]" />
                      <span className="font-medium text-[#2A9D8F]">
                        Follow-ups Today
                      </span>
                    </div>
                    <Badge className="bg-[#2A9D8F]">
                      {pendingTasks.followUpsToday}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Schedule
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Quick Actions
            </h2>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText className="h-5 w-5" />
                New Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Pill className="h-5 w-5" />
                New Prescription
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <TestTube className="h-5 w-5" />
                Order Labs
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <ArrowRight className="h-5 w-5" />
                Refer Patient
              </Button>
            </div>
          </Card>

          {/* Clinical Performance */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              This Month
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6B7280]">Total Patients</span>
                  <span className="font-medium text-[#1E1E1E]">234</span>
                </div>
                <div className="w-full bg-[#F9FAFB] rounded-full h-2">
                  <div className="bg-[#0F3D56] h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6B7280]">Documentation Rate</span>
                  <span className="font-medium text-green-600">98%</span>
                </div>
                <div className="w-full bg-[#F9FAFB] rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6B7280]">Patient Satisfaction</span>
                  <span className="font-medium text-[#2A9D8F]">4.8/5</span>
                </div>
                <div className="w-full bg-[#F9FAFB] rounded-full h-2">
                  <div className="bg-[#2A9D8F] h-2 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
