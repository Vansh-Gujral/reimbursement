using AutoMapper;
using ReimbursementAPI.DTOs;
using ReimbursementAPI.Models;
using System.Text.Json;

namespace ReimbursementAPI.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Employee, EmployeeDto>();
        
        CreateMap<ReimbursementRequest, RequestDto>()
            .ForMember(d => d.StartDate, opt => opt.MapFrom(s => s.StartDate.HasValue ? s.StartDate.Value.ToString("yyyy-MM-dd") : null))
            .ForMember(d => d.EndDate, opt => opt.MapFrom(s => s.EndDate.HasValue ? s.EndDate.Value.ToString("yyyy-MM-dd") : null))
            .ForMember(d => d.SubmittedAt, opt => opt.MapFrom(s => s.SubmittedAt.ToString("yyyy-MM-ddTHH:mm:ss")))
            .ForMember(d => d.TravelModes, opt => opt.MapFrom(s => ParseJson(s.TravelModes)))
            .ForMember(d => d.Documents, opt => opt.MapFrom(s => ParseJson(s.Documents)))
            .ForMember(d => d.Settlement, opt => opt.MapFrom(s => ParseJson(s.Settlement)));

        CreateMap<RequestDto, ReimbursementRequest>()
            .ForMember(d => d.TravelModes, opt => opt.MapFrom(s => SerializeJson(s.TravelModes)))
            .ForMember(d => d.Documents, opt => opt.MapFrom(s => SerializeJson(s.Documents)))
            .ForMember(d => d.Settlement, opt => opt.MapFrom(s => SerializeJson(s.Settlement)));
    }

    private static object? ParseJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return JsonSerializer.Deserialize<object>(json); }
        catch { return null; }
    }
    
    private static string? SerializeJson(object? obj)
    {
        if (obj == null) return null;
        return JsonSerializer.Serialize(obj);
    }
}
