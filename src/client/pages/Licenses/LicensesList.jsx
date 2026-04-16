import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader, DataTable, EmptyState } from '../../components/index';
import { StatusBadge } from '../../components/StatusBadge';
import * as LTOService from '../../services/LTOService';
import './licenses.css';

/**
 * Page 04 — Licenses List
 */
export default function LicensesList() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [counts, setCounts] = useState({ all: 0, active: 0, expiring_soon: 0, expired: 0, under_renewal: 0 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [activeTab, search, typeFilter, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await LTOService.getLicenses(
        activeTab === 'all' ? null : activeTab,
        typeFilter === 'all' ? null : typeFilter,
        search,
        page,
        10
      );
      setLicenses(Array.isArray(response) ? response : response.result || []);
    } catch (error) {
      console.error('Failed to load licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'facility_id', label: 'Facility', sortable: true },
    { key: 'license_type', label: 'License Type', sortable: true },
    { key: 'license_number', label: 'License #', sortable: true },
    { key: 'expiry_date', label: 'Expiry Date', sortable: true },
    { key: 'days_before_expiry', label: 'Days Left', sortable: true },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    { key: 'renewal_stage', label: 'Stage', sortable: false },
  ];

  return (
    <div className="licenses-page">
      <PageHeader
        icon={LayoutDashboard}
        title="All Licenses"
        breadcrumbs={['Licenses']}
        actions={[{ label: '+ New License', variant: 'primary', onClick: () => window.location.href = '/licenses/new' }]}
      />

      {/* Tab Bar */}
      <div className="licenses__tabs">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'active', label: 'Active', count: counts.active },
          { key: 'expiring_soon', label: 'Expiring Soon', count: counts.expiring_soon },
          { key: 'expired', label: 'Expired', count: counts.expired },
          { key: 'under_renewal', label: 'Under Renewal', count: counts.under_renewal },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`licenses__tab ${activeTab === tab.key ? 'licenses__tab--active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="licenses__search-row">
        <input
          type="text"
          placeholder="Search facility or license #..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="licenses__search-input"
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="licenses__select"
        >
          <option value="all">All Types</option>
          <option value="doh_lto_main">DOH LTO (Main)</option>
          <option value="olrs_radiology">OLRS – Radiology</option>
          <option value="olrs_pharmacy">OLRS – Pharmacy</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={licenses}
        loading={loading}
        emptyState={<EmptyState message="No licenses found" />}
      />
    </div>
  );
}
