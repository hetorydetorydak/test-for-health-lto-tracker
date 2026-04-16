import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function AuditLog() {
  return (
    <div className="auditlog-page">
      <PageHeader icon="📜" title="Audit Log" breadcrumbs={['Audit Log']} />
      <EmptyState message="Audit log implementation pending" />
    </div>
  );
}
