using DTOs.CalendarDTOs;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;

namespace Services.ICalBuilder;

public class ICalBuilder : IICalbuilder
{
    private string FormatTitle(ICalItemType itemType, string title)
    {
        return itemType switch
        {
            ICalItemType.Event => "📘 " + title,
            ICalItemType.Deadline => "🔴 " + title,
            ICalItemType.Queue => "🟡 " + title,
            _ => title
        };
    }

    private string GetCategory(ICalItemType type)
    {
        return type switch
        {
            ICalItemType.Event => "Подія",
            ICalItemType.Deadline => "Дедлайн",
            ICalItemType.Queue => "Черга",
            _ => "Подія"
        };
    }

    private void AddColorAndEmoji(CalendarEvent evt, ICalItemType type)
    {
        var (color, appleColor) = type switch
        {
            ICalItemType.Event => ("#4285F4", "#4285F4"), // синій
            ICalItemType.Deadline => ("#EA4335", "#EA4335"), // червоний
            ICalItemType.Queue => ("#FBBC05", "#FBBC05"), // жовтий
            _ => ("#34A853", "#34A853")
        };

        evt.AddProperty("COLOR", color);
        evt.AddProperty("X-APPLE-COLOR", appleColor);
    }

    private void AddAlarmsAndTransparency(CalendarEvent calendarEvent, ICalItemType type, string title)
    {
        calendarEvent.Transparency = type == ICalItemType.Deadline
            ? TransparencyType.Transparent // Дедлайн не блокує час
            : TransparencyType.Opaque; // Пари та черги блокують


        switch (type)
        {
            case ICalItemType.Queue:
                calendarEvent.Alarms.Add(new Alarm
                {
                    Action = AlarmAction.Display, Description = $"Через 1 год: Черга ({title})",
                    Trigger = new Trigger(new Duration(hours: -1))
                });
                break;

            case ICalItemType.Deadline:
                calendarEvent.Alarms.Add(new Alarm
                {
                    Action = AlarmAction.Display, Description = $"Завтра: Дедлайн ({title})",
                    Trigger = new Trigger(new Duration(days: -1))
                });
                calendarEvent.Alarms.Add(new Alarm
                {
                    Action = AlarmAction.Display, Description = $"Через 2 год: Дедлайн ({title})",
                    Trigger = new Trigger(new Duration(hours: -2))
                });
                break;

            case ICalItemType.Event:
                calendarEvent.Alarms.Add(new Alarm
                {
                    Action = AlarmAction.Display, Description = $"Через 1 год: {title}",
                    Trigger = new Trigger(new Duration(hours: -1))
                });
                break;
        }
    }

    public string BuildCalendar(IEnumerable<ICalItem> items, string timeZoneId = "Europe/Kyiv")
    {
        var calendar = new Ical.Net.Calendar()
            { Version = "2.0", ProductId = "-//Потік календар//Uniflow calendar//UK" };

        //Властивості всього календаря
        calendar.AddProperty("NAME", "Студентський календар Потік"); // RFC 7986
        calendar.AddProperty("X-WR-CALNAME", "Студентський календар Потік"); // сумісність
        calendar.AddProperty("COLOR", "#1E88E5"); // колір календаря
        calendar.AddProperty("X-WR-CALDESC", "Лекції, дедлайни та черги");

        calendar.AddTimeZone(timeZoneId);

        var targetZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);

        foreach (var calItem in items)
        {
            var localStart = TimeZoneInfo.ConvertTimeFromUtc(calItem.StartTime, targetZone);
            var localEnd = TimeZoneInfo.ConvertTimeFromUtc(calItem.EndTime, targetZone);

            var calendarEvent = new CalendarEvent()
            {
                Uid = calItem.Id.ToString(),
                Summary = FormatTitle(calItem.ItemType, calItem.Title),
                Description = calItem.Description,
                Location = calItem.Location,
                Url = string.IsNullOrWhiteSpace(calItem.Url) ? null : new Uri(calItem.Url),

                Categories = new List<string>() { GetCategory(calItem.ItemType) },

                DtStart = new CalDateTime(localStart, timeZoneId),
                DtEnd = new CalDateTime(localEnd, timeZoneId),

                DtStamp = new CalDateTime(DateTime.UtcNow),
                LastModified = new CalDateTime(DateTime.UtcNow)
            };
            AddColorAndEmoji(calendarEvent, calItem.ItemType);
            AddAlarmsAndTransparency(calendarEvent, calItem.ItemType, calItem.Title);
            calendar.Events.Add(calendarEvent);
        }

        var serializer = new CalendarSerializer();
        return serializer.SerializeToString(calendar)!;
    }
}