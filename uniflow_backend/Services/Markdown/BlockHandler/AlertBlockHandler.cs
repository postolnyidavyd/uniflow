using System.Text.RegularExpressions;

namespace Services.Markdown.BlockHandler;

public class AlertBlockHandler : BaseBlockHandler
{
    public AlertBlockHandler(InlineParser inlineParser) : base(inlineParser)
    {
    }
    
    public override string? Handle(string block)
    {
        if(!block.TrimStart().StartsWith("> [!"))
            return base.Handle(block);
        
        string pattern = @"^> \[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\n([\s\S]+)$";
        return Regex.Replace(block, pattern, match =>
        {
            string textContent = match.Groups[2].Value;
            string removeUnnecessaryCharsPattern = @"^>\s?";
            
            textContent = Regex.Replace(textContent, removeUnnecessaryCharsPattern, "", RegexOptions.Multiline);
            textContent = InlineParser.Parse(textContent);
            
            var type = match.Groups[1].Value;
            var classAttr = $" class=\"alert alert-{type.ToLower()}\"";
            
            return $$"""
                     <div {{classAttr}}>
                        <span class="alert-title">{{type}}</span>
                        <p>{{textContent}}</p>
                     </div>
                     """;
        });
    }
}