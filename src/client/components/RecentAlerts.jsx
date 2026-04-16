import React from 'react';
import './RecentAlerts.css';

export default function RecentAlerts({ alerts }) {
  
  // Helper function to extract values from ServiceNow objects
  const extractValue = (field, useDisplayValue = true) => {
    if (typeof field === 'object' && field !== null) {
      return useDisplayValue ? field.display_value : field.value;
    }
    return field;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  // Get alert urgency color
  const getAlertColor = (days) => {
    const daysValue = parseInt(extractValue(days, false));
    if (daysValue <= 7) return 'alert-critical';
    if (daysValue <= 30) return 'alert-high';
    if (daysValue <= 60) return 'alert-medium';
    return 'alert-low';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const statusValue = extractValue(status);
    return statusValue === 'sent' ? '✅' : '❌';
  };

  if (alerts.length === 0) {
    return (
      <div className="no-alerts">
        <div className="no-alerts-icon">🔔</div>
        <p>No recent alerts found.</p>
        <small>Alerts will appear here when licenses are approaching expiry.</small>
      </div>
    );
  }

  return (
    <div className="recent-alerts">
      <div className="alerts-list">
        {alerts.slice(0, 10).map((alert) => {
          const sysId = extractValue(alert.sys_id, false);
          const licenseRef = extractValue(alert.license_id);
          const daysBeforeExpiry = extractValue(alert.days_before_expiry, false);
          const channel = extractValue(alert.channel);
          const status = extractValue(alert.status);
          const sentAt = extractValue(alert.sent_at);
          const alertDate = extractValue(alert.alert_date);

          return (
            <div key={sysId} className={`alert-item ${getAlertColor(daysBeforeExpiry)}`}>
              <div className="alert-header">
                <div className="alert-priority">
                  <span className="alert-days">{daysBeforeExpiry} days</span>
                  <span className="alert-status">{getStatusIcon(status)}</span>
                </div>
                <div className="alert-date">{formatDate(alertDate)}</div>
              </div>
              
              <div className="alert-content">
                <div className="alert-license">
                  <strong>License:</strong> {licenseRef}
                </div>
                <div className="alert-details">
                  <span className="alert-channel">📧 {channel}</span>
                  <span className="alert-sent">Sent: {formatDate(sentAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length > 10 && (
        <div className="view-all">
          <button className="btn-link">
            View all {alerts.length} alerts →
          </button>
        </div>
      )}
    </div>
  );
}