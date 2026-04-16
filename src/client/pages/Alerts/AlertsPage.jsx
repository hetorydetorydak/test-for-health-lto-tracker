import React from 'react';
import { Bell } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function AlertsPage() {
  return (
    <div className="alerts-page">
      <PageHeader icon={Bell} title="Alerts" breadcrumbs={['Alerts']} />
      <EmptyState message="Alerts implementation pending" />
    </div>
  );
}
