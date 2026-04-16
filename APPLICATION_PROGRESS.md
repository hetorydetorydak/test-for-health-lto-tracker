# Health Online LTO & Ancillary Licensing Tracker

## Application Progress & Development Guide

**Last Updated:** April 16, 2026  
**Application Status:** ✅ **BUILT & DEPLOYED**  
**Scope:** `x_1998335_testlto` (Test Instance) | `x_1998335_health_l` (Production)  
**Version:** 1.0.0  
**Build Status:** ✅ Successfully compiled and installed to ServiceNow instance

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Current Application Status](#2-current-application-status)
3. [What Has Been Built](#3-what-has-been-built)
4. [What Is Planned for Future Releases](#4-what-is-planned-for-future-releases)
5. [ServiceNow Platform Overview](#5-servicenow-platform-overview)
6. [Technology Stack](#6-technology-stack)
7. [Application Architecture](#7-application-architecture)
8. [Data Model Overview](#8-data-model-overview)
9. [Business Logic & Automation](#9-business-logic--automation)
10. [AI Training Essentials](#10-ai-training-essentials)
11. [Development Workflow](#11-development-workflow)
12. [Quick Reference](#12-quick-reference)

---

## 1. EXECUTIVE SUMMARY

### Purpose

The **Health Online LTO & Ancillary Licensing Tracker** is a ServiceNow scoped application that automates the management of Department of Health (DOH) License to Operate (LTO) renewals and Online Licensing and Registration System (OLRS) ancillary variations for healthcare facilities in the Philippines.

### Business Problem

- Philippine hospitals must maintain active DOH licenses for main operations and ancillary services (radiology, pharmacy)
- Non-renewal results in facility shutdown orders and regulatory penalties
- Compliance officers currently track deadlines manually via spreadsheets
- No audit trail, no automated alerts, prone to human error
- Risk of missed renewal deadlines leading to operational shutdown

### Solution

- **Centralized registry** of all facility licenses and their renewal status
- **Automated alerts** at 90, 60, 30, and 7 days before expiry
- **Structured renewal workflow** with stage tracking
- **Required documents checklist** per license type
- **Evidence file upload** for documentary support
- **Complete audit trail** of all changes
- **Role-based access control** (Compliance Officer vs. Viewer)
- **Dashboard visibility** into compliance status

### Target Users

- **Compliance Officers** (admin role) — manage all records, track renewals
- **Compliance Viewers** (viewer role) — read-only monitoring
- **System Administrators** — ServiceNow platform operations

---

## 2. CURRENT APPLICATION STATUS

### 2.1 Build & Deployment Status

| Milestone                 | Status | Completion Date |
| ------------------------- | ------ | --------------- |
| Application Scope Created | ✅     | Deployed        |
| Data Model (6 Tables)     | ✅     | Deployed        |
| Business Rules (8 BR)     | ✅     | Deployed        |
| Client Scripts (2 CS)     | ✅     | Deployed        |
| Scheduled Jobs            | ✅     | Deployed        |
| Email Notifications       | ✅     | Deployed        |
| Roles & ACLs              | ✅     | Deployed        |
| Service Portal Dashboard  | ✅     | Deployed        |
| Application Menu          | ✅     | Deployed        |
| Build & Package           | ✅     | Completed       |
| Deploy to Instance        | ✅     | Completed       |

### 2.2 Application Metadata Summary

```
Artifact Type              Count    Status
──────────────────────────────────────────
Custom Tables              6        ✅ Created & Deployed
Application Roles          2        ✅ Created & Deployed
Business Rules             8        ✅ Created & Deployed
Client Scripts             2        ✅ Created & Deployed
Scheduled Jobs             1        ✅ Created & Deployed
Email Notifications        1        ✅ Created & Deployed
ACLs (Table & Field Level) ~25      ✅ Created & Deployed
Service Portal Page        1        ✅ Created & Deployed
Service Portal Widgets     3        ✅ Created & Deployed
Application Menu Modules   8        ✅ Created & Deployed
```

### 2.3 Package & Deployment

- **Package Name:** `x_1998335_test_for_lto_health_tracker_1_0_0.zip`
- **Package Location:** `target/` directory
- **Installation Status:** ✅ Installed to ServiceNow instance
- **Compilation Status:** ✅ All Fluent DSL files compiled successfully
- **Two-Way Sync:** ✅ Enabled (keys.ts mapping active)

---

## 3. WHAT HAS BEEN BUILT

### 3.1 Core Data Tables (6 Tables)

#### 1. **Facility Table** (`x_1998335_health_l_facility`)

- **Purpose:** Represents a hospital or healthcare facility
- **Key Fields:**
  - Name, DOH License Number, Facility Type (Hospital, Dialysis, Lab, Radiology)
  - Address, Compliance Officer (Reference to sys_user)
  - Active status, System timestamps
- **Status:** ✅ Complete with business rule for duplicate license check

#### 2. **License Table** (`x_1998335_health_l_license`)

- **Purpose:** DOH LTO or OLRS variation license records
- **Key Fields:**
  - License Number, Facility (Reference), License Type (DOH LTO, OLRS Radiology, OLRS Pharmacy)
  - Issue Date, Expiry Date
  - Auto-computed Status (Active, Expiring Soon, Expired, Under Renewal)
  - Renewal Stage (Not Started → Documents Gathering → Submitted to DOH → Under Evaluation → Released)
  - Days Before Expiry (computed), Checklist % Complete (computed)
  - Notes field for free-text comments
- **Status:** ✅ Complete with 6 automated business rules

#### 3. **Alert Table** (`x_1998335_health_l_alert`)

- **Purpose:** Automated expiry notifications (90/60/30/7 days before expiry)
- **Key Fields:**
  - License (Reference), Days Before Expiry threshold
  - Channel (Email, In-App), Status (Sent, Failed)
  - Sent At timestamp, Alert Date (for deduplication)
- **Status:** ✅ Complete with deduplication logic

#### 4. **Form Checklist Table** (`x_1998335_health_l_form_checklist`)

- **Purpose:** Required documents per license type
- **Key Fields:**
  - License (Reference), Form Name, Purpose
  - Is Completed flag, Completed At (timestamp), Completed By (user reference)
- **Pre-populated Lists:**
  - **DOH LTO Main:** 7 required forms (Application, PHILHealth COC, Fire Safety, Sanitary Permit, Building Permit, Medical Staff List, Org Chart)
  - **OLRS Radiology:** 5 required forms (Application, RSO Certificate, Source Inventory, Regional Inspection Report, Equipment Registration)
  - **OLRS Pharmacy:** 5 required forms (Application, FDA Registration, Pharmacist License, DEA Registration, Floor Plan)
- **Status:** ✅ Complete with automatic generation on license creation

#### 5. **Evidence File Table** (`x_1998335_health_l_evidence_file`)

- **Purpose:** Metadata for uploaded supporting documents
- **Key Fields:**
  - License (Reference), File Name, Attachment (sys_id reference)
  - File Type (Form, Receipt, Certificate, Inspection Report, Other)
  - Uploaded By (user reference), Uploaded At (timestamp)
- **Validation:** PDF, JPG, PNG, DOCX only; max 10 MB per file
- **Status:** ✅ Complete with file size and type validation

#### 6. **Audit Log Table** (`x_1998335_health_l_audit_log`)

- **Purpose:** Immutable change log for all significant updates
- **Key Fields:**
  - Changed By (user), License/Facility (References)
  - Action, Field Changed, Old Value, New Value
  - Changed At (timestamp)
- **Security:** No update/delete allowed on audit logs; insert-only for system processes
- **Status:** ✅ Complete with automatic logging on stage/status changes

### 3.2 Business Logic & Automation (8 Business Rules)

| BR ID   | Rule Name                     | Trigger              | Action                                          |
| ------- | ----------------------------- | -------------------- | ----------------------------------------------- |
| BR-L-01 | Compute License Status & Days | Before Insert/Update | Auto-calculate days_before_expiry and status    |
| BR-L-02 | Auto-Create Form Checklist    | After Insert         | Generate required forms per license_type        |
| BR-L-03 | Prevent Backward Stages       | Before Update        | Enforce unidirectional stage progression        |
| BR-L-04 | Auto-Create Alerts on Status  | After Update         | Generate alert records at 90/60/30/7 thresholds |
| BR-L-05 | Audit Log on Stage Change     | After Update         | Log all renewal_stage changes                   |
| BR-L-06 | Validate License Number       | Before Insert        | Ensure unique license_number per facility       |
| BR-F-01 | Facility Validation           | Before Insert        | Check for duplicate DOH license numbers         |
| BR-C-01 | Checklist Completion Audit    | Before Update        | Timestamp and user-track completion             |

### 3.3 Client-Side Scripts (2 Scripts)

| CS ID | Script Name               | Purpose                                                    |
| ----- | ------------------------- | ---------------------------------------------------------- |
| CS-01 | File Upload Validation    | Validate file size (max 10 MB) and type (PDF/JPG/PNG/DOCX) |
| CS-02 | Stage Change Confirmation | Prompt confirmation before forward stage transitions       |

### 3.4 Scheduled Job

**Daily Alert Job** (`scheduled_alert_job`)

- **Schedule:** Daily at 6:00 AM PST
- **Function:** Scans all non-expired, active licenses
- **Action:** Auto-creates Alert records for licenses reaching 90/60/30/7-day thresholds
- **Deduplication:** Checks alert_date to prevent duplicate alerts same day
- **Email Trigger:** Email notification fires upon alert creation

### 3.5 User Roles & Access Control

**Role 1: Compliance Officer** (`x_1998335_health_l_compliance_officer`)

- Full CRUD on Facility, License, Form Checklist, Evidence File, Audit Log (read-only)
- Access to Dashboard and all modules
- Can approve/update renewal stages

**Role 2: Compliance Viewer** (`x_1998335_health_l_compliance_viewer`)

- Read-only access to all tables
- Access to Dashboard (read-only)
- Can view but not modify any records

**ACLs:** ~25 table and field-level ACLs enforce role-based restrictions

### 3.6 Email Notifications

**Alert Email Notification**

- **Trigger:** When Alert record is created
- **Recipients:** License.facility.compliance_officer
- **Content:** License expiry warning, days remaining, link to license record
- **Status:** ✅ Configured and tested

### 3.7 Service Portal Dashboard

**Page:** LTO Compliance Dashboard (`lto_dashboard`)

- **Read-Only Widget 1:** License Status Summary (pie chart of Active/Expiring Soon/Expired/Under Renewal)
- **Read-Only Widget 2:** Expiring Licenses Table (list of licenses expiring within 90 days)
- **Read-Only Widget 3:** Recent Alerts (last 10 alerts by timestamp)
- **Responsive Design:** Works on desktop and mobile

### 3.8 Application Menu

```
LTO Tracker (Compliance Category)
├── Dashboard                 → Service Portal: lto_dashboard
├── Facilities
│   ├── All Facilities        → List view
│   └── New Facility          → Form
├── Licenses
│   ├── All Licenses          → List view
│   ├── Expiring Soon         → Filtered list (90-day window)
│   ├── Expired               → Filtered list (expiry < today)
│   └── New License           → Form
├── Alerts
│   └── All Alerts            → List view
├── Audit Log
│   └── All Audit Entries     → List view
└── Administration (admin only)
    └── All Users             → User management
```

---

## 4. WHAT IS PLANNED FOR FUTURE RELEASES

### Phase 2 Features (Post-MVP)

| Feature                       | Priority | Description                                              | Estimated Effort |
| ----------------------------- | -------- | -------------------------------------------------------- | ---------------- |
| **DOH OLRS API Integration**  | High     | Real-time sync with DOH online portal                    | Large            |
| **Automated Email Reminders** | High     | Escalating reminders (90→60→30→7 days)                   | Medium           |
| **Multi-Branch Support**      | Medium   | Manage multiple facility branches under one organization | Large            |
| **Form Auto-Population**      | Medium   | Pre-fill renewal forms from facility data                | Medium           |
| **Advanced Reporting**        | Medium   | Custom reports: expiry timeline, renewal stage funnel    | Medium           |
| **Payment Integration**       | Medium   | Track renewal fee payments (if applicable)               | Large            |
| **Mobile App**                | Low      | Native mobile app for compliance officers                | Large            |
| **Document Templates**        | Low      | Generate standard DOH forms from template library        | Medium           |
| **Approval Workflows**        | Low      | Multi-level approval before DOH submission               | Medium           |
| **Integration with HR**       | Low      | Link medical staff PRC licenses to pharmacy applicants   | Medium           |

### Enhancement Opportunities

1. **Machine Learning** — Predictive alerts based on historical renewal times
2. **Compliance Score** — Automatic facility compliance rating (0-100)
3. **Batch Operations** — Bulk upload licenses via CSV/Excel
4. **RBAC Enhancements** — Facility-level access (limit officers to their assigned facilities)
5. **Audit Reporting** — Compliance audit trail reporting for regulatory submissions

---

## 5. SERVICENOW PLATFORM OVERVIEW

### 5.1 What Is ServiceNow?

**ServiceNow** is an enterprise cloud platform that provides digital workflow management and IT service delivery solutions. It's a comprehensive platform for:

| Domain                              | Use Cases                                            |
| ----------------------------------- | ---------------------------------------------------- |
| **ITSM** (IT Service Management)    | Incident, Problem, Change, Request Management        |
| **ITOM** (IT Operations Management) | Infrastructure monitoring, alerts, incident response |
| **CMDB** (Configuration Management) | IT asset and dependency tracking                     |
| **HR Service Delivery**             | Employee onboarding, benefits, requests              |
| **Customer Service**                | Ticketing, knowledge base, customer portals          |
| **Security Operations**             | Vulnerability management, incident response          |
| **Custom Applications**             | Build enterprise business applications               |

### 5.2 Core Platform Concepts

#### **Application Scopes**

- **Global Scope:** Out-of-the-box ServiceNow functionality
- **Custom Scopes:** Isolated namespaces for custom applications
- **Scope Prefix:** All custom objects must include scope ID (e.g., `x_1998335_testlto_table`)
- **Isolation:** Scoped apps can be packaged, distributed, and installed independently

#### **Tables (Data Model)**

- ServiceNow stores all data in **tables** (similar to database tables)
- Each table has **columns** (fields) with types: String, Date, Integer, Reference, etc.
- **Relationships:** Foreign key references link tables (1:1, 1:N, M:N)
- **System Fields:** Every record has `sys_id` (unique identifier), `sys_created_on`, `sys_updated_on`, `sys_created_by`, `sys_updated_by`

#### **Forms & Lists**

- **Form:** Record editing interface with layout, field validation, display logic
- **List:** Table view showing multiple records in columnar format
- **UI Policies:** Client-side rules (mandatory, read-only, show/hide fields)
- **Client Scripts:** JavaScript that runs in user's browser on form/list

#### **Business Rules (Server-Side Automation)**

- **Trigger Points:** Before/After Insert, Before/After Update, Before Delete
- **Execution Context:** Runs on server (Rhino JavaScript engine)
- **Access:** Full database access via GlideRecord API
- **Ideal for:** Validation, auto-calculation, data audit, cross-table updates

#### **Workflows & Flow Designer**

- **Workflow:** Legacy multi-step approval/task process
- **Flow Designer:** Modern, visual workflow builder for complex processes
- **Integration:** Connectors for external APIs, email, Slack, etc.

#### **Access Control Lists (ACLs)**

- **Table ACLs:** Control CRUD operations on entire table
- **Field ACLs:** Control access to specific columns (read/write)
- **Condition:** ACLs can have conditions (e.g., user has role X, field value = Y)
- **Enforcement:** Applied at database level—cannot be bypassed by UI

#### **Roles & Permissions**

- **Role:** A collection of permissions and access levels
- **User Assignment:** Users assigned multiple roles
- **Role Hierarchy:** Roles can extend other roles
- **Group Assignment:** Roles can be assigned to groups of users

#### **Script Includes & APIs**

- **Script Include:** Reusable JavaScript library available to all scripts
- **GlideRecord:** Query and manipulate table data
- **GlideSession:** Access to current user and session info
- **REST API:** Built-in REST API for table data CRUD operations

#### **Notifications & Email**

- **Email Notifications:** Trigger-based automated email
- **SMS Notifications:** Text message delivery (if configured)
- **In-App Notifications:** Modal alerts and messages
- **Templates:** Rich HTML email templates with dynamic substitution

---

## 6. TECHNOLOGY STACK

### 6.1 Development Technologies

| Layer                   | Technology                         | Purpose                        | File Type       |
| ----------------------- | ---------------------------------- | ------------------------------ | --------------- |
| **Platform**            | ServiceNow PDI/Instance            | Cloud-based workflow platform  | N/A             |
| **Primary DSL**         | ServiceNow Fluent DSL (TypeScript) | Define metadata as code        | `.now.ts`       |
| **Server-Side Scripts** | JavaScript (Rhino Engine)          | Business logic, automation     | `.js`           |
| **Client-Side Scripts** | Browser JavaScript (ES6)           | Form/list validation, UI logic | `.js` in forms  |
| **UI Framework**        | Service Portal, Form Designer      | User interfaces                | HTML/CSS        |
| **Markup**              | HTML/CSS                           | Custom UI components           | `.html`, `.css` |
| **Build Tool**          | Node.js + ServiceNow SDK           | Compile, deploy, sync          | `package.json`  |
| **Package Manager**     | npm                                | Dependency management          | `package.json`  |
| **Version Control**     | Git                                | Source code management         | `.git`          |
| **Language**            | English                            | Documentation, code comments   | `.md`           |

### 6.2 ServiceNow Fluent DSL

**Fluent API** is a TypeScript-based Domain Specific Language (DSL) for defining ServiceNow metadata as code.

**Advantages:**

- ✅ **Version Control:** Metadata in Git, full history
- ✅ **Type Safety:** TypeScript provides compile-time error checking
- ✅ **Reusability:** Shared code patterns and utilities
- ✅ **Automated Deployment:** Build → compile → deploy pipeline
- ✅ **Two-Way Sync:** Pull changes from UI back to code

**Example:**

```typescript
import {
  Table,
  StringColumn,
  DateColumn,
  ReferenceColumn,
} from "@servicenow/sdk/core";

export const facility = Table({
  name: "x_1998335_testlto_facility",
  schema: {
    name: StringColumn({ label: "Facility Name", maxLength: 200 }),
    doh_license_number: StringColumn({ label: "DOH License Number" }),
    address: StringColumn({ label: "Address" }),
    compliance_officer: ReferenceColumn({
      label: "Compliance Officer",
      reference_to: "sys_user",
    }),
  },
});
```

### 6.3 Build & Deployment Pipeline

```
Source Code (.now.ts, .js)
        ↓
   [npm run build]  ← Fluent DSL compiler
        ↓
dist/ folder (compiled metadata artifacts)
        ↓
   [ServiceNow SDK validates]
        ↓
target/ folder (.zip deployment package)
        ↓
   [npm run deploy]  ← Upload to instance
        ↓
ServiceNow Instance (installed application)
        ↓
   [npm run sync]  ← Pull UI changes back to code
        ↓
src/fluent/generated/keys.ts (updated IDs)
```

### 6.4 Development Environment Setup

**Required:**

- **Node.js** (v14+) — JavaScript runtime
- **npm** (v6+) — Package manager
- **ServiceNow SDK** (`@servicenow/sdk` v4.x) — CLI tools
- **Git** — Version control
- **ServiceNow Developer Instance** — Test environment (PDI)

**Installation:**

```bash
npm install                    # Install dependencies
npm run build                  # Compile Fluent DSL
npm run deploy                 # Install to instance
npm run sync                   # Pull UI changes back
npm run dev                    # Watch mode for development
```

### 6.5 Project Dependencies

See `package.json` for complete list. Key dependencies:

```json
{
  "dependencies": {
    "@servicenow/sdk": "^4.6.0", // ServiceNow SDK
    "typescript": "^4.x", // TypeScript compiler
    "node": "^14.0.0" // Node.js runtime
  }
}
```

---

## 7. APPLICATION ARCHITECTURE

### 7.1 Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ServiceNow Instance                          │
│                  (PDI or Production)                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           Application Scope: x_1998335_testlto             │ │
│  │                                                            │ │
│  │  ┌──────────────────┐    ┌──────────────────┐            │ │
│  │  │  Data Layer      │    │  Business Logic  │            │ │
│  │  ├──────────────────┤    ├──────────────────┤            │ │
│  │  │ - Facility       │    │ - Business Rules │            │ │
│  │  │ - License        │    │ - Client Scripts │            │ │
│  │  │ - Alert          │    │ - Workflows      │            │ │
│  │  │ - Form Checklist │    │ - Scheduled Jobs │            │ │
│  │  │ - Evidence File  │    │ - Email Notif.   │            │ │
│  │  │ - Audit Log      │    │                  │            │ │
│  │  └──────────────────┘    └──────────────────┘            │ │
│  │                                                            │ │
│  │  ┌──────────────────┐    ┌──────────────────┐            │ │
│  │  │  Security Layer  │    │   UI Layer       │            │ │
│  │  ├──────────────────┤    ├──────────────────┤            │ │
│  │  │ - Roles (2)      │    │ - Dashboard      │            │ │
│  │  │ - ACLs (25+)     │    │ - Forms          │            │ │
│  │  │ - Field-level    │    │ - Lists          │            │ │
│  │  │   permissions    │    │ - Menu           │            │ │
│  │  └──────────────────┘    └──────────────────┘            │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────┐    ┌────────────────────┐             │
│  │ Global Tables      │    │ Integration APIs   │             │
│  │ - sys_user         │    │ - REST API         │             │
│  │ - sys_attachment   │    │ - Table API        │             │
│  │ - sys_email        │    │ - GlideRecord      │             │
│  └────────────────────┘    └────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                 ┌────────────┴────────────┐
                 │                         │
          ┌──────▼──────┐         ┌──────▼──────┐
          │  Web Browser │         │   Email    │
          │   (Forms)    │         │   Server   │
          └──────────────┘         └────────────┘
```

### 7.2 Key Architectural Patterns

**1. Table Relationships**

```
Facility (1) ──── (N) License
                     │
                     ├──── (N) Alert
                     ├──── (N) Form Checklist
                     ├──── (N) Evidence File
                     └──── (N) Audit Log (via facility_id)

License ──────────► Facility (parent)
License ──────────► sys_user (compliance_officer through facility)
Alert ──────────► License
Form Checklist ──► License
Evidence File ──► License + sys_attachment (binary)
Audit Log ──────► License + Facility + sys_user
```

**2. Data Flow (Daily Scheduled Job)**

```
[06:00 AM PST] Daily Alert Checker Runs
        ↓
Query all License records (status != expired, stage != released)
        ↓
For each license:
  - Calculate days_before_expiry = expiry_date - today
  - If days_before_expiry ∈ {90, 60, 30, 7}:
    - Check if alert already exists for this day (dedup)
    - If not, create Alert record
    ↓
Email Notification triggers on Alert insert
        ↓
Compliance Officer receives email alert
```

**3. Status Computation Logic**

```
IF renewal_stage ≠ "not_started" AND renewal_stage ≠ "released"
   THEN status = "under_renewal"
ELSE IF days_before_expiry < 0
   THEN status = "expired"
ELSE IF days_before_expiry ≤ 90
   THEN status = "expiring_soon"
ELSE
   status = "active"
```

**4. Renewal Stage Progression (Unidirectional)**

```
Not Started
    ↓ (forward only)
Documents Gathering
    ↓ (forward only)
Submitted to DOH
    ↓ (forward only)
Under Evaluation
    ↓ (forward only)
Released (terminal state)

← Backward transitions are prevented by BR-L-03
```

---

## 8. DATA MODEL OVERVIEW

### 8.1 Entity-Relationship Diagram

```
┌─────────────────┐
│    Facility     │◄──────────┐
├─────────────────┤           │
│ sys_id (PK)     │           │
│ name            │           │ 1:N
│ doh_license_#   │           │
│ facility_type   │           │
│ address         │           │
│ compliance_offc ├──┐        │
│ active          │  │        │
│ sys_created_on  │  │        │
└─────────────────┘  │        │
                     │        │
                     ▼        │
┌─────────────────────────────┤ ┌──────────────────┐
│      License                │ │    sys_user      │
├─────────────────────────────┤ ├──────────────────┤
│ sys_id (PK)                 │ │ sys_id (PK)      │
│ facility_id (FK) ─────────────┤ name             │
│ license_number              │ │ email            │
│ license_type (DOH/OLRS)     │ │ roles            │
│ issue_date                  │ └──────────────────┘
│ expiry_date                 │
│ status (computed)           │  ┌──────────────────┐
│ renewal_stage               │  │   sys_attachment │
│ days_before_expiry (computed)  ├──────────────────┤
│ checklist_pct (computed)    │  │ sys_id (PK)      │
│ notes                       │  │ file_name        │
│ sys_created_on              │  │ file_content     │
└─────────────────────────────┤  │ size_bytes       │
           │                  │  └──────────────────┘
           │ 1:N              │         ▲
           │                  │         │
      ┌────┴────┬────┬────┐   │         │
      │          │    │    │   │         │
      ▼          ▼    ▼    ▼   │         │
  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────────┐
  │ Alert  │ │Checklist   │Audit  │ │Evidence File│
  ├────────┤ ├────────┤ │ Log    │ ├─────────────┤
  │days_bef│ │license │ ├────────┤ │license_id FK│
  │channel │ │form_n  │ │user_id │ │attach_id FK │
  │status  │ │complet │ │action  │ │file_name    │
  │sent_at │ │complet │ │field   │ │file_type    │
  │alert_d │ │by_user │ │old_val │ │uploaded_by  │
  │        │ │complet │ │new_val │ │uploaded_at  │
  │        │ │at_time │ │change_t│ │             │
  └────────┘ └────────┘ └────────┘ └─────────────┘
```

### 8.2 Table Specifications (Summary)

| Table Name                         | Record Count | Primary Key | Purpose                  |
| ---------------------------------- | ------------ | ----------- | ------------------------ |
| `x_1998335_testlto_facility`       | ~50-200      | sys_id      | Healthcare facilities    |
| `x_1998335_testlto_license`        | ~150-600     | sys_id      | DOH & OLRS licenses      |
| `x_1998335_testlto_alert`          | ~1000-5000   | sys_id      | Expiry alerts (archived) |
| `x_1998335_testlto_form_checklist` | ~750-3000    | sys_id      | Required documents       |
| `x_1998335_testlto_evidence_file`  | ~5000-20000  | sys_id      | Uploaded evidence        |
| `x_1998335_testlto_audit_log`      | ~10000+      | sys_id      | Change audit trail       |

### 8.3 Choice List Values (Enumerations)

**License Type:**

- `doh_lto_main` — DOH LTO (Main)
- `olrs_radiology` — OLRS Variation — Radiology (X-Ray)
- `olrs_pharmacy` — OLRS Variation — Pharmacy

**License Status:**

- `active` — Active (expiry > 90 days)
- `expiring_soon` — Expiring Soon (1–90 days)
- `expired` — Expired (past due)
- `under_renewal` — Under Renewal (in process)

**Renewal Stage:**

- `not_started` — Not Started
- `documents_gathering` — Documents Gathering
- `submitted_to_doh` — Submitted to DOH
- `under_evaluation` — Under Evaluation
- `released` — Released

---

## 9. BUSINESS LOGIC & AUTOMATION

### 9.1 Business Rules Summary

| ID      | Trigger              | Table          | Purpose                                             |
| ------- | -------------------- | -------------- | --------------------------------------------------- |
| BR-L-01 | Before Insert/Update | License        | Compute `days_before_expiry` and `status`           |
| BR-L-02 | After Insert         | License        | Auto-create `form_checklist` items per license_type |
| BR-L-03 | Before Update        | License        | Prevent backward `renewal_stage` transitions        |
| BR-L-04 | After Update         | License        | Create `alert` records at 90/60/30/7 day thresholds |
| BR-L-05 | After Update         | License        | Log stage changes to `audit_log`                    |
| BR-L-06 | Before Insert        | License        | Validate unique `license_number` per facility       |
| BR-F-01 | Before Insert        | Facility       | Check for duplicate `doh_license_number`            |
| BR-C-01 | Before Update        | Form Checklist | Auto-timestamp and user-track completion            |

### 9.2 Automated Workflows

**Daily Alert Generation (Scheduled Job)**

```
Trigger: 06:00 AM PST daily
Query: All licenses where status ≠ expired AND renewal_stage ≠ released
Logic:
  For each license:
    days_left = expiry_date - today
    if days_left ∈ {90, 60, 30, 7}:
      if Alert(license_id, days_left, date) doesn't exist:
        create Alert record
        → triggers email notification
```

**License Status Auto-Computation**

```
Trigger: Before any Insert/Update on License
Logic:
  days_left = expiry_date - today
  if renewal_stage ≠ {not_started, released}:
    status = under_renewal
  else if days_left < 0:
    status = expired
  else if days_left ≤ 90:
    status = expiring_soon
  else:
    status = active
```

**Auto-Populate Form Checklist**

```
Trigger: After Insert on License
Logic:
  if license_type = doh_lto_main:
    create 7 form items [DOH LTO Application, COC, FSIC, ...]
  else if license_type = olrs_radiology:
    create 5 form items [OLRS Radiology Application, RSO Cert, ...]
  else if license_type = olrs_pharmacy:
    create 5 form items [OLRS Pharmacy Application, FDA Cert, ...]
```

### 9.3 Client-Side Validations

| Script | Trigger                      | Validation                                           |
| ------ | ---------------------------- | ---------------------------------------------------- |
| CS-01  | Evidence File form submit    | File size ≤ 10 MB, type in [PDF, JPG, PNG, DOCX]     |
| CS-02  | License renewal_stage change | Confirm stage transition (prevent accidental clicks) |

---

## 10. AI TRAINING ESSENTIALS

### 10.1 For AI Code Generation

**When generating code for this application, the AI assistant must understand:**

1. **Scope Prefix Convention**
   - All custom object names MUST start with `x_1998335_testlto_`
   - ✅ Correct: `x_1998335_testlto_license`
   - ❌ Wrong: `license` or `testlto_license`

2. **Fluent DSL Syntax** (`.now.ts` files)

   ```typescript
   import {
     Table,
     StringColumn,
     DateColumn,
     ReferenceColumn,
   } from "@servicenow/sdk/core";
   import { BusinessRule } from "@servicenow/sdk/core";

   // Define a table
   export const my_table = Table({
     name: "x_1998335_testlto_my_table",
     extends: "task", // optional inheritance
     schema: {
       field_name: StringColumn({ label: "Field Label", maxLength: 100 }),
     },
   });

   // Define a business rule
   export const my_br = BusinessRule({
     $id: Now.ID["my_br_id"],
     name: "My Rule Name",
     table: "x_1998335_testlto_my_table",
     when: "before", // before or after
     action: ["insert", "update"], // insert, update, delete
     script: (current, previous) => {
       // business rule code here
     },
   });
   ```

3. **JavaScript Business Rule Patterns**

   ```javascript
   // Access current record
   var fieldValue = current.field_name.toString();

   // Modify current record
   current.status = "active";

   // Query another table
   var gr = new GlideRecord("x_1998335_testlto_facility");
   gr.addQuery("sys_id", facilityId);
   gr.query();
   if (gr.next()) {
     var facilityName = gr.name.toString();
   }

   // Insert a new record
   var newRecord = new GlideRecord("x_1998335_testlto_alert");
   newRecord.license_id = current.sys_id;
   newRecord.days_before_expiry = 30;
   newRecord.insert();

   // Date calculations
   var today = new GlideDateTime();
   var daysLeft = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
   ```

4. **ACL & Role Assignments**

   ```typescript
   // Define roles
   export const admin_role = Role({
     name: "x_1998335_testlto_admin",
     label: "LTO Admin",
   });

   // Define table ACLs
   export const facility_read_acl = ACL({
     table: "x_1998335_testlto_facility",
     operation: "read",
     role: "x_1998335_testlto_viewer",
     allow: true,
   });
   ```

5. **Available APIs in Business Rules**

   ```javascript
   // System utilities
   gs.log("message"); // Log to debug log
   gs.info("message"); // Info level log
   gs.warn("message"); // Warning level log
   gs.getProperty("property_name"); // Get system property

   // Dates
   var now = gs.nowDateTime(); // Current date/time as string
   var gdt = new GlideDateTime(); // GlideDateTime object

   // User info
   gs.getUserID(); // Current user's sys_id
   gs.getUser().getFullName(); // Current user's full name
   gs.getUser().hasRole("role_name"); // Check if user has role

   // Transactions
   gs.abortAction(); // Abort the current operation
   ```

6. **GlideRecord Query Patterns**

   ```javascript
   // Simple query
   var gr = new GlideRecord("x_1998335_testlto_license");
   gr.addQuery("facility_id", facilityId);
   gr.addQuery("status", "expiring_soon");
   gr.query();

   // Iterate results
   while (gr.next()) {
     gs.log(gr.license_number);
     gs.log(gr.days_before_expiry);
   }

   // Get single record
   var gr = new GlideRecord("x_1998335_testlto_license");
   if (gr.get(licenseId)) {
     var expiryDate = gr.expiry_date.toString();
   }
   ```

### 10.2 Common Mistakes to Avoid

| Mistake                               | Why It's Wrong                                        | Correct Approach                    |
| ------------------------------------- | ----------------------------------------------------- | ----------------------------------- |
| Using table name without scope prefix | Violates naming convention, conflicts with other apps | Always prefix: `x_1998335_testlto_` |
| Hardcoding date calculations          | Timezone issues, daylight saving time bugs            | Use GlideDateTime API               |
| Modifying audit_log records           | Violates audit trail integrity                        | Only insert from business rules     |
| Not checking for duplicate alerts     | Creates alert spam                                    | Use deduplication key logic         |
| Backward stage transitions allowed    | Violates workflow rules                               | Implement BR-L-03 check             |
| Missing scope in script references    | References won't resolve                              | Always include full scope path      |
| Not validating file uploads           | Security risk, storage bloat                          | Validate size and type on client    |
| Hardcoded user roles/IDs              | Breaks on deployment to new instances                 | Query user by email or property     |

### 10.3 File Organization & Conventions

```
src/
├── fluent/
│   ├── index.now.ts              # Main entry point (imports all modules)
│   ├── tables/                   # Table definitions
│   │   ├── facility.now.ts
│   │   ├── license.now.ts
│   │   ├── alert.now.ts
│   │   ├── form_checklist.now.ts
│   │   ├── evidence_file.now.ts
│   │   └── audit_log.now.ts
│   ├── roles/
│   │   └── roles.now.ts          # Application roles
│   ├── acls/
│   │   └── acls.now.ts           # Access control lists
│   ├── business_rules/
│   │   ├── license.now.ts        # License table BRs
│   │   └── facility.now.ts       # Facility table BRs
│   ├── scheduled_scripts/
│   │   └── daily_alerts.now.ts
│   └── generated/
│       └── keys.ts               # Auto-generated: object ID mapping
│
└── server/
    ├── br_license.js             # License BR scripts
    ├── br_facility.js            # Facility BR scripts
    ├── br_checklist.js           # Checklist BR scripts
    └── scheduled_alert_job.js    # Scheduled job script
```

### 10.4 Development Workflow for AI Assistance

**When asking the AI to modify the application:**

1. **Be Specific**
   - ✅ "Add a new field `compliance_deadline` to License table with type Date"
   - ❌ "Update the License table"

2. **Provide Context**
   - Mention which table/script you're modifying
   - Explain the business logic requirement
   - Link to related tables/fields if applicable

3. **Reference Existing Patterns**
   - "Similar to how BR-L-01 computes days_before_expiry..."
   - "Follow the same pattern as Form Checklist auto-generation..."

4. **Request Validation**
   - Ask AI to verify scope prefix usage
   - Request confirmation of naming conventions
   - Ask for deduplication logic if creating records

5. **After Implementation**
   - Run `npm run build` to validate syntax
   - Run `npm run deploy` to install changes
   - Test in ServiceNow UI to verify functionality

### 10.5 Testing & Validation Checklist

When the AI makes code changes, verify:

- [ ] **Syntax:** Code compiles without errors (`npm run build`)
- [ ] **Naming:** All custom objects include `x_1998335_testlto_` prefix
- [ ] **References:** All table/field references exist
- [ ] **Scope:** No global table modifications (only scoped objects)
- [ ] **ACLs:** New objects have appropriate role-based ACLs
- [ ] **Audit:** Data modifications logged to audit_log
- [ ] **Dates:** Date calculations use GlideDateTime API
- [ ] **Duplicates:** No duplicate records created (dedup logic present)
- [ ] **Relationships:** Foreign keys reference correct parent tables

---

## 11. DEVELOPMENT WORKFLOW

### 11.1 Adding a New Feature (Step-by-Step)

**Example: Add "Compliance Notes" field to License**

1. **Define the Change** (Fluent DSL)

   ```typescript
   // In src/fluent/tables/license.now.ts
   export const license = Table({
     name: "x_1998335_testlto_license",
     schema: {
       // ... existing fields ...
       compliance_notes: StringColumn({
         label: "Compliance Notes",
         maxLength: 2000,
       }),
     },
   });
   ```

2. **Update Business Logic** (if needed)

   ```javascript
   // In src/server/br_license.js
   // Update BR-L-05 to log compliance_notes changes
   if (current.compliance_notes !== previous.compliance_notes) {
     // create audit log entry
   }
   ```

3. **Add Validation** (if needed)

   ```typescript
   export const validate_notes_br = BusinessRule({
     $id: Now.ID["br_notes_validation"],
     table: "x_1998335_testlto_license",
     when: "before",
     action: ["insert", "update"],
     script: (current) => {
       if (!current.compliance_notes) {
         current.compliance_notes = ""; // default to empty
       }
     },
   });
   ```

4. **Build & Deploy**

   ```bash
   npm run build        # Compile changes
   npm run deploy       # Install to instance
   ```

5. **Test in ServiceNow UI**
   - Open a License record
   - Verify compliance_notes field appears
   - Enter text and save
   - Verify audit log records the change

6. **Sync Back to Code** (if modified in UI)
   ```bash
   npm run sync         # Pull UI changes back to keys.ts
   git add .
   git commit -m "Add compliance_notes field to License"
   ```

### 11.2 Development Commands

```bash
# One-time setup
npm install                    # Install dependencies

# Development cycle
npm run build                  # Compile Fluent DSL → artifacts
npm run dev                    # Watch mode (auto-recompile on file changes)

# Deployment
npm run deploy                 # Upload & install to instance

# Synchronization
npm run sync                   # Pull UI changes back to code

# Troubleshooting
npm run build --verbose        # Detailed build output
git status                     # Check changed files
git diff src/fluent/index.now.ts  # View code changes
```

### 11.3 Common Development Tasks

| Task                 | Command/Action                                                        |
| -------------------- | --------------------------------------------------------------------- |
| Create new table     | Add file `src/fluent/tables/table_name.now.ts` with Table definition  |
| Add business rule    | Add to `src/server/br_*.js` and reference in Fluent with BusinessRule |
| Add client script    | Define in form designer in ServiceNow UI (or migrate to Fluent)       |
| Create scheduled job | Add to `src/fluent/scheduled_scripts/` with ScheduledScript           |
| Add role             | Update `src/fluent/roles/roles.now.ts`                                |
| Add ACL              | Update `src/fluent/acls/acls.now.ts`                                  |
| Pull UI changes      | `npm run sync` → updates `keys.ts`                                    |
| Deploy to production | `npm run build && npm run deploy`                                     |

---

## 12. QUICK REFERENCE

### 12.1 Key Files & Their Purposes

| File                            | Purpose                                                    |
| ------------------------------- | ---------------------------------------------------------- |
| `now.config.json`               | ServiceNow instance connection settings (URL, credentials) |
| `package.json`                  | npm dependencies and build scripts                         |
| `src/fluent/index.now.ts`       | Main application entry point (imports all metadata)        |
| `src/fluent/tables/*.now.ts`    | Table schema definitions                                   |
| `src/fluent/roles/roles.now.ts` | Application roles                                          |
| `src/fluent/acls/acls.now.ts`   | Access control lists                                       |
| `src/server/*.js`               | Server-side business rule scripts                          |
| `src/fluent/generated/keys.ts`  | **Auto-generated** ServiceNow object ID mapping            |
| `DEVELOPMENT.md`                | Detailed development guide                                 |
| `SERVICENOW_TECH_STACK.md`      | Tech stack reference                                       |
| `APPLICATION_PROGRESS.md`       | **This file** — overall progress & AI guide                |

### 12.2 Important IDs & Names

| Item               | Value                                  | Usage                     |
| ------------------ | -------------------------------------- | ------------------------- |
| **Scope Prefix**   | `x_1998335_testlto`                    | All custom objects        |
| **Admin Role**     | `x_1998335_testlto_compliance_officer` | Full access               |
| **Viewer Role**    | `x_1998335_testlto_compliance_viewer`  | Read-only                 |
| **Facility Table** | `x_1998335_testlto_facility`           | Hospital/facility records |
| **License Table**  | `x_1998335_testlto_license`            | DOH & OLRS licenses       |
| **Alert Table**    | `x_1998335_testlto_alert`              | Expiry notifications      |
| **Dashboard**      | `lto_dashboard`                        | Service Portal page       |

### 12.3 Scope Prefix Breakdown

```
x_1998335_testlto_
│  │      │      │
│  │      │      └─ Application: test LTO (health tracker)
│  │      └──────── Developer ID: 1998335
│  └─────────────── Custom object marker
└────────────────── ServiceNow convention
```

### 12.4 Naming Conventions

| Object Type        | Pattern                                 | Example                                |
| ------------------ | --------------------------------------- | -------------------------------------- |
| **Table**          | `x_1998335_testlto_[table_name]`        | `x_1998335_testlto_license`            |
| **Field**          | `[field_name]` (lowercase, underscores) | `expiry_date`, `days_before_expiry`    |
| **Business Rule**  | `[BR/CS]-[TABLE]-[SEQUENCE]`            | `BR-L-01`, `CS-01`                     |
| **Role**           | `x_1998335_testlto_[role_type]`         | `x_1998335_testlto_compliance_officer` |
| **Script Include** | `x_1998335_testlto_[function_name]`     | `x_1998335_testlto_license_helper`     |

### 12.5 Troubleshooting Quick Links

| Problem                         | Solution                                                                   |
| ------------------------------- | -------------------------------------------------------------------------- |
| **Build fails**                 | Check `npm run build` output for syntax errors; validate `.now.ts` imports |
| **Deploy fails**                | Verify `now.config.json` connection; check instance credentials            |
| **Field not appearing**         | Rebuild and redeploy; clear browser cache                                  |
| **Business rule not firing**    | Check trigger condition; verify table/field names; check debug log         |
| **Email notification not sent** | Verify recipient user has email; check email configuration in instance     |
| **Duplicate alerts created**    | Check deduplication logic in alert creation script                         |
| **Audit log missing entries**   | Verify BR-L-05 is deployed; check that operation triggered rule            |

### 12.6 Contacts & Resources

- **ServiceNow Instance:** PDI (Personal Developer Instance)
- **Development Platform:** GitHub + npm + ServiceNow SDK
- **Documentation:** See SERVICENOW_TECH_STACK.md and DEVELOPMENT.md
- **Build Tool:** ServiceNow SDK (`@servicenow/sdk` v4.x)

---

## Summary

This **Health Online LTO & Ancillary Licensing Tracker** application is a production-ready ServiceNow scoped application that automates compliance management for Philippine healthcare facilities. The application has been **successfully built and deployed** with 6 custom tables, 8 business rules, automated alerts, a compliance dashboard, and complete audit trails.

The technology stack leverages **ServiceNow Fluent DSL (TypeScript)** for metadata-as-code, enabling version control, automated deployment, and maintainability. The architecture follows ServiceNow best practices with role-based access control, data isolation via scopes, and serverless automation via business rules and scheduled jobs.

For AI-assisted development, understand the **scope prefix convention** (`x_1998335_testlto_`), **Fluent DSL patterns**, **JavaScript business rule APIs**, and **ACL/role management**. The provided development guide covers all essential information needed to extend or maintain the application.

---

**Generated:** April 16, 2026  
**For:** AI Training & Development Reference  
**Status:** ✅ Application Live & Ready for Enhancements
