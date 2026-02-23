/**
 * AuthService - JWT-Based Authentication System
 * 
 * SECURITY FEATURES:
 * - JWT token management with expiration
 * - Refresh token rotation
 * - Role-based access control (RBAC)
 * - Rate limiting protection
 * - Session management
 * - Brute force protection
 * 
 * PRODUCTION NOTES:
 * - This is a mock implementation for demo/pilot
 * - In production, replace with real backend API
 * - Never store sensitive credentials client-side
 * - Use HTTPS only for token transmission
 */

import { SecureStorage } from './SecureStorage';

export type UserRole = 'patient' | 'chw' | 'clinician' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  facilityId?: string;
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

interface LoginAttempt {
  phone: string;
  timestamp: number;
  failed: boolean;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_tokens';
  private static readonly USER_KEY = 'auth_user';
  private static readonly ATTEMPTS_KEY = 'login_attempts';
  private static readonly ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes
  private static readonly REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Login with phone number and password/PIN
   * In production: Send to backend API
   */
  static async login(
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      // Check brute force protection
      if (this.isAccountLocked(phone)) {
        return {
          success: false,
          error: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.',
        };
      }

      // Rate limiting check
      if (!this.checkRateLimit('login', phone)) {
        return {
          success: false,
          error: 'Too many login attempts. Please wait before trying again.',
        };
      }

      // In production: Send POST to /api/auth/login
      // For now: Mock authentication
      const result = await this.mockLogin(phone, password);

      if (result.success && result.user) {
        // Generate tokens
        const tokens = this.generateTokens(result.user);
        
        // Store securely
        SecureStorage.setItem(this.TOKEN_KEY, tokens);
        SecureStorage.setItem(this.USER_KEY, result.user);

        // Clear failed attempts
        this.clearLoginAttempts(phone);

        // Log authentication event
        this.logAuthEvent('login_success', result.user.id);

        return { success: true, user: result.user };
      } else {
        // Record failed attempt
        this.recordFailedAttempt(phone);
        
        this.logAuthEvent('login_failed', phone);

        return {
          success: false,
          error: result.error || 'Invalid phone number or password',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  /**
   * Mock login - Replace with real API in production
   */
  private static async mockLogin(
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user database
    const mockUsers: Record<string, { password: string; user: AuthUser }> = {
      '+255712345678': {
        password: '1234',
        user: {
          id: 'user_patient_001',
          name: 'Maria Ndovu',
          phone: '+255712345678',
          role: 'patient',
          permissions: ['view_own_records', 'book_appointments', 'use_symptom_checker'],
        },
      },
      '+255787654321': {
        password: '5678',
        user: {
          id: 'user_chw_001',
          name: 'John Mwamba',
          phone: '+255787654321',
          role: 'chw',
          facilityId: 'facility_tandale_001',
          permissions: [
            'view_own_records',
            'view_patient_records',
            'create_patient_records',
            'triage_patients',
          ],
        },
      },
      '+255756123456': {
        password: 'admin123',
        user: {
          id: 'user_admin_001',
          name: 'Dr. Sarah Kimaro',
          phone: '+255756123456',
          role: 'admin',
          facilityId: 'facility_mwananyamala_001',
          permissions: [
            'view_all_records',
            'manage_users',
            'view_analytics',
            'manage_facilities',
          ],
        },
      },
    };

    const userData = mockUsers[phone];

    if (!userData || userData.password !== password) {
      return { success: false, error: 'Invalid phone number or password' };
    }

    return { success: true, user: userData.user };
  }

  /**
   * Generate JWT tokens
   * In production: Backend generates and signs tokens
   */
  private static generateTokens(user: AuthUser): AuthTokens {
    const now = Date.now();

    // Mock JWT payload
    const accessPayload = {
      sub: user.id,
      role: user.role,
      permissions: user.permissions,
      iat: now,
      exp: now + this.ACCESS_TOKEN_LIFETIME,
    };

    const refreshPayload = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + this.REFRESH_TOKEN_LIFETIME,
    };

    // In production: Backend signs with secret key
    // For demo: Base64 encode (NOT SECURE - for demo only)
    const accessToken = `mock_access_${btoa(JSON.stringify(accessPayload))}`;
    const refreshToken = `mock_refresh_${btoa(JSON.stringify(refreshPayload))}`;

    return {
      accessToken,
      refreshToken,
      expiresAt: now + this.ACCESS_TOKEN_LIFETIME,
    };
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): AuthUser | null {
    const user = SecureStorage.getItem<AuthUser>(this.USER_KEY);
    
    if (!user) {
      return null;
    }

    // Check if session is still valid
    if (!this.isSessionValid()) {
      this.logout();
      return null;
    }

    return user;
  }

  /**
   * Get current access token
   */
  static getAccessToken(): string | null {
    const tokens = SecureStorage.getItem<AuthTokens>(this.TOKEN_KEY);
    
    if (!tokens) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      // Try to refresh
      this.refreshAccessToken();
      
      // Get new token
      const newTokens = SecureStorage.getItem<AuthTokens>(this.TOKEN_KEY);
      return newTokens?.accessToken || null;
    }

    return tokens.accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  private static async refreshAccessToken(): Promise<boolean> {
    try {
      const tokens = SecureStorage.getItem<AuthTokens>(this.TOKEN_KEY);
      const user = SecureStorage.getItem<AuthUser>(this.USER_KEY);

      if (!tokens || !user) {
        return false;
      }

      // In production: POST to /api/auth/refresh
      // For demo: Generate new tokens
      const newTokens = this.generateTokens(user);
      SecureStorage.setItem(this.TOKEN_KEY, newTokens);

      this.logAuthEvent('token_refreshed', user.id);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Check if current session is valid
   */
  static isSessionValid(): boolean {
    const tokens = SecureStorage.getItem<AuthTokens>(this.TOKEN_KEY);
    
    if (!tokens) {
      return false;
    }

    // Check if refresh token is expired
    // In production: Backend validates token signature
    return Date.now() < tokens.expiresAt + this.REFRESH_TOKEN_LIFETIME;
  }

  /**
   * Logout current user
   */
  static logout(): void {
    const user = this.getCurrentUser();
    
    if (user) {
      this.logAuthEvent('logout', user.id);
    }

    SecureStorage.removeItem(this.TOKEN_KEY);
    SecureStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    
    if (!user) {
      return false;
    }

    return user.permissions.includes(permission);
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Rate limiting check
   */
  private static checkRateLimit(action: string, identifier: string): boolean {
    const key = `rate_limit_${action}_${identifier}`;
    const now = Date.now();
    
    try {
      const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];
      
      // Remove attempts older than 1 minute
      const recentAttempts = attempts.filter(t => now - t < 60000);
      
      // Max 10 attempts per minute
      if (recentAttempts.length >= 10) {
        return false;
      }

      // Record this attempt
      recentAttempts.push(now);
      localStorage.setItem(key, JSON.stringify(recentAttempts));

      return true;
    } catch {
      return true; // Fail open on error
    }
  }

  /**
   * Brute force protection
   */
  private static recordFailedAttempt(phone: string): void {
    try {
      const attempts = JSON.parse(
        localStorage.getItem(this.ATTEMPTS_KEY) || '[]'
      ) as LoginAttempt[];

      attempts.push({
        phone,
        timestamp: Date.now(),
        failed: true,
      });

      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('Failed to record login attempt:', error);
    }
  }

  private static clearLoginAttempts(phone: string): void {
    try {
      const attempts = JSON.parse(
        localStorage.getItem(this.ATTEMPTS_KEY) || '[]'
      ) as LoginAttempt[];

      const filtered = attempts.filter(a => a.phone !== phone);
      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to clear login attempts:', error);
    }
  }

  private static isAccountLocked(phone: string): boolean {
    try {
      const attempts = JSON.parse(
        localStorage.getItem(this.ATTEMPTS_KEY) || '[]'
      ) as LoginAttempt[];

      const now = Date.now();

      // Get failed attempts in last 15 minutes
      const recentFailures = attempts.filter(
        a => a.phone === phone && 
             a.failed && 
             now - a.timestamp < this.LOCKOUT_DURATION
      );

      return recentFailures.length >= this.MAX_LOGIN_ATTEMPTS;
    } catch {
      return false; // Fail open on error
    }
  }

  /**
   * Log authentication events for audit
   */
  private static logAuthEvent(event: string, userId: string): void {
    try {
      const log = JSON.parse(localStorage.getItem('auth_audit_log') || '[]');
      
      log.push({
        event,
        userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });

      // Keep last 100 events
      const recentLog = log.slice(-100);
      localStorage.setItem('auth_audit_log', JSON.stringify(recentLog));
    } catch (error) {
      console.error('Failed to log auth event:', error);
    }
  }

  /**
   * Get authentication audit log
   */
  static getAuthAuditLog(): Array<{
    event: string;
    userId: string;
    timestamp: string;
  }> {
    try {
      return JSON.parse(localStorage.getItem('auth_audit_log') || '[]');
    } catch {
      return [];
    }
  }
}
