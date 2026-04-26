using System.Text.RegularExpressions;

namespace Services.Markdown.BlockHandler;

public class HeaderBlockHandler : BaseBlockHandler
{
    public HeaderBlockHandler(InlineParser inlineParser) : base(inlineParser)
    {
    }

    public override string? Handle(string block)
    {
        if(!block.StartsWith('#'))
            return base.Handle(block);
        string pattern = @"^(#{1,6})\s+(.+)$";
        return Regex.Replace(block, pattern,
            match =>
                $"<h{match.Groups[1].Length}>{InlineParser.Parse(match.Groups[2].Value)}</h{match.Groups[1].Length}>");
    }
}