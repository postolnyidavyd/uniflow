import { useMemo } from 'react';
import { buildCalendarCells } from '../../utils/buildCalendarCells.js';
import styled from 'styled-components';
import { fullWeekDays } from '../../utils/daysNames.js';
import CalendarDayCell from './CalendarDayCell.jsx';
import { CalendarDaySkeleton } from '../ui/skeletons/CalendarDaySkeleton.jsx';

const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarGrid = ({ calendarItems = [], year, month, onDayClick, isLoading }) => {
  const calendarItemsMap = useMemo(() => {
    return calendarItems.reduce((acc, event) => {
      const dateKey = event.startTime.substring(0, 10);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [calendarItems]);

  const calendarCells = useMemo(() => {
    return buildCalendarCells(year, month, calendarItemsMap);
  }, [year, month, calendarItemsMap]);

  const rowsCount = calendarCells.length / 7;

  const today = getTodayISO();

  return (
    <GridWrapper>
      <Grid $rows={rowsCount}>
        {fullWeekDays.map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {isLoading
          ? calendarCells.map((cell) => (
              <CalendarDaySkeleton key={cell.date} />
            ))
          : calendarCells.map((cell) => (
              <CalendarDayCell
                key={cell.date}
                onClick={onDayClick}
                date={cell.date}
                isCurrentMonth={cell.currentMonth}
                items={cell.items}
                isToday={cell.date === today}
              />
            ))}
      </Grid>
    </GridWrapper>
  );
};
const GridWrapper = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 0 0.375rem 0.375rem;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;

  grid-template-columns: repeat(7, 1fr);

  /* шапка по контенту, інші ділять висоту порівну */
  grid-template-rows: auto repeat(${(props) => props.$rows}, 1fr);

  gap: 0.25rem;
`;

const DayHeader = styled.div`
  text-align: center;
  padding-left: 0.5rem;
  color: var(--base-black);
  font-size: var(--desktop-headings-h8);
  padding-bottom: 0.5rem;
`;

export default CalendarGrid;
