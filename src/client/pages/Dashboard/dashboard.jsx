import React from 'react';
import AppShell from '../../layout/AppShell';
import LTODashboard from './LTODashboard';

/**
 * Dashboard Page Entry Point
 * Mounts in: x_1998335_testlto_dashboard.do
 */
export default function DashboardPage() {
  return (
    <AppShell>
      <LTODashboard />
    </AppShell>
  );
}
