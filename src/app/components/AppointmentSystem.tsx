/**
 * AppointmentSystem - Book, Reschedule, Cancel with Queue Transparency
 * Live queue status, estimated wait times, facility load visibility
 * Reduces frustration and no-shows
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  X,
  ChevronRight,
  Users,
  Activity,
  Phone,
} from 'lucide-react';
import { Button } from './ui/button';

interface AppointmentSystemProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: { sw: string; en: string };
  provider: { sw: string; en: string };
  facility: { sw: string; en: string };
  status: 'upcoming' | 'completed' | 'cancelled';
  queuePosition?: number;
  estimatedWait?: number;
  facilityLoad?: 'low' | 'medium' | 'high';
}

interface Facility {
  id: string;
  name: { sw: string; en: string };
  address: { sw: string; en: string };
  currentLoad: 'low' | 'medium' | 'high';
  waitTime: number;
  availableSlots: number;
  distance?: string;
}

export function AppointmentSystem({ language, onBack }: AppointmentSystemProps) {
  const [view, setView] = useState<'list' | 'book' | 'details'>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const content = {
    sw: {
      title: 'Miadi Yangu',
      subtitle: 'Panga na simamia miadi yako',
      tabs: {
        upcoming: 'Inayokuja',
        past: 'Iliyopita',
      },
      bookNew: 'Panga Miadi Mpya',
      emptyUpcoming: 'Hakuna miadi inayokuja',
      emptyPast: 'Hakuna miadi iliyopita',
      emptyDescription: 'Miadi yako itaonekana hapa',
      viewDetails: 'Angalia Maelezo',
      reschedule: 'Badilisha Tarehe',
      cancel: 'Ghairi',
      queuePosition: 'Nafasi kwenye Foleni:',
      estimatedWait: 'Muda wa Kusubiri:',
      minutes: 'dakika',
      facilityLoad: 'Msongamano wa Kituo:',
      loadLevels: {
        low: 'Chini',
        medium: 'Wastani',
        high: 'Juu',
      },
      selectFacility: 'Chagua Kituo',
      availableSlots: 'Nafasi Zinazopatikana:',
      distance: 'Umbali:',
      bookAppointment: 'Panga Miadi',
      confirmBooking: 'Thibitisha Miadi',
      appointmentBooked: 'Miadi Imepangwa!',
      appointmentCancelled: 'Miadi Imeghairiwa',
      status: {
        upcoming: 'Inakuja',
        completed: 'Imekamilika',
        cancelled: 'Imeghairiwa',
      },
    },
    en: {
      title: 'My Appointments',
      subtitle: 'Schedule and manage your appointments',
      tabs: {
        upcoming: 'Upcoming',
        past: 'Past',
      },
      bookNew: 'Book New Appointment',
      emptyUpcoming: 'No upcoming appointments',
      emptyPast: 'No past appointments',
      emptyDescription: 'Your appointments will appear here',
      viewDetails: 'View Details',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      queuePosition: 'Queue Position:',
      estimatedWait: 'Estimated Wait:',
      minutes: 'minutes',
      facilityLoad: 'Facility Load:',
      loadLevels: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      selectFacility: 'Select Facility',
      availableSlots: 'Available Slots:',
      distance: 'Distance:',
      bookAppointment: 'Book Appointment',
      confirmBooking: 'Confirm Booking',
      appointmentBooked: 'Appointment Booked!',
      appointmentCancelled: 'Appointment Cancelled',
      status: {
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
  };

  const t = content[language];

  // Mock appointments
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      date: new Date('2026-02-10'),
      time: '10:00 AM',
      type: { sw: 'Uchunguzi wa Kawaida', en: 'General Checkup' },
      provider: { sw: 'Dkt. Mwangi', en: 'Dr. Mwangi' },
      facility: { sw: 'Kituo cha Afya Kariakoo', en: 'Kariakoo Health Centre' },
      status: 'upcoming',
      queuePosition: 4,
      estimatedWait: 25,
      facilityLoad: 'medium',
    },
    {
      id: '2',
      date: new Date('2026-02-05'),
      time: '2:00 PM',
      type: { sw: 'Vipimo vya Damu', en: 'Blood Test' },
      provider: { sw: 'Lab Technician', en: 'Lab Technician' },
      facility: { sw: 'Kituo cha Afya Kariakoo', en: 'Kariakoo Health Centre' },
      status: 'completed',
    },
  ];

  // Mock facilities
  const mockFacilities: Facility[] = [
    {
      id: '1',
      name: { sw: 'Kituo cha Afya Kariakoo', en: 'Kariakoo Health Centre' },
      address: { sw: 'Kariakoo, Dar es Salaam', en: 'Kariakoo, Dar es Salaam' },
      currentLoad: 'medium',
      waitTime: 30,
      availableSlots: 12,
      distance: '2.3 km',
    },
    {
      id: '2',
      name: { sw: 'Hospitali ya Rufaa Muhimbili', en: 'Muhimbili National Hospital' },
      address: { sw: 'Upanga, Dar es Salaam', en: 'Upanga, Dar es Salaam' },
      currentLoad: 'high',
      waitTime: 60,
      availableSlots: 3,
      distance: '5.1 km',
    },
    {
      id: '3',
      name: { sw: 'Kituo cha Afya Kinondoni', en: 'Kinondoni Health Centre' },
      address: { sw: 'Kinondoni, Dar es Salaam', en: 'Kinondoni, Dar es Salaam' },
      currentLoad: 'low',
      waitTime: 15,
      availableSlots: 24,
      distance: '7.8 km',
    },
  ];

  const upcomingAppointments = mockAppointments.filter(
    (a) => a.status === 'upcoming'
  );
  const pastAppointments = mockAppointments.filter(
    (a) => a.status !== 'upcoming'
  );

  const getLoadColor = (load: string) => {
    switch (load) {
      case 'low':
        return { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' };
      case 'medium':
        return { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' };
      case 'high':
        return { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // List View
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-24">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-[#6B7280] hover:text-[#1A1D23] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-[#1E88E5]" />
              <h1 className="text-3xl font-bold text-[#1A1D23]">{t.title}</h1>
            </div>
            <p className="text-[#6B7280] text-base">{t.subtitle}</p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button
            onClick={() => setView('book')}
            className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.bookNew}
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <div className="max-w-4xl mx-auto px-6 pb-6">
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">
            {t.tabs.upcoming}
          </h2>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
              <Calendar className="w-16 h-16 text-[#D1D5DB] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A1D23] mb-2">
                {t.emptyUpcoming}
              </h3>
              <p className="text-[#6B7280]">{t.emptyDescription}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt, index) => {
                const loadColors = apt.facilityLoad
                  ? getLoadColor(apt.facilityLoad)
                  : null;

                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1A1D23] mb-1">
                          {apt.type[language]}
                        </h3>
                        <p className="text-[#6B7280] text-sm">
                          {formatDate(apt.date)} • {apt.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFF6FF] rounded-full">
                        <CheckCircle className="w-4 h-4 text-[#1E88E5]" />
                        <span className="text-xs font-medium text-[#1E88E5]">
                          {t.status.upcoming}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <User className="w-4 h-4" />
                        <span>{apt.provider[language]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <MapPin className="w-4 h-4" />
                        <span>{apt.facility[language]}</span>
                      </div>
                    </div>

                    {/* Queue Info */}
                    {apt.queuePosition && apt.estimatedWait && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-[#FAFBFC] rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-[#1E88E5]" />
                            <span className="text-xs text-[#6B7280]">
                              {t.queuePosition}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-[#1A1D23]">
                            #{apt.queuePosition}
                          </p>
                        </div>
                        <div className="p-3 bg-[#FAFBFC] rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-[#1E88E5]" />
                            <span className="text-xs text-[#6B7280]">
                              {t.estimatedWait}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-[#1A1D23]">
                            {apt.estimatedWait}
                            <span className="text-sm font-normal text-[#6B7280] ml-1">
                              {t.minutes}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Facility Load */}
                    {loadColors && apt.facilityLoad && (
                      <div
                        className="p-3 rounded-lg mb-4"
                        style={{
                          backgroundColor: loadColors.bg,
                          borderColor: loadColors.border,
                          borderWidth: '1px',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Activity
                            className="w-4 h-4"
                            style={{ color: loadColors.text }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: loadColors.text }}
                          >
                            {t.facilityLoad} {t.loadLevels[apt.facilityLoad]}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setView('details');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        {t.viewDetails}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[#EF4444]">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 pb-6">
            <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">
              {t.tabs.past}
            </h2>
            <div className="space-y-3">
              {pastAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-[#E5E7EB] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-[#1A1D23]">
                        {apt.type[language]}
                      </h4>
                      <p className="text-sm text-[#6B7280]">
                        {formatDate(apt.date)} • {apt.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ECFDF5] rounded-full">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      <span className="text-xs font-medium text-[#10B981]">
                        {t.status.completed}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Book New Appointment View
  if (view === 'book') {
    return (
      <div className="min-h-screen bg-[#FAFBFC] pb-24">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 mb-4 text-[#6B7280] hover:text-[#1A1D23] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'sw' ? 'Rudi' : 'Back'}
              </span>
            </button>

            <h1 className="text-2xl font-bold text-[#1A1D23] mb-2">{t.selectFacility}</h1>
            <p className="text-[#6B7280]">
              {language === 'sw'
                ? 'Chagua kituo na angalia msongamano wa sasa'
                : 'Choose a facility and see current load'}
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
          {mockFacilities.map((facility, index) => {
            const loadColors = getLoadColor(facility.currentLoad);

            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1D23] mb-1">
                      {facility.name[language]}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-2">
                      {facility.address[language]}
                    </p>
                    {facility.distance && (
                      <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {t.distance} {facility.distance}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-[#FAFBFC] rounded-lg">
                    <p className="text-2xl font-bold text-[#1A1D23]">
                      {facility.availableSlots}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{t.availableSlots}</p>
                  </div>
                  <div className="text-center p-3 bg-[#FAFBFC] rounded-lg">
                    <p className="text-2xl font-bold text-[#1A1D23]">
                      {facility.waitTime}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{t.minutes}</p>
                  </div>
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{
                      backgroundColor: loadColors.bg,
                      borderColor: loadColors.border,
                      borderWidth: '1px',
                    }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: loadColors.text }}
                    >
                      {t.loadLevels[facility.currentLoad]}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{t.facilityLoad}</p>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => {
                    setSelectedFacility(facility);
                    // In production, this would open a date/time picker
                    alert(
                      language === 'sw'
                        ? `Kuchagua tarehe na muda kwa ${facility.name.sw}...`
                        : `Selecting date and time for ${facility.name.en}...`
                    );
                  }}
                  className="w-full bg-[#1E88E5] hover:bg-[#1976D2]"
                >
                  {t.bookAppointment}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
