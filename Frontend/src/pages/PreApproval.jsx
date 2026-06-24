import React, { useState } from 'react';
import { UploadCloud, ChevronRight, FileText } from 'lucide-react';

const PreApproval = () => {
  const [formData, setFormData] = useState({
    type: 'international',
    purpose: '',
    startDate: '',
    endDate: '',
    location: ''
  });

  // Strict Corporate Styling Rules
  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    color: '#111827',
    marginTop: '0.375rem',
    backgroundColor: '#ffffff',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '0.815rem',
    fontWeight: '500',
    color: '#4b5563',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header and Minimal Progress Tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Create Reimbursement Request</h2>
        </div>
        
        {/* Progress Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.875rem', fontWeight: '600' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem' }}>1</div>
            Request Details
          </div>
          <ChevronRight size={14} color="#9ca3af" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', border: '1px solid #d1d5db' }}>2</div>
            Upload Documents
          </div>
          <ChevronRight size={14} color="#9ca3af" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', border: '1px solid #d1d5db' }}>3</div>
            Review & Submit
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Input Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Core Details */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#2563eb" /> Request Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select 
                  style={inputStyle}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="international">Business Travel (International)</option>
                  <option value="domestic">Business Travel (Domestic)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Destination Area / Region</label>
                <input type="text" placeholder="e.g. Seoul, South Korea" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Purpose of Trip</label>
              <input type="text" placeholder="Describe business objective (e.g., Q3 System Architecture Alignment)" style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input type="date" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input type="date" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Section 2: Upload Documents Container */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Pre-Approval Evidences</h3>
            <p style={{ fontSize: '0.815rem', color: '#6b7280', marginBottom: '1.25rem' }}>Please attach documentation clear of blur or cropping to support automated line-item auditing.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['Knox Approval Email', 'Passport Copy', 'Visa copy', 'Travel Insurance'].map((doc, index) => (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px dashed #d1d5db', 
                    borderRadius: '6px', 
                    padding: '1.25rem', 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    backgroundColor: '#fafafa',
                    transition: 'all 0.15s ease'
                  }} 
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#2563eb';
                  }} 
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  <UploadCloud size={22} color="#4b5563" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#374151' }}>{doc}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Click to open file explorer</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Sticky Context Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '20px' }}>
          
          {/* Dynamic Budget Indicator Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.815rem', color: '#6b7280', fontWeight: '500' }}>CL Level</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '700' }}>CL3</span>
            </div>
            <div>
              <div style={{ fontSize: '0.815rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem' }}>Maximum Cap Allowed</div>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#16a34a' }}>₹50,000</div>
            </div>
          </div>

          {/* Guidelines Summary Card */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.815rem', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Info</h4>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.785rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <li>Per-diem flat payout tracking maps to ₹1500/day during execution.</li>
              <li>Local conveyance requires separate verification during step 2 settlement.</li>
            </ul>
          </div>

          {/* Submission CTA Button */}
          <button 
            style={{ 
              backgroundColor: '#0f4c81', // Solid corporate primary tone
              color: '#ffffff', 
              padding: '0.875rem', 
              borderRadius: '4px', 
              border: 'none', 
              fontWeight: '600', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              textAlign: 'center',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f4c81'}
          >
            Submit Pre-Approval
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreApproval;