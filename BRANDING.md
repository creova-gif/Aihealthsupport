# AfyaAI TZA - Official Branding Guide

## Brand Identity
**AfyaAI Tanzania** is the official government healthcare AI platform for the United Republic of Tanzania, endorsed by the Ministry of Health (MoH) and Tanzania Medicines and Medical Devices Authority (TMDA).

---

## Official Color Palette

### Primary Palette

| Color Name | Use Case | HEX | RGB | Usage Example |
|------------|----------|-----|-----|---------------|
| **Afya Green** | Primary actions, success states, health | `#0F9D58` | `rgb(15, 157, 88)` | Primary buttons, CHW dashboard, health metrics |
| **Health Blue** | Trust elements, headers, government branding | `#1C4ED8` | `rgb(28, 78, 216)` | MoH badges, section headers, admin dashboard |
| **Clean White** | Backgrounds, cards | `#FFFFFF` | `rgb(255, 255, 255)` | Main background, card backgrounds |

### Secondary Palette

| Color Name | Use Case | HEX | RGB | Usage Example |
|------------|----------|-----|-----|---------------|
| **Warning Amber** | Medium risk, caution | `#F59E0B` | `rgb(245, 158, 11)` | Medium risk alerts, NCDs section |
| **Alert Red** | High risk, emergency | `#DC2626` | `rgb(220, 38, 38)` | Emergency buttons, high-risk alerts, critical symptoms |
| **Neutral Gray** | Text, icons, secondary content | `#6B7280` | `rgb(107, 114, 128)` | Body text, icons, descriptions |

---

## Color Usage Guidelines

### 1. Primary Actions
- **Use:** Afya Green (`#0F9D58`)
- **Examples:** 
  - "Continue" buttons
  - "Submit" actions
  - Success confirmations
  - Positive health metrics

### 2. Trust & Authority
- **Use:** Health Blue (`#1C4ED8`)
- **Examples:**
  - MoH/TMDA badges
  - Government branding
  - Section headers
  - Administrative features

### 3. Risk Levels

| Risk Level | Color | Hex | Use Case |
|------------|-------|-----|----------|
| **Low** | Green | `#0F9D58` | Mild symptoms, self-care advice |
| **Medium** | Amber | `#F59E0B` | Moderate symptoms, facility visit recommended |
| **High** | Orange | `#F97316` | Serious symptoms, urgent facility visit |
| **Emergency** | Red | `#DC2626` | Life-threatening, call 112 immediately |

### 4. AI Confidence Scores

| Confidence | Color | Hex |
|------------|-------|-----|
| High (80-100%) | Green | `#0F9D58` |
| Medium (60-79%) | Amber | `#F59E0B` |
| Low (<60%) | Red | `#DC2626` |

---

## Typography

### Primary Font Family
**Inter** or **Noto Sans** (Swahili-optimized)

### Font Sizes (Accessibility-First)
```css
/* Large for rural/low-literacy users */
--text-3xl: 1.875rem; /* Headings */
--text-2xl: 1.5rem;   /* Subheadings */
--text-xl: 1.25rem;   /* Important text */
--text-lg: 1.125rem;  /* Body text (large) */
--text-base: 1rem;    /* Standard text */
```

### Font Weights
```css
--font-weight-medium: 500; /* Headings, buttons */
--font-weight-normal: 400; /* Body text */
```

---

## Accessibility Standards

### WCAG AA Compliance
✅ All color combinations meet WCAG 2.1 Level AA contrast ratios:
- **Text on White:** Minimum 4.5:1 contrast
- **Large Text (18px+):** Minimum 3:1 contrast
- **UI Components:** Minimum 3:1 contrast

### Color + Icon Rule
🚫 **Never use color alone** to convey information
✅ **Always pair with icons** for accessibility:
```tsx
// ✅ Correct
<Badge className="bg-red-100 text-red-800">
  <AlertCircle className="h-4 w-4 mr-2" />
  High Risk
</Badge>

// ❌ Incorrect
<Badge className="bg-red-100 text-red-800">
  High Risk
</Badge>
```

### Large Touch Targets
- Minimum button size: **44x44px**
- Spacing between interactive elements: **8px minimum**

---

## Implementation

### CSS Variables (theme.css)
```css
:root {
  /* AfyaAI TZA Official Brand Colors */
  --afya-green: #0F9D58;
  --health-blue: #1C4ED8;
  --warning-amber: #F59E0B;
  --alert-red: #DC2626;
  --neutral-gray: #6B7280;
  
  /* Applied to Tailwind */
  --primary: #0F9D58;
  --destructive: #DC2626;
  --muted-foreground: #6B7280;
}
```

### Tailwind Utilities
```tsx
// Primary action
<Button className="bg-[#0F9D58] hover:bg-[#0D8A4D]">

// Trust badge
<Badge className="bg-[#1C4ED8]">MoH</Badge>

// Warning
<Alert style={{ backgroundColor: '#F59E0B' }}>

// Emergency
<Button style={{ backgroundColor: '#DC2626' }}>
```

---

## Brand Voice

### Kiswahili-First
- **Primary:** Kiswahili (Swahili)
- **Secondary:** English
- **Respect:** Local languages (Sukuma, Chagga) for future expansion

### Tone
- **Calm:** Healthcare is serious but not scary
- **Clear:** Low-literacy friendly, simple language
- **Trustworthy:** Government-endorsed, professional
- **Empowering:** "AI assists, you decide"

---

## Logo Usage (Conceptual)

### Primary Logo Components
```
┌─────────────────────────────────┐
│  🛡️ [Shield Icon - #0F9D58]    │
│                                 │
│     AfyaAI Tanzania            │
│     [Health Blue - #1C4ED8]    │
│                                 │
│  Ministry of Health Endorsed   │
│  [Neutral Gray - #6B7280]      │
└─────────────────────────────────┘
```

### Endorsement Badges
Always display together:
- **MoH Badge:** Green background `#0F9D58`
- **TMDA Badge:** Blue background `#1C4ED8`

---

## Examples in Use

### Onboarding Screen
- Background: Clean White `#FFFFFF`
- Shield Icon: Afya Green `#0F9D58`
- Trust Badges: Green `#0F9D58` + Blue `#1C4ED8`
- Warning Disclaimer: Amber `#F59E0B`

### Patient Dashboard
- Primary Actions: Mixed icons with brand colors
- Emergency Button: Alert Red `#DC2626`
- Health Metrics: Afya Green `#0F9D58`

### AI Symptom Checker
- Low Risk: Green `#0F9D58`
- Medium Risk: Amber `#F59E0B`
- High Risk: Orange `#F97316`
- Emergency: Red `#DC2626`

### CHW Dashboard
- Primary Theme: Afya Green `#0F9D58`
- AI Priority List: Health Blue `#1C4ED8`
- Performance Metrics: Mixed palette

### MoH Admin Dashboard
- Charts: Full brand palette
- Alerts: Red `#DC2626`
- Success Metrics: Green `#0F9D58`

---

## Design Principles

1. **Trust First** — Government credibility through consistent branding
2. **Clarity Over Aesthetics** — Function > Form for rural users
3. **Large Everything** — Optimized for low-end Android devices
4. **Offline-Resilient** — Visual indicators for connectivity
5. **AI Transparency** — Always show confidence + explainability

---

## File Location
This branding is implemented in:
- `/src/styles/theme.css` — CSS variables
- All component files — Inline style overrides where needed
- Design system follows Tailwind v4 conventions

---

**Version:** 1.0  
**Last Updated:** January 14, 2026  
**Authority:** Ministry of Health, Tanzania  
**Contact:** afya-ai@moh.go.tz (conceptual)
