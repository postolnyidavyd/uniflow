using Hubs.Clients;
using Microsoft.AspNetCore.SignalR;

namespace Hubs.Hubs;

public class QueueHub : Hub<IQueueClient>
{
    public async Task JoinSessionGroup(Guid sessionId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());

    public async Task LeaveSessionGroup(Guid sessionId) =>
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId.ToString());
}