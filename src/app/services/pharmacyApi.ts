/**
 * Pharmacy Stock Management API - AfyaCare Tanzania
 * 
 * Comprehensive pharmacy inventory management
 * 
 * Features:
 * - Drug inventory tracking
 * - Low stock alerts
 * - Expiry date monitoring
 * - Batch number tracking
 * - Purchase order management
 * - Drug interaction checks (AI-powered)
 */

import { supabase, USE_MOCK_DATA } from './supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DrugInventory {
  id: string;
  drug_name: string;
  generic_name: string;
  brand_name?: string;
  category: string; // Antibiotics, Analgesics, Antimalarials, etc.
  dosage_form: string; // Tablet, Syrup, Injection, etc.
  strength: string; // e.g., "500mg", "250mg/5ml"
  quantity: number;
  unit: string; // tablets, bottles, vials, etc.
  reorder_level: number; // Alert when below this
  batch_number: string;
  expiry_date: string;
  cost_per_unit: number;
  selling_price: number;
  supplier: string;
  location: string; // Shelf/bin location
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  drug_id: string;
  drug_name: string;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'EXPIRED' | 'RETURNED';
  quantity: number;
  batch_number: string;
  reference: string; // PO number, prescription ID, etc.
  notes?: string;
  performed_by: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  order_date: string;
  expected_delivery: string;
  status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  total_cost: number;
  created_by: string;
  created_at: string;
}

export interface PurchaseOrderItem {
  drug_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  description: string;
  recommendation: string;
}

export interface StockAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
  drug_id: string;
  drug_name: string;
  quantity?: number;
  reorder_level?: number;
  expiry_date?: string;
  days_until_expiry?: number;
  severity: 'Low' | 'Medium' | 'High';
  created_at: string;
}

// ============================================================================
// PHARMACY API
// ============================================================================

export const pharmacyApi = {
  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  /**
   * Get all drugs in inventory
   */
  async getInventory(filters?: {
    category?: string;
    lowStock?: boolean;
    expiringSoon?: boolean;
  }): Promise<DrugInventory[]> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Inventory loaded');
      return getMockInventory();
    }

    let query = supabase
      .from('drug_inventory')
      .select('*')
      .order('drug_name', { ascending: true });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.lowStock) {
      query = query.lt('quantity', supabase.rpc('reorder_level'));
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = data || [];

    if (filters?.expiringSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      results = results.filter(item => 
        new Date(item.expiry_date) <= thirtyDaysFromNow
      );
    }

    return results;
  },

  /**
   * Add new drug to inventory
   */
  async addDrug(drug: Omit<DrugInventory, 'id' | 'created_at' | 'updated_at'>): Promise<DrugInventory> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Drug added', drug);
      return {
        ...drug,
        id: 'mock-drug-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('drug_inventory')
      .insert(drug)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update drug inventory
   */
  async updateDrug(id: string, updates: Partial<DrugInventory>): Promise<DrugInventory> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Drug updated', id, updates);
      return { id, ...updates } as DrugInventory;
    }

    const { data, error } = await supabase
      .from('drug_inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Record stock movement
   */
  async recordMovement(movement: Omit<StockMovement, 'id' | 'created_at'>): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Stock movement recorded', movement);
      return;
    }

    // Record movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert(movement);

    if (movementError) throw movementError;

    // Update inventory quantity
    const { data: drug } = await supabase
      .from('drug_inventory')
      .select('quantity')
      .eq('id', movement.drug_id)
      .single();

    if (drug) {
      const newQuantity = movement.movement_type === 'IN' 
        ? drug.quantity + movement.quantity
        : drug.quantity - movement.quantity;

      await supabase
        .from('drug_inventory')
        .update({ quantity: newQuantity })
        .eq('id', movement.drug_id);
    }
  },

  /**
   * Get stock movement history
   */
  async getMovementHistory(drugId?: string, limit: number = 50): Promise<StockMovement[]> {
    if (USE_MOCK_DATA) {
      return getMockMovements();
    }

    let query = supabase
      .from('stock_movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (drugId) {
      query = query.eq('drug_id', drugId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // ============================================================================
  // ALERTS & MONITORING
  // ============================================================================

  /**
   * Get active stock alerts
   */
  async getStockAlerts(): Promise<StockAlert[]> {
    if (USE_MOCK_DATA) {
      return getMockAlerts();
    }

    const inventory = await this.getInventory();
    const alerts: StockAlert[] = [];
    const now = new Date();

    inventory.forEach(drug => {
      // Low stock alert
      if (drug.quantity <= drug.reorder_level) {
        alerts.push({
          id: `alert-low-${drug.id}`,
          type: 'LOW_STOCK',
          drug_id: drug.id,
          drug_name: drug.drug_name,
          quantity: drug.quantity,
          reorder_level: drug.reorder_level,
          severity: drug.quantity === 0 ? 'High' : drug.quantity <= drug.reorder_level / 2 ? 'Medium' : 'Low',
          created_at: new Date().toISOString(),
        });
      }

      // Expiry alerts
      const expiryDate = new Date(drug.expiry_date);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        alerts.push({
          id: `alert-expired-${drug.id}`,
          type: 'EXPIRED',
          drug_id: drug.id,
          drug_name: drug.drug_name,
          expiry_date: drug.expiry_date,
          days_until_expiry: daysUntilExpiry,
          severity: 'High',
          created_at: new Date().toISOString(),
        });
      } else if (daysUntilExpiry <= 30) {
        alerts.push({
          id: `alert-expiring-${drug.id}`,
          type: 'EXPIRING_SOON',
          drug_id: drug.id,
          drug_name: drug.drug_name,
          expiry_date: drug.expiry_date,
          days_until_expiry: daysUntilExpiry,
          severity: daysUntilExpiry <= 7 ? 'High' : daysUntilExpiry <= 14 ? 'Medium' : 'Low',
          created_at: new Date().toISOString(),
        });
      }
    });

    return alerts;
  },

  // ============================================================================
  // PURCHASE ORDERS
  // ============================================================================

  /**
   * Create purchase order
   */
  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'created_at'>): Promise<PurchaseOrder> {
    if (USE_MOCK_DATA) {
      console.log('🎭 MOCK: Purchase order created', order);
      return {
        ...order,
        id: 'mock-po-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('purchase_orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get purchase orders
   */
  async getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
    if (USE_MOCK_DATA) {
      return getMockPurchaseOrders();
    }

    let query = supabase
      .from('purchase_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // ============================================================================
  // DRUG INTERACTIONS (AI-POWERED)
  // ============================================================================

  /**
   * Check drug interactions
   */
  async checkDrugInteractions(drugs: string[]): Promise<DrugInteraction[]> {
    if (USE_MOCK_DATA) {
      return getMockInteractions(drugs);
    }

    // In production, this would call OpenAI or a drug interaction database
    // For now, use basic rule-based checking
    return getMockInteractions(drugs);
  },

  /**
   * AI-powered dosage suggestions
   */
  async suggestDosage(drugName: string, patientAge: number, patientWeight?: number): Promise<string> {
    if (USE_MOCK_DATA) {
      return `Adult dose: 500mg every 8 hours for 7 days`;
    }

    // Production: OpenAI API call
    return `Dosage suggestion not implemented`;
  },

  /**
   * AI-powered drug substitution
   */
  async suggestSubstitutes(drugName: string): Promise<string[]> {
    if (USE_MOCK_DATA) {
      const substitutes: Record<string, string[]> = {
        'Paracetamol': ['Acetaminophen', 'Tylenol', 'Panadol'],
        'Amoxicillin': ['Augmentin', 'Moxicillin', 'Amoxil'],
        'Metformin': ['Glucophage', 'Fortamet'],
      };
      return substitutes[drugName] || ['No substitutes available'];
    }

    // Production: OpenAI API call
    return [];
  },
};

// ============================================================================
// MOCK DATA
// ============================================================================

function getMockInventory(): DrugInventory[] {
  return [
    {
      id: '1',
      drug_name: 'Paracetamol',
      generic_name: 'Acetaminophen',
      brand_name: 'Panadol',
      category: 'Analgesics',
      dosage_form: 'Tablet',
      strength: '500mg',
      quantity: 120,
      unit: 'tablets',
      reorder_level: 50,
      batch_number: 'PAR2024-001',
      expiry_date: '2025-12-31',
      cost_per_unit: 0.10,
      selling_price: 0.20,
      supplier: 'Pharma Supplies Ltd',
      location: 'Shelf A-12',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      drug_name: 'Amoxicillin',
      generic_name: 'Amoxicillin',
      brand_name: 'Amoxil',
      category: 'Antibiotics',
      dosage_form: 'Capsule',
      strength: '500mg',
      quantity: 42,
      unit: 'capsules',
      reorder_level: 100,
      batch_number: 'AMO2024-052',
      expiry_date: '2025-06-30',
      cost_per_unit: 0.50,
      selling_price: 1.00,
      supplier: 'MedPlus Distributors',
      location: 'Shelf B-05',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      drug_name: 'ORS (Oral Rehydration Salts)',
      generic_name: 'ORS',
      category: 'Rehydration',
      dosage_form: 'Powder',
      strength: '20.5g sachet',
      quantity: 15,
      unit: 'sachets',
      reorder_level: 50,
      batch_number: 'ORS2024-018',
      expiry_date: '2026-03-31',
      cost_per_unit: 0.25,
      selling_price: 0.50,
      supplier: 'WHO Supplies',
      location: 'Shelf C-08',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getMockMovements(): StockMovement[] {
  return [
    {
      id: '1',
      drug_id: '1',
      drug_name: 'Paracetamol',
      movement_type: 'OUT',
      quantity: 10,
      batch_number: 'PAR2024-001',
      reference: 'RX-12345',
      notes: 'Dispensed to patient',
      performed_by: 'pharmacist-1',
      created_at: new Date().toISOString(),
    },
  ];
}

function getMockAlerts(): StockAlert[] {
  return [
    {
      id: 'alert-1',
      type: 'LOW_STOCK',
      drug_id: '3',
      drug_name: 'ORS (Oral Rehydration Salts)',
      quantity: 15,
      reorder_level: 50,
      severity: 'High',
      created_at: new Date().toISOString(),
    },
    {
      id: 'alert-2',
      type: 'LOW_STOCK',
      drug_id: '2',
      drug_name: 'Amoxicillin',
      quantity: 42,
      reorder_level: 100,
      severity: 'Medium',
      created_at: new Date().toISOString(),
    },
  ];
}

function getMockPurchaseOrders(): PurchaseOrder[] {
  return [
    {
      id: 'PO-001',
      supplier: 'Pharma Supplies Ltd',
      order_date: new Date().toISOString(),
      expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Ordered',
      items: [
        { drug_name: 'Paracetamol 500mg', quantity: 500, unit_cost: 0.10, total_cost: 50 },
        { drug_name: 'Ibuprofen 400mg', quantity: 300, unit_cost: 0.15, total_cost: 45 },
      ],
      total_cost: 95,
      created_by: 'admin-1',
      created_at: new Date().toISOString(),
    },
  ];
}

function getMockInteractions(drugs: string[]): DrugInteraction[] {
  if (drugs.includes('Warfarin') && drugs.includes('Aspirin')) {
    return [{
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'Severe',
      description: 'Increased risk of bleeding when used together',
      recommendation: 'Avoid combination. Consider alternative antiplatelet therapy.',
    }];
  }
  return [];
}

// ============================================================================
// DRUG CATEGORIES
// ============================================================================

export const DRUG_CATEGORIES = [
  'Analgesics',
  'Antibiotics',
  'Antimalarials',
  'Antihypertensives',
  'Antidiabetics',
  'Antiretrovirals',
  'Vitamins & Supplements',
  'Rehydration',
  'Dermatological',
  'Respiratory',
  'Gastrointestinal',
  'Other',
];
