using Domain.Models;

namespace Services.WeightStrategyFactory.WeightStrategy;

public class DefaultStrategy : IWeightStrategy
{
    public int CalculateWeight(QueueEntry entry, QueueSession session, int currentGreenZoneOccupancy,
        bool submitSecondWork)
    {
        int avaliablePlaces = (int)session.Duration.TotalMinutes / session.AverageMinutesPerStudent -
                              currentGreenZoneOccupancy;
        if (avaliablePlaces < 1)
            return 0;

        return 50;
    }
}