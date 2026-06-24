import { getSession, getFinanceDashboardStats } from '../../data/api'
import { getStatusLabel, getStatusBadgeClass, getTypeLabel, formatINR } from '../../utils/helpers'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FinanceSidebar from '../../components/Layout/FinanceSidebar'
import Topbar from '../../components/Layout/Topbar'

export default function FinanceDashboard() {
  const session = getSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getFinanceDashboardStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div style={{padding:'40px'}}>Loading dashboard...</div>
  if (!stats) return <div style={{padding:'40px'}}>Failed to load stats.</div>

  const {
    pendingPreApproval, pendingSettlement, pendingOther,
    approvedThisMonth, totalRejected, totalSubmittedValue,
    actionableRequests: actionable
  } = stats

  return (
    <div className="app-shell">
      <FinanceSidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Finance Dashboard"
          actions={<span className="badge badge-purple">Finance Portal</span>} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Finance Dashboard</h1>
              <p className="page-header__sub">Review and action all employee reimbursement requests</p>
            </div>
            <Link to="/finance/requests" className="btn btn-primary">View All Requests</Link>
          </div>

          {/* Stats */}
          <div className="grid-4 mb-6">
            <StatCard label="Pending Pre-Approvals" value={pendingPreApproval} bg="#FFFBEB" icon="⏳" />
            <StatCard label="Pending Settlements"   value={pendingSettlement}  bg="#F5F3FF" icon="📋" />
            <StatCard label="Other Pending"          value={pendingOther}       bg="#ECFEFF" icon="📄" />
            <StatCard label="Approved This Month"    value={approvedThisMonth}  bg="#F0FDF4" icon="✅" />
          </div>

          <div className="grid-2 mb-6">
            <div className="stat-card">
              <div className="stat-card__icon" style={{background:'#FEF2F2',fontSize:'18px'}}>❌</div>
              <div className="stat-card__label">Total Rejected</div>
              <div className="stat-card__value">{totalRejected}</div>
              <div className="stat-card__sub">All time</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon" style={{background:'#EFF6FF',fontSize:'18px'}}>₹</div>
              <div className="stat-card__label">Total Submitted Value</div>
              <div className="stat-card__value" style={{fontSize:'20px'}}>{formatINR(totalSubmittedValue)}</div>
              <div className="stat-card__sub">Across all requests</div>
            </div>
          </div>

          {/* Action needed */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Action Required</div>
                <div className="card-subtitle">{actionable.length} request{actionable.length !== 1 ? 's' : ''} awaiting your review</div>
              </div>
              <Link to="/finance/requests" className="btn btn-secondary btn-sm">View All →</Link>
            </div>
            {actionable.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__title">All clear!</div>
                <div className="empty-state__desc">No requests pending your action.</div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr>
                    <th>ID</th><th>Employee</th><th>Type</th><th>Title</th><th>Amount</th><th>Status</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {actionable.map(r => (
                      <tr key={r.id}>
                        <td><span className="col-id">{r.id}</span></td>
                        <td style={{fontSize:'13px'}}>{r.empId}</td>
                        <td><span style={{fontSize:'11px',background:'var(--color-surface)',padding:'2px 7px',borderRadius:'4px',color:'var(--color-text-3)'}}>{getTypeLabel(r.type)}</span></td>
                        <td style={{maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</td>
                        <td className="col-amount">{formatINR(r.settlementAmount || r.amount)}</td>
                        <td><span className={`badge ${getStatusBadgeClass(r)}`}>{getStatusLabel(r)}</span></td>
                        <td><Link to={`/finance/review/${r.id}`} className="btn btn-accent btn-sm">Review →</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, bg, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{background:bg,fontSize:'18px'}}>{icon}</div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  )
}
