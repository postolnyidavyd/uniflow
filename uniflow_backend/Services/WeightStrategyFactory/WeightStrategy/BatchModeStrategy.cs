using Domain.Models;

namespace Services.WeightStrategyFactory.WeightStrategy;

public class BatchModeStrategy : IWeightStrategy
{
    public int CalculateWeight(QueueEntry entry, QueueSession session, int currentGreenZoneOccupancy,
        bool submitSecondWork)
    {
        int avaliablePlaces = (int)session.Duration.TotalMinutes / session.AverageMinutesPerStudent -
                              currentGreenZoneOccupancy;
        //Якщо здає 1 роботу і немає місця в черзі повертаємо 0 
        if (avaliablePlaces < 1)
            return 0;

        //Якщо здає 2 роботи - не даєм заняти останнє місце в черзі, але даєм йому невелику перевагу над звичайними хто не вліз
        if (submitSecondWork && avaliablePlaces < 2)
            return 10;


        //Тут даємо 100 або 50 залежно від токена і незалежно чи це Primary\Secondary
        return entry.UsedToken ? 100 : 50;
    }
}