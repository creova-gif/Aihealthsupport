/**
 * Accessibility Settings Component
 * Allows users to customize accessibility preferences
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../utils/AccessibilitySystem';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { 
  Eye, 
  Type, 
  Contrast, 
  Hand, 
  Keyboard, 
  Volume2,
  RotateCcw,
  Check,
  ArrowLeft
} from 'lucide-react';

interface AccessibilitySettingsProps {
  onBack?: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onBack }) => {
  const { t } = useTranslation(['common', 'profile']);
  const { preferences, updatePreference, resetPreferences } = useAccessibility();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fontSizeOptions = [
    { value: 'small' as const, label: 'Small', size: '14px' },
    { value: 'medium' as const, label: 'Medium', size: '16px' },
    { value: 'large' as const, label: 'Large', size: '18px' },
    { value: 'extra-large' as const, label: 'Extra Large', size: '20px' }
  ];

  const handleReset = () => {
    resetPreferences();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#D1D5DB] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-[#6B7280]" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-medium text-[#1E1E1E]">
                Accessibility Settings
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Customize your experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Font Size */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Type className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-[#1E1E1E] mb-1">
                Text Size
              </h2>
              <p className="text-sm text-[#6B7280] mb-4">
                Adjust the size of text throughout the app
              </p>
              
              <div className="space-y-3">
                {fontSizeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    style={{
                      borderColor: preferences.fontSize === option.value ? '#0F3D56' : '#D1D5DB',
                      backgroundColor: preferences.fontSize === option.value ? '#F0F7FF' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      name="fontSize"
                      value={option.value}
                      checked={preferences.fontSize === option.value}
                      onChange={(e) => updatePreference('fontSize', e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div 
                        className="font-medium text-[#1E1E1E]"
                        style={{ fontSize: option.size }}
                      >
                        {option.label}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {option.size}
                      </div>
                    </div>
                    {preferences.fontSize === option.value && (
                      <Check className="h-5 w-5 text-[#0F3D56]" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* High Contrast Mode */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Contrast className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[#1E1E1E]">
                    High Contrast Mode
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Increase color contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                  aria-label="Toggle high contrast mode"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Reduced Motion */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Eye className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[#1E1E1E]">
                    Reduce Motion
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
                  aria-label="Toggle reduced motion"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Large Touch Targets */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Hand className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[#1E1E1E]">
                    Large Touch Targets
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Make buttons and links easier to tap
                  </p>
                </div>
                <Switch
                  checked={preferences.largeTouch}
                  onCheckedChange={(checked) => updatePreference('largeTouch', checked)}
                  aria-label="Toggle large touch targets"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Keyboard Navigation */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Keyboard className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[#1E1E1E]">
                    Enhanced Keyboard Navigation
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Show clear focus indicators
                  </p>
                </div>
                <Switch
                  checked={preferences.keyboardNavigation}
                  onCheckedChange={(checked) => updatePreference('keyboardNavigation', checked)}
                  aria-label="Toggle keyboard navigation"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Screen Reader Mode */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F3F4F6] rounded-lg">
              <Volume2 className="h-6 w-6 text-[#0F3D56]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium text-[#1E1E1E]">
                    Screen Reader Optimization
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Optimize experience for screen readers
                  </p>
                </div>
                <Switch
                  checked={preferences.screenReaderMode}
                  onCheckedChange={(checked) => updatePreference('screenReaderMode', checked)}
                  aria-label="Toggle screen reader mode"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Reset Button */}
        <Card className="p-6 bg-[#FEF3F2] border-[#FCA5A5]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-[#1E1E1E]">
                Reset to Default
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Restore all accessibility settings to default
              </p>
            </div>
            {showResetConfirm ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                >
                  Confirm Reset
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(true)}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-[#EFF6FF] border-[#93C5FD]">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-medium text-[#1E1E1E] mb-1">
                About Accessibility
              </h3>
              <p className="text-sm text-[#6B7280]">
                AfyaCare is committed to providing an accessible healthcare experience for all users. 
                These settings help customize the app to your needs. If you need additional support, 
                please contact our accessibility team.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
