using System.Xml.Schema;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Services.Settings;

namespace Services.Photo;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(config.Value.CloudName,config.Value.ApiKey, config.Value.ApiSecret );

        _cloudinary = new Cloudinary(account);
    }
    public async Task<string> UploadImageAsync(IFormFile file)
    {
        if(file.Length == 0) return null;
        
        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(file.FileName, stream)
        };
        
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        return uploadResult.SecureUrl.ToString();
    }
}