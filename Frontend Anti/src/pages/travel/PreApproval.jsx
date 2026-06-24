import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession, createPreApproval } from '../../data/api'
import { DOMESTIC_STATES, INTL_COUNTRIES } from '../../data/budgets'
import Sidebar from '../../components/Layout/Sidebar'
import Topbar from '../../components/Layout/Topbar'
import UploadZone from '../../components/shared/UploadZone'

export default function PreApproval() {
  const session = getSession()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [subtype, setSubtype] = useState('domestic')
  const [destination, setDestination] = useState('')
  const [otherCountry, setOtherCountry] = useState('') // For Intl 'Other'
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [purpose, setPurpose] = useState('')
  
  const [docs, setDocs] = useState({ knoxMail: null, passport: null, visa: null, insurance: null })
  const [error, setError] = useState(false)

  const statesList = Object.keys(DOMESTIC_STATES).sort()
  const intlList = INTL_COUNTRIES

  // Custom Combobox State
  const [comboOpen, setComboOpen] = useState(false)
  const [comboSearch, setComboSearch] = useState('')
  const comboRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (comboRef.current && !comboRef.current.contains(event.target)) {
        setComboOpen(false)
        // If they typed something not in list, we could clear it or keep it.
        // Let's keep it as the destination if it's not empty, otherwise clear
        if (comboSearch && !statesList.includes(comboSearch) && !destination) {
          // If they typed partial, we could force them to pick or just allow free text.
          // User requested "user can also write inside input box". So we allow free text.
          setDestination(comboSearch)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [comboRef, comboSearch, destination, statesList])

  function calcDays() {
    if(!startDate || !endDate) return 0
    const d1 = new Date(startDate); const d2 = new Date(endDate)
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
  }
  const days = calcDays()

  function setDoc(key) { return file => setDocs(prev => ({...prev, [key]: file})) }

  function handleNext() {
    if (!destination || !startDate || !endDate || !purpose || !docs.knoxMail || !docs.passport || !docs.insurance) {
      setError(true); return
    }
    if (subtype === 'international' && destination === 'Other' && !otherCountry) {
      setError(true); return
    }
    if (subtype === 'international' && !docs.visa) {
      setError(true); return
    }
    setError(false)
    setStep(2)
  }

  async function handleSubmit() {
    const finalDestination = (subtype === 'international' && destination === 'Other') ? otherCountry : destination
    const finalRegion = subtype === 'international' ? (destination === 'Other' ? otherCountry : destination) : null

    try {
      await createPreApproval({
        empId: session.empId,
        subtype,
        destination: finalDestination,
        region: finalRegion,
        area: subtype === 'domestic' ? (DOMESTIC_STATES[finalDestination] || 'Area C') : null,
        startDate,
        endDate,
        days,
        purpose,
        travelModes: ['Air'],
        documents: {
          knoxMail: docs.knoxMail.name,
          passport: docs.passport.name,
          visa: docs.visa?.name || null,
          insurance: docs.insurance.name
        }
      })
      navigate('/app/requests')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} 
          breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'New Request',to:'/app/new-request'},{label:'Business Travel (Pre-Approval)'}]} />
        
        <main className="page-content form-page">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Travel Pre-Approval</h1>
              <p className="page-header__sub">{step === 1 ? 'Submit your travel plan and required documents.' : 'Review your submission details before sending to Finance.'}</p>
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="card mb-5">
                <div className="form-section-title"><span className="step-num">1</span>Trip Details</div>
                
                <div className="form-group mb-5">
                  <label className="form-label">Trip Type</label>
                  <div className="toggle-group" style={{border:'none', outline:'none', boxShadow:'none', background:'var(--color-surface-muted)'}}>
                    <button className={`toggle-option ${subtype==='domestic'?'active':''}`} style={{border:'none', outline:'none'}} onClick={()=>{setSubtype('domestic'); setDestination(''); setComboSearch('')}}>Domestic Travel</button>
                    <button className={`toggle-option ${subtype==='international'?'active':''}`} style={{border:'none', outline:'none'}} onClick={()=>{setSubtype('international'); setDestination('')}}>International Travel</button>
                  </div>
                </div>

                {subtype === 'domestic' ? (
                  <div className="form-group" ref={comboRef} style={{position:'relative'}}>
                    <label className="form-label">State / Region <span className="required">*</span></label>
                    <div style={{position:'relative'}}>
                      <input 
                        className="form-input" 
                        placeholder="Select or type a state..." 
                        value={comboOpen ? comboSearch : destination}
                        onChange={(e) => {
                          setComboSearch(e.target.value)
                          setDestination(e.target.value)
                          setComboOpen(true)
                        }}
                        onFocus={() => {
                          setComboOpen(true)
                          setComboSearch(destination)
                        }}
                        style={{paddingRight:'32px'}}
                      />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute',right:'12px',top:'14px',color:'var(--color-text-3)',pointerEvents:'none'}}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    {comboOpen && (
                      <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-md)',maxHeight:'200px',overflowY:'auto',zIndex:10,marginTop:'4px'}}>
                        {statesList.filter(s => s.toLowerCase().includes(comboSearch.toLowerCase())).map(s => (
                          <div 
                            key={s} 
                            style={{padding:'10px 14px',cursor:'pointer',fontSize:'14px',borderBottom:'1px solid var(--color-border-light)'}}
                            onMouseDown={(e)=>{
                              e.preventDefault(); // prevent input blur
                              setDestination(s)
                              setComboSearch(s)
                              setComboOpen(false)
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--color-surface-hover)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          >
                            {s}
                          </div>
                        ))}
                        {comboSearch && !statesList.some(s => s.toLowerCase().includes(comboSearch.toLowerCase())) && (
                          <div style={{padding:'10px 14px',fontSize:'14px',color:'var(--color-text-3)'}}>Press enter or click outside to use "{comboSearch}"</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Country <span className="required">*</span></label>
                      <select className="form-select" value={destination} onChange={e=>setDestination(e.target.value)}>
                        <option value="">Select Destination...</option>
                        {intlList.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {destination === 'Other' && (
                      <div className="form-group">
                        <label className="form-label">Specify Country <span className="required">*</span></label>
                        <input className="form-input" placeholder="e.g. Japan" value={otherCountry} onChange={e=>setOtherCountry(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid-2 mt-4">
                  <div className="form-group">
                    <label className="form-label">Start Date <span className="required">*</span></label>
                    <input className="form-input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date <span className="required">*</span></label>
                    <input className="form-input" type="date" min={startDate} value={endDate} onChange={e=>setEndDate(e.target.value)} />
                  </div>
                </div>
                
                {days > 0 && <div className="form-hint mb-4" style={{marginTop:'-10px'}}>Total Duration: <strong>{days} days</strong></div>}

                <div className="form-group">
                  <label className="form-label">Business Purpose <span className="required">*</span></label>
                  <textarea className="form-textarea" rows={3} placeholder="Describe the business justification for this trip..." value={purpose} onChange={e=>setPurpose(e.target.value)} />
                </div>
              </div>

              <div className="card mb-5">
                <div className="form-section-title"><span className="step-num">2</span>Mandatory Documents</div>
                <div className="alert alert-info mb-4">
                  Upload all required approvals and identification. Max size 5MB per file.
                </div>

                <div className="grid-2 mb-4">
                  <UploadZone label="Knox Approval Email" hint="PDF print of MD/HoD approval" required onFile={setDoc('knoxMail')} />
                  <UploadZone label="Passport Copy" hint="Front and back pages" required onFile={setDoc('passport')} />
                </div>
                <div className="grid-2">
                  <UploadZone label="Travel Insurance" hint="Policy document" required onFile={setDoc('insurance')} />
                  {subtype === 'international' && (
                    <UploadZone label="Valid Visa" hint="Copy of stamped or e-visa" required onFile={setDoc('visa')} />
                  )}
                </div>
              </div>

              {error && <div className="alert alert-error mb-4">Please fill all required fields and upload mandatory documents.</div>}
              
              <div className="form-actions">
                <Link to="/app/new-request" className="btn btn-secondary btn-lg">Cancel</Link>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>Review & Next</button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="card mb-5">
              <div className="form-section-title">Review Submission</div>
              
              <div className="mb-6">
                <div className="review-section-title">Trip Overview</div>
                <div className="info-row"><span className="info-row__label">Trip Type</span><span className="info-row__value" style={{textTransform:'capitalize'}}>{subtype}</span></div>
                <div className="info-row"><span className="info-row__label">Destination</span><span className="info-row__value">{subtype === 'international' && destination === 'Other' ? otherCountry : destination}</span></div>
                <div className="info-row"><span className="info-row__label">Travel Dates</span><span className="info-row__value">{startDate} to {endDate} ({days} days)</span></div>
                <div className="info-row"><span className="info-row__label">Purpose</span><span className="info-row__value">{purpose}</span></div>
              </div>

              <div className="mb-6">
                <div className="review-section-title">Attached Documents</div>
                <div className="info-row"><span className="info-row__label">Knox Approval</span><span className="info-row__value">{docs.knoxMail.name}</span></div>
                <div className="info-row"><span className="info-row__label">Passport</span><span className="info-row__value">{docs.passport.name}</span></div>
                <div className="info-row"><span className="info-row__label">Insurance</span><span className="info-row__value">{docs.insurance.name}</span></div>
                {subtype === 'international' && <div className="info-row"><span className="info-row__label">Visa</span><span className="info-row__value">{docs.visa.name}</span></div>}
              </div>

              <div className="alert alert-warning mb-6">
                Once submitted, you cannot modify this pre-approval request until Finance reviews it.
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>← Back to Edit</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit}>Confirm & Submit to Finance</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
