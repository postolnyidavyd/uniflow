import styled from 'styled-components';
import {
  calendarItemFormattingBackgroundColor,
  calendarItemFormattingColor,
} from '../../utils/calendarItemFormatting.js';

const currentItem = [
  {
    id: '1',
    calendarItemType: 'Event',
    subjectName: 'Математика',
    shortTitle: 'Алг',
    isSubscribed: true,
  },
  {
    id: '2',
    calendarItemType: 'Queue',
    subjectName: 'КН',
    shortTitle: 'Проєкт',
    isSubscribed: true,
  },
  {
    id: '3',
    calendarItemType: 'Deadline',
    subjectName: 'Фізика',
    shortTitle: 'Модуль',
    isSubscribed: true,
  },
  {
    id: '4',
    calendarItemType: 'Deadline',
    subjectName: 'Історія',
    shortTitle: 'Есе',
    isSubscribed: true,
  },
];

const CalendarDayCell = ({ date, isCurrentMonth, items, isToday, onClick }) => {
  const handleClick = () => {
    if (!isCurrentMonth) return;
    onClick(date, items);
  };

  // Беремо твій масив
  const eventsToRender = currentItem || [];
  const totalEvents = eventsToRender.length;

  // ✨ Розумний ліміт: якщо подій 3 або менше - показуємо всі.
  // Якщо 4 і більше - показуємо лише 2, щоб залишити місце для напису "Ще X"
  const maxVisible = totalEvents <= 3 ? totalEvents : 2;

  // Відрізаємо потрібну кількість
  const visibleEvents = eventsToRender.slice(0, maxVisible);

  // Рахуємо, скільки залишилося
  const hiddenEventsCount = totalEvents - maxVisible;

  return (
    <DayCell
      onClick={handleClick}
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
    >
      <DateBadge $isToday={isToday}>{+date.slice(-2)}</DateBadge>

      {isCurrentMonth && (
        <>
          {visibleEvents.map((item) => (
            <EventContainer
              key={item.id}
              $backgroundColor={
                calendarItemFormattingBackgroundColor[item.calendarItemType]
              }
              $color={calendarItemFormattingColor[item.calendarItemType]}
            >
              <span>
                {item.subjectName} - {item.shortTitle}
              </span>
              {item.isSubscribed && (
                <SubscribedDot
                  $color={calendarItemFormattingColor[item.calendarItemType]}
                />
              )}
            </EventContainer>
          ))}

          {hiddenEventsCount > 0 && (
            <MoreEventsBadge>Ще {hiddenEventsCount}</MoreEventsBadge>
          )}
        </>
      )}
    </DayCell>
  );
};


const SubscribedDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ $color }) =>
    $color || calendarItemFormattingColor.Deadline};
  flex-shrink: 0;
  margin-left: 0.25rem;
`;

const EventContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 0.25rem;
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || calendarItemFormattingBackgroundColor.Deadline};
  border-left: 0.125rem solid
    ${({ $color }) => $color || calendarItemFormattingColor.Deadline};
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DateBadge = styled.p`
  color: ${({ $isToday }) =>
    $isToday ? 'var(--accent-color)' : 'var(--base-black)'};
  font-size: var(--desktop-headings-h9);
  font-weight: 500;
  line-height: 1.2;
`;


const MoreEventsBadge = styled.div`
  align-self: stretch;
  
  background-color: var(--base-very-bright-grey, #f1f5f9);
  color: var(--grey-100, #6b7280);

  font-size: 0.75rem;
  font-weight: 500;
  
  padding: 0.125rem 0.375rem;
  margin-top: 0.125rem; 
  
  border-radius: 0.25rem;
  
  user-select: none;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  align-items: flex-start;
  justify-content: flex-start;

  border-radius: 0.5rem;
  border: ${({ $isCurrentMonth }) =>
    $isCurrentMonth
      ? '1.901px solid var(--base-bright-grey, #e7eef3)'
      : '1.901px solid var(--gray-100)'};
  
  outline: ${({ $isToday }) =>
    $isToday ? '2px solid var(--accent-color)' : '2px solid transparent'};
  
  transition: outline 0.2s ease, background-color 0.2s ease;

  padding: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  
  &:hover {
    outline: ${({ $isToday }) =>
      $isToday
        ? '2px solid var(--accent-color)'
        : '2px solid var(--grey-40, #cbd5e1)'};
    
    background-color:#f8fafc;
  }
`;

export default CalendarDayCell;
