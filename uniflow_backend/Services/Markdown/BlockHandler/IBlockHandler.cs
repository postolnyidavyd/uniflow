namespace Services.Markdown.BlockHandler;

public interface IBlockHandler
{
        IBlockHandler SetNext(IBlockHandler handler);
        string? Handle(string block);
}