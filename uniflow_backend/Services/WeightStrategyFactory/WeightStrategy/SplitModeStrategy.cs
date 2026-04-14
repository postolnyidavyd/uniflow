using Domain.Enums;
using Domain.Models;

namespace Services.WeightStrategyFactory.WeightStrategy;

public class SplitModeStrategy : IWeightStrategy
{
    public int CalculateWeight(QueueEntry entry, QueueSession session, int currentGreenZoneOccupancy,
        bool submitSecondWork)
    {
        int avaliablePlaces = (int)session.Duration.TotalMinutes / session.AverageMinutesPerStudent -
                              currentGreenZoneOccupancy;
        //Якщо немає місця автоматично в жовту
        if (avaliablePlaces < 1)
            return 0;

        //Якщо це перша робота то звичайний пріоритет
        if (entry.EntryType == EntryType.Primary)
            return entry.UsedToken ? 100 : 50;

        //Якщо це друга робота то даємо менший пріоритет
        return 10;
    }
}