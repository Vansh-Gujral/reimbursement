import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSession } from '../data/store'
import { getEmployeeDashboardStats } from '../data/api'
import { getStatusLabel, getStatusBadgeClass, getTypeLabel, formatDate, formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'

export default function Dashboard() {
  const session = getSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getEmployeeDashboardStats(session.empId)
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session.empId])

  if (loading) return <div style={{padding:'40px'}}>Loading dashboard...</div>
  if (!stats) return <div style={{padding:'40px'}}>Failed to load stats.</div>

  const { totalRequests: total, pending, approved, totalReimbursed: totalAmt, recentRequests: recent } = stats

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title={`Good day, ${session.name.split(' ')[0]}`}
          actions={<Link to="/app/new-request" className="btn btn-primary">+ New Request</Link>} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Dashboard</h1>
              <p className="page-header__sub">{session.empId} · {session.department} · <span className="cl-badge">{session.cl}</span></p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid-4 mb-6">
            <StatCard icon="📄" label="Total Requests"   value={total}          sub="All time"        bg="#F3F3F3" />
            <StatCard icon="⏳" label="Pending Review"   value={pending}        sub="Awaiting Finance" bg="#FFFBEB" />
            <StatCard icon="✅" label="Approved"         value={approved}       sub="Processed"       bg="#F0FDF4" />
            <StatCard icon="₹"  label="Total Reimbursed" value={formatINR(totalAmt)} sub="All time" bg="#EFF6FF" mono />
          </div>

          {/* Recent requests */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Recent Requests</div>
                <div className="card-subtitle">Your last {recent.length} submissions</div>
              </div>
              <Link to="/app/requests" className="btn btn-secondary btn-sm">View All →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__title">No requests yet</div>
                <div className="empty-state__desc">Submit your first reimbursement to get started.</div>
                <Link to="/app/new-request" className="btn btn-primary">+ New Request</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr>
                    <th>ID</th><th>Type</th><th>Title</th><th>Submitted</th><th>Amount</th><th>Status</th><th></th>
                  </tr></thead>
                  <tbody>
                    {recent.map(r => (
                      <tr key={r.id}>
                        <td><span className="col-id">{r.id}</span></td>
                        <td><span style={{fontSize:'11px',background:'var(--color-surface)',padding:'2px 7px',borderRadius:'4px',color:'var(--color-text-3)'}}>{getTypeLabel(r.type)}</span></td>
                        <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</td>
                        <td style={{color:'var(--color-text-3)',fontSize:'13px',whiteSpace:'nowrap'}}>{formatDate(r.submittedAt)}</td>
                        <td className="col-amount">{formatINR(r.settlementAmount || r.amount)}</td>
                        <td><span className={`badge ${getStatusBadgeClass(r)}`}>{getStatusLabel(r)}</span></td>
                        <td>
                          {r.type === 'business-travel'
                            ? <Link to={`/app/travel/view/${r.id}`} className="btn btn-ghost btn-sm">View</Link>
                            : <span className="btn btn-ghost btn-sm" style={{opacity:.4,cursor:'default'}}>View</span>
                          }
                        </td>
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

function StatCard({ icon, label, value, sub, bg, mono }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{background: bg, fontSize:'18px'}}>{icon}</div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value" style={mono ? {fontSize:'20px'} : {}}>{value}</div>
      <div className="stat-card__sub">{sub}</div>
    </div>
  )
}
