using ReimbursementAPI.Models;

namespace ReimbursementAPI.Repositories;

public class MockEmployeeRepository : IEmployeeRepository
{
    private static readonly List<Employee> _employees = new()
    {
        new Employee { Id = "EMP001", Name = "Arjun Sharma", ClLevel = "CL3", Department = "Technology", Designation = "Senior Associate", Email = "arjun.sharma@company.com", Manager = "Rohan Kapoor", Username = "emp001", PasswordHash = "pass123", Role = "employee", Team = "AI", Project = "Project Alpha" },
        new Employee { Id = "EMP002", Name = "Priya Mehta", ClLevel = "CL4", Department = "Operations", Designation = "Associate", Email = "priya.mehta@company.com", Manager = "Sunita Rao", Username = "emp002", PasswordHash = "pass123", Role = "employee", Team = "AD", Project = "Project Beta" },
        new Employee { Id = "EMP003", Name = "Karan Singh", ClLevel = "CL2", Department = "Sales", Designation = "Manager", Email = "karan.singh@company.com", Manager = "Sunita Rao", Username = "emp003", PasswordHash = "pass123", Role = "employee", Team = "QC", Project = "Project Gamma" },
        new Employee { Id = "FIN001", Name = "Rahul Verma", ClLevel = "CL2", Department = "Finance", Designation = "Finance Manager", Email = "rahul.verma@company.com", Manager = "CEO", Username = "finance01", PasswordHash = "pass123", Role = "finance", Team = "Other", Project = "N/A" },
        new Employee { Id = "ADM001", Name = "Sunita Rao", ClLevel = "CL1", Department = "HR", Designation = "HR Director", Email = "sunita.rao@company.com", Manager = "MD", Username = "admin01", PasswordHash = "pass123", Role = "admin", Team = "Other", Project = "N/A" }
    };

    public Task<Employee?> GetEmployeeByUsernameAsync(string username, string password)
    {
        var emp = _employees.FirstOrDefault(e => e.Username == username && e.PasswordHash == password);
        return Task.FromResult(emp);
    }
}
