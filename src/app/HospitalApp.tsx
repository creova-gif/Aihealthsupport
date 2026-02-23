/**
 * HOSPITAL MODE - MAIN APPLICATION
 * 
 * Unified hospital interface with role-based routing
 * 
 * Roles supported:
 * - Receptionist
 * - Nurse
 * - Doctor / Clinical Officer
 * - Pharmacist
 * - Lab Tech
 * - Admin
 * - MoH Admin
 * - CHW
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import {
  Users,
  Activity,
  Pill,
  TestTube,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Home,
  Calendar,
  Stethoscope,
  User,
  Building
} from 'lucide-react';

// Import all hospital modules
import { MPISystem } from './components/hospital/MPISystem';
import { SOAPDocumentation } from './components/hospital/SOAPDocumentation';
import { VitalsEntry } from './components/hospital/VitalsEntry';
import { QueueManagement, QueueDisplayTV } from './components/hospital/QueueManagement';
import { EPrescribing, PharmacyDispensing, PharmacyInventory } from './components/hospital/PharmacyModule';
import { LabOrdering, LabResultEntry, LabQueue } from './components/hospital/LaboratoryModule';
import { MoHAnalyticsDashboard } from './components/hospital/MoHDashboard';

// Role-specific dashboards (will build next)
import { DoctorDashboard } from './components/hospital/dashboards/DoctorDashboard';
import { NurseDashboard } from './components/hospital/dashboards/NurseDashboard';
import { PharmacistDashboard } from './components/hospital/dashboards/PharmacistDashboard';
import { ReceptionistDashboard } from './components/hospital/dashboards/ReceptionistDashboard';

interface HospitalAppProps {
  userRole: 'receptionist' | 'nurse' | 'doctor' | 'clinical-officer' | 'pharmacist' | 'lab-tech' | 'admin' | 'moh-admin';
  userId: string;
  facilityId: string;
}

export const HospitalApp: React.FC<HospitalAppProps> = ({
  userRole,
  userId,
  facilityId
}) => {
  const { t } = useTranslation(['clinical', 'common']);
  
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // Mock user data
  const currentUser = {
    user_id: userId,
    name: 'Dr. John Mwangi',
    role: userRole,
    facility: 'Muhimbili National Hospital',
    avatar: null
  };

  /**
   * NAVIGATION MENU (Role-Based)
   */
  const getNavigationMenu = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'search-patient', label: 'Find Patient', icon: Search }
    ];

    const roleSpecificItems: Record<string, any[]> = {
      receptionist: [
        { id: 'register-patient', label: 'Register Patient', icon: Users },
        { id: 'check-in', label: 'Check-In', icon: Calendar },
        { id: 'queue', label: 'Queue', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar }
      ],
      nurse: [
        { id: 'queue', label: 'My Queue', icon: Users },
        { id: 'vitals', label: 'Vital Signs', icon: Activity },
        { id: 'triage', label: 'Triage', icon: Activity }
      ],
      doctor: [
        { id: 'my-patients', label: 'My Patients', icon: Users },
        { id: 'queue', label: 'Queue', icon: Users },
        { id: 'documentation', label: 'Documentation', icon: FileText },
        { id: 'orders', label: 'Orders', icon: Stethoscope }
      ],
      'clinical-officer': [
        { id: 'my-patients', label: 'My Patients', icon: Users },
        { id: 'queue', label: 'Queue', icon: Users },
        { id: 'documentation', label: 'Documentation', icon: FileText },
        { id: 'orders', label: 'Orders', icon: Stethoscope }
      ],
      pharmacist: [
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
        { id: 'dispense', label: 'Dispense', icon: Pill },
        { id: 'inventory', label: 'Inventory', icon: Pill }
      ],
      'lab-tech': [
        { id: 'lab-queue', label: 'Lab Queue', icon: TestTube },
        { id: 'results', label: 'Enter Results', icon: TestTube },
        { id: 'qc', label: 'Quality Control', icon: TestTube }
      ],
      admin: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'staff', label: 'Staff', icon: Users },
        { id: 'facility', label: 'Facility', icon: Building },
        { id: 'settings', label: 'Settings', icon: Settings }
      ],
      'moh-admin': [
        { id: 'national-dashboard', label: 'National Dashboard', icon: BarChart3 },
        { id: 'surveillance', label: 'Surveillance', icon: Activity },
        { id: 'facilities', label: 'Facilities', icon: Building },
        { id: 'reports', label: 'Reports', icon: FileText }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[userRole] || [])];
  };

  const navigationMenu = getNavigationMenu();

  /**
   * RENDER CURRENT VIEW
   */
  const renderView = () => {
    // MoH Admin views
    if (userRole === 'moh-admin') {
      if (currentView === 'national-dashboard' || currentView === 'dashboard') {
        return <MoHAnalyticsDashboard userRole="moh-admin" />;
      }
    }

    // Common views
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      
      case 'search-patient':
        return (
          <MPISystem
            facilityId={facilityId}
            onPatientSelected={(patient) => {
              setSelectedPatient(patient);
              setCurrentView('patient-chart');
            }}
          />
        );
      
      case 'queue':
        return (
          <QueueManagement
            facilityId={facilityId}
            userRole={userRole}
          />
        );
      
      case 'vitals':
        if (selectedPatient && selectedEncounter) {
          return (
            <VitalsEntry
              patient={selectedPatient}
              encounter={selectedEncounter}
              onSave={(vitals) => console.log('Vitals saved:', vitals)}
            />
          );
        }
        return <div className="p-8 text-center text-[#6B7280]">Select a patient to record vitals</div>;
      
      case 'documentation':
        if (selectedPatient && selectedEncounter) {
          return (
            <SOAPDocumentation
              patient={selectedPatient}
              encounter={selectedEncounter}
              onSave={(note) => console.log('Note saved:', note)}
              onSign={(noteId) => console.log('Note signed:', noteId)}
            />
          );
        }
        return <div className="p-8 text-center text-[#6B7280]">Select a patient to document</div>;
      
      case 'prescriptions':
      case 'orders':
        if (selectedPatient && selectedEncounter) {
          return (
            <EPrescribing
              patient={selectedPatient}
              encounter={selectedEncounter}
              onPrescribe={(rx) => console.log('Prescription created:', rx)}
            />
          );
        }
        return <div className="p-8 text-center text-[#6B7280]">Select a patient to prescribe</div>;
      
      case 'dispense':
        return <PharmacyDispensing facilityId={facilityId} />;
      
      case 'inventory':
        return <PharmacyInventory facilityId={facilityId} />;
      
      case 'lab-queue':
        return <LabQueue facilityId={facilityId} />;
      
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'doctor':
      case 'clinical-officer':
        return <DoctorDashboard userId={userId} facilityId={facilityId} />;
      
      case 'nurse':
        return <NurseDashboard userId={userId} facilityId={facilityId} />;
      
      case 'pharmacist':
        return <PharmacistDashboard facilityId={facilityId} />;
      
      case 'receptionist':
        return <ReceptionistDashboard facilityId={facilityId} />;
      
      case 'moh-admin':
        return <MoHAnalyticsDashboard userRole="moh-admin" />;
      
      default:
        return (
          <Card className="p-12 text-center">
            <Home className="h-16 w-16 mx-auto mb-4 text-[#0F3D56]" />
            <h2 className="text-2xl font-bold text-[#0F3D56] mb-2">
              Welcome to AfyaCare Hospital Mode
            </h2>
            <p className="text-[#6B7280]">
              Select an option from the menu to get started
            </p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Logo & Facility */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F3D56] rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-[#0F3D56]">AfyaCare</div>
                <div className="text-xs text-[#6B7280]">{currentUser.facility}</div>
              </div>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search patients by name, AfyaID, phone..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D56]"
                onFocus={() => setCurrentView('search-patient')}
              />
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4">
            {/* Sync Status */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[#6B7280]">Synced</span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C84B31] text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-[#1E1E1E]">
                  {currentUser.name}
                </div>
                <div className="text-xs text-[#6B7280] capitalize">
                  {userRole.replace('-', ' ')}
                </div>
              </div>
              <div className="w-10 h-10 bg-[#0F3D56] rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="sm">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:relative lg:translate-x-0
            w-64 h-[calc(100vh-73px)] bg-white border-r
            transition-transform duration-300 z-30
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-2">
            {navigationMenu.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t mt-auto">
            <div className="text-xs text-[#6B7280] space-y-1">
              <div>Version 2.0.0</div>
              <div>Hospital Mode</div>
              <div>© 2026 AfyaCare Tanzania</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-73px)]">
          {renderView()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HospitalApp;
