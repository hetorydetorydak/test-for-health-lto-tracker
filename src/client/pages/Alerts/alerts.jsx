import React from 'react';
import AppShell from '../../layout/AppShell';
import AlertsPage from './AlertsPage';

export default function AlertsPageWrapper() {
  return (
    <AppShell>
      <AlertsPage />
    </AppShell>
  );
}
