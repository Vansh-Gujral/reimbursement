import { getSession } from '../data/store'
import { DOMESTIC_BUDGETS_BY_AREA, INTL_BUDGETS, INTERNET_CAPS, RELOCATION_CAPS, CARPOOL_RATE_PER_DAY, PER_DIEM_RATE, INTL_COUNTRIES } from '../data/budgets'
import { formatINR } from '../utils/helpers'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'

const CL_LEVELS = ['CL1','CL2','CL3','CL4']

export default function Policy() {
  const session = getSession()

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'Policy & Limits'}]} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">Policy &amp; Reimbursement Limits</h1>
              <p className="page-header__sub">Official entitlement caps per SEM B HR Policy · Your level: <span className="cl-badge">{session.cl}</span></p>
            </div>
          </div>

          <div className="alert alert-info mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Your CL level is <strong>{session.cl}</strong>. Your row is highlighted in blue. All amounts in INR (₹). Amounts above caps are not reimbursable.
          </div>

          {/* Per Diem */}
          <div className="policy-section">
            <div className="policy-section-title">Per Diem Allowance</div>
            <div style={{overflowX:'auto'}}>
              <table className="policy-table">
                <thead><tr><th>CL Level</th><th>Per Diem Rate</th><th>Notes</th></tr></thead>
                <tbody>
                  {CL_LEVELS.map(cl => (
                    <tr key={cl} style={cl===session.cl?{background:'#EFF6FF'}:{}}>
                      <td><span className="cl-badge">{cl}</span>{cl===session.cl && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--color-accent)',fontWeight:600}}>← You</span>}</td>
                      <td style={{fontWeight:600,color:'var(--color-success)'}}>{formatINR(PER_DIEM_RATE)} / day</td>
                      <td style={{color:'var(--color-text-3)'}}>Fixed daily allowance — same for all levels</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Domestic by Area */}
          <div className="policy-section">
            <div className="policy-section-title">Domestic Travel Caps</div>
            {Object.keys(DOMESTIC_BUDGETS_BY_AREA).map(area => (
              <div key={area} className="mb-5">
                <div style={{fontSize:'13px',fontWeight:600,color:'var(--color-text-2)',marginBottom:'10px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  {area}
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="policy-table">
                    <thead><tr><th>CL Level</th><th>Hotel Cap / Night</th><th>Local Conveyance Max</th><th>Total Trip Cap</th></tr></thead>
                    <tbody>
                      {CL_LEVELS.map(cl => {
                        const b = DOMESTIC_BUDGETS_BY_AREA[area][cl]
                        return (
                          <tr key={cl} style={cl===session.cl?{background:'#EFF6FF'}:{}}>
                            <td><span className="cl-badge">{cl}</span>{cl===session.cl && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--color-accent)',fontWeight:600}}>← You</span>}</td>
                            <td>{formatINR(b.hotelPerNight)}</td>
                            <td>{formatINR(b.localConveyanceMax)}</td>
                            <td style={{fontWeight:700,color:'var(--color-accent)'}}>{formatINR(b.totalCap)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* International by region */}
          <div className="policy-section">
            <div className="policy-section-title">International Travel Caps</div>
            {INTL_COUNTRIES.map(region => (
              <div key={region} className="mb-5">
                <div style={{fontSize:'13px',fontWeight:600,color:'var(--color-text-2)',marginBottom:'10px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  {region}
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="policy-table">
                    <thead><tr><th>CL Level</th><th>Per Diem / Day</th><th>Hotel Cap / Night</th><th>Local Conv. Max</th><th>Total Trip Cap</th></tr></thead>
                    <tbody>
                      {CL_LEVELS.map(cl => {
                        const b = INTL_BUDGETS[region][cl]
                        return (
                          <tr key={cl} style={cl===session.cl?{background:'#EFF6FF'}:{}}>
                            <td><span className="cl-badge">{cl}</span>{cl===session.cl && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--color-accent)',fontWeight:600}}>← You</span>}</td>
                            <td>{formatINR(b.perDiem)}</td>
                            <td>{formatINR(b.hotelPerNight)}</td>
                            <td>{formatINR(b.localConveyanceMax)}</td>
                            <td style={{fontWeight:700,color:'var(--color-accent)'}}>{formatINR(b.totalCap)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Other caps */}
          <div className="grid-2 mb-6">
            <div className="policy-section" style={{marginBottom:0}}>
              <div className="policy-section-title">Internet Bill Cap (Monthly)</div>
              <table className="policy-table">
                <thead><tr><th>CL Level</th><th>Monthly Cap</th></tr></thead>
                <tbody>
                  {CL_LEVELS.map(cl => (
                    <tr key={cl} style={cl===session.cl?{background:'#EFF6FF'}:{}}>
                      <td><span className="cl-badge">{cl}</span>{cl===session.cl && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--color-accent)',fontWeight:600}}>← You</span>}</td>
                      <td style={{fontWeight:600}}>{formatINR(INTERNET_CAPS[cl])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="policy-section" style={{marginBottom:0}}>
              <div className="policy-section-title">Relocation Cap (One-time)</div>
              <table className="policy-table">
                <thead><tr><th>CL Level</th><th>Max Claim</th></tr></thead>
                <tbody>
                  {CL_LEVELS.map(cl => (
                    <tr key={cl} style={cl===session.cl?{background:'#EFF6FF'}:{}}>
                      <td><span className="cl-badge">{cl}</span>{cl===session.cl && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--color-accent)',fontWeight:600}}>← You</span>}</td>
                      <td style={{fontWeight:600}}>{formatINR(RELOCATION_CAPS[cl])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title mb-4">Carpooling Rate</div>
            <div className="flex items-center gap-4">
              <div style={{fontSize:'36px',fontWeight:700}}>{formatINR(CARPOOL_RATE_PER_DAY)}</div>
              <div style={{color:'var(--color-text-3)',fontSize:'14px',lineHeight:'1.6'}}>
                per working day carpooled<br/>
                Maximum 26 days per month · All CL levels
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
