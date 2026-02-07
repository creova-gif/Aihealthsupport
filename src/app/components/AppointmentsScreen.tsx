import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Phone, Plus, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Miadi Yangu',
    upcoming: 'Miadi Ijayo',
    past: 'Miadi Iliyopita',
    noUpcoming: 'Hakuna miadi ijayo',
    bookNew: 'Agiza Miadi Mpya',
    facility: 'Kituo',
    doctor: 'Daktari',
    reason: 'Sababu',
    status: 'Hali',
    confirmed: 'Imethibitishwa',
    pending: 'Inasubiri',
    completed: 'Imekamilika',
    getDirections: 'Pata Maelekezo',
    callFacility: 'Piga Simu',
    backHome: 'Rudi Nyumbani',
    reminderSet: 'Ukumbusho umewekwa',
    beforeAppointment: 'saa 1 kabla',
  },
  en: {
    title: 'My Appointments',
    upcoming: 'Upcoming',
    past: 'Past Appointments',
    noUpcoming: 'No upcoming appointments',
    bookNew: 'Book New Appointment',
    facility: 'Facility',
    doctor: 'Doctor',
    reason: 'Reason',
    status: 'Status',
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    getDirections: 'Get Directions',
    callFacility: 'Call Facility',
    backHome: 'Back Home',
    reminderSet: 'Reminder set',
    beforeAppointment: '1 hour before',
  },
};

interface AppointmentsScreenProps {
  onBack: () => void;
}

export function AppointmentsScreen({ onBack }: AppointmentsScreenProps) {
  const { language } = useApp();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingAppointments = [
    {
      id: 1,
      date: language === 'sw' ? 'Jumatatu, Jan 20, 2026' : 'Monday, Jan 20, 2026',
      time: '10:00 AM',
      facility: 'Mwananyamala Hospital',
      doctor: language === 'sw' ? 'Dkt. Amina Mbwana' : 'Dr. Amina Mbwana',
      reason: language === 'sw' ? 'Ukaguzi wa kawaida' : 'Routine checkup',
      status: 'confirmed',
      distance: '2.3 km',
      phone: '+255 22 215 0174',
    },
    {
      id: 2,
      date: language === 'sw' ? 'Ijumaa, Jan 24, 2026' : 'Friday, Jan 24, 2026',
      time: '2:00 PM',
      facility: 'Kigogo Health Center',
      doctor: language === 'sw' ? 'Nesi Mary John' : 'Nurse Mary John',
      reason: language === 'sw' ? 'Chanjo ya watoto' : 'Child vaccination',
      status: 'pending',
      distance: '1.5 km',
      phone: '+255 22 286 0120',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      date: language === 'sw' ? 'Ijumaa, Jan 10, 2026' : 'Friday, Jan 10, 2026',
      time: '9:00 AM',
      facility: 'Mwananyamala Hospital',
      doctor: language === 'sw' ? 'Dkt. Joseph Kamara' : 'Dr. Joseph Kamara',
      reason: language === 'sw' ? 'Shinikizo la damu' : 'Blood pressure check',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: t.confirmed,
      },
      pending: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        label: t.pending,
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: t.completed,
      },
    };

    const style = styles[status as keyof typeof styles];
    return (
      <Badge className={`${style.bg} ${style.text} border-0`}>
        {style.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{t.title}</h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-afya-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.upcoming}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'past'
                  ? 'bg-afya-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.past}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">{t.noUpcoming}</p>
                <Button className="bg-afya-green hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" />
                  {t.bookNew}
                </Button>
              </div>
            ) : (
              <>
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      {/* Date & Time */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-5 w-5 text-afya-green" />
                            <h3 className="font-semibold text-gray-900">{appointment.date}</h3>
                          </div>
                          <div className="flex items-center gap-2 ml-7">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.time}</span>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      {/* Facility & Doctor */}
                      <div className="space-y-2 mb-4 pl-7">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">{t.facility}</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">{appointment.facility}</p>
                            <span className="text-xs text-gray-500">({appointment.distance})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">{t.doctor}</p>
                          <p className="text-sm text-gray-700">{appointment.doctor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">{t.reason}</p>
                          <p className="text-sm text-gray-700">{appointment.reason}</p>
                        </div>
                      </div>

                      {/* Reminder Notice */}
                      {appointment.status === 'confirmed' && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <p className="text-sm text-blue-900">
                              {t.reminderSet}: {t.beforeAppointment}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          {t.getDirections}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => (window.location.href = `tel:${appointment.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {t.callFacility}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Book New Appointment Button */}
                <button
                  className="w-full py-4 px-6 bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-afya-green rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-afya-green"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">{t.bookNew}</span>
                </button>
              </>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="border border-gray-200 opacity-75">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-700">{appointment.date}</h3>
                      </div>
                      <div className="flex items-center gap-2 ml-7">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{appointment.time}</span>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-1 pl-7">
                    <p className="text-sm text-gray-700">{appointment.facility}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
