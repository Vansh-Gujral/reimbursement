using Microsoft.AspNetCore.Mvc;
using ReimbursementAPI.DTOs;
using ReimbursementAPI.Services;

namespace ReimbursementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IRequestService _service;

    public DashboardController(IRequestService service)
    {
        _service = service;
    }

    [HttpGet("employee/{empId}")]
    public async Task<IActionResult> GetEmployeeStats(string empId)
    {
        var stats = await _service.GetEmployeeDashboardStatsAsync(empId);
        return Ok(stats);
    }

    [HttpGet("finance")]
    public async Task<IActionResult> GetFinanceStats()
    {
        var stats = await _service.GetFinanceDashboardStatsAsync();
        return Ok(stats);
    }
}
