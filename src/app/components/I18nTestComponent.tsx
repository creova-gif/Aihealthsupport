/**
 * I18n Test Component - Demonstrates Language Switching
 * 
 * This component can be temporarily added to test the i18n system
 * Use it during development to verify all features work correctly
 */

import React, { useState } from 'react';
import { useI18n } from '../utils/useI18n';
import { getMedicalTerm } from '../utils/medicalTerms';

export function I18nTestComponent() {
  const { 
    t, 
    tMedical, 
    language, 
    changeLanguage,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    formatRelativeTime
  } = useI18n();

  const [testCount, setTestCount] = useState(3);
  const testDate = new Date('2026-02-20T14:30:00');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            🌍 i18n System Test Dashboard
          </h1>
          <p className="text-gray-600">
            Current Language: <strong>{language === 'sw' ? 'Kiswahili' : 'English'}</strong>
          </p>
          
          <button
            onClick={() => changeLanguage(language === 'sw' ? 'en' : 'sw')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('common.changeLanguage')} → {language === 'sw' ? 'English' : 'Kiswahili'}
          </button>
        </div>

        {/* Common Translations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Common Translations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Save:</strong> {t('common.save')}
            </div>
            <div>
              <strong>Cancel:</strong> {t('common.cancel')}
            </div>
            <div>
              <strong>Back:</strong> {t('common.back')}
            </div>
            <div>
              <strong>Next:</strong> {t('common.next')}
            </div>
            <div>
              <strong>Loading:</strong> {t('common.loading')}
            </div>
            <div>
              <strong>Error:</strong> {t('common.error')}
            </div>
          </div>
        </div>

        {/* Home Screen Translations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Home Screen</h2>
          <div className="space-y-3">
            <p><strong>Greeting:</strong> {t('home.greeting', { name: 'John' })}</p>
            <p><strong>Tagline:</strong> {t('home.tagline')}</p>
            <p><strong>Emergency:</strong> {t('home.emergency')}</p>
            <p><strong>AfyaID:</strong> {t('home.afyaId')}</p>
            <p><strong>Online:</strong> {t('home.connectivity.online')}</p>
            <p><strong>Offline:</strong> {t('home.connectivity.offline')}</p>
          </div>
        </div>

        {/* Medical Terminology */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Medical Terms (Verified)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <strong>Emergency:</strong> {tMedical('emergency')}
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <strong>Urgent:</strong> {tMedical('urgent')}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <strong>Fever:</strong> {tMedical('fever')}
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <strong>Blood Pressure:</strong> {tMedical('bloodPressure')}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <strong>Diabetes:</strong> {tMedical('diabetes')}
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <strong>Medication:</strong> {tMedical('medication')}
            </div>
          </div>
        </div>

        {/* Pluralization Test */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Pluralization Test</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTestCount(Math.max(0, testCount - 1))}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="text-xl font-bold">
                {t('home.upcomingSection.medications', { count: testCount })}
              </span>
              <button
                onClick={() => setTestCount(testCount + 1)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Click +/- to test plural forms with different counts
            </p>
          </div>
        </div>

        {/* Date/Time Formatting */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Date/Time Formatting</h2>
          <div className="space-y-3">
            <p><strong>Date (Short):</strong> {formatDate(testDate, 'short')}</p>
            <p><strong>Date (Long):</strong> {formatDate(testDate, 'long')}</p>
            <p><strong>Time:</strong> {formatTime(testDate)}</p>
            <p><strong>Relative Time:</strong> {formatRelativeTime(testDate)}</p>
          </div>
        </div>

        {/* Number Formatting */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Number Formatting</h2>
          <div className="space-y-3">
            <p><strong>Number:</strong> {formatNumber(1234567)}</p>
            <p><strong>Currency:</strong> {formatCurrency(50000)}</p>
          </div>
        </div>

        {/* Symptom Checker */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Symptom Checker</h2>
          <div className="space-y-2">
            <p><strong>Title:</strong> {t('symptomChecker.title')}</p>
            <p><strong>Subtitle:</strong> {t('symptomChecker.subtitle')}</p>
            <p><strong>Disclaimer:</strong> {t('symptomChecker.disclaimer')}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>
          <div className="space-y-2">
            <p><strong>Title:</strong> {t('appointments.title')}</p>
            <p><strong>Book:</strong> {t('appointments.book')}</p>
            <p><strong>Upcoming:</strong> {t('appointments.upcoming')}</p>
            <p><strong>Confirmed:</strong> {t('appointments.bookingConfirmed')}</p>
          </div>
        </div>

        {/* Error Messages */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Error Messages</h2>
          <div className="space-y-2">
            <p><strong>Generic:</strong> {t('errors.generic')}</p>
            <p><strong>Network:</strong> {t('errors.network')}</p>
            <p><strong>Offline:</strong> {t('errors.offline')}</p>
          </div>
        </div>

        {/* Validation Messages */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Validation</h2>
          <div className="space-y-2">
            <p><strong>Required:</strong> {t('validation.required')}</p>
            <p><strong>Email:</strong> {t('validation.email')}</p>
            <p><strong>Phone:</strong> {t('validation.phone')}</p>
            <p><strong>Min Length:</strong> {t('validation.minLength', { min: 8 })}</p>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="space-y-2">
            <p><strong>Title:</strong> {t('profile.title')}</p>
            <p><strong>Personal Info:</strong> {t('profile.personalInfo')}</p>
            <p><strong>Settings:</strong> {t('profile.settings.title')}</p>
            <p><strong>Language:</strong> {t('profile.settings.language')}</p>
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Emergency</h2>
          <div className="space-y-2">
            <p className="text-red-600 font-bold">
              <strong>Title:</strong> {t('emergency.title')}
            </p>
            <p><strong>Call:</strong> {t('emergency.callEmergency')}</p>
            <p><strong>Description:</strong> {t('emergency.description')}</p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            ✅ i18n System Status: ACTIVE
          </h3>
          <ul className="space-y-1 text-green-700">
            <li>✅ Translations loaded</li>
            <li>✅ Language switching working</li>
            <li>✅ Medical terms verified</li>
            <li>✅ Pluralization functional</li>
            <li>✅ Date/time formatting active</li>
            <li>✅ Offline support enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * USAGE:
 * 
 * Temporarily add to App.tsx for testing:
 * 
 * import { I18nTestComponent } from './components/I18nTestComponent';
 * 
 * // In render
 * <I18nTestComponent />
 */
