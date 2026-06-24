import { Link } from 'react-router-dom'
import { getSession } from '../data/store'
import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'

const CARDS = [
  {
    to: '/app/travel/pre-approval',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    title: 'Business Travel',
    desc: 'Domestic & international trips. Pre-approval first, then settlement after return. Covers hotel, per diem, and conveyance.',
    badge: '2-step process', badgeClass: 'badge-info',
  },
  {
    to: '/app/internet',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
    title: 'Internet Bill',
    desc: 'Monthly WFH internet reimbursement. Cap varies by CL level. Upload your ISP invoice.',
    badge: 'Single step', badgeClass: 'badge-approved',
  },
  {
    to: '/app/carpool',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Carpooling',
    desc: 'Monthly shared commute claim at ₹50 per working day. Max 26 days per month.',
    badge: 'Single step', badgeClass: 'badge-approved',
  },
  {
    to: '/app/relocation',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: 'Relocation',
    desc: 'Office relocation expense claim. Requires 4 mandatory documents. Cap varies by CL.',
    badge: 'Single step', badgeClass: 'badge-approved',
  },
]

export default function NewRequest() {
  const session = getSession()
  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div className="main-content">
        <Topbar session={session} breadcrumbs={[{label:'Dashboard',to:'/app/dashboard'},{label:'New Request'}]} />
        <main className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-header__title">New Request</h1>
              <p className="page-header__sub">Select the reimbursement category to continue</p>
            </div>
          </div>
          <div className="grid-2">
            {CARDS.map(c => (
              <Link key={c.to} to={c.to} className="action-card">
                <div className="action-card__icon">{c.icon}</div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="action-card__title" style={{marginBottom:0}}>{c.title}</div>
                  <span className={`badge ${c.badgeClass}`}>{c.badge}</span>
                </div>
                <p className="action-card__desc">{c.desc}</p>
                <span className="btn btn-secondary btn-sm" style={{marginTop:'auto',alignSelf:'flex-start'}}>Start →</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
