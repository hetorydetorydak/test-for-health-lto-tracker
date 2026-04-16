import React from 'react';
import { FileText } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function LicenseForm() {
  return (
    <div className="license-form-page">
      <PageHeader icon={FileText} title="License Form" breadcrumbs={['Licenses', 'Form']} />
      <EmptyState message="License form implementation pending" />
    </div>
  );
}
