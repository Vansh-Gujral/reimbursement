import { Navigate } from 'react-router-dom'
import { getSession } from '../data/store'

export default function RequireAuth({ children, role }) {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  if (role === 'employee' && session.role !== 'employee') {
    return session.role === 'finance'
      ? <Navigate to="/finance/dashboard" replace />
      : <Navigate to="/login" replace />
  }
  if (role === 'finance' && session.role !== 'finance') {
    return session.role === 'employee'
      ? <Navigate to="/app/dashboard" replace />
      : <Navigate to="/login" replace />
  }
  return children
}
