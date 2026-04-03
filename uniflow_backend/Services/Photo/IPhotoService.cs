using Microsoft.AspNetCore.Http;

namespace Services.Photo;

public interface IPhotoService
{
    Task<string> UploadImageAsync(IFormFile file);
}