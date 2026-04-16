import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader, DataTable, EmptyState } from '../../components/index';
import { StatusBadge } from '../../components/StatusBadge';
import StatCard from '../../components/StatCard';
import * as LTOService from '../../services/LTOService';
import './LTODashboard.css';

/**
 * Page 01 — Dashboard
 * At-a-glance compliance health for all facilities
 */
export default function LTODashboard() {
  const [stats, setStats] = useState({ active: 0, expiring_soon: 0, expired: 0, under_renewal: 0 });
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [counts, expiring, alerts] = await Promise.all([
        LTOService.getLicenseStatusCounts(),
        LTOService.getExpiringLicenses(90),
        LTOService.getRecentAlerts(10),
      ]);

      setStats(counts);
      setExpiringLicenses(Array.isArray(expiring) ? expiring : expiring.result || []);
      setRecentAlerts(Array.isArray(alerts) ? alerts : alerts.result || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCardConfigs = [
    { label: 'Active', count: stats.active, status: 'active', onClick: () => window.location.href = '/licenses?status=active' },
    { label: 'Expiring Soon', count: stats.expiring_soon, status: 'expiring_soon', onClick: () => window.location.href = '/licenses?status=expiring_soon' },
    { label: 'Expired', count: stats.expired, status: 'expired', onClick: () => window.location.href = '/licenses?status=expired' },
    { label: 'Under Renewal', count: stats.under_renewal, status: 'under_renewal', onClick: () => window.location.href = '/licenses?status=under_renewal' },
  ];

  const expiringColumns = [
    { key: 'facility_id', label: 'Facility', sortable: true },
    { key: 'license_type', label: 'License Type', sortable: true },
    { key: 'license_number', label: 'License #', sortable: true },
    { key: 'expiry_date', label: 'Expiry Date', sortable: true },
    { key: 'days_before_expiry', label: 'Days', sortable: true },
    { key: 'renewal_stage', label: 'Stage', sortable: false },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <a href={`/licenses/${row.sys_id}`} className="dashboard__view-link">
          View
        </a>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        icon={LayoutDashboard}
        title="LTO Compliance Dashboard"
        breadcrumbs={['Dashboard']}
      />

      {/* Stat Cards */}
      <div className="dashboard__stats">
        {statCardConfigs.map((config) => (
          <StatCard
            key={config.status}
            label={config.label}
            count={config.count}
            status={config.status}
            onClick={config.onClick}
          />
        ))}
      </div>

      {/* Expiring Licenses Section */}
      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Expiring Within 90 Days</h2>
        <DataTable
          columns={expiringColumns}
          data={expiringLicenses}
          loading={loading}
          emptyState={
            <EmptyState
              message="No licenses expiring in the next 90 days"
              subtext="All licenses are in good standing"
            />
          }
        />
      </div>

      {/* Recent Alerts Section */}
      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Recent Alerts</h2>
        {recentAlerts.length === 0 ? (
          <EmptyState message="No recent alerts" />
        ) : (
          <div className="dashboard__alerts-feed">
            {recentAlerts.map((alert) => (
              <div key={alert.sys_id} className="dashboard__alert-item">
                <div className="dashboard__alert-meta">
                  <span className="dashboard__alert-threshold">
                    {alert.days_before_expiry}-Day Alert
                  </span>
                  <span className="dashboard__alert-channel">{alert.channel}</span>
                </div>
                <div className="dashboard__alert-time">
                  {new Intl.DateTimeFormat('en-PH', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(alert.sent_at))}
                </div>
              </div>
            ))}
          </div>
        )}
        <a href="/alerts" className="dashboard__view-all-link">
          View all alerts →
        </a>
      </div>
    </div>
  );
}
