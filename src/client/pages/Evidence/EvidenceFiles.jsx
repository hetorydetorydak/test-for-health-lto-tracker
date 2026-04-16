import React from 'react';
import { Upload } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function EvidenceFiles() {
  return (
    <div className="evidence-page">
      <PageHeader icon={Upload} title="Evidence Files" breadcrumbs={['Licenses', 'Evidence']} />
      <EmptyState message="Evidence files implementation pending" />
    </div>
  );
}
