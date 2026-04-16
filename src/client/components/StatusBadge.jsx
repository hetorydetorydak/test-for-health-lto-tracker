import React from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import './components.css';

/**
 * StatusBadge — Renders a colored pill with icon + label
 * @param {string} status - 'active' | 'expiring_soon' | 'expired' | 'under_renewal'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function StatusBadge({ status = 'active', size = 'sm' }) {
  const config = {
    active: {
      label: 'Active',
      icon: CheckCircle2,
      textVar: '--sn-green',
      bgVar: '--sn-green-bg',
      borderVar: '--sn-green-border',
    },
    expiring_soon: {
      label: 'Expiring Soon',
      icon: Clock,
      textVar: '--sn-amber',
      bgVar: '--sn-amber-bg',
      borderVar: '--sn-amber-border',
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      textVar: '--sn-red',
      bgVar: '--sn-red-bg',
      borderVar: '--sn-red-border',
    },
    under_renewal: {
      label: 'Under Renewal',
      icon: RefreshCw,
      textVar: '--sn-purple',
      bgVar: '--sn-purple-bg',
      borderVar: '--sn-purple-border',
    },
  };

  const { label, icon: Icon, textVar, bgVar, borderVar } = config[status] || config.active;

  return (
    <div
      className={`status-badge status-badge--${size} status-badge--${status}`}
      style={{
        color: `var(${textVar})`,
        backgroundColor: `var(${bgVar})`,
        borderColor: `var(${borderVar})`,
      }}
    >
      <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} className="status-badge__icon" />
      <span className="status-badge__label">{label}</span>
    </div>
  );
}

export default StatusBadge;
