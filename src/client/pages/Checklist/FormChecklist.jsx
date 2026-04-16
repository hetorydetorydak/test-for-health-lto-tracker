import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FormChecklist() {
  return (
    <div className="checklist-page">
      <PageHeader icon="📋" title="Form Checklist" breadcrumbs={['Licenses', 'Checklist']} />
      <EmptyState message="Form checklist implementation pending" />
    </div>
  );
}
