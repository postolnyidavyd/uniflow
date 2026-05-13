import styled from 'styled-components';
import {
  calendarItemFormattingBackgroundColor,
  calendarItemFormattingColor,
} from '../../utils/calendarItemFormatting.js';

const currentItem = [
  {
    id: '1',
    calendarItemType: 'Event',
    subjectShortName: 'Математика',
    itemShortTitle: 'Алг',
    isSubscribed: true,
    startTime: '2026-05-09T10:00:00.000Z',
    location: 'Ауд. 101',
  },
  {
    id: '2',
    calendarItemType: 'Queue',
    subjectShortName: 'КН',
    itemShortTitle: 'Проєкт',
    isSubscribed: true,
    startTime: '2026-05-09T13:30:00.000Z',
    meetUrl: 'https://meet.example.com/kn-project',
  },
  {
    id: '3',
    calendarItemType: 'Deadline',
    subjectShortName: 'Фізика',
    itemShortTitle: 'Модуль',
    isSubscribed: true,
    startTime: '2026-05-10T23:59:00.000Z',
    location: 'Онлайн',
    meetUrl: 'https://meet.example.com/physics-module',
  },
  {
    id: '4',
    calendarItemType: 'Deadline',
    subjectShortName: 'Історія',
    itemShortTitle: 'Есе',
    isSubscribed: true,
    startTime: '2026-05-11T17:00:00.000Z',
  },
];

const CalendarDayCell = ({ date, isCurrentMonth, items, isToday, onClick }) => {
  const handleClick = () => {
    if (!isCurrentMonth) return;
    onClick(date, items);
  };

  const totalEvents = items.length;

  const maxVisible = totalEvents <= 3 ? totalEvents : 2;

  const visibleEvents = items.slice(0, maxVisible);
  const hiddenEventsCount = totalEvents - maxVisible;

  return (
    <DayCell
      onClick={handleClick}
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
    >
      <DateBadge $isToday={isToday} $isCurrentMonth={isCurrentMonth}>
        {+date.slice(-2)}
      </DateBadge>

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
                {item.subjectShortName} - {item.itemShortTitle}
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
  color: ${({ $isToday, $isCurrentMonth }) =>
    $isToday
      ? 'var(--accent-color)'
      : $isCurrentMonth
        ? 'var(--base-black)'
        : 'var(--grey-100)'};
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
      : '1.901px solid var(--base-very-bright-grey)'};

  outline: ${({ $isToday }) =>
    $isToday ? '2px solid var(--accent-color)' : '2px solid transparent'};

  transition:
    outline 0.2s ease,
    background-color 0.2s ease;

  padding: 0.5rem;
  overflow: hidden;
  cursor: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'pointer' : 'default')};

  &:hover {
    outline: ${({ $isToday }) =>
      $isToday
        ? '2px solid var(--accent-color)'
        : '2px solid var(--grey-40, #cbd5e1)'};

    background-color: #f8fafc;
  }
`;

export default CalendarDayCell;
