# DEVELOPMENT GUIDE
## Health Online LTO & Ancillary Licensing Tracker
### ServiceNow Application — PRBCS00032

**Application Name:** Health LTO Tracker  
**Scope:** `x_1998335_health_l`  
**Version:** 1.0.0  
**Platform:** ServiceNow Personal Developer Instance (PDI)  
**Domain:** Healthcare Regulatory Compliance — Philippines DOH  
**Status:** In Development

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Application Architecture](#4-application-architecture)
5. [Data Model](#5-data-model)
6. [Business Rules & Automation](#6-business-rules--automation)
7. [UI/UX Specifications](#7-uiux-specifications)
8. [Roles & Access Control](#8-roles--access-control)
9. [Scheduled Jobs & Email Notifications](#9-scheduled-jobs--email-notifications)
10. [Service Portal Dashboard](#10-service-portal-dashboard)
11. [Development Plan & Implementation Order](#11-development-plan--implementation-order)
12. [Build & Deployment](#12-build--deployment)
13. [Testing Checklist](#13-testing-checklist)
14. [Naming Conventions & Coding Standards](#14-naming-conventions--coding-standards)
15. [Glossary](#15-glossary)

---

## 1. PROJECT OVERVIEW

### 1.1 What This Application Does

The **Health Online LTO & Ancillary Licensing Tracker** is a ServiceNow scoped application that helps Philippine hospitals manage Department of Health (DOH) License to Operate (LTO) renewals and Online Licensing and Registration System (OLRS) ancillary variations.

Hospitals are legally required to maintain active DOH licenses for their main operations and for ancillary services (radiology, pharmacy). Non-renewal results in facility shutdown orders. Compliance officers currently track deadlines manually via spreadsheets — this application replaces that process with a centralized, automated, auditable system on the ServiceNow platform.

### 1.2 Core Features

| ID | Feature | Priority |
|----|---------|----------|
| F-01 | Facility Profile Management | Must Have |
| F-02 | License Registry | Must Have |
| F-03 | Automated Due-Date Alerts (90/60/30/7 days) | Must Have |
| F-04 | Color-Coded Compliance Dashboard | Must Have |
| F-05 | Required Forms Checklist per License Type | Must Have |
| F-06 | Evidence File Upload | Must Have |
| F-07 | Renewal Stage Pipeline | Must Have |
| F-08 | Audit Log | Must Have |
| F-09 | Role-Based Access Control | Must Have |

### 1.3 What Is Out of Scope (MVP)

- Direct DOH OLRS portal API integration
- Automated form submission to DOH
- Payment processing
- Multi-branch / network-level management
- Mobile-specific native app

### 1.4 Stakeholders

| Role | Responsibility |
|------|----------------|
| Compliance Officer (`admin` role) | Manages all records, uploads evidence, updates renewal stages |
| Compliance Viewer (`viewer` role) | Read-only access to all records and dashboards |
| System Administrator | ServiceNow instance administration |

---

## 2. TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Platform | ServiceNow PDI | Personal Developer Instance |
| Application Scope | `x_1998335_health_l` | All artifacts namespaced under this scope |
| Primary DSL | ServiceNow Fluent DSL (TypeScript `.now.ts`) | Defines tables, BRs, ACLs as code |
| Server-side Scripting | JavaScript (Rhino engine) | Business Rules, Script Includes, Scheduled Jobs |
| Client-side Scripting | Browser JavaScript | Client Scripts, UI Policies |
| UI | Service Portal, Form Designer, List Views | No external frontend framework |
| Automation | Business Rules, Scheduled Jobs, Flow Designer | Native platform capabilities |
| Notifications | ServiceNow Email Notifications (SMTP) | Alert emails to compliance officers |
| Reporting | ServiceNow Reports + Dashboards | License status summaries |
| Build Tooling | Node.js + `@servicenow/sdk` | CLI for compile, deploy, sync |
| Package Manager | npm | Dependency management |
| Version Control | Git | Source control |
| AI Assistance | Claude (Anthropic) | Code generation for all artifacts |

### 2.1 ServiceNow SDK Commands

```bash
npm run build      # Compile .now.ts → ServiceNow metadata artifacts
npm run deploy     # Upload and install compiled artifacts to ServiceNow instance
npm run sync       # Pull changes made in ServiceNow UI back to local code
npm run dev        # Watch mode — auto-recompile on file changes
```

---

## 3. REPOSITORY STRUCTURE

```
project/
├── now.config.json                   # ServiceNow instance connection settings
├── package.json                      # Dependencies and npm scripts
├── DEVELOPMENT.md                    # This document
├── SDD_LTO_Tracker.md                # System Design Document (authoritative spec)
├── SERVICENOW_TECH_STACK.md          # Tech stack reference
│
├── dist/                             # [Generated] Compiled application artifacts
│   └── app/
│       ├── scope/                    # Scope-level metadata
│       └── update/                   # Update set files
│
├── target/                           # [Generated] Deployment packages
│   └── x_1998335_health_l_1_0_0.zip
│
└── src/
    ├── fluent/                       # Fluent DSL metadata definitions
    │   ├── generated/
    │   │   └── keys.ts               # [Auto-generated] ServiceNow object ID mappings
    │   ├── tables/
    │   │   ├── facility.now.ts       # Facility table definition
    │   │   ├── license.now.ts        # License table definition
    │   │   ├── alert.now.ts          # Alert table definition
    │   │   ├── form_checklist.now.ts # Form Checklist table definition
    │   │   ├── evidence_file.now.ts  # Evidence File table definition
    │   │   └── audit_log.now.ts      # Audit Log table definition
    │   ├── roles/
    │   │   └── roles.now.ts          # Application roles
    │   ├── acls/
    │   │   └── acls.now.ts           # Access Control Lists
    │   └── index.now.ts              # Main application entry point
    │
    ├── server/                       # Server-side JavaScript scripts
    │   ├── br_facility.js            # Business rules for Facility table
    │   ├── br_license.js             # Business rules for License table
    │   ├── br_checklist.js           # Business rules for Form Checklist table
    │   └── scheduled_alert_job.js    # Daily expiry alert job script
    │
    └── client/                       # [Companion App — separate from LTO scope]
        ├── index.html
        ├── IncidentForm.jsx          # React incident form (uses ServiceNow incident table)
        ├── IncidentList.jsx          # React incident list
        └── IncidentService.js        # REST API calls to ServiceNow Table API
```

> **Note on `src/client/`:** The React Incident Management UI in `src/client/` is a companion application that targets the native ServiceNow `incident` table. It is **not** part of the LTO Tracker feature set (PRBCS00032) and uses separate ITSM roles. It is built and served independently via `src/client/index.html`.

---

## 4. APPLICATION ARCHITECTURE

### 4.1 Application Scope

| Property | Value |
|----------|-------|
| Application Name | Health LTO Tracker |
| Scope | `x_1998335_health_l` |
| Menu Label | LTO Tracker |
| Menu Category | Compliance |

All custom tables, roles, ACLs, business rules, scripts, and portal widgets are created within this scope. Every custom object name must carry the scope prefix (e.g., `x_1998335_health_l_facility`).

### 4.2 Component Inventory

| Artifact Type | Count | Purpose |
|---------------|-------|---------|
| Custom Tables | 6 | All data entities |
| Application Roles | 2 | Admin and Viewer |
| Business Rules | 8 | Validation, auto-population, status computation, audit |
| Client Scripts | 2 | File size validation, stage-change confirmation |
| UI Policies | 4 | Read-only computed fields |
| Scheduled Jobs | 1 | Daily expiry alert generator |
| Email Notifications | 1 | License expiry alert email |
| ACLs | ~20 | Row and field-level security |
| Service Portal Page | 1 | LTO Compliance Dashboard |
| Service Portal Widgets | 3 | Status summary, expiring licenses, recent alerts |
| Application Menu Modules | 8 | Navigation |

### 4.3 Application Menu Structure

```
LTO Tracker (Application Menu — Category: Compliance)
├── Dashboard                        → Service Portal page: lto_dashboard
├── Facilities
│   ├── All Facilities               → List View: x_1998335_health_l_facility
│   └── Create New Facility          → New record form
├── Licenses
│   ├── All Licenses                 → List View: x_1998335_health_l_license
│   ├── Expiring Soon                → Filtered: status = expiring_soon
│   ├── Expired                      → Filtered: status = expired
│   └── Create New License           → New record form
├── Alerts
│   └── All Alerts                   → List View: x_1998335_health_l_alert
├── Audit Log
│   └── All Audit Entries            → List View: x_1998335_health_l_audit_log
└── Administration (admin role only)
    └── All Users                    → List View: sys_user
```

### 4.4 Data Flow Diagram

```
[Scheduled Job: Daily Alert Checker — runs 06:00 AM PST]
        |
        | queries all License records (status != expired, stage != released)
        v
[License Table] ─────── belongs to ──────► [Facility Table]
        |                                         |
        ├─ related list ──► [Alert Table]         └── compliance_officer → [sys_user]
        ├─ related list ──► [Form Checklist Table]
        ├─ related list ──► [Evidence File Table]
        └─ related list ──► [Audit Log Table]
        |
[BR-L-01] computes status + days_before_expiry on every save
[BR-L-02] auto-creates checklist items on first insert
[BR-L-03] enforces forward-only stage transitions
[BR-L-05] writes audit log on every stage change
[Email Notification] fires on Alert record insert
[Service Portal Dashboard] reads all tables on page load
```

---

## 5. DATA MODEL

### 5.1 Table: `x_1998335_health_l_facility`

**Label:** Facility | **Extends:** None (standalone)  
**Description:** Represents one hospital or ancillary facility.

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| Name | `name` | String | 200 | ✅ | Official registered name |
| DOH License Number | `doh_license_number` | String | 50 | ✅ | Unique. DOH-assigned identifier |
| Facility Type | `facility_type` | Choice | — | ✅ | See choice values below |
| Address | `address` | String | 500 | ✅ | Complete street address |
| Compliance Officer | `compliance_officer_id` | Reference → `sys_user` | — | ✅ | Must have admin role |
| Active | `active` | True/False | — | ❌ | Default: `true` |
| Created At | `sys_created_on` | (system) | — | — | Auto |
| Updated At | `sys_updated_on` | (system) | — | — | Auto |

**Choice Values — `facility_type`:**

| Value | Label |
|-------|-------|
| `hospital` | Hospital |
| `dialysis_center` | Dialysis Center |
| `clinical_lab` | Clinical Laboratory |
| `radiology_center` | Radiology Center |

**Business Rules:** BR-F-01 (duplicate DOH license number check)

---

### 5.2 Table: `x_1998335_health_l_license`

**Label:** License | **Extends:** None (standalone)  
**Description:** One DOH LTO or OLRS variation license record linked to a facility.

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| License Number | `license_number` | String | 100 | ✅ | Unique. Official DOH number |
| Facility | `facility_id` | Reference → `x_1998335_health_l_facility` | — | ✅ | Parent facility |
| License Type | `license_type` | Choice | — | ✅ | See choice values below |
| Issue Date | `issue_date` | Date | — | ✅ | |
| Expiry Date | `expiry_date` | Date | — | ✅ | |
| Status | `status` | Choice | — | ❌ | Auto-computed. Read-only |
| Renewal Stage | `renewal_stage` | Choice | — | ✅ | Default: `not_started` |
| Days Before Expiry | `days_before_expiry` | Integer | — | ❌ | Computed: expiry_date − today |
| Checklist % Complete | `checklist_pct` | Integer | — | ❌ | Computed: 0–100 |
| Notes | `notes` | String | 1000 | ❌ | Free-text |
| Created At | `sys_created_on` | (system) | — | — | Auto |
| Updated At | `sys_updated_on` | (system) | — | — | Auto |

**Choice Values — `license_type`:**

| Value | Label |
|-------|-------|
| `doh_lto_main` | DOH LTO (Main) |
| `olrs_radiology` | OLRS Variation — Radiology (X-Ray) |
| `olrs_pharmacy` | OLRS Variation — Pharmacy |

**Choice Values — `status`:**

| Value | Label | Condition |
|-------|-------|-----------|
| `active` | Active | expiry > 90 days away |
| `expiring_soon` | Expiring Soon | expiry within 1–90 days |
| `expired` | Expired | expiry date is past today |
| `under_renewal` | Under Renewal | renewal_stage is not `not_started` and not `released` |

**Choice Values — `renewal_stage`:**

| Value | Label | Order |
|-------|-------|-------|
| `not_started` | Not Started | 0 |
| `documents_gathering` | Documents Gathering | 1 |
| `submitted_to_doh` | Submitted to DOH | 2 |
| `under_evaluation` | Under Evaluation | 3 |
| `released` | Released | 4 |

**Business Rules:** BR-L-01 through BR-L-06

---

### 5.3 Table: `x_1998335_health_l_alert`

**Label:** Alert | **Extends:** None  
**Description:** A generated notification record for an upcoming license expiry.

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| License | `license_id` | Reference → `x_1998335_health_l_license` | — | ✅ | |
| Days Before Expiry | `days_before_expiry` | Integer | — | ✅ | Threshold: 90, 60, 30, or 7 |
| Channel | `channel` | Choice | — | ✅ | `email`, `in_app` |
| Status | `status` | Choice | — | ✅ | `sent`, `failed` |
| Sent At | `sent_at` | Date/Time | — | ❌ | Auto-set on creation |
| Alert Date | `alert_date` | Date | — | ✅ | Calendar date generated. Used for deduplication |

**Deduplication Key:** `license_id` + `days_before_expiry` + `alert_date` must be unique.

---

### 5.4 Table: `x_1998335_health_l_form_checklist`

**Label:** Form Checklist | **Extends:** None  
**Description:** One required document within a license's documentary checklist.

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| License | `license_id` | Reference → `x_1998335_health_l_license` | — | ✅ | |
| Form Name | `form_name` | String | 300 | ✅ | Name of the required form |
| Purpose | `purpose` | String | 500 | ❌ | Brief explanation |
| Is Completed | `is_completed` | True/False | — | ❌ | Default: `false` |
| Completed At | `completed_at` | Date/Time | — | ❌ | Auto-set on toggle to `true` |
| Completed By | `completed_by` | Reference → `sys_user` | — | ❌ | Auto-set on toggle to `true` |

**Business Rules:** BR-C-01, BR-C-02, BR-C-03

**Pre-populated Forms by License Type:**

*DOH LTO (Main):*
1. DOH LTO Application Form
2. Certificate of Compliance (COC) from PhilHealth
3. Fire Safety Inspection Certificate (FSIC)
4. Sanitary Permit
5. Building Permit / Occupancy Certificate
6. List of Medical Personnel with PRC IDs
7. Organizational Chart

*OLRS Variation — Radiology (X-Ray):*
1. OLRS Radiology Application Form
2. Radiation Safety Officer (RSO) Certificate
3. Radiation Source Inventory
4. DOH Regional Office Inspection Report
5. Equipment Registration Certificate

*OLRS Variation — Pharmacy:*
1. OLRS Pharmacy Application Form
2. FDA Certificate of Product Registration
3. Pharmacist License (PRC ID)
4. Drug Enforcement Agency (DEA) Registration
5. Pharmacy Layout / Floor Plan

---

### 5.5 Table: `x_1998335_health_l_evidence_file`

**Label:** Evidence File | **Extends:** None  
**Description:** Metadata for a file attached as evidence to a license record. The actual binary is stored as a ServiceNow Attachment (`sys_attachment`).

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| License | `license_id` | Reference → `x_1998335_health_l_license` | — | ✅ | |
| File Name | `file_name` | String | 300 | ✅ | Display name |
| Attachment | `attachment_sys_id` | String | 32 | ❌ | `sys_id` of the `sys_attachment` record |
| File Type | `file_type` | Choice | — | ✅ | `form`, `receipt`, `certificate`, `inspection_report`, `other` |
| Uploaded By | `uploaded_by` | Reference → `sys_user` | — | ✅ | Auto-set to current user |
| Uploaded At | `uploaded_at` | Date/Time | — | ✅ | Auto-set on creation |

**Allowed File Formats:** PDF, JPG, PNG, DOCX (enforced by UI policy)  
**Maximum File Size:** 10 MB per file (enforced by client script CS-01)

---

### 5.6 Table: `x_1998335_health_l_audit_log`

**Label:** Audit Log | **Extends:** None  
**Description:** Immutable log of all significant changes to License and Facility records.

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|---|---|---|---|---|---|
| Changed By | `user_id` | Reference → `sys_user` | — | ✅ | |
| License | `license_id` | Reference → `x_1998335_health_l_license` | — | ❌ | Null if change is on Facility |
| Facility | `facility_id` | Reference → `x_1998335_health_l_facility` | — | ❌ | Null if change is on License |
| Action | `action` | String | 100 | ✅ | e.g., "Stage Updated", "Status Changed" |
| Field Changed | `field_changed` | String | 100 | ❌ | |
| Old Value | `old_value` | String | 1000 | ❌ | |
| New Value | `new_value` | String | 1000 | ❌ | |
| Changed At | `changed_at` | Date/Time | — | ✅ | Auto-set on creation |

> **Security Note:** No user role, including admin, can update or delete audit log records. Inserts are permitted only by system business rules.

---

## 6. BUSINESS RULES & AUTOMATION

### BR-L-01: Compute License Status and Days Before Expiry

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_license` |
| When | Before Insert, Before Update |

```javascript
// Compute days_before_expiry
var today = new GlideDateTime();
today.setDisplayValueInternal(gs.nowDateTime());
var expiryGDT = new GlideDateTime(current.expiry_date + ' 00:00:00');
var diffMs = expiryGDT.getNumericValue() - today.getNumericValue();
var daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
current.days_before_expiry = daysLeft;

// Compute status
var stage = current.renewal_stage.toString();
if (stage !== 'not_started' && stage !== 'released') {
    current.status = 'under_renewal';
} else if (daysLeft < 0) {
    current.status = 'expired';
} else if (daysLeft <= 90) {
    current.status = 'expiring_soon';
} else {
    current.status = 'active';
}
```

---

### BR-L-02: Auto-Create Form Checklist Items on Insert

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_license` |
| When | After Insert |

```javascript
var forms = [];
var lt = current.license_type.toString();

if (lt === 'doh_lto_main') {
    forms = [
        { name: 'DOH LTO Application Form', purpose: 'Primary application form for DOH License to Operate' },
        { name: 'Certificate of Compliance (COC) from PhilHealth', purpose: 'PhilHealth accreditation compliance certificate' },
        { name: 'Fire Safety Inspection Certificate (FSIC)', purpose: 'BFP-issued fire safety clearance' },
        { name: 'Sanitary Permit', purpose: 'LGU-issued sanitary permit' },
        { name: 'Building Permit / Occupancy Certificate', purpose: 'Proof of legal occupancy of facility premises' },
        { name: 'List of Medical Personnel with PRC IDs', purpose: 'Complete roster of licensed medical staff' },
        { name: 'Organizational Chart', purpose: 'Facility organizational structure' }
    ];
} else if (lt === 'olrs_radiology') {
    forms = [
        { name: 'OLRS Radiology Application Form', purpose: 'OLRS application form for radiology variation' },
        { name: 'Radiation Safety Officer (RSO) Certificate', purpose: 'Certification of designated Radiation Safety Officer' },
        { name: 'Radiation Source Inventory', purpose: 'Complete list of radiation-emitting equipment' },
        { name: 'DOH Regional Office Inspection Report', purpose: 'Latest DOH regional inspection clearance' },
        { name: 'Equipment Registration Certificate', purpose: 'Registration of x-ray and imaging equipment' }
    ];
} else if (lt === 'olrs_pharmacy') {
    forms = [
        { name: 'OLRS Pharmacy Application Form', purpose: 'OLRS application form for pharmacy variation' },
        { name: 'FDA Certificate of Product Registration', purpose: 'FDA clearance for pharmaceutical products handled' },
        { name: 'Pharmacist License (PRC ID)', purpose: 'Valid PRC ID of the responsible pharmacist' },
        { name: 'Drug Enforcement Agency (DEA) Registration', purpose: 'DEA registration for controlled substances' },
        { name: 'Pharmacy Layout / Floor Plan', purpose: 'Approved pharmacy floor plan and dispensing area layout' }
    ];
}

for (var i = 0; i < forms.length; i++) {
    var gr = new GlideRecord('x_1998335_health_l_form_checklist');
    gr.initialize();
    gr.license_id = current.sys_id;
    gr.form_name = forms[i].name;
    gr.purpose = forms[i].purpose;
    gr.is_completed = false;
    gr.insert();
}
```

---

### BR-L-03: Prevent Backward Stage Transitions

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_license` |
| When | Before Update |
| Condition | `current.renewal_stage.changes()` |

```javascript
var stageOrder = {
    'not_started': 0,
    'documents_gathering': 1,
    'submitted_to_doh': 2,
    'under_evaluation': 3,
    'released': 4
};

var oldStage = previous.renewal_stage.toString();
var newStage = current.renewal_stage.toString();

if (stageOrder[newStage] < stageOrder[oldStage]) {
    current.setAbortAction(true);
    gs.addErrorMessage('Renewal stage cannot be moved backward. Current stage: ' + previous.renewal_stage.getDisplayValue());
}
```

---

### BR-L-04: Validate Expiry Date When Marking Released

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_license` |
| When | Before Update |
| Condition | `current.renewal_stage == 'released' && current.renewal_stage.changes()` |

```javascript
if (current.renewal_stage.toString() === 'released' && current.renewal_stage.changes()) {
    var today = new GlideDate();
    today.setValue(gs.now());
    var expiry = new GlideDate();
    expiry.setValue(current.expiry_date);
    if (expiry.compareTo(today) <= 0) {
        current.setAbortAction(true);
        gs.addErrorMessage('Before marking as Released, please update the Expiry Date to the new license validity date (must be a future date).');
    }
}
```

---

### BR-L-05: Write Audit Log on Stage Change

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_license` |
| When | After Update |
| Condition | `current.renewal_stage.changes()` |

```javascript
var log = new GlideRecord('x_1998335_health_l_audit_log');
log.initialize();
log.user_id = gs.getUserID();
log.license_id = current.sys_id;
log.action = 'Stage Updated';
log.field_changed = 'renewal_stage';
log.old_value = previous.renewal_stage.getDisplayValue();
log.new_value = current.renewal_stage.getDisplayValue();
log.changed_at = new GlideDateTime();
log.insert();
```

---

### BR-F-01: Prevent Duplicate DOH License Numbers (Facility)

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_facility` |
| When | Before Insert, Before Update |

```javascript
var gr = new GlideRecord('x_1998335_health_l_facility');
gr.addQuery('doh_license_number', current.doh_license_number);
if (!current.isNewRecord()) {
    gr.addQuery('sys_id', '!=', current.sys_id);
}
gr.query();
if (gr.next()) {
    current.setAbortAction(true);
    gs.addErrorMessage('A facility with DOH License Number ' + current.doh_license_number + ' already exists.');
}
```

---

### BR-C-01: Auto-Set Completed Timestamp and User (Checklist)

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_form_checklist` |
| When | Before Update |
| Condition | `current.is_completed.changes()` |

```javascript
if (current.is_completed.toString() === 'true') {
    current.completed_at = new GlideDateTime();
    current.completed_by = gs.getUserID();
} else {
    current.completed_at = '';
    current.completed_by = '';
}
```

---

### BR-C-02 / BR-C-03: Checklist Pct Recomputation (License)

After any checklist item update, recompute `checklist_pct` on the parent license record.

| Property | Value |
|----------|-------|
| Table | `x_1998335_health_l_form_checklist` |
| When | After Update |

```javascript
var total = 0, completed = 0;
var gr = new GlideRecord('x_1998335_health_l_form_checklist');
gr.addQuery('license_id', current.license_id);
gr.query();
while (gr.next()) {
    total++;
    if (gr.is_completed.toString() === 'true') completed++;
}
var pct = (total > 0) ? Math.round((completed / total) * 100) : 0;

var lic = new GlideRecord('x_1998335_health_l_license');
if (lic.get(current.license_id)) {
    lic.checklist_pct = pct;
    lic.update();
}
```

---

## 7. UI/UX SPECIFICATIONS

### 7.1 Form: Facility Record

**Section 1 — Facility Information**

| Layout | Fields |
|--------|--------|
| Full width | Name |
| Two-column | DOH License Number \| Facility Type |
| Full width | Address |
| Two-column | Compliance Officer \| Active |

**Section 2 — Related Lists**
- Licenses (`x_1998335_health_l_license.facility_id`) — columns: License Number, License Type, Status, Expiry Date, Renewal Stage, Days Before Expiry

---

### 7.2 Form: License Record

**Section 1 — License Identity**

| Layout | Fields |
|--------|--------|
| Two-column | License Number \| License Type |
| Full width (read-only) | Facility |
| Two-column | Issue Date \| Expiry Date |

**Section 2 — Status & Progress**

| Layout | Fields |
|--------|--------|
| Two-column | Status (read-only) \| Days Before Expiry (read-only) |
| Two-column | Renewal Stage \| Checklist % Complete (read-only) |
| Full width | Notes |

**Section 3 — Related Lists**
- Form Checklist: columns: Form Name, Purpose, Is Completed, Completed At
- Evidence Files: columns: File Name, File Type, Uploaded By, Uploaded At
- Alerts: columns: Days Before Expiry, Channel, Status, Sent At
- Audit Log: columns: Action, Field Changed, Old Value, New Value, Changed By, Changed At

---

### 7.3 Form: Form Checklist Item

Inline edit only via the related list. Visible fields: Form Name, Purpose, Is Completed.

---

### 7.4 List Views

**Licenses (Default Columns):**  
License Number | Facility | License Type | Status | Expiry Date | Days Before Expiry | Renewal Stage | Checklist %  
Default Sort: Days Before Expiry ASC

**Alerts:**  
License Number | Facility | License Type | Days Before Expiry | Status | Sent At

---

### 7.5 UI Policies

| Policy Name | Condition | Action |
|-------------|-----------|--------|
| Status Read-Only | Always | `status` → read-only |
| Days Before Expiry Read-Only | Always | `days_before_expiry` → read-only |
| Checklist Pct Read-Only | Always | `checklist_pct` → read-only |
| Completed At/By Read-Only | Always | `completed_at`, `completed_by` → read-only |

---

### 7.6 Client Scripts

#### CS-01: File Size Validation (Evidence File Form)

| Property | Value |
|----------|-------|
| Type | onSubmit |
| Table | `x_1998335_health_l_evidence_file` |

Check that no attachment exceeds 10 MB. Display an error and cancel submit if the limit is exceeded.

#### CS-02: Renewal Stage Change Confirmation

| Property | Value |
|----------|-------|
| Type | onChange |
| Table | `x_1998335_health_l_license` |
| Field | `renewal_stage` |

When stage changes to `released`, display a confirmation dialog: *"Have you updated the new Expiry Date for this license? Click OK to confirm."*

---

## 8. ROLES & ACCESS CONTROL

### 8.1 Application Roles

| Role Name | Label | Description |
|-----------|-------|-------------|
| `x_1998335_health_l.admin` | Compliance Officer | Full CRUD on Facility, License, Checklist, Evidence. Read-only on Audit Log. |
| `x_1998335_health_l.viewer` | Compliance Viewer | Read-only on all tables |

### 8.2 ACL Matrix — Table-Level

| Table | Operation | `admin` | `viewer` |
|-------|-----------|---------|----------|
| Facility | Read | ✅ | ✅ |
| Facility | Write / Create | ✅ | ❌ |
| Facility | Delete | ✅ | ❌ |
| License | Read | ✅ | ✅ |
| License | Write / Create | ✅ | ❌ |
| License | Delete | ✅ | ❌ |
| Form Checklist | Read | ✅ | ✅ |
| Form Checklist | Write / Create | ✅ | ❌ |
| Evidence File | Read | ✅ | ✅ |
| Evidence File | Write / Create | ✅ | ❌ |
| Alert | Read | ✅ | ✅ |
| Alert | Write / Create | System only | ❌ |
| Audit Log | Read | ✅ | ✅ |
| Audit Log | Write / Create / Delete | ❌ (system only) | ❌ |

### 8.3 Field-Level ACLs

| Table | Field | Read | Write |
|-------|-------|------|-------|
| License | `status` | All | None (system computed) |
| License | `days_before_expiry` | All | None (system computed) |
| License | `checklist_pct` | All | None (system computed) |
| Audit Log | All fields | admin + viewer | None |

---

## 9. SCHEDULED JOBS & EMAIL NOTIFICATIONS

### 9.1 Scheduled Job: Daily Alert Generator

| Property | Value |
|----------|-------|
| Name | LTO Tracker — Daily Expiry Alert Job |
| Type | Scheduled Script Execution |
| Run | Daily at 06:00 AM PST (configure as 22:00 UTC previous day) |

```javascript
var thresholds = [90, 60, 30, 7];
var today = new GlideDate();
today.setValue(gs.now());

var licGR = new GlideRecord('x_1998335_health_l_license');
licGR.addQuery('status', '!=', 'expired');
licGR.addQuery('renewal_stage', '!=', 'released');
licGR.query();

while (licGR.next()) {
    var daysLeft = parseInt(licGR.days_before_expiry);
    
    for (var i = 0; i < thresholds.length; i++) {
        var threshold = thresholds[i];
        if (daysLeft !== threshold) continue;
        
        // Deduplication check
        var dupCheck = new GlideRecord('x_1998335_health_l_alert');
        dupCheck.addQuery('license_id', licGR.sys_id);
        dupCheck.addQuery('days_before_expiry', threshold);
        dupCheck.addQuery('alert_date', today.getValue());
        dupCheck.query();
        if (dupCheck.next()) continue;
        
        // Create Alert record
        var alert = new GlideRecord('x_1998335_health_l_alert');
        alert.initialize();
        alert.license_id = licGR.sys_id;
        alert.days_before_expiry = threshold;
        alert.channel = 'email';
        alert.status = 'sent';
        alert.sent_at = new GlideDateTime();
        alert.alert_date = today.getValue();
        alert.insert();
        
        // Email Notification fires on Alert record insert (see Section 9.2)
        gs.log('LTO Alert created: License ' + licGR.license_number + ', ' + threshold + ' days before expiry.', 'LTO Tracker');
    }
}
```

---

### 9.2 Email Notification: License Expiry Alert

| Property | Value |
|----------|-------|
| Name | LTO Tracker — License Expiry Alert |
| Table | `x_1998335_health_l_alert` |
| When to Send | Record Inserted |
| Send To | Script — resolve compliance officer email from related facility |

**Subject Template:**
```
[LTO Tracker] Action Required: {{license_id.license_type}} for {{license_id.facility_id.name}} expires in {{days_before_expiry}} days
```

**Body Template (HTML):**
```html
<p>Dear {{license_id.facility_id.compliance_officer_id.first_name}},</p>
<p>This is an automated reminder from the Health LTO Tracker.</p>

<table border="1" cellpadding="8" cellspacing="0">
  <tr><th>Facility</th><td>{{license_id.facility_id.name}}</td></tr>
  <tr><th>License Type</th><td>{{license_id.license_type}}</td></tr>
  <tr><th>License Number</th><td>{{license_id.license_number}}</td></tr>
  <tr><th>Expiry Date</th><td>{{license_id.expiry_date}}</td></tr>
  <tr><th>Days Remaining</th><td><strong>{{days_before_expiry}} days</strong></td></tr>
</table>

<p>Please log in to the LTO Tracker to review your checklist and renewal status:</p>
<p><a href="${gs.getProperty('glide.servlet.uri')}/lto_tracker">Open LTO Tracker</a></p>

<p>This is an automated message. Do not reply to this email.</p>
```

---

## 10. SERVICE PORTAL DASHBOARD

**Page ID:** `lto_dashboard`  
**Page Title:** LTO Compliance Dashboard  
**Access:** All authenticated users; linked from Application Menu → Dashboard

### Widget 1 — License Status Summary

Three colored stat boxes displayed side by side:

| Box | Color | Query |
|-----|-------|-------|
| Active Licenses | Green `#28a745` | `status = active` |
| Expiring Soon | Orange `#fd7e14` | `status = expiring_soon` |
| Expired Licenses | Red `#dc3545` | `status = expired` |

Each box is clickable and navigates to the corresponding filtered license list.

### Widget 2 — Expiring Licenses Table

**Filter:** `days_before_expiry BETWEEN 0 AND 90`, sorted ASC  
**Columns:** Facility, License Type, License Number, Expiry Date, Days Remaining, Renewal Stage  
**Row Color Rules:**

| Days Remaining | Row Background |
|----------------|----------------|
| < 30 days | Red |
| 30–60 days | Orange |
| 60–90 days | Yellow |

### Widget 3 — Recent Alerts

**Filter:** Last 30 days  
**Columns:** License Number, Facility, License Type, Days Before Expiry, Sent At

---

## 11. DEVELOPMENT PLAN & IMPLEMENTATION ORDER

Follow this sequence exactly. Each phase satisfies the dependencies of the next.

### Phase 1 — Application Scaffold

**Step 1:** Create the Scoped Application
- Name: `Health LTO Tracker`
- Scope: `x_1998335_health_l`
- Version: `1.0.0`

**Step 2:** Create Application Roles
- `x_1998335_health_l.admin`
- `x_1998335_health_l.viewer`

---

### Phase 2 — Tables (Steps 3–8)

Create in this order to respect foreign-key dependencies:

| Step | Table |
|------|-------|
| 3 | `x_1998335_health_l_facility` — Section 5.1 |
| 4 | `x_1998335_health_l_license` — Section 5.2 |
| 5 | `x_1998335_health_l_alert` — Section 5.3 |
| 6 | `x_1998335_health_l_form_checklist` — Section 5.4 |
| 7 | `x_1998335_health_l_evidence_file` — Section 5.5 |
| 8 | `x_1998335_health_l_audit_log` — Section 5.6 |

---

### Phase 3 — Business Rules (Steps 9–15)

| Step | Rule ID | Description |
|------|---------|-------------|
| 9 | BR-F-01 | Facility duplicate DOH license number check |
| 10 | BR-L-01 | License status and `days_before_expiry` computation |
| 11 | BR-L-02 | Auto-create checklist items on license insert |
| 12 | BR-L-03 | Prevent backward stage transitions |
| 13 | BR-L-04 | Validate expiry date when marking Released |
| 14 | BR-L-05 | Write audit log on stage change |
| 15 | BR-C-01 | Auto-set `completed_at` / `completed_by` on checklist toggle |

---

### Phase 4 — Forms & Lists (Steps 16–20)

| Step | Task |
|------|------|
| 16 | Configure Facility form layout — Section 7.1 |
| 17 | Configure License form layout — Section 7.2 |
| 18 | Configure default list views — Section 7.4 |
| 19 | Add UI Policies — Section 7.5 |
| 20 | Add Client Scripts CS-01 and CS-02 — Section 7.6 |

---

### Phase 5 — Application Menu (Step 21)

**Step 21:** Create Application Menu and all Module entries per Section 4.3.

---

### Phase 6 — ACLs (Step 22)

**Step 22:** Create all table-level and field-level ACLs per Section 8.2 and 8.3.

---

### Phase 7 — Scheduled Job & Email Notification (Steps 23–24)

| Step | Task |
|------|------|
| 23 | Create Scheduled Job — Section 9.1 |
| 24 | Create Email Notification — Section 9.2 |

---

### Phase 8 — Service Portal Dashboard (Steps 25–27)

| Step | Task |
|------|------|
| 25 | Create Service Portal page `lto_dashboard` |
| 26 | Create and configure Widget 1, Widget 2, Widget 3 — Section 10 |
| 27 | Link portal page to Application Menu module |

---

### Phase 9 — Testing (Steps 28–30)

| Step | Test |
|------|------|
| 28 | Create test Facility and License records; verify status computation and checklist auto-creation |
| 29 | Manually trigger Scheduled Job; verify Alert records created and emails sent |
| 30 | Log in as viewer; confirm no create/update/delete access on any table |

---

## 12. BUILD & DEPLOYMENT

### 12.1 Build Process

Running `npm run build` performs the following:

1. **Compiles Fluent DSL** (`.now.ts` files) into ServiceNow metadata XML
2. **Generates `src/fluent/generated/keys.ts`** with ServiceNow `sys_id` mappings for deployed objects
3. **Creates `dist/`** folder with compiled application artifacts
4. **Validates syntax** and dependency declarations
5. **Packages** the application for deployment

### 12.2 Deploy Process

Running `npm run deploy` performs the following:

1. Creates the deployment package in `target/` (`.zip` file)
2. Uploads the package to the ServiceNow instance via the Now SDK
3. Installs metadata (tables, business rules, scripts, ACLs, etc.)
4. Registers the application in the instance
5. Enables two-way synchronization via `keys.ts`

### 12.3 Generated Keys Reference

`src/fluent/generated/keys.ts` maps local metadata identifiers to ServiceNow `sys_id` values:

```typescript
declare global {
    namespace Now {
        interface Keys extends KeysRegistry {
            explicit: {
                br0: { table: 'sys_script', id: '557d65ab18ce...' }
                cs0: { table: 'sys_script_client', id: '5a206b64...' }
                // ... additional entries added on each deploy
            }
        }
    }
}
```

Always use `Now.ID['key_name']` to reference deployed metadata objects. Never hardcode `sys_id` values.

### 12.4 Two-Way Sync

After making changes directly in the ServiceNow UI (e.g., tweaking a form layout or business rule script), pull those changes back to the local codebase:

```bash
npm run sync
```

Always sync before making major code changes to avoid conflicts.

---

## 13. TESTING CHECKLIST

### Functional Tests

- [ ] Create a Facility record; verify all required fields enforced
- [ ] Attempt to create a second Facility with the same DOH License Number; verify BR-F-01 blocks it
- [ ] Create a License record; verify `status` and `days_before_expiry` are auto-computed (BR-L-01)
- [ ] Create a License record; verify form checklist items auto-populated for each license type (BR-L-02)
- [ ] Advance renewal stage forward; verify it succeeds
- [ ] Attempt to revert renewal stage backward; verify BR-L-03 blocks it with error message
- [ ] Set renewal stage to `released` without updating expiry date; verify BR-L-04 blocks it
- [ ] Set renewal stage to `released` with a future expiry date; verify it succeeds
- [ ] Advance stage; verify Audit Log entry is created (BR-L-05)
- [ ] Toggle checklist item to completed; verify `completed_at` and `completed_by` auto-set (BR-C-01)
- [ ] Toggle checklist item back to false; verify `completed_at` and `completed_by` cleared (BR-C-02)
- [ ] Complete checklist items; verify `checklist_pct` updates on License record (BR-C-03)
- [ ] Manually trigger Scheduled Job with a license at exactly 90/60/30/7 days; verify Alert records created
- [ ] Re-trigger Scheduled Job on same day; verify no duplicate Alerts created
- [ ] Verify email notification content is correct (facility name, license type, expiry, days remaining)
- [ ] Upload a file >10 MB as Evidence; verify CS-01 blocks submission
- [ ] Set renewal stage to `released`; verify CS-02 confirmation dialog appears
- [ ] Open Service Portal dashboard; verify Widget 1 counts are correct
- [ ] Verify Widget 2 row color-coding by days remaining
- [ ] Verify Widget 3 shows only alerts from the last 30 days

### Access Control Tests

- [ ] Log in as `viewer`; confirm no create/edit/delete buttons on any table
- [ ] Log in as `viewer`; confirm Audit Log is readable
- [ ] Log in as `admin`; attempt to manually edit an Audit Log record; verify it is blocked
- [ ] Verify unauthenticated users cannot access any application records

### Non-Functional Tests

- [ ] List view with 100+ license records loads in under 3 seconds (NF-01)
- [ ] All timestamps on scheduled job output are in Philippine Standard Time UTC+8 (NF-07)

---

## 14. NAMING CONVENTIONS & CODING STANDARDS

### Table and Field Names

- All custom object names must include the scope prefix: `x_1998335_health_l_`
- Use lowercase with underscores for system names (e.g., `facility_type`, `doh_license_number`)
- Use human-readable labels on all fields (e.g., "DOH License Number")
- Reference foreign keys with `_id` suffix (e.g., `facility_id`, `license_id`, `compliance_officer_id`)

### Fluent DSL

```typescript
// Table name must include scope prefix
export const facility_table = Table({
    name: 'x_1998335_health_l_facility',
    schema: {
        field_name: StringColumn({ label: 'Field Label', maxLength: 200 })
    }
})

// Always use Now.ID for deployed object references
BusinessRule({
    $id: Now.ID['br0'],
    name: 'LTO BR - Compute Status',
    table: 'x_1998335_health_l_license',
    ...
})
```

### Business Rule Naming Convention

| Pattern | Example |
|---------|---------|
| `LTO BR - [Table abbreviation] - [Description]` | `LTO BR - License - Compute Status` |

### Scheduled Job Naming Convention

`LTO Tracker — [Description]` (e.g., `LTO Tracker — Daily Expiry Alert Job`)

### Common Pitfalls to Avoid

- Missing scope prefix in table/field names
- Hardcoding `sys_id` values instead of using `Now.ID['key']` references
- Creating duplicate records by not checking `isNewRecord()` in insert/update BRs
- Using `GlideDate` vs `GlideDateTime` inconsistently — use `GlideDate` for date-only fields, `GlideDateTime` for timestamps
- Forgetting to call `gr.query()` before iterating GlideRecord results

---

## 15. GLOSSARY

| Term | Definition |
|------|-----------|
| DOH | Department of Health — Philippine regulatory body for healthcare facilities |
| LTO | License to Operate — mandatory DOH license for all healthcare facilities |
| OLRS | Online Licensing and Registration System — DOH portal for ancillary service variations |
| PDI | Personal Developer Instance — ServiceNow free developer environment |
| Scoped Application | A ServiceNow application isolated in its own namespace (scope prefix) |
| Business Rule | Server-side JavaScript that executes on table record operations |
| ACL | Access Control List — ServiceNow's row and field-level security mechanism |
| Compliance Officer | Hospital staff responsible for regulatory license compliance |
| Variation | An ancillary license under OLRS for services such as radiology or pharmacy |
| GlideRecord | ServiceNow's server-side API for querying and manipulating table records |
| Flow Designer | ServiceNow's low-code workflow automation tool |
| Fluent DSL | TypeScript-based ServiceNow Domain Specific Language for defining metadata as code |
| keys.ts | Auto-generated file mapping local metadata IDs to ServiceNow `sys_id` values |
| PST | Philippine Standard Time — UTC+8 — timezone for all scheduled jobs and timestamps |

---

*This document is generated from SDD_LTO_Tracker.md v1.1 and SERVICENOW_TECH_STACK.md. For authoritative business specifications, refer to the SDD. For platform-level technical reference, refer to SERVICENOW_TECH_STACK.md.*