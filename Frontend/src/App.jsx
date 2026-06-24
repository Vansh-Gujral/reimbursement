import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PreApproval from './pages/PreApproval';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* We will build this page in the next step! */}
          {/* <Route path="/request/travel/pre-approval" element={<PreApproval />} /> */}
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/request/create" element={<PreApproval />} />
      
      </Routes>
    </Router>
  );
}

export default App;