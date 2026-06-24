import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSession, getRequestById, financeReview } from '../../data/api'
import { getEmployeeById } from '../../data/employees'
import { getStatusLabel, getStatusBadgeClass, formatDateTime, formatINR, formatDate } from '../../utils/helpers'
import FinanceSidebar from '../../components/Layout/FinanceSidebar'
import Topbar from '../../components/Layout/Topbar'

export default function FinanceReview() {
  const session  = getSession()
  const { id }   = useParams()
  const [r, setR] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [note,  setNote]  = useState('')
  const [done,  setDone]  = useState(null)
  const [noteErr, setNoteErr] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getRequestById(id)
        setR(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div style={{padding:'40px'}}>Loading request...</div>

  if (!r) return (
    <div className="app-shell">
      <FinanceSidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Review Request" />
        <main className="page-content">
          <div className="card" style={{textAlign:'center',padding:'80px'}}>
            <div style={{fontSize:'24px',fontWeight:700,marginBottom:'12px'}}>Request Not Found</div>
            <Link to="/finance/requests" className="btn btn-secondary btn-lg">← Back</Link>
          </div>
        </main>
      </div>
    </div>
  )

  const emp  = getEmployeeById(r.empId)
  const isTravel = r.type === 'business-travel'
  const isIntl = isTravel && r.subtype === 'international'
  const isPreApprovalPending = isTravel && r.preApprovalStatus === 'pending'
  const isSettlementPending  = isTravel && r.settlementStatus === 'submitted'
  const isOtherPending       = !isTravel && r.status === 'pending'
  const canAction = isPreApprovalPending || isSettlementPending || isOtherPending

  async function handleAction(decision) {
    if (!note.trim() && decision === 'rejected') { setNoteErr(true); return }
    setNoteErr(false)
    
    try {
      await financeReview(id, { action: decision, financeNote: note })
      setDone(decision)
    } catch (err) {
      console.error(err)
    }
  }

  function renderMoney(foreignAmt, inrAmt) {
    if (!isIntl || r.settlement?.currency === '₹') return formatINR(inrAmt || foreignAmt)
    return `${r.settlement.currency} ${foreignAmt} (₹ ${Math.round(inrAmt).toLocaleString()})`
  }

  if (done) return (
    <div className="app-shell">
      <FinanceSidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Review Complete" />
        <main className="page-content">
          <div className="card" style={{textAlign:'center',padding:'80px 32px'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:done==='approved'?'var(--color-success-bg)':'var(--color-error-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={done==='approved'?'var(--color-success)':'var(--color-error)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {done==='approved'
                  ? <polyline points="20 6 9 17 4 12"/>
                  : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                }
              </svg>
            </div>
            <div style={{fontSize:'24px',fontWeight:700,marginBottom:'12px'}}>
              Request {done === 'approved' ? 'Approved' : 'Rejected'}
            </div>
            <p className="text-muted mb-6" style={{fontSize:'15px'}}>
              {r.id} has been <strong>{done}</strong>.{note && ` Note: "${note}"`}
            </p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center'}}>
              <Link to="/finance/requests" className="btn btn-primary btn-lg">Back to All Requests</Link>
              <Link to="/finance/dashboard" className="btn btn-secondary btn-lg">Dashboard</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )

  const docDict = {
    knoxMail:'Knox Approval Mail', passport:'Passport', visa:'Visa',
    insurance:'Travel Insurance', empId:'Employee ID', flightTicket:'Flight Ticket',
    boardingPass:'Boarding Pass', paymentProof:'Payment Proof',
    tripReport:'Trip Report', revisedKnox:'Revised Approval PDF', forexStatement:'Forex Statement', passportStamp:'Passport Stamps'
  }

  // Combine docs from pre-approval and settlement for easy viewing
  const allDocs = []
  if (r.documents) {
    Object.keys(r.documents).forEach(k => {
      if (r.documents[k]) allDocs.push({ key: k, label: docDict[k] || k, name: r.documents[k], phase: 'Pre-Approval' })
    })
  }
  if (r.settlement) {
    ['boardingPass', 'passportStamp', 'tripReport', 'revisedKnox', 'forexStatement', 'hotelBill'].forEach(k => {
      if (r.settlement[k]) allDocs.push({ key: k, label: docDict[k] || k, name: r.settlement[k], phase: 'Settlement' })
    })
  }

  return (
    <div className="app-shell">
      <FinanceSidebar session={session} />
      <div className="main-content">
        <Topbar session={session}
          breadcrumbs={[{label:'Finance Dashboard',to:'/finance/dashboard'},{label:'All Requests',to:'/finance/requests'},{label:r.id}]} />
        <main className="page-content" style={{maxWidth:'900px', margin:'0 auto'}}>
          
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
            <div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'var(--color-text-1)',marginBottom:'8px',letterSpacing:'-0.5px'}}>{r.title}</h1>
              <p style={{color:'var(--color-text-3)',fontSize:'15px'}}>
                ID: <strong style={{color:'var(--color-text-1)'}}>{r.id}</strong> &nbsp;·&nbsp; Submitted: {formatDateTime(r.submittedAt)}
              </p>
            </div>
            <span className={`badge ${getStatusBadgeClass(r)}`} style={{fontSize:'14px',padding:'6px 16px'}}>{getStatusLabel(r)}</span>
          </div>

          <div className="card" style={{padding:'40px',boxShadow:'var(--shadow-float)',borderRadius:'var(--radius-xl)'}}>
            
            {/* Employee Block */}
            <div style={{marginBottom:'40px'}}>
              <h3 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--color-brand-600)',marginBottom:'16px',borderBottom:'2px solid var(--color-brand-100)',paddingBottom:'8px'}}>
                1. Employee Information
              </h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',background:'#f8fafc',padding:'20px',borderRadius:'12px',border:'1px solid var(--color-border-light)'}}>
                <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Name / ID</span><strong style={{fontSize:'15px'}}>{emp?.name} ({r.empId})</strong></div>
                <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>CL Level</span><strong style={{fontSize:'15px'}}>{emp?.cl}</strong></div>
                <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Team</span><strong style={{fontSize:'15px'}}>{emp?.team}</strong></div>
                <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Project</span><strong style={{fontSize:'15px'}}>{emp?.project}</strong></div>
              </div>
            </div>

            {/* Travel Details Block */}
            {isTravel && (
              <div style={{marginBottom:'40px'}}>
                <h3 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--color-brand-600)',marginBottom:'16px',borderBottom:'2px solid var(--color-brand-100)',paddingBottom:'8px'}}>
                  2. Approved Trip Parameters
                </h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',rowGap:'16px',columnGap:'24px'}}>
                  <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Type</span><strong style={{fontSize:'15px',textTransform:'capitalize'}}>{r.subtype}</strong></div>
                  <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Destination</span><strong style={{fontSize:'15px'}}>{r.destination} {r.area ? `(${r.area})` : ''}</strong></div>
                  <div><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Travel Dates</span><strong style={{fontSize:'15px'}}>{formatDate(r.startDate)} — {formatDate(r.endDate)} ({r.days} days)</strong></div>
                  <div style={{gridColumn:'1/-1'}}><span style={{color:'var(--color-text-3)',fontSize:'13px',display:'block'}}>Business Purpose</span><strong style={{fontSize:'15px'}}>{r.purpose}</strong></div>
                </div>
              </div>
            )}

            {/* Settlement Block */}
            {isSettlementPending && r.settlement && (
              <div style={{marginBottom:'40px'}}>
                <h3 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--color-brand-600)',marginBottom:'16px',borderBottom:'2px solid var(--color-brand-100)',paddingBottom:'8px'}}>
                  3. Settlement Claim
                </h3>
                
                {r.settlement.isExtended && (
                  <div className="alert alert-warning mb-4" style={{borderLeft:'4px solid var(--color-warning)'}}>
                    <strong>Trip Extended:</strong> Employee extended trip to {formatDate(r.settlement.revisedEndDate)} (Total: {r.settlement.revisedDays} days). Revised Knox Approval attached below.
                  </div>
                )}

                <div style={{background:'#fff',border:'1px solid var(--color-border-light)',borderRadius:'12px',overflow:'hidden'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',textAlign:'left',fontSize:'15px'}}>
                    <thead>
                      <tr style={{background:'#f8fafc',borderBottom:'1px solid var(--color-border-light)'}}>
                        <th style={{padding:'16px',fontWeight:600,color:'var(--color-text-2)'}}>Expense Category</th>
                        <th style={{padding:'16px',fontWeight:600,color:'var(--color-text-2)'}}>Details</th>
                        <th style={{padding:'16px',fontWeight:600,color:'var(--color-text-2)',textAlign:'right'}}>Amount Requested</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{borderBottom:'1px dashed var(--color-border-light)'}}>
                        <td style={{padding:'16px'}}>Hotel</td>
                        <td style={{padding:'16px',color:'var(--color-text-3)'}}>{r.settlement.hotelName}</td>
                        <td style={{padding:'16px',textAlign:'right',fontWeight:500}}>{renderMoney(r.settlement.hotelAmountForeign, r.settlement.hotelAmountInr)}</td>
                      </tr>
                      <tr style={{borderBottom:'1px dashed var(--color-border-light)'}}>
                        <td style={{padding:'16px'}}>Per Diem</td>
                        <td style={{padding:'16px',color:'var(--color-text-3)'}}>{r.settlement.revisedDays || r.days} days</td>
                        <td style={{padding:'16px',textAlign:'right',fontWeight:500}}>{renderMoney(r.settlement.perDiemForeign, r.settlement.perDiemInr)}</td>
                      </tr>
                      <tr style={{borderBottom:'1px dashed var(--color-border-light)'}}>
                        <td style={{padding:'16px'}}>Local Conveyance</td>
                        <td style={{padding:'16px',color:'var(--color-text-3)'}}>{r.settlement.conveyanceType === 'own_vehicle' ? `${r.settlement.conveyanceKm} km (Own Vehicle)` : `${r.settlement.conveyanceTrips} Trips (Cab)`}</td>
                        <td style={{padding:'16px',textAlign:'right',fontWeight:500}}>{renderMoney(r.settlement.conveyanceAmountForeign, r.settlement.conveyanceAmountInr)}</td>
                      </tr>
                      {r.settlement.winterClothesClaimed && (
                        <tr style={{borderBottom:'1px dashed var(--color-border-light)'}}>
                          <td style={{padding:'16px',color:'var(--color-purple)',fontWeight:600}}>Winter Clothes</td>
                          <td style={{padding:'16px',color:'var(--color-text-3)'}}>Korea {'>'}= 30 Days</td>
                          <td style={{padding:'16px',textAlign:'right',fontWeight:500,color:'var(--color-purple)'}}>{renderMoney(r.settlement.winterClothesAmountForeign, r.settlement.winterClothesAmountInr)}</td>
                        </tr>
                      )}
                      <tr style={{background:'var(--color-brand-50)'}}>
                        <td colSpan="2" style={{padding:'20px 16px',fontWeight:700,fontSize:'16px',color:'var(--color-brand-700)'}}>Total Reimbursement Recommended</td>
                        <td style={{padding:'20px 16px',textAlign:'right',fontWeight:800,fontSize:'20px',color:'var(--color-brand-700)'}}>
                          {renderMoney(r.settlement.totalAmountForeign, r.settlement.totalAmountInr)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents Block */}
            {allDocs.length > 0 && (
              <div style={{marginBottom: canAction ? '40px' : '0'}}>
                <h3 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--color-brand-600)',marginBottom:'16px',borderBottom:'2px solid var(--color-brand-100)',paddingBottom:'8px'}}>
                  {isSettlementPending ? '4. Supporting Documents' : '3. Supporting Documents'}
                </h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))',gap:'16px'}}>
                  {allDocs.map((doc, idx) => (
                    <div key={idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px',border:'1px solid var(--color-border-light)',borderRadius:'12px',background:'#fff'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'var(--color-brand-50)',color:'var(--color-brand-600)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div>
                          <div style={{fontSize:'14px',fontWeight:600,color:'var(--color-text-1)'}}>{doc.label}</div>
                          <div style={{fontSize:'12px',color:'var(--color-text-3)'}}>{doc.name}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setPreviewDoc(doc.name)}>Preview</button>
                        <button className="btn btn-sm btn-secondary" title="Download">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finance Actions Block */}
            {canAction && (
              <div style={{borderTop:'2px solid var(--color-text-1)',paddingTop:'32px',marginTop:'32px'}}>
                <h3 style={{fontSize:'18px',fontWeight:700,marginBottom:'24px',color:'var(--color-text-1)'}}>Finance Decision</h3>
                
                <div className="form-group mb-5">
                  <label className="form-label" style={{fontSize:'15px'}}>Finance Review Note {!isPreApprovalPending && <span className="required">*</span>}</label>
                  <textarea className="form-textarea" rows={4} style={{fontSize:'15px'}}
                    placeholder="Enter approval conditions or reasons for rejection..."
                    value={note} onChange={e => { setNote(e.target.value); setNoteErr(false) }} />
                  {noteErr && <div className="form-error-msg mt-2">A note is required when rejecting or settling.</div>}
                </div>

                <div style={{display:'flex',gap:'16px'}}>
                  <button className="btn btn-primary btn-lg" style={{flex:1,height:'56px',fontSize:'16px'}} onClick={() => handleAction('approved')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Approve {isPreApprovalPending ? 'Pre-Approval' : 'Settlement'}
                  </button>
                  <button className="btn btn-danger btn-lg" style={{flex:1,height:'56px',fontSize:'16px'}} onClick={() => handleAction('rejected')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject Request
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Document Preview</div>
              <button className="modal-close" onClick={() => setPreviewDoc(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="doc-preview-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'16px',opacity:0.5}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <div style={{fontSize:'16px',fontWeight:600,color:'var(--color-text-1)',marginBottom:'8px'}}>{previewDoc}</div>
                <div style={{fontSize:'14px'}}>Secure Document Viewer (Mocked)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
