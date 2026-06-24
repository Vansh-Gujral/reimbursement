using Microsoft.AspNetCore.Mvc;
using ReimbursementAPI.DTOs;
using ReimbursementAPI.Services;

namespace ReimbursementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var employee = await _authService.AuthenticateAsync(dto.Username, dto.Password, dto.LoginAs);
        if (employee == null)
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(employee);
    }
}
