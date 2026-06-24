using ReimbursementAPI.DTOs;
using ReimbursementAPI.Repositories;
using AutoMapper;

namespace ReimbursementAPI.Services;

public interface IAuthService
{
    Task<EmployeeDto?> AuthenticateAsync(string username, string password, string? loginAs);
}

public class AuthService : IAuthService
{
    private readonly IEmployeeRepository _employeeRepo;
    private readonly IMapper _mapper;

    public AuthService(IEmployeeRepository employeeRepo, IMapper mapper)
    {
        _employeeRepo = employeeRepo;
        _mapper = mapper;
    }

    public async Task<EmployeeDto?> AuthenticateAsync(string username, string password, string? loginAs)
    {
        // Simple mock auth matching frontend
        var emp = await _employeeRepo.GetEmployeeByUsernameAsync(username, password);
        if (emp == null) return null;

        var dto = _mapper.Map<EmployeeDto>(emp);

        // If finance wants to login as an employee to create requests
        if (loginAs == "employee" && dto.Role == "finance")
        {
            dto.Role = "employee";
        }

        return dto;
    }
}
