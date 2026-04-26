using System.Text.RegularExpressions;

namespace Services.Markdown.BlockHandler;

public class CodeBlockHandler : BaseBlockHandler
{
    public CodeBlockHandler(InlineParser inlineParser) : base(inlineParser)
    {
    }

    public override string? Handle(string block)
    {
        if(!block.TrimStart().StartsWith("```"))
            return base.Handle(block);
        string pattern = @"^```(\w*)\n([\s\S]+?)```$";
        return Regex.Replace(block, pattern, match =>
        {
            var textContent = match.Groups[2].Value;
            var emptyLinePattern = @"%%EMPTY_LINE%%";
            textContent = Regex.Replace(textContent, emptyLinePattern, "\n\n");
            
            var language = match.Groups[1].Value;
            var classAttr = string.IsNullOrEmpty(language) ? "" : $" class=\"language-{language}\"";
            
            return $"<pre><code {classAttr}\">{textContent}</code></pre>";
        });
    }
}