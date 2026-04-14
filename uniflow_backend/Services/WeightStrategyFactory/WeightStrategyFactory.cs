using Domain.Enums;
using Services.WeightStrategyFactory.WeightStrategy;

namespace Services.WeightStrategyFactory;

public class WeightStrategyFactory : IWeightStrategyFactory
{
    private readonly Dictionary<SubmissionMode, IWeightStrategy> _strategies;
    private readonly IWeightStrategy _defaultStrategy;

    public WeightStrategyFactory()
    {
        _strategies = new()
        {
            { SubmissionMode.Single, new BatchModeStrategy() },
            { SubmissionMode.Batch, new BatchModeStrategy() },
            { SubmissionMode.Split, new SplitModeStrategy() },
        };
        _defaultStrategy = new DefaultStrategy();
    }

    public void Register(SubmissionMode mode, IWeightStrategy strategy)
    {
        _strategies.Add(mode, strategy);
    }

    public IWeightStrategy GetWeightStrategy(SubmissionMode mode)
    {
        if (!_strategies.TryGetValue(mode, out var strategy))
        {
            throw new NotSupportedException($"Стратегія для режиму {mode} не реалізована.");
        }

        return strategy;
    }
}