# AfyaAI TZA - Navigation & User Flow Guide

## 🎯 New Navigation Structure

### Bottom Navigation (5 Tabs)

```
┌─────────────────────────────────────────────────────────────┐
│                     AfyaAI TZA App                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   [MAIN CONTENT AREA]                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  🏠      ❤️      ✨      💬      👤                         │
│  Home   Care   Assistant Messages Profile                  │
└─────────────────────────────────────────────────────────────┘
```

## 📍 Tab 1: HOME (Nyumbani)
**Purpose:** Context-aware starting point with immediate clarity

### What users see:
- **Greeting:** "Hello, [Name]"
- **Main prompt:** "What do you need right now?"
- **Trust badge:** "Secure & Private"

### Primary Actions (4 cards):
1. **I have symptoms** → Routes to `symptom-checker`
   - Color: Blue (#1E88E5)
   - Icon: Activity
   - Action: Opens symptom checker

2. **Care journeys** → Routes to `care` tab
   - Color: Green (#43A047)  
   - Icon: Heart
   - Action: Opens care journeys hub

3. **AI Assistant** → Routes to `assistant` tab
   - Color: Purple (#8B5CF6)
   - Icon: Sparkles
   - Action: Opens AI assistant

4. **Messages** → Routes to `messages` tab
   - Color: Amber (#F59E0B)
   - Icon: MessageCircle
   - Action: Opens messages hub

### Additional Features:
- Health tip of the day (green gradient card)
- Recent activity section (currently empty state)
- Smooth card animations on load

---

## 📍 Tab 2: CARE (Huduma)
**Purpose:** Core care journeys organized by human intent

### Header:
- **Title:** "Care" / "Huduma za Afya"
- **Subtitle:** "What do you need help with today?"

### Care Paths (5 journeys):

#### 1. I have symptoms
- **Route:** `symptom-checker`
- **Icon:** Thermometer (Red)
- **Description:** "Understand your symptoms and get quick guidance"

#### 2. Pregnancy & child care
- **Route:** `maternal`
- **Icon:** Baby (Pink)
- **Description:** "Track maternity and child health"
- **Status:** Coming Soon

#### 3. Ongoing conditions
- **Route:** `conditions`
- **Icon:** Activity (Amber)
- **Description:** "Manage chronic conditions"
- **Status:** Coming Soon

#### 4. Test results & records
- **Route:** `records`
- **Icon:** FileText (Purple)
- **Description:** "View test results and your health history"
- **Status:** Coming Soon

#### 5. Appointments
- **Route:** `appointments`
- **Icon:** Calendar (Blue)
- **Description:** "Schedule and manage your appointments"
- **Status:** Coming Soon

### Emergency Card:
- **Blue gradient card** with Call 112 button
- Always visible, never intrusive
- Quick access to emergency services

### AI Reminder:
- Bottom info card: "AI assists, not replaces doctors"

---

## 📍 Tab 3: ASSISTANT (Msaidizi)
**Purpose:** Calm, explainable AI guidance

### Header:
- **Blue gradient header** with Sparkles icon
- **Title:** "AI Assistant" / "Msaidizi wa AI"
- **Subtitle:** "I'm here to help you understand your health"

### Trust Message:
- White card at top explaining:
  - "I learn from clinical sources"
  - "My guidance is informational only"
  - "I'll always explain why I tell you something"

### AI Options (5 categories):

#### 1. Symptom guidance
- **Route:** `symptom-checker`
- **Icon:** MessageSquare (Blue)
- **Description:** "Tell me how you feel, I'll help you understand"

#### 2. Care questions
- **Route:** `care-questions`
- **Icon:** HelpCircle (Purple)
- **Description:** "Ask questions about your health"
- **Status:** Coming Soon

#### 3. Medication help
- **Route:** `medication-help`
- **Icon:** Pill (Green)
- **Description:** "Get information about your medications"
- **Status:** Coming Soon

#### 4. Understanding results
- **Route:** `results-help`
- **Icon:** FileText (Amber)
- **Description:** "I'll help you understand your test results"
- **Status:** Coming Soon

#### 5. What should I do next?
- **Route:** `next-steps`
- **Icon:** Lightbulb (Pink)
- **Description:** "Get recommendations for next steps"
- **Status:** Coming Soon

### Recent Conversations:
- Empty state: "No conversations yet. Start chatting with me!"

### Emergency Disclaimer:
- Red alert box: "For emergencies, contact emergency services immediately"

---

## 📍 Tab 4: MESSAGES (Ujumbe)
**Purpose:** Async-first human connection

### Header:
- **Title:** "Messages" / "Ujumbe"
- **Badge:** Shows unread count (e.g., "2 new")
- **Subtitle:** "Connect with your care team"

### Network Status Banner:
- Green banner: "Messages will be delivered even on low bandwidth"
- Pulse indicator showing online status

### Quick Actions (2 buttons):
1. **Contact doctor** - Stethoscope icon
2. **Contact CHW** - Users icon

### Message Threads:

#### Example Thread 1: Care Team
- **Sender:** Dr. Mwangi
- **Last message:** "Your blood test results are ready..."
- **Status:** Unread (blue highlight)
- **Response time:** "Usually responds within 4 hours"
- **Timestamp:** "2 hours ago"

#### Example Thread 2: Appointment System
- **Sender:** Appointment System
- **Last message:** "Reminder: You have an appointment tomorrow..."
- **Status:** Read
- **Timestamp:** "1 day ago"

### Empty State:
- "No messages yet. Your messages will appear here when you receive them"

### Info Card:
"How messaging works"
- ✓ Messages are delivered even offline
- ✓ Doctors have 24 hours to respond
- ✓ CHWs have 4 hours to respond

---

## 📍 Tab 5: PROFILE (Profaili)
**Purpose:** Trust & control over personal information

### Current Features:
- **Personal Information card:**
  - Name: [User's name]
  - Language: Kiswahili / English

- **Log Out button:**
  - Red outline button
  - Triggers log off confirmation dialog

### Planned Features (from your IA):
- Health information
- Language & accessibility settings
- Privacy & permissions controls
- Help & support resources
- Account settings

---

## 🔄 Navigation Flow Examples

### Example 1: User has symptoms
```
Home → [Tap "I have symptoms"] → Symptom Checker
                                        ↓
                                  [Complete assessment]
                                        ↓
                                  [Book appointment]
                                        ↓
                                  Appointments (Coming Soon)
```

### Example 2: User wants maternal care
```
Home → [Tap "Care journeys"] → Care Tab
                                   ↓
                           [Tap "Pregnancy & child care"]
                                   ↓
                           Maternal Tracker (Coming Soon)
```

### Example 3: User has questions
```
Home → [Tap "AI Assistant"] → Assistant Tab
                                    ↓
                            [Choose question type]
                                    ↓
                            Relevant AI feature (Coming Soon)
```

### Example 4: User checks messages
```
Home → [Tap bottom nav "Messages"] → Messages Tab
                                          ↓
                                    [Tap a thread]
                                          ↓
                                    Conversation view (Coming Soon)
```

---

## 🎨 Design System Quick Reference

### Colors by Section:

**Care Journeys:**
- Symptoms: Red (#EF4444)
- Pregnancy: Pink (#EC4899)
- Conditions: Amber (#F59E0B)
- Records: Purple (#8B5CF6)
- Appointments: Blue (#1E88E5)

**AI Assistant:**
- Symptoms: Blue (#1E88E5)
- Questions: Purple (#8B5CF6)
- Medication: Green (#10B981)
- Results: Amber (#F59E0B)
- Next steps: Pink (#EC4899)

**Messages:**
- Care team: Blue (#1E88E5 / #EFF6FF)
- CHW: Green (#10B981 / #ECFDF5)
- Appointments: Amber (#F59E0B / #FFFBEB)
- System: Purple (#8B5CF6 / #F5F3FF)

### Shared Colors:
- Primary Blue: #1E88E5 (Trust Blue)
- Success Green: #43A047 (Wellness Green)
- Warning Amber: #FFB300 (Action Amber)
- Error Red: #EF4444
- Background: #FAFBFC
- Text Dark: #1A1D23
- Text Medium: #6B7280
- Text Light: #9CA3AF
- Border: #E5E7EB

---

## ⚡ Key Interactions

### Navigation Highlighting:
- Active tab has blue background (#EFF6FF)
- Active icon/text is blue (#1E88E5)
- Inactive is gray (#9CA3AF)
- Smooth animation on tab switch

### Card Interactions:
- Hover: Scale 1.02, lift -4px, shadow increase
- Tap: Scale 0.98
- Icon scales to 1.1 on hover
- Chevron translates right on hover

### Back Navigation:
- Symptom checker → Returns to Home
- Coming Soon screens → Return to parent tab
- All deep routes map to correct tab highlight

---

## 📱 Responsive Behavior

### Mobile (Default):
- Full-width cards
- Single column layout
- Bottom navigation always visible
- Floating action buttons (top right)

### Desktop (max-w-4xl):
- Centered content with max width
- 2-column grid for action cards
- Same navigation structure
- More breathing room

---

## 🌍 Internationalization

### Language Support:
- **Primary:** Kiswahili (sw)
- **Secondary:** English (en)

### Language Toggle:
- Floating globe button (top right)
- Toggles between SW ↔ EN
- Persists in localStorage
- Updates all UI text instantly

### Translation Keys:
All components support both languages:
- Navigation labels
- Card titles and descriptions
- Button text
- Info messages
- Empty states

---

## 🔐 Privacy & Trust Indicators

### Always Visible:
1. **Trust badge** on Home: "Secure & Private"
2. **AI disclaimer** on Care: "AI assists, not replaces doctors"
3. **AI trust message** on Assistant: "Informational only, not replacement"
4. **Emergency disclaimer** on Assistant: "Don't rely solely on AI"
5. **Network status** on Messages: "Low bandwidth support"

---

## ✨ What Makes This World-Class?

1. **Human-first language:** "I have symptoms" not "Symptom Checker"
2. **Clear expectations:** Response times shown upfront
3. **No dead ends:** Every screen has a clear next action
4. **Calm design:** No clutter, generous spacing, smooth animations
5. **Accessible:** Works offline, low bandwidth, clear language
6. **Trustworthy:** Privacy visible, AI transparent, emergency access
7. **Guided journeys:** Step-by-step, not overwhelming features
8. **Contextual:** Home adapts to user needs
9. **Professional:** Hospital-grade reliability with consumer polish
10. **Inclusive:** Bilingual, culturally appropriate, health-literate

---

Built for Tanzania 🇹🇿 | Powered by AI ✨ | Designed for Humans ❤️
