// ── API Configuration ──────────────────────────────────────────
const BASE_URL = 'http://localhost:5252/api'

// ── Session (Local Storage) ──────────────────────────────────
const SESSION_KEY = 'rp_session'

export function saveSession(emp) {
  const s = { 
    empId: emp.id, 
    name: emp.name, 
    cl: emp.cl, 
    role: emp.role, 
    department: emp.department, 
    designation: emp.designation, 
    email: emp.email, 
    team: emp.team, 
    project: emp.project 
  }
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

// ── Auth ─────────────────────────────────────────────────────
export async function login(username, password, loginAs = 'default') {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, loginAs })
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return await res.json()
}

// ── Queries ──────────────────────────────────────────────────
export async function getAllRequests() {
  const res = await fetch(`${BASE_URL}/requests`)
  return await res.json()
}

export async function getRequestsByEmployee(empId) {
  const res = await fetch(`${BASE_URL}/requests/employee/${empId}`)
  return await res.json()
}

export async function getRequestById(id) {
  const res = await fetch(`${BASE_URL}/requests/${id}`)
  if (!res.ok) return null
  return await res.json()
}

export async function getEmployeeDashboardStats(empId) {
  const res = await fetch(`${BASE_URL}/dashboard/employee/${empId}`)
  return await res.json()
}

export async function getFinanceDashboardStats() {
  const res = await fetch(`${BASE_URL}/dashboard/finance`)
  return await res.json()
}

export async function getFinanceActionableRequests() {
  const res = await fetch(`${BASE_URL}/requests/finance`)
  return await res.json()
}

// ── Commands ─────────────────────────────────────────────────
export async function createPreApproval(dto) {
  const res = await fetch(`${BASE_URL}/requests/pre-approval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  return await res.json()
}

export async function createInternet(dto) {
  const res = await fetch(`${BASE_URL}/requests/internet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  return await res.json()
}

export async function createCarpool(dto) {
  const res = await fetch(`${BASE_URL}/requests/carpool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  return await res.json()
}

export async function createRelocation(dto) {
  const res = await fetch(`${BASE_URL}/requests/relocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  return await res.json()
}

export async function submitSettlement(id, dto) {
  await fetch(`${BASE_URL}/requests/${id}/settlement`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
}

export async function financeReview(id, dto) {
  await fetch(`${BASE_URL}/requests/${id}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
}
