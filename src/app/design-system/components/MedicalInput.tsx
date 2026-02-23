/**
 * MedicalInput - Government-Grade Input Component
 * 
 * DESIGN SYSTEM COMPLIANCE:
 * ✅ 8pt spacing system
 * ✅ 8px label-to-input spacing
 * ✅ Inline error messages (no shake animation)
 * ✅ High contrast borders
 * ✅ 44px minimum height
 * ✅ Clear visual states
 * 
 * COMPARED TO: NHS App forms, Mayo Clinic patient portal
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { colors, spacing } from '../tokens';

interface MedicalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * INPUT SPECIFICATIONS:
 * 
 * Height: 44px (minimum touch target)
 * Padding: 12px horizontal (8pt system)
 * Label spacing: 8px below label
 * Error spacing: 4px below input
 * Border: 1px solid, high contrast
 */

export function MedicalInput({
  label,
  error,
  helperText,
  required = false,
  icon,
  fullWidth = true,
  disabled,
  className = '',
  ...props
}: MedicalInputProps) {
  const hasError = !!error;

  const inputStyle: React.CSSProperties = {
    height: '44px', // Minimum touch target
    padding: icon ? '0 12px 0 40px' : '0 12px',
    fontSize: '16px', // Prevents zoom on iOS
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: colors.neutral[900],
    backgroundColor: disabled ? colors.neutral[100] : '#FFFFFF',
    border: `1px solid ${hasError ? colors.danger[500] : colors.neutral[300]}`,
    borderRadius: '8px',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 200ms ease',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: hasError ? colors.danger[700] : colors.neutral[700],
    marginBottom: spacing[2], // 8px
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const errorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1], // 4px
    marginTop: spacing[1], // 4px
    fontSize: '14px',
    color: colors.danger[700],
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const helperStyle: React.CSSProperties = {
    marginTop: spacing[1], // 4px
    fontSize: '14px',
    color: colors.neutral[600],
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div className={className} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.danger[500], marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: hasError ? colors.danger[500] : colors.neutral[500],
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </div>
        )}

        <input
          style={inputStyle}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? colors.danger[500] : colors.primary[500];
            e.currentTarget.style.boxShadow = hasError
              ? `0 0 0 3px ${colors.danger[100]}`
              : `0 0 0 3px ${colors.primary[100]}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? colors.danger[500] : colors.neutral[300];
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>

      {error && (
        <div id={`${props.id}-error`} style={errorStyle} role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {!error && helperText && (
        <div id={`${props.id}-helper`} style={helperStyle}>
          {helperText}
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * Basic input:
 * <MedicalInput
 *   label="Phone Number"
 *   placeholder="+255 XXX XXX XXX"
 *   required
 * />
 * 
 * With error:
 * <MedicalInput
 *   label="Email"
 *   error="Please enter a valid email address"
 * />
 * 
 * With icon:
 * <MedicalInput
 *   label="Search"
 *   icon={<Search size={20} />}
 *   placeholder="Search for clinics..."
 * />
 * 
 * With helper text:
 * <MedicalInput
 *   label="Password"
 *   type="password"
 *   helperText="Must be at least 8 characters"
 * />
 */
