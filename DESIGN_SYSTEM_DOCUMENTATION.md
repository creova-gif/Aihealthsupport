# 🎨 AfyaCare Tanzania Design System

## Overview

This design system extracts reusable patterns from Phase 2 UX redesigns into a consistent, accessible component library. Built for government healthcare deployment in Tanzania.

---

## 📁 Structure

```
/src/app/design-system/
├── tokens.ts                           # Design tokens (colors, typography, spacing)
├── index.ts                            # Component library exports
└── components/
    ├── UrgencyCard.tsx                 # Multi-modal urgency indicators
    ├── SectionHeader.tsx               # Consistent section labels
    ├── StatusBadge.tsx                 # Status with icon + text
    ├── QuickActionButton.tsx           # Secondary navigation
    ├── NativeDropdownFilter.tsx        # Accessible filtering
    └── PageHeader.tsx                  # Institutional page headers
```

---

## 🎯 Design Principles

### 1. Institutional Over Consumer
**Why:** Government healthcare needs trust, not startup energy  
**How:** White backgrounds, clean typography, minimal animation

### 2. Multi-Modal Accessibility
**Why:** ~8% of males in Tanzania are color-blind  
**How:** Urgency = color + icon + background + text

### 3. Native Controls Win
**Why:** Maximum compatibility, zero bugs  
**How:** Use `<select>` not custom dropdowns

### 4. Task-First Design
**Why:** Users have intent, not curiosity  
**How:** Primary CTA prominence, clear hierarchy

### 5. Mobile-First
**Why:** Most users access via smartphones  
**How:** 44px touch targets, native controls, responsive

---

## 🎨 Design Tokens

### Colors

```typescript
import { colors } from '@/app/design-system';

// Primary (Clinical Blue)
colors.primary[500]  // #1E88E5 - Main primary color

// Success (Medical Green)
colors.success[500]  // #10B981 - Safe, healthy

// Warning (Caution Yellow)
colors.warning[500]  // #F59E0B - Attention, not alarm

// Danger (Urgent Red)
colors.danger[600]   // #DC2626 - Critical, action required

// Neutral (Institutional Grays)
colors.neutral[900]  // #1A1D23 - Primary text
colors.neutral[600]  // #6B7280 - Body text
colors.neutral[300]  // #E5E7EB - Borders

// Semantic (Context-aware)
colors.semantic.urgent     // { bg, border, text, icon }
colors.semantic.clinical   // { bg, text }
colors.semantic.maternal   // { bg, text }
```

### Typography

```typescript
import { typography } from '@/app/design-system';

// Font Sizes
typography.fontSize.sm     // 0.875rem (14px)
typography.fontSize.base   // 1rem (16px)
typography.fontSize['2xl'] // 1.5rem (24px)

// Font Weights
typography.fontWeight.medium   // 500
typography.fontWeight.semibold // 600

// Line Heights
typography.lineHeight.normal  // 1.5
typography.lineHeight.relaxed // 1.625
```

### Spacing

```typescript
import { spacing } from '@/app/design-system';

spacing[3]        // 0.75rem (12px)
spacing[4]        // 1rem (16px)
spacing[6]        // 1.5rem (24px)

// Semantic spacing
spacing.section   // 1.5rem - Between sections
spacing.card      // 1rem - Card padding
```

### Other Tokens

```typescript
import { borderRadius, shadows, accessibility } from '@/app/design-system';

borderRadius.xl                    // 1rem (16px)
shadows.md                         // Card shadow
accessibility.minTouchTarget       // 44px
```

---

## 📦 Components

### 1. UrgencyCard

**Purpose:** Display critical information with accessible urgency indicators

**When to use:**
- Urgent appointments
- Follow-up reminders
- Critical health alerts
- Shared device warnings

**Props:**
```typescript
interface UrgencyCardProps {
  level: 'urgent' | 'warning' | 'success' | 'info';
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

**Example:**
```tsx
import { UrgencyCard } from '@/app/design-system';
import { AlertCircle } from 'lucide-react';

<UrgencyCard
  level="urgent"
  title="Appointment Tomorrow"
  description="10:00 AM at Mwananyamala Hospital"
/>
```

**Accessibility:**
- Multi-modal: color + icon + background + text
- High contrast (WCAG AA)
- `aria-live="polite"` for urgent items

---

### 2. SectionHeader

**Purpose:** Consistent section labeling for content organization

**When to use:**
- Grouping related content
- Creating visual hierarchy
- Section navigation

**Props:**
```typescript
interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example:**
```tsx
import { SectionHeader } from '@/app/design-system';

<SectionHeader>In Progress</SectionHeader>
<SectionHeader>Personal Information</SectionHeader>
```

**Design:**
- Uppercase text (scannable)
- Wide letter spacing (readability)
- Gray color (de-emphasized)

---

### 3. StatusBadge

**Purpose:** Display status with icon + text for accessibility

**When to use:**
- Health record status
- Message status
- Care journey progress
- Completion indicators

**Props:**
```typescript
interface StatusBadgeProps {
  type: 'completed' | 'in-progress' | 'needs-action' | 'info';
  label: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md';
  className?: string;
}
```

**Example:**
```tsx
import { StatusBadge } from '@/app/design-system';

<StatusBadge type="completed" label="Completed" />
<StatusBadge type="in-progress" label="Week 24" />
<StatusBadge type="needs-action" label="Follow-up Needed" />
```

**Accessibility:**
- Icon + text (multi-modal)
- High contrast colors
- Semantic color meanings

---

### 4. QuickActionButton

**Purpose:** Grid-based quick access to common features

**When to use:**
- Home screen secondary navigation
- Dashboard quick actions
- Feature shortcuts

**Props:**
```typescript
interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color: string;
  badge?: number;
  className?: string;
}
```

**Example:**
```tsx
import { QuickActionButton } from '@/app/design-system';
import { Calendar, MessageCircle } from 'lucide-react';

<div className="grid grid-cols-2 gap-3">
  <QuickActionButton
    icon={Calendar}
    label="Appointments"
    onClick={() => navigate('/appointments')}
    color="#1E88E5"
  />
  <QuickActionButton
    icon={MessageCircle}
    label="Messages"
    onClick={() => navigate('/messages')}
    color="#F59E0B"
    badge={3}
  />
</div>
```

**Accessibility:**
- 44px minimum touch target
- Clear hover/focus states
- Badge for notifications

---

### 5. NativeDropdownFilter

**Purpose:** Accessible filtering using native `<select>`

**When to use:**
- Message grouping
- Health records filtering
- Any list filtering

**Props:**
```typescript
interface NativeDropdownFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; count?: number }>;
  className?: string;
}
```

**Example:**
```tsx
import { NativeDropdownFilter } from '@/app/design-system';

const [filter, setFilter] = useState('all');

<NativeDropdownFilter
  label="Filter:"
  value={filter}
  onChange={setFilter}
  options={[
    { value: 'all', label: 'All', count: 15 },
    { value: 'urgent', label: 'Urgent', count: 2 },
    { value: 'read', label: 'Read', count: 13 },
  ]}
/>
```

**Why Native?**
- No horizontal scroll issues
- Works on all devices
- Zero JavaScript dependencies
- Familiar UI pattern

---

### 6. PageHeader

**Purpose:** Consistent institutional page headers

**When to use:**
- All screen headers
- Navigation structure
- Page titles

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}
```

**Example:**
```tsx
import { PageHeader } from '@/app/design-system';

<PageHeader
  title="Profile"
  subtitle="Your information and settings"
  onBack={() => navigate(-1)}
  backLabel="Back"
/>
```

**Design:**
- White background (institutional)
- Border bottom (clear separation)
- Optional back button
- Title + subtitle layout

---

## 📐 Layout Patterns

### Pattern 1: Home Screen

```tsx
<div className="min-h-screen bg-[#F7F9FB] pb-24">
  <PageHeader
    title="Home"
    subtitle="What do you need help with today?"
  />
  
  <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
    {/* In Progress Section */}
    <section>
      <SectionHeader>In Progress</SectionHeader>
      <UrgencyCard level="info" title="Pregnancy Care" />
    </section>

    {/* Primary CTA */}
    <button className="w-full p-6 bg-[#1E88E5] rounded-xl">
      I have symptoms
    </button>

    {/* Quick Actions */}
    <section>
      <SectionHeader>Quick Actions</SectionHeader>
      <div className="grid grid-cols-2 gap-3">
        <QuickActionButton icon={Calendar} label="Appointments" />
        <QuickActionButton icon={FileText} label="Records" />
      </div>
    </section>
  </div>
</div>
```

### Pattern 2: List with Filter

```tsx
<div className="min-h-screen bg-[#F7F9FB] pb-24">
  <PageHeader
    title="Messages"
    subtitle="Communication with your care team"
  >
    <NativeDropdownFilter
      label="Show:"
      value={filter}
      onChange={setFilter}
      options={filterOptions}
    />
  </PageHeader>

  <div className="max-w-4xl mx-auto px-6 pt-6 space-y-3">
    {messages.map(message => (
      <MessageCard key={message.id} message={message} />
    ))}
  </div>
</div>
```

### Pattern 3: Profile/Settings

```tsx
<div className="min-h-screen bg-[#F7F9FB] pb-24">
  <PageHeader
    title="Profile"
    subtitle="Your information and settings"
    onBack={() => navigate(-1)}
  />

  <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
    {/* Personal Info */}
    <section>
      <SectionHeader>Personal Info</SectionHeader>
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl">
        {/* Info fields */}
      </div>
    </section>

    {/* Logout */}
    <button className="w-full p-4 bg-[#DC2626] rounded-xl text-white">
      Log Out
    </button>
  </div>
</div>
```

---

## ♿ Accessibility Guidelines

### Touch Targets
- **Minimum size:** 44px × 44px (WHO/WCAG)
- **Spacing:** 8px minimum between targets
- **Implementation:** Use `accessibility.minTouchTarget`

### Color Contrast
- **Body text:** 4.5:1 minimum (WCAG AA)
- **Large text:** 3:1 minimum
- **Testing:** Use browser DevTools contrast checker

### Multi-Modal Indicators
- **Urgency:** color + icon + background + text
- **Status:** icon + text + color
- **Never rely on color alone**

### Keyboard Navigation
- **Focus visible:** 2px blue ring
- **Tab order:** Logical top-to-bottom
- **Skip links:** For screen readers

### Screen Readers
- **Semantic HTML:** Use `<header>`, `<nav>`, `<main>`
- **Labels:** All form inputs have labels
- **Aria-live:** For dynamic urgent content

---

## 🌍 Internationalization (i18n)

### Bilingual Support

```tsx
const content = {
  sw: {
    title: 'Wasifu',
    subtitle: 'Taarifa zako na mipangilio',
  },
  en: {
    title: 'Profile',
    subtitle: 'Your information and settings',
  },
};

const t = content[language];

<PageHeader title={t.title} subtitle={t.subtitle} />
```

### RTL Support (Future)
- Use logical properties (`margin-inline-start` not `margin-left`)
- Test with Arabic/Hebrew

---

## 📱 Responsive Design

### Breakpoints

```typescript
import { breakpoints } from '@/app/design-system';

breakpoints.sm   // 640px - Small tablets
breakpoints.md   // 768px - Tablets
breakpoints.lg   // 1024px - Laptops
```

### Mobile-First Pattern

```tsx
{/* Mobile: 1 column */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  <QuickActionButton />
  <QuickActionButton />
</div>

{/* Tablet+: 2 columns */}
```

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] All components render correctly on mobile (375px)
- [ ] All components render correctly on tablet (768px)
- [ ] All components render correctly on desktop (1440px)

### Accessibility Testing
- [ ] Color contrast passes WCAG AA (4.5:1)
- [ ] Touch targets are 44px minimum
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces content correctly

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)

### Performance Testing
- [ ] Components render in <100ms
- [ ] No layout shift (CLS < 0.1)
- [ ] Works on 2G network (slow 3G simulation)

---

## 🚀 Future Enhancements

### Phase 3.1: Advanced Components
- [ ] EmptyState component (illustrations + text)
- [ ] LoadingSpinner component (skeleton screens)
- [ ] Modal/Dialog component (confirmation, forms)
- [ ] Toast/Snackbar component (success, error messages)

### Phase 3.2: Form Components
- [ ] TextInput (with validation)
- [ ] TextArea (with character count)
- [ ] Checkbox (with indeterminate state)
- [ ] Radio (with descriptions)
- [ ] DatePicker (native-first)

### Phase 3.3: Data Display
- [ ] Table component (sortable, filterable)
- [ ] Card component (with actions)
- [ ] Timeline component (vertical events)
- [ ] Progress component (linear, circular)

---

## 📚 Resources

### Design References
- **NHS Digital Service Manual:** https://service-manual.nhs.uk/
- **GOV.UK Design System:** https://design-system.service.gov.uk/
- **WHO Digital Health Guidelines:** https://www.who.int/

### Accessibility Resources
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WHO Accessibility:** https://www.who.int/disabilities/
- **Tanzania PDPA:** https://www.tanzania.go.tz/

### Development Tools
- **Tailwind CSS v4:** https://tailwindcss.com/
- **Lucide Icons:** https://lucide.dev/
- **Motion (Framer Motion):** https://motion.dev/

---

## 🤝 Contributing

### Adding New Components

1. **Extract from real usage:**
   - Identify repeated patterns (3+ occurrences)
   - Document actual use cases
   - Extract common props

2. **Follow design principles:**
   - Institutional over consumer
   - Multi-modal accessibility
   - Native controls where possible

3. **Document thoroughly:**
   - Purpose and when to use
   - Props with TypeScript types
   - Usage examples (3+)
   - Accessibility notes

4. **Test comprehensively:**
   - Visual testing (mobile, tablet, desktop)
   - Accessibility testing (contrast, keyboard, screen reader)
   - Browser testing (Chrome, Safari, Firefox)

---

**Last Updated:** February 22, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Maintainer:** AfyaCare Tanzania Development Team
