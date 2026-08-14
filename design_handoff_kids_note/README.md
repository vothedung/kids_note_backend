# Handoff: Kids Note — Mobile App Prototype

## Overview
Kids Note is a parenting app for tracking a child's growth, health, timeline of moments, photo album, and AI-assisted journaling. This package covers the full clickable prototype: onboarding/auth, family & child management, the core tab app (Home, Timeline, Growth, Album, AI), nested record screens (sleep/feeding/vaccines, notes), and account/settings.

## About the Design Files
The bundled file (`Kids Note.dc.html`) is a **design reference** — an interactive HTML/React prototype built to show layout, flow, and visual style. It is not production code to copy directly. The task is to **recreate these screens in the target codebase's real stack** (React Native, Flutter, native iOS/Android, etc.) using that codebase's existing component library, navigation, and data layer. If no stack is chosen yet, React Native or Flutter are natural fits for a cross-platform mobile app like this.

## Fidelity
**High-fidelity.** Colors, type, spacing, and component shapes are final-intent. All data shown (child names, dates, chart values, member names) is placeholder — wire to real data.

## App Map
- **Auth**: Splash → Onboarding (3 pages) → Login / Register / Forgot Password → Create Family → Add Child → Dashboard
- **Core tabs** (bottom nav): Home (Dashboard), Timeline, Growth, Album, AI
- **Nested**: Health (Sleep/Feeding/Vaccines sub-tabs + add/analytics/reminder screens), Add/Edit Note, Note Details, Child List/Profile/Edit
- **Account**: Settings → Edit Profile, Family Members → Invite Member / Role Management, Notifications, Subscription, Billing, Storage, About

## Design Tokens

### Colors — Light
- Background: `#FBF6F0`
- Surface/card: `#FFFFFF`
- Text primary: `#2B2320`
- Text secondary: `#8A7A6D`
- Border: `#EDE3D8`
- Accent soft (tint): `#FBE9DE`
- Nav background: `#FFFFFF`

### Colors — Dark
- Background: `#1C1815`
- Surface/card: `#26211D`
- Text primary: `#F5EDE5`
- Text secondary: `#A99C8F`
- Border: `#3A322C`
- Accent soft (tint): `#3A2A22`
- Nav background: `#221D19`

### Accent palette (same in both modes)
- Coral (primary accent, CTAs, active states): `#E8785A`
- Sage (secondary, positive/health): `#7C9473`
- Yellow (tertiary, vaccines/warm highlight): `#F0B860` / `#F3C374`
- Blue (sleep-specific accent): `#6B87BE` / `#8FA8D6`

### Typography
- Headings / brand moments: **Fredoka** (500/600/700) — Google Font
- Body / UI text: **Inter** (400/500/600/700) — Google Font
- Base sizes: 24–28px screen titles, 18–22px section titles, 13–15px body, 10–12px meta/labels
- Minimum text size: 10px (chart axis labels only); everything interactive is ≥12.5px

### Spacing & shape
- Screen padding: 20px horizontal, 58px top (clears iOS status bar), 24-90px bottom (90px when a FAB or bottom nav is present)
- Card radius: 14–20px; pill/avatar/button radius: 12–14px or fully round for chips/avatars
- Card border: 1px solid border-token; cards have no shadow by default (flat, warm aesthetic) except gradient hero cards which get a soft colored shadow
- Bottom nav: 5 items (Home, Timeline, Growth, Album, AI), icon 21px + 10px label, active = coral, inactive = text-secondary

### Components inventory
- **Buttons**: primary (coral fill, white text, 14–16px radius, Fredoka weight 700), secondary/outline (card bg + border), dashed-outline (add actions), icon-circle (back button, 34px)
- **Inputs**: text/date/time — 15px vertical padding, 14px radius, border token, card background
- **Segmented control**: 2–3 options, pill-shaped, active = coral border + accent-soft bg
- **Toggle switch**: 44×26px track, coral when on, border-color track when off, 20px white thumb
- **Chips**: filter chips (Timeline), tag chips (Add Note) — pill shape, border + bg + text color swap on select
- **Cards**: activity card (icon tile + text), gradient hero card (growth/AI/health summary), list-row card (settings, members, vaccines)
- **Charts**: custom SVG line chart (Growth) with dots + polyline; custom bar chart (Sleep/Feeding analytics) — no chart library used, but a real chart lib (Victory, Recharts, react-native-svg-charts) is recommended for production
- **Photo/media viewer**: full-screen overlay, swipe via touch (40px threshold), prev/next buttons, dot pagination — recreate with a proper gesture/carousel library (react-native-reanimated-carousel, Swiper, etc.)
- **Bottom nav bar**: 5-icon tab bar, custom SVG line icons (home, clock, trend-line, gallery, sparkle)
- **Device chrome**: iOS status bar/notch/home-indicator styling is prototype-only scaffolding — not needed in a real app (the OS provides it)

## Screens

### Splash
Logo mark, app name, "tap to continue". No real logic — replace with real launch/auth-check logic.

### Onboarding (3 pages)
Full-bleed colored gradient background (rotates coral → sage → yellow per page), circular illustration placeholder, heading + body copy, dot pager (3 dots, active = wide pill), Skip (all pages) + Next / Get Started (last page).

### Login
Email + password TextFields, Forgot-password link (right-aligned), primary Sign In button, divider "or continue with", 3 social buttons (Google/Apple/Facebook) each with brand-colored icon + label, footer link to Register.

### Register
Back button + title, name/email/password TextFields, Create Account button, footer link back to Login.

### Forgot Password
Back button + title, explanation text, email TextField, Send Reset Link button.

### Create Family
Back-free (part of onboarding flow), family-name TextField, invite TextField + circular "+" add button, invited-member chip list, Continue button pinned to bottom.

### Add Child
Photo picker (dashed circle, "Add photo" label), name TextField, date-of-birth picker, Girl/Boy/Other segmented control, Add Child button.

### Dashboard (Home tab)
Greeting + family name header, avatar button (→ Settings), horizontal child-switcher pills (avatar + name, active = coral border), "Manage children" link (→ Child List), gradient growth-summary hero card (height/weight + "Details" link → Growth), "Today's activities" card list, "Quick actions" 2-col grid (Add Note, Health).

### Timeline
Header + avatar, search field, horizontal filter chips (All/Milestones/Health/Notes — filters list live), vertical connected-line list of milestone cards (tap → Note Details), floating "+" FAB (→ Add Note).

### Add Note
Back + title, text area, photo/video attach buttons (dashed outline), multi-select tag chips (Feeding/Sleep/Milestone/Health/Fun), Save button (returns to Timeline).

### Note Details
Back + title + Edit button, tag label, title, date, full body text card.

### Edit Note
Back + title, pre-filled text area, Save button.

### Growth
Header + avatar, Height/Weight segmented toggle, card with SVG line chart + percentile badge + month-axis labels, insight banner (accent-soft bg), "Monthly trend" row list (height/weight/head-circumference deltas).

### Health
Back + title, Sleep/Feeding/Vaccines segmented sub-tabs. Each sub-tab: gradient stat hero card, "+Add Record"/"View Analytics" (or "+Add Vaccine"/"Reminders") action row, detail list (times/amounts or vaccine status rows with colored status dot + Done/Upcoming label).

### Add Sleep Record / Add Feeding Record / Add Vaccine
Back + title, relevant form fields (time pickers, type segmented control, amount field, or vaccine name + date), Save button.

### Sleep Analytics / Feeding Analytics
Back + title, 7-day bar chart card (Mon–Sun), summary sentence.

### Vaccine Reminders
Back + title, 3 toggle rows (7 days before / 1 day before / on the day).

### Album
Header + avatar, Year/Month segmented toggle. Year: 2-col grid of month cards (colored photo-block + count badge + label, tap → Month view). Month: 3-col photo grid (tap → Media Viewer).

### Media Viewer (photo preview)
Full-screen black overlay, counter top-left, close (✕) top-right, centered square image, prev/next circular arrow buttons, swipe-to-navigate (touch), dot pagination at bottom.

### AI
Header + avatar, AI chat bubble, suggestion chips, 3 gradient/outline action cards (Generate Journal → AI Journal, Growth Analysis → Growth, Milestone Generator → Milestone Generator), text input bar at bottom.

### AI Journal
Back + title, list of generated journal-entry cards (date + text), "Generate New Entry" gradient button.

### Milestone Generator
Back + title, prompt text area, "Generate Milestone" gradient button, suggested-result card.

### Child List
Back + title, list of child row cards (avatar, name, age + gender, tap → Child Profile), dashed "+ Add Child" button.

### Child Profile
Back + title + Edit button (→ Edit Child), large avatar + name + age, 2 stat cards (height/weight).

### Edit Child
Back + title, name field, date field, Save Changes button.

### Settings
Back + title, tappable profile row (→ Edit Profile), grouped list: Family Members, Notifications, Dark Mode (switch, toggles app theme), Subscription, Billing, Storage, About — each row navigates except the switch. Log out text link at the bottom.

### Edit Profile
Back + title, avatar with edit badge, Name/Email/Relationship fields, Save Changes button.

### Family Members
Back + title, member row cards (avatar, name, role, Owner/Active/Pending status badge, tap → Role Management), dashed "+ Invite Member" button (→ Invite Member).

### Invite Member
Back + title, email/phone field, Send Invite button, divider, copyable invite-link row.

### Role Management
Back + title (shows selected member's name), 4 selectable role cards (Owner/Parent/Caregiver/Viewer) with description text and a checkmark on the active role.

### Notifications
Back + title, list of toggle rows (Milestones, Reminders, Tips, Family comments, Weekly digest), each with a label + description + switch.

### Subscription
Back + title, Monthly/Yearly billing segmented toggle (yearly shows "Save 20%" and updates all prices), 3 selectable plan cards (Free/Premium/Family) with price + feature list, Continue button.

### Billing
Back + title, gradient current-plan card with "Change plan" (→ Subscription), payment-method row, billing-history list.

### Storage
Back + title, usage progress bar + percentage, breakdown rows (Photos/Videos/Notes & data).

### About
Back + title, app icon + name + version, link list (Terms of Service, Privacy Policy, Help & Support).

## Interactions & Behavior
- All navigation is push/pop with an in-memory history stack; back buttons pop one level. Bottom-nav taps and sidebar/tree jumps reset the stack (no back-swipe expected from tab roots).
- Dark mode is a single global toggle (Settings row + a demo button outside the phone frame in the prototype) — swaps the full color token set app-wide, including inside the device status bar.
- Filter chips, segmented controls, and tag chips are instant client-side state changes — no loading state modeled (add real loading/skeleton states for network-backed data).
- Photo swipe: 40px horizontal touch-delta threshold triggers prev/next; wrap-around at both ends.
- Forms shown (Add Child, Add Note, Add Sleep/Feeding/Vaccine, Register, etc.) are visually complete but not validated in the prototype — add real validation (required fields, date ranges, email format) in implementation.
- No empty/error states are modeled; the prototype always shows populated placeholder data. Design and implement empty states (e.g., no timeline entries yet, no photos this month) and error/retry states for each list-driven screen.

## State Management (from the prototype's logic)
- `screen` (current route) + `history` (stack) — replace with real navigation (React Navigation, Flutter Navigator, etc.)
- `isDark` — theme mode, ideally synced to system preference + a manual override
- `childIdx` / `selectedChild` — which child is active app-wide (persists across tabs)
- `timelineFilter`, `healthTab`, `albumView`, `metric` (growth), `billing` (monthly/yearly), `plan`, `feedType`, `gender` — local UI state per screen
- `noteTagSel`, `notifToggles` — multi-select/toggle maps
- `previewIndex` — which photo is open in the media viewer
- `selectedNoteIdx`, `selectedMemberIdx` — which record is open in a details screen

## Assets
No external image assets — all "photos" are colored placeholder blocks and all icons are hand-drawn inline SVGs (bottom nav, back chevron, social login marks). Replace photo placeholders with real media from the child's album/camera roll, and consider swapping hand-drawn icons for an icon set already used in the target codebase.

## Files
- `Kids Note.dc.html` — the full interactive prototype (all screens, routing, and the screen-map sidebar with per-screen component/API notes) — open directly in a browser.
