import styled from 'styled-components';
import { useEffect } from 'react';
import {
  calendarItemFormattingBackgroundColor,
  calendarItemFormattingColor,
} from '../../utils/calendarItemFormatting.js';
import { selectCalendarDayPanel } from '../../store/selectors/uiSelector.js';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import {
  closeCalendarDayPanel,
  openCreateOptionsModal,
  openEventDetailModal,
  openQueueDetailModal,
} from '../../store/uiSlice.js';
import {
  formatDateTitle,
  getDayOfWeek,
  getTimeFromISO,
} from '../../utils/ISODateParser.js';
import CloseLG from '../../assets/Close_LG.svg?react';
import Button from '../ui/Button.jsx';
import PlusIcon from '../../assets/Plus.svg?react';
import { selectUserRole } from '../../store/selectors/authSelector.js';

const DayDetailsDrawer = () => {
  const { isOpen, date, items } = useSelector(selectCalendarDayPanel);
  const role = useSelector(selectUserRole);
  const dispatch = useDispatch();

  const formattedDate = formatDateTitle(date);
  const dayOfWeek = getDayOfWeek(date);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const handleClose = () => dispatch(closeCalendarDayPanel());
  const handleEventCardClick = (calendarItemType, id) => {
    handleClose();

    if (calendarItemType === 'Queue') {
      dispatch(openQueueDetailModal(id));
    } else {
      dispatch(openEventDetailModal(id));
    }
  };
  const handleAddEventClick = () => {
    handleClose();
    dispatch(openCreateOptionsModal());
  };
  if (!isOpen) return null;

  return createPortal(
    <>
      <Overlay onClick={handleClose} />

      <DrawerPanel>
        <Header>
          <DateContainer>
            <DateTitle>{formattedDate}</DateTitle>
            <DayOfWeek>{dayOfWeek}</DayOfWeek>
          </DateContainer>
          <CloseButton onClick={handleClose}>
            <CloseLG />
          </CloseButton>
        </Header>

        <ItemsList>
          {items.map((item) => (
            <EventRow
              key={item.id}
              onClick={() =>
                handleEventCardClick(item.calendarItemType, item.id)
              }
            >
              <TimeBlock>{getTimeFromISO(item.startTime) || 'XX:XX'}</TimeBlock>

              <EventDetailsCard
                $bgColor={
                  calendarItemFormattingBackgroundColor[item.calendarItemType]
                }
                $borderColor={calendarItemFormattingColor[item.calendarItemType]}
              >
                <EventTitle>
                  {item.subjectShortName} - {item.itemShortTitle}
                </EventTitle>

                {item.meetUrl ? (
                  <EventUrl
                    href={item.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {item.meetUrl}
                  </EventUrl>
                ) : (
                  <EventLocation>{item.location}</EventLocation>
                )}
              </EventDetailsCard>
            </EventRow>
          ))}
        </ItemsList>

        {role === 'Headman' && (
          <ButtonContainer>
            <Button onClick={handleAddEventClick}>
              <PlusIcon width="1rem" height="1rem" /> Додати
            </Button>
          </ButtonContainer>
        )}
      </DrawerPanel>
    </>,
    document.getElementById('modal')
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  animation: fadeIn 0.3s ease;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1000; /* Має бути вище за все інше */

  backdrop-filter: blur(1px);
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DrawerPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;

  width: 27.375rem;
  height: 100dvh;

  background-color: var(--base-white, #ffffff);
  z-index: 1001; /* Вище за оверлей */

  padding: 0.75rem;
  gap: 0.75rem;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* Виносимо скролбар до краю панелі, зберігаючи внутрішні відступи */
  margin: 0 -0.75rem;
  padding: 0 0.75rem;

  /* Кастомний скролбар */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--grey-40, #d5d5d5);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--grey-60, #bfbfbf);
  }
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;
const DateTitle = styled.h2`
  color: var(--base-black);

  /* Desktop/Headings/H2 */
  font-size: 2.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.5rem; /* 105.263% */
`;

const DayOfWeek = styled.span`
  color: var(--base-secondary-text, #6b6b6b);
  font-size: var(--desktop-headings-h6);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 180ms ease;

  &:hover {
    background-color: var(--grey-20, #f5f5f5);
    color: var(--base-secondary-text);
  }
`;

const EventRow = styled.div`
  display: flex;
  padding-left: 0.375rem;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  align-self: stretch;

  cursor: pointer;

  border-radius: 0.5rem; /* Щоб хавер не був гострим */
  transition: background-color 180ms ease;

  &:hover {
    background-color: var(
      --base-bright-grey,
      #f8fafc
    ); /* Або твій дуже світло-сірий */
  }
`;

const TimeBlock = styled.div`
  width: 3.125rem;
  color: var(--base-black, #000);
  text-align: center;

  font-size: var(--desktop-headings-h7);
`;

const EventDetailsCard = styled.div`
  flex: 1 0 0;
  background-color: ${({ $bgColor }) =>
    $bgColor || calendarItemFormattingBackgroundColor.Deadline};
  border-left: 0.5rem solid
    ${({ $borderColor }) =>
      $borderColor || calendarItemFormattingColor.Deadline};
  //gap: 0.25rem;
  padding: 0.375rem 0.375rem;
`;

const EventTitle = styled.h4`
  color: var(--base-black, #000);

  /* Desktop/Headings/H7 */
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.02rem;
`;

const EventLocation = styled.p`
  color: var(--base-secondary-text, #6b6b6b);

  /* Desktop/Headings/H9 */
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 133.333% */
  letter-spacing: -0.015rem;
`;
const EventUrl = styled.a`
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem;
  letter-spacing: -0.015rem;

  color: var(--base-secondary-text, #6b6b6b);

  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;

  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: color 180ms ease;

  &:hover {
    color: var(--radiance-80);
  }
`;
const ButtonContainer = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;

  & > button {
    width: 100%;
    justify-content: center;
  }
`;
export default DayDetailsDrawer;
