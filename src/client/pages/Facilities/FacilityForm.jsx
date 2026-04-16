import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FacilityForm() {
  return (
    <div className="facility-form-page">
      <PageHeader icon="🏥" title="Facility Form" breadcrumbs={['Facilities', 'Form']} />
      <EmptyState message="Facility form implementation pending" />
    </div>
  );
}
