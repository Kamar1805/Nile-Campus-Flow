# CampusFlow - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Fluent Design)

**Justification:** CampusFlow is a data-intensive enterprise application requiring clear information hierarchy, real-time monitoring capabilities, and role-based interfaces. Fluent Design excels at productivity tools and administrative dashboards with its emphasis on clarity, efficiency, and scannable data displays.

**Key Design Principles:**
- Clarity over decoration - every element serves a functional purpose
- Scannable information architecture for security officers
- Consistent interaction patterns across all user roles
- Professional, trustworthy aesthetic appropriate for campus security

---

## Typography System

**Font Family:** 
- Primary: Inter or Segoe UI (via Google Fonts CDN)
- Monospace: JetBrains Mono (for IDs, timestamps, vehicle plates)

**Hierarchy:**
- Page Titles: text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base (16px)
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

**Breakpoints:**
- Mobile: base (< 768px) - Single column, collapsed sidebar
- Tablet: md (768px+) - Two columns where appropriate
- Desktop: lg (1024px+) - Full multi-column layouts

**Mobile Adaptations:**
- Bottom navigation instead of sidebar
- Stacked cards instead of grid
- Simplified table (hide non-essential columns)
- Full-screen modals

---

## Animations

**Minimal, Purposeful Animations:**
- Gate status transitions: Simple 200ms ease for open/close indicators
- Loading states: Subtle spinner on buttons/tables
- No scroll-triggered or complex animations
- Focus on instant feedback over decorative motion

---

## Images

**No hero images required** - This is a functional application, not a marketing site.

**Icon Usage:**
- Heroicons (outline for inactive, solid for active states)
- Via CDN: https://cdn.jsdelivr.net/npm/heroicons@2.0.0/
- Consistent 24px size (w-6 h-6) for navigation
- 16px (w-4 h-4) for inline icons

---

## Accessibility

- All interactive elements: min 44px touch target
- Form inputs: Consistent focus ring (ring-2)
- Skip navigation link for keyboard users
- Semantic HTML throughout (nav, main, section, article)
- ARIA labels on icon-only buttons
- Color is never the only indicator of state