using Domain.Enums;

namespace Domain.Models;

public class QueueEntry
{
    public Guid Id {get;set;}

    public int EffectiveWeight { get; set; } // 100,50,10,0
    public DateTime JoinedAt { get; set; }

    public bool UsedToken { get; set; }

    public EntryType EntryType { get; set; }
    public Guid QueueSessionId { get; set; }
    public QueueSession? QueueSession { get; set; }
    
    public Guid UserId {get;set;}
    public User? User{get;set;}
}