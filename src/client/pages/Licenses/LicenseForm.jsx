import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function LicenseForm() {
  return (
    <div className="license-form-page">
      <PageHeader icon="📄" title="License Form" breadcrumbs={['Licenses', 'Form']} />
      <EmptyState message="License form implementation pending" />
    </div>
  );
}
