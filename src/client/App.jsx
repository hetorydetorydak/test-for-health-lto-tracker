import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
          <Route path="/" element={<LTODashboard />} />
          <Route path="/facilities" element={<FacilitiesList />} />
          <Route path="/facilities/new" element={<FacilityForm />} />
          <Route path="/facilities/:id/edit" element={<FacilityForm />} />
          <Route path="/licenses" element={<LicensesList />} />
          <Route path="/licenses/new" element={<LicenseForm />} />
          <Route path="/licenses/:id" element={<LicenseDetail />} />
          <Route path="/licenses/:id/edit" element={<LicenseForm />} />
          <Route path="/licenses/:id/checklist" element={<FormChecklist />} />
          <Route path="/licenses/:id/evidence" element={<EvidenceFiles />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
