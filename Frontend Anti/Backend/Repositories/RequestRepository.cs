using Dapper;
using ReimbursementAPI.Models;
using System.Data;
using System.Text.Json;

namespace ReimbursementAPI.Repositories;

public interface IRequestRepository
{
    Task<IEnumerable<ReimbursementRequest>> GetRequestsByEmpIdAsync(string empId);
    Task<IEnumerable<ReimbursementRequest>> GetAllRequestsAsync();
    Task<IEnumerable<ReimbursementRequest>> GetRequestsForFinanceAsync();
    Task<ReimbursementRequest?> GetRequestByIdAsync(string id);
    
    // Business Travel
    Task CreateRequestAsync(ReimbursementRequest request);
    Task UpdateSettlementAsync(string id, string stage, string status, decimal? amount, string? settlement);
    Task FinanceReviewTravelAsync(string id, string stage, string? preAppStatus, string? setStatus, string? note);
    
    // Non-Travel Types
    Task CreateInternetRequestAsync(ReimbursementRequest req);
    Task CreateCarpoolRequestAsync(ReimbursementRequest req);
    Task CreateRelocationRequestAsync(ReimbursementRequest req);
    Task FinanceReviewOtherAsync(string id, string status, string? note);
}

public class RequestRepository : IRequestRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public RequestRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<ReimbursementRequest>> GetRequestsByEmpIdAsync(string empId)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ReimbursementRequest>(
            "SELECT * FROM sp_GetRequestsByEmpId(@EmpId)", 
            new { EmpId = empId }
        );
    }

    public async Task<IEnumerable<ReimbursementRequest>> GetAllRequestsAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ReimbursementRequest>("SELECT * FROM sp_GetAllRequests()");
    }

    public async Task<IEnumerable<ReimbursementRequest>> GetRequestsForFinanceAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<ReimbursementRequest>("SELECT * FROM sp_GetRequestsForFinance()");
    }

    public async Task<ReimbursementRequest?> GetRequestByIdAsync(string id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<ReimbursementRequest>(
            "SELECT * FROM sp_GetRequestById(@Id)", 
            new { Id = id }
        );
    }

    // --- Travel ---
    public async Task CreateRequestAsync(ReimbursementRequest req)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_CreateRequest(@Id, @EmpId, @Type, @Subtype, @Title, @Destination, @Region, @Area, @StartDate, @EndDate, @Days, @Purpose, @TravelModes::jsonb, @SubmittedAt, @Stage, @PreApprovalStatus, @Documents::jsonb)",
            req
        );
    }

    public async Task UpdateSettlementAsync(string id, string stage, string status, decimal? amount, string? settlement)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_UpdateSettlement(@Id, @Stage, @SettlementStatus, @SettlementAmount, @Settlement::jsonb)",
            new { Id = id, Stage = stage, SettlementStatus = status, SettlementAmount = amount, Settlement = settlement }
        );
    }

    public async Task FinanceReviewTravelAsync(string id, string stage, string? preAppStatus, string? setStatus, string? note)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_FinanceReviewTravel(@Id, @Stage, @PreApprovalStatus, @SettlementStatus, @FinanceNote)",
            new { Id = id, Stage = stage, PreApprovalStatus = preAppStatus, SettlementStatus = setStatus, FinanceNote = note }
        );
    }

    // --- Non-Travel ---
    public async Task CreateInternetRequestAsync(ReimbursementRequest req)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_CreateInternetRequest(@Id, @EmpId, @Title, @Month, @Provider, @Amount, @Document, @SubmittedAt)",
            new { req.Id, req.EmpId, req.Title, req.Month, req.Provider, req.Amount, req.Document, req.SubmittedAt }
        );
    }

    public async Task CreateCarpoolRequestAsync(ReimbursementRequest req)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_CreateCarpoolRequest(@Id, @EmpId, @Title, @Month, @Days, @Route, @Amount, @Document, @SubmittedAt)",
            new { req.Id, req.EmpId, req.Title, req.Month, req.Days, req.Route, req.Amount, req.Document, req.SubmittedAt }
        );
    }

    public async Task CreateRelocationRequestAsync(ReimbursementRequest req)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_CreateRelocationRequest(@Id, @EmpId, @Title, @TeamName, @FromCity, @ToCity, @RelocDate, @Amount, @Documents::jsonb, @SubmittedAt)",
            new { req.Id, req.EmpId, req.Title, req.TeamName, req.FromCity, req.ToCity, req.RelocDate, req.Amount, req.Documents, req.SubmittedAt }
        );
    }

    public async Task FinanceReviewOtherAsync(string id, string status, string? note)
    {
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(
            "CALL sp_FinanceReviewOther(@Id, @Status, @FinanceNote)",
            new { Id = id, Status = status, FinanceNote = note }
        );
    }
}
