using AutoMapper;
using ReimbursementAPI.DTOs;
using ReimbursementAPI.Models;
using ReimbursementAPI.Repositories;
using System.Text.Json;

namespace ReimbursementAPI.Services;

public interface IRequestService
{
    // Queries
    Task<IEnumerable<RequestDto>> GetAllRequestsAsync();
    Task<IEnumerable<RequestDto>> GetRequestsForEmployeeAsync(string empId);
    Task<IEnumerable<RequestDto>> GetRequestsForFinanceAsync();
    Task<RequestDto?> GetRequestByIdAsync(string id);
    Task<DashboardStatsDto> GetEmployeeDashboardStatsAsync(string empId);
    Task<FinanceDashboardStatsDto> GetFinanceDashboardStatsAsync();

    // Travel
    Task<RequestDto> CreateRequestAsync(CreatePreApprovalDto dto);
    Task UpdateSettlementAsync(string id, SubmitSettlementDto dto);
    
    // Non-Travel
    Task<RequestDto> CreateInternetRequestAsync(CreateInternetDto dto);
    Task<RequestDto> CreateCarpoolRequestAsync(CreateCarpoolDto dto);
    Task<RequestDto> CreateRelocationRequestAsync(CreateRelocationDto dto);
    
    // Finance Review
    Task FinanceReviewAsync(string id, FinanceReviewDto dto);
}

public class RequestService : IRequestService
{
    private readonly IRequestRepository _repo;
    private readonly IMapper _mapper;

    public RequestService(IRequestRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    private string GenerateId(string prefix = "REQ") => 
        $"{prefix}-{DateTime.Now.Year}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";

    // --- Queries ---
    public async Task<IEnumerable<RequestDto>> GetAllRequestsAsync()
    {
        var requests = await _repo.GetAllRequestsAsync();
        return _mapper.Map<IEnumerable<RequestDto>>(requests);
    }

    public async Task<IEnumerable<RequestDto>> GetRequestsForEmployeeAsync(string empId)
    {
        var requests = await _repo.GetRequestsByEmpIdAsync(empId);
        return _mapper.Map<IEnumerable<RequestDto>>(requests);
    }

    public async Task<IEnumerable<RequestDto>> GetRequestsForFinanceAsync()
    {
        var requests = await _repo.GetRequestsForFinanceAsync();
        return _mapper.Map<IEnumerable<RequestDto>>(requests);
    }

    public async Task<RequestDto?> GetRequestByIdAsync(string id)
    {
        var request = await _repo.GetRequestByIdAsync(id);
        if (request == null) return null;
        return _mapper.Map<RequestDto>(request);
    }

    public async Task<DashboardStatsDto> GetEmployeeDashboardStatsAsync(string empId)
    {
        var allReqs = (await _repo.GetRequestsByEmpIdAsync(empId)).ToList();
        
        var pending = allReqs.Count(r => 
            r.PreApprovalStatus == "pending" || r.Status == "pending" || r.SettlementStatus == "submitted");
            
        var approved = allReqs.Count(r => 
            r.SettlementStatus == "approved" || (r.PreApprovalStatus == "approved" && r.SettlementStatus == null) || r.Status == "approved");
            
        var totalReimbursed = allReqs.Sum(r => r.SettlementAmount ?? r.Amount ?? 0);
        var recent = allReqs.Take(6);

        return new DashboardStatsDto
        {
            TotalRequests = allReqs.Count,
            Pending = pending,
            Approved = approved,
            TotalReimbursed = totalReimbursed,
            RecentRequests = _mapper.Map<List<RequestDto>>(recent)
        };
    }

    public async Task<FinanceDashboardStatsDto> GetFinanceDashboardStatsAsync()
    {
        var all = (await _repo.GetAllRequestsAsync()).ToList();
        var now = DateTime.UtcNow;

        var actionable = all.Where(r => 
            (r.Type == "business-travel" && r.PreApprovalStatus == "pending") ||
            (r.Type == "business-travel" && r.SettlementStatus == "submitted") ||
            (r.Type != "business-travel" && r.Status == "pending")
        ).Take(8).ToList();

        return new FinanceDashboardStatsDto
        {
            PendingPreApproval = all.Count(r => r.Type == "business-travel" && r.PreApprovalStatus == "pending"),
            PendingSettlement = all.Count(r => r.Type == "business-travel" && r.SettlementStatus == "submitted"),
            PendingOther = all.Count(r => r.Type != "business-travel" && r.Status == "pending"),
            TotalRejected = all.Count(r => r.PreApprovalStatus == "rejected" || r.SettlementStatus == "rejected" || r.Status == "rejected"),
            TotalSubmittedValue = all.Sum(r => r.SettlementAmount ?? r.Amount ?? 0),
            ApprovedThisMonth = all.Count(r => 
                (r.PreApprovalStatus == "approved" || r.SettlementStatus == "approved" || r.Status == "approved") &&
                r.SubmittedAt.Month == now.Month && r.SubmittedAt.Year == now.Year),
            ActionableRequests = _mapper.Map<List<RequestDto>>(actionable)
        };
    }

    // --- Travel ---
    public async Task<RequestDto> CreateRequestAsync(CreatePreApprovalDto dto)
    {
        var model = new ReimbursementRequest
        {
            Id = GenerateId(),
            EmpId = dto.EmpId,
            Type = "business-travel",
            Subtype = dto.Subtype,
            Title = $"Business Trip to {dto.Destination}",
            Destination = dto.Destination,
            Region = dto.Region,
            Area = dto.Area,
            StartDate = DateTime.Parse(dto.StartDate),
            EndDate = DateTime.Parse(dto.EndDate),
            Days = dto.Days,
            Purpose = dto.Purpose,
            Documents = dto.Documents != null ? JsonSerializer.Serialize(dto.Documents) : null,
            SubmittedAt = DateTime.UtcNow,
            Stage = "pre-approval",
            PreApprovalStatus = "pending"
        };

        await _repo.CreateRequestAsync(model);
        return _mapper.Map<RequestDto>(model);
    }

    public async Task UpdateSettlementAsync(string id, SubmitSettlementDto dto)
    {
        var settlementJson = dto.Settlement != null ? JsonSerializer.Serialize(dto.Settlement) : null;
        await _repo.UpdateSettlementAsync(id, "settlement", "submitted", dto.SettlementAmount, settlementJson);
    }

    // --- Non-Travel ---
    public async Task<RequestDto> CreateInternetRequestAsync(CreateInternetDto dto)
    {
        var model = new ReimbursementRequest
        {
            Id = GenerateId(),
            EmpId = dto.EmpId,
            Title = $"Internet Bill — {dto.Month}",
            Month = dto.Month,
            Provider = dto.Provider,
            Amount = dto.Amount,
            Document = dto.Document,
            SubmittedAt = DateTime.UtcNow
        };
        await _repo.CreateInternetRequestAsync(model);
        model.Type = "internet-bill";
        model.Status = "pending";
        return _mapper.Map<RequestDto>(model);
    }

    public async Task<RequestDto> CreateCarpoolRequestAsync(CreateCarpoolDto dto)
    {
        var model = new ReimbursementRequest
        {
            Id = GenerateId(),
            EmpId = dto.EmpId,
            Title = $"Carpooling — {dto.Month}",
            Month = dto.Month,
            Days = dto.Days,
            Route = $"{dto.From} → {dto.To}",
            Amount = dto.Amount,
            Document = dto.Document,
            SubmittedAt = DateTime.UtcNow
        };
        await _repo.CreateCarpoolRequestAsync(model);
        model.Type = "carpooling";
        model.Status = "pending";
        return _mapper.Map<RequestDto>(model);
    }

    public async Task<RequestDto> CreateRelocationRequestAsync(CreateRelocationDto dto)
    {
        var model = new ReimbursementRequest
        {
            Id = GenerateId(),
            EmpId = dto.EmpId,
            Title = $"Relocation: {dto.FromCity} → {dto.ToCity}",
            TeamName = dto.TeamName,
            FromCity = dto.FromCity,
            ToCity = dto.ToCity,
            RelocDate = DateTime.Parse(dto.RelocDate),
            Amount = dto.Amount,
            Documents = dto.Documents != null ? JsonSerializer.Serialize(dto.Documents) : null,
            SubmittedAt = DateTime.UtcNow
        };
        await _repo.CreateRelocationRequestAsync(model);
        model.Type = "relocation";
        model.Status = "pending";
        return _mapper.Map<RequestDto>(model);
    }

    // --- Finance Review ---
    public async Task FinanceReviewAsync(string id, FinanceReviewDto dto)
    {
        var req = await _repo.GetRequestByIdAsync(id);
        if (req == null) throw new Exception("Request not found");

        if (req.Type == "business-travel")
        {
            string stage = req.Stage;
            string? preApp = req.PreApprovalStatus;
            string? settApp = req.SettlementStatus;

            if (req.PreApprovalStatus == "pending")
            {
                preApp = dto.Action;
                if (dto.Action == "approved") stage = "settlement-pending";
            }
            else if (req.SettlementStatus == "submitted")
            {
                settApp = dto.Action;
                if (dto.Action == "approved") stage = "settlement-approved";
            }
            
            await _repo.FinanceReviewTravelAsync(id, stage, preApp, settApp, dto.FinanceNote);
        }
        else
        {
            await _repo.FinanceReviewOtherAsync(id, dto.Action, dto.FinanceNote);
        }
    }
}
