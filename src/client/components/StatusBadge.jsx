import React from 'react';
import './components.css';

/**
 * StatusBadge — Renders a colored pill with emoji + label
 * @param {string} status - 'active' | 'expiring_soon' | 'expired' | 'under_renewal'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function StatusBadge({ status = 'active', size = 'sm' }) {
  const config = {
    active: {
      label: 'Active',
      emoji: '✅',
      textVar: '--sn-green',
      bgVar: '--sn-green-bg',
      borderVar: '--sn-green-border',
    },
    expiring_soon: {
      label: 'Expiring Soon',
      emoji: '⏰',
      textVar: '--sn-amber',
      bgVar: '--sn-amber-bg',
      borderVar: '--sn-amber-border',
    },
    expired: {
      label: 'Expired',
      emoji: '❌',
      textVar: '--sn-red',
      bgVar: '--sn-red-bg',
      borderVar: '--sn-red-border',
    },
    under_renewal: {
      label: 'Under Renewal',
      emoji: '🔄',
      textVar: '--sn-purple',
      bgVar: '--sn-purple-bg',
      borderVar: '--sn-purple-border',
    },
  };

  const { label, emoji, textVar, bgVar, borderVar } = config[status] || config.active;

  return (
    <div
      className={`status-badge status-badge--${size} status-badge--${status}`}
      style={{
        color: `var(${textVar})`,
        backgroundColor: `var(${bgVar})`,
        borderColor: `var(${borderVar})`,
      }}
    >
      <span className="status-badge__emoji">{emoji}</span>
      <span className="status-badge__label">{label}</span>
    </div>
  );
}

export default StatusBadge;
