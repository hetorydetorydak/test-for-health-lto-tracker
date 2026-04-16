import React from 'react';
import ReactDOM from 'react-dom/client';
import './tokens.css';

// Page entry points (each mounted in its own ServiceNow UI Page)
import DashboardPage from './pages/Dashboard/dashboard';
import LicensesListPage from './pages/Licenses/licenses-list';
import LicenseDetailPage from './pages/Licenses/license-detail';
import LicenseFormPage from './pages/Licenses/license-form';
import FacilitiesListPage from './pages/Facilities/facilities-list';
import FacilityFormPage from './pages/Facilities/facility-form';
import FormChecklistPage from './pages/Checklist/checklist';
import EvidenceFilesPage from './pages/Evidence/evidence';
import AlertsPageWrapper from './pages/Alerts/alerts';
import AuditLogPage from './pages/AuditLog/audit-log';

/**
 * ServiceNow UI Page Entry Point
 * 
 * Each Fluent UiPage definition serves the same HTML with this script.
 * This script detects the current endpoint and mounts the appropriate React component.
 * 
 * Supported endpoints:
 * - x_1998335_testlto_dashboard.do → DashboardPage
 * - x_1998335_testlto_licenses.do → LicensesListPage
 * - x_1998335_testlto_license_detail.do → LicenseDetailPage
 * - x_1998335_testlto_license_form.do → LicenseFormPage
 * - x_1998335_testlto_facilities.do → FacilitiesListPage
 * - x_1998335_testlto_facility_form.do → FacilityFormPage
 * - x_1998335_testlto_checklist.do → FormChecklistPage
 * - x_1998335_testlto_evidence.do → EvidenceFilesPage
 * - x_1998335_testlto_alerts.do → AlertsPageWrapper
 * - x_1998335_testlto_audit_log.do → AuditLogPage
 */

const getPageComponent = () => {
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname;
  
  if (pathname.includes('license_form')) return LicenseFormPage;
  if (pathname.includes('license_detail')) return LicenseDetailPage;
  if (pathname.includes('licenses')) return LicensesListPage;
  if (pathname.includes('facility_form')) return FacilityFormPage;
  if (pathname.includes('facilities')) return FacilitiesListPage;
  if (pathname.includes('checklist')) return FormChecklistPage;
  if (pathname.includes('evidence')) return EvidenceFilesPage;
  if (pathname.includes('alerts')) return AlertsPageWrapper;
  if (pathname.includes('audit_log')) return AuditLogPage;
  if (pathname.includes('dashboard')) return DashboardPage;
  
  // Default to dashboard
  return DashboardPage;
};

const PageComponent = getPageComponent();

if (PageComponent) {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(
    <React.StrictMode>
      <PageComponent />
    </React.StrictMode>
  );
}