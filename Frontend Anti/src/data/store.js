import { PER_DIEM_RATE } from './budgets'

// ── Sample seed data ──────────────────────────────────────
const SAMPLE_REQUESTS = [
  {
    id:'REQ-2024-0001', empId:'EMP001', type:'business-travel', subtype:'domestic',
    title:'Business Trip to Mumbai', destination:'Mumbai, Maharashtra',
    startDate:'2024-02-10', endDate:'2024-02-14', days:4,
    purpose:'Client meeting and project handover',
    travelModes:['Air'],
    submittedAt:'2024-02-01T10:30:00',
    stage:'settlement-approved', preApprovalStatus:'approved', settlementStatus:'approved',
    settlementAmount:22500, financeNote:'All documents verified. Approved.',
    documents:{ knoxMail:'approval_mail.pdf', passport:'passport_copy.pdf', visa:null, insurance:'insurance.pdf' },
    settlement:{ hotelName:'Taj Mumbai', hotelAmount:12000, perDiem:6000, conveyanceTrips:4, conveyanceAmount:1800, totalAmount:22500, boardingPass:'bp_001.pdf', passportStamp:'stamp_001.pdf', tripReport:'report_001.pdf', submittedAt:'2024-02-20T09:00:00' }
  },
  {
    id:'REQ-2024-0002', empId:'EMP001', type:'business-travel', subtype:'international',
    title:'International Trip to Singapore', destination:'Singapore', region:'South East Asia',
    startDate:'2024-03-05', endDate:'2024-03-12', days:7,
    purpose:'Annual partner summit and training', travelModes:['Air'],
    submittedAt:'2024-02-20T14:15:00',
    stage:'pre-approval', preApprovalStatus:'approved', settlementStatus:null,
    settlementAmount:null, financeNote:'Pre-approval granted. Proceed with trip.',
    documents:{ knoxMail:'approval_mail2.pdf', passport:'passport2.pdf', visa:'visa_sg.pdf', insurance:'insurance2.pdf' },
    settlement:null
  },
  {
    id:'REQ-2024-0003', empId:'EMP001', type:'internet-bill',
    title:'Internet Bill — January 2024', month:'2024-01',
    provider:'Airtel Broadband', amount:999,
    submittedAt:'2024-01-31T09:00:00', status:'approved', financeNote:''
  },
  {
    id:'REQ-2024-0004', empId:'EMP001', type:'carpooling',
    title:'Carpooling — February 2024', month:'2024-02',
    days:18, route:'Sector 62, Noida → Connaught Place',
    amount:900, submittedAt:'2024-02-28T17:00:00',
    status:'pending', financeNote:''
  },
  {
    id:'REQ-2024-0005', empId:'EMP001', type:'business-travel', subtype:'domestic',
    title:'Business Trip to Bangalore', destination:'Bengaluru, Karnataka',
    startDate:'2024-04-08', endDate:'2024-04-10', days:2,
    purpose:'Interview panel and campus hiring', travelModes:['Air'],
    submittedAt:'2024-03-28T11:00:00',
    stage:'pre-approval', preApprovalStatus:'pending', settlementStatus:null,
    settlementAmount:null, financeNote:'', documents:{}, settlement:null
  },
  {
    id:'REQ-2024-0006', empId:'EMP002', type:'relocation',
    title:'Relocation: Pune → Bengaluru',
    teamName:'Operations', relocDate:'2024-01-15',
    fromCity:'Pune', toCity:'Bengaluru', amount:45000,
    submittedAt:'2024-01-20T10:00:00', status:'pending', financeNote:'',
    documents:{ empId:'emp_id.pdf', flightTicket:'ticket.pdf', boardingPass:'bp.pdf', paymentProof:'payment.pdf' }
  },
  {
    id:'REQ-2024-0007', empId:'EMP003', type:'business-travel', subtype:'domestic',
    title:'Business Trip to Delhi', destination:'New Delhi',
    startDate:'2024-05-10', endDate:'2024-05-12', days:2,
    purpose:'Sales conference and client visits', travelModes:['Train'],
    submittedAt:'2024-04-30T09:00:00',
    stage:'settlement', preApprovalStatus:'approved', settlementStatus:'submitted',
    settlementAmount:18000, financeNote:'Pre-approval granted.',
    documents:{ knoxMail:'knox3.pdf', passport:'pass3.pdf', visa:null, insurance:'ins3.pdf' },
    settlement:{ hotelName:'The Leela Palace', hotelAmount:12000, perDiem:3000, conveyanceTrips:2, conveyanceAmount:600, totalAmount:18000, boardingPass:'bp3.pdf', passportStamp:'stamp3.pdf', tripReport:'report3.pdf', submittedAt:'2024-05-18T11:00:00' }
  },
]

// ── Init ──────────────────────────────────────────────────
export function initStore() {
  if (!localStorage.getItem('rp_initialized')) {
    localStorage.setItem('rp_requests', JSON.stringify(SAMPLE_REQUESTS))
    localStorage.setItem('rp_req_counter', '7')
    localStorage.setItem('rp_initialized', 'true')
  }
}

export function getNextId() {
  const year = new Date().getFullYear()
  let n = parseInt(localStorage.getItem('rp_req_counter') || '7', 10) + 1
  localStorage.setItem('rp_req_counter', String(n))
  return `REQ-${year}-${String(n).padStart(4,'0')}`
}

export function getAllRequests() {
  return JSON.parse(localStorage.getItem('rp_requests') || '[]')
}

export function getRequestsByEmployee(empId) {
  return getAllRequests().filter(r => r.empId === empId)
}

export function getRequestById(id) {
  return getAllRequests().find(r => r.id === id) || null
}

export function saveRequest(req) {
  const all = getAllRequests()
  const idx = all.findIndex(r => r.id === req.id)
  if (idx >= 0) all[idx] = req
  else all.unshift(req)
  localStorage.setItem('rp_requests', JSON.stringify(all))
  return req
}

// ── Session ───────────────────────────────────────────────
const SESSION_KEY = 'rp_session'

export function saveSession(emp) {
  const s = { empId:emp.id, name:emp.name, cl:emp.cl, role:emp.role, department:emp.department, designation:emp.designation, email:emp.email, team:emp.team, project:emp.project }
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  return s
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) }
  catch { return null }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

initStore()
