namespace ReimbursementAPI.Models;

public class ReimbursementRequest
{
    public string Id { get; set; } = string.Empty;
    public string EmpId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Subtype { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Destination { get; set; }
    public string? Region { get; set; }
    public string? Area { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Days { get; set; }
    public string? Purpose { get; set; }
    public string? TravelModes { get; set; }        // JSONB column as string
    public DateTime SubmittedAt { get; set; }
    public string Stage { get; set; } = string.Empty;
    public string? PreApprovalStatus { get; set; }
    public string? SettlementStatus { get; set; }
    public decimal? SettlementAmount { get; set; }
    public string? FinanceNote { get; set; }
    public string? Documents { get; set; }          // JSONB column as string
    public string? Settlement { get; set; }         // JSONB column as string

    // Non-travel fields (stored in same table for simplicity)
    public string? Status { get; set; }             // pending | approved | rejected (for internet/carpool/relocation)
    public decimal? Amount { get; set; }            // For non-travel types
    public string? Month { get; set; }
    public string? Provider { get; set; }
    public string? Route { get; set; }
    public string? Document { get; set; }           // Single document filename
    public string? TeamName { get; set; }
    public DateTime? RelocDate { get; set; }
    public string? FromCity { get; set; }
    public string? ToCity { get; set; }
}
