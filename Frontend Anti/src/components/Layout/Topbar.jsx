import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSession } from '../../data/store'
import { getInitials } from '../../utils/helpers'

export default function Topbar({ session, title, breadcrumbs, actions }) {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  return (
    <header className="topbar">
      <div className="topbar-left">
        {title && <h1 className="topbar-title">{title}</h1>}
        {breadcrumbs && (
          <nav className="breadcrumbs">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                {bc.to ? (
                  <Link to={bc.to} className="breadcrumb-link">{bc.label}</Link>
                ) : (
                  <span className="breadcrumb-current">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      <div className="topbar-right">
        {actions && <div className="topbar-actions">{actions}</div>}
        
        <div className="profile-menu" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="profile-avatar">{getInitials(session?.name)}</div>
            <div className="profile-name">{session?.name?.split(' ')[0] || 'User'}</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-name">{session?.name}</div>
                <div className="dropdown-email">{session?.empId} {session?.cl ? `· ${session.cl}` : ''}</div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
