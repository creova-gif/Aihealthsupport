/**
 * PATIENT MOBILE APP
 * 
 * Self-service patient portal
 * 
 * Features:
 * - Appointment booking
 * - Lab results viewing
 * - Medication list
 * - Visit history
 * - Symptom checker (AI)
 * - Telemedicine (video consult)
 * - Payment via mobile money
 * - Health records access
 */

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Calendar,
  FileText,
  Pill,
  Video,
  CreditCard,
  User,
  Bell,
  MessageSquare,
  Activity,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

/**
 * PATIENT HOME SCREEN
 */
export const PatientMobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'results' | 'meds' | 'more'>('home');

  const patient = {
    name: 'John Mwangi',
    afya_id: 'AFY-012-2024',
    age: 38,
    gender: 'Male',
    phone: '+255712345678'
  };

  const upcomingAppointment = {
    date: 'March 5, 2026',
    time: '10:00 AM',
    doctor: 'Dr. Sarah Hassan',
    facility: 'Muhimbili National Hospital',
    type: 'Follow-up'
  };

  const recentResults = [
    { test: 'Complete Blood Count', date: 'Feb 20, 2026', status: 'available' },
    { test: 'Malaria RDT', date: 'Feb 15, 2026', status: 'available' }
  ];

  const medications = [
    { name: 'Metformin 500mg', dosage: 'Take 1 tablet twice daily', refills: 2 },
    { name: 'Amlodipine 5mg', dosage: 'Take 1 tablet once daily', refills: 1 }
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0F3D56] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm opacity-90">{patient.afya_id}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs">Visits</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs">Lab Results</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs">Medications</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'home' && (
          <>
            {/* Upcoming Appointment */}
            {upcomingAppointment && (
              <Card className="p-4 bg-[#EFF6FF] border-[#0F3D56]">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#0F3D56] mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0F3D56]">Next Appointment</h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      {upcomingAppointment.date} at {upcomingAppointment.time}
                    </p>
                    <p className="text-sm text-[#1E1E1E] mt-1">
                      {upcomingAppointment.doctor} • {upcomingAppointment.type}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {upcomingAppointment.facility}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Video className="h-6 w-6" />
                <span className="text-sm">Video Consult</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Symptom Checker</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Health Records</span>
              </Button>
            </div>

            {/* Recent Lab Results */}
            <div>
              <h3 className="font-medium text-[#1E1E1E] mb-3">Recent Lab Results</h3>
              <div className="space-y-2">
                {recentResults.map((result, idx) => (
                  <Card key={idx} className="p-3 hover:bg-[#F9FAFB] cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{result.test}</div>
                        <div className="text-xs text-[#6B7280]">{result.date}</div>
                      </div>
                      <Badge className="bg-green-600">View</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h3 className="font-medium text-[#1E1E1E] mb-3">Current Medications</h3>
              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="flex items-start gap-3">
                      <Pill className="h-5 w-5 text-[#0F3D56] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{med.name}</div>
                        <div className="text-xs text-[#6B7280]">{med.dosage}</div>
                        <div className="text-xs text-[#6B7280] mt-1">
                          {med.refills} refills remaining
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Refill
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <AppointmentBooking patient={patient} />
        )}

        {activeTab === 'results' && (
          <LabResultsViewer patientId={patient.afya_id} />
        )}

        {activeTab === 'meds' && (
          <MedicationList medications={medications} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {(['home', 'appointments', 'results', 'meds', 'more'] as const).map((tab) => {
            const icons = {
              home: Activity,
              appointments: Calendar,
              results: FileText,
              meds: Pill,
              more: User
            };
            const Icon = icons[tab];
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-4 flex flex-col items-center gap-1 ${
                  activeTab === tab ? 'text-[#0F3D56]' : 'text-[#6B7280]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs capitalize">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * APPOINTMENT BOOKING COMPONENT
 */
const AppointmentBooking: React.FC<{ patient: any }> = ({ patient }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  const doctors = [
    { id: 'dr-001', name: 'Dr. Sarah Hassan', specialty: 'General Medicine', available: true },
    { id: 'dr-002', name: 'Dr. John Mwangi', specialty: 'Pediatrics', available: true },
    { id: 'dr-003', name: 'Dr. Grace Kileo', specialty: 'Obstetrics', available: false }
  ];

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0F3D56]">Book Appointment</h2>

      {/* Select Doctor */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Doctor</label>
        <div className="space-y-2">
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              onClick={() => doctor.available && setSelectedDoctor(doctor.id)}
              disabled={!doctor.available}
              className={`w-full p-3 border-2 rounded-lg text-left ${
                selectedDoctor === doctor.id ? 'border-[#0F3D56] bg-[#EFF6FF]' : 'border-[#E5E7EB]'
              } ${!doctor.available && 'opacity-50'}`}
            >
              <div className="font-medium">{doctor.name}</div>
              <div className="text-sm text-[#6B7280]">{doctor.specialty}</div>
              {!doctor.available && <Badge className="mt-1 bg-[#6B7280]">Not Available</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Select Date (Calendar would go here) */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <input type="date" className="w-full px-3 py-2 border rounded-lg" />
      </div>

      {/* Select Time */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Time</label>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 border-2 rounded-lg text-sm ${
                selectedTime === time ? 'border-[#0F3D56] bg-[#EFF6FF]' : 'border-[#E5E7EB]'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium mb-2">Reason for Visit</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Describe your symptoms or reason for visit..."
        />
      </div>

      <Button className="w-full">Confirm Appointment</Button>
    </div>
  );
};

/**
 * LAB RESULTS VIEWER
 */
const LabResultsViewer: React.FC<{ patientId: string }> = ({ patientId }) => {
  const results = [
    {
      test: 'Complete Blood Count (CBC)',
      date: new Date('2026-02-20'),
      results: [
        { parameter: 'WBC', value: '7.2', unit: '×10³/μL', range: '4.5-11.0', status: 'normal' },
        { parameter: 'Hemoglobin', value: '13.5', unit: 'g/dL', range: '12.0-16.0', status: 'normal' },
        { parameter: 'Platelets', value: '250', unit: '×10³/μL', range: '150-400', status: 'normal' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0F3D56]">Lab Results</h2>

      {results.map((result, idx) => (
        <Card key={idx} className="p-4">
          <h3 className="font-medium text-[#1E1E1E] mb-2">{result.test}</h3>
          <p className="text-sm text-[#6B7280] mb-4">{result.date.toLocaleDateString()}</p>

          <div className="space-y-3">
            {result.results.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded">
                <div>
                  <div className="text-sm font-medium">{item.parameter}</div>
                  <div className="text-xs text-[#6B7280]">Normal: {item.range} {item.unit}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.value} {item.unit}</div>
                  <Badge className="bg-green-600 text-xs">Normal</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

/**
 * MEDICATION LIST
 */
const MedicationList: React.FC<{ medications: any[] }> = ({ medications }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0F3D56]">My Medications</h2>

      {medications.map((med, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium">{med.name}</h3>
              <p className="text-sm text-[#6B7280] mt-1">{med.dosage}</p>
            </div>
            <Badge>{med.refills} refills</Badge>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">Request Refill</Button>
            <Button size="sm" variant="outline">Instructions</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
