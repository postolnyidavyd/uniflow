import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';
import { useGetMonthlyCalendarQuery } from '../../store/api/calendarApi.js';
import styled from 'styled-components';
import { CalendarHeader } from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';
import { openCalendarDayPanel } from '../../store/uiSlice.js';

const addMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1);
const subMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);

const CalendarSection = () => {
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data, isLoading } = useGetMonthlyCalendarQuery({
    year,
    month: month + 1,
  });

  const handleDayCellClick = useCallback(
    (date, items) => dispatch(openCalendarDayPanel({ date, items })),
    [dispatch]
  );
  return (
    <SectionWrapper>
      <CalendarHeader
        year={year}
        month={month}
        onPrev={() => setCurrentDate((d) => subMonth(d))}
        onNext={() => setCurrentDate((d) => addMonth(d))}
      />
      <CalendarGrid
        calendarItems={data}
        year={year}
        month={month}
        onDayClick={handleDayCellClick}
      />
    </SectionWrapper>
  );
};
const SectionWrapper = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  min-height: 0;
    
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
`;

export default CalendarSection;
