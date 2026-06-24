// ── Employees ─────────────────────────────────────────────
export const EMPLOYEES = [
  { id:'EMP001', name:'Arjun Sharma', cl:'CL3', department:'Technology', designation:'Senior Associate', email:'arjun.sharma@company.com', manager:'Rohan Kapoor', username:'emp001', password:'pass123', role:'employee', team:'AI', project:'Project Alpha' },
  { id:'EMP002', name:'Priya Mehta',  cl:'CL4', department:'Operations',  designation:'Associate',        email:'priya.mehta@company.com',  manager:'Sunita Rao',  username:'emp002', password:'pass123', role:'employee', team:'AD', project:'Project Beta' },
  { id:'EMP003', name:'Karan Singh',  cl:'CL2', department:'Sales',       designation:'Manager',          email:'karan.singh@company.com',  manager:'Sunita Rao',  username:'emp003', password:'pass123', role:'employee', team:'QC', project:'Project Gamma' },
  { id:'FIN001', name:'Rahul Verma',  cl:'CL2', department:'Finance',     designation:'Finance Manager',  email:'rahul.verma@company.com',  manager:'CEO',         username:'finance01', password:'pass123', role:'finance', team:'Other', project:'N/A' },
  { id:'ADM001', name:'Sunita Rao',   cl:'CL1', department:'HR',          designation:'HR Director',      email:'sunita.rao@company.com',   manager:'MD',          username:'admin01',   password:'pass123', role:'admin', team:'Other', project:'N/A' },
]

export function findEmployee(username, password) {
  return EMPLOYEES.find(e => e.username === username && e.password === password) || null
}

export function getEmployeeById(id) {
  return EMPLOYEES.find(e => e.id === id) || null
}
