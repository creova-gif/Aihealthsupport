/**
 * System States - Clean & Human
 * 
 * ERROR PRINCIPLES:
 * - Plain language
 * - Avoid technical terms
 * - Never mention systems, servers, or models
 * - Offer a next step
 * - No blame assigned to user
 * 
 * LOADING PRINCIPLES:
 * - Only show if delay >400ms
 * - Subtle, not excessive
 * - No "Thinking..." or "Analyzing..."
 * - Neutral language only
 */

import React, { useState, useEffect } from 'react';
import { InfoIcon, EmergencyIcon } from '../icons/MedicalIcons';

interface ErrorMessageProps {
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "We couldn't complete that right now. Please try again.",
  action,
  type = 'error',
}) => {
  const colors = {
    error: {
      bg: '#FEF2F2',
      border: '#FEE2E2',
      text: '#991B1B',
      icon: '#DC2626',
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FEF3C7',
      text: '#92400E',
      icon: '#F59E0B',
    },
    info: {
      bg: '#EFF6FF',
      border: '#DBEAFE',
      text: '#1E40AF',
      icon: '#3B82F6',
    },
  };

  const style = colors[type];

  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
      }}
      role="alert"
    >
      <InfoIcon size={20} color={style.icon} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm" style={{ color: style.text }}>
          {message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline"
            style={{ color: style.text }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  delay?: number; // Default 400ms
  inline?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading',
  delay = 400,
  inline = false,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show loading if delay exceeds threshold
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  if (inline) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <SimpleSpinner size={16} />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <SimpleSpinner size={32} />
      <p className="mt-4 text-sm text-gray-600">{message}</p>
    </div>
  );
};

// Simple medical-grade spinner (no excessive animation)
const SimpleSpinner: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
    style={{ animationDuration: '1s' }} // Slower, calmer
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#E5E7EB"
      strokeWidth="2"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="#0F3D56"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {icon && (
      <div className="mb-4 text-gray-400">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 max-w-sm mb-6">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-3 rounded-xl font-medium text-white"
        style={{ backgroundColor: '#0F3D56' }}
      >
        {action.label}
      </button>
    )}
  </div>
);

// Inline field error (for forms)
export const FieldError: React.FC<{ message: string }> = ({ message }) => (
  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
    <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
    {message}
  </p>
);

// Network connectivity banner
interface ConnectivityBannerProps {
  isOnline: boolean;
}

export const ConnectivityBanner: React.FC<ConnectivityBannerProps> = ({ isOnline }) => {
  const [show, setShow] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
    } else {
      // Hide after brief delay when coming back online
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm"
      style={{
        backgroundColor: isOnline ? '#10B981' : '#F59E0B',
        color: '#FFFFFF',
      }}
    >
      {isOnline
        ? 'Connection restored'
        : 'You\'re offline. Your information is safe and will update automatically.'}
    </div>
  );
};

// Success confirmation (brief, non-intrusive)
interface SuccessBannerProps {
  message: string;
  onDismiss?: () => void;
  duration?: number; // Auto-dismiss after ms
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({
  message,
  onDismiss,
  duration = 3000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!show) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-white"
      style={{ backgroundColor: '#10B981' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
        <path
          d="M9 12L11 14L15 10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Standard error messages (neutral, actionable)
export const ERROR_MESSAGES = {
  network: "We couldn't complete that right now. Please check your connection and try again.",
  timeout: "This is taking longer than expected. Please try again.",
  unknown: "Something went wrong. Please try again.",
  permission: "We need permission to access this. Please check your settings.",
  notFound: "We couldn't find that information. Please try again or contact support.",
  validation: "Please check your information and try again.",
  server: "We're having trouble processing that. Please try again in a moment.",
};
