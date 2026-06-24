import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSession, getRequestsByEmployee } from '../data/api'
import { getStatusLabel, getStatusBadgeClass, getTypeLabel, formatDate, formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'

export default function Requests() {
  const session = getSession()
  const [allReqs, setAllReqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter,   setTypeFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getRequestsByEmployee(session.empId)
        setAllReqs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session.empId])

  if (loading) return <div style={{padding:'40px'}}>Loading requests...</div>

  const filtered = allReqs.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.id.includes(search)) return false
    const label = getStatusLabel(r).toLowerCase()
    if (statusFilter && !label.includes(statusFilter)) return false
    return true
  })

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session}
          breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'My Requests'}]}
          actions={<Link to="/app/new-request" className="btn btn-primary btn-sm">+ New</Link>} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">My Requests</h1>
              <p className="page-header__sub">{allReqs.length} total submission{allReqs.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="card">
            <div className="filter-bar mb-5">
              <input className="form-input" placeholder="Search title or ID…" value={search}
                onChange={e => setSearch(e.target.value)} style={{maxWidth:'260px'}} />
              <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="business-travel">Business Travel</option>
                <option value="internet-bill">Internet Bill</option>
                <option value="carpooling">Carpooling</option>
                <option value="relocation">Relocation</option>
              </select>
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__title">No requests found</div>
                <div className="empty-state__desc">Adjust filters or create a new request.</div>
                <Link to="/app/new-request" className="btn btn-primary">+ New Request</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr>
                    <th>Request ID</th><th>Type</th><th>Title</th><th>Submitted</th><th>Amount</th><th>Status</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(r => {
                      const canSettle = r.type === 'business-travel' && r.preApprovalStatus === 'approved' && !r.settlementStatus
                      return (
                        <tr key={r.id}>
                          <td><span className="col-id">{r.id}</span></td>
                          <td><span style={{fontSize:'11px',background:'var(--color-surface)',padding:'2px 7px',borderRadius:'4px',color:'var(--color-text-3)'}}>{getTypeLabel(r.type)}</span></td>
                          <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</td>
                          <td style={{color:'var(--color-text-3)',fontSize:'13px',whiteSpace:'nowrap'}}>{formatDate(r.submittedAt)}</td>
                          <td className="col-amount">{formatINR(r.settlementAmount || r.amount)}</td>
                          <td><span className={`badge ${getStatusBadgeClass(r)}`}>{getStatusLabel(r)}</span></td>
                          <td>
                            <div style={{display:'flex',gap:'6px'}}>
                              {r.type === 'business-travel' && (
                                <Link to={`/app/travel/view/${r.id}`} className="btn btn-ghost btn-sm">View</Link>
                              )}
                              {canSettle && (
                                <Link to={`/app/travel/settlement/${r.id}`} className="btn btn-accent btn-sm">Settle →</Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
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
