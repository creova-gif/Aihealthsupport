import React, { useState } from 'react';
import { MapPin, Bell, Activity, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type PermissionType = 'location' | 'notifications' | 'health-data' | 'camera';

interface PermissionRequest {
  type: PermissionType;
  reason: string;
  benefit: string;
  required: boolean;
}

interface ProgressivePermissionsProps {
  language: 'sw' | 'en';
  permission: PermissionRequest;
  onAllow: () => void;
  onDeny: () => void;
  onDismiss: () => void;
}

const translations = {
  sw: {
    title: 'Ruhusa Inahitajika',
    why: 'Kwa nini?',
    allow: 'Ruhusu',
    deny: 'Hapana Sasa',
    notNow: 'Sio Sasa',
    permissions: {
      location: {
        title: 'Mahali Ulipo',
        icon: MapPin,
        reason: 'Tunakuomba ruhusa hii ili kukusaidia kupata vituo vya afya vilivyo karibu nawe.',
        benefit: 'Utaweza kuona madaktari na vituo vya afya vilivyo karibu.',
      },
      notifications: {
        title: 'Arifa',
        icon: Bell,
        reason: 'Tunakuomba ruhusa hii ili kukukumbusha dawa na miadi yako.',
        benefit: 'Utapokea ukumbusho wa dawa na miadi yako kwa wakati.',
      },
      'health-data': {
        title: 'Data ya Afya',
        icon: Activity,
        reason: 'Tunakuomba ruhusa hii ili kukupa ushauri wa afya unaokufaa.',
        benefit: 'AI itakupa ushauri unaokufaa kulingana na hali yako.',
      },
      camera: {
        title: 'Kamera',
        icon: Camera,
        reason: 'Tunakuomba ruhusa hii ili kupiga picha za hati au magonjwa ya ngozi.',
        benefit: 'Utaweza kushiriki picha kwa wataalamu wa afya.',
      },
    },
    privacy: 'Data yako inalindwa. Tunafuata PDPA Tanzania.',
  },
  en: {
    title: 'Permission Required',
    why: 'Why?',
    allow: 'Allow',
    deny: 'Not Now',
    notNow: 'Not Now',
    permissions: {
      location: {
        title: 'Location',
        icon: MapPin,
        reason: 'We need this permission to help you find nearby health facilities.',
        benefit: 'You can see nearby doctors and health centers.',
      },
      notifications: {
        title: 'Notifications',
        icon: Bell,
        reason: 'We need this permission to remind you about medications and appointments.',
        benefit: 'You will receive timely reminders for meds and appointments.',
      },
      'health-data': {
        title: 'Health Data',
        icon: Activity,
        reason: 'We need this permission to provide personalized health advice.',
        benefit: 'AI will provide advice tailored to your health condition.',
      },
      camera: {
        title: 'Camera',
        icon: Camera,
        reason: 'We need this permission to capture images of documents or skin conditions.',
        benefit: 'You can share images with healthcare providers.',
      },
    },
    privacy: 'Your data is protected. We follow Tanzania PDPA.',
  },
};

export function ProgressivePermissions({
  language,
  permission,
  onAllow,
  onDeny,
  onDismiss,
}: ProgressivePermissionsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[language];
  const permData = t.permissions[permission.type];
  const Icon = permData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button (only if not required) */}
          {!permission.required && (
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}

          {/* Header with icon */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
              <Icon className="h-10 w-10 text-[#1E88E5]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {permData.title}
            </h2>
            
            <p className="text-base text-gray-600">
              {t.title}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Main reason */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed text-base">
                    {permission.reason || permData.reason}
                  </p>
                </div>
              </div>

              {/* Benefit */}
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-green-900 leading-relaxed text-sm font-medium">
                    {permission.benefit || permData.benefit}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <div className="mb-6 text-center">
              <p className="text-xs text-gray-600">
                🔒 {t.privacy}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onAllow}
                className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                }}
              >
                {t.allow}
              </motion.button>

              {!permission.required && (
                <button
                  onClick={onDeny}
                  className="w-full py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {t.deny}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
