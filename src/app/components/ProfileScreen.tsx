import React from 'react';
import { ChevronLeft, User, MapPin, Phone, Mail, Calendar, Shield, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    title: 'Wasifu Wangu',
    personalInfo: 'Taarifa Binafsi',
    name: 'Jina',
    region: 'Mkoa',
    phone: 'Simu',
    email: 'Barua pepe',
    dob: 'Tarehe ya Kuzaliwa',
    settings: 'Mipangilio',
    notifications: 'Arifa',
    privacy: 'Faragha',
    help: 'Msaada',
    about: 'Kuhusu AfyaAI',
    logout: 'Ondoka',
    dataProtected: 'Taarifa zako zimehifadhiwa kwa usalama',
    version: 'Toleo',
    edit: 'Hariri',
  },
  en: {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    name: 'Name',
    region: 'Region',
    phone: 'Phone',
    email: 'Email',
    dob: 'Date of Birth',
    settings: 'Settings',
    notifications: 'Notifications',
    privacy: 'Privacy',
    help: 'Help',
    about: 'About AfyaAI',
    logout: 'Logout',
    dataProtected: 'Your data is protected',
    version: 'Version',
    edit: 'Edit',
  },
};

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const { language, userData } = useApp();
  const t = translations[language];

  const menuItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: t.notifications,
      badge: '3',
    },
    {
      id: 'privacy',
      icon: Shield,
      label: t.privacy,
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: t.help,
    },
    {
      id: 'about',
      icon: User,
      label: t.about,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
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
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {userData?.name || 'Mgonjwa'}
                </h2>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{userData?.region || 'Dar es Salaam'}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t.edit}
              </Button>
            </div>

            {/* Privacy Notice */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">{t.dataProtected}</p>
                  <p className="text-xs text-green-700 mt-1">
                    {language === 'sw'
                      ? 'Tunafuata sheria za PDPA na TMDA'
                      : 'We comply with PDPA and TMDA regulations'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t.personalInfo}
          </h3>
          <Card className="border border-gray-200">
            <CardContent className="p-0 divide-y divide-gray-100">
              <div className="flex items-center gap-3 p-4">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{t.phone}</p>
                  <p className="text-sm font-medium text-gray-900">+255 712 345 678</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{t.email}</p>
                  <p className="text-sm font-medium text-gray-900">mgonjwa@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{t.dob}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {language === 'sw' ? '15 Machi, 1990' : 'March 15, 1990'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Menu */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t.settings}
          </h3>
          <Card className="border border-gray-200">
            <CardContent className="p-0 divide-y divide-gray-100">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="flex-1 text-left text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Version Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            AfyaAI TZA {t.version} 1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'sw' ? 'Imeidhinishwa na' : 'Approved by'} MoH & TMDA
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-4 px-6 bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-200 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-gray-700 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">{t.logout}</span>
        </button>
      </div>
    </div>
  );
}
