using Microsoft.AspNetCore.Mvc;
using ReimbursementAPI.DTOs;
using ReimbursementAPI.Services;

namespace ReimbursementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController : ControllerBase
{
    private readonly IRequestService _service;

    public RequestsController(IRequestService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRequests()
    {
        var result = await _service.GetAllRequestsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRequestById(string id)
    {
        var result = await _service.GetRequestByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("employee/{empId}")]
    public async Task<IActionResult> GetRequestsByEmployee(string empId)
    {
        var result = await _service.GetRequestsForEmployeeAsync(empId);
        return Ok(result);
    }

    [HttpGet("finance")]
    public async Task<IActionResult> GetRequestsForFinance()
    {
        var result = await _service.GetRequestsForFinanceAsync();
        return Ok(result);
    }

    [HttpPost("pre-approval")]
    public async Task<IActionResult> CreatePreApproval([FromBody] CreatePreApprovalDto dto)
    {
        var result = await _service.CreateRequestAsync(dto);
        return Created($"/api/requests/{result.Id}", result);
    }

    [HttpPost("internet")]
    public async Task<IActionResult> CreateInternet([FromBody] CreateInternetDto dto)
    {
        var result = await _service.CreateInternetRequestAsync(dto);
        return Created($"/api/requests/{result.Id}", result);
    }

    [HttpPost("carpool")]
    public async Task<IActionResult> CreateCarpool([FromBody] CreateCarpoolDto dto)
    {
        var result = await _service.CreateCarpoolRequestAsync(dto);
        return Created($"/api/requests/{result.Id}", result);
    }

    [HttpPost("relocation")]
    public async Task<IActionResult> CreateRelocation([FromBody] CreateRelocationDto dto)
    {
        var result = await _service.CreateRelocationRequestAsync(dto);
        return Created($"/api/requests/{result.Id}", result);
    }

    [HttpPut("{id}/settlement")]
    public async Task<IActionResult> UpdateSettlement(string id, [FromBody] SubmitSettlementDto dto)
    {
        await _service.UpdateSettlementAsync(id, dto);
        return NoContent();
    }

    [HttpPut("{id}/review")]
    public async Task<IActionResult> FinanceReview(string id, [FromBody] FinanceReviewDto dto)
    {
        await _service.FinanceReviewAsync(id, dto);
        return NoContent();
    }
}
