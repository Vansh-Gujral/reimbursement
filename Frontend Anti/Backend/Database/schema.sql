-- =====================================================
-- COMPLETE Database Schema for Reimbursement Portal
-- PostgreSQL — Tables + All Stored Procedures/Functions
-- =====================================================

-- ── Tables ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Employees (
    Id VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ClLevel VARCHAR(10) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Designation VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Manager VARCHAR(100) NOT NULL,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL,        -- employee | finance | admin
    Team VARCHAR(50),
    Project VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ReimbursementRequests (
    Id VARCHAR(50) PRIMARY KEY,
    EmpId VARCHAR(20) NOT NULL REFERENCES Employees(Id),
    Type VARCHAR(50) NOT NULL,         -- business-travel | internet-bill | carpooling | relocation
    Subtype VARCHAR(50),               -- domestic | international (travel only)
    Title VARCHAR(200) NOT NULL,
    Destination VARCHAR(100),
    Region VARCHAR(50),
    Area VARCHAR(50),
    StartDate DATE,
    EndDate DATE,
    Days INT,
    Purpose TEXT,
    TravelModes JSONB,
    SubmittedAt TIMESTAMP NOT NULL,
    Stage VARCHAR(50),                 -- pre-approval | settlement | settlement-approved
    PreApprovalStatus VARCHAR(50),     -- pending | approved | rejected
    SettlementStatus VARCHAR(50),      -- submitted | approved | rejected
    SettlementAmount DECIMAL(12,2),
    FinanceNote TEXT,
    Documents JSONB,
    Settlement JSONB,
    -- Non-travel fields
    Status VARCHAR(50),                -- pending | approved | rejected (internet/carpool/relocation)
    Amount DECIMAL(12,2),
    Month VARCHAR(20),
    Provider VARCHAR(100),
    Route VARCHAR(200),
    Document VARCHAR(200),
    TeamName VARCHAR(100),
    RelocDate DATE,
    FromCity VARCHAR(100),
    ToCity VARCHAR(100)
);

-- ═══════════════════════════════════════════════════════
-- STORED PROCEDURES / FUNCTIONS
-- ═══════════════════════════════════════════════════════

-- ── Auth ─────────────────────────────────────────────
-- Returns: Single Employee row matching username + password
CREATE OR REPLACE FUNCTION sp_GetEmployeeByUsername(p_username VARCHAR, p_password VARCHAR)
RETURNS TABLE (
    Id VARCHAR, Name VARCHAR, ClLevel VARCHAR, Department VARCHAR, Designation VARCHAR,
    Email VARCHAR, Manager VARCHAR, Username VARCHAR, PasswordHash VARCHAR, Role VARCHAR, Team VARCHAR, Project VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT e.Id, e.Name, e.ClLevel, e.Department, e.Designation, e.Email, e.Manager,
           e.Username, e.PasswordHash, e.Role, e.Team, e.Project
    FROM Employees e
    WHERE e.Username = p_username AND e.PasswordHash = p_password;
END;
$$ LANGUAGE plpgsql;

-- ── Employee Lookup ──────────────────────────────────
-- Returns: Single Employee by Id (for finance review page to show employee details)
CREATE OR REPLACE FUNCTION sp_GetEmployeeById(p_id VARCHAR)
RETURNS TABLE (
    Id VARCHAR, Name VARCHAR, ClLevel VARCHAR, Department VARCHAR, Designation VARCHAR,
    Email VARCHAR, Manager VARCHAR, Username VARCHAR, PasswordHash VARCHAR, Role VARCHAR, Team VARCHAR, Project VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM Employees e WHERE e.Id = p_id;
END;
$$ LANGUAGE plpgsql;

-- ── Get Requests by Employee ─────────────────────────
-- Returns: All requests for a specific employee, sorted by newest first
CREATE OR REPLACE FUNCTION sp_GetRequestsByEmpId(p_emp_id VARCHAR)
RETURNS SETOF ReimbursementRequests AS $$
BEGIN
    RETURN QUERY SELECT * FROM ReimbursementRequests r WHERE r.EmpId = p_emp_id ORDER BY r.SubmittedAt DESC;
END;
$$ LANGUAGE plpgsql;

-- ── Get ALL Requests ─────────────────────────────────
-- Returns: Every request in the system (for finance views)
CREATE OR REPLACE FUNCTION sp_GetAllRequests()
RETURNS SETOF ReimbursementRequests AS $$
BEGIN
    RETURN QUERY SELECT * FROM ReimbursementRequests ORDER BY SubmittedAt DESC;
END;
$$ LANGUAGE plpgsql;

-- ── Get Requests for Finance (Actionable only) ──────
-- Returns: Only requests that need finance action (pending pre-approvals, submitted settlements, pending other)
CREATE OR REPLACE FUNCTION sp_GetRequestsForFinance()
RETURNS SETOF ReimbursementRequests AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM ReimbursementRequests r
    WHERE (r.Type = 'business-travel' AND (r.PreApprovalStatus = 'pending' OR r.SettlementStatus = 'submitted'))
       OR (r.Type != 'business-travel' AND r.Status = 'pending')
    ORDER BY r.SubmittedAt ASC;
END;
$$ LANGUAGE plpgsql;

-- ── Get Single Request ───────────────────────────────
-- Returns: One request by Id
CREATE OR REPLACE FUNCTION sp_GetRequestById(p_id VARCHAR)
RETURNS SETOF ReimbursementRequests AS $$
BEGIN
    RETURN QUERY SELECT * FROM ReimbursementRequests r WHERE r.Id = p_id;
END;
$$ LANGUAGE plpgsql;

-- ── Create Business Travel Pre-Approval ──────────────
-- Inserts: A new business-travel request in pre-approval stage
CREATE OR REPLACE PROCEDURE sp_CreateRequest(
    p_id VARCHAR, p_empId VARCHAR, p_type VARCHAR, p_subtype VARCHAR, p_title VARCHAR,
    p_destination VARCHAR, p_region VARCHAR, p_area VARCHAR, p_startDate DATE, p_endDate DATE,
    p_days INT, p_purpose TEXT, p_travelModes JSONB, p_submittedAt TIMESTAMP, p_stage VARCHAR,
    p_preApprovalStatus VARCHAR, p_documents JSONB
) AS $$
BEGIN
    INSERT INTO ReimbursementRequests (
        Id, EmpId, Type, Subtype, Title, Destination, Region, Area, StartDate, EndDate,
        Days, Purpose, TravelModes, SubmittedAt, Stage, PreApprovalStatus, Documents
    ) VALUES (
        p_id, p_empId, p_type, p_subtype, p_title, p_destination, p_region, p_area, p_startDate, p_endDate,
        p_days, p_purpose, p_travelModes, p_submittedAt, p_stage, p_preApprovalStatus, p_documents
    );
END;
$$ LANGUAGE plpgsql;

-- ── Create Internet Bill ─────────────────────────────
-- Inserts: A new internet-bill request
CREATE OR REPLACE PROCEDURE sp_CreateInternetRequest(
    p_id VARCHAR, p_empId VARCHAR, p_title VARCHAR, p_month VARCHAR,
    p_provider VARCHAR, p_amount DECIMAL, p_document VARCHAR, p_submittedAt TIMESTAMP
) AS $$
BEGIN
    INSERT INTO ReimbursementRequests (Id, EmpId, Type, Title, Month, Provider, Amount, Document, SubmittedAt, Status)
    VALUES (p_id, p_empId, 'internet-bill', p_title, p_month, p_provider, p_amount, p_document, p_submittedAt, 'pending');
END;
$$ LANGUAGE plpgsql;

-- ── Create Carpooling ────────────────────────────────
-- Inserts: A new carpooling request
CREATE OR REPLACE PROCEDURE sp_CreateCarpoolRequest(
    p_id VARCHAR, p_empId VARCHAR, p_title VARCHAR, p_month VARCHAR,
    p_days INT, p_route VARCHAR, p_amount DECIMAL, p_document VARCHAR, p_submittedAt TIMESTAMP
) AS $$
BEGIN
    INSERT INTO ReimbursementRequests (Id, EmpId, Type, Title, Month, Days, Route, Amount, Document, SubmittedAt, Status)
    VALUES (p_id, p_empId, 'carpooling', p_title, p_month, p_days, p_route, p_amount, p_document, p_submittedAt, 'pending');
END;
$$ LANGUAGE plpgsql;

-- ── Create Relocation ────────────────────────────────
-- Inserts: A new relocation request
CREATE OR REPLACE PROCEDURE sp_CreateRelocationRequest(
    p_id VARCHAR, p_empId VARCHAR, p_title VARCHAR, p_teamName VARCHAR,
    p_fromCity VARCHAR, p_toCity VARCHAR, p_relocDate DATE, p_amount DECIMAL,
    p_documents JSONB, p_submittedAt TIMESTAMP
) AS $$
BEGIN
    INSERT INTO ReimbursementRequests (Id, EmpId, Type, Title, TeamName, FromCity, ToCity, RelocDate, Amount, Documents, SubmittedAt, Status)
    VALUES (p_id, p_empId, 'relocation', p_title, p_teamName, p_fromCity, p_toCity, p_relocDate, p_amount, p_documents, p_submittedAt, 'pending');
END;
$$ LANGUAGE plpgsql;

-- ── Update Settlement ────────────────────────────────
-- Updates: Settlement data on a business-travel request
CREATE OR REPLACE PROCEDURE sp_UpdateSettlement(
    p_id VARCHAR, p_stage VARCHAR, p_settlementStatus VARCHAR, p_settlementAmount DECIMAL, p_settlement JSONB
) AS $$
BEGIN
    UPDATE ReimbursementRequests
    SET Stage = p_stage,
        SettlementStatus = p_settlementStatus,
        SettlementAmount = p_settlementAmount,
        Settlement = p_settlement
    WHERE Id = p_id;
END;
$$ LANGUAGE plpgsql;

-- ── Finance Review (Business Travel) ─────────────────
-- Updates: Approval/rejection for business-travel requests
CREATE OR REPLACE PROCEDURE sp_FinanceReviewTravel(
    p_id VARCHAR, p_stage VARCHAR, p_preApprovalStatus VARCHAR, p_settlementStatus VARCHAR, p_financeNote TEXT
) AS $$
BEGIN
    UPDATE ReimbursementRequests
    SET Stage = p_stage,
        PreApprovalStatus = COALESCE(p_preApprovalStatus, PreApprovalStatus),
        SettlementStatus = COALESCE(p_settlementStatus, SettlementStatus),
        FinanceNote = p_financeNote
    WHERE Id = p_id;
END;
$$ LANGUAGE plpgsql;

-- ── Finance Review (Non-Travel) ──────────────────────
-- Updates: Approval/rejection for internet/carpool/relocation requests
CREATE OR REPLACE PROCEDURE sp_FinanceReviewOther(
    p_id VARCHAR, p_status VARCHAR, p_financeNote TEXT
) AS $$
BEGIN
    UPDATE ReimbursementRequests
    SET Status = p_status,
        FinanceNote = p_financeNote
    WHERE Id = p_id;
END;
$$ LANGUAGE plpgsql;
