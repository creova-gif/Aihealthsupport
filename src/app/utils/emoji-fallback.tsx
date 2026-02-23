/**
 * Emoji Fallback Utility
 * Provides icon fallbacks for emojis that may not render on all devices
 * Especially important for older Android devices and feature phones
 */

import React from 'react';
import {
  Scale,
  Utensils,
  Activity,
  Droplets,
  Heart,
  Thermometer,
  Pill,
  Stethoscope,
  Baby,
  AlertCircle,
} from 'lucide-react';

// Emoji to Icon mapping
const emojiToIconMap: Record<string, React.ElementType> = {
  '⚖️': Scale,
  '🍽️': Utensils,
  '🏃': Activity,
  '💧': Droplets,
  '❤️': Heart,
  '🩺': Stethoscope,
  '🤒': Thermometer,
  '💊': Pill,
  '👶': Baby,
  '🤰': Baby,
  '⚠️': AlertCircle,
};

interface EmojiWithFallbackProps {
  emoji: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function EmojiWithFallback({
  emoji,
  label,
  size = 'md',
  className = '',
}: EmojiWithFallbackProps) {
  const IconComponent = emojiToIconMap[emoji];

  // Size mapping
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const fontSize = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  // Try to render emoji, fallback to icon if available
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {/* Emoji (will fail gracefully on unsupported devices) */}
      <span
        className={`${fontSize[size]} emoji-fallback`}
        role="img"
        aria-label={label || emoji}
      >
        {emoji}
      </span>

      {/* Icon fallback (hidden by default, shows via CSS if emoji fails) */}
      {IconComponent && (
        <span className={`icon-fallback hidden ${sizeClasses[size]}`}>
          <IconComponent className={sizeClasses[size]} />
        </span>
      )}
    </span>
  );
}

/**
 * Detects if emoji rendering is supported
 * Returns true if emojis render properly on this device
 */
export function supportsEmoji(): boolean {
  if (typeof window === 'undefined') return true;

  const canvas = document.createElement('canvas');
  if (!canvas.getContext) return false;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const smile = String.fromCodePoint(0x1f603); // 😃
  ctx.fillText(smile, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data.some((value) => value !== 0);
}

/**
 * CSS to add to your global styles:
 * 
 * @supports not (font: -apple-system-body) {
 *   .emoji-fallback {
 *     display: none;
 *   }
 *   .icon-fallback {
 *     display: inline-flex !important;
 *   }
 * }
 */
