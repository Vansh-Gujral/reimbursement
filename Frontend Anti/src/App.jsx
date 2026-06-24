import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Requests from './pages/Requests'
import NewRequest from './pages/NewRequest'
import Policy from './pages/Policy'
import PreApproval from './pages/travel/PreApproval'
import Settlement from './pages/travel/Settlement'
import ViewRequest from './pages/travel/ViewRequest'
import Relocation from './pages/Relocation'
import Internet from './pages/Internet'
import Carpool from './pages/Carpool'
import FinanceDashboard from './pages/finance/FinanceDashboard'
import FinanceRequests from './pages/finance/FinanceRequests'
import FinanceReview from './pages/finance/FinanceReview'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Employee routes */}
        <Route path="/app/dashboard"    element={<RequireAuth role="employee"><Dashboard /></RequireAuth>} />
        <Route path="/app/requests"     element={<RequireAuth role="employee"><Requests /></RequireAuth>} />
        <Route path="/app/new-request"  element={<RequireAuth role="employee"><NewRequest /></RequireAuth>} />
        <Route path="/app/policy"       element={<RequireAuth role="employee"><Policy /></RequireAuth>} />
        <Route path="/app/travel/pre-approval"      element={<RequireAuth role="employee"><PreApproval /></RequireAuth>} />
        <Route path="/app/travel/settlement/:id"    element={<RequireAuth role="employee"><Settlement /></RequireAuth>} />
        <Route path="/app/travel/view/:id"          element={<RequireAuth role="employee"><ViewRequest /></RequireAuth>} />
        <Route path="/app/relocation"   element={<RequireAuth role="employee"><Relocation /></RequireAuth>} />
        <Route path="/app/internet"     element={<RequireAuth role="employee"><Internet /></RequireAuth>} />
        <Route path="/app/carpool"      element={<RequireAuth role="employee"><Carpool /></RequireAuth>} />

        {/* Finance routes */}
        <Route path="/finance/dashboard" element={<RequireAuth role="finance"><FinanceDashboard /></RequireAuth>} />
        <Route path="/finance/requests"  element={<RequireAuth role="finance"><FinanceRequests /></RequireAuth>} />
        <Route path="/finance/review/:id" element={<RequireAuth role="finance"><FinanceReview /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
