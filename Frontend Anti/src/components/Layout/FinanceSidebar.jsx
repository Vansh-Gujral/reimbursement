import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getInitials } from '../../utils/helpers'

const NAV_ICON_DASHBOARD = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
const NAV_ICON_REQUESTS = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const BRAND_ICON = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>

export default function FinanceSidebar({ session }) {
  const [isMinimized, setIsMinimized] = useState(false)
  const navClass = ({ isActive }) => 'sidebar-nav__item' + (isActive ? ' active finance' : '')

  return (
    <aside className={`sidebar finance-theme ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/finance/dashboard" className="sidebar-brand">
          <div className="sidebar-brand__icon finance">{BRAND_ICON}</div>
          {!isMinimized && (
            <div className="sidebar-brand__text">
              <div className="sidebar-brand__name">FinanceHQ</div>
            </div>
          )}
        </NavLink>
        <button className="sidebar-toggle" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? "Expand" : "Minimize"}>
          {isMinimized ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {!isMinimized && <div className="sidebar-nav__section">Finance Menu</div>}
        <NavLink to="/finance/dashboard" className={navClass} title={isMinimized ? "Dashboard" : ""}>
          {NAV_ICON_DASHBOARD}
          {!isMinimized && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/finance/requests" className={navClass} title={isMinimized ? "All Requests" : ""}>
          {NAV_ICON_REQUESTS}
          {!isMinimized && <span>All Requests</span>}
        </NavLink>
      </nav>

      {!isMinimized && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user__avatar finance">{getInitials(session?.name)}</div>
            <div className="sidebar-user__info">
              <div className="sidebar-user__name">{session?.name || '—'}</div>
              <div className="sidebar-user__meta">Finance Team</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
