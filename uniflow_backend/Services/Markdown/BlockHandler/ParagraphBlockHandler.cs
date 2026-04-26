namespace Services.Markdown.BlockHandler;

public class ParagraphBlockHandler : BaseBlockHandler
{
    public ParagraphBlockHandler(InlineParser inlineParser) : base(inlineParser)
    {
    }

    public override string? Handle(string block)
    {
        return $"<p>{InlineParser.Parse(block)}</p>";
    }
}