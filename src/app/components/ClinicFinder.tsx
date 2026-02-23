/**
 * ClinicFinder - Find Nearest Healthcare Facilities
 * 
 * ELITE STANDARD: Government-grade healthcare facility locator
 * Offline-first design with cached facility data
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Hospital,
  Stethoscope,
  Search,
} from 'lucide-react';
import { MedicalButton, MedicalCard, colors } from '@/app/design-system';

interface ClinicFinderProps {
  language: 'sw' | 'en';
  onBack: () => void;
}

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'health-center' | 'dispensary';
  distance: number; // km
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  services: string[];
}

export function ClinicFinder({ language, onBack }: ClinicFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const t = {
    sw: {
      title: 'Tafuta Kituo cha Afya',
      searchPlaceholder: 'Tafuta kituo...',
      nearYou: 'Karibu Nawe',
      getDirections: 'Pata Maelekezo',
      call: 'Piga Simu',
      distance: 'Umbali',
      openNow: 'Wazi Sasa',
      hospital: 'Hospitali',
      healthCenter: 'Kituo cha Afya',
      dispensary: 'Zahanati',
      services: 'Huduma',
      useMyLocation: 'Tumia Mahali Pangu',
      km: 'km',
    },
    en: {
      title: 'Find Healthcare Facility',
      searchPlaceholder: 'Search facility...',
      nearYou: 'Near You',
      getDirections: 'Get Directions',
      call: 'Call',
      distance: 'Distance',
      openNow: 'Open Now',
      hospital: 'Hospital',
      healthCenter: 'Health Center',
      dispensary: 'Dispensary',
      services: 'Services',
      useMyLocation: 'Use My Location',
      km: 'km',
    },
  }[language];

  // Mock facility data (would come from API in production)
  const facilities: Facility[] = [
    {
      id: '1',
      name: language === 'sw' ? 'Hospitali ya Mwananyamala' : 'Mwananyamala Hospital',
      type: 'hospital',
      distance: 2.3,
      address: 'Mwananyamala, Dar es Salaam',
      phone: '+255 22 270 0811',
      hours: '24/7',
      lat: -6.7624,
      lng: 39.2468,
      services: language === 'sw' 
        ? ['Dharura', 'Uzazi', 'Upasuaji', 'Lab']
        : ['Emergency', 'Maternity', 'Surgery', 'Lab'],
    },
    {
      id: '2',
      name: language === 'sw' ? 'Kituo cha Afya Kigogo' : 'Kigogo Health Center',
      type: 'health-center',
      distance: 1.5,
      address: 'Kigogo, Dar es Salaam',
      phone: '+255 22 270 1234',
      hours: '08:00 - 17:00',
      lat: -6.7924,
      lng: 39.2268,
      services: language === 'sw'
        ? ['Huduma ya Kwanza', 'Chanjo', 'Uzazi', 'HIV/AIDS']
        : ['Primary Care', 'Vaccinations', 'Maternity', 'HIV/AIDS'],
    },
    {
      id: '3',
      name: language === 'sw' ? 'Zahanati ya Tandale' : 'Tandale Dispensary',
      type: 'dispensary',
      distance: 0.8,
      address: 'Tandale, Dar es Salaam',
      phone: '+255 22 270 5678',
      hours: '08:00 - 16:00',
      lat: -6.7724,
      lng: 39.2368,
      services: language === 'sw'
        ? ['Huduma ya Kwanza', 'Dawa', 'Chanjo']
        : ['Primary Care', 'Pharmacy', 'Vaccinations'],
    },
  ];

  const filteredFacilities = facilities
    .filter(f =>
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.distance - b.distance);

  const requestLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const getFacilityIcon = (type: Facility['type']) => {
    return type === 'hospital' ? Hospital : type === 'health-center' ? Stethoscope : MapPin;
  };

  const getFacilityTypeLabel = (type: Facility['type']) => {
    return type === 'hospital' ? t.hospital : type === 'health-center' ? t.healthCenter : t.dispensary;
  };

  const openDirections = (facility: Facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: colors.neutral[100] }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: colors.neutral[700] }} />
            </button>
            <h1 className="text-lg font-semibold text-[#1A1D23]">{t.title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-base focus:outline-none focus:border-[#0066CC]"
          />
        </div>

        {/* Use My Location Button */}
        {!userLocation && (
          <MedicalButton
            variant="secondary"
            size="md"
            onClick={requestLocation}
            fullWidth
            disabled={loading}
          >
            <Navigation className="w-5 h-5" />
            {t.useMyLocation}
          </MedicalButton>
        )}

        {/* Facilities List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
            {t.nearYou}
          </h2>

          {filteredFacilities.map((facility) => {
            const FacilityIcon = getFacilityIcon(facility.type);
            return (
              <MedicalCard key={facility.id}>
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <FacilityIcon className="w-6 h-6" style={{ color: colors.primary[500] }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1A1D23] mb-1">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-[#6B7280]">
                          {getFacilityTypeLabel(facility.type)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold" style={{ color: colors.primary[500] }}>
                          {facility.distance} {t.km}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{facility.address}</span>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{facility.hours}</span>
                      {facility.hours === '24/7' && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: colors.success[50],
                            color: colors.success[700],
                          }}
                        >
                          {t.openNow}
                        </span>
                      )}
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {facility.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: colors.neutral[100],
                            color: colors.neutral[700],
                          }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <MedicalButton
                        variant="primary"
                        size="sm"
                        onClick={() => openDirections(facility)}
                      >
                        <Navigation className="w-4 h-4" />
                        {t.getDirections}
                      </MedicalButton>
                      <MedicalButton
                        variant="secondary"
                        size="sm"
                        onClick={() => window.location.href = `tel:${facility.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                        {t.call}
                      </MedicalButton>
                    </div>
                  </div>
                </div>
              </MedicalCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
