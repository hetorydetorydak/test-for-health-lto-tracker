import React from 'react';
import { ChevronRight } from 'lucide-react';
import './components.css';

/**
 * PageHeader — Title, breadcrumb, and action buttons
 */
export function PageHeader({ icon: Icon, title, breadcrumbs = [], actions = [] }) {
  return (
    <div className="page-header">
      <div className="page-header__left">
        {Icon && <Icon size={24} className="page-header__icon" />}
        <h1 className="sn-heading-1">{title}</h1>
        {breadcrumbs.length > 0 && (
          <nav className="page-header__breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="page-header__breadcrumb-sep" />}
                <span className="page-header__breadcrumb-item">{crumb}</span>
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      {actions.length > 0 && (
        <div className="page-header__actions">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={`btn btn--${action.variant || 'primary'}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon && <action.icon size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
      <div className="page-header__divider" />
    </div>
  );
}

/**
 * EmptyState — Shown when no data available
 */
export function EmptyState({ icon: Icon, message, subtext, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} className="empty-state__icon" />}
      <h2 className="empty-state__message">{message}</h2>
      {subtext && <p className="empty-state__subtext">{subtext}</p>}
      {action && (
        <button className="btn btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * ConfirmModal — Delete/action confirmation overlay
 */
export function ConfirmModal({ title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header modal-header--${variant}`}>
          <h2 className="sn-heading-2">{title}</h2>
        </div>
        <div className="modal-body">
          <p className="sn-body">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn btn--${variant}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * DataTable — Sortable, filterable table component
 */
export function DataTable({ columns, data, loading = false, emptyState = null, onSort = null, sortBy = null, sortDir = 'asc' }) {
  return (
    <div className="data-table">
      {loading ? (
        <div className="data-table__loading">Loading...</div>
      ) : data.length === 0 ? (
        emptyState || <EmptyState message="No data available" />
      ) : (
        <table className="data-table__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`data-table__header ${onSort && col.sortable ? 'data-table__header--sortable' : ''}`}
                  onClick={() => onSort && col.sortable && onSort(col.key)}
                >
                  <div className="data-table__header-content">
                    {col.label}
                    {sortBy === col.key && (
                      <span className="data-table__sort-indicator">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="data-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="data-table__cell">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default { PageHeader, EmptyState, ConfirmModal, DataTable };
