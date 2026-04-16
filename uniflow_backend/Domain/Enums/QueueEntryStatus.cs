namespace Domain.Enums;

public enum QueueEntryStatus
{
    Waiting,    // Студент чекає в черзі (за замовчуванням)
    InProgress, // Студент прямо зараз відповідає / здає роботу
    Completed,  // Успішно здав і вийшов з черги
    Cancelled    // Скасував свій запис або його кікнув староста
}