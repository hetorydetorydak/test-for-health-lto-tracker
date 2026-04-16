import React from 'react';
import './ExpiringLicensesTable.css';

export default function ExpiringLicensesTable({ 
  licenses, 
  currentPage, 
  totalPages, 
  recordsPerPage, 
  totalRecords, 
  onPageChange 
}) {
  
  // Helper function to extract values from ServiceNow objects
  const extractValue = (field, useDisplayValue = true) => {
    if (typeof field === 'object' && field !== null) {
      return useDisplayValue ? field.display_value : field.value;
    }
    return field;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusValue = extractValue(status);
    switch (statusValue) {
      case 'active': return 'success';
      case 'expiring_soon': return 'warning';
      case 'expired': return 'danger';
      case 'under_renewal': return 'info';
      default: return 'secondary';
    }
  };

  // Get days color based on urgency
  const getDaysColor = (days) => {
    const daysValue = parseInt(extractValue(days, false));
    if (daysValue <= 7) return 'text-danger';
    if (daysValue <= 30) return 'text-warning';
    if (daysValue <= 60) return 'text-info';
    return 'text-success';
  };

  if (licenses.length === 0) {
    return (
      <div className="no-data">
        <p>No licenses expiring in the next 90 days.</p>
      </div>
    );
  }

  return (
    <div className="expiring-licenses-table">
      {/* Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>License #</th>
              <th>Facility</th>
              <th>Type</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => {
              const sysId = extractValue(license.sys_id, false);
              const licenseNumber = extractValue(license.license_number);
              const facilityName = extractValue(license.facility_id);
              const licenseType = extractValue(license.license_type);
              const expiryDate = extractValue(license.expiry_date);
              const daysLeft = extractValue(license.days_before_expiry, false);
              const status = extractValue(license.status);
              const renewalStage = extractValue(license.renewal_stage);
              const checklistPct = extractValue(license.checklist_pct, false) || 0;

              return (
                <tr key={sysId}>
                  <td>
                    <strong>{licenseNumber}</strong>
                  </td>
                  <td>{facilityName}</td>
                  <td>
                    <span className="license-type">{licenseType}</span>
                  </td>
                  <td>{new Date(expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span className={getDaysColor(daysLeft)}>
                      <strong>{daysLeft} days</strong>
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${checklistPct}%` }}
                        />
                      </div>
                      <span className="progress-text">{checklistPct}%</span>
                    </div>
                    <div className="renewal-stage">{renewalStage}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} records
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}