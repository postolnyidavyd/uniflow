using System.Text.RegularExpressions;

namespace Services.Markdown;

public static class SanitizationHelper
{
    private static readonly HashSet<string> AllowedTags = new HashSet<string>
    {
        "table", "thead", "tbody", "tfoot", "tr", "th", "td",
        "p", "br", "strong", "em", "b", "i", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "pre", "code",
        "del",
        "a",
        "div", "span",
    };

    private static readonly HashSet<string> AllowedAttributes = new HashSet<string>
    {
        "class", "align", "scope", "colspan", "rowspan",
        "href", "target", "rel"
    };

    public static string Sanitize(string html)
    {
        if (string.IsNullOrEmpty(html)) return "";

        string pattern = @"<(/?)(\w+)([^>]*)>";

        return Regex.Replace(html, pattern, m =>
        {
            string tagName = m.Groups[2].Value.ToLower();

            if (!AllowedTags.Contains(tagName))
                return "";

            bool isClosingTag = m.Groups[1].Value == "/";
            if (isClosingTag)
                return $"</{tagName}>";

            // Очищуємо атрибути
            string attributesRaw = m.Groups[3].Value;
            string cleanAttributes = SanitizeAttributes(attributesRaw);

            return $"<{tagName}{cleanAttributes}>";
        });
    }

    private static string SanitizeAttributes(string attributesRaw)
    {
        string attrPattern = @"(\w+)\s*=\s*[""']([^""']*)[""']";
        var matches = Regex.Matches(attributesRaw, attrPattern);

        var cleanAttrs = matches.Cast<Match>()
            .Select(m => new
            {
                Name = m.Groups[1].Value.ToLower(),
                Value = m.Groups[2].Value
            })
            // Залишаємо лише дозволені атрибути, перевіряємо на XSS в значеннях, перевіряємо посилання
            .Where(a => AllowedAttributes.Contains(a.Name) &&
                        !IsXssValue(a.Value) &&
                        !(a.Name == "href" && !a.Value.StartsWith("http://") && !a.Value.StartsWith("https://")));

        string result = string.Join(" ", cleanAttrs);
        return string.IsNullOrEmpty(result) ? "" : " " + result;
    }

    private static bool IsXssValue(string value)
    {
        string lowerValue = value.ToLower();
        return lowerValue.Contains("javascript:") ||
               lowerValue.Contains("vbscript:") ||
               lowerValue.Contains("data:") ||
               lowerValue.Contains("expression(");
    }
}