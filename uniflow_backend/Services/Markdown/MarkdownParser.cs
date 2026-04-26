using Services.Markdown.BlockHandler;

namespace Services.Markdown;

public class MarkdownParser : IMarkdownParser
{
    public string Parse(string markdown)
    {
        var blocks = SplitIntoBlocks(markdown);

        var inlineParser = new InlineParser();
        var header = new HeaderBlockHandler(inlineParser);
        var code = new CodeBlockHandler(inlineParser);
        var alert = new AlertBlockHandler(inlineParser);
        var table = new TableBlockHandler(inlineParser);
        var list = new ListBlockHandler(inlineParser);
        var paragraph = new ParagraphBlockHandler(inlineParser);

        header.SetNext(code).SetNext(alert).SetNext(table).SetNext(list).SetNext(paragraph);
        var result = blocks.Select(block => header.Handle(block));

        return SanitizationHelper.Sanitize(string.Join("\n", result));
    }

    private IEnumerable<string> SplitIntoBlocks(string markdown)
    {
        var lines = markdown.Split('\n');
        var blocks = new List<string>();
        var currentBlock = new List<string>();
        bool insideCodeBlock = false;

        foreach (var line in lines)
        {
            if (line.TrimStart().StartsWith("```"))
                insideCodeBlock = !insideCodeBlock;

            if (currentBlock.Count == 0)
            {
                currentBlock.Add(line);
                continue;
            }

            bool isEmpty = string.IsNullOrWhiteSpace(line) && !insideCodeBlock;
            bool typeChanged = !insideCodeBlock &&
                               DetectLineType(line) != DetectLineType(currentBlock[0]);

            if (isEmpty || typeChanged)
            {
                if (currentBlock.Any(l => !string.IsNullOrWhiteSpace(l)))
                    blocks.Add(string.Join('\n', currentBlock));
                currentBlock.Clear();
            }

            if (!isEmpty)
                currentBlock.Add(line);
        }

        if (currentBlock.Count > 0)
            blocks.Add(string.Join('\n', currentBlock));

        return blocks;
    }

    private string DetectLineType(string line)
    {
        if (line.StartsWith('#')) return "header";
        if (line.StartsWith('|')) return "table";
        if (line.StartsWith("- ") || line.StartsWith("* ")) return "list";
        if (line.StartsWith("> ")) return "alert";
        if (line.StartsWith("```")) return "code";
        return "paragraph";
    }
}