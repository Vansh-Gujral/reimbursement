import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSession, getRequestById } from '../../data/store'
import { getStatusLabel, getStatusBadgeClass, formatDate, formatDateTime, formatINR } from '../../utils/helpers'
import Sidebar from '../../components/Layout/Sidebar'
import Topbar from '../../components/Layout/Topbar'

export default function ViewRequest() {
  const session = getSession()
  const { id }  = useParams()
  const r       = getRequestById(id)
  const [tab,   setTab] = useState('details')

  if (!r || r.empId !== session.empId) return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Request Details" />
        <main className="page-content">
          <div className="card" style={{textAlign:'center',padding:'56px'}}>
            <div style={{fontSize:'20px',fontWeight:700,marginBottom:'8px'}}>Request Not Found</div>
            <p className="text-muted mb-5">This request does not exist or you don't have access.</p>
            <Link to="/app/requests" className="btn btn-secondary">← Back</Link>
          </div>
        </main>
      </div>
    </div>
  )

  const canSettle = r.preApprovalStatus === 'approved' && !r.settlementStatus
  const tabs = ['details','documents','timeline']
  if (r.settlement) tabs.splice(2, 0, 'settlement')

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session}
          breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'My Requests',to:'/app/requests'},{label:r.id}]}
          actions={canSettle ? <Link to={`/app/travel/settlement/${r.id}`} className="btn btn-accent">File Settlement →</Link> : null} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">{r.title}</h1>
              <p className="page-header__sub">{r.id} · Submitted {formatDateTime(r.submittedAt)}</p>
            </div>
            <span className={`badge ${getStatusBadgeClass(r)}`} style={{fontSize:'13px'}}>{getStatusLabel(r)}</span>
          </div>

          {r.financeNote && (
            <div className="alert alert-info mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span><strong>Finance Note:</strong> {r.financeNote}</span>
            </div>
          )}

          <div className="tabs">
            {tabs.map(t => (
              <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'details' && (
            <div className="card">
              {[['Request ID',r.id],['Trip Type',r.subtype==='international'?'International':'Domestic'],['Destination',r.destination+(r.region?` (${r.region})`:'')],['Travel Dates',`${formatDate(r.startDate)} — ${formatDate(r.endDate)}`],['Number of Days',`${r.days} day${r.days>1?'s':''}`],['Travel Mode',r.travelModes?.join(', ')],['Purpose',r.purpose],['Submitted By',`${session.name} (${session.empId})`],['Submitted At',formatDateTime(r.submittedAt)]].map(([l,v]) => (
                <div key={l} className="info-row"><span className="info-row__label">{l}</span><span className="info-row__value">{v||'—'}</span></div>
              ))}
            </div>
          )}

          {tab === 'documents' && (
            <div className="card">
              <div className="review-section-title" style={{marginBottom:'12px'}}>Pre-Approval Documents</div>
              {r.documents && Object.entries({knoxMail:'Knox Approval Email',passport:'Passport Copy',visa:'Visa',insurance:'Travel Insurance'}).map(([k,label]) => (
                (k !== 'visa' || r.subtype === 'international') && (
                  <div key={k} className="doc-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={r.documents[k]?'var(--color-success)':'var(--color-text-3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="doc-row__label">{label}</span>
                    <span className="doc-row__file" style={{color:r.documents[k]?'var(--color-text)':'var(--color-text-3)'}}>{r.documents[k] || 'Not uploaded'}</span>
                  </div>
                )
              ))}
            </div>
          )}

          {tab === 'settlement' && r.settlement && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Settlement Details</div>
                <span className={`badge badge-${r.settlementStatus||'pending'}`}>{r.settlementStatus||'Pending'}</span>
              </div>
              {[['Hotel Name',r.settlement.hotelName],['Hotel Bill',formatINR(r.settlement.hotelAmount)],['Per Diem',formatINR(r.settlement.perDiem)],['Local Conveyance',`${formatINR(r.settlement.conveyanceAmount)} (${r.settlement.conveyanceTrips} trips)`],['Total Claimed',formatINR(r.settlement.totalAmount)],['Submitted At',formatDateTime(r.settlement.submittedAt)]].map(([l,v]) => (
                <div key={l} className="info-row"><span className="info-row__label">{l}</span><span className="info-row__value">{v||'—'}</span></div>
              ))}
              <div style={{marginTop:'16px',paddingTop:'16px',borderTop:'1px solid var(--color-border)'}}>
                <div className="review-section-title" style={{marginBottom:'12px'}}>Settlement Documents</div>
                {[['Boarding Pass',r.settlement.boardingPass],['Passport Stamps',r.settlement.passportStamp],['Trip Report',r.settlement.tripReport]].map(([l,v]) => (
                  <div key={l} className="doc-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={v?'var(--color-success)':'var(--color-text-3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="doc-row__label">{l}</span>
                    <span className="doc-row__file">{v||'—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'timeline' && (
            <div className="card">
              <div className="timeline">
                <TItem done title="Pre-Approval Submitted" meta={formatDateTime(r.submittedAt)} />
                <TItem done={r.preApprovalStatus==='approved'} rejected={r.preApprovalStatus==='rejected'} active={r.preApprovalStatus==='pending'}
                  title="Finance Review — Pre-Approval" meta={r.preApprovalStatus==='approved'?'Approved':r.preApprovalStatus==='rejected'?'Rejected':'Pending Finance Review'} />
                {r.preApprovalStatus === 'approved' && (
                  <>
                    <TItem done={!!r.settlementStatus} title="Settlement Filed" meta={r.settlement?.submittedAt ? formatDateTime(r.settlement.submittedAt) : 'Not yet filed'} />
                    <TItem done={r.settlementStatus==='approved'} rejected={r.settlementStatus==='rejected'} active={r.settlementStatus==='submitted'}
                      title="Finance Review — Settlement" meta={r.settlementStatus ? r.settlementStatus.charAt(0).toUpperCase()+r.settlementStatus.slice(1) : 'Pending settlement'} />
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function TItem({ done, rejected, active, title, meta }) {
  return (
    <div className="timeline-item">
      <div className={`timeline-dot${done?' done':rejected?' rejected':active?' active':''}`} />
      <div className="timeline-content">
        <div className="timeline-content__title">{title}</div>
        <div className="timeline-content__meta">{meta}</div>
      </div>
    </div>
  )
}
