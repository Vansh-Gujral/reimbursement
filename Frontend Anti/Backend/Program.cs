using ReimbursementAPI.Mappings;
using ReimbursementAPI.Repositories;
using ReimbursementAPI.Services;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS (allow frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Configure AutoMapper (v13)
builder.Services.AddSingleton(provider =>
{
    var config = new AutoMapper.MapperConfiguration(cfg =>
    {
        cfg.AddProfile<AutoMapperProfile>();
    });
    config.AssertConfigurationIsValid();
    return config.CreateMapper();
});

// Configure DI for Repositories and// Repositories (Mock)
builder.Services.AddScoped<IEmployeeRepository, MockEmployeeRepository>();
builder.Services.AddScoped<IRequestRepository, MockRequestRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRequestService, RequestService>();

// Configure Dapper (if needed, e.g. mapping column names to properties)
DefaultTypeMap.MatchNamesWithUnderscores = true;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
