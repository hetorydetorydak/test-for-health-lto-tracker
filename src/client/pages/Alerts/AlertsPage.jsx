import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function AlertsPage() {
  return (
    <div className="alerts-page">
      <PageHeader icon="🔔" title="Alerts" breadcrumbs={['Alerts']} />
      <EmptyState message="Alerts implementation pending" />
    </div>
  );
}
