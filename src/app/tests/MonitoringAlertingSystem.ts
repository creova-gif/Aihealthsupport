/**
 * MONITORING & ALERTING SYSTEM
 * AfyaCare Tanzania
 * 
 * Real-time monitoring and alerting for:
 * - Test failures
 * - Performance degradation
 * - Security incidents
 * - Data integrity issues
 * - System health
 * - Deployment status
 * 
 * Integrations:
 * - Email notifications
 * - Slack alerts
 * - SMS (for critical issues)
 * - Webhook endpoints
 * - MoH dashboard
 */

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'test' | 'security' | 'performance' | 'integrity' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  acknowledged: boolean;
  resolved: boolean;
}

export interface HealthMetric {
  name: string;
  value: number | string;
  threshold?: number;
  status: 'healthy' | 'warning' | 'critical';
  timestamp: Date;
}

export class MonitoringSystem {
  private alerts: Alert[] = [];
  private metrics: Map<string, HealthMetric> = new Map();
  private notificationChannels: NotificationChannel[] = [];

  constructor() {
    this.initializeChannels();
    this.startHealthChecks();
  }

  /**
   * INITIALIZE NOTIFICATION CHANNELS
   */
  private initializeChannels() {
    this.notificationChannels = [
      new SlackNotifier(process.env.SLACK_WEBHOOK_URL || ''),
      new EmailNotifier(process.env.EMAIL_CONFIG || ''),
      new SMSNotifier(process.env.SMS_CONFIG || ''),
      new WebhookNotifier(process.env.WEBHOOK_URL || '')
    ];
  }

  /**
   * START HEALTH CHECKS
   */
  private startHealthChecks() {
    // Check every 60 seconds
    setInterval(() => {
      this.checkSystemHealth();
      this.checkTestResults();
      this.checkPerformance();
      this.checkDataIntegrity();
      this.checkSecurity();
    }, 60000);
  }

  /**
   * CREATE ALERT
   */
  async createAlert(
    severity: Alert['severity'],
    category: Alert['category'],
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity,
      category,
      title,
      message,
      timestamp: new Date(),
      metadata,
      acknowledged: false,
      resolved: false
    };

    this.alerts.push(alert);

    // Send notifications based on severity
    await this.sendNotifications(alert);

    // Log to monitoring system
    this.logAlert(alert);

    return alert;
  }

  /**
   * SEND NOTIFICATIONS
   */
  private async sendNotifications(alert: Alert) {
    const channels = this.getChannelsForSeverity(alert.severity);

    const notifications = channels.map(channel => 
      channel.send(alert).catch(error => {
        console.error(`Failed to send notification via ${channel.name}:`, error);
      })
    );

    await Promise.allSettled(notifications);
  }

  /**
   * GET NOTIFICATION CHANNELS BASED ON SEVERITY
   */
  private getChannelsForSeverity(severity: Alert['severity']): NotificationChannel[] {
    switch (severity) {
      case 'critical':
        // Critical: All channels including SMS
        return this.notificationChannels;
      
      case 'high':
        // High: Slack, Email, Webhook
        return this.notificationChannels.filter(c => 
          c.name === 'slack' || c.name === 'email' || c.name === 'webhook'
        );
      
      case 'medium':
        // Medium: Slack, Webhook
        return this.notificationChannels.filter(c => 
          c.name === 'slack' || c.name === 'webhook'
        );
      
      case 'low':
        // Low: Webhook only (for logging)
        return this.notificationChannels.filter(c => c.name === 'webhook');
      
      default:
        return [];
    }
  }

  /**
   * CHECK SYSTEM HEALTH
   */
  private async checkSystemHealth() {
    // Database connection
    const dbHealth = await this.checkDatabaseHealth();
    this.recordMetric('database_connection', dbHealth.connected ? 'healthy' : 'critical', dbHealth);

    // API response time
    const apiHealth = await this.checkAPIHealth();
    this.recordMetric('api_response_time', apiHealth.status, apiHealth);

    // Memory usage
    const memoryHealth = this.checkMemoryUsage();
    this.recordMetric('memory_usage', memoryHealth.status, memoryHealth);

    // Disk space
    const diskHealth = await this.checkDiskSpace();
    this.recordMetric('disk_space', diskHealth.status, diskHealth);
  }

  /**
   * CHECK TEST RESULTS
   */
  private async checkTestResults() {
    const latestRun = await this.getLatestTestRun();

    if (!latestRun) return;

    // Alert on test failures
    if (latestRun.failed > 0) {
      await this.createAlert(
        'high',
        'test',
        `${latestRun.failed} Test(s) Failed`,
        `Test suite "${latestRun.suite}" has ${latestRun.failed} failing test(s). ` +
        `Pass rate: ${((latestRun.passed / latestRun.total) * 100).toFixed(1)}%`,
        { suite: latestRun.suite, failed: latestRun.failed, details: latestRun.failureDetails }
      );
    }

    // Alert on coverage drop
    if (latestRun.coverage < 75) {
      await this.createAlert(
        'medium',
        'test',
        'Code Coverage Below Threshold',
        `Code coverage dropped to ${latestRun.coverage}% (threshold: 75%)`,
        { coverage: latestRun.coverage, threshold: 75 }
      );
    }
  }

  /**
   * CHECK PERFORMANCE
   */
  private async checkPerformance() {
    const metrics = await this.getPerformanceMetrics();

    // Response time degradation
    if (metrics.avgResponseTime > 500) {
      await this.createAlert(
        'medium',
        'performance',
        'Response Time Degradation',
        `Average API response time: ${metrics.avgResponseTime}ms (threshold: 500ms)`,
        metrics
      );
    }

    // High error rate
    if (metrics.errorRate > 0.01) {
      await this.createAlert(
        'high',
        'performance',
        'High Error Rate Detected',
        `Current error rate: ${(metrics.errorRate * 100).toFixed(2)}% (threshold: 1%)`,
        metrics
      );
    }

    // CPU usage
    if (metrics.cpuUsage > 85) {
      await this.createAlert(
        'high',
        'system',
        'High CPU Usage',
        `CPU usage: ${metrics.cpuUsage}% (threshold: 85%)`,
        metrics
      );
    }
  }

  /**
   * CHECK DATA INTEGRITY
   */
  private async checkDataIntegrity() {
    const issues = await this.runDataIntegrityChecks();

    if (issues.orphanRecords > 0) {
      await this.createAlert(
        'high',
        'integrity',
        'Orphan Records Detected',
        `Found ${issues.orphanRecords} orphan record(s) in database`,
        { count: issues.orphanRecords, types: issues.orphanTypes }
      );
    }

    if (issues.duplicateMPI > 0) {
      await this.createAlert(
        'critical',
        'integrity',
        'Duplicate MPI Records',
        `Found ${issues.duplicateMPI} duplicate patient record(s)`,
        { count: issues.duplicateMPI }
      );
    }

    if (issues.negativeInventory > 0) {
      await this.createAlert(
        'critical',
        'integrity',
        'Negative Inventory Detected',
        `Found ${issues.negativeInventory} medication(s) with negative stock`,
        { count: issues.negativeInventory, items: issues.negativeItems }
      );
    }
  }

  /**
   * CHECK SECURITY
   */
  private async checkSecurity() {
    const securityEvents = await this.getRecentSecurityEvents();

    // Brute force attempts
    const bruteForce = securityEvents.filter(e => e.type === 'brute_force');
    if (bruteForce.length > 10) {
      await this.createAlert(
        'critical',
        'security',
        'Brute Force Attack Detected',
        `${bruteForce.length} brute force attempts in last hour`,
        { attempts: bruteForce.length, targets: bruteForce.map(e => e.target) }
      );
    }

    // SQL injection attempts
    const sqlInjection = securityEvents.filter(e => e.type === 'sql_injection');
    if (sqlInjection.length > 0) {
      await this.createAlert(
        'critical',
        'security',
        'SQL Injection Attempt',
        `Blocked ${sqlInjection.length} SQL injection attempt(s)`,
        { attempts: sqlInjection }
      );
    }

    // Unauthorized access attempts
    const unauthorized = securityEvents.filter(e => e.type === 'unauthorized_access');
    if (unauthorized.length > 5) {
      await this.createAlert(
        'high',
        'security',
        'Multiple Unauthorized Access Attempts',
        `${unauthorized.length} unauthorized access attempts detected`,
        { attempts: unauthorized }
      );
    }
  }

  /**
   * RECORD METRIC
   */
  private recordMetric(name: string, status: HealthMetric['status'], data: any) {
    const metric: HealthMetric = {
      name,
      value: data.value || data,
      threshold: data.threshold,
      status,
      timestamp: new Date()
    };

    this.metrics.set(name, metric);
  }

  /**
   * GET ALERTS
   */
  getAlerts(filters?: {
    severity?: Alert['severity'];
    category?: Alert['category'];
    acknowledged?: boolean;
    resolved?: boolean;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (filters) {
      if (filters.severity) {
        filtered = filtered.filter(a => a.severity === filters.severity);
      }
      if (filters.category) {
        filtered = filtered.filter(a => a.category === filters.category);
      }
      if (filters.acknowledged !== undefined) {
        filtered = filtered.filter(a => a.acknowledged === filters.acknowledged);
      }
      if (filters.resolved !== undefined) {
        filtered = filtered.filter(a => a.resolved === filters.resolved);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * GET METRICS
   */
  getMetrics(): HealthMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * ACKNOWLEDGE ALERT
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.metadata = {
        ...alert.metadata,
        acknowledgedBy,
        acknowledgedAt: new Date()
      };
    }
  }

  /**
   * RESOLVE ALERT
   */
  resolveAlert(alertId: string, resolvedBy: string, resolution: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.metadata = {
        ...alert.metadata,
        resolvedBy,
        resolvedAt: new Date(),
        resolution
      };
    }
  }

  /**
   * HELPER METHODS (Mock implementations - replace with real checks)
   */
  private async checkDatabaseHealth() {
    return { connected: true, latency: 12 };
  }

  private async checkAPIHealth() {
    return { status: 'healthy' as const, responseTime: 284 };
  }

  private checkMemoryUsage() {
    const used = process.memoryUsage();
    const usagePercent = (used.heapUsed / used.heapTotal) * 100;
    return { 
      status: usagePercent > 85 ? 'critical' : usagePercent > 70 ? 'warning' : 'healthy' as const,
      value: usagePercent 
    };
  }

  private async checkDiskSpace() {
    return { status: 'healthy' as const, available: '120GB' };
  }

  private async getLatestTestRun() {
    return null; // Implement actual test result fetching
  }

  private async getPerformanceMetrics() {
    return {
      avgResponseTime: 284,
      errorRate: 0.005,
      cpuUsage: 45,
      memoryUsage: 62
    };
  }

  private async runDataIntegrityChecks() {
    return {
      orphanRecords: 0,
      orphanTypes: [],
      duplicateMPI: 0,
      negativeInventory: 0,
      negativeItems: []
    };
  }

  private async getRecentSecurityEvents() {
    return [];
  }

  private logAlert(alert: Alert) {
    console.log(`[${alert.severity.toUpperCase()}] ${alert.title}: ${alert.message}`);
  }
}

/**
 * NOTIFICATION CHANNELS
 */
interface NotificationChannel {
  name: string;
  send(alert: Alert): Promise<void>;
}

class SlackNotifier implements NotificationChannel {
  name = 'slack';

  constructor(private webhookUrl: string) {}

  async send(alert: Alert): Promise<void> {
    if (!this.webhookUrl) return;

    const color = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#3B82F6',
      low: '#6B7280'
    }[alert.severity];

    const emoji = {
      critical: '🚨',
      high: '⚠️',
      medium: 'ℹ️',
      low: '📝'
    }[alert.severity];

    const payload = {
      text: `${emoji} *${alert.title}*`,
      attachments: [{
        color,
        fields: [
          { title: 'Severity', value: alert.severity.toUpperCase(), short: true },
          { title: 'Category', value: alert.category, short: true },
          { title: 'Message', value: alert.message },
          { title: 'Time', value: alert.timestamp.toISOString() }
        ]
      }]
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }
}

class EmailNotifier implements NotificationChannel {
  name = 'email';

  constructor(private config: string) {}

  async send(alert: Alert): Promise<void> {
    // Implement email sending (e.g., using SendGrid, AWS SES)
    console.log(`Email notification: ${alert.title}`);
  }
}

class SMSNotifier implements NotificationChannel {
  name = 'sms';

  constructor(private config: string) {}

  async send(alert: Alert): Promise<void> {
    // Only send SMS for critical alerts
    if (alert.severity !== 'critical') return;

    // Implement SMS sending (e.g., using Twilio, Africa's Talking)
    console.log(`SMS notification: ${alert.title}`);
  }
}

class WebhookNotifier implements NotificationChannel {
  name = 'webhook';

  constructor(private webhookUrl: string) {}

  async send(alert: Alert): Promise<void> {
    if (!this.webhookUrl) return;

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Webhook notification failed:', error);
    }
  }
}

/**
 * SINGLETON INSTANCE
 */
export const monitoring = new MonitoringSystem();

/**
 * CONVENIENCE FUNCTIONS
 */
export async function alertCritical(category: Alert['category'], title: string, message: string, metadata?: any) {
  return monitoring.createAlert('critical', category, title, message, metadata);
}

export async function alertHigh(category: Alert['category'], title: string, message: string, metadata?: any) {
  return monitoring.createAlert('high', category, title, message, metadata);
}

export async function alertMedium(category: Alert['category'], title: string, message: string, metadata?: any) {
  return monitoring.createAlert('medium', category, title, message, metadata);
}

export async function alertLow(category: Alert['category'], title: string, message: string, metadata?: any) {
  return monitoring.createAlert('low', category, title, message, metadata);
}

/**
 * EXAMPLE USAGE
 */
export async function exampleUsage() {
  // Test failure alert
  await alertHigh(
    'test',
    'Regression Test Failed',
    'MPI duplicate detection test failed after code change',
    { suite: 'Regression Tests', test: 'MPI duplicate detection' }
  );

  // Security alert
  await alertCritical(
    'security',
    'SQL Injection Attempt Blocked',
    'Blocked SQL injection attempt from IP 123.456.789.0',
    { ip: '123.456.789.0', payload: "' OR '1'='1" }
  );

  // Performance alert
  await alertMedium(
    'performance',
    'API Response Time Degraded',
    'Average response time increased to 750ms',
    { avgResponseTime: 750, threshold: 500 }
  );

  // Data integrity alert
  await alertCritical(
    'integrity',
    'Duplicate MPI Records Detected',
    'Found 3 duplicate patient records requiring manual review',
    { count: 3, patientIds: ['pat-001', 'pat-002', 'pat-003'] }
  );
}
