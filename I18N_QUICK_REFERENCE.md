# 🚀 i18n Quick Reference Card

## One-Page Developer Guide

---

## 🎯 Basic Usage

### In Any Component
```tsx
import { useI18n } from '@/app/utils/useI18n';

function MyComponent() {
  const { t } = useI18n();
  return <h1>{t('home.greeting', { name: 'John' })}</h1>;
}
```

---

## 📚 Common Patterns

### Simple Translation
```tsx
{t('common.save')}  // "Hifadhi" (sw) or "Save" (en)
```

### With Variables
```tsx
{t('home.greeting', { name: userName })}
// "Habari John" (sw) or "Hello John" (en)
```

### Pluralization
```tsx
{t('home.upcomingSection.medications', { count: 3 })}
// "Dawa 3" (sw) or "3 medications" (en)
```

### Medical Terms (Verified)
```tsx
const { tMedical } = useI18n();
{tMedical('emergency')}  // "Dharura" (sw) or "Emergency" (en)
```

### Date Formatting
```tsx
const { formatDate } = useI18n();
{formatDate(date, 'long')}  // Feb 23, 2026 format
```

### Language Toggle
```tsx
const { language, changeLanguage } = useI18n();
<button onClick={() => changeLanguage(language === 'sw' ? 'en' : 'sw')}>
  {language === 'sw' ? 'EN' : 'SW'}
</button>
```

---

## 🗂️ Key Namespaces

| Namespace | Use For |
|-----------|---------|
| `common.*` | Buttons, universal actions |
| `home.*` | Home screen content |
| `assistant.*` | AI assistant |
| `care.*` | Care journeys |
| `appointments.*` | Appointment system |
| `medications.*` | Medication tracking |
| `symptomChecker.*` | Symptom checker |
| `emergency.*` | Emergency services |
| `errors.*` | Error messages |
| `validation.*` | Form validation |
| `medical.terms.*` | Medical terminology |

---

## 🏥 Medical Terms

**Never use `t()` for medical terms. Use `tMedical()` instead.**

```tsx
// ❌ WRONG
{t('medical.terms.emergency')}

// ✅ RIGHT
{tMedical('emergency')}
```

Available categories:
- Emergency: `emergency`, `urgent`, `criticalCondition`
- Symptoms: `fever`, `cough`, `headache`, `chestPain`
- Vitals: `bloodPressure`, `heartRate`, `temperature`
- Conditions: `diabetes`, `hypertension`, `asthma`
- Treatments: `medication`, `prescription`, `vaccination`

---

## 🔧 Utility Functions

```tsx
const {
  formatDate,           // Date formatting
  formatTime,          // Time formatting
  formatNumber,        // Number formatting
  formatCurrency,      // TZS currency
  formatRelativeTime   // "2 days ago"
} = useI18n();
```

---

## 📝 Adding New Translations

1. **Edit both language files:**
   - `/src/locales/sw.json`
   - `/src/locales/en.json`

2. **Add the key:**
```json
// sw.json
{
  "myFeature": {
    "title": "Kichwa cha Kipengele"
  }
}

// en.json
{
  "myFeature": {
    "title": "Feature Title"
  }
}
```

3. **Use in component:**
```tsx
{t('myFeature.title')}
```

---

## ✅ Checklist for New Features

- [ ] All text uses translation keys (no hardcoded strings)
- [ ] Added translations to both `sw.json` and `en.json`
- [ ] Medical terms use `tMedical()` not `t()`
- [ ] Tested in both languages
- [ ] Pluralization handled correctly
- [ ] Dates/times use formatting functions
- [ ] No layout breaks when switching languages

---

## 🚨 Common Mistakes

### ❌ DON'T
```tsx
// Hardcoded text
<button>Save</button>

// Auto-translated medical term
{t('emergency')}

// Manual date formatting
{date.toLocaleDateString()}
```

### ✅ DO
```tsx
// Translated text
<button>{t('common.save')}</button>

// Verified medical term
{tMedical('emergency')}

// Proper date formatting
{formatDate(date)}
```

---

## 🧪 Testing

### Test Component
```tsx
import { I18nTestComponent } from '@/app/components/I18nTestComponent';

// Add temporarily to test
<I18nTestComponent />
```

### Manual Test
1. Switch language
2. Check all text updates
3. Verify no UI breaks
4. Test offline
5. Reload page (should persist)

---

## 🔍 Debugging

### Check Current Language
```tsx
const { language } = useI18n();
console.log('Current language:', language);
```

### Missing Translation
Look for console warnings:
```
Missing translation: [sw] myKey
```

### i18n Not Working
Check browser console for initialization errors.

---

## 📦 Files to Know

| File | Purpose |
|------|---------|
| `/src/locales/sw.json` | Kiswahili translations |
| `/src/locales/en.json` | English translations |
| `/src/app/utils/i18n.ts` | i18n configuration |
| `/src/app/utils/useI18n.ts` | Custom hooks |
| `/src/app/utils/medicalTerms.ts` | Medical terms |

---

## 🎓 Best Practices

1. **Always use hooks** - Don't access i18n directly
2. **Descriptive keys** - Use `home.greeting` not `hg`
3. **Group logically** - Related translations together
4. **Test both languages** - Every feature, every time
5. **Medical terms** - Always use verified layer
6. **Pluralization** - Use ICU format for counts
7. **Formatting** - Use provided functions for dates/numbers

---

## 💡 Pro Tips

- Use `t()` for general text
- Use `tMedical()` for clinical terms
- Use formatting functions for dates/numbers
- Test rapid language switching
- Check mobile and desktop
- Verify offline functionality

---

## 📞 Get Help

1. Read `/I18N_IMPLEMENTATION_COMPLETE.md`
2. Check code comments
3. Use test component
4. Contact dev team

---

## ✅ Quick Checklist

**Before committing code:**
- [ ] No hardcoded strings
- [ ] Both languages added
- [ ] Medical terms verified
- [ ] Tested language switch
- [ ] No layout breaks
- [ ] Dates/times formatted
- [ ] Pluralization correct

---

**Keep this card handy while developing! 📌**

Version 1.0.0 | Last Updated: Feb 23, 2026
