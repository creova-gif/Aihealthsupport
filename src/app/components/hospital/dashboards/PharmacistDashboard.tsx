/**
 * PHARMACIST DASHBOARD
 * 
 * Pharmacy workflow management
 * 
 * Features:
 * - Pending prescriptions queue
 * - Dispensing workflow
 * - Inventory alerts (low stock, expiry)
 * - Drug interaction warnings
 * - Daily dispensing statistics
 */

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Pill,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingDown,
  Calendar,
  AlertCircle,
  Search
} from 'lucide-react';

interface PharmacistDashboardProps {
  facilityId: string;
}

export const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({ facilityId }) => {
  const [stats, setStats] = useState({
    pendingPrescriptions: 8,
    dispensedToday: 45,
    lowStockItems: 5,
    expiringThisMonth: 3
  });

  const [pendingRx, setPendingRx] = useState([
    {
      rxId: 'RX-001',
      patient: { name: 'John Mwangi', afya_id: 'AFY-012-2024' },
      doctor: 'Dr. Mwangi',
      medication: 'Artemether-Lumefantrine 80mg/480mg',
      quantity: '24 tablets',
      instructions: 'Take 4 tablets twice daily for 3 days',
      priority: 'routine',
      orderedAt: '15 min ago',
      interactions: false
    },
    {
      rxId: 'RX-002',
      patient: { name: 'Grace Mwakasege', afya_id: 'AFY-045-2024' },
      doctor: 'Dr. Hassan',
      medication: 'Methyldopa 250mg',
      quantity: '60 tablets',
      instructions: 'Take 2 tablets twice daily',
      priority: 'urgent',
      orderedAt: '5 min ago',
      interactions: true
    }
  ]);

  const [lowStock, setLowStock] = useState([
    { drug: 'Amoxicillin 500mg', current: 50, reorder: 200, unit: 'tablets' },
    { drug: 'Paracetamol 500mg', current: 120, reorder: 500, unit: 'tablets' },
    { drug: 'Metformin 500mg', current: 80, reorder: 300, unit: 'tablets' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F3D56] mb-2">
          Pharmacy Dashboard
        </h1>
        <p className="text-[#6B7280]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#FEF3E7] border-[#F4A261]">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#F4A261]" />
          </div>
          <div className="text-3xl font-bold text-[#F4A261] mb-1">
            {stats.pendingPrescriptions}
          </div>
          <div className="text-sm text-[#6B7280]">Pending Prescriptions</div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {stats.dispensedToday}
          </div>
          <div className="text-sm text-[#6B7280]">Dispensed Today</div>
        </Card>

        <Card className="p-6 bg-[#FEF3F2] border-[#C84B31]">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-5 w-5 text-[#C84B31]" />
          </div>
          <div className="text-3xl font-bold text-[#C84B31] mb-1">
            {stats.lowStockItems}
          </div>
          <div className="text-sm text-[#6B7280]">Low Stock Items</div>
        </Card>

        <Card className="p-6 bg-[#F0F9FF] border-[#0F3D56]/20">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-[#0F3D56]" />
          </div>
          <div className="text-3xl font-bold text-[#0F3D56] mb-1">
            {stats.expiringThisMonth}
          </div>
          <div className="text-sm text-[#6B7280]">Expiring This Month</div>
        </Card>
      </div>

      {/* Inventory Alerts */}
      {lowStock.length > 0 && (
        <Card className="p-4 bg-[#FEF3E7] border-[#F4A261]">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-[#F4A261] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-[#F4A261] mb-2">
                {lowStock.length} Medications Below Reorder Level
              </h3>
              <div className="space-y-2">
                {lowStock.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <div className="font-medium text-[#1E1E1E]">{item.drug}</div>
                      <div className="text-sm text-[#6B7280]">
                        Current: {item.current} {item.unit} • Reorder at: {item.reorder}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Order</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pending Prescriptions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#1E1E1E]">
                Pending Prescriptions ({pendingRx.length})
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              {pendingRx.map((rx) => (
                <div key={rx.rxId} className="p-4 border rounded-lg hover:border-[#0F3D56] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-[#1E1E1E] mb-1">
                        {rx.patient.name}
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        {rx.patient.afya_id} • Prescribed by {rx.doctor} • {rx.orderedAt}
                      </div>
                    </div>
                    {rx.priority === 'urgent' && (
                      <Badge className="bg-[#F4A261]">Urgent</Badge>
                    )}
                  </div>

                  {rx.interactions && (
                    <div className="mb-3 p-2 bg-[#FEF3F2] border border-[#C84B31] rounded flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#C84B31]" />
                      <span className="text-sm text-[#C84B31]">Drug interaction warning - Review required</span>
                    </div>
                  )}

                  <div className="p-3 bg-[#F9FAFB] rounded mb-3">
                    <div className="font-medium text-[#1E1E1E] mb-1">
                      {rx.medication}
                    </div>
                    <div className="text-sm text-[#6B7280] mb-2">
                      Quantity: {rx.quantity}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      <strong>Instructions:</strong> {rx.instructions}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Dispense
                    </Button>
                    <Button variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Package className="h-5 w-5" />
                Manage Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Search className="h-5 w-5" />
                Search Drug
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="h-5 w-5" />
                Expiry Report
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">
              Today's Performance
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Prescriptions Filled</span>
                <span className="font-medium">{stats.dispensedToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Avg. Processing Time</span>
                <span className="font-medium">8 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Patient Consultations</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
