using Domain.Models;
using DTOs.CalendarDTOs;

namespace Services.ICalBuilder;

public interface IICalbuilder
{
    public string BuildCalendar(IEnumerable<ICalItem> items, string timeZoneId = "Europe/Kyiv");

}