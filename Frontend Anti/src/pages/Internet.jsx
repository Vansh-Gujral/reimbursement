import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession, createInternet } from '../data/api'
import { INTERNET_CAPS } from '../data/budgets'
import { formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'
import UploadZone from '../components/shared/UploadZone'

export default function Internet() {
  const session = getSession()
  const navigate = useNavigate()
  const cap = INTERNET_CAPS[session.cl] || 1000
  const [month,    setMonth]    = useState('')
  const [provider, setProvider] = useState('')
  const [amount,   setAmount]   = useState('')
  const [billFile, setBillFile] = useState(null)
  const [error,    setError]    = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit() {
    const amt = parseFloat(amount) || 0
    if (!month || !provider || amt <= 0 || !billFile) { setError(true); return }
    
    setLoading(true)
    try {
      await createInternet({
        empId: session.empId,
        month,
        provider,
        amount: Math.min(amt, cap),
        document: billFile.name
      })
      navigate('/app/requests')
    } catch (err) {
      console.error(err)
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'New Request',to:'/app/new-request'},{label:'Internet Bill'}]} />
        <main className="page-content form-page">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Internet Bill Reimbursement</h1>
              <p className="page-header__sub">Monthly WFH internet claim</p>
            </div>
          </div>

          <div className="card mb-5">
            <div className="alert alert-info mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Your internet reimbursement cap ({session.cl}): <strong>{formatINR(cap)} per month</strong>
            </div>
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">Bill Month <span className="required">*</span></label>
                <input className="form-input" type="month" value={month} onChange={e => setMonth(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Internet Provider <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="e.g. Airtel Broadband" value={provider} onChange={e => setProvider(e.target.value)} />
              </div>
            </div>
            <div className="form-group mb-5" style={{maxWidth:'280px'}}>
              <label className="form-label">Bill Amount (₹) <span className="required">*</span></label>
              <input className="form-input" type="number" min="0" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
              {parseFloat(amount) > cap && <div className="form-error-msg mt-1">Exceeds your cap — only {formatINR(cap)} will be reimbursed</div>}
            </div>
            <UploadZone label="Internet Bill" required onFile={setBillFile} />
          </div>

          {error && <div className="alert alert-error mb-4">Please fill all required fields and upload the bill.</div>}
          <div className="form-actions">
            <Link to="/app/new-request" className="btn btn-secondary">Cancel</Link>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Request</button>
          </div>
        </main>
      </div>
    </div>
  )
}

