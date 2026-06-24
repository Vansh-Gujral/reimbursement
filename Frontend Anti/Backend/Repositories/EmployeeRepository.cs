using Dapper;
using ReimbursementAPI.Models;
using System.Data;

namespace ReimbursementAPI.Repositories;

public interface IEmployeeRepository
{
    Task<Employee?> GetEmployeeByUsernameAsync(string username, string passwordHash);
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public EmployeeRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Employee?> GetEmployeeByUsernameAsync(string username, string passwordHash)
    {
        using var connection = _connectionFactory.CreateConnection();
        // Since Postgres returns TABLE from Function, we call it like a table.
        // Wait, standard Dapper function call in Postgres:
        var query = "SELECT * FROM sp_GetEmployeeByUsername(@Username, @Password)";
        
        return await connection.QuerySingleOrDefaultAsync<Employee>(
            query,
            new { Username = username, Password = passwordHash }
        );
    }
}
