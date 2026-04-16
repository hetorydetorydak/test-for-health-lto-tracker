import React from 'react';
import './layout.css';

/**
 * Sidebar — Left navigation rail
 * Uses ServiceNow page endpoints (not React Router)
 */
export function Sidebar({ collapsed = false, onToggle }) {
  // ServiceNow page endpoints
  const NAV_ITEMS = [
    { emoji: '📊', label: 'Dashboard', endpoint: 'x_1998335_testlto_dashboard.do' },
    { emoji: '🏥', label: 'Facilities', endpoint: 'x_1998335_testlto_facilities.do' },
    { emoji: '📄', label: 'Licenses', endpoint: 'x_1998335_testlto_licenses.do' },
    { emoji: '🔔', label: 'Alerts', endpoint: 'x_1998335_testlto_alerts.do' },
    { emoji: '📜', label: 'Audit Log', endpoint: 'x_1998335_testlto_audit_log.do' },
  ];

  const isActive = (endpoint) => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.includes(endpoint);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo & Toggle */}
      <div className="sidebar__header">
        {!collapsed && <div className="sidebar__logo">🛡 LTO Tracker</div>}
        <button className="sidebar__toggle" onClick={onToggle} title="Toggle sidebar">
          ◀️
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.endpoint);

          return (
            <a
              key={item.endpoint}
              href={`/${item.endpoint}`}
              className={`sidebar__nav-item ${active ? 'sidebar__nav-item--active' : ''}`}
              title={item.label}
            >
              <span className="sidebar__nav-emoji">{item.emoji}</span>
              {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer (User Info) */}
      <div className="sidebar__footer">
        <div className="sidebar__user-avatar">👤</div>
        {!collapsed && (
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">Juan Cruz</div>
            <div className="sidebar__user-role">Admin</div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
