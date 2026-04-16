import React from 'react';
import { PageHeader, EmptyState } from '../../components/index';

export default function FacilitiesList() {
  return (
    <div className="facilities-page">
      <PageHeader icon="🏥" title="Facilities" breadcrumbs={['Facilities']} />
      <EmptyState message="Facilities list implementation pending" />
    </div>
  );
}
