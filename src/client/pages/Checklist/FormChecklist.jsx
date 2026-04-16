import React from 'react';
import { ClipboardList } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FormChecklist() {
  return (
    <div className="checklist-page">
      <PageHeader icon={ClipboardList} title="Form Checklist" breadcrumbs={['Licenses', 'Checklist']} />
      <EmptyState message="Form checklist implementation pending" />
    </div>
  );
}
