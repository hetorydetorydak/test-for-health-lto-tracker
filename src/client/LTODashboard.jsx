import React, { useEffect, useState, useMemo } from 'react';
import { LTOService } from './services/LTOService.js';
import StatCard from './components/StatCard.jsx';
import ExpiringLicensesTable from './components/ExpiringLicensesTable.jsx';
import RecentAlerts from './components/RecentAlerts.jsx';
import './LTODashboard.css';

export default function LTODashboard() {
  const service = useMemo(() => new LTOService(), []);
  const [stats, setStats] = useState({
    active: 0,
    expiring: 0,
    expired: 0
  });
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recordsPerPage = 10;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading dashboard data...');
        
        // Load all stats
        const [activeLicenses, expiringSoon, expiredLicenses, expiringIn90Days, alerts] = await Promise.all([
          service.getLicensesByStatus('active').catch(err => {
            console.error('Error loading active licenses:', err);
            return [];
          }),
          service.getLicensesByStatus('expiring_soon').catch(err => {
            console.error('Error loading expiring soon licenses:', err);
            return [];
          }),
          service.getLicensesByStatus('expired').catch(err => {
            console.error('Error loading expired licenses:', err);
            return [];
          }),
          service.getExpiringLicenses(90).catch(err => {
            console.error('Error loading expiring in 90 days:', err);
            return [];
          }),
          service.getRecentAlerts(30).catch(err => {
            console.error('Error loading recent alerts:', err);
            return [];
          })
        ]);

        console.log('Dashboard data loaded:', {
          active: activeLicenses.length,
          expiring: expiringSoon.length,
          expired: expiredLicenses.length,
          expiringIn90Days: expiringIn90Days.length,
          alerts: alerts.length
        });

        setStats({
          active: activeLicenses.length,
          expiring: expiringSoon.length,
          expired: expiredLicenses.length
        });
        
        setExpiringLicenses(expiringIn90Days);
        setRecentAlerts(alerts);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [service]);

  // Pagination logic
  const totalPages = Math.ceil(expiringLicenses.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedLicenses = expiringLicenses.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading LTO Tracker Dashboard...</h2>
        <p>Please wait while we load your license data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="lto-dashboard">
      <header className="dashboard-header">
        <h1>🏥 LTO Tracker Dashboard</h1>
        <p>Philippine Department of Health License Management</p>
      </header>

      {/* Stats Cards */}
      <section className="stats-section">
        <StatCard
          title="Active Licenses"
          count={stats.active}
          color="success"
          icon="✅"
        />
        <StatCard
          title="Expiring Soon"
          count={stats.expiring}
          color="warning"
          icon="⚠️"
        />
        <StatCard
          title="Expired Licenses"
          count={stats.expired}
          color="danger"
          icon="❌"
        />
      </section>

      {/* Main Content Grid */}
      <section className="content-grid">
        {/* Expiring Licenses Table */}
        <div className="content-card">
          <h2>📋 Licenses Expiring in 90 Days</h2>
          <ExpiringLicensesTable
            licenses={paginatedLicenses}
            currentPage={currentPage}
            totalPages={totalPages}
            recordsPerPage={recordsPerPage}
            totalRecords={expiringLicenses.length}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Recent Alerts */}
        <div className="content-card">
          <h2>🔔 Recent Alerts (Last 30 Days)</h2>
          <RecentAlerts alerts={recentAlerts} />
        </div>
      </section>
    </div>
  );
}