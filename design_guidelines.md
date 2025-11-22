# CampusFlow - Design Guidelines

## Brand Identity

**Institution:** Nile University of Nigeria
**Tagline:** Honors United Universities
**Brand Colors:** Professional blue and white color scheme reflecting institutional authority and trust

## Design Approach

**Selected Approach:** Modern Professional Design with Nile University Branding

**Justification:** CampusFlow is Nile University's Smart Vehicle Entry/Exit Authorization System requiring clear information hierarchy, real-time monitoring capabilities, and role-based interfaces. The design emphasizes institutional professionalism, accessibility, and user-friendly interactions while maintaining the university's visual identity.

**Key Design Principles:**
- Institutional professionalism with Nile University branding
- Clarity over decoration - every element serves a functional purpose
- Scannable information architecture for security officers
- Consistent interaction patterns across all user roles
- Mobile-first responsive design for accessibility
- Smooth animations and transitions for modern feel

---

## Color System

**Primary Brand Colors:**
- Primary Blue: `hsl(205 85% 42%)` - Nile University brand color
- Primary Foreground: `hsl(205 15% 98%)` - White text on blue
- Background: `hsl(210 5% 98%)` (light) / `hsl(210 5% 8%)` (dark)
- Foreground: `hsl(210 6% 12%)` (light) / `hsl(210 5% 96%)` (dark)

**Semantic Colors:**
- Accent (Success): `hsl(142 20% 86%)` - For positive states
- Destructive: `hsl(0 78% 42%)` - For errors and critical actions
- Muted: `hsl(210 8% 88%)` - For secondary information

**Logo Integration:**
- Nile University logo appears in: navigation, sidebar, login page, landing page footer
- Logo maintains consistent sizing across contexts
- Blue color from logo influences overall color scheme

## Typography System

**Font Family:** 
- Primary: Inter or Segoe UI (system fonts)
- Monospace: Menlo, Monaco (for IDs, timestamps, vehicle plates)

**Hierarchy:**
- Hero Titles: text-4xl to text-7xl font-bold (responsive)
- Page Titles: text-3xl font-bold (30px)
- Section Headers: text-xl to text-2xl font-semibold
- Card Titles: text-lg to text-xl font-medium
- Body Text: text-base to text-lg (16-18px)
- Small Text/Labels: text-sm (14px)
- Timestamps/Metadata: text-xs font-mono (12px)

---

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8, 12**
- Tight spacing (cards, buttons): p-4, gap-2
- Standard spacing (sections): p-6, gap-4
- Generous spacing (page layout): p-8, gap-6, py-12

**Grid Structure:**
- Dashboard: 12-column grid (grid-cols-12)
- Content area: max-w-7xl mx-auto
- Sidebar: fixed w-64 (256px)
- Main content: Flexible with px-6 py-8

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with shadow-sm
- University logo (left), user profile + notifications (right)
- Height: h-16
- Contains: CampusFlow branding, role indicator, help icon

**Side Navigation (Admin/Security views):**
- Fixed sidebar w-64
- Collapsible on mobile
- Icons from Heroicons (outline style)
- Active state: Filled icon with subtle background
- Sections: Dashboard, Gates, Vehicles, Users, Reports, Settings

### Dashboard Cards
**Status Cards:**
- Rounded corners: rounded-lg
- Padding: p-6
- Shadow: shadow-md
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Contains: Icon (h-12 w-12), Metric (text-3xl font-bold), Label (text-sm)

**Gate Status Grid:**
- Real-time gate cards in grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Each card shows: Gate name, Status badge, Last activity, Manual override button
- Status indicators: Dot (h-3 w-3 rounded-full) + text label

### Data Tables
**Access Logs Table:**
- Sticky header with font-semibold
- Alternating row backgrounds for scannability
- Columns: Timestamp (monospace), Vehicle ID, User, Gate, Status badge, Actions
- Pagination controls at bottom
- Search/filter bar above table

**Action Buttons in Tables:**
- Icon-only buttons for View/Edit/Delete
- Size: p-2 rounded hover state
- Tooltips on hover explaining action

### Forms
**Vehicle Registration Form:**
- Two-column layout on desktop (grid-cols-2)
- Labels: text-sm font-medium mb-2
- Inputs: Standard height h-10, px-4, rounded-md, border
- Required field indicator: Asterisk in label
- Submit button: Full-width on mobile, auto on desktop

**QR Code Display:**
- Centered card with p-8
- QR code image: max-w-xs mx-auto
- Download button below
- Vehicle details in grid-cols-2

### Alerts & Notifications
**Notification Panel:**
- Fixed position top-right when open
- w-96 max-h-96 overflow-y-auto
- Individual notifications: p-4 border-b
- Icon (Heroicons) + Title + Timestamp + Dismiss button

**Alert Banners:**
- Full-width with p-4
- Unauthorized access: Red theme with warning icon
- System status: Blue theme with info icon
- Success messages: Green theme with check icon

### Modals & Overlays
**Gate Override Modal:**
- Centered overlay with backdrop blur
- Modal content: max-w-md p-6 rounded-lg
- Clear title, reason textarea, confirm/cancel buttons
- Focus trap for accessibility

### Interactive Elements
**Gate Control Button:**
- Large touch target: min-h-12 px-6
- Icon + Text layout
- Loading spinner when processing
- Success/error state feedback

**Status Badges:**
- Inline-flex items-center px-3 py-1 rounded-full text-sm
- Examples: "Active", "Authorized", "Denied", "Offline"
- Icon (h-4 w-4) + text

### Tooltips (Throughout Interface)
**Implementation:**
- Appear on hover/focus of help icons (Heroicons question-mark-circle)
- Positioning: Auto-adjust based on screen position
- Content: p-2 text-sm max-w-xs rounded shadow-lg
- Delay: 300ms to avoid interference

**Placement Strategy:**
- Form fields: Next to label
- Buttons: On hover over icon
- Dashboard metrics: On info icon near title
- Table headers: Explain sorting/filtering

---

## Responsive Behavior

**Mobile-First Approach:**
All components are designed mobile-first and scale up gracefully.

**Breakpoints:**
- Mobile: base (< 640px) - Single column, optimized touch targets
- Tablet: md (768px+) - Two columns where appropriate
- Desktop: lg (1024px+) - Full multi-column layouts
- Wide: xl (1280px+) - Maximum 7xl container width

**Mobile Adaptations:**
- Collapsible sidebar with hamburger menu
- Responsive grid layouts (1 → 2 → 3 → 4 columns)
- Touch-optimized button sizes (min 44px)
- Simplified tables with horizontal scroll
- Full-width modals on mobile
- Responsive typography scaling
- Stack navigation items on small screens
- Adaptive spacing (smaller on mobile, larger on desktop)

---

## Animations & Interactions

**Smooth, Professional Animations:**
- Scroll behavior: `scroll-behavior: smooth` for anchor links
- Fade-in animations: 0.5-1s duration for page load elements
- Slide-in animations: From top/bottom for hero sections
- Hover effects: `hover-elevate` class for subtle background elevation
- Active states: `active-elevate-2` for pressed feedback
- Gate transitions: 200-300ms ease for status changes
- Loading states: Subtle spinners and skeleton screens
- Scale on hover: Cards scale to 1.05 with smooth transition
- Navigation scroll: Fixed header with backdrop blur on scroll

**Transition Duration:**
- Instant: < 150ms (hover states)
- Quick: 200-300ms (UI element changes)
- Standard: 500ms (page transitions)
- Slow: 700-1000ms (hero animations)

**CSS Classes Available:**
- `.animate-in` - Animation base class
- `.fade-in` - Fade in animation
- `.slide-in-from-top-2` - Slide from top
- `.slide-in-from-bottom-4` - Slide from bottom
- `.anim-duration-700` - 0.7s animation duration
- `.anim-duration-1000` - 1s animation duration
- `.hover-elevate` - Hover background elevation
- `.active-elevate-2` - Active press feedback
- `.transition-all duration-300` - Standard Tailwind transitions

---

## Images & Assets

**Logo:**
- Nile University logo (download_1763844316538.png)
- Used in: navbar, sidebar, login page, landing page
- Sizing: h-10 to h-20 depending on context
- Maintains aspect ratio with `object-contain`

**Hero Images:**
- Landing page features gradient background overlay
- Radial gradient: `bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]`

**Icon Usage:**
- Lucide React icons throughout
- Consistent sizing: w-4 h-4 (16px), w-5 h-5 (20px), w-6 h-6 (24px)
- Icons match text color or use muted-foreground
- Active states use primary color

---

## Accessibility

- All interactive elements: min 44px touch target
- Form inputs: Consistent focus ring (ring-2)
- Skip navigation link for keyboard users
- Semantic HTML throughout (nav, main, section, article)
- ARIA labels on icon-only buttons
- Color is never the only indicator of state