# 📦 AfyaAI TZA — Component Usage Guide

**For Developers & Designers**  
**Last Updated:** January 14, 2026  

---

## 🎨 HOW TO USE DESIGN TOKENS

### Import in your component:
```tsx
// Design tokens are automatically imported via /src/styles/index.css
// Use CSS variables directly in your styles
```

### Example Usage:

```tsx
// Using color tokens
<div style={{ backgroundColor: 'var(--afya-green)' }}>
  Primary Action
</div>

// Using spacing tokens
<div style={{ padding: 'var(--space-lg)' }}>
  Content
</div>

// Using typography tokens
<h1 style={{ 
  fontSize: 'var(--text-heading-xl)', 
  fontWeight: 'var(--font-semibold)' 
}}>
  Page Title
</h1>
```

### Tailwind CSS Mappings:
```tsx
// Instead of: bg-green-600
// Use: style={{ backgroundColor: 'var(--afya-green)' }}

// Instead of: text-2xl
// Use: style={{ fontSize: 'var(--text-heading-m)' }}

// Instead of: p-6
// Use: style={{ padding: 'var(--space-lg)' }}
```

---

## 🧩 COMPONENT LIBRARY

### 1. Cards (Apple Health Style)

**Import:**
```tsx
import { Card, CardContent } from '@/app/components/ui/card';
```

**Basic Usage:**
```tsx
<Card className="border border-gray-200">
  <CardContent className="p-5">
    <h3 className="font-semibold text-gray-900">Card Title</h3>
    <p className="text-sm text-gray-600">Card description</p>
  </CardContent>
</Card>
```

**Risk-Level Cards:**
```tsx
// Low Risk (Green)
<Card className="border-2 bg-risk-low border-green-200">
  <CardContent className="p-5">
    <Badge className="bg-green-500 text-white">Low Risk</Badge>
  </CardContent>
</Card>

// Medium Risk (Amber)
<Card className="border-2 bg-risk-medium border-amber-200">
  <CardContent className="p-5">
    <Badge className="bg-amber-500 text-white">Medium Risk</Badge>
  </CardContent>
</Card>

// High Risk (Red)
<Card className="border-2 bg-risk-high border-red-200">
  <CardContent className="p-5">
    <Badge className="bg-red-500 text-white">High Risk</Badge>
  </CardContent>
</Card>
```

**Gradient Action Cards:**
```tsx
<button className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
  <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 p-6 flex flex-col justify-between">
    <div className="flex items-start justify-between">
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
        <Activity className="h-8 w-8 text-white" strokeWidth={2} />
      </div>
      <ChevronRight className="h-6 w-6 text-white/60 group-hover:text-white/100 transition-colors" />
    </div>
    <div className="text-left">
      <h3 className="text-xl font-semibold text-white mb-1">Nina Dalili</h3>
      <p className="text-sm text-white/80">Angalia dalili zako</p>
    </div>
  </div>
</button>
```

---

### 2. Buttons

**Import:**
```tsx
import { Button } from '@/app/components/ui/button';
```

**Variants:**

```tsx
// Primary (Afya Green)
<Button className="bg-afya-green hover:bg-green-700">
  Primary Action
</Button>

// Secondary (Outline)
<Button variant="outline">
  Secondary Action
</Button>

// Emergency (Red - use sparingly)
<Button className="bg-red-600 hover:bg-red-700 text-white">
  Emergency: 112
</Button>

// Large Touch Target (56px height)
<Button className="py-4 px-6 touch-target-comfortable">
  Large Button
</Button>
```

**Full-Width Emergency Button:**
```tsx
<button
  onClick={() => (window.location.href = 'tel:112')}
  className="w-full py-6 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
>
  <Phone className="h-6 w-6" />
  <span className="text-xl font-semibold">Dharura: 112</span>
</button>
```

---

### 3. Badges (Status Indicators)

**Import:**
```tsx
import { Badge } from '@/app/components/ui/badge';
```

**Usage:**

```tsx
// Confirmed (Green)
<Badge className="bg-green-100 text-green-700 border-0">
  Confirmed
</Badge>

// Pending (Amber)
<Badge className="bg-amber-100 text-amber-700 border-0">
  Pending
</Badge>

// High Priority (Red)
<Badge className="bg-red-500 text-white">
  Urgent
</Badge>

// AI Confidence Score
<Badge className="bg-green-500 text-white text-xs">
  Confidence: 85%
</Badge>
```

---

### 4. Progress Bars

**Import:**
```tsx
import { Progress } from '@/app/components/ui/progress';
```

**Usage:**

```tsx
// Basic progress
<Progress value={75} className="h-2" />

// With label
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-600">ANC Visits</span>
    <span className="text-sm font-medium text-gray-900">3 of 8</span>
  </div>
  <Progress value={37.5} className="h-3" />
</div>

// Pregnancy progress
const progress = (24 / 40) * 100; // Week 24 of 40
<Progress value={progress} className="h-3" />
```

---

### 5. AI Explainability Panel

**Pattern:**
```tsx
const [showExplanation, setShowExplanation] = useState(false);

<Card className="border border-blue-100">
  <CardContent className="p-5">
    <button
      onClick={() => setShowExplanation(!showExplanation)}
      className="w-full flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Kwa nini AI inasema hivi?</h3>
      </div>
      <ChevronLeft
        className={`h-5 w-5 text-gray-400 transition-transform ${
          showExplanation ? '-rotate-90' : 'rotate-180'
        }`}
      />
    </button>

    {showExplanation && (
      <div className="mt-4 pt-4 border-t space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Factors Considered
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Your symptoms</li>
            <li>• Regional data</li>
            <li>• Similar cases</li>
          </ul>
        </div>
      </div>
    )}
  </CardContent>
</Card>
```

---

### 6. Icons

**Import:**
```tsx
import { 
  Activity,     // Symptoms
  Baby,         // Maternal
  Heart,        // NCDs
  MessageSquare,// Telemedicine
  Calendar,     // Appointments
  Bell,         // Notifications
  Phone,        // Call
  MapPin,       // Location
  AlertCircle,  // Warning
  CheckCircle,  // Success
  WifiOff,      // Offline
  Shield,       // Privacy/Trust
  TrendingUp,   // Progress
  ChevronRight, // Navigation
  ChevronLeft,  // Back
} from 'lucide-react';
```

**Usage:**

```tsx
// Standard size (h-5 w-5)
<Activity className="h-5 w-5 text-afya-green" />

// Large icon (h-8 w-8)
<Baby className="h-8 w-8 text-pink-600" />

// With specific color
<Heart className="h-5 w-5" style={{ color: 'var(--afya-green)' }} />
```

---

### 7. Navigation Patterns

**Bottom Navigation:**
```tsx
import { BottomNavigation } from '@/app/components/BottomNavigation';

<BottomNavigation
  activeRoute={currentRoute}
  onNavigate={setCurrentRoute}
/>
```

**Back Button (Standard):**
```tsx
<button
  onClick={onBack}
  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
>
  <ChevronLeft className="h-5 w-5" />
  Rudi Nyumbani
</button>
```

---

### 8. Headers (Sticky)

**Pattern:**
```tsx
<header className="bg-white border-b border-gray-100 sticky top-0 z-40">
  <div className="max-w-3xl mx-auto px-4 py-4">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
        <ChevronLeft className="h-6 w-6 text-gray-600" />
      </button>
      <h1 className="text-2xl font-semibold text-gray-900">Page Title</h1>
    </div>
  </div>
</header>
```

---

### 9. Offline Indicator

**Pattern:**
```tsx
{isOffline && (
  <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
    <WifiOff className="h-3 w-3 mr-1" />
    Bila Mtandao
  </Badge>
)}
```

---

### 10. Risk Level Display

**Pattern:**
```tsx
const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
  const colors = {
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };
  return colors[risk];
};

const riskColors = getRiskColor('medium');

<Card className={`border-2 ${riskColors.border} ${riskColors.bg}`}>
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Risk Level</p>
        <h2 className={`text-3xl font-bold ${riskColors.text}`}>
          Medium
        </h2>
      </div>
      <Badge className="bg-amber-500 text-white">
        Confidence: 72%
      </Badge>
    </div>
  </CardContent>
</Card>
```

---

## 🎯 DESIGN PATTERNS

### 1. One Question Per Screen (Symptom Checker)

```tsx
const [currentQuestion, setCurrentQuestion] = useState(0);
const questions = [...];

// Display only current question
const question = questions[currentQuestion];

<div className="text-center mb-12">
  <div className="text-6xl mb-6 animate-pulse">{question.icon}</div>
  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
    {question[language]}
  </h2>
</div>

// Large Yes/No buttons
<div className="grid grid-cols-2 gap-4">
  <button
    onClick={() => handleAnswer(true)}
    className="py-8 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl"
  >
    <CheckCircle className="h-12 w-12 mx-auto mb-3" />
    <span className="text-2xl font-semibold">Ndiyo</span>
  </button>
  <button
    onClick={() => handleAnswer(false)}
    className="py-8 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl"
  >
    <XCircle className="h-12 w-12 mx-auto mb-3" />
    <span className="text-2xl font-semibold">Hapana</span>
  </button>
</div>
```

---

### 2. Circular Progress (Maternal Care)

```tsx
const progress = (currentWeek / totalWeeks) * 100;

<div className="relative h-24 w-24">
  <svg className="transform -rotate-90 h-24 w-24">
    {/* Background circle */}
    <circle
      cx="48"
      cy="48"
      r="40"
      stroke="#FDE2E4"
      strokeWidth="8"
      fill="none"
    />
    {/* Progress circle */}
    <circle
      cx="48"
      cy="48"
      r="40"
      stroke="#EC4899"
      strokeWidth="8"
      fill="none"
      strokeDasharray={`${progress * 2.51} 251`}
      strokeLinecap="round"
    />
  </svg>
  {/* Percentage in center */}
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-lg font-bold text-pink-600">
      {Math.round(progress)}%
    </span>
  </div>
</div>
```

---

### 3. Micro-Interactions (Hover + Active States)

```tsx
// Card hover effect
<Card className="hover:shadow-md transition-shadow">
  ...
</Card>

// Button press effect
<button className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
  ...
</button>

// Color transition
<button className="hover:bg-blue-50 transition-colors duration-200">
  ...
</button>
```

---

### 4. Skeleton Loading (Planned)

```tsx
import { Skeleton } from '@/app/components/ui/skeleton';

// While loading
{isLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
) : (
  <div>Actual content</div>
)}
```

---

## ♿ ACCESSIBILITY CHECKLIST

### For Every Component:

```tsx
// ✅ DO: Use semantic HTML
<button onClick={...}>Click me</button>

// ❌ DON'T: Use divs for clickable elements
<div onClick={...}>Click me</div>

// ✅ DO: Provide alt text for icons
<Activity className="h-5 w-5" aria-label="Symptoms" />

// ✅ DO: Ensure minimum touch target
<button className="min-h-[48px] min-w-[48px]">
  Tap
</button>

// ✅ DO: Use color + icon + text (never color alone)
<Badge className="bg-red-500 text-white">
  <AlertCircle className="h-4 w-4 mr-1" />
  High Risk
</Badge>

// ✅ DO: Ensure sufficient contrast
// Text on background: >4.5:1 ratio
<div style={{ backgroundColor: '#FFFFFF', color: '#111827' }}>
  High contrast text
</div>
```

---

## 🌍 LOCALIZATION PATTERN

```tsx
const translations = {
  sw: {
    welcome: 'Karibu',
    symptoms: 'Nina Dalili',
    // ... more translations
  },
  en: {
    welcome: 'Welcome',
    symptoms: 'I Have Symptoms',
    // ... more translations
  },
};

const { language } = useApp();
const t = translations[language];

// Usage
<h1>{t.welcome}</h1>
<button>{t.symptoms}</button>
```

---

## 📱 RESPONSIVE DESIGN

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

// Conditional rendering for mobile
<div className="flex flex-col sm:flex-row gap-4">
  {/* Column on mobile, row on tablet+ */}
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop-only content
</div>
```

---

## 🎨 ANIMATION TOKENS

```tsx
// Fast transition (200ms)
<div className="transition-all duration-[200ms]">
  Fast animation
</div>

// Normal transition (300ms)
<div className="transition-all duration-300">
  Normal animation
</div>

// Ease-in-out
<div style={{ transition: 'all var(--duration-normal) var(--ease-in-out)' }}>
  Smooth transition
</div>

// Pulse animation (heartbeat)
<div className="animate-pulse">
  Pulsing element
</div>
```

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ DON'T:
```tsx
// 1. Don't use color alone for risk
<div className="bg-red-500">High Risk</div>

// 2. Don't use small fonts (<16px for body)
<p className="text-xs">Important information</p>

// 3. Don't use generic "Click here"
<button>Click here</button>

// 4. Don't forget offline indicator
// (Always show if isOffline is true)

// 5. Don't hide AI confidence scores
// (Always show for transparency)
```

### ✅ DO:
```tsx
// 1. Use color + icon + text
<div className="bg-red-500 flex items-center gap-2">
  <AlertCircle className="h-5 w-5" />
  <span>High Risk</span>
</div>

// 2. Use minimum 16px for body text
<p className="text-base">Important information</p>

// 3. Use descriptive button text
<button>Book Appointment</button>

// 4. Always show offline indicator
{isOffline && <OfflineBadge />}

// 5. Always show AI confidence
<Badge>Confidence: 85%</Badge>
```

---

## 📦 QUICK START

### To use any component:

1. **Import the component:**
   ```tsx
   import { ComponentName } from '@/app/components/ComponentName';
   ```

2. **Import icons (if needed):**
   ```tsx
   import { Icon1, Icon2 } from 'lucide-react';
   ```

3. **Import context (for language, offline status):**
   ```tsx
   import { useApp } from '@/app/context/AppContext';
   const { language, isOffline } = useApp();
   ```

4. **Use design tokens:**
   ```tsx
   style={{ color: 'var(--afya-green)' }}
   ```

5. **Follow accessibility guidelines:**
   - Minimum 16px font
   - Minimum 48px touch targets
   - Color + icon + text
   - Semantic HTML

---

## 🎯 COMPONENT DECISION TREE

**Need to display information?**
→ Use `<Card>` component

**Need user action?**
→ Use `<Button>` component with proper size (py-4 for large)

**Need to show risk level?**
→ Use color-coded `<Badge>` + icon + text

**Need to explain AI decision?**
→ Use expandable AI Explainability Panel

**Need navigation?**
→ Use `<BottomNavigation>` for global nav
→ Use back button with ChevronLeft for local nav

**Need to show progress?**
→ Use `<Progress>` for linear progress
→ Use circular SVG for pregnancy/week progress

**Need to collect input?**
→ Use one question per screen
→ Use large buttons (py-8)

---

## 📞 SUPPORT

**Questions?**
- Review `/UX_DESIGN_SYSTEM.md` for design principles
- Review `/WORLD_CLASS_UX_IMPLEMENTATION.md` for implementation details
- Review `/COMPLETE_DESIGN_SYSTEM_IMPLEMENTATION.md` for full system overview

**Component not listed here?**
- Check `/src/app/components/` directory
- All components follow the same patterns outlined above

---

**Last Updated:** January 14, 2026  
**Maintained By:** Principal Healthcare Product Designer  
**Status:** 🚀 Production-Ready  

**Happy Building! 🏥💚🇹🇿**
