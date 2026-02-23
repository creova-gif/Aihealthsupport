/**
 * FacilityFinder - Find nearby health facilities with maps
 * Shows facilities, distances, services, and current load
 */

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Activity,
  ChevronRight,
  Filter,
  Search,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion } from 'motion/react';

const translations = {
  sw: {
    title: 'Tafuta Kituo cha Afya',
    subtitle: 'Pata kituo cha karibu nawe',
    search: 'Tafuta kituo...',
    nearestFacilities: 'Vituo vya Karibu',
    distance: 'Umbali',
    away: 'mbali',
    call: 'Piga Simu',
    getDirections: 'Pata Maelekezo',
    openNow: 'Wazi Sasa',
    closed: 'Imefungwa',
    facilityLoad: 'Msongamano',
    waitTime: 'Muda wa Kusubiri',
    services: 'Huduma',
    minutes: 'dakika',
    filterByService: 'Chuja kwa Huduma',
    all: 'Zote',
    emergency: 'Dharura',
    maternal: 'Mama na Mtoto',
    ncd: 'Magonjwa Sugu',
    pharmacy: 'Duka la Dawa',
    lab: 'Maabara',
    currentLocation: 'Eneo Langu',
    noFacilities: 'Hakuna Vituo Vilivyopatikana',
    rating: 'Ukadiriaji',
  },
  en: {
    title: 'Find Health Facility',
    subtitle: 'Locate facilities near you',
    search: 'Search for facility...',
    nearestFacilities: 'Nearest Facilities',
    distance: 'Distance',
    away: 'away',
    call: 'Call',
    getDirections: 'Get Directions',
    openNow: 'Open Now',
    closed: 'Closed',
    facilityLoad: 'Facility Load',
    waitTime: 'Wait Time',
    services: 'Services',
    minutes: 'minutes',
    filterByService: 'Filter by Service',
    all: 'All',
    emergency: 'Emergency',
    maternal: 'Maternal Care',
    ncd: 'Chronic Diseases',
    pharmacy: 'Pharmacy',
    lab: 'Laboratory',
    currentLocation: 'My Location',
    noFacilities: 'No Facilities Found',
    rating: 'Rating',
  },
};

interface Facility {
  id: string;
  name: Record<'sw' | 'en', string>;
  address: Record<'sw' | 'en', string>;
  distance: string;
  phone: string;
  isOpen: boolean;
  openHours: string;
  waitTime: number;
  currentLoad: 'low' | 'medium' | 'high';
  services: string[];
  rating: number;
  latitude: number;
  longitude: number;
}

export function FacilityFinder({ onBack }: { onBack: () => void }) {
  const { language } = useApp();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');

  // Mock facilities data
  const facilities: Facility[] = [
    {
      id: '1',
      name: {
        sw: 'Zahanati ya Tandale',
        en: 'Tandale Dispensary',
      },
      address: {
        sw: 'Barabara ya Morogoro, Tandale',
        en: 'Morogoro Road, Tandale',
      },
      distance: '0.8 km',
      phone: '+255 22 277 3000',
      isOpen: true,
      openHours: '07:00 - 19:00',
      waitTime: 15,
      currentLoad: 'low',
      services: ['emergency', 'maternal', 'pharmacy', 'lab'],
      rating: 4.5,
      latitude: -6.7924,
      longitude: 39.2083,
    },
    {
      id: '2',
      name: {
        sw: 'Hospitali ya Mwananyamala',
        en: 'Mwananyamala Hospital',
      },
      address: {
        sw: 'Mwananyamala, Dar es Salaam',
        en: 'Mwananyamala, Dar es Salaam',
      },
      distance: '2.3 km',
      phone: '+255 22 270 0987',
      isOpen: true,
      openHours: '24/7',
      waitTime: 45,
      currentLoad: 'high',
      services: ['emergency', 'maternal', 'ncd', 'pharmacy', 'lab'],
      rating: 4.2,
      latitude: -6.7833,
      longitude: 39.2167,
    },
    {
      id: '3',
      name: {
        sw: 'Kituo cha Afya Magomeni',
        en: 'Magomeni Health Center',
      },
      address: {
        sw: 'Magomeni Mapipa',
        en: 'Magomeni Mapipa',
      },
      distance: '3.5 km',
      phone: '+255 22 215 0456',
      isOpen: true,
      openHours: '08:00 - 17:00',
      waitTime: 30,
      currentLoad: 'medium',
      services: ['maternal', 'ncd', 'pharmacy'],
      rating: 4.0,
      latitude: -6.8000,
      longitude: 39.2000,
    },
  ];

  const services = [
    { id: 'all', label: t.all },
    { id: 'emergency', label: t.emergency },
    { id: 'maternal', label: t.maternal },
    { id: 'ncd', label: t.ncd },
    { id: 'pharmacy', label: t.pharmacy },
    { id: 'lab', label: t.lab },
  ];

  const getLoadColor = (load: string) => {
    switch (load) {
      case 'low':
        return { bg: '#ECFDF5', text: '#10B981', border: '#86EFAC' };
      case 'medium':
        return { bg: '#FEF3C7', text: '#F59E0B', border: '#FCD34D' };
      case 'high':
        return { bg: '#FEE2E2', text: '#EF4444', border: '#FCA5A5' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
    }
  };

  // Filter facilities
  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      searchQuery === '' ||
      facility.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address[language].toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService =
      selectedService === 'all' || facility.services.includes(selectedService);

    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="text-sm font-medium">{language === 'sw' ? 'Rudi' : 'Back'}</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Service Filter */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold text-sm transition-all ${
                  selectedService === service.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-48 flex items-center justify-center border-2 border-blue-200 mb-6">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-blue-900">
              {language === 'sw' ? 'Ramani Itaonekana Hapa' : 'Map will appear here'}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {t.currentLocation}: {language === 'sw' ? 'Tandale, Dar es Salaam' : 'Tandale, Dar es Salaam'}
            </p>
          </div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t.nearestFacilities}</h2>

        {filteredFacilities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>{t.noFacilities}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFacilities.map((facility, idx) => {
              const loadColors = getLoadColor(facility.currentLoad);

              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {facility.name[language]}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{facility.address[language]}</p>

                      {/* Distance & Status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-blue-600">
                          <Navigation className="w-4 h-4" />
                          <span className="font-semibold">{facility.distance}</span>
                        </div>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            facility.isOpen
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {facility.isOpen ? t.openNow : t.closed}
                        </span>

                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {facility.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-gray-900">{facility.waitTime}</p>
                      <p className="text-xs text-gray-600">{t.minutes}</p>
                    </div>

                    <div
                      className="rounded-lg p-3 text-center border"
                      style={{
                        backgroundColor: loadColors.bg,
                        borderColor: loadColors.border,
                      }}
                    >
                      <p className="text-xs font-semibold mb-1" style={{ color: loadColors.text }}>
                        {t.facilityLoad}
                      </p>
                      <p className="text-sm font-bold" style={{ color: loadColors.text }}>
                        {facility.currentLoad.toUpperCase()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">{facility.openHours}</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">{t.services}:</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.services.map((service) => (
                        <span
                          key={service}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                        >
                          {services.find((s) => s.id === service)?.label || service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      {t.getDirections}
                    </button>

                    <button
                      onClick={() => (window.location.href = `tel:${facility.phone}`)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {t.call}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
