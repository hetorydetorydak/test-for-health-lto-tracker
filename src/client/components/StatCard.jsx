import React from 'react';
import './StatCard.css';

export default function StatCard({ title, count, color, icon }) {
  const cardClass = `stat-card stat-card-${color}`;
  
  return (
    <div className={cardClass}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-number">{count}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
}