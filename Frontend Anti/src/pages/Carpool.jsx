import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession, createCarpool } from '../data/api'
import { CARPOOL_RATE_PER_DAY } from '../data/budgets'
import { formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'
import UploadZone from '../components/shared/UploadZone'

export default function Carpool() {
  const session = getSession()
  const navigate = useNavigate()
  const [month,   setMonth]   = useState('')
  const [days,    setDays]    = useState('')
  const [from,    setFrom]    = useState('')
  const [to,      setTo]      = useState('')
  const [proof,   setProof]   = useState(null)
  const [error,   setError]   = useState(false)
  const [loading, setLoading] = useState(false)

  const cappedDays = Math.min(parseInt(days) || 0, 26)
  const total = cappedDays * CARPOOL_RATE_PER_DAY

  async function handleSubmit() {
    if (!month || !days || !from || !to || !proof) { setError(true); return }
    setLoading(true)
    try {
      await createCarpool({
        empId: session.empId,
        month,
        days: cappedDays,
        from,
        to,
        amount: total,
        document: proof.name
      })
      navigate('/app/requests')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'New Request',to:'/app/new-request'},{label:'Carpooling'}]} />
        <main className="page-content form-page">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Carpooling Reimbursement</h1>
              <p className="page-header__sub">{formatINR(CARPOOL_RATE_PER_DAY)} per working day · Max 26 days/month</p>
            </div>
          </div>

          <div className="card mb-5">
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">Month <span className="required">*</span></label>
                <input className="form-input" type="month" value={month} onChange={e => setMonth(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Working Days Carpooled <span className="required">*</span></label>
                <input className="form-input" type="number" min="1" max="26" placeholder="e.g. 18" value={days} onChange={e => setDays(e.target.value)} />
                <div className="form-hint">Maximum 26 days per month</div>
              </div>
            </div>
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">From (Pickup Point) <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="e.g. Sector 62, Noida" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">To (Office) <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="e.g. Connaught Place, Delhi" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </div>
            <div className="form-group mb-5" style={{maxWidth:'220px'}}>
              <label className="form-label">Total Amount</label>
              <input className="form-input" readOnly value={formatINR(total)} style={{fontWeight:700,fontSize:'18px'}} />
            </div>
            <UploadZone label="Carpool Proof" hint="Ride receipt, co-commuter declaration, or any supporting doc" required onFile={setProof} />
          </div>

          {error && <div className="alert alert-error mb-4">Please fill all required fields and upload proof.</div>}
          <div className="form-actions">
            <Link to="/app/new-request" className="btn btn-secondary">Cancel</Link>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Request</button>
          </div>
        </main>
      </div>
    </div>
  )
}
