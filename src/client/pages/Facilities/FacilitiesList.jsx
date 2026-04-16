import React from 'react';
import { Building2 } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FacilitiesList() {
  return (
    <div className="facilities-page">
      <PageHeader icon={Building2} title="Facilities" breadcrumbs={['Facilities']} />
      <EmptyState message="Facilities list implementation pending" />
    </div>
  );
}
