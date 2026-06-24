import React from 'react';
import { FileText, Clock, Wallet } from 'lucide-react';

const Dashboard = () => {
  // Utility function for status pills
  const getStatusStyle = (status) => {
    const styles = {
      'Submitted': { bg: '#eff6ff', color: '#2563eb' },
      'Approved': { bg: '#dcfce7', color: '#16a34a' },
      'Knox Pending': { bg: '#fef3c7', color: '#d97706' },
      'Completed': { bg: '#dcfce7', color: '#16a34a' },
      'Rejected': { bg: '#fee2e2', color: '#dc2626' }
    };
    return styles[status] || { bg: '#f3f4f6', color: '#4b5563' };
  };

  return (
    <div style={{ maxWidth: '1400px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Dashboard</h2>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}><FileText size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>My Requests</div>
            <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>08</div>
            <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}>View all</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#d97706' }}><Clock size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>Pending Approvals</div>
            <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>02</div>
            <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}>View all</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '8px', color: '#16a34a' }}><Wallet size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>Total Reimbursed</div>
            <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>₹1,24,500</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>This Year</div>
          </div>
        </div>

      </div>

      {/* Recent Requests Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Recent Requests</h3>
          <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>View all</button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '500', borderBottom: '1px solid #e5e7eb' }}>Request ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '500', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '500', borderBottom: '1px solid #e5e7eb' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '500', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '500', borderBottom: '1px solid #e5e7eb' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'REQ-2026-0008', date: '20 May 2026', category: 'Travel', amount: '₹18,600', status: 'Submitted' },
              { id: 'REQ-2026-0007', date: '15 May 2026', category: 'Hotel', amount: '₹24,000', status: 'Approved' },
              { id: 'REQ-2026-0006', date: '10 May 2026', category: 'Food', amount: '₹3,450', status: 'Knox Pending' },
              { id: 'REQ-2026-0005', date: '02 May 2026', category: 'Travel', amount: '₹12,500', status: 'Completed' },
            ].map((req, i) => (
              <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{req.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>{req.date}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>{req.category}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>{req.amount}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    backgroundColor: getStatusStyle(req.status).bg, 
                    color: getStatusStyle(req.status).color, 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600' 
                  }}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;