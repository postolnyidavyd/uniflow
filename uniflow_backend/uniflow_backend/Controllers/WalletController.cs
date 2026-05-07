using Microsoft.AspNetCore.Mvc;
using Services.Wallet;

namespace uniflow_backend.Controllers;

[ApiController]
[Route("api/wallet")]
public class WalletController : RequireAuthController
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance()
    {
        var userId = GetUserId();
        return Ok(await _walletService.GetBalanceAsync(userId));
    }
}