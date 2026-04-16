import React, { useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import './layout.css';

/**
 * Topbar — Top navigation bar with breadcrumb and user menu
 */
export function Topbar({ onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h2 className="topbar__breadcrumb">Dashboard / License Registry</h2>
      </div>

      <div className="topbar__right">
        {/* Alert Bell */}
        <button className="topbar__alert-btn" title="View alerts">
          <Bell size={20} className="topbar__alert-icon" />
          <span className="topbar__alert-badge">3</span>
        </button>

        {/* User Menu */}
        <div className="topbar__user-menu">
          <button
            className="topbar__user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
          >
            <span className="topbar__user-avatar">👤</span>
            <span className="topbar__user-label">Juan Cruz</span>
          </button>

          {showUserMenu && (
            <div className="topbar__user-dropdown">
              <button
                className="topbar__menu-item"
                onClick={() => {
                  onLogout();
                  setShowUserMenu(false);
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
