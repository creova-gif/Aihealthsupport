/**
 * NURSE DASHBOARD
 * 
 * Focused on patient preparation & triage
 * 
 * Features:
 * - My assigned queue
 * - Quick vitals entry
 * - Triage workflow
 * - Patient handoff to doctor
 * - Vital signs alerts
 * - Nursing tasks checklist
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  Heart,
  Thermometer,
  CheckCircle,
  ArrowRight,
  Plus,
  Wind,
  Droplet,
  Stethoscope,
  Calendar
} from 'lucide-react';

interface NurseDashboardProps {
  userId: string;
  facilityId: string;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({
  userId,
  facilityId
}) => {
  const { t } = useTranslation(['clinical', 'common']);
  
  const [todayStats, setTodayStats] = useState({
    totalPatients: 18,
    vitalsRecorded: 15,
    triaged: 15,
    readyForDoctor: 3
  });

  const [myQueue, setMyQueue] = useState([
    {
      queueNumber: 5,
      patient: { name: 'Mary Juma', afya_id: 'AFY-056-2024', age: 42, gender: 'F' },
      chiefComplaint: 'Chest pain',
      vitalsRecorded: false,
      triaged: false,
      priority: null
    },
    {
      queueNumber: 6,
      patient: { name: 'Joseph Kisanga', afya_id: 'AFY-078-2024', age: 28, gender: 'M' },
      chiefComplaint: 'Cough for 2 weeks',
      vitalsRecorded: false,
      triaged: false,
      priority: null
    }
  ]);

  const [readyForDoctor, setReadyForDoctor] = useState([
    {
      queueNumber: 2,
      patient: { name: 'Grace Mwakasege', afya_id: 'AFY-045-2024', age: 28 },
      chiefComplaint: 'High BP, pregnant',
      priority: 2,
      vitals: { bp: '160/105', temp: 37.2, hr: 95, spo2: 98 },
      triageTime: '5 min ago'
    },
    {
      queueNumber: 3,
      patient: { name: 'John Mwangi', afya_id: 'AFY-012-2024', age: 45 },
      chiefComplaint: 'Fever for 3 days',
      priority: 3,
      vitals: { bp: '130/85', temp: 38.5, hr: 88, spo2: 97 },
      triageTime: '12 min ago'
    }
  ]);

  const [abnormalVitals, setAbnormalVitals] = useState([
    { patient: 'Grace Mwakasege', parameter: 'BP', value: '160/105', severity: 'high' },
    { patient: 'John Mwangi', parameter: 'Temperature', value: '38.5°C', severity: 'moderate' }
  ]);

  const [nursingTasks, setNursingTasks] = useState([
    { task: 'Wound dressing - Room 3', completed: false, priority: 'urgent' },
    { task: 'IV line check - Room 1', completed: false, priority: 'routine' },
    { task: 'Medication administration - 2pm', completed: true, priority: 'routine' }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Good Morning, Nurse Sarah
          </h1>
          <p className="text-[#6B7280]">
            OPD Department • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Record Vitals
          </Button>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Patients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {todayStats.totalPatients}
          </div>
          <div className="text-sm text-[#6B7280]">
            Total Patients
          </div>
        </Card>

        {/* Vitals Recorded */}
        <Card className="p-6 bg-[#EFF6FF] border-[#0F3D56]/20">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {todayStats.vitalsRecorded}
          </div>
          <div className="text-sm text-[#6B7280]">
            Vitals Recorded
          </div>
        </Card>

        {/* Triaged */}
        <Card className="p-6 bg-[#F0FDF4] border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {todayStats.triaged}
          </div>
          <div className="text-sm text-[#6B7280]">
            Triaged
          </div>
        </Card>

        {/* Ready for Doctor */}
        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]/20">
          <div className="flex items-center justify-between mb-2">
            <Stethoscope className="h-5 w-5 text-[#F4A261]" />
          </div>
          <div className="text-3xl font-bold text-[#F4A261] mb-1">
            {todayStats.readyForDoctor}
          </div>
          <div className="text-sm text-[#6B7280]">
            Ready for Doctor
          </div>
        </Card>
      </div>

      {/* Abnormal Vitals Alert */}
      {abnormalVitals.length > 0 && (
        <Card className="p-4 bg-[#FEF3E7] border-[#F4A261]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#F4A261] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-[#F4A261] mb-2">
                {abnormalVitals.length} Patient{abnormalVitals.length !== 1 ? 's' : ''} with Abnormal Vitals
              </h3>
              <div className="space-y-2">
                {abnormalVitals.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex items-center gap-3">
                      <Badge className={alert.severity === 'high' ? 'bg-[#C84B31]' : 'bg-[#F4A261]'}>
                        {alert.parameter}
                      </Badge>
                      <div className="text-sm">
                        <span className="font-medium">{alert.patient}</span> - {alert.value}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: My Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Queue - Awaiting Vitals */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                My Queue - Awaiting Vitals ({myQueue.length})
              </h2>
            </div>

            <div className="space-y-3">
              {myQueue.map((entry) => (
                <div
                  key={entry.queueNumber}
                  className="p-4 border-2 border-[#0F3D56] rounded-lg bg-[#EFF6FF]"
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
                  </div>

                  {/* Chief Complaint */}
                  <div className="mb-3 p-3 bg-white rounded">
                    <div className="text-sm font-medium text-[#1E1E1E] mb-1">
                      Chief Complaint:
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {entry.chiefComplaint}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <Activity className="h-4 w-4" />
                      Record Vitals
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Triage
                    </Button>
                  </div>
                </div>
              ))}

              {myQueue.length === 0 && (
                <div className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p className="text-[#6B7280]">All patients have been processed!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Ready for Doctor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Ready for Doctor ({readyForDoctor.length})
              </h2>
            </div>

            <div className="space-y-3">
              {readyForDoctor.map((entry) => (
                <div
                  key={entry.queueNumber}
                  className="p-4 border rounded-lg bg-green-50 border-green-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-green-600">
                        {entry.queueNumber.toString().padStart(2, '0')}
                      </div>
                      <div>
                        <div className="font-medium text-[#1E1E1E]">
                          {entry.patient.name} ({entry.patient.age}yo)
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {entry.patient.afya_id}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      entry.priority === 1 ? 'bg-[#C84B31]' :
                      entry.priority === 2 ? 'bg-[#F4A261]' :
                      'bg-[#E9C46A] text-black'
                    }>
                      P{entry.priority}
                    </Badge>
                  </div>

                  {/* Chief Complaint */}
                  <div className="mb-3 p-3 bg-white rounded border">
                    <div className="text-sm font-medium text-[#1E1E1E] mb-1">
                      {entry.chiefComplaint}
                    </div>
                  </div>

                  {/* Vitals Summary */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="p-2 bg-white rounded border text-center">
                      <div className="text-xs text-[#6B7280]">BP</div>
                      <div className="text-sm font-medium">{entry.vitals.bp}</div>
                    </div>
                    <div className="p-2 bg-white rounded border text-center">
                      <div className="text-xs text-[#6B7280]">Temp</div>
                      <div className="text-sm font-medium">{entry.vitals.temp}°C</div>
                    </div>
                    <div className="p-2 bg-white rounded border text-center">
                      <div className="text-xs text-[#6B7280]">HR</div>
                      <div className="text-sm font-medium">{entry.vitals.hr}</div>
                    </div>
                    <div className="p-2 bg-white rounded border text-center">
                      <div className="text-xs text-[#6B7280]">SpO2</div>
                      <div className="text-sm font-medium">{entry.vitals.spo2}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#6B7280]">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Triaged {entry.triageTime}
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Handoff
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Tasks & Quick Vitals */}
        <div className="space-y-6">
          {/* Quick Vitals Entry */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Quick Vitals Entry
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                <Heart className="h-5 w-5 text-[#C84B31]" />
                <span className="text-sm font-medium">Blood Pressure</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                <Thermometer className="h-5 w-5 text-[#F4A261]" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                <Activity className="h-5 w-5 text-[#C84B31]" />
                <span className="text-sm font-medium">Heart Rate</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                <Wind className="h-5 w-5 text-[#2A9D8F]" />
                <span className="text-sm font-medium">Respiratory Rate</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                <Droplet className="h-5 w-5 text-[#0F3D56]" />
                <span className="text-sm font-medium">SpO2</span>
              </div>
            </div>

            <Button className="w-full mt-4 gap-2">
              <Activity className="h-4 w-4" />
              Full Vitals Form
            </Button>
          </Card>

          {/* Nursing Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#1E1E1E]">
                My Tasks
              </h2>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {nursingTasks.map((task, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    task.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        const updated = [...nursingTasks];
                        updated[index].completed = !updated[index].completed;
                        setNursingTasks(updated);
                      }}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${task.completed ? 'line-through text-[#6B7280]' : 'text-[#1E1E1E]'}`}>
                        {task.task}
                      </div>
                      {task.priority === 'urgent' && !task.completed && (
                        <Badge className="bg-[#C84B31] text-xs mt-1">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shift Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Today's Summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Patients Seen</span>
                <span className="font-medium text-[#1E1E1E]">{todayStats.totalPatients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Vitals Recorded</span>
                <span className="font-medium text-[#1E1E1E]">{todayStats.vitalsRecorded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Completion Rate</span>
                <span className="font-medium text-green-600">
                  {Math.round((todayStats.vitalsRecorded / todayStats.totalPatients) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
