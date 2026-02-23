/**
 * ADMIN DASHBOARD
 * 
 * Facility management & system administration
 * 
 * Features:
 * - Facility analytics
 * - Staff management
 * - System settings
 * - Audit log access
 * - Performance metrics
 * - User permissions
 * - Data exports
 * - System health monitoring
 */

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Settings,
  Users,
  BarChart3,
  Shield,
  Building,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Server,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

interface AdminDashboardProps {
  facilityId: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ facilityId }) => {
  const [stats, setStats] = useState({
    totalStaff: 45,
    activeUsers: 38,
    patientsToday: 156,
    systemUptime: 99.8,
    dataCompleteness: 94.5,
    avgResponseTime: 245
  });

  const [staffByRole, setStaffByRole] = useState([
    { role: 'Doctors', count: 12, active: 10 },
    { role: 'Nurses', count: 18, active: 16 },
    { role: 'Pharmacists', count: 4, active: 4 },
    { role: 'Lab Techs', count: 5, active: 4 },
    { role: 'Receptionists', count: 6, active: 4 }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: 'New user added', user: 'Admin', time: '5 min ago' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago' },
    { action: 'Audit log exported', user: 'Admin', time: '2 hours ago' }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    api: 'healthy',
    sync: 'healthy',
    storage: 'warning'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
            Facility Administration
          </h1>
          <p className="text-[#6B7280]">
            Muhimbili National Hospital • System Overview
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Audit Logs
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Database className="h-5 w-5 text-green-600" />
            <Badge className="bg-green-600">Online</Badge>
          </div>
          <div className="text-sm font-medium text-[#1E1E1E]">Database</div>
          <div className="text-xs text-[#6B7280]">Healthy • 234ms avg query</div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Server className="h-5 w-5 text-green-600" />
            <Badge className="bg-green-600">Online</Badge>
          </div>
          <div className="text-sm font-medium text-[#1E1E1E]">API Server</div>
          <div className="text-xs text-[#6B7280]">99.8% uptime</div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="h-5 w-5 text-green-600" />
            <Badge className="bg-green-600">Synced</Badge>
          </div>
          <div className="text-sm font-medium text-[#1E1E1E]">Sync Status</div>
          <div className="text-xs text-[#6B7280]">Last sync: 2 min ago</div>
        </Card>

        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-[#F4A261]" />
            <Badge className="bg-[#F4A261]">Warning</Badge>
          </div>
          <div className="text-sm font-medium text-[#1E1E1E]">Storage</div>
          <div className="text-xs text-[#6B7280]">78% used • 220GB free</div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-[#0F3D56]" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {stats.totalStaff}
          </div>
          <div className="text-sm text-[#6B7280]">Total Staff</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.activeUsers} active today
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-[#2A9D8F]" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-[#2A9D8F] mb-1">
            {stats.patientsToday}
          </div>
          <div className="text-sm text-[#6B7280]">Patients Today</div>
          <div className="text-xs text-green-600 mt-1">
            +12% vs yesterday
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-[#E9C46A]" />
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-[#E9C46A] mb-1">
            {stats.dataCompleteness}%
          </div>
          <div className="text-sm text-[#6B7280]">Data Completeness</div>
          <div className="text-xs text-green-600 mt-1">
            Above 90% target
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Staff Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-6">
              Staff by Role
            </h2>

            <div className="space-y-4">
              {staffByRole.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#1E1E1E]">{item.role}</span>
                      <div className="flex gap-2 text-sm">
                        <Badge variant="outline">{item.count} total</Badge>
                        <Badge className="bg-green-600">{item.active} active</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-[#F9FAFB] rounded-full h-2">
                      <div
                        className="bg-[#0F3D56] h-2 rounded-full"
                        style={{ width: `${(item.active / item.count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4 gap-2">
              <Users className="h-4 w-4" />
              Manage Staff
            </Button>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-6">
              Facility Performance
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-2xl font-bold text-[#0F3D56] mb-1">42 min</div>
                <div className="text-sm text-[#6B7280]">Avg Wait Time</div>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-2xl font-bold text-[#2A9D8F] mb-1">87%</div>
                <div className="text-sm text-[#6B7280]">Patient Satisfaction</div>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-2xl font-bold text-[#E9C46A] mb-1">18 min</div>
                <div className="text-sm text-[#6B7280]">Avg Consultation</div>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">96%</div>
                <div className="text-sm text-[#6B7280]">Documentation Rate</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Users className="h-5 w-5" />
                Add New Staff
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Shield className="h-5 w-5" />
                View Audit Logs
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <BarChart3 className="h-5 w-5" />
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Settings className="h-5 w-5" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Database className="h-5 w-5" />
                Backup Data
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-3 bg-[#F9FAFB] rounded-lg">
                  <div className="text-sm font-medium text-[#1E1E1E] mb-1">
                    {activity.action}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {activity.user} • {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#F4A261] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-[#F4A261] mb-2">
                  Action Required
                </h3>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Storage approaching limit</li>
                  <li>• 3 staff licenses expiring soon</li>
                  <li>• System backup due tomorrow</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
