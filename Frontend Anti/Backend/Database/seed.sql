-- =====================================================
-- Seed Data for Reimbursement Portal (PostgreSQL)
-- Run this AFTER schema.sql
-- =====================================================

-- ── Employees ─────────────────────────────────────────
INSERT INTO Employees (Id, Name, ClLevel, Department, Designation, Email, Manager, Username, PasswordHash, Role, Team, Project) VALUES
('EMP001', 'Arjun Sharma',  'CL3', 'Technology',  'Senior Associate',  'arjun.sharma@company.com',  'Rohan Kapoor', 'emp001',    'pass123', 'employee', 'AI',    'Project Alpha'),
('EMP002', 'Priya Mehta',   'CL4', 'Operations',  'Associate',         'priya.mehta@company.com',   'Sunita Rao',   'emp002',    'pass123', 'employee', 'AD',    'Project Beta'),
('EMP003', 'Karan Singh',   'CL2', 'Sales',       'Manager',           'karan.singh@company.com',   'Sunita Rao',   'emp003',    'pass123', 'employee', 'QC',    'Project Gamma'),
('FIN001', 'Rahul Verma',   'CL2', 'Finance',     'Finance Manager',   'rahul.verma@company.com',   'CEO',          'finance01', 'pass123', 'finance',  'Other', 'N/A'),
('ADM001', 'Sunita Rao',    'CL1', 'HR',          'HR Director',       'sunita.rao@company.com',    'MD',           'admin01',   'pass123', 'admin',    'Other', 'N/A')
ON CONFLICT (Id) DO NOTHING;

-- ── Sample Reimbursement Requests ─────────────────────
INSERT INTO ReimbursementRequests (Id, EmpId, Type, Subtype, Title, Destination, Region, Area, StartDate, EndDate, Days, Purpose, TravelModes, SubmittedAt, Stage, PreApprovalStatus, SettlementStatus, SettlementAmount, FinanceNote, Documents, Settlement, Status, Amount, Month, Provider, Route, Document, TeamName, RelocDate, FromCity, ToCity) VALUES
-- 1. Business Travel (Settled)
(
    'REQ-2024-0001', 'EMP001', 'business-travel', 'domestic',
    'Business Trip to Mumbai', 'Mumbai, Maharashtra', NULL, 'Area A',
    '2024-02-10', '2024-02-14', 4,
    'Client meeting and project handover',
    '["Air"]'::jsonb,
    '2024-02-01 10:30:00', 'settlement-approved', 'approved', 'approved', 22500.00,
    'All documents verified. Approved.',
    '{"knoxMail":"approval_mail.pdf","passport":"passport_copy.pdf","visa":null,"insurance":"insurance.pdf"}'::jsonb,
    '{"hotelName":"Taj Mumbai","hotelAmount":12000,"perDiem":6000,"conveyanceTrips":4,"conveyanceAmount":1800,"totalAmount":22500,"boardingPass":"bp_001.pdf","passportStamp":"stamp_001.pdf","tripReport":"report_001.pdf","submittedAt":"2024-02-20T09:00:00"}'::jsonb,
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- 2. Business Travel (Pre-Approval pending)
(
    'REQ-2024-0005', 'EMP001', 'business-travel', 'domestic',
    'Business Trip to Bangalore', 'Bengaluru, Karnataka', NULL, 'Area A',
    '2024-04-08', '2024-04-10', 2,
    'Interview panel and campus hiring',
    '["Air"]'::jsonb,
    '2024-03-28 11:00:00', 'pre-approval', 'pending', NULL, NULL,
    '', '{}'::jsonb, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- 3. Internet Bill (Pending)
(
    'REQ-2024-0006', 'EMP001', 'internet-bill', NULL,
    'Internet Bill — 2024-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    '2024-04-05 10:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'pending', 1000.00, '2024-04', 'Airtel Broadband', NULL, 'bill_04.pdf', NULL, NULL, NULL, NULL
),
-- 4. Carpooling (Approved)
(
    'REQ-2024-0007', 'EMP002', 'carpooling', NULL,
    'Carpooling — 2024-03', NULL, NULL, NULL, NULL, NULL, 15, NULL, NULL,
    '2024-03-30 16:00:00', NULL, NULL, NULL, NULL, 'Approved per logs.', NULL, NULL,
    'approved', 750.00, '2024-03', NULL, 'Koramangala → Office', 'carpool_log.pdf', NULL, NULL, NULL, NULL
),
-- 5. Relocation (Pending)
(
    'REQ-2024-0008', 'EMP003', 'relocation', NULL,
    'Relocation: Pune → Delhi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    '2024-05-15 11:30:00', NULL, NULL, NULL, NULL, NULL,
    '{"empId":"id.pdf","flightTicket":"ticket.pdf","boardingPass":"bp.pdf","paymentProof":"receipt.pdf"}'::jsonb, NULL,
    'pending', 45000.00, NULL, NULL, NULL, NULL, 'Sales', '2024-05-10', 'Pune', 'Delhi'
)
ON CONFLICT (Id) DO NOTHING;
