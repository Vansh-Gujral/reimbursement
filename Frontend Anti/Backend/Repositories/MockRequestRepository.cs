using ReimbursementAPI.Models;

namespace ReimbursementAPI.Repositories;

public class MockRequestRepository : IRequestRepository
{
    private static readonly List<ReimbursementRequest> _requests = new()
    {
        new ReimbursementRequest
        {
            Id = "REQ-2024-0001", EmpId = "EMP001", Type = "business-travel", Subtype = "domestic", Title = "Business Trip to Mumbai", Destination = "Mumbai, Maharashtra", Area = "Area A", StartDate = DateTime.Parse("2024-02-10"), EndDate = DateTime.Parse("2024-02-14"), Days = 4, Purpose = "Client meeting and project handover", TravelModes = "[\"Air\"]", SubmittedAt = DateTime.Parse("2024-02-01 10:30:00"), Stage = "settlement-approved", PreApprovalStatus = "approved", SettlementStatus = "approved", SettlementAmount = 22500.00m, FinanceNote = "All documents verified. Approved.", Documents = "{\"knoxMail\":\"approval_mail.pdf\",\"passport\":\"passport_copy.pdf\",\"visa\":null,\"insurance\":\"insurance.pdf\"}", Settlement = "{\"hotelName\":\"Taj Mumbai\",\"hotelAmount\":12000,\"perDiem\":6000,\"conveyanceTrips\":4,\"conveyanceAmount\":1800,\"totalAmount\":22500,\"boardingPass\":\"bp_001.pdf\",\"passportStamp\":\"stamp_001.pdf\",\"tripReport\":\"report_001.pdf\",\"submittedAt\":\"2024-02-20T09:00:00\"}"
        },
        new ReimbursementRequest
        {
            Id = "REQ-2024-0005", EmpId = "EMP001", Type = "business-travel", Subtype = "domestic", Title = "Business Trip to Bangalore", Destination = "Bengaluru, Karnataka", Area = "Area A", StartDate = DateTime.Parse("2024-04-08"), EndDate = DateTime.Parse("2024-04-10"), Days = 2, Purpose = "Interview panel and campus hiring", TravelModes = "[\"Air\"]", SubmittedAt = DateTime.Parse("2024-03-28 11:00:00"), Stage = "pre-approval", PreApprovalStatus = "pending", Documents = "{}"
        },
        new ReimbursementRequest
        {
            Id = "REQ-2024-0006", EmpId = "EMP001", Type = "internet-bill", Title = "Internet Bill — 2024-04", SubmittedAt = DateTime.Parse("2024-04-05 10:00:00"), Status = "pending", Amount = 1000.00m, Month = "2024-04", Provider = "Airtel Broadband", Document = "bill_04.pdf"
        },
        new ReimbursementRequest
        {
            Id = "REQ-2024-0007", EmpId = "EMP002", Type = "carpooling", Title = "Carpooling — 2024-03", Days = 15, SubmittedAt = DateTime.Parse("2024-03-30 16:00:00"), FinanceNote = "Approved per logs.", Status = "approved", Amount = 750.00m, Month = "2024-03", Route = "Koramangala → Office", Document = "carpool_log.pdf"
        },
        new ReimbursementRequest
        {
            Id = "REQ-2024-0008", EmpId = "EMP003", Type = "relocation", Title = "Relocation: Pune → Delhi", SubmittedAt = DateTime.Parse("2024-05-15 11:30:00"), Documents = "{\"empId\":\"id.pdf\",\"flightTicket\":\"ticket.pdf\",\"boardingPass\":\"bp.pdf\",\"paymentProof\":\"receipt.pdf\"}", Status = "pending", Amount = 45000.00m, TeamName = "Sales", RelocDate = DateTime.Parse("2024-05-10"), FromCity = "Pune", ToCity = "Delhi"
        }
    };

    public Task<IEnumerable<ReimbursementRequest>> GetRequestsByEmpIdAsync(string empId)
    {
        return Task.FromResult(_requests.Where(r => r.EmpId == empId).OrderByDescending(r => r.SubmittedAt).AsEnumerable());
    }

    public Task<IEnumerable<ReimbursementRequest>> GetAllRequestsAsync()
    {
        return Task.FromResult(_requests.OrderByDescending(r => r.SubmittedAt).AsEnumerable());
    }

    public Task<IEnumerable<ReimbursementRequest>> GetRequestsForFinanceAsync()
    {
        var filtered = _requests.Where(r => 
            (r.Type == "business-travel" && (r.PreApprovalStatus == "pending" || r.SettlementStatus == "submitted")) ||
            (r.Type != "business-travel" && r.Status == "pending")
        ).OrderBy(r => r.SubmittedAt);
        return Task.FromResult(filtered.AsEnumerable());
    }

    public Task<ReimbursementRequest?> GetRequestByIdAsync(string id)
    {
        return Task.FromResult(_requests.FirstOrDefault(r => r.Id == id));
    }

    public Task CreateRequestAsync(ReimbursementRequest request)
    {
        _requests.Add(request);
        return Task.CompletedTask;
    }

    public Task UpdateSettlementAsync(string id, string stage, string status, decimal? amount, string? settlement)
    {
        var req = _requests.FirstOrDefault(r => r.Id == id);
        if (req != null)
        {
            req.Stage = stage;
            req.SettlementStatus = status;
            req.SettlementAmount = amount;
            req.Settlement = settlement;
        }
        return Task.CompletedTask;
    }

    public Task FinanceReviewTravelAsync(string id, string stage, string? preAppStatus, string? setStatus, string? note)
    {
        var req = _requests.FirstOrDefault(r => r.Id == id);
        if (req != null)
        {
            req.Stage = stage;
            req.PreApprovalStatus = preAppStatus ?? req.PreApprovalStatus;
            req.SettlementStatus = setStatus ?? req.SettlementStatus;
            req.FinanceNote = note;
        }
        return Task.CompletedTask;
    }

    public Task CreateInternetRequestAsync(ReimbursementRequest req)
    {
        _requests.Add(req);
        return Task.CompletedTask;
    }

    public Task CreateCarpoolRequestAsync(ReimbursementRequest req)
    {
        _requests.Add(req);
        return Task.CompletedTask;
    }

    public Task CreateRelocationRequestAsync(ReimbursementRequest req)
    {
        _requests.Add(req);
        return Task.CompletedTask;
    }

    public Task FinanceReviewOtherAsync(string id, string status, string? note)
    {
        var req = _requests.FirstOrDefault(r => r.Id == id);
        if (req != null)
        {
            req.Status = status;
            req.FinanceNote = note;
        }
        return Task.CompletedTask;
    }
}
