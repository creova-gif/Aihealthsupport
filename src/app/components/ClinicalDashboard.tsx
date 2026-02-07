/**
 * ClinicalDashboard - Unified Clinical Dashboard for Doctors/Nurses
 * Today's patients, priority cases, pending follow-ups
 * AI-assisted triage, digital intake, efficient workflow
 * One screen. Zero chaos.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Filter,
  ChevronRight,
  User,
  Calendar,
  Stethoscope,
  TrendingUp,
  MessageCircle,
  Bell,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';

interface ClinicalDashboardProps {
  language: 'sw' | 'en';
  onLogout: () => void;
  providerName: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  chiefComplaint: { sw: string; en: string };
  arrivalTime: string;
  priority: 'routine' | 'urgent' | 'emergency';
  aiRiskScore?: number;
  vitalSigns?: {
    temp: number;
    bp: string;
    pulse: number;
  };
  preVisitIntake?: boolean;
  waitTime: number;
  queuePosition: number;
}

interface Task {
  id: string;
  type: 'follow-up' | 'lab-result' | 'referral' | 'prescription';
  patientName: string;
  description: { sw: string; en: string };
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export function ClinicalDashboard({
  language,
  onLogout,
  providerName,
}: ClinicalDashboardProps) {
  const [view, setView] = useState<'patients' | 'tasks' | 'analytics'>('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'routine' | 'urgent' | 'emergency'>('all');

  const content = {
    sw: {
      title: 'Dashibodi ya Kliniki',
      greeting: 'Habari',
      tabs: {
        patients: 'Wagonjwa',
        tasks: 'Kazi',
        analytics: 'Takwimu',
      },
      todayPatients: 'Wagonjwa wa Leo',
      waitingRoom: 'Wanaosubiri',
      completed: 'Waliokamilika',
      upcoming: 'Wanaokuja',
      search: 'Tafuta mgonjwa...',
      filter: 'Chuja',
      priority: {
        all: 'Wote',
        routine: 'Kawaida',
        urgent: 'Dharura Kidogo',
        emergency: 'Dharura',
      },
      viewDetails: 'Angalia Maelezo',
      startConsult: 'Anza Ushauri',
      aiRisk: 'Hatari ya AI',
      preIntake: 'Maelezo ya Awali Yamejazwa',
      waitTime: 'Muda wa Kusubiri',
      minutes: 'dakika',
      queuePos: 'Nafasi',
      vitalSigns: 'Alama Muhimu',
      temp: 'Joto',
      bp: 'Shinikizo',
      pulse: 'Mapigo ya Moyo',
      stats: {
        total: 'Jumla',
        seen: 'Walioangaliwa',
        waiting: 'Wanaosubiri',
        avgWait: 'Wastani wa Kusubiri',
      },
      tasks: {
        pending: 'Zinazosubiri',
        overdue: 'Zimechelewa',
        completed: 'Zimekamilika',
      },
      highPriority: 'Kipaumbele cha Juu',
      mediumPriority: 'Kipaumbele cha Kati',
      lowPriority: 'Kipaumbele cha Chini',
      logout: 'Toka',
    },
    en: {
      title: 'Clinical Dashboard',
      greeting: 'Hello',
      tabs: {
        patients: 'Patients',
        tasks: 'Tasks',
        analytics: 'Analytics',
      },
      todayPatients: 'Today\'s Patients',
      waitingRoom: 'Waiting Room',
      completed: 'Completed',
      upcoming: 'Upcoming',
      search: 'Search patient...',
      filter: 'Filter',
      priority: {
        all: 'All',
        routine: 'Routine',
        urgent: 'Urgent',
        emergency: 'Emergency',
      },
      viewDetails: 'View Details',
      startConsult: 'Start Consult',
      aiRisk: 'AI Risk',
      preIntake: 'Pre-visit Intake Completed',
      waitTime: 'Wait Time',
      minutes: 'minutes',
      queuePos: 'Position',
      vitalSigns: 'Vital Signs',
      temp: 'Temp',
      bp: 'BP',
      pulse: 'Pulse',
      stats: {
        total: 'Total',
        seen: 'Seen',
        waiting: 'Waiting',
        avgWait: 'Avg Wait',
      },
      tasks: {
        pending: 'Pending',
        overdue: 'Overdue',
        completed: 'Completed',
      },
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      logout: 'Log Out',
    },
  };

  const t = content[language];

  // Mock patients
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Amina Hassan',
      age: 32,
      gender: 'F',
      chiefComplaint: { sw: 'Homa na maumivu ya kichwa', en: 'Fever and headache' },
      arrivalTime: '08:30',
      priority: 'urgent',
      aiRiskScore: 75,
      vitalSigns: {
        temp: 38.5,
        bp: '130/85',
        pulse: 92,
      },
      preVisitIntake: true,
      waitTime: 45,
      queuePosition: 1,
    },
    {
      id: '2',
      name: 'John Mwangi',
      age: 58,
      gender: 'M',
      chiefComplaint: { sw: 'Maumivu ya kifua', en: 'Chest pain' },
      arrivalTime: '08:45',
      priority: 'emergency',
      aiRiskScore: 92,
      vitalSigns: {
        temp: 37.2,
        bp: '150/95',
        pulse: 105,
      },
      preVisitIntake: true,
      waitTime: 30,
      queuePosition: 2,
    },
    {
      id: '3',
      name: 'Grace Kimani',
      age: 28,
      gender: 'F',
      chiefComplaint: { sw: 'Uchunguzi wa mimba', en: 'Pregnancy checkup' },
      arrivalTime: '09:00',
      priority: 'routine',
      aiRiskScore: 25,
      preVisitIntake: true,
      waitTime: 60,
      queuePosition: 3,
    },
    {
      id: '4',
      name: 'David Ng\'ang\'a',
      age: 45,
      gender: 'M',
      chiefComplaint: { sw: 'Kifua kikuu', en: 'Cough for 2 weeks' },
      arrivalTime: '09:15',
      priority: 'urgent',
      aiRiskScore: 68,
      vitalSigns: {
        temp: 37.8,
        bp: '125/80',
        pulse: 88,
      },
      preVisitIntake: false,
      waitTime: 75,
      queuePosition: 4,
    },
    {
      id: '5',
      name: 'Fatuma Ali',
      age: 65,
      gender: 'F',
      chiefComplaint: { sw: 'Ufuatiliaji wa kisukari', en: 'Diabetes follow-up' },
      arrivalTime: '09:30',
      priority: 'routine',
      aiRiskScore: 45,
      preVisitIntake: true,
      waitTime: 90,
      queuePosition: 5,
    },
  ];

  // Mock tasks
  const mockTasks: Task[] = [
    {
      id: '1',
      type: 'lab-result',
      patientName: 'Sarah Juma',
      description: {
        sw: 'Angalia matokeo ya vipimo vya damu',
        en: 'Review blood test results',
      },
      dueDate: new Date(),
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      type: 'follow-up',
      patientName: 'Peter Kamau',
      description: {
        sw: 'Piga simu kwa ufuatiliaji wa matibabu',
        en: 'Call for treatment follow-up',
      },
      dueDate: new Date(),
      priority: 'medium',
      completed: false,
    },
    {
      id: '3',
      type: 'prescription',
      patientName: 'Mary Wanjiku',
      description: {
        sw: 'Thibitisha dawa mpya',
        en: 'Approve prescription renewal',
      },
      dueDate: new Date(Date.now() - 86400000),
      priority: 'high',
      completed: false,
    },
  ];

  const filteredPatients =
    filterPriority === 'all'
      ? mockPatients
      : mockPatients.filter((p) => p.priority === filterPriority);

  const waitingPatients = filteredPatients.filter((p) => p.queuePosition > 0);
  const completedToday = 12;
  const avgWaitTime = 42;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
      case 'urgent':
        return { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' };
      case 'routine':
        return { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return { bg: '#FEF2F2', text: '#DC2626' };
    if (score >= 60) return { bg: '#FFFBEB', text: '#F59E0B' };
    return { bg: '#ECFDF5', text: '#10B981' };
  };

  // Patients View
  if (view === 'patients') {
    return (
      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">
                  {t.greeting}, {providerName}
                </p>
                <h1 className="text-3xl font-bold">{t.title}</h1>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4">
              {(['patients', 'tasks', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === tab
                      ? 'bg-[#1E88E5] text-white'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {t.tabs[tab]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#1E88E5]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">
                    {mockPatients.length}
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">{completedToday}</p>
                  <p className="text-sm text-[#6B7280]">{t.stats.seen}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#F59E0B]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">
                    {waitingPatients.length}
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.stats.waiting}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-[#8B5CF6]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">
                    {avgWaitTime}
                    <span className="text-sm font-normal text-[#6B7280] ml-1">
                      {t.minutes}
                    </span>
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.stats.avgWait}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-[#1A1D23] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'routine', 'urgent', 'emergency'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterPriority(filter)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    filterPriority === filter
                      ? 'bg-[#1E88E5] text-white'
                      : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {t.priority[filter]}
                </button>
              ))}
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
            {waitingPatients.map((patient, index) => {
              const priorityColors = getPriorityColor(patient.priority);
              const riskColors = patient.aiRiskScore
                ? getRiskColor(patient.aiRiskScore)
                : null;

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    {/* Patient Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-[#1E88E5]" />
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#1A1D23] mb-1">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-[#6B7280]">
                            {patient.age}{' '}
                            {language === 'sw'
                              ? patient.gender === 'M'
                                ? 'Mwanaume'
                                : 'Mwanamke'
                              : patient.gender === 'M'
                              ? 'Male'
                              : 'Female'}{' '}
                            • {language === 'sw' ? 'Aliwasili' : 'Arrived'}{' '}
                            {patient.arrivalTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="px-3 py-1.5 rounded-full"
                            style={{
                              backgroundColor: priorityColors.bg,
                              borderColor: priorityColors.border,
                              borderWidth: '1px',
                            }}
                          >
                            <span
                              className="text-xs font-semibold"
                              style={{ color: priorityColors.text }}
                            >
                              {t.priority[patient.priority]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chief Complaint */}
                      <div className="mb-4 p-3 bg-[#FAFBFC] rounded-lg">
                        <p className="text-base text-[#1A1D23] font-medium">
                          {patient.chiefComplaint[language]}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {/* Queue Position */}
                        <div className="text-center p-3 bg-[#FAFBFC] rounded-lg">
                          <p className="text-2xl font-bold text-[#1A1D23]">
                            #{patient.queuePosition}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">{t.queuePos}</p>
                        </div>

                        {/* Wait Time */}
                        <div className="text-center p-3 bg-[#FAFBFC] rounded-lg">
                          <p className="text-2xl font-bold text-[#1A1D23]">
                            {patient.waitTime}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">{t.minutes}</p>
                        </div>

                        {/* AI Risk Score */}
                        {riskColors && patient.aiRiskScore && (
                          <div
                            className="text-center p-3 rounded-lg"
                            style={{
                              backgroundColor: riskColors.bg,
                            }}
                          >
                            <p
                              className="text-2xl font-bold"
                              style={{ color: riskColors.text }}
                            >
                              {patient.aiRiskScore}
                            </p>
                            <p
                              className="text-xs font-medium mt-1"
                              style={{ color: riskColors.text }}
                            >
                              {t.aiRisk}
                            </p>
                          </div>
                        )}

                        {/* Pre-Intake Status */}
                        {patient.preVisitIntake && (
                          <div className="text-center p-3 bg-[#ECFDF5] rounded-lg">
                            <CheckCircle className="w-6 h-6 text-[#10B981] mx-auto mb-1" />
                            <p className="text-xs text-[#10B981] font-medium">
                              {language === 'sw' ? 'Awali' : 'Pre-Intake'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Vital Signs */}
                      {patient.vitalSigns && (
                        <div className="flex gap-4 mb-4 p-3 bg-[#EFF6FF] rounded-lg">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1E88E5]" />
                            <span className="text-sm text-[#1A1D23]">
                              {t.temp}: {patient.vitalSigns.temp}°C
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1E88E5]" />
                            <span className="text-sm text-[#1A1D23]">
                              {t.bp}: {patient.vitalSigns.bp}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1E88E5]" />
                            <span className="text-sm text-[#1A1D23]">
                              {t.pulse}: {patient.vitalSigns.pulse} bpm
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
                          onClick={() =>
                            alert(`Starting consultation with ${patient.name}`)
                          }
                        >
                          <Stethoscope className="w-5 h-5 mr-2" />
                          {t.startConsult}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <FileText className="w-5 h-5 mr-2" />
                          {t.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Tasks View
  if (view === 'tasks') {
    const pendingTasks = mockTasks.filter((t) => !t.completed);
    const overdueTasks = mockTasks.filter(
      (t) => !t.completed && t.dueDate < new Date()
    );

    return (
      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">
                  {t.greeting}, {providerName}
                </p>
                <h1 className="text-3xl font-bold">{t.title}</h1>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4">
              {(['patients', 'tasks', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === tab
                      ? 'bg-[#1E88E5] text-white'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {t.tabs[tab]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#F59E0B]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">
                    {pendingTasks.length}
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.tasks.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-[#EF4444]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">
                    {overdueTasks.length}
                  </p>
                  <p className="text-sm text-[#6B7280]">{t.tasks.overdue}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1D23]">24</p>
                  <p className="text-sm text-[#6B7280]">{t.tasks.completed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {mockTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1A1D23] mb-1">
                      {task.patientName}
                    </h3>
                    <p className="text-[#6B7280] mb-3">{task.description[language]}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <span>{task.dueDate.toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          task.priority === 'high'
                            ? 'bg-[#FEF2F2] text-[#EF4444]'
                            : task.priority === 'medium'
                            ? 'bg-[#FFFBEB] text-[#F59E0B]'
                            : 'bg-[#ECFDF5] text-[#10B981]'
                        }`}
                      >
                        {task.priority === 'high'
                          ? t.highPriority
                          : task.priority === 'medium'
                          ? t.mediumPriority
                          : t.lowPriority}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">
                    {language === 'sw' ? 'Angalia' : 'View'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
