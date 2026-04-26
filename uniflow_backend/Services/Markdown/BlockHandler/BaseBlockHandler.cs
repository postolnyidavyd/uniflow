namespace Services.Markdown.BlockHandler;

public class BaseBlockHandler : IBlockHandler
{
    private IBlockHandler? _next;
    protected readonly InlineParser InlineParser;

    protected BaseBlockHandler(InlineParser inlineParser)
    {
        InlineParser = inlineParser;
    }

    public IBlockHandler SetNext(IBlockHandler handler)
    {
        _next = handler;
        return handler;
    }

    public virtual string? Handle(string block)
    {
        return _next?.Handle(block);
    }
}