import React from 'react';
import { Building2 } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FacilityForm() {
  return (
    <div className="facility-form-page">
      <PageHeader icon={Building2} title="Facility Form" breadcrumbs={['Facilities', 'Form']} />
      <EmptyState message="Facility form implementation pending" />
    </div>
  );
}
