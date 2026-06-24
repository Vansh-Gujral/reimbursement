import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getSession, createRelocation } from '../data/api'
import { RELOCATION_CAPS } from '../data/budgets'
import { formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'
import UploadZone from '../components/shared/UploadZone'

export default function Relocation() {
  const session = getSession()
  const navigate = useNavigate()
  const cap = RELOCATION_CAPS[session.cl] || 75000
  
  const [teamName,  setTeamName]  = useState('')
  const [fromCity,  setFromCity]  = useState('')
  const [toCity,    setToCity]    = useState('')
  const [relocDate, setRelocDate] = useState('')
  const [amt,       setAmt]       = useState('')
  const [docs,      setDocs]      = useState({ empId:null, flightTicket:null, boardingPass:null, paymentProof:null })
  const [error,     setError]     = useState(false)
  const [loading,   setLoading]   = useState(false)

  const setFile = key => f => setDocs(p => ({...p,[key]:f}))

  async function handleSubmit() {
    if (!teamName || !fromCity || !toCity || !relocDate || !amt) { setError(true); return }
    if (!docs.empId || !docs.flightTicket || !docs.boardingPass || !docs.paymentProof) { setError(true); return }
    
    setLoading(true)
    try {
      await createRelocation({
        empId: session.empId,
        teamName,
        fromCity,
        toCity,
        relocDate,
        amount: Math.min(Number(amt), cap),
        documents: {
          empId: docs.empId.name,
          flightTicket: docs.flightTicket.name,
          boardingPass: docs.boardingPass.name,
          paymentProof: docs.paymentProof.name
        }
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
        <Topbar session={session} breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'New Request',to:'/app/new-request'},{label:'Relocation'}]} />
        <main className="page-content form-page">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Relocation Reimbursement</h1>
              <p className="page-header__sub">Your {session.cl} cap: {formatINR(cap)}</p>
            </div>
          </div>

          <div className="card mb-5">
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input className="form-input" readOnly value={session.empId} />
              </div>
              <div className="form-group">
                <label className="form-label">Team / Department <span className="required">*</span></label>
                <input className="form-input" placeholder="e.g. Technology" value={teamName} onChange={e => setTeamName(e.target.value)} />
              </div>
            </div>
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">From City <span className="required">*</span></label>
                <input className="form-input" placeholder="e.g. Pune" value={fromCity} onChange={e => setFromCity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">To City <span className="required">*</span></label>
                <input className="form-input" placeholder="e.g. Bengaluru" value={toCity} onChange={e => setToCity(e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Relocation Date <span className="required">*</span></label>
                <input className="form-input" type="date" value={relocDate} onChange={e => setRelocDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Claim Amount (₹) <span className="required">*</span></label>
                <input className="form-input" type="number" min="0" placeholder="0" value={amt} onChange={e => setAmt(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card mb-5">
            <div className="card-header">
              <div className="card-title">Required Documents</div>
              <span className="badge badge-draft">All 4 mandatory</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <UploadZone label="1. Employee ID Card" required onFile={setFile('empId')} />
              <UploadZone label="2. Flight Ticket" required onFile={setFile('flightTicket')} />
              <UploadZone label="3. Boarding Pass" required onFile={setFile('boardingPass')} />
              <UploadZone label="4. Payment Proof" hint="Bank statement / receipt showing relocation payment" required onFile={setFile('paymentProof')} />
            </div>
          </div>

          {error && <div className="alert alert-error mb-4">Please fill all fields and upload all 4 documents.</div>}
          <div className="form-actions">
            <Link to="/app/new-request" className="btn btn-secondary">Cancel</Link>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Request</button>
          </div>
        </main>
      </div>
    </div>
  )
}
