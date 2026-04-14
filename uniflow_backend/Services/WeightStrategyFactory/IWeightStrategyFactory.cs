using Domain.Enums;
using Microsoft.AspNetCore.Session;
using Services.WeightStrategyFactory.WeightStrategy;

namespace Services.WeightStrategyFactory;

public interface IWeightStrategyFactory
{
    public void Register(SubmissionMode mode, IWeightStrategy strategy);
    public IWeightStrategy GetWeightStrategy(SubmissionMode mode);
}