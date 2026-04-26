namespace Services.Markdown;

public interface IMarkdownParser
{
    string Parse(string markdown);
}