import React from 'react';
import { Home, Activity, Calendar, User } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

const translations = {
  sw: {
    home: 'Nyumbani',
    symptoms: 'Dalili',
    appointments: 'Miadi',
    profile: 'Wasifu',
  },
  en: {
    home: 'Home',
    symptoms: 'Symptoms',
    appointments: 'Appointments',
    profile: 'Profile',
  },
};

interface BottomNavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export function BottomNavigation({ activeRoute, onNavigate }: BottomNavigationProps) {
  const { language } = useApp();
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', icon: Home, label: t.home },
    { id: 'symptom-checker', icon: Activity, label: t.symptoms },
    { id: 'appointments', icon: Calendar, label: t.appointments },
    { id: 'profile', icon: User, label: t.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 relative ${
                  isActive
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-95'
                }`}
                style={{ minHeight: '64px' }}
              >
                <Icon
                  className={`h-7 w-7 mb-1 ${isActive ? 'stroke-[3]' : 'stroke-[2.5]'}`}
                />
                <span className={`text-xs leading-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-green-700 rounded-t-full shadow-lg" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}