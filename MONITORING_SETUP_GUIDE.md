# 📊 **MONITORING & ANALYTICS SETUP GUIDE**

**AfyaCare Tanzania - Production Monitoring**  
**Created:** February 23, 2026  
**Status:** ✅ Ready for Production Deployment

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [Privacy & Compliance](#privacy--compliance)
5. [Monitoring Dashboard](#monitoring-dashboard)
6. [Key Metrics](#key-metrics)
7. [Alerts & Notifications](#alerts--notifications)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 **OVERVIEW**

AfyaCare Tanzania includes comprehensive monitoring and analytics to track:

- ✅ **Error Tracking** (Sentry) - Real-time error detection and reporting
- ✅ **Usage Analytics** (Google Analytics 4) - Anonymized user behavior
- ✅ **Medical Metrics** (Custom) - Clinical outcomes and adherence
- ✅ **Performance Monitoring** - Load times and responsiveness
- ✅ **Safety Compliance** - Disclaimer acceptance tracking

**Privacy First:** All monitoring is **PDPA-compliant** with no PII logging.

---

## 🏗️ **ARCHITECTURE**

```
┌─────────────────┐
│   AfyaCare App  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──┐
│Sentry │ │ GA4 │  (Cloud Services)
└───────┘ └─────┘
    │         │
    └────┬────┘
         │
┌────────▼─────────┐
│ Admin Dashboard  │  (Local + Export)
└──────────────────┘
```

### **Components:**

1. **`/src/app/utils/monitoring.ts`** - Core monitoring utilities
2. **`/src/app/components/AdminMonitoringDashboard.tsx`** - Admin UI
3. **LocalStorage** - Offline metrics storage
4. **Sentry** (when deployed) - Error tracking
5. **Google Analytics** (when deployed) - Usage tracking

---

## 🚀 **SETUP INSTRUCTIONS**

### **Step 1: Install Dependencies**

```bash
# For Sentry error tracking
npm install @sentry/react

# Google Analytics is loaded via CDN (no install needed)
```

### **Step 2: Get API Keys**

#### **Sentry Setup:**

1. Go to [https://sentry.io](https://sentry.io)
2. Create a new project (React)
3. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)
4. Add to `.env`:

```bash
VITE_SENTRY_DSN=https://YOUR_SENTRY_DSN_HERE
```

#### **Google Analytics Setup:**

1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Create a new GA4 property
3. Get Measurement ID (looks like: `G-XXXXXXXXXX`)
4. Add to `.env`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **Step 3: Enable Monitoring**

In `/src/app/utils/monitoring.ts`, **uncomment** the initialization code:

**For Sentry (lines 44-76):**
```typescript
export function initSentry() {
  import * as Sentry from "@sentry/react";
  
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      // ... rest of config
    });
  }
}
```

**For Google Analytics (lines 117-137):**
```typescript
export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (import.meta.env.PROD && measurementId) {
    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    // ... rest of config
  }
}
```

### **Step 4: Deploy**

```bash
npm run build
# Deploy to your hosting (Vercel, Netlify, etc.)
```

Monitoring will **only activate in production** (not in development).

---

## 🔒 **PRIVACY & COMPLIANCE**

### **Tanzania PDPA Compliance:**

✅ **No PII Logged**
- Phone numbers → `[PHONE_REDACTED]`
- Emails → `[EMAIL_REDACTED]`
- Names → `[NAME_REDACTED]`
- IP addresses → Anonymized

✅ **User Consent**
- Disclaimer acceptance tracked
- No data sent without consent
- Users can opt out anytime

✅ **Data Minimization**
- Only essential metrics collected
- Medical data aggregated (not individual)
- LocalStorage used for offline (not server)

### **WHO Ethical AI Principles:**

✅ **Transparency** - Users know what's tracked
✅ **Accountability** - Audit trails maintained
✅ **Safety** - Error monitoring prevents harm
✅ **Privacy** - PII sanitization enforced

### **TMDA SaMD Compliance:**

✅ **Adverse Event Reporting** - Errors logged for analysis
✅ **Post-Market Surveillance** - Usage patterns tracked
✅ **Quality Management** - Performance monitoring

---

## 📊 **MONITORING DASHBOARD**

### **Accessing the Dashboard:**

1. Log in as **Admin** role
2. Navigate to **MoH Dashboard**
3. Click **"View Monitoring"** (future feature)
4. Or access directly via `/admin/monitoring` route

### **Dashboard Features:**

#### **1. Overview Tab**
- Total users (page views)
- Active users (last 24 hours)
- Error count
- Average response time

#### **2. Feature Usage Tab**
- Symptom checks
- Appointments booked
- Medication tracker usage
- Facility searches
- CHW routes optimized

#### **3. Medical Metrics Tab**
- Average medication adherence rate
- High-risk patient flags
- Disclaimer acceptance rate
- Symptom checker outcomes

#### **4. Performance Tab**
- Load times (dashboard, features)
- Offline usage percentage
- API response times

#### **5. Safety Compliance Tab**
- Disclaimer acceptances by tool
- Error logs (sanitized)
- Security events

### **Exporting Data:**

Click **"Export Data"** to download:
- Format: JSON
- Filename: `afyacare-metrics-YYYY-MM-DD.json`
- Use for: Analysis, IRB reports, publications

### **Clearing Data:**

Click **"Clear History"** → Confirm → All local metrics deleted
- Use for: Testing, privacy requests
- Warning: Cannot be undone

---

## 📈 **KEY METRICS**

### **Clinical Metrics** (for IRB & Publications)

| Metric | Description | Target |
|--------|-------------|--------|
| **Medication Adherence Rate** | % of doses taken on time | >80% |
| **Symptom Checker Usage** | Daily symptom checks | Track trend |
| **High-Risk Flags** | Patients flagged by AI | Monitor closely |
| **Appointment Completion** | % of booked appointments kept | >70% |
| **CHW Visit Efficiency** | Patients visited per day | Track improvement |

### **Technical Metrics** (for Operations)

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Error Rate** | Errors per 100 page views | >5% |
| **Avg Load Time** | Time to interactive | >3 seconds |
| **Offline Usage** | % of sessions offline | Track for connectivity |
| **Crash Rate** | % of sessions with crash | >1% |

### **Adoption Metrics** (for Pilot Evaluation)

| Metric | Description | Success Criteria |
|--------|-------------|------------------|
| **Daily Active Users** | Unique users per day | Growing trend |
| **Feature Adoption** | % using each feature | >50% try each |
| **Session Duration** | Avg time in app | >5 minutes |
| **Return Rate** | % returning after 7 days | >60% |

---

## 🚨 **ALERTS & NOTIFICATIONS**

### **Sentry Alerts (Recommended Setup):**

1. **Critical Errors:**
   - Trigger: Any error in production
   - Notify: Dev team via Slack/Email
   - Response: <2 hours

2. **High Error Rate:**
   - Trigger: >10 errors/hour
   - Notify: Dev + Ops team
   - Response: <4 hours

3. **Performance Degradation:**
   - Trigger: Avg load time >5s
   - Notify: Ops team
   - Response: <24 hours

### **Google Analytics Alerts:**

1. **Usage Drop:**
   - Trigger: <50% of avg daily users
   - Notify: Product team
   - Action: Investigate outage/connectivity

2. **Feature Abandonment:**
   - Trigger: >50% drop in feature usage
   - Notify: UX team
   - Action: User research

### **Custom Medical Alerts:**

1. **Low Adherence:**
   - Trigger: Avg adherence <70%
   - Notify: Clinical team
   - Action: Patient outreach

2. **High-Risk Patient Spike:**
   - Trigger: >20 high-risk flags/day
   - Notify: CHW coordinator
   - Action: Resource allocation

---

## 🔧 **TROUBLESHOOTING**

### **"Monitoring not initialized"**

**Cause:** Environment variables missing or wrong mode.

**Fix:**
```bash
# Check .env file exists
cat .env

# Verify keys are present
echo $VITE_SENTRY_DSN
echo $VITE_GA_MEASUREMENT_ID

# Rebuild
npm run build
```

### **"No data showing in Admin Dashboard"**

**Cause:** No actions performed yet, or localStorage cleared.

**Fix:**
- Use the app (navigate, click buttons)
- Check browser console for tracking logs
- Verify localStorage: `afyacare_metrics` key exists

### **"Sentry not capturing errors"**

**Cause:** Development mode or DSN incorrect.

**Fix:**
1. Verify DSN in .env
2. Check you're in production build (`npm run build`)
3. Test by throwing intentional error:
   ```javascript
   throw new Error("Test error");
   ```
4. Check Sentry dashboard for event

### **"Google Analytics not tracking"**

**Cause:** Ad blockers, incorrect Measurement ID, or dev mode.

**Fix:**
1. Disable ad blockers
2. Verify Measurement ID (starts with `G-`)
3. Check Network tab for `gtag/js` request
4. Use GA4 DebugView for real-time testing

### **"PII appearing in logs"**

**Cause:** Sanitization not working.

**Fix:**
1. Check `/src/app/utils/monitoring.ts` - `sanitizePII()` function
2. Add regex patterns for missed PII types
3. Test with sample PII strings
4. Update Sentry `beforeSend` hook

---

## 📚 **API REFERENCE**

### **Tracking Functions:**

```typescript
// Import
import {
  trackPageView,
  trackEvent,
  trackFeatureUsage,
  trackDisclaimerAcceptance,
  trackMedicationAdherence,
  trackSymptomCheck,
  trackAppointmentBooking,
  trackRouteOptimization,
  trackFacilitySearch,
  logError,
  trackPerformance,
} from '@/app/utils/monitoring';

// Usage examples
trackPageView('/dashboard', 'patient');
trackEvent('Button', 'Clicked', 'Book Appointment');
trackFeatureUsage('medication-tracker', 'dose-taken', 'patient');
trackDisclaimerAcceptance('symptomChecker', 'patient');
trackMedicationAdherence(86, 6, 7);
trackSymptomCheck(3, 'medium', true);
trackAppointmentBooking('clinic', 7, false);
trackRouteOptimization(8, 120, 'urgency');
trackFacilitySearch('emergency', 3, 2.5);
logError(new Error('API failed'), { route: '/dashboard', userRole: 'patient' });
trackPerformance('dashboard-load', 1250);
```

---

## 🎯 **NEXT STEPS**

### **Immediate (Before Pilot):**
- [ ] Set up Sentry account
- [ ] Set up Google Analytics account
- [ ] Add API keys to production environment
- [ ] Test monitoring in staging
- [ ] Configure alert rules

### **During Pilot:**
- [ ] Monitor dashboard daily
- [ ] Export weekly reports
- [ ] Share metrics with MoH
- [ ] Adjust alert thresholds
- [ ] Document incident responses

### **Post-Pilot:**
- [ ] Analyze pilot data
- [ ] Create IRB compliance report
- [ ] Publish anonymized findings
- [ ] Scale monitoring for national rollout
- [ ] Integrate with MoH dashboards

---

## 📞 **SUPPORT**

### **For Technical Issues:**
- **Email:** tech@afyacare.co.tz
- **Slack:** #afyacare-monitoring
- **On-call:** +255 XXX XXX XXX

### **For Data Privacy Questions:**
- **DPO:** privacy@afyacare.co.tz
- **TMDA Liaison:** regulatory@afyacare.co.tz

### **For Clinical Questions:**
- **Medical Director:** clinical@afyacare.co.tz
- **CHW Coordinator:** chw@afyacare.co.tz

---

## 📝 **CHANGELOG**

### **v1.0.0 - Initial Setup** (Feb 23, 2026)
- ✅ Created monitoring utilities
- ✅ Built admin dashboard
- ✅ Implemented PII sanitization
- ✅ Added local metrics storage
- ✅ Integrated Sentry (ready for deployment)
- ✅ Integrated Google Analytics (ready for deployment)

---

**Document Status:** ✅ **COMPLETE**  
**Last Updated:** February 23, 2026  
**Maintainer:** AfyaCare Tech Team  
**Version:** 1.0.0
