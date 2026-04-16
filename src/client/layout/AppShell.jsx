import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './layout.css';

/**
 * AppShell — Main layout wrapper with sidebar + topbar
 */
export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="app-shell__main">
        <Topbar onLogout={handleLogout} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
