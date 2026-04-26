using System.Text.RegularExpressions;

namespace Services.Markdown.BlockHandler;

public class ListBlockHandler : BaseBlockHandler
{
    public ListBlockHandler(InlineParser inlineParser) : base(inlineParser)
    {
    }

    public override string? Handle(string block)
    {
        if (Regex.IsMatch(block, @"^[-*+]\s"))
        {
            return ParseList(block, @"^[-*+]\s+(.+)$", "ul");
        }


        if (Regex.IsMatch(block, @"^\d+[\.)]\s"))
        {
            return ParseList(block, @"^\d+[\.)]\s+(.+)$", "ol");
        }

        return base.Handle(block);
    }

    private string ParseList(string block, string itemPattern, string wrapperTag)
    {
        string listItems = Regex.Replace(block, itemPattern, match =>
        {
            string itemText = match.Groups[1].Value.Trim();

            string parsedItem = InlineParser.Parse(itemText);

            return $"<li>{parsedItem}</li>";
        }, RegexOptions.Multiline);
        
        return $$"""
                 <{{wrapperTag}}>
                     {{listItems.Trim()}}
                 </{{wrapperTag}}>
                 """;
    }
}