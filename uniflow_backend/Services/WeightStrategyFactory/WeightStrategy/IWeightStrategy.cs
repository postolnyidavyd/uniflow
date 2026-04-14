using Domain.Models;

namespace Services.WeightStrategyFactory.WeightStrategy;

public interface IWeightStrategy
{
    public int CalculateWeight(QueueEntry entry, QueueSession session, int currentGreenZoneOccupancy,
        bool submitSecondWork);
}