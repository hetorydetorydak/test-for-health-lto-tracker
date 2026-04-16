import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Bell,
  History,
  ChevronLeft,
} from 'lucide-react';
import './layout.css';

/**
 * Sidebar — Left navigation rail
 */
export function Sidebar({ collapsed = false, onToggle }) {
  const location = useLocation();

  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Facilities', path: '/facilities' },
    { icon: FileText, label: 'Licenses', path: '/licenses' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: History, label: 'Audit Log', path: '/audit-log' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo & Toggle */}
      <div className="sidebar__header">
        {!collapsed && <div className="sidebar__logo">🛡 LTO Tracker</div>}
        <button className="sidebar__toggle" onClick={onToggle} title="Toggle sidebar">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
              title={item.label}
            >
              <Icon size={20} className="sidebar__nav-icon" />
              {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
            </Link>
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
