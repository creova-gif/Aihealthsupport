/**
 * RECEPTIONIST DASHBOARD
 * 
 * Front desk operations & patient flow
 * 
 * Features:
 * - Patient check-in
 * - Registration workflow
 * - Appointment management
 * - Queue overview
 * - Today's schedule
 * - Payment collection
 */

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import {
  Users,
  Clock,
  Calendar,
  Plus,
  Search,
  CheckCircle,
  UserPlus,
  CreditCard,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface ReceptionistDashboardProps {
  facilityId: string;
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({ facilityId }) => {
  const [stats, setStats] = useState({
    checkedIn: 45,
    scheduled: 28,
    walkIn: 17,
    waiting: 12
  });

  const [todayAppointments, setTodayAppointments] = useState([
    {
      time: '09:00 AM',
      patient: { name: 'Emmanuel Kileo', afya_id: 'AFY-001-2024', phone: '+255712345678' },
      type: 'Follow-up',
      doctor: 'Dr. Mwangi',
      status: 'checked-in'
    },
    {
      time: '09:30 AM',
      patient: { name: 'Grace Mwakasege', afya_id: 'AFY-045-2024', phone: '+255754123456' },
      type: 'Antenatal',
      doctor: 'Dr. Hassan',
      status: 'scheduled'
    },
    {
      time: '10:00 AM',
      patient: { name: 'John Mwangi', afya_id: 'AFY-012-2024', phone: '+255789456123' },
      type: 'New Visit',
      doctor: 'Dr. Mwangi',
      status: 'scheduled'
    },
    {
      time: '10:30 AM',
      patient: { name: 'Amina Hassan', afya_id: 'AFY-024-2024', phone: '+255767234567' },
      type: 'Follow-up',
      doctor: 'Dr. Hassan',
      status: 'scheduled'
    }
  ]);

  const [recentCheckIns, setRecentCheckIns] = useState([
    { patient: 'Peter Lukwago', time: '5 min ago', department: 'OPD' },
    { patient: 'Sarah Ndosi', time: '12 min ago', department: 'Antenatal' },
    { patient: 'David Kamau', time: '20 min ago', department: 'OPD' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Front Desk Dashboard
          </h1>
          <p className="text-[#6B7280]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register Patient
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {stats.checkedIn}
          </div>
          <div className="text-sm text-[#6B7280]">Checked In Today</div>
        </Card>

        <Card className="p-6 bg-[#EFF6FF] border-[#0F3D56]/20">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {stats.scheduled}
          </div>
          <div className="text-sm text-[#6B7280]">Scheduled</div>
        </Card>

        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]/20">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-[#F4A261]" />
          </div>
          <div className="text-3xl font-bold text-[#F4A261] mb-1">
            {stats.walkIn}
          </div>
          <div className="text-sm text-[#6B7280]">Walk-ins</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#6B7280]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {stats.waiting}
          </div>
          <div className="text-sm text-[#6B7280]">Currently Waiting</div>
        </Card>
      </div>

      {/* Quick Search */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
          Quick Patient Search
        </h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
            <Input
              placeholder="Search by name, AfyaID, phone number..."
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button size="lg" className="gap-2">
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Appointments */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Today's Appointments ({todayAppointments.length})
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {todayAppointments.map((apt, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    apt.status === 'checked-in' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-[#0F3D56]">
                        {apt.time}
                      </div>
                      <div>
                        <div className="font-medium text-[#1E1E1E]">
                          {apt.patient.name}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {apt.patient.afya_id}
                        </div>
                      </div>
                    </div>
                    {apt.status === 'checked-in' ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Checked In
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Scheduled
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {apt.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {apt.doctor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {apt.patient.phone}
                    </div>
                  </div>

                  {apt.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Check In
                      </Button>
                      <Button size="sm" variant="outline">
                        Call Patient
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  )}

                  {apt.status === 'checked-in' && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Patient is in waiting area
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Check-ins */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-4">
              Recent Check-ins
            </h2>
            <div className="space-y-2">
              {recentCheckIns.map((checkin, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                  <div>
                    <div className="font-medium text-[#1E1E1E]">
                      {checkin.patient}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {checkin.department}
                    </div>
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {checkin.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <UserPlus className="h-5 w-5" />
                New Patient Registration
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <CheckCircle className="h-5 w-5" />
                Walk-in Check-in
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="h-5 w-5" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Search className="h-5 w-5" />
                Find Patient Record
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <CreditCard className="h-5 w-5" />
                Process Payment
              </Button>
            </div>
          </Card>

          {/* Department Queue Status */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Department Queue Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <div className="font-medium text-[#1E1E1E]">OPD</div>
                  <div className="text-sm text-[#6B7280]">General Outpatient</div>
                </div>
                <Badge className="bg-[#E9C46A] text-black">8 waiting</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <div className="font-medium text-[#1E1E1E]">Emergency</div>
                  <div className="text-sm text-[#6B7280]">Urgent cases</div>
                </div>
                <Badge className="bg-[#C84B31]">2 waiting</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <div className="font-medium text-[#1E1E1E]">Antenatal</div>
                  <div className="text-sm text-[#6B7280]">Pregnancy care</div>
                </div>
                <Badge className="bg-[#2A9D8F]">4 waiting</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <div className="font-medium text-[#1E1E1E]">Pharmacy</div>
                  <div className="text-sm text-[#6B7280]">Medication pickup</div>
                </div>
                <Badge className="bg-[#0F3D56]">5 waiting</Badge>
              </div>
            </div>
          </Card>

          {/* Today's Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Today's Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Total Registrations</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Appointments Kept</span>
                <span className="font-medium">24/28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">No-Shows</span>
                <span className="font-medium text-[#C84B31]">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Avg. Wait Time</span>
                <span className="font-medium">18 min</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
