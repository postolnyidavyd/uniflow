import { fullMonthNames } from '../../utils/monthNames.js';
import styled from 'styled-components';
import ArrowLeft from '../../assets/Arrow Left.svg?react';
import PlusIcon from "../../assets/Plus.svg?react"
import ArrowRight from '../../assets/Arrow Right.svg?react';
import Button from '../ui/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { openCreateOptionsModal } from '../../store/uiSlice.js';
import { selectUserRole } from '../../store/selectors/authSelector.js';

export const CalendarHeader = ({ year, month, onPrev, onNext }) => {
  const role = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const handleAddEvent =() => dispatch(openCreateOptionsModal());
  return (
    <Container>
      {role ==="Headman" && <Button size="sm" onClick={handleAddEvent}><PlusIcon/>Додати подію</Button>}
      <ArrowLeft onClick={onPrev} />
      <DateDisplay>
        {fullMonthNames[month]} {year}
      </DateDisplay>
      <ArrowRight onClick={onNext} />
    </Container>
  );
};

const DateDisplay = styled.span`
  display: inline-block;
  min-width: 140px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;
const Container = styled.div`
  display: flex;
  padding-right: 0.375rem;
  justify-content: flex-end;
  align-items: center;
  gap: 0.25rem;
  align-self: stretch;

  font-size: var(--desktop-headings-h7);
  svg {
    cursor: pointer;

    path {
      fill: var(--base-black);
      transition: fill 0.2s ease;
    }

    &:hover {
      path {
        fill: var(--grey-100);
      }
    }
  }
`;
