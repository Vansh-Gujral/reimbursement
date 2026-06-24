import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSession, getAllRequests } from '../../data/api'
import { getStatusLabel, getStatusBadgeClass, getTypeLabel, formatDate, formatINR } from '../../utils/helpers'
import FinanceSidebar from '../../components/Layout/FinanceSidebar'
import Topbar from '../../components/Layout/Topbar'

export default function FinanceRequests() {
  const session = getSession()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [typeFilter,   setTypeFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search,       setSearch]       = useState('')
  const [empFilter,    setEmpFilter]    = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllRequests()
        setAll(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div style={{padding:'40px'}}>Loading requests...</div>

  const filtered = all.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false
    if (empFilter  && !r.empId.toLowerCase().includes(empFilter.toLowerCase())) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.id.includes(search)) return false
    const label = getStatusLabel(r).toLowerCase()
    if (statusFilter && !label.includes(statusFilter)) return false
    return true
  })

  return (
    <div className="app-shell">
      <FinanceSidebar session={session} />
      <div className="main-content">
        <Topbar session={session}
          breadcrumbs={[{label:'Finance Dashboard',to:'/finance/dashboard'},{label:'All Requests'}]} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">All Requests</h1>
              <p className="page-header__sub">{all.length} total submissions across all employees</p>
            </div>
          </div>

          <div className="card">
            <div className="filter-bar mb-5">
              <input className="form-input" placeholder="Search title or ID…" value={search}
                onChange={e => setSearch(e.target.value)} style={{maxWidth:'220px'}} />
              <input className="form-input" placeholder="Filter by Emp ID…" value={empFilter}
                onChange={e => setEmpFilter(e.target.value)} style={{maxWidth:'160px'}} />
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
                <option value="submitted">Submitted</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__title">No requests match filters</div>
                <div className="empty-state__desc">Try adjusting your search criteria.</div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr>
                    <th>Request ID</th>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Submitted</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(r => {
                      const isActionable = r.preApprovalStatus === 'pending' ||
                        r.settlementStatus === 'submitted' ||
                        (r.type !== 'business-travel' && r.status === 'pending')
                      return (
                        <tr key={r.id}>
                          <td><span className="col-id">{r.id}</span></td>
                          <td style={{fontSize:'13px',fontWeight:500}}>{r.empId}</td>
                          <td><span style={{fontSize:'11px',background:'var(--color-surface)',padding:'2px 7px',borderRadius:'4px',color:'var(--color-text-3)'}}>{getTypeLabel(r.type)}</span></td>
                          <td style={{maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</td>
                          <td style={{color:'var(--color-text-3)',fontSize:'13px',whiteSpace:'nowrap'}}>{formatDate(r.submittedAt)}</td>
                          <td className="col-amount">{formatINR(r.settlementAmount || r.amount)}</td>
                          <td><span className={`badge ${getStatusBadgeClass(r)}`}>{getStatusLabel(r)}</span></td>
                          <td>
                            <Link to={`/finance/review/${r.id}`}
                              className={`btn btn-sm ${isActionable ? 'btn-accent' : 'btn-ghost'}`}>
                              {isActionable ? 'Review →' : 'View'}
                            </Link>
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
