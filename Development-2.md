# Development-2.md
## Health Online LTO & Ancillary Licensing Tracker — UI Page Development Guide

**Project:** Health Online LTO & Ancillary Licensing Tracker  
**Project ID:** PRBCS00032  
**Scope:** `x_1998335_health_l`  
**Client Path:** `src/client/`  
**Framework:** React (Vite) + Lucide React  
**Version:** 2.0  
**Date:** April 16, 2026  
**Status:** 🟡 In Development

---

## TABLE OF CONTENTS

1. [Design System & Token Reference](#1-design-system--token-reference)
2. [Component Architecture](#2-component-architecture)
3. [Page Inventory](#3-page-inventory)
4. [Page 01 — Dashboard](#4-page-01--dashboard)
5. [Page 02 — Facilities List](#5-page-02--facilities-list)
6. [Page 03 — Facility Form (Create / Edit)](#6-page-03--facility-form-create--edit)
7. [Page 04 — Licenses List](#7-page-04--licenses-list)
8. [Page 05 — License Detail](#8-page-05--license-detail)
9. [Page 06 — License Form (Create / Edit)](#9-page-06--license-form-create--edit)
10. [Page 07 — Form Checklist](#10-page-07--form-checklist)
11. [Page 08 — Evidence Files](#11-page-08--evidence-files)
12. [Page 09 — Audit Log](#12-page-09--audit-log)
13. [Page 10 — Alerts](#13-page-10--alerts)
14. [Shared Components](#14-shared-components)
15. [Routing & Navigation Shell](#15-routing--navigation-shell)
16. [API Service Layer](#16-api-service-layer)
17. [File & Folder Checklist](#17-file--folder-checklist)

---

## 1. DESIGN SYSTEM & TOKEN REFERENCE

### 1.1 ServiceNow Color Palette

All pages must use the following color tokens. Define them as CSS custom properties in `src/client/tokens.css` and import globally.

```css
/* src/client/tokens.css */
:root {
  /* ── Brand Blues ── */
  --sn-blue-primary:   #0072DB;   /* Now Blue — CTAs, active nav, links */
  --sn-blue-dark:      #004C97;   /* Hover state for primary blue */
  --sn-blue-light:     #E8F3FF;   /* Blue tint for selected rows, badges */

  /* ── Neutrals ── */
  --sn-navy:           #1B2C3E;   /* Page titles, sidebar background */
  --sn-navy-mid:       #2E4259;   /* Sidebar hover, secondary panels */
  --sn-gray-700:       #4A5568;   /* Body text */
  --sn-gray-500:       #6B7A8D;   /* Subtext, placeholders */
  --sn-gray-300:       #C8D0DB;   /* Borders, dividers */
  --sn-gray-100:       #F2F4F7;   /* Page background */
  --sn-white:          #FFFFFF;   /* Card backgrounds */

  /* ── Status Semantics ── */
  --sn-green:          #1A7F5A;   /* Active — text */
  --sn-green-bg:       #E6F5EF;   /* Active — badge background */
  --sn-green-border:   #52C79B;   /* Active — badge border */

  --sn-amber:          #B45309;   /* Expiring Soon — text */
  --sn-amber-bg:       #FEF3C7;   /* Expiring Soon — badge background */
  --sn-amber-border:   #F59E0B;   /* Expiring Soon — badge border */

  --sn-red:            #B91C1C;   /* Expired — text */
  --sn-red-bg:         #FEE2E2;   /* Expired — badge background */
  --sn-red-border:     #F87171;   /* Expired — badge border */

  --sn-purple:         #4338CA;   /* Under Renewal — text */
  --sn-purple-bg:      #EEF2FF;   /* Under Renewal — badge background */
  --sn-purple-border:  #818CF8;   /* Under Renewal — badge border */

  /* ── UI Structure ── */
  --sn-sidebar-width:  240px;
  --sn-topbar-height:  56px;
  --sn-card-radius:    8px;
  --sn-input-radius:   6px;
  --sn-shadow-card:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  --sn-shadow-modal:   0 20px 60px rgba(0,0,0,0.18);

  /* ── Typography ── */
  --sn-font:           'Inter', 'Segoe UI', system-ui, sans-serif;
  --sn-font-mono:      'JetBrains Mono', 'Fira Code', monospace;
}
```

### 1.2 Status Badge Mapping

Use this mapping consistently across all pages:

| Status Value     | Label           | Text Color         | Background          | Border                | Icon (Lucide)    |
|------------------|-----------------|--------------------|---------------------|-----------------------|------------------|
| `active`         | Active          | `--sn-green`       | `--sn-green-bg`     | `--sn-green-border`   | `CheckCircle2`   |
| `expiring_soon`  | Expiring Soon   | `--sn-amber`       | `--sn-amber-bg`     | `--sn-amber-border`   | `Clock`          |
| `expired`        | Expired         | `--sn-red`         | `--sn-red-bg`       | `--sn-red-border`     | `XCircle`        |
| `under_renewal`  | Under Renewal   | `--sn-purple`      | `--sn-purple-bg`    | `--sn-purple-border`  | `RefreshCw`      |

### 1.3 Lucide React Icon Reference

Install: `npm install lucide-react`

```jsx
// Icons used across the application — import as needed per page
import {
  // Navigation
  LayoutDashboard,   // Dashboard
  Building2,         // Facilities
  FileText,          // Licenses
  Bell,              // Alerts
  ClipboardList,     // Form Checklist
  Upload,            // Evidence Files
  History,           // Audit Log
  Settings,          // Administration

  // Actions
  Plus,              // Add new record
  Search,            // Search inputs
  Filter,            // Filter panel toggle
  Pencil,            // Edit
  Trash2,            // Delete
  Eye,               // View detail
  Download,          // Download file
  RefreshCw,         // Under Renewal / Refresh

  // Status
  CheckCircle2,      // Active / Completed
  Clock,             // Expiring Soon
  XCircle,           // Expired / Error
  AlertTriangle,     // Warning
  ShieldCheck,       // ACL / Security

  // Data & Form
  Calendar,          // Date fields
  User,              // User reference fields
  ChevronRight,      // Stage arrow / breadcrumb
  ChevronDown,       // Dropdown
  ArrowRight,        // Stage pipeline arrows
  FileUp,            // File upload trigger
  Paperclip,         // Attachment
  CheckSquare,       // Checklist item
  Square,            // Unchecked checklist item
  ClipboardCheck,    // Checklist complete
  Hash,              // License number
  MapPin,            // Facility address
  Shield,            // Role / permission
  LogOut,            // Logout
  X,                 // Close modal / clear input
  Info,              // Tooltip / info
  ExternalLink,      // Open in ServiceNow
} from 'lucide-react';
```

### 1.4 Typography Scale

```css
.sn-heading-1  { font-size: 22px; font-weight: 700; color: var(--sn-navy); }
.sn-heading-2  { font-size: 16px; font-weight: 600; color: var(--sn-navy); }
.sn-heading-3  { font-size: 13px; font-weight: 600; color: var(--sn-gray-500); text-transform: uppercase; letter-spacing: 0.06em; }
.sn-body       { font-size: 14px; font-weight: 400; color: var(--sn-gray-700); }
.sn-caption    { font-size: 12px; font-weight: 400; color: var(--sn-gray-500); }
.sn-mono       { font-family: var(--sn-font-mono); font-size: 12px; }
```

---

## 2. COMPONENT ARCHITECTURE

```
src/client/
├── index.html
├── main.jsx                          # React entry point + Router
├── tokens.css                        # CSS custom properties (design tokens)
├── App.jsx                           # Route definitions + AppShell
│
├── layout/
│   ├── AppShell.jsx                  # Sidebar + Topbar wrapper
│   ├── Sidebar.jsx                   # Left navigation rail
│   ├── Topbar.jsx                    # Top bar with breadcrumb + user
│   └── layout.css
│
├── pages/
│   ├── Dashboard/
│   │   ├── LTODashboard.jsx          # Page 01
│   │   └── LTODashboard.css
│   ├── Facilities/
│   │   ├── FacilitiesList.jsx        # Page 02
│   │   ├── FacilityForm.jsx          # Page 03
│   │   └── facilities.css
│   ├── Licenses/
│   │   ├── LicensesList.jsx          # Page 04
│   │   ├── LicenseDetail.jsx         # Page 05
│   │   ├── LicenseForm.jsx           # Page 06
│   │   └── licenses.css
│   ├── Checklist/
│   │   ├── FormChecklist.jsx         # Page 07
│   │   └── checklist.css
│   ├── Evidence/
│   │   ├── EvidenceFiles.jsx         # Page 08
│   │   └── evidence.css
│   ├── AuditLog/
│   │   ├── AuditLog.jsx              # Page 09
│   │   └── auditlog.css
│   └── Alerts/
│       ├── AlertsPage.jsx            # Page 10
│       └── alerts.css
│
├── components/
│   ├── StatusBadge.jsx               # Shared — license status pill
│   ├── StagePipeline.jsx             # Shared — renewal stage stepper
│   ├── StatCard.jsx                  # Shared — dashboard KPI card
│   ├── DataTable.jsx                 # Shared — sortable/filterable table
│   ├── ConfirmModal.jsx              # Shared — delete/action confirmation
│   ├── EmptyState.jsx                # Shared — zero-data state
│   ├── PageHeader.jsx                # Shared — title + breadcrumb + CTA
│   └── components.css
│
└── services/
    └── LTOService.js                 # REST API calls to ServiceNow Table API
```

---

## 3. PAGE INVENTORY

| # | Page Name         | File Path                          | Route                         | Roles Allowed         |
|---|-------------------|------------------------------------|-------------------------------|-----------------------|
| 1 | Dashboard         | `pages/Dashboard/LTODashboard.jsx` | `/`                           | Admin, Viewer         |
| 2 | Facilities List   | `pages/Facilities/FacilitiesList.jsx` | `/facilities`              | Admin, Viewer         |
| 3 | Facility Form     | `pages/Facilities/FacilityForm.jsx`   | `/facilities/new`, `/facilities/:id/edit` | Admin only |
| 4 | Licenses List     | `pages/Licenses/LicensesList.jsx`  | `/licenses`                   | Admin, Viewer         |
| 5 | License Detail    | `pages/Licenses/LicenseDetail.jsx` | `/licenses/:id`               | Admin, Viewer         |
| 6 | License Form      | `pages/Licenses/LicenseForm.jsx`   | `/licenses/new`, `/licenses/:id/edit` | Admin only   |
| 7 | Form Checklist    | `pages/Checklist/FormChecklist.jsx`| `/licenses/:id/checklist`     | Admin, Viewer         |
| 8 | Evidence Files    | `pages/Evidence/EvidenceFiles.jsx` | `/licenses/:id/evidence`      | Admin, Viewer         |
| 9 | Audit Log         | `pages/AuditLog/AuditLog.jsx`      | `/audit-log`                  | Admin, Viewer         |
|10 | Alerts            | `pages/Alerts/AlertsPage.jsx`      | `/alerts`                     | Admin, Viewer         |

---

## 4. PAGE 01 — DASHBOARD

**File:** `src/client/pages/Dashboard/LTODashboard.jsx`  
**Route:** `/`  
**Purpose:** At-a-glance compliance health for all facilities — KPI cards, expiring licenses table, recent alerts feed.  
**API Table:** `x_1998335_health_l_license`, `x_1998335_health_l_alert`

### 4.1 Layout Wireframe

```
┌─ PageHeader ─────────────────────────────────────────────────────────┐
│  🛡 LTO Compliance Dashboard          Last updated: Apr 16, 2026     │
└──────────────────────────────────────────────────────────────────────┘

┌─ StatCard ─┐  ┌─ StatCard ─┐  ┌─ StatCard ──┐  ┌─ StatCard ──────┐
│ ✅ Active  │  │ ⚠ Expiring │  │ ✗ Expired  │  │ 🔄 Renewing    │
│  count: N  │  │  count: N  │  │  count: N  │  │   count: N     │
└────────────┘  └────────────┘  └────────────┘  └────────────────┘

┌─ Expiring Within 90 Days (DataTable) ─────────────────────────────┐
│  Facility │ License Type │ License # │ Expiry Date │ Days │ Stage │
│  ...      │ ...          │ ...       │ ...         │ ...  │ ...   │
└───────────────────────────────────────────────────────────────────┘

┌─ Recent Alerts (feed) ────────────────────────────────────────────┐
│  🔔 Alert threshold │ License │ Days left │ Sent at │ Channel    │
└───────────────────────────────────────────────────────────────────┘
```

### 4.2 Component Breakdown

#### `<StatCard>` — 4 instances

| Prop          | Active           | Expiring Soon    | Expired          | Under Renewal    |
|---------------|------------------|------------------|------------------|------------------|
| `icon`        | `CheckCircle2`   | `Clock`          | `XCircle`        | `RefreshCw`      |
| `label`       | "Active"         | "Expiring Soon"  | "Expired"        | "Under Renewal"  |
| `iconColor`   | `--sn-green`     | `--sn-amber`     | `--sn-red`       | `--sn-purple`    |
| `bgColor`     | `--sn-green-bg`  | `--sn-amber-bg`  | `--sn-red-bg`    | `--sn-purple-bg` |
| `count`       | fetched          | fetched          | fetched          | fetched          |
| `onClick`     | navigate `/licenses?status=active` | ...`expiring_soon` | ...`expired` | ...`under_renewal` |

**StatCard must render a subtle bottom border in the card's semantic color to reinforce status at a glance.**

#### Expiring Licenses `<DataTable>`

- **Columns:** Facility Name, License Type, License Number, Expiry Date, Days Remaining, Renewal Stage, Actions (Eye icon → `/licenses/:id`)
- **Sort:** Default ascending by `expiry_date`
- **Row color:** Rows where `days_before_expiry ≤ 7` get a left-side `--sn-red` accent bar; `≤ 30` get `--sn-amber`
- **Empty state:** `<EmptyState icon={CheckCircle2} message="No licenses expiring in the next 90 days" />`

#### Recent Alerts Feed

- Show last **10** alert records, newest first
- Each row: Bell icon, threshold badge (e.g., "7-Day Alert"), license reference link, facility name, sent-at timestamp, channel chip (`Email` / `In-App`)
- No pagination needed — link "View all alerts →" navigates to `/alerts`

### 4.3 State & Data Fetching

```jsx
// LTODashboard.jsx — state shape
const [stats, setStats] = useState({ active: 0, expiring_soon: 0, expired: 0, under_renewal: 0 });
const [expiringLicenses, setExpiringLicenses] = useState([]);
const [recentAlerts, setRecentAlerts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  Promise.all([
    LTOService.getLicenseStatusCounts(),   // returns { active, expiring_soon, expired, under_renewal }
    LTOService.getExpiringLicenses(90),    // days_before_expiry <= 90, sorted ASC
    LTOService.getRecentAlerts(10),        // last 10 by sys_created_on DESC
  ]).then(([counts, expiring, alerts]) => {
    setStats(counts);
    setExpiringLicenses(expiring);
    setRecentAlerts(alerts);
    setLoading(false);
  });
}, []);
```

### 4.4 Key Implementation Notes

- The four StatCards must be in a CSS grid: `grid-template-columns: repeat(4, 1fr)` — collapse to 2 on tablet, 1 on mobile
- Use `Intl.DateTimeFormat('en-PH')` for all date display (Philippine locale)
- Add a subtle "Now Platform" wordmark in the top-right of the topbar to reinforce platform context
- The dashboard auto-refreshes on every mount — no manual refresh button needed

---

## 5. PAGE 02 — FACILITIES LIST

**File:** `src/client/pages/Facilities/FacilitiesList.jsx`  
**Route:** `/facilities`  
**Purpose:** Paginated list of all healthcare facilities with quick search and inline status indicators.  
**API Table:** `x_1998335_health_l_facility`

### 5.1 Layout Wireframe

```
┌─ PageHeader ──────────────────────────────────────────────────────┐
│  Building2  Facilities                          [+ New Facility]  │
└───────────────────────────────────────────────────────────────────┘

┌─ Search + Filter Bar ─────────────────────────────────────────────┐
│  🔍 Search by name or DOH license...   [Facility Type ▾]  [Clear] │
└───────────────────────────────────────────────────────────────────┘

┌─ DataTable ───────────────────────────────────────────────────────┐
│ # │ Facility Name      │ DOH License # │ Type          │ Officer  │ Licenses │ Actions │
│ 1 │ Metro Health Hosp  │ DOH-2021-001  │ Hospital      │ J. Cruz  │ 3        │ 👁 ✏    │
│ 2 │ City Radiology Ctr │ DOH-2022-014  │ Radiology Ctr │ M. Reyes │ 1        │ 👁 ✏    │
└───────────────────────────────────────────────────────────────────┘
Showing 1–10 of 24                              [← Prev]  [1] [2]  [Next →]
```

### 5.2 Fields Displayed

| Column           | Source Field               | Notes                                     |
|------------------|----------------------------|-------------------------------------------|
| Facility Name    | `name`                     | Clickable → navigates to facility detail  |
| DOH License #    | `doh_license_number`       | Monospace font (`--sn-font-mono`)         |
| Facility Type    | `facility_type`            | Chip: Hospital / Dialysis / Lab / Radiology |
| Compliance Officer | `compliance_officer.name`| User display name                         |
| Active Licenses  | Computed count from License table | Show integer                       |
| Actions          | —                          | `Eye` (view detail) + `Pencil` (edit, admin only) |

### 5.3 Filters

- **Search:** Free-text, filters on `name` LIKE and `doh_license_number` LIKE
- **Facility Type dropdown:** `All Types | Hospital | Dialysis Center | Clinical Laboratory | Radiology Center`
- **Filter chips** appear below the search bar when active (closeable with `X` icon)

### 5.4 Facility Type Chip Colors

| Type                 | Background    | Text           |
|----------------------|---------------|----------------|
| Hospital             | `#E8F3FF`     | `#004C97`      |
| Dialysis Center      | `#F3E8FF`     | `#5B21B6`      |
| Clinical Laboratory  | `#E8FFF3`     | `#065F46`      |
| Radiology Center     | `#FFF3E8`     | `#92400E`      |

### 5.5 State

```jsx
const [facilities, setFacilities] = useState([]);
const [search, setSearch] = useState('');
const [typeFilter, setTypeFilter] = useState('all');
const [page, setPage] = useState(1);
const PAGE_SIZE = 10;
```

---

## 6. PAGE 03 — FACILITY FORM (CREATE / EDIT)

**File:** `src/client/pages/Facilities/FacilityForm.jsx`  
**Routes:** `/facilities/new` and `/facilities/:id/edit`  
**Purpose:** Create a new facility or edit an existing one.  
**API Table:** `x_1998335_health_l_facility`

### 6.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  ← Back   Building2  New Facility  /  Edit: Metro Health Hospital   │
└─────────────────────────────────────────────────────────────────────┘

┌─ Card: Facility Information ────────────────────────────────────────┐
│  Facility Name *                DOH License Number *               │
│  [________________________________] [______________________________]│
│                                                                     │
│  Facility Type *                Compliance Officer *               │
│  [Dropdown ▾]                   [User Picker ▾]                    │
│                                                                     │
│  Address                                                            │
│  [_________________________________________________________________]│
│                                                                     │
│  Active  [● Toggle]                                                 │
└─────────────────────────────────────────────────────────────────────┘

                         [Cancel]  [💾 Save Facility]
```

### 6.2 Field Specifications

| Field               | Type          | Required | Validation                                | Icon Prefix   |
|---------------------|---------------|----------|-------------------------------------------|---------------|
| `name`              | Text          | ✅       | Max 200 chars                             | `Building2`   |
| `doh_license_number`| Text          | ✅       | Unique — validated on blur via API        | `Hash`        |
| `facility_type`     | Select        | ✅       | Enum: hospital, dialysis_center, clinical_lab, radiology_center | — |
| `compliance_officer`| User ref      | ✅       | Lookup from sys_user with admin role      | `User`        |
| `address`           | Textarea      | ❌       | Max 500 chars                             | `MapPin`      |
| `active`            | Toggle        | ✅       | Default: true                             | —             |

### 6.3 Validation Rules

- `doh_license_number`: On blur, call `LTOService.checkDuplicateDOHNumber(value, currentId)` — show inline error `"This DOH License Number is already registered"` with a red border + `AlertTriangle` icon if duplicate found
- All required fields show `*` and display error text below on submit attempt
- Save button is disabled while `saving === true` — show spinner inside button

### 6.4 State

```jsx
const [form, setForm] = useState({
  name: '', doh_license_number: '', facility_type: '',
  compliance_officer: '', address: '', active: true,
});
const [errors, setErrors] = useState({});
const [saving, setSaving] = useState(false);
const isEditMode = !!id; // from useParams
```

---

## 7. PAGE 04 — LICENSES LIST

**File:** `src/client/pages/Licenses/LicensesList.jsx`  
**Route:** `/licenses`  
**Purpose:** Full registry of all DOH LTO and OLRS licenses with color-coded status, filter tabs, and quick access to detail/edit.  
**API Table:** `x_1998335_health_l_license`

### 7.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  FileText  All Licenses                          [+ New License]   │
└─────────────────────────────────────────────────────────────────────┘

┌─ Tab Bar ───────────────────────────────────────────────────────────┐
│  [All (42)]  [Active (28)]  [Expiring Soon (8)]  [Expired (3)]  [Under Renewal (3)] │
└─────────────────────────────────────────────────────────────────────┘

┌─ Search + Filter Row ───────────────────────────────────────────────┐
│  🔍 Search facility or license #...    [License Type ▾]  [Clear]   │
└─────────────────────────────────────────────────────────────────────┘

┌─ DataTable ─────────────────────────────────────────────────────────┐
│ Facility    │ License Type       │ License #    │ Expiry    │ Days │ Status     │ Stage          │ Actions │
│ Metro Hosp  │ DOH LTO (Main)     │ LTO-2024-01  │ Dec 31    │ 259  │ ● Active   │ Not Started    │ 👁 ✏    │
│ City Radio  │ OLRS – Radiology   │ OLR-2024-07  │ Apr 30    │  14  │ ⚠ Expiring │ Docs Gathering │ 👁 ✏    │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Tab Bar Behavior

- Each tab label shows a count badge in parentheses — counts update on load
- Active tab has `--sn-blue-primary` bottom border (2px) and `--sn-blue-primary` text
- Default tab is "All"
- Tab selection updates the `?status=` query parameter so URL is shareable

### 7.3 Columns

| Column        | Source Field           | Render Notes                                                      |
|---------------|------------------------|-------------------------------------------------------------------|
| Facility      | `facility.name`        | Clickable link → `/facilities/:facilityId`                        |
| License Type  | `license_type`         | Chip (see §7.4 below)                                             |
| License #     | `license_number`       | Monospace                                                         |
| Expiry Date   | `expiry_date`          | Formatted `MMM DD, YYYY` (en-PH)                                  |
| Days Left     | `days_before_expiry`   | Numeric; red if ≤ 7, amber if ≤ 30, else default text            |
| Status        | `status`               | `<StatusBadge>` component                                         |
| Stage         | `renewal_stage`        | Text label only (not the full stepper — that's on detail page)    |
| Actions       | —                      | `Eye` → detail, `Pencil` → edit (admin), `ClipboardList` → checklist |

### 7.4 License Type Chips

| Type                       | Background  | Text       |
|----------------------------|-------------|------------|
| DOH LTO (Main)             | `#E8F3FF`   | `#004C97`  |
| OLRS Variation — Radiology | `#FFF3E8`   | `#92400E`  |
| OLRS Variation — Pharmacy  | `#E8FFF3`   | `#065F46`  |

### 7.5 State

```jsx
const [licenses, setLicenses] = useState([]);
const [activeTab, setActiveTab] = useState('all'); // synced with ?status= param
const [search, setSearch] = useState('');
const [typeFilter, setTypeFilter] = useState('all');
const [counts, setCounts] = useState({ all: 0, active: 0, expiring_soon: 0, expired: 0, under_renewal: 0 });
```

---

## 8. PAGE 05 — LICENSE DETAIL

**File:** `src/client/pages/Licenses/LicenseDetail.jsx`  
**Route:** `/licenses/:id`  
**Purpose:** Full view of a single license — header summary, renewal stage pipeline, quick links to checklist, evidence, and audit log entries for this license.  
**API Table:** `x_1998335_health_l_license`, `x_1998335_health_l_form_checklist`, `x_1998335_health_l_evidence_file`

### 8.1 Layout Wireframe

```
┌─ PageHeader ──────────────────────────────────────────────────────────────┐
│  ← Licenses   FileText  LTO-2024-001 — Metro Health Hospital              │
│                                         [✏ Edit License]  [🗑 Delete]     │
└───────────────────────────────────────────────────────────────────────────┘

┌─ License Summary Card ────────────────────────────────────────────────────┐
│  License Number: LTO-2024-001       Facility: Metro Health Hospital        │
│  License Type:   DOH LTO (Main)     Compliance Officer: Juan Cruz          │
│  Issue Date:     Jan 01, 2024       Expiry Date: Dec 31, 2024             │
│  Days Remaining: [14 days]          Status: ⚠ Expiring Soon               │
│  Notes: [Free text]                                                        │
└───────────────────────────────────────────────────────────────────────────┘

┌─ Renewal Stage Pipeline ──────────────────────────────────────────────────┐
│  ● Not Started → ● Docs Gathering → ● Submitted to DOH → ○ Under Eval → ○ Released │
│                                                                            │
│  Current: Submitted to DOH          [Advance Stage →]   (admin only)      │
└───────────────────────────────────────────────────────────────────────────┘

┌─ Tabs: [Checklist (7/7)] [Evidence Files (3)] [Audit Log (12)] ──────────┐
│  (renders respective sub-views inline)                                    │
└───────────────────────────────────────────────────────────────────────────┘
```

### 8.2 License Summary Card Fields

| Label              | Source Field              | Display                                              |
|--------------------|---------------------------|------------------------------------------------------|
| License Number     | `license_number`          | Monospace, copyable (click → copy to clipboard)      |
| Facility           | `facility.name`           | Link → `/facilities/:facilityId`                     |
| License Type       | `license_type`            | Type chip (same as list page)                        |
| Compliance Officer | `facility.compliance_officer.name` | `User` icon prefix                          |
| Issue Date         | `issue_date`              | Formatted                                            |
| Expiry Date        | `expiry_date`             | Formatted + color coded by proximity                 |
| Days Remaining     | `days_before_expiry`      | Bold number + color; if negative, show "Expired N days ago" |
| Status             | `status`                  | `<StatusBadge>` — large variant                      |
| Notes              | `notes`                   | Multiline; "No notes" if empty                       |

### 8.3 Renewal Stage Pipeline (`<StagePipeline>`)

Stages in order:

```
Not Started (0) → Documents Gathering (1) → Submitted to DOH (2) → Under Evaluation (3) → Released (4)
```

**Render rules:**
- Completed stages: filled circle `●` in `--sn-blue-primary`, connecting line solid
- Current stage: filled circle in `--sn-navy`, label **bold**
- Pending stages: empty circle `○` in `--sn-gray-300`, connecting line dashed
- The "Advance Stage →" button calls `LTOService.advanceRenewalStage(id)` — triggers `<ConfirmModal>` before proceeding
- Stage **cannot go backward** (enforced by BR-L-03 on server; button simply hides past stages)

### 8.4 Inline Sub-Tabs

| Tab               | Renders                             | Quick Link Button                   |
|-------------------|-------------------------------------|-------------------------------------|
| Checklist (N/M)   | Compact checklist items list        | `ClipboardList` → Full checklist page |
| Evidence Files (N)| File list with download links       | `Upload` → Full evidence page       |
| Audit Log (N)     | Last 5 entries for this license     | `History` → Full audit log (filtered) |

---

## 9. PAGE 06 — LICENSE FORM (CREATE / EDIT)

**File:** `src/client/pages/Licenses/LicenseForm.jsx`  
**Routes:** `/licenses/new` and `/licenses/:id/edit`  
**Purpose:** Create a new license record or edit an existing one. On create, ServiceNow BR-L-02 auto-generates the form checklist.  
**API Table:** `x_1998335_health_l_license`

### 9.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  ← Back   FileText  New License  /  Edit License: LTO-2024-001     │
└─────────────────────────────────────────────────────────────────────┘

┌─ Card: License Information ─────────────────────────────────────────┐
│  License Number *               Facility *                          │
│  [______________________________] [Facility Picker ▾]               │
│                                                                     │
│  License Type *                                                     │
│  ○ DOH LTO (Main)  ○ OLRS Variation — Radiology  ○ OLRS — Pharmacy │
│                                                                     │
│  Issue Date *                   Expiry Date *                      │
│  [📅 _______________]            [📅 _______________]               │
│                                                                     │
│  Renewal Stage                  (Status — read-only, computed)      │
│  [Not Started ▾]               [● Active]                          │
│                                                                     │
│  Notes                                                              │
│  [_________________________________________________________________]│
└─────────────────────────────────────────────────────────────────────┘

  ⓘ Form checklist items will be auto-generated based on License Type.

                         [Cancel]  [💾 Save License]
```

### 9.2 Field Specifications

| Field            | Type           | Required | Notes                                                  |
|------------------|----------------|----------|--------------------------------------------------------|
| `license_number` | Text           | ✅       | Unique; validate via API on blur                       |
| `facility`       | Reference      | ✅       | Searchable dropdown from facility table                |
| `license_type`   | Radio Group    | ✅       | 3 options; changing type shows a preview of checklist items |
| `issue_date`     | Date           | ✅       | Cannot be in the future                                |
| `expiry_date`    | Date           | ✅       | Must be after `issue_date`; triggers days computation  |
| `renewal_stage`  | Select         | ❌       | Default: `not_started`; admin only; forward-only       |
| `status`         | Read-only      | —        | Displayed as `<StatusBadge>`; computed from dates      |
| `notes`          | Textarea       | ❌       | Free text; max 1000 chars                              |

### 9.3 Checklist Preview Banner

When a `license_type` is selected, render an info banner below the radio group:

```
ⓘ This license type requires 7 documents. The following checklist will be auto-generated:
   Application Form · PHILHealth COC · Fire Safety Certificate · Sanitary Permit
   · Building Permit · Medical Staff List · Organizational Chart
```

Use `Info` icon from Lucide. Background: `--sn-blue-light`. Text: `--sn-blue-dark`.

---

## 10. PAGE 07 — FORM CHECKLIST

**File:** `src/client/pages/Checklist/FormChecklist.jsx`  
**Route:** `/licenses/:id/checklist`  
**Purpose:** Track and mark required documentary requirements per license type. Shows completion progress.  
**API Table:** `x_1998335_health_l_form_checklist`

### 10.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  ← License Detail   ClipboardList  Form Checklist                  │
│  LTO-2024-001 — Metro Health Hospital · DOH LTO (Main)             │
└─────────────────────────────────────────────────────────────────────┘

┌─ Progress Bar Card ─────────────────────────────────────────────────┐
│  [████████████████░░░░]  5 of 7 forms completed  (71%)             │
└─────────────────────────────────────────────────────────────────────┘

┌─ Checklist Items ───────────────────────────────────────────────────┐
│  ✅ Application Form                     Completed by: J. Cruz, Apr 10 │
│  ✅ PHILHealth COC                       Completed by: J. Cruz, Apr 10 │
│  ✅ Fire Safety Certificate              Completed by: J. Cruz, Apr 11 │
│  ✅ Sanitary Permit                      Completed by: J. Cruz, Apr 11 │
│  ✅ Building Permit                      Completed by: J. Cruz, Apr 12 │
│  ☐  Medical Staff List                   Not yet completed            │
│  ☐  Organizational Chart                 Not yet completed            │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Checklist Item Row

Each row contains:

- **Checkbox** (admin can toggle; viewer sees it read-only)
  - Checked: `CheckSquare` icon in `--sn-green`
  - Unchecked: `Square` icon in `--sn-gray-300`
- **Form Name** — bold, struck-through when completed
- **Purpose** — subtext in `--sn-gray-500`
- **Completion metadata** — shown only when `is_completed = true`: `"Completed by [user] on [date]"` in `--sn-caption`
- Toggling a checkbox calls `LTOService.toggleChecklistItem(itemId, currentState)` — no confirmation modal needed

### 10.3 Progress Bar

- Full-width bar with `--sn-blue-primary` fill
- Percentage computed client-side: `Math.round((completed / total) * 100)`
- When 100%: bar turns `--sn-green`, label reads "All documents complete ✅"

### 10.4 Predefined Checklist Items by License Type

| License Type        | Required Documents                                                                                         |
|---------------------|------------------------------------------------------------------------------------------------------------|
| DOH LTO (Main)      | Application Form, PHILHealth COC, Fire Safety Certificate, Sanitary Permit, Building Permit, Medical Staff List, Organizational Chart |
| OLRS – Radiology    | Application Form, RSO Certificate, Source Inventory, Regional Inspection Report, Equipment Registration    |
| OLRS – Pharmacy     | Application Form, FDA Registration, Pharmacist License, DEA Registration, Floor Plan                      |

---

## 11. PAGE 08 — EVIDENCE FILES

**File:** `src/client/pages/Evidence/EvidenceFiles.jsx`  
**Route:** `/licenses/:id/evidence`  
**Purpose:** Upload, view, and manage scanned documentary evidence per license.  
**API Table:** `x_1998335_health_l_evidence_file`

### 11.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  ← License Detail   Upload  Evidence Files                         │
│  LTO-2024-001 — Metro Health Hospital                 [+ Upload]   │
└─────────────────────────────────────────────────────────────────────┘

┌─ Upload Drop Zone ──────────────────────────────────────────────────┐
│                                                                     │
│          FileUp  Drag & drop files here, or click to browse         │
│          Accepted: PDF, JPG, PNG, DOCX  ·  Max 10 MB each           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ File List ─────────────────────────────────────────────────────────┐
│  📄 application_form.pdf       Form        J. Cruz · Apr 10 · 1.2 MB  [↓] [🗑] │
│  🖼 sanitary_permit.jpg       Certificate  J. Cruz · Apr 11 · 0.8 MB  [↓] [🗑] │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 File Type Icons

| File Extension | Icon               | Color         |
|----------------|--------------------|---------------|
| `.pdf`         | `FileText`         | `#CC0000`     |
| `.jpg`, `.png` | `Image` (Lucide)   | `#2563EB`     |
| `.docx`        | `FileText`         | `#1D4ED8`     |
| Other          | `Paperclip`        | `--sn-gray-500` |

### 11.3 Upload Modal

Triggered by clicking "Upload" in the drop zone or the `[+ Upload]` button:

```
┌─ Upload Evidence File ──────────────────────────────────────────────┐
│  File: [Selected: application_form.pdf  1.2 MB]                    │
│  File Type *: [Form ▾]                                              │
│                                                                     │
│  ⓘ Max file size: 10 MB. Accepted: PDF, JPG, PNG, DOCX             │
│                               [Cancel]  [📎 Attach File]           │
└─────────────────────────────────────────────────────────────────────┘
```

**Client-side validation (CS-01):**
- Reject if `file.size > 10 * 1024 * 1024` — show inline error: `"File exceeds 10 MB limit"`
- Reject if extension not in `[.pdf, .jpg, .jpeg, .png, .docx]` — show inline error

### 11.4 File Type Dropdown Options

`Form | Receipt | Certificate | Inspection Report | Other`

---

## 12. PAGE 09 — AUDIT LOG

**File:** `src/client/pages/AuditLog/AuditLog.jsx`  
**Route:** `/audit-log`  
**Purpose:** Immutable, read-only view of all system changes. Can be filtered by facility, license, or action type.  
**API Table:** `x_1998335_health_l_audit_log`

### 12.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  History  Audit Log                               [No write access] │
└─────────────────────────────────────────────────────────────────────┘

┌─ Filter Bar ────────────────────────────────────────────────────────┐
│  🔍 Search...   [Facility ▾]   [Action Type ▾]   [Date Range 📅]   │
└─────────────────────────────────────────────────────────────────────┘

┌─ Audit Table ───────────────────────────────────────────────────────┐
│ Timestamp           │ Changed By  │ Action           │ Record     │ Field       │ Old Value    │ New Value       │
│ Apr 16, 10:32 AM    │ J. Cruz     │ Stage Changed    │ LTO-001    │ stage       │ Not Started  │ Docs Gathering  │
│ Apr 15, 3:14 PM     │ System      │ Status Updated   │ LTO-002    │ status      │ Active       │ Expiring Soon   │
└─────────────────────────────────────────────────────────────────────┘
Showing 1–20 of 143                              [← Prev]  [1][2][3] [Next →]
```

### 12.2 Display Rules

- **Changed By = System** → render in `--sn-gray-500` italic; append `⚙` prefix
- **Action = "Stage Changed"** → bold the action cell in `--sn-blue-primary`
- **Old Value → New Value** → render with a `ChevronRight` separator (e.g., `Not Started → Docs Gathering`)
- Records are **read-only** — no edit or delete actions rendered at all
- Show a `ShieldCheck` info badge in the header: `"Audit records are immutable and system-protected"`

### 12.3 Filters

- **Facility:** Reference dropdown; pre-populated with all facility names
- **Action Type:** `All | Stage Changed | Status Updated | Record Created | Record Updated | File Uploaded`
- **Date Range:** Two date pickers: `From` and `To`; default to last 30 days
- All filters combine with AND logic

---

## 13. PAGE 10 — ALERTS

**File:** `src/client/pages/Alerts/AlertsPage.jsx`  
**Route:** `/alerts`  
**Purpose:** Full list of all system-generated expiry alerts with filtering by threshold and channel.  
**API Table:** `x_1998335_health_l_alert`

### 13.1 Layout Wireframe

```
┌─ PageHeader ────────────────────────────────────────────────────────┐
│  Bell  Alerts                                       [No write access]│
└─────────────────────────────────────────────────────────────────────┘

┌─ Filter Row ────────────────────────────────────────────────────────┐
│  [All Thresholds ▾]   [All Channels ▾]   [Facility ▾]   [Clear]    │
└─────────────────────────────────────────────────────────────────────┘

┌─ Alert Table ───────────────────────────────────────────────────────┐
│ Sent At          │ License    │ Facility          │ Threshold │ Channel │ Status │
│ Apr 9, 06:00 AM  │ LTO-001    │ Metro Health Hosp │ 7-Day     │ Email   │ ✅ Sent │
│ Apr 2, 06:00 AM  │ OLR-007    │ City Radiology    │ 30-Day    │ In-App  │ ✅ Sent │
│ Mar 6, 06:00 AM  │ LTO-003    │ St. Luke's Lab    │ 60-Day    │ Email   │ ✗ Failed│
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 Threshold Chip Colors

| Threshold | Background  | Text       | Urgency          |
|-----------|-------------|------------|------------------|
| 90-Day    | `#E8F3FF`   | `#004C97`  | Informational    |
| 60-Day    | `#FFF3E8`   | `#92400E`  | Moderate         |
| 30-Day    | `#FEF3C7`   | `#B45309`  | High             |
| 7-Day     | `#FEE2E2`   | `#B91C1C`  | Critical         |

### 13.3 Channel & Status Display

- **Channel:** `Bell` icon + label `Email` or `In-App`
- **Status Sent:** `CheckCircle2` in `--sn-green`
- **Status Failed:** `XCircle` in `--sn-red` + tooltip "Alert delivery failed — check email configuration"
- Alerts are **system-created only** — no create/edit/delete buttons rendered

---

## 14. SHARED COMPONENTS

### 14.1 `<StatusBadge status="active|expiring_soon|expired|under_renewal" size="sm|md|lg" />`

```jsx
// components/StatusBadge.jsx
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

const config = {
  active:         { label: 'Active',         icon: CheckCircle2, textVar: '--sn-green',  bgVar: '--sn-green-bg',  borderVar: '--sn-green-border'  },
  expiring_soon:  { label: 'Expiring Soon',  icon: Clock,        textVar: '--sn-amber',  bgVar: '--sn-amber-bg',  borderVar: '--sn-amber-border'  },
  expired:        { label: 'Expired',        icon: XCircle,      textVar: '--sn-red',    bgVar: '--sn-red-bg',    borderVar: '--sn-red-border'    },
  under_renewal:  { label: 'Under Renewal',  icon: RefreshCw,    textVar: '--sn-purple', bgVar: '--sn-purple-bg', borderVar: '--sn-purple-border' },
};
```

Renders a pill with icon + label. `size="lg"` on detail pages; `size="sm"` on list pages.

---

### 14.2 `<StagePipeline currentStage="not_started|documents_gathering|submitted_to_doh|under_evaluation|released" />`

Horizontal stepper with 5 nodes. Uses `ChevronRight` as connectors between stages. Nodes:

| Value                 | Label               | Step |
|-----------------------|---------------------|------|
| `not_started`         | Not Started         | 0    |
| `documents_gathering` | Documents Gathering | 1    |
| `submitted_to_doh`    | Submitted to DOH    | 2    |
| `under_evaluation`    | Under Evaluation    | 3    |
| `released`            | Released            | 4    |

Completed nodes fill with `--sn-blue-primary`. Current node fills with `--sn-navy`. Pending nodes render `--sn-gray-300`.

---

### 14.3 `<PageHeader title icon breadcrumbs actions />`

Renders:
- Left: Lucide icon + page title + breadcrumb trail (separated by `ChevronRight`)
- Right: Action buttons (New / Edit / etc.)
- Bottom: 1px divider in `--sn-gray-300`

---

### 14.4 `<EmptyState icon message subtext action />`

Centered card shown when a table or list has no results:
- Large icon in `--sn-gray-300` (48px)
- `message` in `--sn-heading-2`
- Optional `subtext` in `--sn-caption`
- Optional `action` renders a CTA button

---

### 14.5 `<ConfirmModal title message confirmLabel onConfirm onCancel />`

Overlay modal for destructive actions (delete, stage advance):
- `AlertTriangle` icon in `--sn-amber`
- Title + description text
- `[Cancel]` (outline) + `[Confirm]` (solid `--sn-red` for delete, `--sn-blue-primary` for advance)

---

### 14.6 `<DataTable columns data loading emptyState />`

Reusable table component:
- Column-level sort (toggle ASC/DESC on header click)
- Hover row: `background: var(--sn-blue-light)`
- Skeleton loading rows when `loading === true`
- Sticky header

---

## 15. ROUTING & NAVIGATION SHELL

### 15.1 `App.jsx` Routes

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layout/AppShell';

// Pages
import LTODashboard from './pages/Dashboard/LTODashboard';
import FacilitiesList from './pages/Facilities/FacilitiesList';
import FacilityForm from './pages/Facilities/FacilityForm';
import LicensesList from './pages/Licenses/LicensesList';
import LicenseDetail from './pages/Licenses/LicenseDetail';
import LicenseForm from './pages/Licenses/LicenseForm';
import FormChecklist from './pages/Checklist/FormChecklist';
import EvidenceFiles from './pages/Evidence/EvidenceFiles';
import AuditLog from './pages/AuditLog/AuditLog';
import AlertsPage from './pages/Alerts/AlertsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/"                              element={<LTODashboard />} />
          <Route path="/facilities"                    element={<FacilitiesList />} />
          <Route path="/facilities/new"                element={<FacilityForm />} />
          <Route path="/facilities/:id/edit"           element={<FacilityForm />} />
          <Route path="/licenses"                      element={<LicensesList />} />
          <Route path="/licenses/new"                  element={<LicenseForm />} />
          <Route path="/licenses/:id"                  element={<LicenseDetail />} />
          <Route path="/licenses/:id/edit"             element={<LicenseForm />} />
          <Route path="/licenses/:id/checklist"        element={<FormChecklist />} />
          <Route path="/licenses/:id/evidence"         element={<EvidenceFiles />} />
          <Route path="/audit-log"                     element={<AuditLog />} />
          <Route path="/alerts"                        element={<AlertsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
```

### 15.2 `Sidebar.jsx` Navigation Items

```jsx
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/' },
  { icon: Building2,       label: 'Facilities',   path: '/facilities' },
  { icon: FileText,        label: 'Licenses',     path: '/licenses' },
  { icon: Bell,            label: 'Alerts',       path: '/alerts' },
  { icon: History,         label: 'Audit Log',    path: '/audit-log' },
];
```

**Sidebar style:**
- Background: `var(--sn-navy)` (#1B2C3E)
- Width: `var(--sn-sidebar-width)` (240px)
- Active item: `background: rgba(0,114,219,0.18)`, left border `3px solid var(--sn-blue-primary)`, text `var(--sn-white)`
- Inactive item: text `rgba(255,255,255,0.65)`, hover `background: rgba(255,255,255,0.08)`
- App logo area at top: "🛡 LTO Tracker" wordmark in white on `--sn-navy`
- User avatar + name + role badge at bottom of sidebar

### 15.3 `Topbar.jsx`

- Background: `var(--sn-white)`, bottom border `1px solid var(--sn-gray-300)`
- Left: Current page breadcrumb (e.g., `Licenses / LTO-2024-001`)
- Right: `Bell` icon with unread alert count badge + User avatar dropdown (Logout using `LogOut` icon)

---

## 16. API SERVICE LAYER

**File:** `src/client/services/LTOService.js`  
**Base URL:** ServiceNow REST Table API — `https://<instance>.service-now.com/api/now/table/`

### 16.1 API Method Reference

```javascript
// src/client/services/LTOService.js

const BASE = 'https://<instance>.service-now.com/api/now/table';
const HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

// ── Facilities ──────────────────────────────────────────────────────
getLicenseStatusCounts()           // GET license table; group by status → returns { active, expiring_soon, expired, under_renewal }
getExpiringLicenses(days)          // GET license WHERE days_before_expiry <= days, order by expiry_date ASC
getFacilities(search, typeFilter, page, pageSize)
getFacilityById(id)
createFacility(data)
updateFacility(id, data)
deleteFacility(id)
checkDuplicateDOHNumber(value, excludeId)

// ── Licenses ────────────────────────────────────────────────────────
getLicenses(statusFilter, typeFilter, search, page, pageSize)
getLicenseById(id)
createLicense(data)
updateLicense(id, data)
deleteLicense(id)
advanceRenewalStage(id)             // PATCH: stage++ if not Released

// ── Checklist ───────────────────────────────────────────────────────
getChecklistByLicense(licenseId)
toggleChecklistItem(itemId, isCompleted)

// ── Evidence Files ──────────────────────────────────────────────────
getEvidenceByLicense(licenseId)
uploadEvidenceFile(licenseId, file, fileType)
deleteEvidenceFile(id)

// ── Audit Log ───────────────────────────────────────────────────────
getAuditLog(facilityId, action, fromDate, toDate, page, pageSize)

// ── Alerts ──────────────────────────────────────────────────────────
getAlerts(threshold, channel, facilityId, page, pageSize)
getRecentAlerts(limit)             // for dashboard feed
```

### 16.2 Auth

ServiceNow REST API uses **Basic Auth** (`Authorization: Basic base64(user:password)`) or **OAuth Bearer Token**. Store credentials in `.env`:

```
VITE_SN_INSTANCE=dev12345.service-now.com
VITE_SN_USER=admin
VITE_SN_PASS=YourPassword
```

> ⚠️ For production, use OAuth 2.0 tokens — never expose Basic credentials in client bundles.

---

## 17. FILE & FOLDER CHECKLIST

Use this checklist to track page development progress:

| # | File                                        | Status         | Notes                              |
|---|---------------------------------------------|----------------|------------------------------------|
| — | `src/client/tokens.css`                     | 🔲 To Build    | Design tokens — build first        |
| — | `src/client/layout/AppShell.jsx`            | 🔲 To Build    | Shell + sidebar + topbar            |
| — | `src/client/layout/Sidebar.jsx`             | 🔲 To Build    |                                    |
| — | `src/client/layout/Topbar.jsx`              | 🔲 To Build    |                                    |
| — | `src/client/components/StatusBadge.jsx`     | 🔲 To Build    |                                    |
| — | `src/client/components/StagePipeline.jsx`   | 🔲 To Build    |                                    |
| — | `src/client/components/StatCard.jsx`        | 🟡 Exists/Refactor | Refactor to use design tokens  |
| — | `src/client/components/DataTable.jsx`       | 🔲 To Build    |                                    |
| — | `src/client/components/PageHeader.jsx`      | 🔲 To Build    |                                    |
| — | `src/client/components/EmptyState.jsx`      | 🔲 To Build    |                                    |
| — | `src/client/components/ConfirmModal.jsx`    | 🔲 To Build    |                                    |
| 1 | `src/client/pages/Dashboard/LTODashboard.jsx` | 🟡 Exists/Refactor | Refactor to match this spec  |
| 2 | `src/client/pages/Facilities/FacilitiesList.jsx` | 🔲 To Build |                               |
| 3 | `src/client/pages/Facilities/FacilityForm.jsx`   | 🔲 To Build |                               |
| 4 | `src/client/pages/Licenses/LicensesList.jsx`     | 🔲 To Build |                               |
| 5 | `src/client/pages/Licenses/LicenseDetail.jsx`    | 🔲 To Build |                               |
| 6 | `src/client/pages/Licenses/LicenseForm.jsx`      | 🔲 To Build |                               |
| 7 | `src/client/pages/Checklist/FormChecklist.jsx`   | 🔲 To Build |                               |
| 8 | `src/client/pages/Evidence/EvidenceFiles.jsx`    | 🔲 To Build |                               |
| 9 | `src/client/pages/AuditLog/AuditLog.jsx`         | 🔲 To Build |                               |
|10 | `src/client/pages/Alerts/AlertsPage.jsx`         | 🔲 To Build |                               |
| — | `src/client/services/LTOService.js`         | 🟡 Exists/Extend | Add all methods in §16.1   |
| — | `src/client/App.jsx`                        | 🔲 To Build    | Replace main.jsx routing           |

**Legend:** 🔲 To Build &nbsp;|&nbsp; 🟡 Exists — Needs Refactor &nbsp;|&nbsp; ✅ Complete

---

## BUILD ORDER RECOMMENDATION

Build pages in dependency order to avoid importing components that don't exist yet:

```
Phase A — Foundation (build these first)
  1. tokens.css
  2. StatusBadge.jsx
  3. StagePipeline.jsx
  4. StatCard.jsx (refactor)
  5. DataTable.jsx
  6. PageHeader.jsx
  7. EmptyState.jsx
  8. ConfirmModal.jsx
  9. AppShell.jsx + Sidebar.jsx + Topbar.jsx
 10. LTOService.js (extend existing)

Phase B — Core Pages
 11. LTODashboard.jsx (refactor)
 12. FacilitiesList.jsx
 13. LicensesList.jsx
 14. LicenseDetail.jsx
 15. AlertsPage.jsx

Phase C — Form Pages (admin-only)
 16. FacilityForm.jsx
 17. LicenseForm.jsx
 18. FormChecklist.jsx
 19. EvidenceFiles.jsx

Phase D — Utility Pages
 20. AuditLog.jsx
 21. App.jsx (final routing)
```

---

*Document generated: April 16, 2026 — Health Online LTO & Ancillary Licensing Tracker, PRBCS00032*  
*For development reference only. All table names and scope prefix: `x_1998335_health_l`.*
