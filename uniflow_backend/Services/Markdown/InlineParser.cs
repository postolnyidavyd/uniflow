using System.Text.RegularExpressions;

namespace Services.Markdown;

public class InlineParser
{
    public string Parse(string content)
    {
        var codeBlocks = new List<string>();
        
        content = Regex.Replace(content, @"`([^`]+)`", match =>
        {
            codeBlocks.Add($"<code>{match.Groups[1].Value}</code>");
            return $"%%CODE_{codeBlocks.Count - 1}%%"; // плейсхолдер
        }); 
        
        // вони не торкнуться %%CODE_0%% бо не знають такого патерну
        content = ParseBold(content);
        content = ParseCursive(content);
        content = ParseStrikethrough(content);
        content = ParseUrl(content);
        for (int i = 0; i < codeBlocks.Count; i++)
            content = content.Replace($"%%CODE_{i}%%", codeBlocks[i]);
        
        return content;
    }

    private string ParseBold(string content)
    {
        string pattern = @"\*\*(.*?)\*\*";
        return Regex.Replace(content, pattern, match =>
            $"<strong>{match.Groups[1].Value}</strong>");
    }
    private string ParseCursive(string content)
    {
        string pattern = @"\*(.*?)\*";
        return Regex.Replace(content, pattern, match =>
            $"<em>{match.Groups[1].Value}</em>");
    }
    private string ParseStrikethrough(string content)
    {
        string pattern = @"\~\~(.*?)\~\~";
        return Regex.Replace(content, pattern, match =>
            $"<del>{match.Groups[1].Value}</del>");
    }
    private string ParseUrl(string content)
    {
        string pattern = @"\[([^\]]+)\]\(([^)]+)\)";
        return Regex.Replace(content, pattern, match =>
        {
            var url = match.Groups[2].Value;
            
            bool isHttp = url.StartsWith("http://", StringComparison.OrdinalIgnoreCase);
            bool isHttps = url.StartsWith("https://", StringComparison.OrdinalIgnoreCase);

            if (!isHttp && !isHttps)
            {
                // Якщо це не http/https посилання повертаємо просто текст
                return match.Groups[1].Value; 
            }

            return $"<a href=\"{url}\" target=\"_blank\" rel=\"noopener noreferrer\">{match.Groups[1].Value}</a>";
        });
    }
    
}