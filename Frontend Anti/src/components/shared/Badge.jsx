import { getStatusLabel, getStatusBadgeClass } from '../../utils/helpers'

export default function Badge({ request, status, label }) {
  if (label && status) {
    return <span className={`badge badge-${status}`}>{label}</span>
  }
  if (request) {
    return <span className={`badge ${getStatusBadgeClass(request)}`}>{getStatusLabel(request)}</span>
  }
  return null
}
