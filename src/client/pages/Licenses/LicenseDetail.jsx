import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/index';
import './licenses.css';

export default function LicenseDetail() {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checklist');

  return (
    <div className="license-detail-page">
      <PageHeader
        icon={FileText}
        title="License Detail"
        breadcrumbs={['Licenses', 'Detail']}
      />
      <EmptyState message="License detail implementation pending" />
    </div>
  );
}
