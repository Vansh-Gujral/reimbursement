// ── Currency ──────────────────────────────────────────────
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', minimumFractionDigits:0 }).format(amount)
}

// ── Dates ─────────────────────────────────────────────────
export function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

export function formatDateTime(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
    ', ' + dt.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })
}

export function dateDiffDays(start, end) {
  const s = new Date(start), e = new Date(end)
  if (isNaN(s) || isNaN(e) || e < s) return 0
  return Math.round((e - s) / 86400000) + 1
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ── Status helpers ────────────────────────────────────────
export function getStatusLabel(r) {
  if (r.type === 'business-travel') {
    if (r.preApprovalStatus === 'pending')  return 'Pre-Approval Pending'
    if (r.preApprovalStatus === 'rejected') return 'Pre-Approval Rejected'
    if (r.preApprovalStatus === 'approved' && !r.settlementStatus) return 'Pre-Approved'
    if (r.settlementStatus === 'pending')   return 'Settlement Pending'
    if (r.settlementStatus === 'submitted') return 'Settlement Submitted'
    if (r.settlementStatus === 'approved')  return 'Settlement Approved'
    if (r.settlementStatus === 'rejected')  return 'Settlement Rejected'
  }
  const m = { pending:'Pending', approved:'Approved', rejected:'Rejected', draft:'Draft' }
  return m[r.status] || r.status || '—'
}

export function getStatusBadgeClass(r) {
  if (r.type === 'business-travel') {
    if (r.preApprovalStatus === 'pending')  return 'badge-pending'
    if (r.preApprovalStatus === 'rejected') return 'badge-rejected'
    if (r.preApprovalStatus === 'approved' && !r.settlementStatus) return 'badge-info'
    if (r.settlementStatus === 'pending')   return 'badge-purple'
    if (r.settlementStatus === 'submitted') return 'badge-info'
    if (r.settlementStatus === 'approved')  return 'badge-approved'
    if (r.settlementStatus === 'rejected')  return 'badge-rejected'
  }
  const m = { pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected', draft:'badge-draft', submitted:'badge-info' }
  return m[r.status] || 'badge-draft'
}

export function getTypeLabel(type) {
  return { 'business-travel':'Business Travel', 'internet-bill':'Internet Bill', carpooling:'Carpooling', relocation:'Relocation' }[type] || type
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB'
  return (bytes/1048576).toFixed(1) + ' MB'
}

export function getInitials(name) {
  return (name || '').split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)
}
