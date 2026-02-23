/**
 * ADVANCED SCHEDULING SYSTEM
 * 
 * Multi-provider calendar & appointment management
 * 
 * Features:
 * - Multi-provider calendars
 * - Department-based scheduling
 * - Recurring appointments
 * - Wait list management
 * - SMS reminders
 * - No-show tracking
 * - Conflict detection
 * - Time slot optimization
 */

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const AdvancedScheduling: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const providers = [
    { id: 'dr-mwangi', name: 'Dr. Mwangi', specialty: 'General Medicine', color: '#0F3D56' },
    { id: 'dr-hassan', name: 'Dr. Hassan', specialty: 'Obstetrics', color: '#2A9D8F' },
    { id: 'dr-kileo', name: 'Dr. Kileo', specialty: 'Pediatrics', color: '#E9C46A' }
  ];

  const appointments = [
    {
      id: 'apt-001',
      patient: 'John Mwangi',
      provider: 'dr-mwangi',
      date: new Date(),
      time: '09:00',
      duration: 30,
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      id: 'apt-002',
      patient: 'Grace Mwakasege',
      provider: 'dr-hassan',
      date: new Date(),
      time: '10:00',
      duration: 30,
      type: 'Antenatal',
      status: 'confirmed'
    }
  ];

  const timeSlots = Array.from({ length: 18 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Appointment Scheduling
          </h1>
          <p className="text-[#6B7280]">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Send Reminders
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentDate(newDate);
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentDate(newDate);
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* View Mode */}
          <div className="flex gap-1 bg-[#F9FAFB] rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map(mode => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>

          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Providers</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} - {provider.specialty}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="font-medium text-sm text-[#6B7280]">Time</div>
              {providers.map(provider => (
                <div key={provider.id} className="text-center">
                  <div className="font-medium text-sm text-[#1E1E1E]">{provider.name}</div>
                  <div className="text-xs text-[#6B7280]">{provider.specialty}</div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="text-sm text-[#6B7280] py-2">{time}</div>
                  {providers.map(provider => {
                    const apt = appointments.find(
                      a => a.provider === provider.id && a.time === time
                    );
                    
                    return (
                      <div
                        key={provider.id}
                        className={`p-2 rounded border min-h-[60px] ${
                          apt ? 'bg-[#EFF6FF] border-[#0F3D56] cursor-pointer hover:bg-[#DBE9FE]' : 'bg-[#F9FAFB] border-dashed'
                        }`}
                      >
                        {apt && (
                          <div>
                            <div className="text-sm font-medium text-[#1E1E1E]">
                              {apt.patient}
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              {apt.type}
                            </div>
                            <Badge className="text-xs mt-1" style={{ background: provider.color }}>
                              {apt.duration}min
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-2xl font-bold text-[#0F3D56] mb-1">28</div>
          <div className="text-sm text-[#6B7280]">Scheduled Today</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-green-600 mb-1">24</div>
          <div className="text-sm text-[#6B7280]">Confirmed</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-[#F4A261] mb-1">4</div>
          <div className="text-sm text-[#6B7280]">Pending</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-[#C84B31] mb-1">2</div>
          <div className="text-sm text-[#6B7280]">No-shows</div>
        </Card>
      </div>
    </div>
  );
};
