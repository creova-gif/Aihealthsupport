# 📱 Kliniki CHW Mobile App - Technical Specifications

**React Native Application for Community Health Workers**

---

## 🎯 OVERVIEW

The CHW Mobile App is the **most critical missing piece** of the Kliniki ecosystem. It enables Community Health Workers in rural areas to:

- Register patients offline
- Record vital signs
- Document symptoms
- Refer patients to clinics
- Track vaccinations
- Sync data when connectivity returns

---

## 🏗️ TECHNOLOGY STACK

### **Core Framework:**
- **React Native** 0.73+
- **Expo** (managed workflow for easier development)
- **TypeScript** for type safety

### **State Management:**
- **Zustand** (lightweight, simple)
- **AsyncStorage** for offline data

### **Backend:**
- **Supabase** (cloud sync)
- **Background fetch** for auto-sync

### **Offline-First:**
- **@react-native-async-storage/async-storage**
- **NetInfo** for connectivity detection
- **Queue system** for pending uploads

### **UI Components:**
- **React Native Paper** (Material Design)
- **Custom components** matching modern design

---

## 📱 SCREEN SPECIFICATIONS

### **1. Home Screen**

```tsx
// CHWHome.tsx
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Users, Activity, Syringe, Building } from 'lucide-react-native';

interface CHWHomeProps {
  chwName: string;
  village: string;
  syncStatus: 'online' | 'offline' | 'syncing';
  todaysTasks: Task[];
  recentPatients: Patient[];
}

// Layout:
// - Greeting card ("Good morning Amina")
// - Sync status indicator
// - 4 large action buttons (Register, Visit, Vaccination, Refer)
// - Today's tasks list
// - Recent patients list
```

**Features:**
- ✅ Personalized greeting
- ✅ Sync status (online/offline/syncing)
- ✅ 4 quick action buttons
- ✅ Today's tasks (pregnant mothers, vaccinations, chronic patients)
- ✅ Recent 5 patients visited

**UI Specs:**
- Card-based layout
- Large touch targets (minimum 56dp)
- Soft pastel colors
- Offline indicator (prominent red badge)

---

### **2. Register Patient Screen**

```tsx
// RegisterPatient.tsx

interface PatientRegistrationForm {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  village: string;
  photo?: string;  // Camera capture
}

// Layout:
// - Photo capture (camera)
// - Basic demographics
// - Contact info
// - Village/location
// - Save button (stores locally if offline)
```

**Features:**
- ✅ Camera integration for patient photo
- ✅ Date picker for DOB
- ✅ Phone number validation (Tanzanian format)
- ✅ Offline-first (saves to AsyncStorage)
- ✅ Auto-generates patient ID (CHW-001, CHW-002...)

**Offline Behavior:**
- Store in `AsyncStorage['pendingPatients']`
- Show "Pending sync" badge
- Upload when connectivity returns

---

### **3. Record Visit Screen**

```tsx
// RecordVisit.tsx

interface VisitRecord {
  patientId: string;
  visitDate: Date;
  chiefComplaint: string;
  symptoms: string[];
  vitals: {
    temperature?: number;
    weight?: number;
    bloodPressure?: string;
  };
  notes: string;
  photos?: string[];  // Injuries, rashes
}

// Layout:
// - Patient selection (search or recent)
// - Chief complaint (text input)
// - Quick symptom selector (fever, cough, vomiting, etc.)
// - Vital signs (temperature, weight, BP)
// - Photo capture (optional)
// - Additional notes
```

**Features:**
- ✅ Patient search (from local database)
- ✅ Quick symptom buttons
- ✅ Vital signs input (number pad optimized)
- ✅ Photo capture for visual documentation
- ✅ Offline storage

---

### **4. Vaccination Tracker**

```tsx
// VaccinationTracker.tsx

interface VaccinationRecord {
  patientId: string;
  vaccineName: string;
  doseNumber: number;
  dateGiven: Date;
  batchNumber?: string;
  nextDueDate?: Date;
}

// Layout:
// - Patient selection
// - Vaccine type dropdown (BCG, Polio, DPT, Measles, etc.)
// - Dose number
// - Date administered
// - Batch number (optional)
// - Next due date calculator
```

**Features:**
- ✅ Tanzania EPI schedule built-in
- ✅ Auto-calculates next due dates
- ✅ Batch number tracking
- ✅ Vaccination history timeline
- ✅ Reminder notifications

---

### **5. Refer to Clinic**

```tsx
// ReferToClinic.tsx

interface Referral {
  patientId: string;
  chwId: string;
  clinicId: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  reason: string;
  vitals?: VitalsRecord;
  notes: string;
  photos?: string[];
}

// Layout:
// - Patient selection
// - Urgency selector (Emergency/Urgent/Routine)
// - Reason for referral
// - Vitals (optional)
// - Clinic selection
// - Notes
// - Send referral button
```

**Features:**
- ✅ Urgency color coding (red, yellow, green)
- ✅ Clinic finder (nearest clinics)
- ✅ Attach vitals and photos
- ✅ SMS notification to clinic (if offline)
- ✅ Track referral status

---

### **6. Sync Screen**

```tsx
// SyncStatus.tsx

interface SyncQueue {
  pendingPatients: number;
  pendingVisits: number;
  pendingVaccinations: number;
  pendingReferrals: number;
  lastSyncTime: Date;
}

// Layout:
// - Sync status indicator
// - Pending items count
// - Last sync time
// - Manual sync button
// - Sync history log
```

**Features:**
- ✅ Auto-sync when WiFi detected
- ✅ Manual sync trigger
- ✅ Sync progress indicator
- ✅ Conflict resolution (server wins)
- ✅ Retry failed uploads

---

## 🔄 OFFLINE SYNC ARCHITECTURE

### **Data Flow:**

```
1. CHW performs action (register patient, record visit)
   ↓
2. Save to AsyncStorage immediately
   ↓
3. Add to sync queue
   ↓
4. Listen for network change (NetInfo)
   ↓
5. When online: Upload queued items
   ↓
6. Mark as synced, clear from queue
   ↓
7. Update local database with server IDs
```

### **Implementation:**

```typescript
// syncService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';

class SyncService {
  async queueItem(type: 'patient' | 'visit' | 'vaccination' | 'referral', data: any) {
    const queue = await AsyncStorage.getItem('syncQueue');
    const items = queue ? JSON.parse(queue) : [];
    
    items.push({
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending',
    });
    
    await AsyncStorage.setItem('syncQueue', JSON.stringify(items));
  }

  async syncAll() {
    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    
    if (!isConnected) {
      console.log('Offline - sync skipped');
      return;
    }
    
    const queue = await AsyncStorage.getItem('syncQueue');
    const items = queue ? JSON.parse(queue) : [];
    
    for (const item of items) {
      try {
        if (item.type === 'patient') {
          const { data } = await supabase.from('patients').insert(item.data);
          // Update local ID to server ID
          await this.updateLocalId(item.id, data.id);
        }
        
        // Mark as synced
        item.status = 'synced';
      } catch (error) {
        item.status = 'failed';
        item.error = error.message;
      }
    }
    
    // Remove synced items
    const remaining = items.filter(i => i.status !== 'synced');
    await AsyncStorage.setItem('syncQueue', JSON.stringify(remaining));
  }

  async startBackgroundSync() {
    // Listen for network changes
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.syncAll();
      }
    });
  }
}

export default new SyncService();
```

---

## 📊 DATA MODELS

### **Local Database Schema (AsyncStorage)**

```typescript
// AsyncStorage Keys:

// Current user
'chw_profile': {
  id: string;
  name: string;
  phone: string;
  village: string;
  region: string;
}

// Patients (synced from server + locally registered)
'patients': Array<{
  id: string;
  localId: string;  // CHW-001, CHW-002...
  serverId: string | null;  // After sync
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  village: string;
  photo: string;
  isSynced: boolean;
}>

// Visit records
'visits': Array<{
  id: string;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: {
    temperature?: number;
    weight?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
  };
  notes: string;
  photos: string[];
  isSynced: boolean;
}>

// Vaccinations
'vaccinations': Array<{
  id: string;
  patientId: string;
  vaccineName: string;
  doseNumber: number;
  dateGiven: string;
  batchNumber: string;
  nextDueDate: string;
  isSynced: boolean;
}>

// Referrals
'referrals': Array<{
  id: string;
  patientId: string;
  chwId: string;
  clinicId: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  reason: string;
  vitals?: object;
  notes: string;
  photos: string[];
  status: 'pending' | 'accepted' | 'completed';
  isSynced: boolean;
}>

// Sync queue
'syncQueue': Array<{
  id: string;
  type: 'patient' | 'visit' | 'vaccination' | 'referral';
  data: object;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
  error?: string;
}>
```

---

## 🎨 UI/UX DESIGN SYSTEM

### **Color Palette:**

```typescript
const COLORS = {
  // Primary
  mint: '#5ECFB1',
  mintLight: '#E8F8F4',
  
  // Accents
  sky: '#61B5E8',
  skyLight: '#E3F2FD',
  coral: '#FF8E72',
  coralLight: '#FFE8E3',
  purple: '#8B7FC8',
  purpleLight: '#F3F0FF',
  
  // Status
  success: '#5ECFB1',
  warning: '#FFB84D',
  error: '#FF6B6B',
  
  // Neutrals
  white: '#FFFFFF',
  gray100: '#F4F6F8',
  gray600: '#5C677D',
  gray900: '#1A202C',
};
```

### **Typography:**

```typescript
const FONTS = {
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.gray600,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray600,
  },
};
```

### **Components:**

```typescript
// ActionCard.tsx
<TouchableOpacity style={styles.actionCard}>
  <Icon size={32} color={COLORS.mint} />
  <Text style={styles.actionTitle}>Register Patient</Text>
  <Text style={styles.actionSubtitle}>New patient registration</Text>
</TouchableOpacity>

const styles = {
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray900,
    marginTop: 12,
  },
  actionSubtitle: {
    fontSize: 13,
    color: COLORS.gray600,
    marginTop: 4,
  },
};
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Week 1-2: Foundation**
- [ ] Set up React Native + Expo project
- [ ] Configure TypeScript
- [ ] Install dependencies (React Native Paper, Zustand, AsyncStorage, NetInfo)
- [ ] Create navigation structure (React Navigation)
- [ ] Design system implementation (colors, fonts, components)

### **Week 3-4: Core Screens**
- [ ] Home screen with greeting and actions
- [ ] Register Patient screen with camera
- [ ] Record Visit screen with vitals input
- [ ] Patient list and search

### **Week 5-6: Advanced Features**
- [ ] Vaccination tracker
- [ ] Referral system
- [ ] Photo capture and storage
- [ ] Form validation

### **Week 7-8: Offline Sync**
- [ ] AsyncStorage integration
- [ ] Sync queue implementation
- [ ] NetInfo listeners
- [ ] Background sync (React Native Background Fetch)
- [ ] Conflict resolution
- [ ] Retry logic

### **Week 9: Testing**
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] Offline mode testing
- [ ] Sync testing
- [ ] Rwanda pilot preparation

### **Week 10: Deployment**
- [ ] Build Android APK
- [ ] Build iOS IPA (if needed)
- [ ] Internal testing (10 CHWs)
- [ ] Bug fixes
- [ ] Final polish

---

## 📦 DEPENDENCIES

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    
    // Navigation
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    
    // State Management
    "zustand": "^4.4.7",
    
    // Offline Storage
    "@react-native-async-storage/async-storage": "^1.21.0",
    
    // Network Detection
    "@react-native-community/netinfo": "^11.1.0",
    
    // Backend
    "@supabase/supabase-js": "^2.39.0",
    
    // UI Components
    "react-native-paper": "^5.11.3",
    "lucide-react-native": "^0.292.0",
    
    // Camera
    "expo-camera": "~14.0.0",
    "expo-image-picker": "~14.5.0",
    
    // Background Sync
    "react-native-background-fetch": "^4.2.0",
    
    // Forms
    "react-hook-form": "^7.49.2",
    
    // Date Picker
    "@react-native-community/datetimepicker": "^7.6.1"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.3",
    "jest": "^29.7.0"
  }
}
```

---

## 🧪 TESTING STRATEGY

### **Unit Tests:**
```typescript
// __tests__/syncService.test.ts
describe('SyncService', () => {
  it('should queue items for sync', async () => {
    await syncService.queueItem('patient', mockPatient);
    const queue = await AsyncStorage.getItem('syncQueue');
    expect(JSON.parse(queue).length).toBe(1);
  });
  
  it('should sync when online', async () => {
    // Mock NetInfo as online
    // Mock Supabase insert
    await syncService.syncAll();
    // Verify queue is cleared
  });
});
```

### **Integration Tests:**
- Register patient → save to AsyncStorage → sync to server
- Record visit → attach to patient → sync
- Offline mode → queue actions → go online → auto-sync

### **Field Testing:**
- Deploy to 10 CHWs in Rwanda
- Collect feedback
- Monitor sync success rate
- Track offline usage patterns

---

## 📊 SUCCESS METRICS

### **Technical KPIs:**
- [ ] 99% offline functionality
- [ ] <5 sec sync time for 100 records
- [ ] 100% data integrity (no lost records)
- [ ] <50MB app size

### **User KPIs:**
- [ ] 500 CHWs trained
- [ ] 95% daily active usage
- [ ] 5,000 patients registered via CHW
- [ ] <1% error rate

---

## 🚨 CRITICAL CONSIDERATIONS

### **1. Offline-First is NON-NEGOTIABLE**

Rural areas have intermittent connectivity. The app MUST:
- ✅ Work 100% offline
- ✅ Queue all actions
- ✅ Auto-sync when connectivity returns
- ✅ Never lose data

### **2. Battery Optimization**

CHWs are in the field all day. The app MUST:
- ✅ Minimize background processing
- ✅ Use background fetch efficiently
- ✅ Avoid constant GPS polling
- ✅ Optimize image compression

### **3. Data Privacy**

Patient data is sensitive. The app MUST:
- ✅ Encrypt AsyncStorage
- ✅ Require PIN/biometric unlock
- ✅ Auto-logout after inactivity
- ✅ HTTPS for all sync

### **4. Low-End Device Support**

Many CHWs have budget Android phones. The app MUST:
- ✅ Support Android 8.0+
- ✅ Work on 2GB RAM devices
- ✅ Optimize image sizes
- ✅ Minimize dependencies

---

## 🎯 NEXT STEPS

### **Immediate (This Week):**
1. Create React Native project
2. Set up navigation
3. Implement design system
4. Build home screen prototype

### **Short-Term (Next 2 Weeks):**
5. Build core screens (Register, Visit)
6. Implement AsyncStorage
7. Add camera integration
8. Test offline functionality

### **Medium-Term (Next 4 Weeks):**
9. Implement sync service
10. Add vaccination tracker
11. Build referral system
12. End-to-end testing

### **Long-Term (Next 8 Weeks):**
13. Rwanda pilot (100 CHWs)
14. Collect feedback
15. Iterate and improve
16. National deployment

---

## 📞 DEVELOPMENT TEAM NEEDED

### **Roles:**
- **1 React Native Lead** ($5k/month × 3 months = $15k)
- **1 React Native Developer** ($4k/month × 3 months = $12k)
- **1 Backend Developer** (part-time, $2k/month × 3 months = $6k)
- **1 QA Tester** (part-time, $1.5k/month × 2 months = $3k)

**Total Cost:** $36k for MVP

**Timeline:** 10 weeks to production-ready

---

## ✅ DEFINITION OF DONE

The CHW Mobile App is DONE when:

- [ ] All 6 core screens implemented
- [ ] 100% offline functionality
- [ ] Sync service working reliably
- [ ] Tested with 100 CHWs in Rwanda
- [ ] <1% data loss rate
- [ ] 95% user satisfaction
- [ ] Deployed to Google Play Store
- [ ] Training materials complete

---

**🏥 THIS IS THE MOST CRITICAL COMPONENT FOR RWANDA DEPLOYMENT! 🇷🇼**

*Without the CHW app, we can't equip frontline health workers.*  
*With it, we can transform rural healthcare in East Africa.* ✨
