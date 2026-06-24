namespace ReimbursementAPI.DTOs;

// ── Auth ─────────────────────────────────────────────
public record LoginDto(string Username, string Password, string? LoginAs);

public class EmployeeDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ClLevel { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Project { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Manager { get; set; } = string.Empty;
}

// ── Generic Request DTO (for business-travel, reading back all types) ──
public class RequestDto
{
    public string Id { get; set; } = string.Empty;
    public string EmpId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;       // business-travel | internet-bill | carpooling | relocation
    public string? Subtype { get; set; }                    // domestic | international (only for business-travel)
    public string Title { get; set; } = string.Empty;
    public string? Destination { get; set; }
    public string? Region { get; set; }
    public string? Area { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public int? Days { get; set; }
    public string? Purpose { get; set; }
    public object? TravelModes { get; set; }
    public string SubmittedAt { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;       // pre-approval | settlement | settlement-approved
    public string? PreApprovalStatus { get; set; }          // pending | approved | rejected
    public string? SettlementStatus { get; set; }           // submitted | approved | rejected
    public decimal? SettlementAmount { get; set; }
    public string? FinanceNote { get; set; }
    public object? Documents { get; set; }
    public object? Settlement { get; set; }
    
    // Fields for non-travel types (internet-bill, carpooling, relocation)
    public string? Status { get; set; }                     // pending | approved | rejected
    public decimal? Amount { get; set; }
    public string? Month { get; set; }
    public string? Provider { get; set; }
    public string? Route { get; set; }
    public string? Document { get; set; }
    public string? TeamName { get; set; }
    public string? RelocDate { get; set; }
    public string? FromCity { get; set; }
    public string? ToCity { get; set; }
}

// ── Create DTOs ──────────────────────────────────────
public class CreatePreApprovalDto
{
    public string EmpId { get; set; } = string.Empty;
    public string Subtype { get; set; } = "domestic";
    public string Destination { get; set; } = string.Empty;
    public string? Region { get; set; }
    public string? Area { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public int Days { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public object? Documents { get; set; }
}

public class CreateInternetDto
{
    public string EmpId { get; set; } = string.Empty;
    public string Month { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Document { get; set; }
}

public class CreateCarpoolDto
{
    public string EmpId { get; set; } = string.Empty;
    public string Month { get; set; } = string.Empty;
    public int Days { get; set; }
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Document { get; set; }
}

public class CreateRelocationDto
{
    public string EmpId { get; set; } = string.Empty;
    public string TeamName { get; set; } = string.Empty;
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string RelocDate { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public object? Documents { get; set; }
}

public class SubmitSettlementDto
{
    public string? Stage { get; set; }
    public string? SettlementStatus { get; set; }
    public decimal? SettlementAmount { get; set; }
    public object? Settlement { get; set; }
}

public class FinanceReviewDto
{
    public string Action { get; set; } = string.Empty;   // approve | reject
    public string? FinanceNote { get; set; }
}

// ── Dashboard Stats ──────────────────────────────────
public class DashboardStatsDto
{
    public int TotalRequests { get; set; }
    public int Pending { get; set; }
    public int Approved { get; set; }
    public decimal TotalReimbursed { get; set; }
    public List<RequestDto> RecentRequests { get; set; } = new();
}

public class FinanceDashboardStatsDto
{
    public int PendingPreApproval { get; set; }
    public int PendingSettlement { get; set; }
    public int PendingOther { get; set; }
    public int ApprovedThisMonth { get; set; }
    public int TotalRejected { get; set; }
    public decimal TotalSubmittedValue { get; set; }
    public List<RequestDto> ActionableRequests { get; set; } = new();
}
