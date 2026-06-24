import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSession, getRequestById, submitSettlement } from '../../data/api'
import { getBudget, PER_DIEM_RATE, getExchangeRate, PETROL_RATE, VEHICLE_MILEAGE } from '../../data/budgets'
import { formatINR, formatDate, formatDateTime } from '../../utils/helpers'
import Sidebar from '../../components/Layout/Sidebar'
import Topbar from '../../components/Layout/Topbar'
import UploadZone from '../../components/shared/UploadZone'

const CONV_LABELS = ['Residence → Airport (Departure)', 'Airport → Hotel (Arrival)', 'Hotel → Airport (Departure)', 'Airport → Residence (Return)']

export default function Settlement() {
  const session  = getSession()
  const { id }   = useParams()
  
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getRequestById(id)
        setRequest(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Need this hook here otherwise Hooks will complain if we return early
  const [step, setStep] = useState(1) // 1: Form, 2: Review
  
  // Trip Extension State
  const [isExtending, setIsExtending] = useState(false)
  const [revisedEndDate, setRevisedEndDate] = useState('')
  
  // Winter Clothes
  const [claimWinterClothes, setClaimWinterClothes] = useState(false)
  const [winterClothesAmount, setWinterClothesAmount] = useState('')

  const [hotelName,   setHotelName]   = useState('')
  const [hotelAmount, setHotelAmount] = useState('') // Stored in foreign currency if intl

  // Local Conveyance
  const [convType, setConvType] = useState('cab') // cab | own_vehicle
  const [ownVehicleKm, setOwnVehicleKm] = useState('')
  const [convTrips,   setConvTrips]   = useState(0)
  const [convAmts,    setConvAmts]    = useState([0,0,0,0]) // Stored in foreign currency if intl

  const [docs, setDocs] = useState({ hotel:null, bp:null, stamp:null, report:null, revisedKnox:null, forex:null })
  const setDoc = key => f => setDocs(p => ({...p,[key]:f}))
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (request && request.endDate && !revisedEndDate) {
      setRevisedEndDate(request.endDate)
    }
  }, [request, revisedEndDate])

  function calcDays() {
    if (!request) return 0
    const d1 = new Date(request.startDate); const d2 = new Date(isExtending ? revisedEndDate : request.endDate)
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
  }
  const activeDays = calcDays()

  // Wait for request load before rendering logic that uses request properties
  if (loading) return <div style={{padding:'40px'}}>Loading settlement data...</div>

  if (!request || request.empId !== session.empId) return <Blocked title="Request Not Found" msg="This request does not exist." session={session} />
  if (request.type !== 'business-travel') return <Blocked title="Invalid Type" msg="Settlement is only for business travel." session={session} />
  if (request.preApprovalStatus !== 'approved') return <Blocked title="Pending Pre-Approval" msg="Finance must approve pre-approval first." session={session} />
  if (request.settlementStatus === 'submitted' || request.settlementStatus === 'approved') return <Blocked title="Already Filed" msg="Settlement already submitted." session={session} />



  const isIntl = request ? request.subtype === 'international' : false
  const currencyInfo = isIntl ? getExchangeRate(request.region) : null
  const currencySymbol = isIntl ? currencyInfo.currency : '₹'
  const exchangeRate = isIntl ? currencyInfo.rate : 1

  const budget = request ? getBudget(session.cl, request.subtype, isIntl ? request.region : request.destination) : null
  const perdiemForeign = isIntl && budget ? budget.perDiem * activeDays : 0
  const perdiemInr = budget ? (isIntl ? perdiemForeign * exchangeRate : budget.perDiem * activeDays) : 0



  // Calculations (Foreign -> INR mapping)
  const rawHotel = parseFloat(hotelAmount) || 0
  const hotelInr = rawHotel * exchangeRate
  
  let rawConvTotal = 0
  let convInr = 0
  if (convType === 'cab') {
    rawConvTotal = convAmts.slice(0, convTrips).reduce((s,v) => s + (parseFloat(v)||0), 0)
    convInr = rawConvTotal * exchangeRate
  } else {
    // Own Vehicle
    const km = parseFloat(ownVehicleKm) || 0
    convInr = (km / VEHICLE_MILEAGE) * PETROL_RATE
    rawConvTotal = convInr / exchangeRate 
  }

  const rawWinter = parseFloat(winterClothesAmount) || 0
  const winterInr = claimWinterClothes ? (rawWinter * exchangeRate) : 0

  const totalInr = hotelInr + perdiemInr + convInr + winterInr
  const totalForeign = isIntl ? (rawHotel + parseFloat(perdiemForeign) + rawConvTotal + rawWinter) : totalInr

  function updateConv(i, val) {
    const arr = [...convAmts]; arr[i] = val; setConvAmts(arr)
  }

  function handleNext() {
    const allBasicDocs = docs.hotel && docs.bp && docs.stamp && docs.report
    if (!hotelName || rawHotel <= 0 || !allBasicDocs) { setError(true); return }
    if (isExtending && !docs.revisedKnox) { setError(true); return }
    if (isIntl && !docs.forex) { setError(true); return }
    if (claimWinterClothes && rawWinter <= 0) { setError(true); return }
    setError(false)
    setStep(2)
  }

  async function handleSubmit() {
    try {
      await submitSettlement(id, {
        isExtended: isExtending,
        revisedEndDate: isExtending ? revisedEndDate : null,
        revisedDays: activeDays,
        currency: currencySymbol,
        exchangeRate,
        
        hotelName, 
        hotelAmountForeign: rawHotel,
        hotelAmountInr: hotelInr,
        hotelBill: docs.hotel?.name,
        
        perDiemForeign: parseFloat(perdiemForeign),
        perDiemInr: perdiemInr,
        
        conveyanceType: convType,
        conveyanceKm: convType === 'own_vehicle' ? (parseFloat(ownVehicleKm)||0) : null,
        conveyanceTrips: convTrips,
        conveyanceAmountForeign: rawConvTotal,
        conveyanceAmountInr: convInr,
        conveyanceRows: convType === 'cab' ? convAmts.slice(0, convTrips).map((a,i) => ({route:CONV_LABELS[i],amount:parseFloat(a)||0})) : [],
        
        winterClothesClaimed: claimWinterClothes,
        winterClothesAmountForeign: claimWinterClothes ? rawWinter : 0,
        winterClothesAmountInr: winterInr,

        totalAmountForeign: totalForeign,
        totalAmountInr: totalInr,
        
        boardingPass: docs.bp?.name,
        passportStamp: docs.stamp?.name,
        tripReport: docs.report?.name,
        revisedKnox: docs.revisedKnox?.name,
        forexStatement: docs.forex?.name,
        submittedAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (submitted) return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Settlement" />
        <main className="page-content form-page">
          <div className="card" style={{textAlign:'center',padding:'80px 32px'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'var(--color-success-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{fontSize:'24px',fontWeight:700,marginBottom:'12px'}}>Settlement Submitted</div>
            <p className="text-muted mb-6" style={{fontSize:'15px'}}>Settlement for <strong>{request.id}</strong> submitted to Finance for review.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center'}}>
              <Link to="/app/requests" className="btn btn-primary btn-lg">View Requests</Link>
              <Link to="/app/dashboard" className="btn btn-secondary btn-lg">Dashboard</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session}
          breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'My Requests',to:'/app/requests'},{label:'Settlement'}]}
          actions={<span className="badge badge-approved">Pre-Approval Approved</span>} />
        
        <main className="page-content form-page">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Travel Settlement</h1>
              <p className="page-header__sub">{step===1?'Provide actual expenses and documents.':'Review your settlement claim.'}</p>
            </div>
          </div>

          {/* Locked Pre-Approval Block */}
          <div className="card mb-6" style={{background:'#f8fafc',border:'1px solid var(--color-border-light)'}}>
            <div className="review-section-title mb-3" style={{color:'var(--color-text-2)'}}>Locked Pre-Approval Details</div>
            <div className="grid-2">
              <div className="info-row" style={{padding:'4px 0'}}><span className="info-row__label">Destination</span><span className="info-row__value">{request.destination}</span></div>
              <div className="info-row" style={{padding:'4px 0'}}><span className="info-row__label">Original Dates</span><span className="info-row__value">{formatDate(request.startDate)} to {formatDate(request.endDate)} ({request.days} days)</span></div>
              <div className="info-row" style={{padding:'4px 0',gridColumn:'1/-1'}}><span className="info-row__label">Purpose</span><span className="info-row__value">{request.purpose}</span></div>
            </div>
          </div>

          {step === 1 && (
            <>
              {/* Trip Extension (Prominent) */}
              <div className="card mb-5" style={{border: isExtending ? '2px solid var(--color-brand-500)' : '1px solid var(--color-border-light)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'16px',fontWeight:700,color:'var(--color-text-1)'}}>Trip Extension</div>
                    <div style={{fontSize:'13px',color:'var(--color-text-3)',marginTop:'4px'}}>Did your business trip get extended beyond the original pre-approved dates?</div>
                  </div>
                  <button className={`btn ${isExtending ? 'btn-danger' : 'btn-primary'}`} onClick={()=>setIsExtending(!isExtending)}>
                    {isExtending ? 'Cancel Extension' : 'Yes, Extend Trip'}
                  </button>
                </div>
                
                {isExtending && (
                  <div className="grid-2 mt-5" style={{borderTop:'1px solid var(--color-border-light)',paddingTop:'24px'}}>
                    <div className="form-group">
                      <label className="form-label">Start Date (Locked)</label>
                      <input className="form-input" value={formatDate(request.startDate)} readOnly />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Revised End Date <span className="required">*</span></label>
                      <input className="form-input" type="date" min={request.startDate} value={revisedEndDate} onChange={e=>setRevisedEndDate(e.target.value)} />
                    </div>
                    <div style={{gridColumn:'1 / -1'}}>
                      <UploadZone label="Revised Approval PDF" hint="New approval mail indicating extension" required onFile={setDoc('revisedKnox')} />
                    </div>
                  </div>
                )}
              </div>

              {isIntl && (
                <div className="alert alert-warning mb-5">
                  <strong>International Trip:</strong> Please enter all expenses in <strong>{currencySymbol}</strong>. The system will auto-calculate INR equivalents using the official corporate exchange rate (1 {currencySymbol} = ₹{exchangeRate}).
                </div>
              )}

              {/* Expenses */}
              <div className="card mb-5">
                <div className="form-section-title">Hotel Expenses</div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">Hotel Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Grand Hyatt" value={hotelName} onChange={e => setHotelName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Hotel Bill ({currencySymbol}) <span className="required">*</span></label>
                    <input className="form-input" type="number" min="0" placeholder="0" value={hotelAmount} onChange={e => setHotelAmount(e.target.value)} />
                    {isIntl && rawHotel > 0 && <div className="form-hint" style={{fontWeight:600,color:'var(--color-text-1)'}}>≈ {formatINR(hotelInr)}</div>}
                  </div>
                </div>
                <UploadZone label="Hotel Invoice" required onFile={setDoc('hotel')} />
              </div>

              <div className="card mb-5">
                <div className="form-section-title">Per Diem Allowance</div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Active Travel Days</label>
                    <input className="form-input" readOnly value={`${activeDays} day${activeDays>1?'s':''}`} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Per Diem {isIntl ? `(${currencySymbol})` : '(INR)'}</label>
                    <input className="form-input" readOnly value={isIntl ? `${currencySymbol} ${perdiemForeign}` : formatINR(perdiemInr)} style={{fontWeight:600,fontSize:'16px'}} />
                    {isIntl && <div className="form-hint">≈ {formatINR(perdiemInr)}</div>}
                  </div>
                </div>
              </div>

              <div className="card mb-5">
                <div className="form-section-title">Local Conveyance</div>
                <div className="form-group mb-4">
                  <label className="form-label">Travel Method</label>
                  <div className="toggle-group">
                    <button className={`toggle-option ${convType==='cab'?'active':''}`} onClick={()=>setConvType('cab')}>Cab / Taxi</button>
                    <button className={`toggle-option ${convType==='own_vehicle'?'active':''}`} onClick={()=>setConvType('own_vehicle')}>Own Vehicle</button>
                  </div>
                </div>

                {convType === 'own_vehicle' ? (
                  <div className="grid-2" style={{alignItems:'start'}}>
                    <div className="form-group">
                      <label className="form-label">Total Distance Traveled (km) <span className="required">*</span></label>
                      <input className="form-input" type="number" min="0" value={ownVehicleKm} onChange={e=>setOwnVehicleKm(e.target.value)} />
                      <div className="form-hint">Calculation: (km / {VEHICLE_MILEAGE} km/L) × ₹{PETROL_RATE}/L</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Calculated Amount (INR)</label>
                      <input className="form-input" readOnly value={formatINR(convInr)} style={{fontWeight:600}} />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted text-sm mb-4">Only residence ↔ airport trips eligible. Max 4 trips.</p>
                    <div className="form-group mb-4" style={{maxWidth:'200px'}}>
                      <label className="form-label">Number of Trips</label>
                      <select className="form-select" value={convTrips} onChange={e => setConvTrips(parseInt(e.target.value))}>
                        {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} trip{n!==1?'s':''}</option>)}
                      </select>
                    </div>
                    {convTrips > 0 && (
                      <table className="conveyance-table mb-3">
                        <thead><tr><th>#</th><th>Route</th><th>Amount ({currencySymbol})</th></tr></thead>
                        <tbody>
                          {Array.from({length:convTrips},(_, i) => (
                            <tr key={i}>
                              <td style={{color:'var(--color-text-3)',fontSize:'13px'}}>{i+1}</td>
                              <td style={{fontSize:'13px'}}>{CONV_LABELS[i]}</td>
                              <td><input className="form-input" type="number" min="0" placeholder="0" value={convAmts[i]||''} onChange={e => updateConv(i, e.target.value)} style={{width:'150px'}} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'12px',marginTop:'16px'}}>
                      <span className="text-muted text-sm">Total Conveyance:</span>
                      <span style={{fontWeight:600,fontSize:'16px'}}>{currencySymbol} {rawConvTotal}</span>
                      {isIntl && rawConvTotal > 0 && <span style={{fontWeight:600,color:'var(--color-brand-600)'}}>(≈ {formatINR(convInr)})</span>}
                    </div>
                  </>
                )}
              </div>

              {isIntl && (
                <div className="card mb-5" style={{border:'2px solid var(--color-purple)'}}>
                  <div className="form-section-title" style={{color:'var(--color-purple)'}}>Winter Clothes Allowance</div>
                  <div className="alert alert-info mb-4">You are eligible for a winter clothes allowance for staying in Korea for 30+ days.</div>
                  <label className="checkbox-group mb-4">
                    <input type="checkbox" checked={claimWinterClothes} onChange={e=>setClaimWinterClothes(e.target.checked)} />
                    <span style={{fontWeight:500,color:'var(--color-text-1)'}}>I have not claimed the Winter Clothes allowance in the last 3 years.</span>
                  </label>
                  {claimWinterClothes && (
                    <div className="form-group" style={{maxWidth:'300px'}}>
                      <label className="form-label">Allowance Claim Amount ({currencySymbol}) <span className="required">*</span></label>
                      <input className="form-input" type="number" min="0" value={winterClothesAmount} onChange={e=>setWinterClothesAmount(e.target.value)} />
                      {rawWinter > 0 && <div className="form-hint" style={{fontWeight:600,color:'var(--color-text-1)'}}>≈ {formatINR(winterInr)}</div>}
                    </div>
                  )}
                </div>
              )}

              <div className="card mb-5">
                <div className="form-section-title">Supporting Documents</div>
                <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
                  <UploadZone label="Boarding Pass(es)" hint="All boarding passes — onward & return" required onFile={setDoc('bp')} />
                  <UploadZone label="Passport with Entry/Exit Stamps" hint="Scanned pages with immigration stamps" required onFile={setDoc('stamp')} />
                  <UploadZone label="Trip Report" hint="Brief summary of trip outcomes" accept=".pdf,.doc,.docx,.txt" required onFile={setDoc('report')} />
                  {isIntl && (
                    <UploadZone label="Forex Card Statement" hint="Required for international trips" required onFile={setDoc('forex')} />
                  )}
                </div>
              </div>

              {error && <div className="alert alert-error mb-4">Please fill required details and upload all mandatory documents.</div>}
              
              <div className="form-actions">
                <Link to="/app/requests" className="btn btn-secondary btn-lg">Cancel</Link>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>Review Claim & Next</button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="card mb-5">
              <div className="form-section-title">Review Settlement Claim</div>
              
              <div className="mb-6">
                <div className="review-section-title">Claim Breakdown</div>
                <div className="info-row"><span className="info-row__label">Hotel ({hotelName})</span><span className="info-row__value">{currencySymbol} {rawHotel} {isIntl && `(≈ ${formatINR(hotelInr)})`}</span></div>
                <div className="info-row"><span className="info-row__label">Per Diem ({activeDays} days)</span><span className="info-row__value">{currencySymbol} {perdiemForeign} {isIntl && `(≈ ${formatINR(perdiemInr)})`}</span></div>
                <div className="info-row"><span className="info-row__label">Conveyance ({convType==='cab'?`${convTrips} trips`:`${ownVehicleKm} km`})</span><span className="info-row__value">{currencySymbol} {rawConvTotal} {isIntl && `(≈ ${formatINR(convInr)})`}</span></div>
                {claimWinterClothes && <div className="info-row"><span className="info-row__label">Winter Clothes</span><span className="info-row__value">{currencySymbol} {rawWinter} {isIntl && `(≈ ${formatINR(winterInr)})`}</span></div>}
                
                <div className="info-row" style={{borderTop:'2px solid var(--color-border)',marginTop:'12px',paddingTop:'16px'}}>
                  <span className="info-row__label" style={{fontWeight:700,fontSize:'16px'}}>Total Reimbursable</span>
                  <span className="info-row__value" style={{fontWeight:700,fontSize:'18px',color:'var(--color-brand-600)'}}>{currencySymbol} {totalForeign} {isIntl && `(≈ ${formatINR(totalInr)})`}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="review-section-title">Attached Documents</div>
                <div className="info-row"><span className="info-row__label">Hotel Bill</span><span className="info-row__value">{docs.hotel.name}</span></div>
                <div className="info-row"><span className="info-row__label">Boarding Pass</span><span className="info-row__value">{docs.bp.name}</span></div>
                <div className="info-row"><span className="info-row__label">Stamps</span><span className="info-row__value">{docs.stamp.name}</span></div>
                <div className="info-row"><span className="info-row__label">Trip Report</span><span className="info-row__value">{docs.report.name}</span></div>
                {isExtending && <div className="info-row"><span className="info-row__label">Revised Approval</span><span className="info-row__value">{docs.revisedKnox.name}</span></div>}
                {isIntl && <div className="info-row"><span className="info-row__label">Forex Statement</span><span className="info-row__value">{docs.forex.name}</span></div>}
              </div>

              <div className="alert alert-warning mb-6">
                Once submitted, this settlement claim will be sent to Finance for final approval and cannot be edited.
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>← Back to Edit</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Confirm & Submit Claim</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

function Blocked({ title, msg, session }) {
  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} title="Settlement" />
        <main className="page-content form-page">
          <div className="card" style={{textAlign:'center',padding:'80px'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'var(--color-warning-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div style={{fontSize:'24px',fontWeight:700,marginBottom:'12px'}}>{title}</div>
            <p className="text-muted mb-6" style={{fontSize:'15px'}}>{msg}</p>
            <Link to="/app/requests" className="btn btn-secondary btn-lg">← Back to Requests</Link>
          </div>
        </main>
      </div>
    </div>
  )
}
