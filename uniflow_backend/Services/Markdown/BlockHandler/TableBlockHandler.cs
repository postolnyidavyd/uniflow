using System.Text;
using System.Text.RegularExpressions;

namespace Services.Markdown.BlockHandler;

public class TableBlockHandler : BaseBlockHandler
{
    public TableBlockHandler(InlineParser inlineParser) : base(inlineParser) { }
    
        public override string? Handle(string block)
        {
            if(!block.TrimStart().StartsWith("|"))
                return base.Handle(block);
            var htmlContentBuilder = new StringBuilder();
            

            var lines = block.Split("\n");
            
            //Заголовок
            htmlContentBuilder.AppendLine("<table>");
            htmlContentBuilder.AppendLine("<thead>");
            htmlContentBuilder.AppendLine("<tr>");
            
            var firstLineContent = lines[0].Split('|');
            for (int i = 1; i < firstLineContent.Length - 1; i++)
            {
                var parsedContent = InlineParser.Parse(firstLineContent[i].Trim());
                htmlContentBuilder.AppendLine($"<th>{parsedContent}</th>");
            }
            
            htmlContentBuilder.AppendLine("</tr>");
            htmlContentBuilder.AppendLine("</thead>");
            
            //Основний контент
            //Пропускаємо 2 рядок бо в md це розділювач
            htmlContentBuilder.AppendLine("<tbody>");
            for (int i = 2; i < lines.Length; i++)
            {
                htmlContentBuilder.AppendLine("<tr>");
                
                var linesContent = lines[i].Split('|');
                for (int j = 1; j < linesContent.Length - 1; j++)
                {
                    var parsedContent = InlineParser.Parse(linesContent[j].Trim());
                    htmlContentBuilder.AppendLine($"<td>{linesContent[j]}</td>");
                }
                
                htmlContentBuilder.AppendLine("</tr>");
            }

            htmlContentBuilder.AppendLine("</tbody>");
            htmlContentBuilder.AppendLine("</table>");

            return htmlContentBuilder.ToString();
        }
}